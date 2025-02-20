#!/usr/bin/env node

// Copyright 2024 The HuggingFace Inc. team. All rights reserved.
//
// Licensed under the Apache License, Version 2.0 (the "License");
// you may not use this file except in compliance with the License.
// You may obtain a copy of the License at
//
//     http://www.apache.org/licenses/LICENSE-2.0
//
// Unless required by applicable law or agreed to in writing, software
// distributed under the License is distributed on an "AS IS" BASIS,
// WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
// See the License for the specific language governing permissions and
// limitations under the License.

import Mustache from "mustache";
import chalk from "chalk";


import { handle_agent_output_types } from "./agent_types";
import { ActionStep, AgentMemory, PlanningStep, SystemPromptStep, TaskStep, ToolCall } from "./memory";
import { type ChatMessage, MessageRole } from "./models";
import { AgentLogger, LogLevel, Monitor, type StepLog, type Agent } from "./monitoring";
import { Tool, TOOL_MAPPING, FinalAnswerTool } from "./tools";
import { AgentError, AgentExecutionError, AgentGenerationError, AgentMaxStepsError, AgentParsingError } from "./utils";
import { ChatMessageImpl } from "./models";
import { LocalPythonInterpreter, E2BExecutor, BASE_BUILTIN_MODULES } from "./python";
import systemPrompt from "./prompts/toolcalling_agent";

const YELLOW_HEX = "#FFD700";

const logger = console;

interface PlanningPromptTemplate {
  initial_facts: string;
  initial_plan: string;
  update_facts_pre_messages: string;
  update_facts_post_messages: string;
  update_plan_pre_messages: string;
  update_plan_post_messages: string;
}

interface ManagedAgentPromptTemplate {
  task: string;
  report: string;
}

interface FinalAnswerPromptTemplate {
  pre_messages: string;
  post_messages: string;
}

interface PromptTemplates {
  system_prompt: string;
  planning: PlanningPromptTemplate;
  managed_agent: ManagedAgentPromptTemplate;
  final_answer: FinalAnswerPromptTemplate;
}

const EMPTY_PROMPT_TEMPLATES: PromptTemplates = {
  system_prompt: "",
  planning: {
    initial_facts: "",
    initial_plan: "",
    update_facts_pre_messages: "",
    update_facts_post_messages: "",
    update_plan_pre_messages: "",
    update_plan_post_messages: "",
  },
  managed_agent: {
    task: "",
    report: "",
  },
  final_answer: {
    pre_messages: "",
    post_messages: "",
  },
};

interface AgentConfig {
  prompt_templates?: PromptTemplates;
  max_steps?: number;
  verbosity_level?: LogLevel;
  planning_interval?: number;
  kwargs?: Record<string, any>;
  add_base_tools?: boolean;
  name?: string;
  description?: string;
  provide_run_summary?: boolean;
  managed_agents?: any[];
  final_answer_checks?: ((answer: any, memory: AgentMemory) => boolean)[];
  step_callbacks?: ((step: ActionStep, _agent?: MultiStepAgent) => void)[];
  grammar?: Record<string, string>;
  model_id?: string;
  max_print_outputs_length?: number;
  use_e2b_executor?: boolean;
  additional_authorized_imports?: string[];
  authorized_imports?: string[];
  onStreamResponse?: (stream: any) => void;
}

class MultiStepAgent implements Agent {
  private agent_name: string;
  public model: { model_id: string };
  protected modelFn: (messages: ChatMessage[]) => Promise<ChatMessage>;
  protected prompt_templates: PromptTemplates;
  private max_steps: number;
  private step_number = 0;
  private tool_parser: (output: string) => any;
  private grammar: Record<string, string> | null;
  private planning_interval: number | null;
  protected state: Record<string, any> = {};
  private name: string | null;
  private _description: string | null;
  private provide_run_summary: boolean;
  public managed_agents: Record<string, any> = {};
  public tools: Record<string, Tool> = {};
  private system_prompt: string;
  protected input_messages: ChatMessage[] | null = null;
  private task: string | null = null;
  protected memory: AgentMemory;
  protected logger: AgentLogger;
  private monitor: Monitor;
  private step_callbacks: ((step: ActionStep, _agent?: MultiStepAgent) => void)[];
  private final_answer_checks: ((answer: any, memory: AgentMemory) => boolean)[] | null;
  public additional_authorized_imports: string[];
  public authorized_imports: string[];
  protected onStreamResponse: (stream: any) => void;

