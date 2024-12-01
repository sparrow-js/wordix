import type { DocNode, ProcessingContext } from "../types/DocNode";
import { BaseHandler } from "./BaseHandler";

export class ListItemHandler extends BaseHandler {
  async before(node: DocNode, context: ProcessingContext): Promise<void> {
    // 添加列表项标记
    const bulletPoint = "- ";
    await this.emitStream(context, "message", bulletPoint);
    context.markdown.push(bulletPoint);
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
    // 处理列表项内容
    await this.toMarkdown(node, context);
  }

  async toMarkdown(node: DocNode, context: ProcessingContext): Promise<string> {
    const contentPromises =
      node.content?.map(async (child) => {
        const handler = context.handlers.get(child.type);
        return handler ? await handler.toMarkdown(child, context) : "";
      }) || [];

    const contents = await Promise.all(contentPromises);
    return `- ${contents.join("")}`;
  }
}
