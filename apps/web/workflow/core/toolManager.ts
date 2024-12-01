import type { BaseTool } from "../tools/baseTool";
import type { Registry } from "./registry";

export class ToolManager {
  constructor(private registry: Registry) {}

  async executeTool(toolName: string, input: any): Promise<any> {
    const tool = this.registry.getTool(toolName);
    if (!tool) {
      throw new Error(`Tool ${toolName} not found`);
    }

    const isValid = await tool.validate(input);
    if (!isValid) {
      throw new Error(`Invalid input for tool ${toolName}`);
    }

    return await tool.execute(input);
  }

  private async executeWithRetry(tool: BaseTool, input: any, attempt = 0): Promise<any> {
    try {
      return await Promise.race([tool.execute(input), this.createTimeout()]);
    } catch (error) {
      if (attempt < 3) {
        await new Promise((resolve) => setTimeout(resolve, 1000));
        return this.executeWithRetry(tool, input, attempt + 1);
      }
      throw error;
    }
  }

  private createTimeout(): Promise<never> {
    return new Promise((_, reject) => setTimeout(() => reject(new Error("Tool execution timeout")), 10000));
  }
}
