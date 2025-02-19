// TypeScript Code

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

import { Console } from "console";
import chalk from "chalk";
import { Table } from "console-table-printer";

// Enums
export enum LogLevel {
  OFF = -1, // No output
  ERROR = 0, // Only errors
  INFO = 1, // Normal output (default)
  DEBUG = 2, // Detailed output
}

const YELLOW_HEX = "#d4b702";

// Interfaces
interface StepLog {
  duration: number;
}

interface Tool {
  description: string;
  inputs: Record<string, { type?: string; optional?: boolean; description?: string }>;
}

interface Agent {
  model: { model_id: string };
  tools: Record<string, Tool>;
  managed_agents?: Record<string, Agent>;
  additional_authorized_imports?: string[];
  description?: string;
}

// Monitor class
export class Monitor {
  private stepDurations: number[] = [];
  private trackedModel: any;
  private logger: AgentLogger;
  private totalInputTokenCount = 0;
  private totalOutputTokenCount = 0;

  constructor(trackedModel: any, logger: AgentLogger) {
    this.trackedModel = trackedModel;
    this.logger = logger;

    if ("last_input_token_count" in this.trackedModel) {
      this.totalInputTokenCount = 0;
      this.totalOutputTokenCount = 0;
    }
  }

  getTotalTokenCounts(): { input: number; output: number } {
    return {
      input: this.totalInputTokenCount,
      output: this.totalOutputTokenCount,
    };
  }

  reset(): void {
    this.stepDurations = [];
    this.totalInputTokenCount = 0;
    this.totalOutputTokenCount = 0;
  }

  updateMetrics(stepLog: StepLog): void {
    const stepDuration = stepLog.duration;
    this.stepDurations.push(stepDuration);

    let consoleOutputs = `[Step ${this.stepDurations.length - 1}: Duration ${stepDuration.toFixed(2)} seconds`;

    if ("last_input_token_count" in this.trackedModel) {
      this.totalInputTokenCount += this.trackedModel.last_input_token_count;
      this.totalOutputTokenCount += this.trackedModel.last_output_token_count;
      consoleOutputs += ` | Input tokens: ${this.totalInputTokenCount.toLocaleString()} | Output tokens: ${this.totalOutputTokenCount.toLocaleString()}`;
    }

    consoleOutputs += "]";
    this.logger.log(LogLevel.INFO, consoleOutputs);
  }
}

// AgentLogger class
export class AgentLogger {
  private level: LogLevel;
  private console: Console;

  constructor(level: LogLevel = LogLevel.INFO) {
    this.level = level;
    this.console = new Console(process.stdout, process.stderr);
  }

  log(level: LogLevel, message: string): void {
    if (level <= this.level) {
      this.console.log(message);
    }
  }

  logMarkdown(level: LogLevel, content: string, title?: string, style: string = YELLOW_HEX): void {
    if (level <= this.level) {
      const styledTitle = title ? chalk.hex(style).bold(title) : "";
      this.console.log(`${styledTitle}\n${content}`);
    }
  }

  logCode(level: LogLevel, title: string, content: string): void {
    if (level <= this.level) {
      this.console.log(chalk.bold(title) + "\n" + chalk.green(content));
    }
  }

  logRule(level: LogLevel, title: string): void {
    if (level <= this.level) {
      const rule = "━".repeat(50);
      this.console.log(chalk.hex(YELLOW_HEX).bold(`${title}\n${rule}`));
    }
  }

  logTask(level: LogLevel, task: string, modelName: string, name?: string): void {
    if (level <= this.level) {
      this.console.log(chalk.hex(YELLOW_HEX).bold(`[${name || "New run"} - ${modelName}]\n${task}`));
    }
  }

  logMessages(messages: any[]): void {
    const messagesAsString = messages.map((message) => JSON.stringify(message, null, 4)).join("\n");
    this.console.log(messagesAsString);
  }

  visualizeAgentTree(agent: Agent): void {
    const createToolsSection = (toolsDict: Record<string, Tool>) => {
      const table = new Table();

      Object.keys(toolsDict).forEach((key) => {
        const tool = toolsDict[key];
        const args = Object.entries(tool.inputs || {}).map(
          ([argName, info]) =>
            `${argName} (${info.type || "Any"}${info.optional ? ", optional" : ""}): ${info.description || ""}`,
        );

        table.addRow({ Name: key, Description: tool.description, Arguments: args.join("\n") });
      });

      return table.render();
    };

    const getAgentHeadline = (agent: Agent, name?: string): string => {
      const nameHeadline = name ? `${name} | ` : "";
      return `${chalk.hex(YELLOW_HEX)(`${nameHeadline}${agent.constructor.name} | ${agent.model.model_id}`)}`;
    };

    const buildAgentTree = (parentTree: string[], agentObj: Agent): void => {
      parentTree.push(createToolsSection(agentObj.tools));

      if (agentObj.managed_agents) {
        const agentsBranch: string[] = [];
        parentTree.push("🤖 Managed agents:");
        Object.keys(agentObj.managed_agents).forEach((name) => {
          const managedAgent = agentObj.managed_agents![name];
          agentsBranch.push(getAgentHeadline(managedAgent, name));

          if (managedAgent.constructor.name === "CodeAgent") {
            agentsBranch.push(`✅ Authorized imports: ${managedAgent.additional_authorized_imports}`);
          }

          agentsBranch.push(`📝 Description: ${managedAgent.description}`);
          buildAgentTree(agentsBranch, managedAgent);
        });
      }
    };

    const mainTree: string[] = [getAgentHeadline(agent)];
    if (agent.constructor.name === "CodeAgent") {
      mainTree.push(`✅ Authorized imports: ${agent.additional_authorized_imports}`);
    }

    buildAgentTree(mainTree, agent);
    this.console.log(mainTree.join("\n"));
  }
}

export { Agent };
export type { StepLog };
