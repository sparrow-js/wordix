import { type ChatMessage, MessageRole } from "./models";
import type { AgentLogger } from "./monitoring";
import { LogLevel } from "./monitoring";
import { type AgentError, makeJsonSerializable } from "./utils";
import { type ChatMessage as ChatMessageModel } from './models';
import { ChatMessageImpl } from './models';

export type Message = ChatMessageModel;

export class ToolCall {
  name: string;
  arguments: any;
  id: string;

  constructor(name: string, args: any, id: string) {
    this.name = name;
    this.arguments = args;
    this.id = id;
  }

  dict() {
    return {
      id: this.id,
      type: "function",
      function: {
        name: this.name,
        arguments: makeJsonSerializable(this.arguments),
      },
    };
  }
}

export abstract class MemoryStep {
  abstract dict(): Record<string, any>;

  abstract toMessages(kwargs?: Record<string, any>): Array<Message>;
}

export class ActionStep extends MemoryStep {
  modelInputMessages: Array<Message> | null = null;
  toolCalls: Array<ToolCall> | null = null;
  startTime: number | null = null;
  endTime: number | null = null;
  stepNumber: number | null = null;
  error: AgentError | null = null;
  duration: number | null = null;
  modelOutputMessage: ChatMessage | null = null;
  modelOutput: string | null = null;
  observations: string | null = null;
  observationsImages: Array<string> | null = null;
  actionOutput: any = null;

  dict() {
    return {
      model_input_messages: this.modelInputMessages,
      tool_calls: this.toolCalls ? this.toolCalls.map((tc) => tc.dict()) : [],
      start_time: this.startTime,
      end_time: this.endTime,
      step: this.stepNumber,
      error: this.error ? this.error.dict() : null,
      duration: this.duration,
      model_output_message: this.modelOutputMessage,
      model_output: this.modelOutput,
      observations: this.observations,
      action_output: makeJsonSerializable(this.actionOutput),
    };
  }

  toMessages({
    summaryMode = false,
    showModelInputMessages = false,
  }: {
    summaryMode?: boolean;
    showModelInputMessages?: boolean;
  } = {}): Array<Message> {
    const messages: Array<Message> = [];

    if (this.modelInputMessages && showModelInputMessages) {
      messages.push(
        new ChatMessageImpl(
          MessageRole.SYSTEM,
          [{ type: "text", text: JSON.stringify(this.modelInputMessages) }]
        )
      );
    }

    if (this.modelOutput && !summaryMode) {
      messages.push(
        new ChatMessageImpl(
          MessageRole.ASSISTANT,
          [{ type: "text", text: this.modelOutput.trim() }]
        )
      );
    }

    if (this.toolCalls) {
      messages.push(
        new ChatMessageImpl(
          MessageRole.ASSISTANT,
          [{ type: "text", text: `Calling tools:\n${JSON.stringify(this.toolCalls.map((tc) => tc.dict()))}` }]
        )
      );
    }

    if (this.observations) {
      messages.push(
        new ChatMessageImpl(
          // MessageRole.TOOL_RESPONSE,
          MessageRole.USER,
          [{ type: "text", text: `Call id: ${this.toolCalls ? this.toolCalls[0].id : ""}\nObservation:\n${this.observations}` }]
        )
      );
    }

    if (this.error) {
      const errorMessage = `Error:\n${this.error}\nNow let's retry: take care not to repeat previous errors! If you have retried several times, try a completely different approach.\n`;
      let messageContent = this.toolCalls ? `Call id: ${this.toolCalls[0].id}\n` : "";
      messageContent += errorMessage;

      messages.push(
        new ChatMessageImpl(
          MessageRole.TOOL_RESPONSE,
          [{ type: "text", text: messageContent }]
        )
      );
    }

    if (this.observationsImages) {
      messages.push(
        new ChatMessageImpl(
          MessageRole.USER,
          [
            { type: "text", text: "Here are the observed images:" },
            ...this.observationsImages.map((image) => ({ type: "image", text: "", image }))
          ]
        )
      );
    }

    return messages;
  }
}

export class PlanningStep extends MemoryStep {
  modelInputMessages: Array<Message>;
  modelOutputMessageFacts: ChatMessage;
  facts: string;
  modelOutputMessagePlan: ChatMessage;
  plan: string;

