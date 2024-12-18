import { ServiceFactory } from "@/workflow/ai/services/service-factory";
import type { ToolResult } from "../types";
import { BaseTool } from "./baseTool";

export class FLUXTool extends BaseTool {
  async execute(input: {
    prompt: string;
    model?: string;
    aspect_ratio?: string;
  }): Promise<ToolResult<string>> {
    const aiService = ServiceFactory.getInstance().getAIService();

    const result = await aiService.generateImage("flux", input.prompt, input.model, {
      aspect_ratio: input.aspect_ratio,
    });

    const imgUrl = result.output;

    this.context.onStreamResponse({
      event: "message",
      data: `\n ![Generated Image](${imgUrl})`,
      stream: true,
    });

    return {
      type: "image",
      content: imgUrl,
      timestamp: Date.now(),
    };
  }

  async validate(input: any): Promise<boolean> {
    return typeof input === "object" && typeof input.prompt === "string";
  }
}
