import type { DocNode, NodeHandler, ProcessingContext } from "../types/DocNode";

export abstract class BaseHandler implements NodeHandler {
  abstract handle(node: DocNode, context: ProcessingContext): Promise<void>;
  abstract toMarkdown(node: DocNode, context: ProcessingContext): Promise<string>;
  async before?(node: DocNode, context: ProcessingContext): Promise<void> {}
  async after?(node: DocNode, context: ProcessingContext): Promise<void> {}

  protected async emitStream(context: ProcessingContext, event: string, data?: any, stream = true): Promise<void> {
    if (context.onStreamResponse) {
      await context.onStreamResponse({ event, data, stream });
    }
  }
}
