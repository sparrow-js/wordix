import { ServiceFactory } from "@/workflow/ai/services/service-factory";
import { getProviderFromModel } from "../ai/config/flux-config";
import type { DocNode, ProcessingContext } from "../types/DocNode";
import { BaseHandler } from "./BaseHandler";

export class ImageGenerationHandler extends BaseHandler {
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

    const service = new ServiceFactory(context.apiKey);
    const aiService = service.getAIService();
    const { output } = await aiService.generateImage(provider, context.markdown.join("\n"), node.attrs.model, {
      aspect_ratio: node.attrs.aspect_ratio,
    });

    node._state = {
      executed: true,
      timestamp: Date.now(),
      result: output,
    };

    // Store in variables
    context.variables.set(node.attrs.id, {
      id: node.attrs.id,
      type: "imageGeneration",
      value: output,
    });

    context.onStreamResponse({
      event: "message",
      data: `\n ![Generated Image](${output})`,
      stream: true,
    });

    // Clear markdown buffer after generation
    context.markdown = [];
  }

  async toMarkdown(node: DocNode, context: ProcessingContext): Promise<string> {
    return "";
  }
}