  constructor(
    tools: Tool[],
    modelFn: (messages: ChatMessage[]) => Promise<ChatMessage>,
    config: AgentConfig
  ) {
    this.modelFn = modelFn;
    this.model = { model_id: config.model_id || "" };
    this.tool_parser = this.parse_json_tool_call;
    this.agent_name = this.constructor.name;
    this.prompt_templates = config.prompt_templates || EMPTY_PROMPT_TEMPLATES;
    this.max_steps = config.max_steps || 6;
    this.grammar = config.grammar || null;
    this.planning_interval = config.planning_interval || null;
    this.name = config.name || null;
    this._description = config.description || null;
    this.provide_run_summary = config.provide_run_summary || false;
    this.additional_authorized_imports = config.additional_authorized_imports || [];
    this.authorized_imports = config.authorized_imports || [];
    this.onStreamResponse = config.onStreamResponse || (() => {});
    if (config.managed_agents) {
      for (const managed_agent of config.managed_agents) {
        if (!managed_agent.name || !managed_agent.description) {
          throw new Error("All managed agents need both a name and a description!");
        }
      }
      this.managed_agents = config.managed_agents.reduce(
        (acc, agent) => {
          acc[agent.name] = agent;
          return acc;
        },
        {} as Record<string, any>,
      );
    }

    for (const tool of tools) {
      if (!(tool instanceof Tool)) {
        throw new Error(`This element is not of class Tool: ${tool}`);
      }
    }
    this.tools = tools.reduce(
      (acc, tool) => {
        acc[tool.name] = tool;
        return acc;
      },
      {} as Record<string, Tool>,
    );

    if (config.add_base_tools) {
      for (const [toolName, toolClass] of Object.entries(TOOL_MAPPING)) {
        if (toolName !== "python_interpreter" || this.constructor.name === "ToolCallingAgent") {
          this.tools[toolName] = new (toolClass as new () => Tool)();
        }
      }
    }
    this.tools["final_answer"] = new FinalAnswerTool();

    this.system_prompt = this.initialize_system_prompt();
    this.memory = new AgentMemory(this.system_prompt);
    this.memory.systemPrompt = new SystemPromptStep(this.system_prompt);
    this.logger = new AgentLogger(config.verbosity_level || LogLevel.INFO);
    this.monitor = new Monitor(this.modelFn, this.logger);
    this.step_callbacks = config.step_callbacks || [];
    this.step_callbacks.push((step: ActionStep, _agent?: MultiStepAgent) => {
      if (step.duration !== null) {
        this.monitor.updateMetrics(step as unknown as StepLog);
      }
    });
    this.final_answer_checks = config.final_answer_checks || null;
  }

  init() {

  }

  private parse_json_tool_call(output: string): any {
    try {
      return JSON.parse(output);
    } catch (e) {
      throw new AgentParsingError(`Error parsing JSON tool call: ${e}`);
    }
  }

  protected initialize_system_prompt(): string {
    // To be implemented in child classes
    return "";
  }

  protected write_memory_to_messages(summary_mode = false): ChatMessage[] {
    const messages = this.memory.systemPrompt.toMessages({ summaryMode: summary_mode }) as ChatMessage[];
    for (const memory_step of this.memory.steps) {
      messages.push(...(memory_step.toMessages({ summaryMode: summary_mode }) as ChatMessage[]));
    }
    return messages;
  }

  private visualize(): void {
    // this.logger.visualizeAgentTree(this);
  }

  private extract_action(model_output: string, split_token: string): [string, string] {
    try {
      const split = model_output.split(split_token);
      const rationale = split[split.length - 2].trim();
      const action = split[split.length - 1].trim();
      return [rationale, action];
    } catch (e) {
      throw new AgentParsingError(
        `No '${split_token}' token provided in your output.\nYour output:\n${model_output}\n. Be sure to include an action, prefaced with '${split_token}'!`,
      );
    }
  }

