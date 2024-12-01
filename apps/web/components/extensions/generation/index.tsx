
import { Node, mergeAttributes } from "@tiptap/core";

import { NodeViewWrapper, NodeViewContent, ReactNodeViewRenderer, type ReactNodeViewRendererOptions } from "@tiptap/react";
import { GenerationComp } from "./generation";
import { v4 as uuidv4 } from 'uuid';

export interface GenerationOptions {
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
    generation: {

      setGeneration: (options: any) => ReturnType;

      setGenerationLabel: (width: number) => ReturnType


    };
  }
}

/**
 * This extension adds support for mathematical symbols with LaTex expression.
 * 
 * @see https://katex.org/
 */
export const Generation = Node.create<GenerationOptions>({
  name: "generation",
  inline: true,
  group: "inline",
  atom: true,
  selectable: true,
  marks: "",

  addAttributes() {
    return {
        generation: {
            default: ''
        },
        id: {
            default: ''
        },
        label: {
            default: ''
        },
        temperature: {
            default: ''
        },
        model: {
            default: ''
        },
        type: {
            default: ''
        },
        stopBefore: {
            default: []
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
    setGeneration:
      (options: any) =>
        ({ commands }) => {
          return commands.insertContent({
            type: this.name,
            attrs: {
                id: uuidv4(),
                label: 'new_generation',
                temperature: 0.6,
                model: 'gpt-4o',
                type: 'short',
                stopBefore: ['', '', '', '']
            },
          });
      },
      setGenerationLabel:
      label =>
      ({ commands }) => {
        return  commands.updateAttributes('generation', { label: label })
      }
    };
  },

  parseHTML() {
    return [{ tag: `span[data-type="${this.name}"]` }];
  },

  renderHTML({ node, HTMLAttributes }) {
    const generation = node.attrs["generation"] ?? "";
    return [
      "span",
      mergeAttributes(HTMLAttributes, {
        "data-type": this.name,
      }),
      generation,
    ];
  },

  renderText({ node }) {
    return node.attrs["generation"] ?? "";
  },

  addNodeView() {
    return ReactNodeViewRenderer(GenerationComp);
  },
});
