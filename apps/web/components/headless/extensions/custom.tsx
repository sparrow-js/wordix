import { Node, mergeAttributes } from '@tiptap/core'

import { NodeViewWrapper, NodeViewContent, ReactNodeViewRenderer, type ReactNodeViewRendererOptions } from "@tiptap/react";

const CustomNodeComponent = ({ node }: { node: Partial<ReactNodeViewRendererOptions> }) => {
    return (
      <NodeViewWrapper style={{ position: 'relative' }}>
        <label>React Component</label>
        <NodeViewContent className="content is-editable" />
      </NodeViewWrapper>
    );
};

declare module "@tiptap/core" {
  interface Commands<ReturnType> {
    custom: {
      /**
       * Insert a tweet
       * @param options The tweet attributes
       * @example editor.commands.setTweet({ src: 'https://x.com/seanpk/status/1800145949580517852' })
       */
      setCustom: (options: any) => ReturnType;
    };
  }
}

export const Custom = Node.create({
  name: 'custom',

  group: 'block',

  content: 'inline*',

  addOptions() {
    return {
      HTMLAttributes: {},
    };
  },

  addNodeView() {
    return ReactNodeViewRenderer(CustomNodeComponent, { attrs: this.options.HTMLAttributes });
  },

  draggable: true,

  addCommands() {
    return {
      setCustom:
        (options: any) =>
        ({ commands }) => {
          return commands.insertContent({
            type: this.name,
            attrs: options,
          });
        },
    };
  },

  parseHTML() {
    return [
      {
        tag: "div[data-custom]",
      },
    ];
  },

  renderHTML({ HTMLAttributes }) {
    return ["div", mergeAttributes({ "data-custom": "" }, HTMLAttributes)];
  },

  

  // Your code goes here.
})