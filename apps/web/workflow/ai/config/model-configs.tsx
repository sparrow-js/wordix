import { AnthropicIcon, CohereIcon, GeminiIcon, OpenaiIcon, PerplexityIcon } from "@/components/settings/icons";
import DeepSeek from "@/components/ui/icons/deepseek";

export interface ModelConfig {
  name: string;
  maxTokens: number;
  temperature?: number;
  topP?: number;
  frequencyPenalty?: number;
  presencePenalty?: number;
  system?: string;
  supportsImage?: boolean;
  reasoning_effort?: "low" | "medium" | "high";
  store?: boolean;
}

export interface ProviderModelConfig {
  defaultModel: string;
  models: Record<string, ModelConfig>;
}

export interface ModelConfigs {
  openai: ProviderModelConfig;
  anthropic: ProviderModelConfig;
  cohere: ProviderModelConfig;
  // perplexity: ProviderModelConfig;
  gemini: ProviderModelConfig;
  deepseek: ProviderModelConfig;
}

export interface ModelConfigWithProvider extends ModelConfig {
  provider: "openai" | "anthropic" | "cohere" | "perplexity" | "gemini" | "replicate" | "deepseek";
  avatar?: React.ReactNode;
  model: string;
}

export const allModels: ModelConfigWithProvider[] = [
  {
    provider: "openai",
    model: "o3-mini",
    name: "o3-mini",
    maxTokens: 100000,
    temperature: 0.7,
    topP: 1,
    frequencyPenalty: 0,
    presencePenalty: 0,
    avatar: <OpenaiIcon />,
    supportsImage: true,
  },
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
    supportsImage: true,
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
    supportsImage: true,
  },
  {
    provider: "openai",
    model: "o1-preview",
    name: "o1-preview",
    maxTokens: 32768,
    temperature: 0.7,
    topP: 1,
    frequencyPenalty: 0,
    presencePenalty: 0,
    avatar: <OpenaiIcon />,
    supportsImage: false,
  },
  {
    provider: "openai",
    model: "o1-mini",
    name: "o1-mini",
    maxTokens: 65536,
    temperature: 0.7,
    topP: 1,
    frequencyPenalty: 0,
    presencePenalty: 0,
    avatar: <OpenaiIcon />,
    supportsImage: false,
  },
  {
    provider: "anthropic",
    model: "claude-3-5-sonnet-20240620",
    name: "claude-3-5-sonnet-20240620",
    maxTokens: 8192,
    temperature: 0.7,
    avatar: <AnthropicIcon />,
    supportsImage: true,
  },
  {
    provider: "anthropic",
    model: "claude-3-5-haiku-20241022",
    name: "claude-3-5-haiku-20241022",
    maxTokens: 8192,
    temperature: 0.7,
    avatar: <AnthropicIcon />,
    supportsImage: false,
  },
  {
    provider: "anthropic",
    model: "claude-3-5-sonnet-20241022",
    name: "claude-3-5-sonnet-20241022",
    maxTokens: 8192,
    temperature: 0.7,
    avatar: <AnthropicIcon />,
    supportsImage: true,
  },
  {
    provider: "anthropic",
    model: "claude-3-5-sonnet-latest",
    name: "claude-3-5-sonnet-latest",
    maxTokens: 8192,
    temperature: 0.7,
    avatar: <AnthropicIcon />,
  },
  {
    provider: "gemini",
    model: "gemini-2.0-flash-exp",
    name: "gemini-2.0-flash-exp",
    maxTokens: 4096,
    temperature: 0.7,
    avatar: <GeminiIcon />,
  },
  {
    provider: "gemini",
    model: "gemini-2.0-flash-thinking-exp-01-21",
    name: "gemini-2.0-flash-thinking-exp-01-21",
    maxTokens: 4096,
    temperature: 1,
    avatar: <GeminiIcon />,
  },
  {
    provider: "deepseek",
    model: "deepseek-chat",
    name: "deepseek-chat",
    maxTokens: 8000,
    temperature: 0.7,
    avatar: <DeepSeek className="w-12" />,
  },
  {
    provider: "deepseek",
    model: "deepseek-reasoner",
    name: "deepseek-reasoner",
    maxTokens: 8000,
    temperature: 0.7,
    avatar: <DeepSeek className="w-12" />,
  },
  // {
  //   provider: "cohere",
  //   model: "command-r-08-2024",
  //   name: "command-r-08-2024",
  //   maxTokens: 4096,
  //   temperature: 0.7,
  //   avatar: <CohereIcon />,
  // },
  // {
  //   provider: "cohere",
  //   model: "command-r-plus-08-2024",
  //   name: "command-r-plus-08-2024",
  //   maxTokens: 4096,
  //   temperature: 0.7,
  //   avatar: <CohereIcon />,
  // },
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
  // {
  //   provider: "perplexity",
  //   model: "llama-3.1-sonar-small-128k-online",
  //   name: "llama-3.1-sonar-small-128k-online",
  //   maxTokens: 128000,
  //   temperature: 0.7,
  //   avatar: <PerplexityIcon />,
  // },
  // {
  //   provider: "perplexity",
  //   model: "llama-3.1-sonar-large-128k-online",
  //   name: "llama-3.1-sonar-large-128k-online",
  //   maxTokens: 128000,
  //   temperature: 0.7,
  //   avatar: <PerplexityIcon />,
  // },
  // {
  //   provider: "perplexity",
  //   model: "llama-3.1-sonar-huge-128k-online",
  //   name: "llama-3.1-sonar-huge-128k-online",
  //   maxTokens: 128000,
  //   temperature: 0.7,
  //   avatar: <PerplexityIcon />,
  // },
];

