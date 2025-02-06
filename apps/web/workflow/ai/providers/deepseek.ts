import OpenAI from "openai";
import type { ModelConfig } from "../config/model-configs";
import { BaseAIProvider, type Message } from "./base";

export class DeepseekProvider extends BaseAIProvider {
  private client: OpenAI;

  constructor(apiKey: string, defaultModel: string, modelConfigs: Record<string, ModelConfig>) {
    super(apiKey, defaultModel, modelConfigs);
    this.client = new OpenAI({
      apiKey: apiKey,
      baseURL: `${process.env.PRO_URL}/v1`,
      // apiKey: process.env.DEEPSEEK_API_KEY,
      // baseURL: "https://api.deepseek.com/v1",
      // apiKey: process.env.OPENROUTER_API_KEY,
      // baseURL: "https://openrouter.ai/api/v1",
    });
  }

  async generateText(prompt: string, modelName?: string, options?: Partial<ModelConfig>): Promise<string> {
    const config = this.getModelConfig(modelName, options);

    const completion = await this.client.chat.completions.create({
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

    const stream = await this.client.chat.completions.create({
      model: config.name,
      messages: [{ role: "user", content: prompt }],
      stream: true,
      ...config,
    });

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

    const completion = await this.client.chat.completions.create({
      model: config.name,
      messages,
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
    const stream = await this.client.chat.completions.create({
      model: config.name,
      messages,
      stream: true,
      ...config,
    });

    let fullText = "";
    for await (const chunk of stream) {
      const content = chunk.choices[0]?.delta?.content || "";
      fullText += content;
      onText(content);
    }

    return fullText;
  }
}
