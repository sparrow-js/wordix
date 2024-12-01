import { modelConfigs } from "../config/model-configs";
import { aiConfig } from "../config/providers";
import { FLUXProvider } from "../providers/FLUX";
import { OpenAIProvider } from "../providers/openai";
import { AIService } from "./ai-service";

export class ServiceFactory {
  private static instance: ServiceFactory;
  private aiService: AIService;

  private constructor() {
    this.aiService = new AIService();
    this.initializeProviders();
  }

  private initializeProviders(): void {
    // Register OpenAI provider with model configs
    this.aiService.registerProvider(
      "openai",
      new OpenAIProvider(aiConfig.openai.apiKey, modelConfigs.openai.defaultModel, modelConfigs.openai.models),
    );

    this.aiService.registerProvider("flux", new FLUXProvider(""));

    // Register Anthropic provider with model configs
    // this.aiService.registerProvider(
    //   "anthropic",
    //   new AnthropicProvider(
    //     aiConfig.anthropic.apiKey,
    //     modelConfigs.anthropic.defaultModel,
    //     modelConfigs.anthropic.models,
    //   ),
    // );
  }

  static getInstance(): ServiceFactory {
    if (!ServiceFactory.instance) {
      ServiceFactory.instance = new ServiceFactory();
    }
    return ServiceFactory.instance;
  }

  getAIService(): AIService {
    return this.aiService;
  }
}
