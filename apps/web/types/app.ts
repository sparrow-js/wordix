

export enum Theme {
  light = 'light',
  dark = 'dark',
}

export enum ProviderType {
  openai = 'openai',
  anthropic = 'anthropic',
  azure_openai = 'azure_openai',
  replicate = 'replicate',
  huggingface_hub = 'huggingface_hub',
  minimax = 'minimax',
  tongyi = 'tongyi',
  spark = 'spark',
}

export enum AppType {
  'chat' = 'chat',
  'completion' = 'completion',
}

export enum ModelModeType {
  'chat' = 'chat',
  'completion' = 'completion',
  'unset' = '',
}

export enum RETRIEVE_TYPE {
  oneWay = 'single',
  multiWay = 'multiple',
}

export enum RETRIEVE_METHOD {
  semantic = 'semantic_search',
  fullText = 'full_text_search',
  hybrid = 'hybrid_search',
  invertedIndex = 'invertedIndex',
  keywordSearch = 'keyword_search',
}

export type VariableInput = {
  key: string
  name: string
  value: string
}

/**
 * App modes
 */
export const AppModes = ['advanced-chat', 'agent-chat', 'chat', 'completion', 'workflow'] as const
export type AppMode = typeof AppModes[number]

/**
 * Variable type
 */
export const VariableTypes = ['string', 'number', 'select'] as const
export type VariableType = typeof VariableTypes[number]

/**
 * Prompt variable parameter
 */
export type PromptVariable = {
  /** Variable key */
  key: string
  /** Variable name */
  name: string
  /** Type */
  type: VariableType
  required: boolean
  /** Enumeration of single-selection drop-down values */
  options?: string[]
  max_length?: number
}

export type TextTypeFormItem = {
  default: string
  label: string
  variable: string
  required: boolean
  max_length: number
}

export type SelectTypeFormItem = {
  default: string
  label: string
  variable: string
  required: boolean
  options: string[]
}

export type ParagraphTypeFormItem = {
  default: string
  label: string
  variable: string
  required: boolean
}
/**
 * User Input Form Item
 */
export type UserInputFormItem = {
  'text-input': TextTypeFormItem
} | {
  'select': SelectTypeFormItem
} | {
  'paragraph': TextTypeFormItem
}




export enum AgentStrategy {
  functionCall = 'function_call',
  react = 'react',
}

export type CompletionParams = {
  /** Maximum number of tokens in the answer message returned by Completion */
  max_tokens: number
  /**
   * A number between 0 and 2.
   * The larger the number, the more random the result;
   * otherwise, the more deterministic.
   * When in use, choose either `temperature` or `top_p`.
   * Default is 1.
   */
  temperature: number
  /**
   * Represents the proportion of probability mass samples to take,
   * e.g., 0.1 means taking the top 10% probability mass samples.
   * The determinism between the samples is basically consistent.
   * Among these results, the `top_p` probability mass results are taken.
   * When in use, choose either `temperature` or `top_p`.
   * Default is 1.
   */
  top_p: number
  /** When enabled, the Completion Text will concatenate the Prompt content together and return it. */
  echo: boolean
  /**
   * Specify up to 4 to automatically stop generating before the text specified in `stop`.
   * Suitable for use in chat mode.
   * For example, specify "Q" and "A",
   * and provide some Q&A examples as context,
   * and the model will give out in Q&A format and stop generating before Q&A.
   */
  stop: string[]
  /**
   * A number between -2.0 and 2.0.
   * The larger the value, the less the model will repeat topics and the more it will provide new topics.
   */
  presence_penalty: number
  /**
   * A number between -2.0 and 2.0.
   * A lower setting will make the model appear less cultured,
   * always repeating expressions.
   * The difference between `frequency_penalty` and `presence_penalty`
   * is that `frequency_penalty` penalizes a word based on its frequency in the training data,
   * while `presence_penalty` penalizes a word based on its occurrence in the input text.
   */
  frequency_penalty: number
}
/**
 * Model configuration. The backend type.
 */
export type Model = {
  /** LLM provider, e.g., OPENAI */
  provider: string
  /** Model name, e.g, gpt-3.5.turbo */
  name: string
  mode: ModelModeType
  /** Default Completion call parameters */
  completion_params: CompletionParams
}

export enum TransferMethod {
  all = 'all',
  local_file = 'local_file',
  remote_url = 'remote_url',
}