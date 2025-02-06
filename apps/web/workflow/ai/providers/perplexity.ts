import { createOpenAI } from "@ai-sdk/openai";
import { type CoreMessage, generateText, streamText } from "ai";
import type { ModelConfig } from "../config/model-configs";
import { BaseAIProvider, type Message } from "./base";

export class PerplexityProvider extends BaseAIProvider {
  private perplexity = createOpenAI({
    name: "perplexity",
    apiKey: process.env.PERPLEXITY_API_KEY,
    baseURL: "https://api.perplexity.ai/",
  });

  constructor(apiKey: string, defaultModel: string, modelConfigs: Record<string, ModelConfig>) {
    super(apiKey, defaultModel, modelConfigs);
    console.log("PerplexityProvider constructor");
  }

  async generateText(prompt: string, modelName?: string, options?: Partial<ModelConfig>): Promise<string> {
    const config = this.getModelConfig(modelName, options);

    const { text } = await generateText({
      model: this.perplexity(config.name),
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
      model: this.perplexity(config.name),
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
      model: this.perplexity(config.name),
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
      model: this.perplexity(config.name),
      messages: coreMessages,
      ...config,
    });

    for await (const textPart of result.textStream) {
      onText(textPart);
    }

    return result.text;
  }
}
