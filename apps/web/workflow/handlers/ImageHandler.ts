import type { DocNode, ProcessingContext } from "../types/DocNode";
import { BaseHandler } from "./BaseHandler";

interface ImageAttrs {
  src: string;
  alt?: string;
  title?: string;
  width?: string;
  height?: string;
}

export class ImageHandler extends BaseHandler {
  async before(node: DocNode, context: ProcessingContext): Promise<void> {
    if (!node._state) {
      node._state = {
        executed: false,
        timestamp: Date.now(),
      };
    }
  }

  async handle(node: DocNode, context: ProcessingContext): Promise<void> {
    const attrs = node.attrs as ImageAttrs;

    // Convert image to markdown format
    const alt = attrs.alt || "";
    const title = attrs.title ? ` "${attrs.title}"` : "";
    const dimensions = [];

    if (attrs.width) dimensions.push(`width="${attrs.width}"`);
    if (attrs.height) dimensions.push(`height="${attrs.height}"`);

    const dimensionsStr = dimensions.length > 0 ? ` ${dimensions.join(" ")}` : "";
    const markdown = `![${alt}](${attrs.src}${title})${dimensionsStr}`;

    if (context.markdown.join("") !== "") {
      const prompt = context.markdown.join("\n");
      context.messages.push({
        type: "text",
        text: prompt,
      });
    }
    context.messages.push({
      type: "image",
      image: attrs.src,
      experimental_providerMetadata: {
        openai: { imageDetail: "high" },
      },
    });
    context.markdown = [];

    context.markdown.push(markdown);
    node._state!.executed = true;

    await this.emitStream(context, "message", markdown);
  }

  async after(node: DocNode, context: ProcessingContext): Promise<void> {
    await this.emitStream(context, "message", "\n");
  }

  async toMarkdown(node: DocNode, context: ProcessingContext): Promise<string> {
    const attrs = node.attrs as ImageAttrs;
    const alt = attrs.alt || "";
    const title = attrs.title ? ` "${attrs.title}"` : "";
    const dimensions = [];

    if (attrs.width) dimensions.push(`width="${attrs.width}"`);
    if (attrs.height) dimensions.push(`height="${attrs.height}"`);

    const dimensionsStr = dimensions.length > 0 ? ` ${dimensions.join(" ")}` : "";
    return `![${alt}](${attrs.src}${title})${dimensionsStr}`;
  }
}
