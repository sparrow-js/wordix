import type { AIProvider } from "./base";

export class FLUXProvider implements AIProvider {
  private apiKey: string;
  private baseUrl = "https://api.siliconflow.cn/v1"; // 请替换为实际的FLUX API地址

  constructor(apiKey: string) {
    this.apiKey = apiKey || "sk-hfdwkxomclfybhzpvhadsugyamjyefmvotrvfitispinxkiz";
  }

  async generateImage(
    prompt: string,
    modelName?: string,
    params?: {
      prompt: string;
      negative_prompt?: string;
      image_size?: string;
      batch_size?: number;
      seed?: number;
      num_inference_steps?: number;
      guidance_scale?: number;
    },
  ): Promise<any> {
    const requestBody = {
      model: modelName || "black-forest-labs/FLUX.1-dev",
      prompt: prompt,
      negative_prompt: "",
      image_size: "1024x1024",
      batch_size: 2,
      seed: 4999999999,
      num_inference_steps: 20,
      guidance_scale: 50,
    };

    try {
      const response = await fetch(`${this.baseUrl}/images/generations`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${this.apiKey}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify(requestBody),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      return await response.json();
    } catch (error) {
      console.error("Error generating image:", error);
      throw error;
    }
  }
}
