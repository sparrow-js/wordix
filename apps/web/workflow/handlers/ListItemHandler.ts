import type { DocNode, ProcessingContext } from "../types/DocNode";
import { BaseHandler } from "./BaseHandler";

export class ListItemHandler extends BaseHandler {
  async before(node: DocNode, context: ProcessingContext): Promise<void> {
    if (context.tempParentNode && context.tempParentNode.type === "orderedList") {
      context.tempParentNode.listIndex = context.tempParentNode.listIndex || 0;
    }

    // 根据父节点类型决定列表标记
    const bulletPoint =
      context.tempParentNode?.type === "orderedList" ? `${(context.tempParentNode.listIndex || 0) + 1}. ` : "- ";

    await this.emitStream(context, "message", bulletPoint);
    context.markdown.push(bulletPoint);

    // 更新父节点的列表索引
    if (context.tempParentNode?.type === "orderedList") {
      context.tempParentNode.listIndex = (context.tempParentNode.listIndex || 0) + 1;
    }
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
    const prefix = context.tempParentNode?.type === "OrderedList" ? `${context.tempParentNode.listIndex || 0}. ` : "- ";
    return `${prefix}${contents.join("")}`;
  }
}
