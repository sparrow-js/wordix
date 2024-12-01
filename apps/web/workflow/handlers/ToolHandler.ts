import type { ToolManager } from "../core/toolManager";
import type { DocNode, ProcessingContext } from "../types/DocNode";
import { BaseHandler } from "./BaseHandler";

interface ParameterValue {
  type: "literal" | "variable";
  value: string;
}

interface ToolAttrs {
  id: string;
  label: string;
  toolId: string;
  outputs: string;
  parameters: Record<string, ParameterValue>;
  includeOutput: string;
}

export class ToolHandler extends BaseHandler {
  constructor(private toolManager: ToolManager) {
    super();
  }

  async before(node: DocNode, context: ProcessingContext): Promise<void> {
    if (!node._state) {
      node._state = {
        executed: false,
        timestamp: Date.now(),
        result: null,
      };
    }
  }

  async handle(node: DocNode, context: ProcessingContext): Promise<void> {
    const attrs = node.attrs as ToolAttrs;
    // Resolve parameter values
    const resolvedParameters: Record<string, any> = {};
    for (const [key, param] of Object.entries(attrs.parameters)) {
      resolvedParameters[key] = await this.resolveParameterValue(param, context);
    }

    const result = await this.toolManager.executeTool(attrs.toolId, resolvedParameters);

    // const aiService = ServiceFactory.getInstance().getAIService();
    // const result = await aiService.generateImage(
    //   "flux",
    //   "Two children, a boy and a girl, riding backwards by the cowboy lake to play",
    // );

    // if (result && result.content) {
    //   const imageUrl = result.content;
    //   // Convert to markdown image format before emitting
    //   const markdownImage = `\n ![Generated Image](${imageUrl})`;
    //   this.emitStream(context, "message", markdownImage);
    // }

    // Store the execution result with the image data
    node._state!.result = {
      parameters: resolvedParameters,
      toolId: attrs.toolId,
      output: {
        // images: result.images,
        // timings: result.timings,
        // seed: result.seed,
        // created: result.created,
      },
    };

    node._state!.executed = true;

    // Emit the tool execution event
    await this.emitStream(context, "tool_complete", {
      id: attrs.id,
      toolId: attrs.toolId,
      parameters: resolvedParameters,
      result: node._state!.result,
    });
  }

  private async resolveParameterValue(param: ParameterValue, context: ProcessingContext): Promise<any> {
    if (param.type === "literal") {
      return param.value;
    }

    if (param.type === "variable") {
      return context.variables.get(param.value)?.value;
    }

    return undefined;
  }

  async toMarkdown(node: DocNode, context: ProcessingContext): Promise<string> {
    const attrs = node.attrs as ToolAttrs;
    const state = node._state?.result;

    if (!state) {
      return "";
    }

    // Format parameters for display
    const parameters = Object.entries(state.parameters)
      .map(([key, value]) => `  ${key}: ${value}`)
      .join("\n");

    return `Tool: ${attrs.label}\nID: ${attrs.toolId}\nParameters:\n${parameters}`;
  }
}
