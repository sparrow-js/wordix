export interface DocNode {
  type: string;
  attrs?: Record<string, any>;
  content?: DocNode[];
  text?: string;
  stop?: boolean;
  listIndex?: number;
  _state?: NodeState;
}

export interface NodeState {
  executed: boolean;
  timestamp: number;
  stopped?: boolean;
  waitingForInput?: boolean;
  result?: any;
  logs?: string[];
  error?: string;
}

export interface NodeHandler {
  handle(node: DocNode, context: ProcessingContext): Promise<void>;
  before?(node: DocNode, context: ProcessingContext): Promise<void>;
  after?(node: DocNode, context: ProcessingContext): Promise<void>;
  toMarkdown?(node: DocNode, context: ProcessingContext): Promise<string>;
}

export interface Variable {
  id: string;
  label?: string;
  description?: string;
  type: string;
  value: any;
}
// ... rest of the interfaces remain the same ...
// Add new types for workflow stream response
export interface WorkflowStreamResponse {
  type: "node_start" | "node_complete" | "node_stop" | "workflow_complete";
  node: DocNode;
  state?: NodeState;
  result?: any;
  timestamp: number;
}

// Update ProcessingContext to include stream response
export interface ProcessingContext {
  variables: Map<string, Variable>;
  depth: number;
  path: string[];
  markdown: string[];
  markdownOutput: string;
  messages: any[];
  handlers: Map<string, NodeHandler>;
  onStop?: (node: DocNode) => Promise<void>;
  inputData?: any;
  tempParentNode?: DocNode;
  onStreamResponse?: ({ event, data, stream }: any) => void;
}
