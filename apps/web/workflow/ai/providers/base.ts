import type { ChatCompletionMessageParam } from "openai/resources/chat/completions";
import type { ModelConfig } from "../config/model-configs";

export interface AIProvider {
  generateText?(prompt: string, modelName?: string, options?: Partial<ModelConfig>): Promise<string>;
  generateChat?(
    messages: ChatCompletionMessageParam[],
    modelName?: string,
    options?: Partial<ModelConfig>,
  ): Promise<string>;
  streamText?(
    prompt: string,
    onText: (text: string) => void,
    modelName?: string,
    options?: Partial<ModelConfig>,
  ): Promise<string>;
  streamChat?(
    messages: ChatCompletionMessageParam[],
    onText: (text: string) => void,
    modelName?: string,
    options?: Partial<ModelConfig>,
    workspaceId?: string,
  ): Promise<string>;

  generateImage?(prompt: string, modelName?: string, params?: any): Promise<{ output: string }>;

  textToSpeech?(text: string, modelName?: string, params?: any): Promise<{ output: string }>;
}

export abstract class BaseAIProvider implements AIProvider {
  protected apiKey: string;
  protected defaultModel: string;
  protected modelConfigs: Record<string, ModelConfig>;

  constructor(apiKey: string, defaultModel: string, modelConfigs: Record<string, ModelConfig>) {
    this.apiKey = apiKey;
    this.defaultModel = defaultModel;
    this.modelConfigs = modelConfigs;
  }

  protected getModelConfig(modelName?: string, options?: Partial<ModelConfig>): ModelConfig {
    const baseConfig = this.modelConfigs[modelName || this.defaultModel];
    if (!baseConfig) {
      throw new Error(`Model ${modelName} not found`);
    }
    return { ...baseConfig, ...options };
  }

  abstract generateText(prompt: string, modelName?: string, options?: Partial<ModelConfig>): Promise<string>;
  abstract generateChat(messages: Message[], modelName?: string, options?: Partial<ModelConfig>): Promise<string>;
  abstract streamText(
    prompt: string,
    onText: (text: string) => void,
    modelName?: string,
    options?: Partial<ModelConfig>,
  ): Promise<string>;

  abstract streamChat(
    messages: ChatCompletionMessageParam[],
    onText: (text: string) => void,
    modelName?: string,
    options?: Partial<ModelConfig>,
    workspaceId?: string,
  ): Promise<string>;
}

export type Message = ChatCompletionMessageParam;
