export interface ProviderConfig {
  apiKey: string;
}

export interface AIConfig {
  openai: ProviderConfig;
  anthropic: ProviderConfig;
}

export const aiConfig: AIConfig = {
  openai: {
    apiKey: "your-openai-api-key",
  },
  anthropic: {
    apiKey: "your-anthropic-api-key",
  },
};
