import { ServiceFactory } from "@/workflow/ai/services/service-factory";
import type { ToolResult } from "../../types";
import { BaseTool } from "../baseTool";
import { META_PROMPT } from "./const";

export class PromptGenerationTool extends BaseTool {
  async execute(input: {
    prompt: string;
  }): Promise<ToolResult<string>> {
    const aiService = ServiceFactory.getInstance().getAIService();

    const text = await aiService.streamChat(
      "openai",
      [
        {
          role: "system",
          content: META_PROMPT,
        },
        {
          role: "user",
          content: "生成落地页",
        },
      ],
      async (text) => {
        this.context.onStreamResponse({
          event: "message",
          data: text,
          stream: true,
        });
      },
      "gpt-4o",
    );

    return {
      type: "text",
      content: text,
      timestamp: Date.now(),
    };
  }

  async validate(input: any): Promise<boolean> {
    return true;
  }
}