  private async provide_final_answer(task: string, images?: string[]): Promise<string> {
    const messages: ChatMessage[] = [
      new ChatMessageImpl(
        MessageRole.SYSTEM,
        [
          {
            type: "text",
            text: this.prompt_templates.final_answer.pre_messages,
          },
        ]
      ),
    ];
    if (images) {
      const content = messages[0].content;
      if (typeof content === 'string') {
        messages[0].content = [{ type: 'text', text: content }];
      }
      (messages[0].content as Array<{type: string; text: string}>).push({ type: "image", text: "" });
    }
    messages.push(...this.write_memory_to_messages().slice(1));
    messages.push(new ChatMessageImpl(
      MessageRole.USER,
      [
        {
          type: "text",
          text: this.populate_template(this.prompt_templates.final_answer.post_messages, { task }),
        },
      ]
    ));
    try {
      const chatMessage: ChatMessage = await this.modelFn(messages);
      const content = typeof chatMessage.content === 'string'
        ? chatMessage.content
        : chatMessage.content?.map((c: { text: string }) => c.text).join('') || '';
      return content;
    } catch (e) {
      return `Error in generating final LLM output:\n${(e as Error).toString()}`;
    }
  }

   protected async execute_tool_call(tool_name: string, toolArgs: Record<string, any> | string): Promise<any> {
    const available_tools = { ...this.tools, ...this.managed_agents };


    if (!available_tools[tool_name]) {
      throw new AgentExecutionError(
        `Unknown tool ${tool_name}, should be instead one of ${Object.keys(available_tools)}.`,
      );
    }

    try {
      if (typeof toolArgs === "string") {
        if (tool_name in this.managed_agents) {
          return await available_tools[tool_name].execute(toolArgs, tool_name);
        }
        return await available_tools[tool_name].execute(toolArgs, tool_name);
      }

      for (const key in toolArgs) {
        if (typeof toolArgs[key] === "string" && this.state[toolArgs[key]]) {
          toolArgs[key] = this.state[toolArgs[key]];
        }
      }
      if (tool_name in this.managed_agents) {
        return await available_tools[tool_name].execute(toolArgs, tool_name);
      }
      const args = toolArgs;        

      return await available_tools[tool_name].execute(args, tool_name);
    } catch (e) {
      if (tool_name in this.tools) {
        const tool = this.tools[tool_name];
        throw new AgentExecutionError(
          `Error when executing tool ${tool_name} with arguments ${toolArgs}: ${e}\nYou should only use this tool with a correct input.\n` +
            `As a reminder, this tool's description is the following: '${tool.description}'.\nIt takes inputs: ${tool.inputs} and returns output type ${tool.output_type}`,
        );
      }
      if (tool_name in this.managed_agents) {
        throw new AgentExecutionError(
          `Error in calling team member: ${e}\nYou should only ask this team member with a correct request.\n` +
            `As a reminder, this team member's description is the following:\n${available_tools[tool_name]}`,
        );
      }
    }
  }

  protected async step(memory_step: ActionStep): Promise<any> {
    // To be implemented in children classes. Should return either null if the step is not final.
    return null;
  }

  public async run(
    task: string,
    stream = false,
    reset = true,
    images?: string[],
    kwargs?: Record<string, any>
  ): Promise<any> {
    if (reset) {
      this.memory.reset();
    }
    this.task = task;
    this.memory.steps.push(new TaskStep(task, images));

    if (stream) {
      return this._run(this.task, images);
    }
    const generator = this._run(this.task, images);
    const steps = [];
    for await (const step of generator) {
      steps.push(step);
    }
    return steps[steps.length - 1];
  }

  private async *_run(task: string, images?: string[]): AsyncGenerator<ActionStep | any, void, unknown> {
    let final_answer = null;
    let step_start_time = Date.now();
    this.step_number = 1;
    while (final_answer === null && this.step_number <= this.max_steps) {
      step_start_time = Date.now();
      const memory_step = new ActionStep();
      memory_step.stepNumber = this.step_number;
      memory_step.startTime = step_start_time;
      memory_step.observationsImages = images || null;

      try {
        if (this.planning_interval && this.step_number % this.planning_interval === 1) {
          this.planning_step(task, this.step_number === 1, this.step_number);
        }

        // Run one step!
        final_answer = await this.step(memory_step);


        if (final_answer !== null && this.final_answer_checks) {
          for (const check_function of this.final_answer_checks) {
            try {
              if (!check_function(final_answer, this.memory)) {
                final_answer = null;
                throw new AgentError(`Check ${check_function.name} failed.`);
              }
            } catch (e) {
              final_answer = null;
              throw new AgentError(`Check ${check_function.name} failed with error: ${e}`);
            }
          }
        }
      } catch (e) {
        memory_step.error = e as AgentError;
      } finally {
        memory_step.endTime = Date.now();
        memory_step.duration = memory_step.endTime - step_start_time;
        this.memory.steps.push(memory_step);
        for (const callback of this.step_callbacks) {
          callback(memory_step, this);
        }
        this.step_number++;
        yield memory_step;
      }
    }


    if (final_answer === null && this.step_number === this.max_steps + 1) {
      const error_message = "Reached max steps.";
      final_answer = this.provide_final_answer(task, images);
      const final_memory_step = new ActionStep();
      final_memory_step.stepNumber = this.step_number;
      final_memory_step.error = new AgentMaxStepsError(error_message);
      final_memory_step.actionOutput = final_answer;
      final_memory_step.endTime = Date.now();
      final_memory_step.duration = final_memory_step.endTime - step_start_time;
      this.memory.steps.push(final_memory_step);
      for (const callback of this.step_callbacks) {
        callback(final_memory_step, this);
      }
      yield final_memory_step;
    }

    yield handle_agent_output_types(final_answer);
  }

