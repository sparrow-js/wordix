// @ts-nocheck
import Anthropic from "@ai-sdk/anthropic";
import type { ModelConfig } from "../config/model-configs";
import { BaseAIProvider, type Message } from "./base";

export class AnthropicProvider extends BaseAIProvider {
  private client: Anthropic;

  constructor(apiKey: string, defaultModel: string, modelConfigs: Record<string, ModelConfig>) {
    super(apiKey, defaultModel, modelConfigs);
    this.client = new Anthropic({ apiKey });
  }

  async generateText(prompt: string, modelName?: string, options?: Partial<ModelConfig>): Promise<string> {
    const config = this.getModelConfig(modelName, options);
    const response = await this.client.messages.create({
      model: config.name,
      max_tokens: config.maxTokens,
      temperature: config.temperature,
      top_p: config.topP,
      messages: [{ role: "user", content: prompt }],
    });

    return response.content[0].text;
  }

  async streamText(
    prompt: string,
    onText: (text: string) => void,
    modelName?: string,
    options?: Partial<ModelConfig>,
  ): Promise<void> {
    const config = this.getModelConfig(modelName, options);
    const stream = await this.client.messages.create({
      model: config.name,
      max_tokens: config.maxTokens,
      temperature: config.temperature,
      top_p: config.topP,
      messages: [{ role: "user", content: prompt }],
      stream: true,
    });

    try {
      for await (const chunk of stream) {
        if (chunk.type === "content_block_delta" && chunk.delta?.text) {
          onText(chunk.delta.text);
        }
      }
    } catch (error) {
      throw error;
    }
  }

  async generateChat(messages: Message[], modelName?: string, options?: Partial<ModelConfig>): Promise<string> {
    const config = this.getModelConfig(modelName, options);
    const response = await this.client.messages.create({
      model: config.name,
      max_tokens: config.maxTokens,
      temperature: config.temperature,
      top_p: config.topP,
      messages: messages.map((msg) => ({
        role: msg.role === "assistant" ? "assistant" : "user",
        content: msg.content,
      })),
    });

    return response.content[0].text;
  }

  async streamChat(
    messages: Message[],
    onText: (text: string) => void,
    modelName?: string,
    options?: Partial<ModelConfig>,
  ): Promise<void> {
    const config = this.getModelConfig(modelName, options);
    const stream = await this.client.messages.create({
      model: config.name,
      max_tokens: config.maxTokens,
      temperature: config.temperature,
      top_p: config.topP,
      messages: messages.map((msg) => ({
        role: msg.role === "assistant" ? "assistant" : "user",
        content: msg.content,
      })),
      stream: true,
    });

    try {
      for await (const chunk of stream) {
        if (chunk.type === "content_block_delta" && chunk.delta?.text) {
          onText(chunk.delta.text);
        }
      }
    } catch (error) {
      throw error;
    }
  }

  private mapRole(role: string): "user" | "assistant" {
    return role === "assistant" ? "assistant" : "user";
  }
}
