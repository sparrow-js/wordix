import { modelConfigs } from "../config/model-configs";
import { FLUXProvider } from "../providers/FLUX";
import { AnthropicProvider } from "../providers/anthropic";
import { CohereProvider } from "../providers/cohere";
import { DeepseekProvider } from "../providers/deepseek";
import { ElevenlabsProvider } from "../providers/elevenlabs";
import { GeminiProvider } from "../providers/gemini";
import { OpenAIProvider } from "../providers/openai";
import { PerplexityProvider } from "../providers/perplexity";
import { ReplicateProvider } from "../providers/replicate";
import { AIService } from "./ai-service";

export class ServiceFactory {
  private static instance: ServiceFactory;
  private aiService: AIService;
  private apiKey?: string;
  constructor(apiKey?: string) {
    this.apiKey = apiKey;
    this.aiService = new AIService();
    this.initializeProviders();
  }

  private initializeProviders(): void {
    // Register OpenAI provider with model configs
    this.aiService.registerProvider(
      "openai",
      new OpenAIProvider(this.apiKey, modelConfigs.openai.defaultModel, modelConfigs.openai.models),
    );

    this.aiService.registerProvider(
      "anthropic",
      new AnthropicProvider(this.apiKey, modelConfigs.anthropic.defaultModel, modelConfigs.anthropic.models),
    );
    this.aiService.registerProvider(
      "cohere",
      new CohereProvider(this.apiKey, modelConfigs.cohere.defaultModel, modelConfigs.cohere.models),
    );

    // this.aiService.registerProvider(
    //   "perplexity",
    //   new PerplexityProvider(this.apiKey, modelConfigs.perplexity.defaultModel, modelConfigs.perplexity.models),
    // );

    this.aiService.registerProvider(
      "gemini",
      new GeminiProvider(this.apiKey, modelConfigs.gemini.defaultModel, modelConfigs.gemini.models),
    );

    this.aiService.registerProvider(
      "deepseek",
      new DeepseekProvider(this.apiKey, modelConfigs.deepseek.defaultModel, modelConfigs.deepseek.models),
    );

    this.aiService.registerProvider("replicate", new ReplicateProvider(this.apiKey, "", {}));

    this.aiService.registerProvider("flux", new FLUXProvider(""));

    this.aiService.registerProvider("elevenlabs", new ElevenlabsProvider(this.apiKey, "", {}));
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
