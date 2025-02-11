import { ServiceFactory } from "@/workflow/ai/services/service-factory";
import { getFormatMessage, getProviderFromModel } from "../ai/config/model-configs";
import type { DocNode, ProcessingContext } from "../types/DocNode";
import { BaseHandler } from "./BaseHandler";

export class GenerationHandler extends BaseHandler {
  async handle(node: DocNode, context: ProcessingContext): Promise<void> {
    // Skip if already executed and not waiting for input
    if (node._state?.executed && !node._state?.waitingForInput) {
      return;
    }

    if (context.markdown.join("").trim() !== "") {
      const prompt = context.markdown.join("\n");
      context.messages.push({
        type: "text",
        text: prompt,
      });
    }

    const provider = getProviderFromModel(node.attrs.model);

    const messages = await getFormatMessage(context.messages, node.attrs.model);
    // Store result in node state
    const service = new ServiceFactory(context.apiKey);
    const aiService = service.getAIService();
    const text = await aiService.streamChat(
      provider,
      [
        {
          role: "user",
          content: messages,
        },
      ],
      async (text) => {
        await this.emitStream(context, "message", text, true, true);
      },
      node.attrs.model,
      {},
      context.workspaceId,
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
