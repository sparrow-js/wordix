import type { AnyExpression } from "mongoose"

export type Inputs = Record<string, string | number | object>

export enum InputVarType {
  textInput = 'text-input',
  paragraph = 'paragraph',
  select = 'select',
  number = 'number',
  url = 'url',
  files = 'files',
  json = 'json', // obj, array
  contexts = 'contexts', // knowledge retrieval
  iterator = 'iterator', // iteration input
  singleFile = 'file',
  multiFiles = 'file-list',
}

export type InputForm = {
    type: InputVarType
    label: string
    variable: any
    required: boolean
    [key: string]: any
}

export enum TransferMethod {
  all = 'all',
  local_file = 'local_file',
  remote_url = 'remote_url',
}

export type VisionFile = {
  id?: string
  type: string
  transfer_method: TransferMethod
  url: string
  upload_file_id: string
  belongs_to?: string
}

export enum PromptMode {
  simple = 'simple',
  advanced = 'advanced',
}

export enum PromptRole {
  system = 'system',
  user = 'user',
  assistant = 'assistant',
}

export type PromptItem = {
  role?: PromptRole
  text: string
}

export type ChatPromptConfig = {
  prompt: PromptItem[]
}

export type ConversationHistoriesRole = {
  user_prefix: string
  assistant_prefix: string
}
export type CompletionPromptConfig = {
  prompt: PromptItem
  conversation_histories_role: ConversationHistoriesRole
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

export type UserInputFormItem = {
  'text-input': TextTypeFormItem
} | {
  'select': SelectTypeFormItem
} | {
  'paragraph': TextTypeFormItem
}

export enum TtsAutoPlay {
  enabled = 'enabled',
  disabled = 'disabled',
}

export type AnnotationReplyConfig = {
  id: string
  enabled: boolean
  score_threshold: number
  embedding_model: {
    embedding_provider_name: string
    embedding_model_name: string
  }
}

export enum AgentStrategy {
  functionCall = 'function_call',
  react = 'react',
}

export enum CollectionType {
  all = 'all',
  builtIn = 'builtin',
  custom = 'api',
  model = 'model',
  workflow = 'workflow',
}

export type AgentTool = {
  provider_id: string
  provider_type: CollectionType
  provider_name: string
  tool_name: string
  tool_label: string
  tool_parameters: Record<string, any>
  enabled: boolean
  isDeleted?: boolean
  notAuthor?: boolean
}

export type ToolItem = {
  dataset: {
    enabled: boolean
    id: string
  }
} | {
  'sensitive-word-avoidance': {
    enabled: boolean
    words: string[]
    canned_response: string
  }
} | AgentTool

export enum ModelModeType {
  'chat' = 'chat',
  'completion' = 'completion',
  'unset' = '',
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

export type Model = {
  /** LLM provider, e.g., OPENAI */
  provider: string
  /** Model name, e.g, gpt-3.5.turbo */
  name: string
  mode: ModelModeType
  /** Default Completion call parameters */
  completion_params: CompletionParams
}

export enum RETRIEVE_TYPE {
  oneWay = 'single',
  multiWay = 'multiple',
}

export enum RerankingModeEnum {
  RerankingModel = 'reranking_model',
  WeightedScore = 'weighted_score',
}

export enum Resolution {
  low = 'low',
  high = 'high',
}


export type DatasetConfigs = {
  retrieval_model: RETRIEVE_TYPE
  reranking_model: {
    reranking_provider_name: string
    reranking_model_name: string
  }
  top_k: number
  score_threshold_enabled: boolean
  score_threshold: number | null | undefined
  datasets: {
    datasets: {
      enabled: boolean
      id: string
    }[]
  }
  reranking_mode?: RerankingModeEnum
  weights?: {
    vector_setting: {
      vector_weight: number
      embedding_provider_name: string
      embedding_model_name: string
    }
    keyword_setting: {
      keyword_weight: number
    }
  }
  reranking_enable?: boolean
}
export type VisionSettings = {
  enabled: boolean
  number_limits: number
  detail: Resolution
  transfer_methods: TransferMethod[]
  image_file_size_limit?: number | string
}

export enum SupportUploadFileTypes {
  image = 'image',
  document = 'document',
  audio = 'audio',
  video = 'video',
  custom = 'custom',
}

export type FileEntity = {
  id: string
  name: string
  size: number
  type: string
  progress: number
  transferMethod: TransferMethod
  supportFileType: string
  originalFile?: File
  uploadedId?: string
  base64Url?: string
  url?: string
}



export type WorkflowProcess = {
  status: WorkflowRunningStatus
  tracing: any[]
  expand?: boolean // for UI
  resultText?: string
  files?: FileEntity[]
}

export type ChatItem = IChatItem & {
  isError?: boolean
  workflowProcess?: WorkflowProcess
  conversationId?: string
  allFiles?: FileEntity[]
}

export type CitationItem = {
  content: string
  data_source_type: string
  dataset_name: string
  dataset_id: string
  document_id: string
  document_name: string
  hit_count: number
  index_node_hash: string
  segment_id: string
  segment_position: number
  score: number
  word_count: number
}
export type MessageMore = {
  time: string
  tokens: number
  latency: number | string
}

export const MessageRatings = ['like', 'dislike', null] as const
export type MessageRating = typeof MessageRatings[number]

export type FeedbackType = {
  rating: MessageRating
  content?: string | null
}

export enum WorkflowRunningStatus {
  Waiting = 'waiting',
  Running = 'running',
  Succeeded = 'succeeded',
  Failed = 'failed',
  Stopped = 'stopped',
}

export type ThoughtItem = {
  id: string
  tool: string // plugin or dataset. May has multi.
  thought: string
  tool_input: string
  tool_labels?: any
  message_id: string
  observation: string
  position: number
  files?: string[]
  message_files?: FileEntity[]
}

export type IChatItem = {
  id: string
  content: string
  citation?: CitationItem[]
  /**
   * Specific message type
   */
  isAnswer: boolean
  /**
   * The user feedback result of this message
   */
  feedback?: FeedbackType
  /**
   * The admin feedback result of this message
   */
  adminFeedback?: FeedbackType
  /**
   * Whether to hide the feedback area
   */
  feedbackDisabled?: boolean
  /**
   * More information about this message
   */
  more?: MessageMore
  annotation?: AnyExpression
  useCurrentUserAvatar?: boolean
  isOpeningStatement?: boolean
  suggestedQuestions?: string[]
  log?: { role: string; text: string; files?: FileEntity[] }[]
  agent_thoughts?: ThoughtItem[]
  message_files?: FileEntity[]
  workflow_run_id?: string
  // for agent log
  conversationId?: string
  input?: any
  parentMessageId?: string
}

export type UploadFileSetting = {
  allowed_file_upload_methods: TransferMethod[]
  allowed_file_types: SupportUploadFileTypes[]
  allowed_file_extensions?: string[]
  max_length: number
  number_limits?: number
}

export type ModelConfig = {
  opening_statement: string
  suggested_questions?: string[]
  pre_prompt: string
  prompt_type: PromptMode
  chat_prompt_config: ChatPromptConfig | {}
  completion_prompt_config: CompletionPromptConfig | {}
  user_input_form: UserInputFormItem[]
  dataset_query_variable?: string
  more_like_this: {
    enabled?: boolean
  }
  suggested_questions_after_answer: {
    enabled: boolean
  }
  speech_to_text: {
    enabled: boolean
  }
  text_to_speech: {
    enabled: boolean
    voice?: string
    language?: string
    autoPlay?: TtsAutoPlay
  }
  retriever_resource: {
    enabled: boolean
  }
  sensitive_word_avoidance: {
    enabled: boolean
  }
  annotation_reply?: AnnotationReplyConfig
  agent_mode: {
    enabled: boolean
    strategy?: AgentStrategy
    tools: ToolItem[]
  }
  model: Model
  dataset_configs: DatasetConfigs
  file_upload?: {
    image: VisionSettings
  } & UploadFileSetting
  files?: VisionFile[]
  created_at?: number
  updated_at?: number
}

export type ChatConfig = Omit<ModelConfig, 'model'> & {
  supportAnnotation?: boolean
  appId?: string
  supportFeedback?: boolean
  supportCitationHitInfo?: boolean
}

export type OnSend = (message: string, files?: FileEntity[], last_answer?: ChatItem | null) => void

export type OnRegenerate = (chatItem: ChatItem) => void

export type Callback = {
  onSuccess: () => void
}

export type Feedback = {
  rating: 'like' | 'dislike' | null
}
