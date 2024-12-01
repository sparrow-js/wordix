import type { DocNode, ProcessingContext } from "../types/DocNode";
import { BaseHandler } from "./BaseHandler";

export class MentionHandler extends BaseHandler {
  async handle(node: DocNode, context: ProcessingContext): Promise<void> {
    if (!node._state) {
      node._state = {
        executed: true,
        timestamp: Date.now(),
      };
    }

    const value = this.resolveValue(node, context);
    node._state.result = {
      value,
      referenceId: node.attrs.referenceId,
      path: node.attrs.path,
    };

    const markdown = await this.toMarkdown(node, context);
    context.markdown.push(markdown);
    await this.emitStream(context, "message", markdown);
  }

  async toMarkdown(node: DocNode, context: ProcessingContext): Promise<string> {
    const value = this.resolveValue(node, context);
    return `${value || node.attrs.referenceId}`;
  }

  private resolveValue(node: DocNode, context: ProcessingContext): any {
    const { referenceId, path } = node.attrs;

    let fullPath = referenceId;
    if (path) {
      fullPath = `${fullPath}${path}`;
    }

    const variable = context.variables.get(referenceId);

    if (!variable) {
      return undefined;
    }

    if (path) {
      return this.getNestedValue(variable.value, path);
    }

    return variable.value;
  }

  private getNestedValue(obj: any, path: string): any {
    const cleanPath = path.startsWith(".") ? path.slice(1) : path;
    const parts = cleanPath.split(".");

    let result = obj;
    for (const part of parts) {
      if (result == null || typeof result !== "object") {
        return undefined;
      }
      result = result[part];
    }

    return result;
  }
}
