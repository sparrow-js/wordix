import { Node, mergeAttributes } from "@tiptap/core";

import { ReactNodeViewRenderer } from "@tiptap/react";
import { nanoid } from "nanoid";
import { GenerationComp } from "./generation";

export interface ImageGenerationOptions {
  /**
   * By default LaTeX decorations can render when mathematical expressions are not inside a code block.
   * @param state - EditorState
   * @param pos - number
   * @returns boolean
   */

  /**
   * @see https://katex.org/docs/options.html
   */

  HTMLAttributes: Record<string, any>;
}

declare module "@tiptap/core" {
  interface Commands<ReturnType> {
    imageGeneration: {
      setImageGeneration: (options: any) => ReturnType;
    };
  }
}

/**
 * This extension adds support for mathematical symbols with LaTex expression.
 *
 * @see https://katex.org/
 */
export const ImageGeneration = Node.create<ImageGenerationOptions>({
  name: "imageGeneration",
  inline: true,
  group: "inline",
  atom: true,
  selectable: true,
  marks: "",

  addAttributes() {
    return {
      id: {
        default: "",
      },
      label: {
        default: "",
      },
      model: {
        default: "",
      },
      aspect_ratio: {
        default: "",
      },
      generationType: {
        default: "image",
      },
    };
  },

  addOptions() {
    return {
      HTMLAttributes: {},
    };
  },

  addCommands() {
    return {
      setImageGeneration:
        (options: any) =>
        ({ commands }) => {
          return commands.insertContent({
            type: this.name,
            attrs: {
              id: nanoid(10),
              label: "image_generation",
              model: "dall-e-3",
              aspect_ratio: "1:1",
              generationType: "image",
            },
          });
        },
      setGenerationLabel:
        (label) =>
        ({ commands }) => {
          return commands.updateAttributes("generation", { label: label });
        },
    };
  },

  parseHTML() {
    return [{ tag: `span[data-type="${this.name}"]` }];
  },

  renderHTML({ node, HTMLAttributes }) {
    const generation = node.attrs["imageGeneration"] ?? "";
    return [
      "span",
      mergeAttributes(HTMLAttributes, {
        "data-type": this.name,
      }),
      generation,
    ];
  },

  renderText({ node }) {
    return node.attrs["imageGeneration"] ?? "";
  },

  addNodeView() {
    return ReactNodeViewRenderer(GenerationComp);
  },
});
