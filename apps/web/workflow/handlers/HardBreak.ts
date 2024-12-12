import type { DocNode, ProcessingContext } from "../types/DocNode";
import { BaseHandler } from "./BaseHandler";

export class HardBreakHandler extends BaseHandler {
  async before(node: DocNode, context: ProcessingContext): Promise<void> {
    // console.log("text *********** before");
  }

  async after(node: DocNode, context: ProcessingContext): Promise<void> {
    // console.log("text *********** after");
  }

  async handle(node: DocNode, context: ProcessingContext): Promise<void> {
    if (!node._state) {
      node._state = {
        executed: true,
        timestamp: Date.now(),
      };
    }
    context.markdown.push("\n");
    await this.emitStream(context, "message", "\n");
  }

  async toMarkdown(node: DocNode, context: ProcessingContext): Promise<string> {
    return node.text || "";
  }
}