  private async planning_step(task: string, is_first_step: boolean, step: number): Promise<void> {
    if (is_first_step) {
      const message_prompt_facts: ChatMessage = new ChatMessageImpl(
        MessageRole.SYSTEM,
        [
          {
            type: "text",
            text: this.prompt_templates.planning.initial_facts,
          },
        ]
      );
      const message_prompt_task: ChatMessage = new ChatMessageImpl(
        MessageRole.USER,
        [
          {
            type: "text",
            text: `\nHere is the task:\n\`\`\`\n${task}\n\`\`\`\nNow begin!`,
          },
        ]
      );
      const input_messages = [message_prompt_facts, message_prompt_task];

      const chat_message_facts: ChatMessage = await this.modelFn(input_messages);
      const answer_facts = chat_message_facts.content;

      const message_prompt_plan: ChatMessage = new ChatMessageImpl(
        MessageRole.USER,
        [
          {
            type: "text",
            text: this.populate_template(this.prompt_templates.planning.initial_plan, {
              task,
              tools: this.tools,
              managed_agents: this.managed_agents,
              answer_facts,
            }),
          },
        ]
      );
      const chat_message_plan: ChatMessage = await this.modelFn(
        [message_prompt_plan]
      );
      const answer_plan = chat_message_plan.content;

      const final_plan_redaction = `
Here is the plan of action that I will follow to solve the task:
\`\`\`
${answer_plan}
\`\`\``;
      const final_facts_redaction = `
Here are the facts that I know so far:
\`\`\`
${answer_facts}
\`\`\``.trim();
      this.memory.steps.push(
        new PlanningStep(
          input_messages,
          chat_message_facts,
          final_facts_redaction,
          chat_message_plan,
          final_plan_redaction
        ),
      );
      this.logger.log(
        LogLevel.INFO,
        `Initial plan:\n${final_plan_redaction}`
      );
    } else {
      const memory_messages = this.write_memory_to_messages().slice(1);

      const facts_update_pre_messages: ChatMessage = new ChatMessageImpl(
        MessageRole.SYSTEM,
        [
          {
            type: "text",
            text: this.prompt_templates.planning.update_facts_pre_messages,
          },
        ]
      );
      const facts_update_post_messages: ChatMessage = new ChatMessageImpl(
        MessageRole.USER,
        [
          {
            type: "text",
            text: this.prompt_templates.planning.update_facts_post_messages,
          },
        ]
      );
      const input_messages = [facts_update_pre_messages, ...memory_messages, facts_update_post_messages];
      const chat_message_facts: ChatMessage = await this.modelFn(input_messages);
      const facts_update = chat_message_facts.content;


      const update_plan_pre_messages: ChatMessage = new ChatMessageImpl(
        MessageRole.SYSTEM,
        [
          {
            type: "text",
            text: this.populate_template(this.prompt_templates.planning.update_plan_pre_messages, { task }),
          },
        ]
      );
      const update_plan_post_messages: ChatMessage = new ChatMessageImpl(
        MessageRole.USER,
        [
          {
            type: "text",
            text: this.populate_template(this.prompt_templates.planning.update_plan_post_messages, {
              task,
              tools: this.tools,
              managed_agents: this.managed_agents,
              facts_update,
              remaining_steps: this.max_steps - step,
            }),
          },
        ]
      );
      const chat_message_plan: ChatMessage = await this.modelFn(
        [update_plan_pre_messages, ...memory_messages, update_plan_post_messages]
      );

      const final_plan_redaction = `
I still need to solve the task I was given:
\`\`\`
${task}
\`\`\`

Here is my new/updated plan of action to solve the task:
\`\`\`
${chat_message_plan.content}
\`\`\``;

      const final_facts_redaction = `
Here is the updated list of the facts that I know:
\`\`\`
${facts_update}
\`\`\``;
      this.memory.steps.push(
        new PlanningStep(
          input_messages,
          chat_message_facts,
          final_facts_redaction,
          chat_message_plan,
          final_plan_redaction
        ),
      );
      this.logger.log(
        LogLevel.INFO,
        `Updated plan:\n${final_plan_redaction}`
      );
    }
  }

