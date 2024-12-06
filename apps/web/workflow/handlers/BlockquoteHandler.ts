import type { DocNode, ProcessingContext } from "../types/DocNode";
import { BaseHandler } from "./BaseHandler";

export class BlockquoteHandler extends BaseHandler {
  async handle(node: DocNode, context: ProcessingContext): Promise<void> {
    if (!node._state) {
      node._state = {
        executed: true,
        timestamp: Date.now(),
      };
    }

    // Add blockquote start
    const startMessage = "\n> ";
    await this.emitStream(context, "message", startMessage);
    context.markdown.push(startMessage);

    // Process blockquote content
    await this.toMarkdown(node, context);

    // // Add blockquote end
    // const endMessage = "\n";
    // await this.emitStream(context, "message", endMessage);
    // context.markdown.push(endMessage);
  }

  async toMarkdown(node: DocNode, context: ProcessingContext): Promise<string> {
    const contentPromises =
      node.content?.map(async (child) => {
        const handler = context.handlers.get(child.type);
        return handler ? await handler.toMarkdown(child, context) : "";
      }) || [];

    const contents = await Promise.all(contentPromises);
    return `> ${contents.join("")}`;
  }
}
