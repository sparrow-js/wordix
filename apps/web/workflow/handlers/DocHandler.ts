import type { DocNode, NodeHandler, ProcessingContext } from "../types/DocNode";

export class DocHandler implements NodeHandler {
  async handle(node: DocNode, context: ProcessingContext): Promise<void> {
    // Handle document root node
    console.log("Processing document node");
  }
}
