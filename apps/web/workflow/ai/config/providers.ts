export interface ProviderConfig {
  apiKey: string;
}

export interface AIConfig {
  openai: ProviderConfig;
  anthropic: ProviderConfig;
  cohere: ProviderConfig;
  perplexity: ProviderConfig;
}

export const aiConfig: AIConfig = {
  openai: {
    apiKey: "your-openai-api-key",
  },
  anthropic: {
    apiKey: "your-anthropic-api-key",
  },
  cohere: {
    apiKey: "your-cohere-api-key",
  },
  perplexity: {
    apiKey: "your-perplexity-api-key",
  },
};
