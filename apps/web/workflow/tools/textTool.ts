import type { ToolResult } from "../types";
import { BaseTool } from "./baseTool";

export class TextTool extends BaseTool {
  async execute(input: string): Promise<ToolResult<string>> {
    return {
      type: "text",
      content: input.toUpperCase(),
      timestamp: Date.now(),
    };
  }

  async validate(input: any): Promise<boolean> {
    return typeof input === "string";
  }
}
