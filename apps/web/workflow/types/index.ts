export interface Config {
  ai: {
    model: string;
    temperature: number;
    maxTokens: number;
  };
  workflow: {
    maxRetries: number;
    timeout: number;
    concurrency: number;
  };
  processors: {
    batch: {
      size: number;
      interval: number;
    };
  };
  tools: {
    timeout: number;
    retryAttempts: number;
    retryDelay: number;
  };
}

export interface ToolResult<T = any> {
  type: string;
  content: T;
  timestamp: number;
}

export interface PipelineStep {
  tool: string;
  optional?: boolean;
  transform?: (context: PipelineContext) => any;
  output?: (result: any) => any;
}

export interface PipelineContext {
  input: any;
  results: PipelineStepResult[];
  startTime: number;
}

export interface PipelineStepResult {
  success: boolean;
  toolName: string;
  result?: any;
  error?: string;
  context: PipelineContext;
}

export interface PipelineResult {
  pipelineName: string;
  results: PipelineStepResult[];
  duration: number;
}
