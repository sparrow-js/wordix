import type { DocNode, ProcessingContext } from "../types/DocNode";
import { BaseHandler } from "./BaseHandler";

export class InputsHandler extends BaseHandler {
  async handle(node: DocNode, context: ProcessingContext): Promise<void> {
    if (!node._state) {
      node._state = {
        executed: true,
        timestamp: Date.now(),
      };
    }

    if (context.inputData) {
      await this.processInputValues(node, context);
    } else {
      await this.registerInputVariables(node, context);
    }

    // const markdown = await this.toMarkdown(node, context);
    // await this.emitStream(context, "message", markdown);
  }

  private async processInputValues(node: DocNode, context: ProcessingContext): Promise<void> {
    const inputs = context.inputData;

    node.content?.forEach((inputNode) => {
      if (inputNode.type === "input") {
        const { id, ...attrs } = inputNode.attrs;

        context.variables.set(id, {
          id,
          ...attrs,
          type: "input",
          value: inputs[id],
        });

        // 发送输入处理状态
        // this.emitStream(context, "input_processed", { id, value: inputs[id] });
      }
    });
  }

  private async registerInputVariables(node: DocNode, context: ProcessingContext): Promise<void> {
    node.content?.forEach((inputNode) => {
      if (inputNode.type === "input") {
        const { id, ...attrs } = inputNode.attrs;

        context.variables.set(id, {
          id,
          ...attrs,
          type: "input",
          value: null,
        });

        // 发送输入注册状态
        // this.emitStream(context, "input_registered", { id });
      }
    });
  }

  async toMarkdown(node: DocNode, context: ProcessingContext): Promise<string> {
    if (!node.content) return "";

    const inputStrings = node.content.map((inputNode) => {
      if (inputNode.type === "input") {
        const { label, description, type } = inputNode.attrs;
        const variable = context.variables.get(inputNode.attrs.id);
        const value = variable?.value ? ` (Value: ${variable.value})` : "";
        return `Input: ${label}${value}\nDescription: ${description}\nType: ${type}`;
      }
      return "";
    });

    return inputStrings.filter(Boolean).join("\n\n");
  }
}