  public replay(detailed = false): void {
    this.memory.replay(this.logger, detailed as any);
  }

  public async call(task: string, kwargs: Record<string, any>): Promise<string> {
    const full_task = this.populate_template(this.prompt_templates.managed_agent.task, { name: this.name, task });
    const generator = await this.run(full_task, false, true, undefined, kwargs);
    const steps = [];
    for await (const step of generator) {
      steps.push(step);
    }
    const report = steps[steps.length - 1];
    let answer = this.populate_template(this.prompt_templates.managed_agent.report, {
      name: this.name,
      final_answer: report,
    });
    if (this.provide_run_summary) {
      answer += "\n\nFor more detail, find below a summary of this agent's work:\n<summary_of_work>\n";
      for (const message of this.write_memory_to_messages(true) as any[]) {
        const content = typeof message.content === 'string' 
          ? message.content 
          : message.content?.map((c: { text: string }) => c.text).join('');
        answer += "\n" + this.truncate_content(content.toString()) + "\n---";
      }
      answer += "\n</summary_of_work>";
    }
    return answer;
  }

  protected populate_template(template: string, variables: Record<string, any>): string {
    if (variables.tools) {
      variables.tools = Object.entries(variables.tools).map(([name, tool]) => ({
        name,
        description: (tool as Tool).description,
        inputs: JSON.stringify((tool as Tool).inputs, null, 2).replace(/"/g, '\'').replace(/\n/g, ' '),
        output_type: (tool as Tool).output_type.toString()
      }));
    }
    
    try {
      return Mustache.render(template, variables, {}, {
        escape: function (value) {
          return value;
        }
      });
    } catch (e) {
      throw new Error(`Error during template rendering: ${(e as Error).constructor.name}: ${e}`);
    }
  }

  protected truncate_content(content: string, max_length = 1000): string {
    return content.length > max_length ? content.slice(0, max_length) + "..." : content;
  }

  get description(): string | undefined {
    return this._description || undefined;
  }

  protected fix_final_answer_code(code: string): string {
    // If there's no final_answer() call or no direct assignment to final_answer,
    // return the code unchanged to avoid hazardous modifications
    const hasFinalAnswerCall = code.includes('final_answer(');
    const hasDirectAssignment = /(?<!\.)(?<!\w)\bfinal_answer\s*=/.test(code);
    
    if (!hasFinalAnswerCall || !hasDirectAssignment) {
      return code;
    }

    // Replace variable assignments to final_answer with final_answer_variable
    code = code.replace(
      /(?<!\.)(?<!\w)(\bfinal_answer)(\s*=)/g, 
      'final_answer_variable$2'
    );

    // Replace variable usage (but not function calls) with final_answer_variable
    code = code.replace(
      /(?<!\.)(?<!\w)(\bfinal_answer\b)(?!\s*\()/g,
      'final_answer_variable'
    );
    return code;
  }
}

export class ToolCallingAgent extends MultiStepAgent {
  constructor(
    tools: Tool[],
    modelFn: (messages: ChatMessage[]) => Promise<ChatMessage>,
    config: AgentConfig
  ) {
    config.prompt_templates =
    config.prompt_templates || systemPrompt;
    super(tools, modelFn, config);
  }

  protected initialize_system_prompt(): string {
    return this.populate_template(this.prompt_templates.system_prompt, {
      tools: this.tools,
      managed_agents: this.managed_agents,
    });
  }

  protected async step(memory_step: ActionStep): Promise<any> {
    const memory_messages = this.write_memory_to_messages();
    this.input_messages = memory_messages;
    memory_step.modelInputMessages = [...memory_messages];

    try {
      // Get model response
      const model_message: ChatMessage = await this.modelFn(memory_messages);
      memory_step.modelOutputMessage = model_message;

      // Validate tool calls
      if (!model_message.tool_calls || model_message.tool_calls.length === 0) {
        throw new Error("Model did not call any tools. Call `final_answer` tool to return a final answer.");
      }

      // Extract tool call info
      const tool_call = model_message.tool_calls[0];
      const tool_name = tool_call.function.name;
      const tool_call_id = tool_call.id;

      const tool_arguments = typeof tool_call.function.arguments === 'string' 
      ? JSON.parse(tool_call.function.arguments)
      : tool_call.function.arguments;
      // Record tool call in memory
      memory_step.toolCalls = [new ToolCall(tool_name, tool_arguments, tool_call_id)];
      this.logger.log(LogLevel.INFO, `Calling tool: '${tool_name}' with arguments: ${JSON.stringify(tool_arguments)}`);

      // Handle final answer tool
      if (tool_name === "final_answer") {
        let answer;
        if (typeof tool_arguments === "object" && "answer" in tool_arguments) {
          answer = tool_arguments.answer;
        } else {
          answer = tool_arguments;
        }

        // Check if answer is a state variable
        if (typeof answer === "string" && answer in this.state) {
          const final_answer = this.state[answer];
          this.logger.log(
            LogLevel.INFO,
            `Final answer: Extracting key '${answer}' from state to return value '${final_answer}'.`
          );
          memory_step.actionOutput = final_answer;
          return final_answer;
        }

        this.onStreamResponse({
          event: "message",
          data: `\n Final answer: ${answer}` ,
          stream: true
        });

        this.logger.log(LogLevel.INFO, chalk.bold.hex(YELLOW_HEX)(`Final answer: ${answer}`));
        memory_step.actionOutput = answer;
        return answer;
      }



      // Execute tool and handle observation
      const observation = await this.execute_tool_call(tool_name, tool_arguments || {});
      const observation_type = observation?.constructor?.name;

      // Handle special observation types
      if (observation_type === "AgentImage" || observation_type === "AgentAudio") {
        const observation_name = observation_type === "AgentImage" ? "image.png" : "audio.mp3";
        this.state[observation_name] = observation;
        const updated_information = `Stored '${observation_name}' in memory.`;
        this.logger.log(LogLevel.INFO, `Observations: ${updated_information.replace("[", "|")}`);
        memory_step.observations = updated_information;
      } else {
        // Handle standard observations
        const updated_information = (typeof observation === 'string' 
          ? observation 
          : Array.isArray(observation) 
            ? observation.map((c: { text: string }) => c.text).join('') 
            : String(observation)
        ).trim();
        
        this.logger.log(LogLevel.INFO, `Observations: ${updated_information.replace("[", "|")}`);
        memory_step.observations = updated_information;
      }


      return null;

    } catch (e) {
      throw new AgentGenerationError(`Error in generating tool call with model:\n${(e as Error).toString()}`);
    }
  }
}

export class CodeAgent extends MultiStepAgent {
  private python_executor: LocalPythonInterpreter | E2BExecutor;

  constructor(
    tools: Tool[],
    modelFn: (messages: ChatMessage[]) => Promise<ChatMessage>,
    config: AgentConfig
  ) {
    const _additional_authorized_imports = config.additional_authorized_imports || [];
    const _authorized_imports = [...new Set([...BASE_BUILTIN_MODULES, ..._additional_authorized_imports])];
    config.prompt_templates =
      config.prompt_templates || systemPrompt;

    super(
      tools,
      modelFn,
      config,
    );


    this.additional_authorized_imports = _additional_authorized_imports;
    this.authorized_imports = _authorized_imports;

    const all_tools = { ...this.tools, ...this.managed_agents };
    if (config.use_e2b_executor) {
      this.python_executor = new E2BExecutor(this.additional_authorized_imports, Object.values(all_tools), this.logger);
    } else {
      this.python_executor = new LocalPythonInterpreter(
        this.additional_authorized_imports,
        all_tools,
        config.max_print_outputs_length,
      );
    }

    if (this.additional_authorized_imports.includes("*")) {
      this.logger.log(
        LogLevel.INFO,
        "Caution: you set an authorization for all imports, meaning your agent can decide to import any package it deems necessary. This might raise issues if the package is not installed in your environment."
      );
    }
  }

  protected initialize_system_prompt(): string {
    return this.populate_template(this.prompt_templates.system_prompt, {
      tools: this.tools,
      managed_agents: this.managed_agents,
      authorized_imports: this.additional_authorized_imports.includes("*")
        ? "You can import from any package you want."
        : this.authorized_imports.join(", "),
    });
  }

  protected async step(memory_step: ActionStep): Promise<any> {
    const memory_messages = this.write_memory_to_messages();

    this.input_messages = [...memory_messages];

    memory_step.modelInputMessages = [...memory_messages];
    try {
      const chat_message: ChatMessage = await this.modelFn(memory_messages);
      memory_step.modelOutputMessage = chat_message;
      const model_output = typeof chat_message.content === 'string' 
        ? chat_message.content 
        : chat_message.content?.map((c: { text: string }) => c.text).join('') || '';
      memory_step.modelOutput = model_output;


      this.logger.logMarkdown(LogLevel.DEBUG, model_output, "Output message of the LLM:");

      const code_action = this.fix_final_answer_code(this.parse_code_blobs(model_output));


      memory_step.toolCalls = [new ToolCall("javascript_interpreter", code_action, `call_${this.memory.steps.length}`)];

      this.logger.logCode(LogLevel.INFO, "Executing parsed code:", code_action);
      const is_final_answer = false;
      try {

        const [output, execution_logs, is_final_answer] = await this.python_executor.call(code_action, this.state);
        const execution_outputs_console = [];
        if (execution_logs.length > 0) {
          execution_outputs_console.push(`Execution logs:\n${execution_logs}`);
        }
        let observation = "Execution logs:\n" + execution_logs;
        const truncated_output = this.truncate_content((output || "").toString());
        observation += "Last output from code snippet:\n" + truncated_output;
        memory_step.observations = observation;

        execution_outputs_console.push(
          `${is_final_answer ? "Out - Final answer" : "Out"}: ${truncated_output}`
        );
        this.logger.log(LogLevel.INFO, execution_outputs_console.join('\n'));
        memory_step.actionOutput = output;
        return is_final_answer ? output : null;
      } catch (e) {
        if (this.python_executor.state && this.python_executor.state["_print_outputs"]) {
          const execution_logs = this.python_executor.state["_print_outputs"].toString();
          if (execution_logs.length > 0) {
            const execution_outputs_console = [`Execution logs:\n${execution_logs}`];
            memory_step.observations = "Execution logs:\n" + execution_logs;
            this.logger.log(LogLevel.INFO, execution_outputs_console.join('\n'));
          }
        }
        const error_msg = (e as Error).toString();
        if (error_msg.includes("Import of ") && error_msg.includes(" is not allowed")) {
          this.logger.log(
            LogLevel.INFO,
            "Warning to user: Code execution failed due to an unauthorized import - Consider passing said import under `additional_authorized_imports` when initializing your CodeAgent.",
          );
        }
        throw new AgentExecutionError(error_msg);
      }
    } catch (e) {
      throw new AgentGenerationError(`Error in generating model output:\n${(e as Error).toString()}`);
    }
  }

  private parse_code_blobs(output: string): string {
    // Pattern to match code blocks with optional language identifier
    const pattern = /```(?:js|javascript)?\n(.*?)\n```/gs;
    const matches = Array.from(output.matchAll(pattern));

    if (matches.length === 0) {
      // Check if the output might be direct code
      try {
        // Basic syntax check by looking for common JavaScript syntax errors
        new Function(output);
        return output;
      } catch (e) {
        // If syntax check fails, provide helpful error messages
        if (output.toLowerCase().includes("final") && output.toLowerCase().includes("answer")) {
          throw new AgentParsingError(`
Your code snippet is invalid, because the regex pattern ${pattern} was not found in it.
Here is your code snippet:
${output}
It seems like you're trying to return the final answer, you can do it as follows:
Code:
\`\`\`javascript
final_answer("YOUR FINAL ANSWER HERE")
\`\`\`
`);
        }
        
        throw new AgentParsingError(`
Your code snippet is invalid, because the regex pattern ${pattern} was not found in it.
Here is your code snippet:
${output}
Make sure to include code with the correct pattern, for instance:
Thoughts: Your thoughts
Code:
\`\`\`javascript
// Your JavaScript code here
\`\`\`
`);
      }
    }

    // Join all code blocks with double newlines between them
    return matches
      .map(match => match[1].trim())
      .join('\n\n');
  }
}
