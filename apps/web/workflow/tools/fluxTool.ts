import { ServiceFactory } from "@/workflow/ai/services/service-factory";
import type { ToolResult } from "../types";
import { BaseTool } from "./baseTool";

export class FLUXTool extends BaseTool {
  async execute(input: {
    prompt: string;
    modelName?: string;
    params?: {
      negative_prompt?: string;
      image_size?: string;
      batch_size?: number;
      seed?: number;
      num_inference_steps?: number;
      guidance_scale?: number;
    };
  }): Promise<ToolResult<string>> {
    const aiService = ServiceFactory.getInstance().getAIService();
    const result: any = await aiService.generateImage("flux", input.prompt);

    const imgUrl = result.images[0].url;

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
