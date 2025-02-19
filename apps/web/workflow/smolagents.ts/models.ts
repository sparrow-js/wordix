export interface ChatMessageToolCallDefinition {
  arguments: any;
  name: string;
  description?: string;

  fromHfApi(toolCallDefinition: any): ChatMessageToolCallDefinition;
}

export interface ChatMessageToolCall {
  function: ChatMessageToolCallDefinition;
  id: string;
  type: string;

  fromHfApi(toolCall: any): ChatMessageToolCall;
}

export interface ChatMessage {
  role: string;
  content?: string | Array<{type: string; text: string}>;
  tool_calls?: ChatMessageToolCall[];
  raw?: any;

  modelDumpJson(): string;
  fromHfApi(message: any, raw: any): ChatMessage;
  fromDict(data: any): ChatMessage;
  dict(): string;
}

export enum MessageRole {
  USER = "user",
  ASSISTANT = "assistant",
  SYSTEM = "system",
  TOOL_CALL = "tool-call",
  TOOL_RESPONSE = "tool-response",
}

export const toolRoleConversions = {
  [MessageRole.TOOL_CALL]: MessageRole.ASSISTANT,
  [MessageRole.TOOL_RESPONSE]: MessageRole.USER,
};

export function getDictFromNestedDataclasses(obj: any, ignoreKey?: string): any {
  function convert(obj: any): any {
    if (obj && typeof obj === "object" && !Array.isArray(obj) && "__dataclass_fields__" in obj) {
      const result: any = {};
      for (const key in obj) {
        if (key !== ignoreKey) {
          result[key] = convert(obj[key]);
        }
      }
      return result;
    }
    return obj;
  }

  return convert(obj);
}

export class ChatMessageToolCallDefinitionImpl implements ChatMessageToolCallDefinition {
  arguments: any;
  name: string;
  description?: string;

  constructor(args: any, name: string, description?: string) {
    this.arguments = args;
    this.name = name;
    this.description = description;
  }

  fromHfApi(toolCallDefinition: any): ChatMessageToolCallDefinition {
    return ChatMessageToolCallDefinitionImpl.fromHfApi(toolCallDefinition);
  }

  static fromHfApi(toolCallDefinition: any): ChatMessageToolCallDefinition {
    return new ChatMessageToolCallDefinitionImpl(
      toolCallDefinition.arguments,
      toolCallDefinition.name,
      toolCallDefinition.description,
    );
  }
}

export class ChatMessageToolCallImpl implements ChatMessageToolCall {
  function: ChatMessageToolCallDefinition;
  id: string;
  type: string;

  constructor(func: ChatMessageToolCallDefinition, id: string, type: string) {
    this.function = func;
    this.id = id;
    this.type = type;
  }

  fromHfApi(toolCall: any): ChatMessageToolCall {
    return ChatMessageToolCallImpl.fromHfApi(toolCall);
  }

  static fromHfApi(toolCall: any): ChatMessageToolCall {
    return new ChatMessageToolCallImpl(
      ChatMessageToolCallDefinitionImpl.fromHfApi(toolCall.function),
      toolCall.id,
      toolCall.type,
    );
  }
}

export class ChatMessageImpl implements ChatMessage {
  role: string;
  content?: string | Array<{type: string; text: string}>;
  toolCalls?: ChatMessageToolCall[];
  raw?: any;

  constructor(role: string, content?: string | Array<{type: string; text: string}>, toolCalls?: ChatMessageToolCall[], raw?: any) {
    this.role = role;
    this.content = content;
    this.toolCalls = toolCalls;
    this.raw = raw;
  }

  modelDumpJson(): string {
    return JSON.stringify(getDictFromNestedDataclasses(this, "raw"));
  }

  fromHfApi(message: any, raw: any): ChatMessage {
    return ChatMessageImpl.fromHfApi(message, raw);
  }

  fromDict(data: any): ChatMessage {
    return ChatMessageImpl.fromDict(data);
  }

  dict(): string {
    return JSON.stringify(getDictFromNestedDataclasses(this));
  }

  static fromHfApi(message: any, raw: any): ChatMessage {
    let toolCalls = undefined;
    if (message.tool_calls) {
      toolCalls = message.tool_calls.map((toolCall: any) => ChatMessageToolCallImpl.fromHfApi(toolCall));
    }
    return new ChatMessageImpl(message.role, message.content, toolCalls, raw);
  }

  static fromDict(data: any): ChatMessage {
    if (data.tool_calls) {
      const toolCalls = data.tool_calls.map((tc: any) => {
        return new ChatMessageToolCallImpl(
          new ChatMessageToolCallDefinitionImpl(tc.function.arguments, tc.function.name, tc.function.description),
          tc.id,
          tc.type,
        );
      });
      data.tool_calls = toolCalls;
    }
    return new ChatMessageImpl(data.role, data.content, data.tool_calls, data.raw);
  }
}

export function parseJsonIfNeeded(
  args: string | object
): string | object {
  if (typeof args === "object") {
    return args;
  }
  try {
    return JSON.parse(args);
  } catch (e) {
    return args;
  }
}

export function parseToolArgsIfNeeded(message: ChatMessage): ChatMessage {
  if (message.tool_calls  ) {
    for (const toolCall of message.tool_calls) {
      toolCall.function.arguments = parseJsonIfNeeded(toolCall.function.arguments);
    }
  }
  return message;
}

// Other utility functions
export function removeStopSequences(content: string, stopSequences: string[]): string {
  for (const stopSeq of stopSequences) {
    if (content.endsWith(stopSeq)) {
      content = content.substring(0, content.length - stopSeq.length);
    }
  }
  return content;
}

// Example of extending to implement a Model class
export abstract class Model {
  lastInputTokenCount?: number;
  lastOutputTokenCount?: number;
  kwargs: Record<string, any>;

  constructor(kwargs: Record<string, any>) {
    this.kwargs = kwargs;
  }

  abstract call(
    messages: Array<{ role: string; content: string }>,
    stopSequences?: string[],
    grammar?: string,
    toolsToCallFrom?: Array<any>,
    images?: Array<any>,
  ): ChatMessage;

  getTokenCounts(): Record<string, number | undefined> {
    return {
      inputTokenCount: this.lastInputTokenCount,
      outputTokenCount: this.lastOutputTokenCount,
    };
  }
}
