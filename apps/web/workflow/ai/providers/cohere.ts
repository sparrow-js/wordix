import OpenAI from "openai";
import type { ModelConfig } from "../config/model-configs";
import { BaseAIProvider, type Message } from "./base";

export class CohereProvider extends BaseAIProvider {
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

    const stream = await this.openai.chat.completions.create({
      model: config.name,
      messages: [{ role: "user", content: prompt }],
      stream: true,
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

    const formattedMessages = messages.map((message) => ({
      role: message.role as "system" | "user" | "assistant",
      // @ts-ignore
      content: typeof message.content === "string" ? message.content : message.content?.[0]?.text || "",
    }));

    const stream = await this.openai.chat.completions.create({
      model: config.name,
      messages: formattedMessages,
      stream: true,
      max_tokens: 4096,
      temperature: 0.7,
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
