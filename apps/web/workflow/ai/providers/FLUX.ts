import { ImageConfig } from "@/workflow/ai/config/flux-config";
import Replicate, { type Prediction } from "replicate";
import type { AIProvider } from "./base";

export class FLUXProvider implements AIProvider {
  private apiKey: string;
  private baseUrl = "https://api.siliconflow.cn/v1"; // 请替换为实际的FLUX API地址

  constructor(apiKey: string) {
    this.apiKey = apiKey || "sk-hfdwkxomclfybhzpvhadsugyamjyefmvotrvfitispinxkiz";
  }

  async generateImage(prompt: string, modelName?: string, params?: any): Promise<any> {
    const config = ImageConfig.find((item) => item.model === modelName);

    const replicate = new Replicate({
      auth: process.env.REPLICATE_API_TOKEN,
    });
    let outputImage = "";
    const input = {
      ...config.parameters,
      ...params,
      prompt,
    };

    function onProgress(prediction: Prediction) {
      outputImage = prediction.output;
    }

    await replicate.run(modelName as `${string}/${string}`, { input }, onProgress);
    return { output: outputImage };
  }
}
