import { ServiceFactory } from "@/workflow/ai/services/service-factory";
import type { ToolResult } from "../../types";
import { BaseTool } from "../baseTool";
import { voices } from "./voices";

export class TextToSpeechTool extends BaseTool {
  async execute(
    input: {
      text: string;
      voiceId?: string;
    },
    node: any,
  ): Promise<ToolResult<any>> {
    const voiceId = input.voiceId || voices[0].voice_id;

    const service = new ServiceFactory();
    const aiService = service.getAIService();
    const result = await aiService.textToSpeech("elevenlabs", input.text, "eleven_turbo_v2_5", {
      voice_id: voiceId,
    });
    this.context.onStreamResponse({
      event: "message",
      data: `​
<audio id="audio" controls="" preload="none">
      <source id="mp3" src="${result.output}">
</audio>`,
      stream: true,
    });

    this.context.variables.set(node.attrs.id, {
      id: node.attrs.id,
      type: "tool",
      value: {
        output: result.output,
      },
    });

    return {
      type: "text-to-speech",
      content: result.output,
      timestamp: Date.now(),
    };
  }

  async validate(input: any): Promise<boolean> {
    return typeof input === "object" && typeof input.text === "string";
  }
}