  constructor(
    modelInputMessages: Array<Message>,
    modelOutputMessageFacts: ChatMessage,
    facts: string,
    modelOutputMessagePlan: ChatMessage,
    plan: string,
  ) {
    super();
    this.modelInputMessages = modelInputMessages;
    this.modelOutputMessageFacts = modelOutputMessageFacts;
    this.facts = facts;
    this.modelOutputMessagePlan = modelOutputMessagePlan;
    this.plan = plan;
  }

  dict(): Record<string, any> {
    return {
      model_input_messages: this.modelInputMessages,
      model_output_message_facts: this.modelOutputMessageFacts,
      facts: this.facts,
      model_output_message_plan: this.modelOutputMessagePlan,
      plan: this.plan
    };
  }

  toMessages({ summaryMode = false }: { summaryMode?: boolean } = {}): Array<Message> {
    const messages: Array<Message> = [
      new ChatMessageImpl(
        MessageRole.ASSISTANT,
        [{ type: "text", text: `[FACTS LIST]:\n${this.facts.trim()}` }]
      ),
    ];

    if (!summaryMode) {
      messages.push(
        new ChatMessageImpl(
          MessageRole.ASSISTANT,
          [{ type: "text", text: `[PLAN]:\n${this.plan.trim()}` }]
        )
      );
    }

    return messages;
  }
}

export class TaskStep extends MemoryStep {
  task: string;
  taskImages: Array<string> | null = null;

  constructor(task: string, taskImages: Array<string> | null = null) {
    super();
    this.task = task;
    this.taskImages = taskImages;
  }

  dict(): Record<string, any> {
    return {
      task: this.task,
      task_images: this.taskImages
    };
  }

  toMessages({ summaryMode = false }: { summaryMode?: boolean } = {}): Array<Message> {
    const content: Array<any> = [{ type: "text", text: `New task:\n${this.task}` }];

    if (this.taskImages) {
      for (const image of this.taskImages) {
        content.push({ type: "image", image });
      }
    }

    return [
      new ChatMessageImpl(
        MessageRole.USER,
        content
      )
    ];
  }
}

export class SystemPromptStep extends MemoryStep {
  systemPrompt: string;

  constructor(systemPrompt: string) {
    super();
    this.systemPrompt = systemPrompt;
  }

  dict(): Record<string, any> {
    return {
      system_prompt: this.systemPrompt
    };
  }

  toMessages({ summaryMode = false }: { summaryMode?: boolean } = {}): Array<Message> {
    if (summaryMode) {
      return [];
    }
    return [
      new ChatMessageImpl(
        MessageRole.SYSTEM,
        [{ type: "text", text: this.systemPrompt }]
      )
    ];
  }
}

class AgentMemory {
  systemPrompt: SystemPromptStep;
  steps: Array<TaskStep | ActionStep | PlanningStep>;

  constructor(systemPrompt: string) {
    this.systemPrompt = new SystemPromptStep(systemPrompt);
    this.steps = [];
  }

  reset() {
    this.steps = [];
  }

  getSuccinctSteps(): Array<Record<string, any>> {
    return this.steps.map((step) => {
      const dict = step.dict();
      delete dict.model_input_messages;
      return dict;
    });
  }

  getFullSteps(): Array<Record<string, any>> {
    return this.steps.map((step) => step.dict());
  }

  replay(logger: AgentLogger, detailed = false) {
    logger.log(LogLevel.INFO, "Replaying the agent's steps:");
    for (const step of this.steps) {
      if (step instanceof SystemPromptStep && detailed) {
        logger.logMarkdown(LogLevel.INFO, step.systemPrompt, "System prompt");
      } else if (step instanceof TaskStep) {
        logger.logTask(LogLevel.INFO, step.task, "", "2");
      } else if (step instanceof ActionStep) {
        logger.logRule(LogLevel.INFO, `Step ${step.stepNumber?.toString()}`);
        if (detailed && step.modelInputMessages) {
          logger.logMessages(step.modelInputMessages);
        }
        logger.logMarkdown(LogLevel.INFO, step.modelOutput || "", "Agent output:");
      } else if (step instanceof PlanningStep) {
        logger.logRule(LogLevel.INFO, "Planning step");
        if (detailed && step.modelInputMessages) {
          logger.logMessages(step.modelInputMessages);
        }
        logger.logMarkdown(LogLevel.INFO, step.facts + "\n" + step.plan, "Agent output:");
      }
    }
  }
}

export { AgentMemory };
