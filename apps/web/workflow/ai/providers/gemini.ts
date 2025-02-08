import OpenAI from "openai";
import type { ChatCompletionMessageParam } from "openai/resources/chat/completions";

import type { ModelConfig } from "../config/model-configs";
import { BaseAIProvider } from "./base";

export class GeminiProvider extends BaseAIProvider {
  private openai: OpenAI;

  constructor(apiKey: string, defaultModel: string, modelConfigs: Record<string, ModelConfig>) {
    super(apiKey, defaultModel, modelConfigs);
    this.openai = new OpenAI({
      apiKey: apiKey,
      baseURL: `${process.env.PRO_URL}/v1`,
    });
  }

  async generateText(prompt: string, modelName?: string, options?: Partial<ModelConfig>): Promise<string> {
    const response = await this.openai.chat.completions.create({
      model: modelName || "gpt-3.5-turbo",
      messages: [{ role: "user", content: prompt }],
    });

    return response.choices[0]?.message?.content || "";
  }

  async streamText(
    prompt: string,
    onText: (text: string) => void,
    modelName?: string,
    options?: Partial<ModelConfig>,
  ): Promise<string> {
    const stream = await this.openai.chat.completions.create({
      model: modelName || "gpt-3.5-turbo",
      messages: [{ role: "user", content: prompt }],
      stream: true,
    });

    let text = "";
    for await (const chunk of stream) {
      const chunkText = chunk.choices[0]?.delta?.content || "";
      onText(chunkText);
      text += chunkText;
    }

    return text;
  }

  async generateChat(
    messages: ChatCompletionMessageParam[],
    modelName?: string,
    options?: Partial<ModelConfig>,
  ): Promise<string> {
    const response = await this.openai.chat.completions.create({
      model: modelName || "gpt-3.5-turbo",
      messages: messages,
    });

    return response.choices[0]?.message?.content || "";
  }

  async streamChat(
    messages: ChatCompletionMessageParam[],
    onText: (text: string) => void,
    modelName?: string,
    options?: Partial<ModelConfig>,
  ): Promise<string> {
    const stream = await this.openai.chat.completions.create({
      model: modelName || "gpt-3.5-turbo",
      messages: messages,
      stream: true,
    });

    let text = "";
    for await (const chunk of stream) {
      const chunkText = chunk.choices[0]?.delta?.content || "";
      onText(chunkText);
      text += chunkText;
    }

    return text;
  }

  async generateImage(prompt: string, modelName?: string, options?: Partial<ModelConfig>): Promise<{ output: string }> {
    const response = await this.openai.images.generate({
      model: modelName || "dall-e-3",
      prompt,
      n: 1,
      size: "1024x1024",
    });

    return {
      output: response.data[0]?.url || "",
    };
  }
}
