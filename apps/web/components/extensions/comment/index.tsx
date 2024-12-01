import { Node, mergeAttributes } from "@tiptap/core";

import { NodeViewContent, NodeViewWrapper, ReactNodeViewRenderer } from "@tiptap/react";
import { useRef } from "react";

const CustomNodeComponent = (props) => {
  const domRef = useRef(null);

  return (
    <NodeViewWrapper ref={domRef} data-type="comment" {...props.attributes}>
      <div className="border-l-4 border-stone-200 text-stone-400 pl-2 border-double italic" data-type="comment">
        <NodeViewContent as="div" />
      </div>
    </NodeViewWrapper>
  );
};

declare module "@tiptap/core" {
  interface Commands<ReturnType> {
    comment: {
      /**
       * Insert a tweet
       * @param options The tweet attributes
       * @example editor.commands.setTweet({ src: 'https://x.com/seanpk/status/1800145949580517852' })
       */
      setComment: (options: any) => ReturnType;
    };
  }
}

export const Comment = Node.create({
  name: "comment",

  group: "block",
  content: "block*",
  defining: true,
  selectable: false,
  isolating: true,
  draggable: true,

  addOptions() {
    return {
      HTMLAttributes: {},
    };
  },

  addNodeView() {
    return ReactNodeViewRenderer(CustomNodeComponent);
  },

  addCommands() {
    return {
      setComment:
        (options: any) =>
        ({ commands }) => {
          return commands.insertContent({
            type: this.name,
            content: [
              {
                type: "paragraph",
              },
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
      "div",
      mergeAttributes(this.options.HTMLAttributes, HTMLAttributes, {
        "data-type": this.name,
        class: "hidden", // Tailwind CSS 类，用于隐藏元素
      }),
      0,
    ];
  },

  addKeyboardShortcuts() {
    return {
      Backspace: ({ editor }) => {
        const { selection } = editor.state;
        const { $anchor } = selection;
        try {
          // Find the previous node
          const parentPos = $anchor.before();
          if (parentPos > 0) {
            // Use -1 to get the previous node before the current parent node
            const prevNode = editor.state.doc.nodeAt(parentPos - 1);

            if (prevNode) {
              console.log("Previous node:", prevNode);
            }
            // Check if the selection is at the start of an empty block within the loop node
            if (
              $anchor.parentOffset === 0 &&
              ($anchor.parent.type.name === this.name || (prevNode && prevNode.type.name === this.name))
            ) {
              return editor.commands.deleteNode(this.name);
            }

            return false; // Allow default behavior if conditions are not met
          }
        } catch (e) {}
      },
      Delete: ({ editor }) => {
        const { selection } = editor.state;
        const { $head } = selection;

        // Check if the selection is at the end of an empty block within the loop node
        if ($head.parentOffset === $head.parent.content.size && $head.parent.type.name === this.name) {
          return editor.commands.deleteNode(this.name);
        }

        return false; // Allow default behavior if conditions are not met
      },
      Enter: ({ editor }) => {
        console.log("Enter");
        const { state } = editor;
        const { selection, tr } = state;
        const { $from } = selection;
        const blockNode = $from.node(-1);

        if (blockNode?.type.name !== this.name) {
          return false; // Not in a comment node, use default behavior
        }

        const content = blockNode.content;
        const childCount = content.childCount;

        if (childCount > 0) {
          const lastNode = content.child(childCount - 1);

          if (lastNode.content.size === 0) {
            // Delete the last empty node
            tr.delete($from.end(-1) - lastNode.nodeSize, $from.end(-1));
            editor.view.dispatch(tr);
            // Insert a new paragraph node below the current node
            setTimeout(() => {
              const { state } = editor;
              const { selection, tr } = state;
              const { $from } = selection;
              // console.log($from.node(0));
              const newParagraph = state.schema.nodes.paragraph.create();

              tr.insert($from.end(-1) - 1, newParagraph);
              editor.view.dispatch(tr);
            }, 100);
            return true;
          }
        }

        return false; // Use default behavior
      },
    };
  },
});
