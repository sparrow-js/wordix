import type { DocNode, ProcessingContext } from "../types/DocNode";
import { BaseHandler } from "./BaseHandler";

export class ParagraphHandler extends BaseHandler {
  async before(node: DocNode, context: ProcessingContext): Promise<void> {}

  async after(node: DocNode, context: ProcessingContext): Promise<void> {
    await this.emitStream(context, "message", "\n");
  }

  async handle(node: DocNode, context: ProcessingContext): Promise<void> {
    if (!node._state) {
      node._state = {
        executed: true,
        timestamp: Date.now(),
      };
    }

    const message = "\n";
    // await this.emitStream(context, "message", message);
    context.markdown.push(message);

    await this.toMarkdown(node, context);
  }

  async toMarkdown(node: DocNode, context: ProcessingContext): Promise<string> {
    const contentPromises =
      node.content?.map(async (child) => {
        const handler = context.handlers.get(child.type);
        return handler ? await handler.toMarkdown(child, context) : "";
      }) || [];

    const contents = await Promise.all(contentPromises);
    return contents.join("");
  }
}
