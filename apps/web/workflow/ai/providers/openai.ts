import { ImageConfig } from "@/workflow/ai/config/flux-config";
import { createOpenAI } from "@ai-sdk/openai";
import { put } from "@vercel/blob";
import { type CoreMessage, experimental_generateImage as generateImage, generateText, streamText } from "ai";
import { v4 as uuidv4 } from "uuid";
import type { ModelConfig } from "../config/model-configs";
import { BaseAIProvider, type Message } from "./base";

export class OpenAIProvider extends BaseAIProvider {
  private openai = createOpenAI({
    apiKey: "sk-Yuxzg619EfPAnyd6rJ6el5xfQQzwFxI1HxS9vBfMC4bnqd2p",
    baseURL: "https://api.openai-proxy.org/v1",
  });

  constructor(apiKey: string, defaultModel: string, modelConfigs: Record<string, ModelConfig>) {
    super(apiKey, defaultModel, modelConfigs);
    console.log("OpenAIProvider constructor");
  }

  async generateText(prompt: string, modelName?: string, options?: Partial<ModelConfig>): Promise<string> {
    const config = this.getModelConfig(modelName, options);

    const { text } = await generateText({
      model: this.openai(config.name),
      prompt,
      ...config,
    });

    return text;
  }

  async streamText(
    prompt: string,
    onText: (text: string) => void,
    modelName?: string,
    options?: Partial<ModelConfig>,
  ): Promise<string> {
    const config = this.getModelConfig(modelName, options);

    const result = await streamText({
      model: this.openai(config.name),
      prompt,
      ...config,
    });

    for await (const textPart of result.textStream) {
      onText(textPart);
    }

    return result.text;
  }

  async generateChat(messages: Message[], modelName?: string, options?: Partial<ModelConfig>): Promise<string> {
    const config = this.getModelConfig(modelName, options);
    const coreMessages = messages as CoreMessage[];

    const { text } = await generateText({
      model: this.openai(config.name),
      messages: coreMessages,
      ...config,
    });

    return text;
  }

  async streamChat(
    messages: Message[],
    onText: (text: string) => void,
    modelName?: string,
    options?: Partial<ModelConfig>,
  ): Promise<string> {
    const config = this.getModelConfig(modelName, options);
    const coreMessages = messages as CoreMessage[];

    const result = await streamText({
      model: this.openai(config.name),
      messages: coreMessages,
      ...config,
    });

    for await (const textPart of result.textStream) {
      onText(textPart);
    }

    return result.text;
  }

  async generateImage(prompt: string, modelName?: string, options?: Partial<ModelConfig>): Promise<any> {
    const config = ImageConfig.find((item) => item.model === modelName);

    const { image } = await generateImage({
      model: this.openai.image(config.model),
      prompt: prompt,
      size: "1024x1024",
    });

    const imageBuffer = Buffer.from(image.base64, "base64");
    const { url } = await put(`images/${uuidv4()}.png`, imageBuffer, {
      access: "public",
    });

    console.log(url);
    return { output: url };
  }
}
