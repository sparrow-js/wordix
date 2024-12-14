import { modelConfigs } from "../config/model-configs";
import { aiConfig } from "../config/providers";
import { FLUXProvider } from "../providers/FLUX";
import { AnthropicProvider } from "../providers/anthropic";
import { CohereProvider } from "../providers/cohere";
import { GeminiProvider } from "../providers/gemini";
import { OpenAIProvider } from "../providers/openai";
import { PerplexityProvider } from "../providers/perplexity";
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

    this.aiService.registerProvider(
      "anthropic",
      new AnthropicProvider(
        aiConfig.anthropic.apiKey,
        modelConfigs.anthropic.defaultModel,
        modelConfigs.anthropic.models,
      ),
    );
    this.aiService.registerProvider(
      "cohere",
      new CohereProvider(aiConfig.cohere.apiKey, modelConfigs.cohere.defaultModel, modelConfigs.cohere.models),
    );

    this.aiService.registerProvider(
      "perplexity",
      new PerplexityProvider(
        aiConfig.perplexity.apiKey,
        modelConfigs.perplexity.defaultModel,
        modelConfigs.perplexity.models,
      ),
    );

    this.aiService.registerProvider(
      "gemini",
      new GeminiProvider(aiConfig.gemini.apiKey, modelConfigs.gemini.defaultModel, modelConfigs.gemini.models),
    );

    this.aiService.registerProvider("flux", new FLUXProvider(""));
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
