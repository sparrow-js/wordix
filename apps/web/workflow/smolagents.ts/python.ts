import { AgentLogger } from "./monitoring";
import { Tool } from "./tools";

export const BASE_BUILTIN_MODULES = [
  "math",
  "random",
  "datetime",
  "json",
  "re",
  // Add other allowed builtin modules
];

export class LocalPythonInterpreter {
  constructor(
    private additionalAuthorizedImports: string[],
    private tools: Record<string, Tool>,
    private maxPrintOutputsLength?: number
  ) {}

  state: Record<string, any> = {};

  async call(code: string, state: Record<string, any>): Promise<[any, string, boolean]> {
    // Implementation to be added
    return ['The current weather in New York is Clear with a temperature of -2 °C.', code, true];
  }
}

export class E2BExecutor {
  constructor(
    private additionalAuthorizedImports: string[],
    private tools: Tool[],
    private logger: AgentLogger
  ) {}

  state: Record<string, any> = {};

  call(code: string, state: Record<string, any>): [any, string, boolean] {
    // Implementation to be added
    return [null, "", false];
  }
} 