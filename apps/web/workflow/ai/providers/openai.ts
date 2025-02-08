import { ImageConfig } from "@/workflow/ai/config/flux-config";
import { put } from "@vercel/blob";
import OpenAI from "openai";
import { v4 as uuidv4 } from "uuid";
import type { ModelConfig } from "../config/model-configs";
import { BaseAIProvider, type Message } from "./base";

export class OpenAIProvider extends BaseAIProvider {
  private openai: OpenAI;

  constructor(apiKey: string, defaultModel: string, modelConfigs: Record<string, ModelConfig>) {
    super(apiKey, defaultModel, modelConfigs);
    this.openai = new OpenAI({
      apiKey: apiKey,
      baseURL: `${process.env.PRO_URL}/v1`,
    });
  }

  async generateText(prompt: string, modelName?: string, options?: Partial<ModelConfig>): Promise<string> {
    const config = this.getModelConfig(modelName, options);

    const completion = await this.openai.chat.completions.create({
      model: config.name,
      messages: [{ role: "user", content: prompt }],
      ...config,
    });

    return completion.choices[0].message.content || "";
  }

  async streamText(
    prompt: string,
    onText: (text: string) => void,
    modelName?: string,
    options?: Partial<ModelConfig>,
  ): Promise<string> {
    const config = this.getModelConfig(modelName, options);

    const stream = (await this.openai.chat.completions
      .create({
        model: config.name,
        messages: [{ role: "user", content: prompt }],
        stream: true,
        ...config,
      })
      .asResponse()) as any;

    let fullText = "";
    for await (const chunk of stream) {
      const content = chunk.choices[0]?.delta?.content || "";
      fullText += content;
      onText(content);
    }

    return fullText;
  }

  async generateChat(messages: Message[], modelName?: string, options?: Partial<ModelConfig>): Promise<string> {
    const config = this.getModelConfig(modelName, options);

    const completion = await this.openai.chat.completions.create({
      model: config.name,
      messages: messages,
      ...config,
    });

    return completion.choices[0].message.content || "";
  }

  async streamChat(
    messages: Message[],
    onText: (text: string) => void,
    modelName?: string,
    options?: Partial<ModelConfig>,
  ): Promise<string> {
    const config = this.getModelConfig(modelName, options);

    // if (config.name === "o1-mini") {
    //   paramsBody = {
    //     model: config.name,
    //     messages: messages,
    //     stream: true,
    //     max_completion_tokens: 65536,
    //   };
    // }

    let stream: any;

    if (config.name === "o1-mini") {
      stream = await this.openai.chat.completions.create({
        model: config.name,
        messages: messages,
        stream: true,
        max_completion_tokens: 65536,
      });
    } else if (config.name === "o3-mini") {
      const openai = new OpenAI({
        apiKey: process.env.OPENAI_API_KEY,
        baseURL: `${process.env.OPENAI_BASE_URL}`,
      });

      // @ts-ignore
      stream = await openai.chat.completions.create({
        model: "o3-mini",
        messages: messages,
        stream: true,
        max_completion_tokens: 100000,
        reasoning_effort: "high",
        store: true,
      });
    } else {
      stream = await this.openai.chat.completions.create({
        model: config.name,
        messages: messages,
        stream: true,
        max_tokens: 8192,
        temperature: 0.7,
      });
    }

    let fullText = "";
    for await (const chunk of stream) {
      const content = chunk.choices[0]?.delta?.content || "";
      fullText += content;
      onText(content);
    }

    return fullText;
  }

  async generateImage(prompt: string, modelName?: string, options?: Partial<ModelConfig>): Promise<any> {
    const config = ImageConfig.find((item) => item.model === modelName);

    const response = await this.openai.images.generate({
      model: config.model,
      prompt: prompt,
      size: (options?.aspect_ratio as any) || "1024x1024",
      response_format: "b64_json",
    });
    const b64Json = response.data[0].b64_json;
    if (!b64Json) throw new Error("Image generation failed: No b64_json received");
    const imageBuffer = Buffer.from(b64Json, "base64");
    // @ts-ignore
    const { url } = await put(`images/${uuidv4()}.png`, imageBuffer, {
      access: "public",
    });

    return { output: url };
  }
}
