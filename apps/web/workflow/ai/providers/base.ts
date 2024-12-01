import type { ModelConfig } from "../config/model-configs";

export interface AIProvider {
  generateText?(prompt: string, modelName?: string, options?: Partial<ModelConfig>): Promise<string>;
  generateChat?(messages: Message[], modelName?: string, options?: Partial<ModelConfig>): Promise<string>;
  streamText?(
    prompt: string,
    onText: (text: string) => void,
    modelName?: string,
    options?: Partial<ModelConfig>,
  ): Promise<string>;
  streamChat?(
    messages: Message[],
    onText: (text: string) => void,
    modelName?: string,
    options?: Partial<ModelConfig>,
  ): Promise<string>;

  generateImage?(prompt: string, modelName?: string, params?: any): Promise<string>;
}

export interface Message {
  role: "user" | "assistant" | "system";
  content: string | MessageContent[];
}

export interface MessageContent {
  type: "text" | "image_url";
  text?: string;
  image_url?: string;
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
    messages: Message[],
    onText: (text: string) => void,
    modelName?: string,
    options?: Partial<ModelConfig>,
  ): Promise<string>;
}