export const modelConfigs: ModelConfigs = {
  openai: {
    defaultModel: "gpt-3.5-turbo",
    models: {
      "o3-mini": {
        name: "o3-mini",
        maxTokens: 100000,
        temperature: 0.7,
        topP: 1,
        store: true,
        reasoning_effort: "medium",
      },
      "o1-mini": {
        name: "o1-mini",
        maxTokens: 65536,
        temperature: 0.7,
        topP: 1,
        frequencyPenalty: 0,
        presencePenalty: 0,
      },
      "gpt-4o": {
        name: "gpt-4o",
        maxTokens: 8192,
        temperature: 0.7,
        topP: 1,
        frequencyPenalty: 0,
        presencePenalty: 0,
      },
      "gpt-4o-mini": {
        name: "gpt-4o-mini",
        maxTokens: 8192,
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
        maxTokens: 4096,
      },
      "command-r-plus-08-2024": {
        name: "command-r-plus-08-2024",
        maxTokens: 4096,
      },
      "command-r": {
        name: "command-r",
        maxTokens: 4096,
      },
      "command-r-plus": {
        name: "command-r-plus",
        maxTokens: 4096,
      },
    },
  },
  // perplexity: {
  //   defaultModel: "llama-3.1-sonar-small-128k-online",
  //   models: {
  //     "llama-3.1-sonar-small-128k-online": {
  //       name: "llama-3.1-sonar-small-128k-online",
  //       maxTokens: 4096,
  //     },
  //     "llama-3.1-sonar-large-128k-online": {
  //       name: "llama-3.1-sonar-large-128k-online",
  //       maxTokens: 4096,
  //     },
  //     "llama-3.1-sonar-huge-128k-online	": {
  //       name: "llama-3.1-sonar-huge-128k-online	",
  //       maxTokens: 4096,
  //     },
  //   },
  // },
  gemini: {
    defaultModel: "gemini-2.0-flash-exp",
    models: {
      "gemini-2.0-flash-exp": {
        name: "gemini-2.0-flash-exp",
        maxTokens: 4096,
      },
    },
  },
  deepseek: {
    defaultModel: "deepseek-chat",
    models: {
      "deepseek-chat": {
        name: "deepseek-chat",
        maxTokens: 8000,
      },
      "deepseek-reasoner": {
        name: "deepseek-reasoner",
        maxTokens: 8000,
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

interface ImageMessage {
  type?: "image";
  data?: string;
  image?: string;
  mimeType?: string;
  inlineData?: {
    data: string;
    mimeType: string;
  };
  [key: string]: any;
}

export async function getFormatImageMessage(
  message: ImageMessage,
  model: ModelConfigWithProvider,
): Promise<ImageMessage> {
  // if (model.provider === "openai") {
  //   return {
  //     type: "image",
  //     image: message.image,
  //     experimental_providerMetadata: {
  //       openai: { imageDetail: "high" },
  //     },
  //   };
  // }
  // if (model.provider === "anthropic") {
  //   const response = await fetch(message.image);
  //   const arrayBuffer = await response.arrayBuffer();
  //   const base64 = Buffer.from(arrayBuffer).toString("base64");
  //   return {
  //     type: "image",
  //     image: base64,
  //     mimeType: message.mimeType,
  //   };
  // }

  // if (model.provider === "gemini") {
  //   const response = await fetch(message.image);
  //   const arrayBuffer = await response.arrayBuffer();
  //   const base64 = Buffer.from(arrayBuffer).toString("base64");
  //   return {
  //     inlineData: {
  //       data: base64,
  //       mimeType: message.mimeType,
  //     },
  //   };
  // }

  return message;
}

export async function getFormatTextMessage(message: { text: string; type: string }, modelName: string) {
  // const model = allModels.find((m) => m.name === modelName);
  // if (model?.provider === "gemini") {
  //   return {
  //     text: message.text,
  //   };
  // }
  return message;
}

export async function getFormatMessage(message: any[], modelName: string) {
  const model = allModels.find((m) => m.name === modelName);

  return Promise.all(
    message.map(async (m) => {
      if (m.type === "image") {
        return await getFormatImageMessage(m, model);
      }

      if (m.type === "text") {
        return getFormatTextMessage(m, modelName);
      }

      return m;
    }),
  );
}
