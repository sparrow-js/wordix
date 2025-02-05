import type { DocNode } from "../types/DocNode";

export abstract class BaseProcessor {
  abstract processNode(node: DocNode, inputs: Record<string, any>): Promise<any>;
}
