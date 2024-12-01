
import { Node, mergeAttributes } from "@tiptap/core";

import { ReactNodeViewRenderer } from "@tiptap/react";
import { InputComp } from "./input";
import { v4 as uuidv4 } from 'uuid';

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
    input: {
        setInput: (options: any) => ReturnType;
    };
  }
}

/**
 * This extension adds support for mathematical symbols with LaTex expression.
 * 
 * @see https://katex.org/
 */
export const Input = Node.create<AtnOptions>({
  name: "input",
  inline: true,
  group: "inline",
  atom: true,
  selectable: true,
  marks: "",

  addAttributes() {
    return {
        id: {
            default: ''
        },
        label: {
            default: "input"
        },
        description: {
            default: 'description'
        },
        type: {
            default: 'text'
        }
    };
  },

  addOptions() {
    return {
      HTMLAttributes: {},
    };
  },

  addCommands() {
    return {
      setInput:
      (options: any) =>
        ({ commands }) => {
          return commands.insertContent({
            type: this.name,
            attrs: {
              ...options
            },
          });
      }
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
    return ReactNodeViewRenderer(InputComp);
  },
});
