/**
 * Base configuration for AI requests
 */
export interface AIConfig {
  model: string;
  temperature?: number;
  maxTokens?: number;
  stopSequences?: string[];
  provider?: string;
  preset?: string;
  topP?: number;
  frequencyPenalty?: number;
  presencePenalty?: number;
}

/**
 * Model-specific configuration
 */
export interface ModelConfig extends AIConfig {
  name: string;
  provider: string;
  description: string;
  contextWindow: number;
  costPer1kTokens: number;
  inputCostPer1kTokens?: number;
  maxTokens: number;
  typical?: {
    temperature: number;
    topP: number;
    frequencyPenalty: number;
    presencePenalty: number;
  };
}

/**
 * Preset configuration for different use cases
 */
export interface PresetConfig extends Partial<AIConfig> {
  name: string;
  description: string;
  systemPrompt?: string;
  contextMessages?: Message[];
}

/**
 * Provider API configuration
 */
export interface ProviderAPIConfig {
  apiKey: string;
  apiEndpoint?: string;
  organizationId?: string;
  timeout?: number;
  maxRetries?: number;
  retryDelay?: number;
  headers?: Record<string, string>;
  version?: string;
}

/**
 * Message structure for conversations
 */
export interface Message {
  role: "system" | "user" | "assistant";
  content: string;
  name?: string;
  functionCall?: {
    name: string;
    arguments: string;
  };
}

/**
 * Prompt configuration
 */
export interface PromptConfig {
  content: string;
  systemPrompt?: string;
  contextMessages?: Message[];
  temperature?: number;
  functions?: FunctionDefinition[];
  functionCall?: string | { name: string };
}

/**
 * Function definition for AI function calling
 */
export interface FunctionDefinition {
  name: string;
  description: string;
  parameters: {
    type: "object";
    properties: Record<
      string,
      {
        type: string;
        description: string;
        enum?: string[];
      }
    >;
    required?: string[];
  };
}

/**
 * AI request structure
 */
export interface AIRequest {
  prompt: string;
  config: AIConfig;
  stream?: boolean;
  functions?: FunctionDefinition[];
  functionCall?: string | { name: string };
}

/**
 * AI response structure
 */
export interface AIResponse {
  text: string;
  usage?: {
    promptTokens: number;
    completionTokens: number;
    totalTokens: number;
  };
  provider: string;
  model: string;
  timestamp: number;
  functionCall?: {
    name: string;
    arguments: string;
  };
}

/**
 * Streaming response structure
 */
export interface AIStreamResponse extends AIResponse {
  isComplete: boolean;
  chunk?: string;
}

/**
 * Error structure
 */
export interface AIError extends Error {
  provider: string;
  model: string;
  code: string;
  retryable: boolean;
  status?: number;
  requestId?: string;
}

/**
 * Provider interface
 */
export interface AIProvider {
  name: string;
  models: string[];
  supportsStreaming: boolean;
  supportsFunctions?: boolean;
  maxTokensPerRequest?: number;
  generate(request: AIRequest): Promise<AIResponse>;
  generateStream?(request: AIRequest): AsyncGenerator<AIStreamResponse>;
  cancelRequests?(): void;
  supportsModel?(model: string): boolean;
}

/**
 * Token usage tracking
 */
export interface TokenUsage {
  promptTokens: number;
  completionTokens: number;
  totalTokens: number;
  cost: number;
}

/**
 * Rate limit tracking
 */
export interface RateLimit {
  tokensPerMinute: number;
  requestsPerMinute: number;
  remaining: {
    tokens: number;
    requests: number;
  };
  reset: Date;
}

/**
 * Retry configuration
 */
export interface RetryConfig {
  maxRetries: number;
  initialDelay: number;
  maxDelay: number;
  backoffMultiplier: number;
  retryableErrorCodes: string[];
}

/**
 * Service status
 */
export interface AIServiceStatus {
  providers: string[];
  defaultProvider: string;
  defaultModel: string;
  activeRequests: number;
  rateLimits: Record<string, RateLimit>;
  errors: {
    count: number;
    lastError?: AIError;
  };
}

/**
 * Cache configuration
 */
export interface CacheConfig {
  enabled: boolean;
  ttl: number;
  maxSize: number;
  excludePatterns?: RegExp[];
}

/**
 * Logging configuration
 */
export interface LogConfig {
  level: "debug" | "info" | "warn" | "error";
  includeTimestamp: boolean;
  destination?: "console" | "file";
  filePath?: string;
}

/**
 * Cost tracking
 */
export interface CostTracking {
  totalCost: number;
  costByModel: Record<string, number>;
  costByProvider: Record<string, number>;
  tokensByModel: Record<string, TokenUsage>;
}
