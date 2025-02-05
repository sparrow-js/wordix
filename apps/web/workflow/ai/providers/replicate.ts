import OpenAI from "openai";
import { v4 as uuidv4 } from "uuid";
import type { ModelConfig } from "../config/model-configs";
import type { AIProvider } from "./base";

import { put } from "@vercel/blob";

export class ReplicateProvider implements AIProvider {
  private openai: OpenAI;

  constructor(apiKey: string, defaultModel: string, modelConfigs: Record<string, ModelConfig>) {
    this.openai = new OpenAI({
      apiKey: apiKey,
      baseURL: `${process.env.PRO_URL}/v1`,
    });
  }

  async generateImage(prompt: string, modelName?: string, options?: any): Promise<any> {
    try {
      const response = await this.openai.images.generate({
        model: modelName || "dall-e-3",
        prompt: prompt,
        n: options?.n || 1,
        size: options?.size || "1024x1024",
        quality: options?.quality || "standard",
        style: options?.style || "vivid",
        response_format: "b64_json",
      });

      const b64Json = response.data[0].b64_json;
      if (!b64Json) throw new Error("Image generation failed: No b64_json received");
      const imageBuffer = Buffer.from(b64Json.replace("data:image/png;base64,", ""), "base64");
      // @ts-ignore
      const { url } = await put(`images/${uuidv4()}.png`, imageBuffer, {
        access: "public",
      });

      return {
        output: url,
      };
    } catch (error) {
      console.error("Error generating image:", error);
      throw error;
    }
  }
}
