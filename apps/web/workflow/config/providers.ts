export interface ProviderConfig {
  apiKey: string;
}

export interface AIConfig {
  openai: ProviderConfig;
  anthropic: ProviderConfig;
}

// In a real application, load this from environment variables or a config file
export const aiConfig: AIConfig = {
  openai: {
    apiKey: "your-openai-api-key",
  },
  anthropic: {
    apiKey: "your-anthropic-api-key",
  },
};
