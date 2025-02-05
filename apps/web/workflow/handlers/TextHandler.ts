import type { DocNode, ProcessingContext } from "../types/DocNode";
import { BaseHandler } from "./BaseHandler";

export class TextHandler extends BaseHandler {
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
    const markdown = await this.toMarkdown(node, context);
    context.markdown.push(markdown);
    await this.emitStream(context, "message", markdown);
  }

  async toMarkdown(node: DocNode, context: ProcessingContext): Promise<string> {
    return node.text || "";
  }
}
