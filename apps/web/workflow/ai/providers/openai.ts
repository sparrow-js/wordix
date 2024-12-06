import { createOpenAI } from "@ai-sdk/openai";
import { type CoreMessage, generateText, streamText } from "ai";
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
}
