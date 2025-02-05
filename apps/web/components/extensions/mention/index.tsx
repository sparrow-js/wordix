import { Node, mergeAttributes } from "@tiptap/core";

import { ReactNodeViewRenderer } from "@tiptap/react";
import { MentionComp } from "./mention";

export interface AtnOptions {
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
    mention: {
      setMention: (options: any) => ReturnType;
    };
  }
}

/**
 * This extension adds support for mathematical symbols with LaTex expression.
 *
 * @see https://katex.org/
 */
export const Mention = Node.create<AtnOptions>({
  name: "mention",
  inline: true,
  group: "inline",
  atom: true,
  selectable: true,
  marks: "",

  addAttributes() {
    return {
      mention: {
        default: "",
      },
      referenceId: {
        default: "",
      },
      type: {
        default: "",
      },
      path: {
        default: "",
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
      setMention:
        (options: any) =>
        ({ commands }) => {
          return commands.insertContent({
            type: this.name,
            attrs: {
              ...options,
            },
          });
        },
    };
  },

  parseHTML() {
    return [{ tag: `span[data-type="${this.name}"]` }];
  },

  renderHTML({ node, HTMLAttributes }) {
    const generation = node.attrs["mention"] ?? "";
    return [
      "span",
      mergeAttributes(HTMLAttributes, {
        "data-type": this.name,
      }),
      generation,
    ];
  },

  renderText({ node }) {
    return node.attrs["mention"] ?? "";
  },

  addNodeView() {
    return ReactNodeViewRenderer(MentionComp);
  },
});
