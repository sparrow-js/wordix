import type { BaseProcessor } from "../processors/baseProcessor";
import type { BaseTool } from "../tools/baseTool";

export class Registry {
  private tools: Map<string, BaseTool>;
  private processors: Map<string, BaseProcessor>;

  constructor() {
    this.tools = new Map();
    this.processors = new Map();
  }

  registerTool(name: string, tool: BaseTool): void {
    this.tools.set(name, tool);
  }

  registerProcessor(name: string, processor: BaseProcessor): void {
    this.processors.set(name, processor);
  }

  getTool(name: string): BaseTool | undefined {
    return this.tools.get(name);
  }

  getProcessor(name: string): BaseProcessor | undefined {
    return this.processors.get(name);
  }
}
