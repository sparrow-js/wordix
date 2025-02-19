// Define types for typing purposes
type Any = any;
type Dict<T> = { [key: string]: T };
type Tuple<T1, T2> = [T1, T2];

// Exception class
export class AgentError extends Error {
  message: string;

  constructor(message: string) {
    super(message);
    this.message = message;
    console.error(message);
  }

  dict(): Dict<string> {
    return { type: this.constructor.name, message: this.message };
  }
}

export class AgentParsingError extends AgentError {}
export class AgentExecutionError extends AgentError {}
export class AgentMaxStepsError extends AgentError {}
export class AgentGenerationError extends AgentError {}

// Utility function to check if a package is available
export function isPackageAvailable(packageName: string): boolean {
  try {
    require.resolve(packageName);
    return true;
  } catch {
    return false;
  }
}

// Utility function to make objects JSON serializable
export function makeJsonSerializable(obj: Any): Any {
  if (obj === null || obj === undefined) {
    return null;
  } else if (typeof obj === "string" || typeof obj === "number" || typeof obj === "boolean") {
    // Try to parse string as JSON if it looks like a JSON object/array
    if (typeof obj === "string") {
      try {
        if ((obj.startsWith("{") && obj.endsWith("}")) || (obj.startsWith("[") && obj.endsWith("]"))) {
          const parsed = JSON.parse(obj);
          return makeJsonSerializable(parsed);
        }
      } catch {
        // Ignore JSON parsing errors
      }
    }
    return obj;
  } else if (Array.isArray(obj)) {
    return obj.map((item) => makeJsonSerializable(item));
  } else if (typeof obj === "object") {
    const result: Dict<Any> = {};
    for (const [key, value] of Object.entries(obj)) {
      result[key] = makeJsonSerializable(value);
    }
    return result;
  } else {
    // Convert any other type to a string
    return String(obj);
  }
}

// Function to parse a JSON blob
export function parseJsonBlob(jsonBlob: string): Dict<string> {
  try {
    const firstAccoladeIndex = jsonBlob.indexOf("{");
    const lastAccoladeIndex = jsonBlob.lastIndexOf("}");
    jsonBlob = jsonBlob.slice(firstAccoladeIndex, lastAccoladeIndex + 1).replace(/\\"/g, "'");
    return JSON.parse(jsonBlob);
  } catch (error) {
    throw new AgentParsingError(`Error parsing JSON blob: ${error}`);
  }
}

// Function to parse code blobs
export function parseCodeBlobs(codeBlob: string): string {
  const pattern = /```(?:py|python)?\n(.*?)\n```/g;
  const matches = [...codeBlob.matchAll(pattern)];

  if (matches.length === 0) {
    throw new AgentParsingError(
      `Code snippet is invalid. Make sure to include code with the correct pattern, e.g., \`\`\`py\n# Your code here\n\`\`\``,
    );
  }

  return matches.map((match) => match[1].trim()).join("\n\n");
}

// Function to truncate content if it exceeds a maximum length
const MAX_LENGTH_TRUNCATE_CONTENT = 20000;
export function truncateContent(content: string, maxLength: number = MAX_LENGTH_TRUNCATE_CONTENT): string {
  if (content.length <= maxLength) {
    return content;
  } else {
    return (
      content.slice(0, maxLength / 2) +
      `\n..._This content has been truncated to stay below ${maxLength} characters_...\n` +
      content.slice(-maxLength / 2)
    );
  }
}

// Function to encode an image to Base64
export function encodeImageBase64(image: Buffer): string {
  return image.toString("base64");
}

// Function to create a Base64 image URL
export function makeImageUrl(base64Image: string): string {
  return `data:image/png;base64,${base64Image}`;
}

// Function to compare two methods (source code comparison)
export function isSameMethod(method1: Function, method2: Function): boolean {
  return method1.toString() === method2.toString();
}

// Function to compare two class items (methods or attributes)
export function isSameItem(item1: Any, item2: Any): boolean {
  if (typeof item1 === "function" && typeof item2 === "function") {
    return isSameMethod(item1, item2);
  } else {
    return item1 === item2;
  }
}

// Function to parse JSON tool calls
export function parseJsonToolCall(jsonBlob: string): Tuple<string, string | null> {
  jsonBlob = jsonBlob.replace(/```json/g, "").replace(/```/g, "");
  const toolCall = parseJsonBlob(jsonBlob);

  let toolNameKey: string | null = null;
  let toolArgumentsKey: string | null = null;

  for (const possibleToolNameKey of ["action", "tool_name", "tool", "name", "function"]) {
    if (possibleToolNameKey in toolCall) {
      toolNameKey = possibleToolNameKey;
    }
  }
  for (const possibleToolArgumentsKey of ["action_input", "tool_arguments", "tool_args", "parameters"]) {
    if (possibleToolArgumentsKey in toolCall) {
      toolArgumentsKey = possibleToolArgumentsKey;
    }
  }

  if (toolNameKey !== null) {
    if (toolArgumentsKey !== null) {
      return [toolCall[toolNameKey], toolCall[toolArgumentsKey]];
    } else {
      return [toolCall[toolNameKey], null];
    }
  }

  throw new AgentParsingError("No tool name key found in tool call!");
}
