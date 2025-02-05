import type { DocNode, ProcessingContext } from "../types/DocNode";
import { BaseHandler } from "./BaseHandler";

export class HeadingHandler extends BaseHandler {
  async before(node: DocNode, context: ProcessingContext): Promise<void> {
    const level = node.attrs?.level || 1;
    const message = `${"#".repeat(level)} `;
    await this.emitStream(context, "message", message);
    context.markdown.push(message);
  }

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

    await this.toMarkdown(node, context);
  }

  async toMarkdown(node: DocNode, context: ProcessingContext): Promise<string> {
    const level = node.attrs?.level || 1;
    const contentPromises =
      node.content?.map(async (child) => {
        const handler = context.handlers.get(child.type);
        return handler ? await handler.toMarkdown(child, context) : "";
      }) || [];

    const contents = await Promise.all(contentPromises);
    return `${"#".repeat(level)} ${contents.join("")}`;
  }
}
