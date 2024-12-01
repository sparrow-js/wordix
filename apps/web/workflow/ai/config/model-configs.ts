export interface ModelConfig {
  name: string;
  maxTokens: number;
  temperature?: number;
  topP?: number;
  frequencyPenalty?: number;
  presencePenalty?: number;
  system?: string;
}

export interface ProviderModelConfig {
  defaultModel: string;
  models: Record<string, ModelConfig>;
}

export interface ModelConfigs {
  openai: ProviderModelConfig;
  anthropic: ProviderModelConfig;
}

export const modelConfigs: ModelConfigs = {
  openai: {
    defaultModel: "gpt-3.5-turbo",
    models: {
      "gpt-4o": {
        name: "gpt-4o",
        maxTokens: 8000,
        temperature: 0.7,
        topP: 1,
        frequencyPenalty: 0,
        presencePenalty: 0,
      },
      "gpt-4o-mini": {
        name: "gpt-4o-mini",
        maxTokens: 128000,
        temperature: 0.7,
        topP: 1,
        frequencyPenalty: 0,
        presencePenalty: 0,
      },
      "gpt-4": {
        name: "gpt-4",
        maxTokens: 8192,
        temperature: 0.7,
        topP: 1,
        frequencyPenalty: 0,
        presencePenalty: 0,
      },
      "gpt-3.5-turbo": {
        name: "gpt-3.5-turbo",
        maxTokens: 4096,
        temperature: 0.7,
        topP: 1,
        frequencyPenalty: 0,
        presencePenalty: 0,
      },
      "text-davinci-003": {
        name: "text-davinci-003",
        maxTokens: 4097,
        temperature: 0.7,
        topP: 1,
        frequencyPenalty: 0,
        presencePenalty: 0,
      },
    },
  },
  anthropic: {
    defaultModel: "claude-2",
    models: {
      "claude-2": {
        name: "claude-2",
        maxTokens: 100000,
        temperature: 0.7,
        topP: 1,
      },
      "claude-instant-1": {
        name: "claude-instant-1",
        maxTokens: 100000,
        temperature: 0.7,
        topP: 1,
      },
    },
  },
};
