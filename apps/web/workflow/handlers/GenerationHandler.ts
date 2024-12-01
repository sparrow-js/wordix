import { ServiceFactory } from "@/workflow/ai/services/service-factory";
import type { DocNode, ProcessingContext } from "../types/DocNode";
import { BaseHandler } from "./BaseHandler";

export class GenerationHandler extends BaseHandler {
  async handle(node: DocNode, context: ProcessingContext): Promise<void> {
    // Skip if already executed and not waiting for input
    if (node._state?.executed && !node._state?.waitingForInput) {
      return;
    }

    const prompt = context.markdown.join("\n\n");

    // Store result in node state
    const aiService = ServiceFactory.getInstance().getAIService();
    const text = await aiService.streamText(
      "openai",
      prompt,
      async (text) => {
        await this.emitStream(context, "message", text);
      },
      "gpt-4o",
    );

    node._state = {
      executed: true,
      timestamp: Date.now(),
      result: text,
    };

    // Store in variables
    context.variables.set(node.attrs.id, {
      id: node.attrs.id,
      type: "generation",
      value: text,
    });

    // Clear markdown buffer after generation
    context.markdown = [];
  }

  async toMarkdown(node: DocNode, context: ProcessingContext): Promise<string> {
    return "";
  }
}
