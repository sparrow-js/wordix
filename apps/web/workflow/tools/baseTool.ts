import type { ToolResult } from "../types";

export abstract class BaseTool {
  constructor(protected context: any) {}

  abstract execute(input: any): Promise<ToolResult>;

  async validate(input: any): Promise<boolean> {
    return true;
  }
}
