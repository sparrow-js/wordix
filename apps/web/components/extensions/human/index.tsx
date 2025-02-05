import { Node, mergeAttributes } from '@tiptap/core'

import { NodeViewWrapper, NodeViewContent, ReactNodeViewRenderer, type ReactNodeViewRendererOptions } from "@tiptap/react";
import React, { useEffect, useRef } from 'react';
import { Repeat2} from 'lucide-react'

import type { Backpack } from 'lucide-react';
const CustomNodeComponent = (props) => {
    
    const domRef = useRef(null);
  
    return (
      <NodeViewWrapper
        ref={domRef}
        data-type="human"
        // className="hidden" // Tailwind CSS 类，用于隐藏元素
        {...props.attributes}
      >
        <div
        className="mb-4 select-none rounded-lg border-2 bg-white p-3 pt-0 transition-colors duration-200 border-stone-100"
        style={{ whiteSpace: 'normal' }}
        >
        <div
            className="relative left-0 ml-1 mt-[-1px] flex w-fit cursor-pointer items-center rounded-b-lg border-2 px-3 py-1 text-stone-400 transition-colors duration-200 hover:border-stone-200 active:border-stone-300 active:bg-stone-300 active:text-stone-600 border-stone-100 bg-stone-100 hover:bg-stone-200 hover:text-stone-500"
            contentEditable="false"
        >
            <Repeat2 />
            <span className="ml-2 mr-0.5 inline-block select-none align-middle text-xs font-semibold uppercase tracking-tight">
                new_loop
            </span>
        </div>
        <NodeViewContent className="mt-4" as="div" />
        </div>
           
       
      </NodeViewWrapper>
    );
};

declare module "@tiptap/core" {
  interface Commands<ReturnType> {
    loop: {
      /**
       * Insert a tweet
       * @param options The tweet attributes
       * @example editor.commands.setTweet({ src: 'https://x.com/seanpk/status/1800145949580517852' })
       */
      setLoop: (options: any) => ReturnType;
    };
  }
}

export const Human = Node.create({
  name: 'human',

  group: 'block',
  content: 'block*',
  defining: true,
  selectable: false,
  isolating: true,



  addOptions() {
    return {
      HTMLAttributes: {},
    };
  },

  addNodeView() {
    return ReactNodeViewRenderer(CustomNodeComponent);
  },

  draggable: true,

  addCommands() {
    return {
      setLoop:
        (options: any) =>
        ({ commands }) => {
          return commands.insertContent({
            type: this.name,
            content: [
              {
                type: 'paragraph'
              }
            ],
            attrs: options,
          });
        },
    };
  },

  parseHTML() {
    return [
      {
        tag: `div[data-type="${this.name}"]`,
      },
    ];
  },

  renderHTML({ HTMLAttributes }) {
    return [
      'div',
      mergeAttributes(this.options.HTMLAttributes, HTMLAttributes, {
        'data-type': this.name,
        class: 'hidden', // Tailwind CSS 类，用于隐藏元素
      }),
      0,
    ];
  },
  addKeyboardShortcuts() {
    return {
      Backspace: ({ editor }) => {
        const { selection } = editor.state;
        const { $anchor } = selection;


        // Find the previous node
        const parentPos = $anchor.before();
        if (parentPos > 0) {
            // Use -1 to get the previous node before the current parent node
            const prevNode = editor.state.doc.nodeAt(parentPos - 1);

            if (prevNode) {
                console.log('Previous node:', prevNode);
            }
        // Check if the selection is at the start of an empty block within the loop node
        if ($anchor.parentOffset === 0 && ($anchor.parent.type.name === this.name || (prevNode && prevNode.type.name === this.name))) {
            return editor.commands.deleteNode(this.name);
          }
  
          return false; // Allow default behavior if conditions are not met
            
        }

        return false;

      },
      Delete:  ({ editor }) => {
        debugger;
        const { selection } = editor.state;
        const { $head } = selection;

        // Check if the selection is at the end of an empty block within the loop node
        if ($head.parentOffset === $head.parent.content.size && $head.parent.type.name === this.name) {
          return editor.commands.deleteNode(this.name);
        }

        return false; // Allow default behavior if conditions are not met
      },
    };
  },
})