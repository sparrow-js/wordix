import { AnthropicIcon, CohereIcon, OpenaiIcon, PerplexityIcon } from "@/components/settings/icons";

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
  cohere: ProviderModelConfig;
  perplexity: ProviderModelConfig;
}

export interface ModelConfigWithProvider extends ModelConfig {
  provider: "openai" | "anthropic" | "cohere" | "perplexity";
  avatar?: React.ReactNode;
  model: string;
}

export const allModels: ModelConfigWithProvider[] = [
  {
    provider: "openai",
    model: "gpt-4o",
    name: "gpt-4o",
    maxTokens: 8000,
    temperature: 0.7,
    topP: 1,
    frequencyPenalty: 0,
    presencePenalty: 0,
    avatar: <OpenaiIcon />,
  },
  {
    provider: "openai",
    model: "gpt-4o-mini",
    name: "gpt-4o-mini",
    maxTokens: 128000,
    temperature: 0.7,
    topP: 1,
    frequencyPenalty: 0,
    presencePenalty: 0,
    avatar: <OpenaiIcon />,
  },
  {
    provider: "openai",
    model: "gpt-4",
    name: "gpt-4",
    maxTokens: 8192,
    temperature: 0.7,
    topP: 1,
    frequencyPenalty: 0,
    presencePenalty: 0,
    avatar: <OpenaiIcon />,
  },
  {
    provider: "openai",
    model: "gpt-3.5-turbo",
    name: "gpt-3.5-turbo",
    maxTokens: 4096,
    temperature: 0.7,
    topP: 1,
    frequencyPenalty: 0,
    presencePenalty: 0,
    avatar: <OpenaiIcon />,
  },
  {
    provider: "openai",
    model: "text-davinci-003",
    name: "text-davinci-003",
    maxTokens: 4097,
    temperature: 0.7,
    topP: 1,
    frequencyPenalty: 0,
    presencePenalty: 0,
    avatar: <OpenaiIcon />,
  },
  {
    provider: "anthropic",
    model: "claude-3-5-sonnet-20240620",
    name: "claude-3-5-sonnet-20240620",
    maxTokens: 200000,
    temperature: 0.7,
    avatar: <AnthropicIcon />,
  },
  {
    provider: "anthropic",
    model: "claude-3-5-haiku-20241022",
    name: "claude-3-5-haiku-20241022",
    maxTokens: 200000,
    temperature: 0.7,
    avatar: <AnthropicIcon />,
  },
  {
    provider: "anthropic",
    model: "claude-3-5-sonnet-20241022",
    name: "claude-3-5-sonnet-20241022",
    maxTokens: 200000,
    temperature: 0.7,
    avatar: <AnthropicIcon />,
  },
  {
    provider: "anthropic",
    model: "claude-3-5-sonnet-latest",
    name: "claude-3-5-sonnet-latest",
    maxTokens: 200000,
    temperature: 0.7,
    avatar: <AnthropicIcon />,
  },
  {
    provider: "anthropic",
    model: "claude-3-opus-20240229",
    name: "claude-3-opus-20240229",
    maxTokens: 200000,
    temperature: 0.7,
    avatar: <AnthropicIcon />,
  },
  {
    provider: "cohere",
    model: "command-r-08-2024",
    name: "command-r-08-2024",
    maxTokens: 4096,
    temperature: 0.7,
    avatar: <CohereIcon />,
  },
  {
    provider: "cohere",
    model: "command-r-plus-08-2024",
    name: "command-r-plus-08-2024",
    maxTokens: 4096,
    temperature: 0.7,
    avatar: <CohereIcon />,
  },
  {
    provider: "cohere",
    model: "command-r",
    name: "command-r",
    maxTokens: 4096,
    temperature: 0.7,
    avatar: <CohereIcon />,
  },
  {
    provider: "cohere",
    model: "command-r-plus",
    name: "command-r-plus",
    maxTokens: 4096,
    temperature: 0.7,
    avatar: <CohereIcon />,
  },
  {
    provider: "perplexity",
    model: "llama-3.1-sonar-small-128k-online",
    name: "llama-3.1-sonar-small-128k-online",
    maxTokens: 128000,
    temperature: 0.7,
    avatar: <PerplexityIcon />,
  },
  {
    provider: "perplexity",
    model: "llama-3.1-sonar-large-128k-online",
    name: "llama-3.1-sonar-large-128k-online",
    maxTokens: 128000,
    temperature: 0.7,
    avatar: <PerplexityIcon />,
  },
  {
    provider: "perplexity",
    model: "llama-3.1-sonar-huge-128k-online",
    name: "llama-3.1-sonar-huge-128k-online",
    maxTokens: 128000,
    temperature: 0.7,
    avatar: <PerplexityIcon />,
  },
];

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
        maxTokens: 8000,
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
    defaultModel: "claude-3-5-sonnet-20240620",
    models: {
      "claude-3-5-sonnet-20240620": {
        name: "claude-3-5-sonnet-20240620",
        maxTokens: 8192,
        temperature: 0.7,
      },
      "claude-3-5-sonnet-20241022": {
        name: "claude-3-5-sonnet-20241022",
        maxTokens: 8192,
        temperature: 0.7,
      },
      "claude-3-5-sonnet-latest": {
        name: "claude-3-5-sonnet-latest",
        maxTokens: 8192,
        temperature: 0.7,
      },
      "claude-3-5-haiku-20241022": {
        name: "claude-3-5-haiku-20241022",
        maxTokens: 8192,
        temperature: 0.7,
      },
      "claude-3-opus-20240229": {
        name: "claude-3-opus-20240229",
        maxTokens: 4096,
        temperature: 0.7,
      },
    },
  },
  cohere: {
    defaultModel: "command-r-08-2024",
    models: {
      "command-r-08-2024": {
        name: "command-r-08-2024",
        maxTokens: 100000,
      },
      "command-r-plus-08-2024": {
        name: "command-r-plus-08-2024",
        maxTokens: 100000,
      },
      "command-r": {
        name: "command-r",
        maxTokens: 100000,
      },
      "command-r-plus": {
        name: "command-r-plus",
        maxTokens: 100000,
      },
    },
  },
  perplexity: {
    defaultModel: "llama-3.1-sonar-small-128k-online",
    models: {
      "llama-3.1-sonar-small-128k-online": {
        name: "llama-3.1-sonar-small-128k-online",
        maxTokens: 4096,
      },
      "llama-3.1-sonar-large-128k-online": {
        name: "llama-3.1-sonar-large-128k-online",
        maxTokens: 4096,
      },
      "llama-3.1-sonar-huge-128k-online	": {
        name: "llama-3.1-sonar-huge-128k-online	",
        maxTokens: 4096,
      },
    },
  },
};

export function getProviderFromModel(modelName: string): string {
  const model = allModels.find((m) => m.name === modelName);
  if (!model) {
    throw new Error(`Model ${modelName} not found`);
  }
  return model.provider;
}
