import type {
  // HarmCategory,
  // HarmBlockThreshold,
  Part,
} from "@google/generative-ai";
import type { ModelConfig } from "../config/model-configs";
import type { AIProvider, Message } from "../providers/base";

export class AIService {
  private providers: Map<string, AIProvider> = new Map();

  registerProvider(name: string, provider: AIProvider): void {
    this.providers.set(name, provider);
  }

  getProvider(name: string): AIProvider {
    const provider = this.providers.get(name);
    if (!provider) {
      throw new Error(`Provider ${name} not found`);
    }
    return provider;
  }

  async generateText(
    providerName: string,
    prompt: string,
    modelName?: string,
    options?: Partial<ModelConfig>,
  ): Promise<string> {
    const provider = this.getProvider(providerName);
    return provider.generateText(prompt, modelName, options);
  }

  async generateChat(
    providerName: string,
    messages: Message[],
    modelName?: string,
    options?: Partial<ModelConfig>,
  ): Promise<string> {
    const provider = this.getProvider(providerName);
    return provider.generateChat(messages, modelName, options);
  }

  async streamText(
    providerName: string,
    prompt: string,
    onText: (text: string) => void,
    modelName?: string,
    options?: Partial<ModelConfig>,
  ): Promise<string> {
    const provider = this.getProvider(providerName);
    return await provider.streamText(prompt, onText, modelName, options);
  }

  async streamChat(
    providerName: string,
    messages: Message[] | string | Array<string | Part>,
    onText: (text: string) => void,
    modelName?: string,
    options?: Partial<ModelConfig>,
  ): Promise<string> {
    const provider = this.getProvider(providerName);
    return await provider.streamChat(messages, onText, modelName, options);
  }

  async generateImage(
    providerName: string,
    prompt: string,
    modelName?: string,
    params?: any,
  ): Promise<{ output: string }> {
    const provider = this.getProvider(providerName);
    return provider.generateImage(prompt, modelName, params);
  }
}
