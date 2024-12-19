import { Node, mergeAttributes } from "@tiptap/core";

import useStores from "@/hooks/useStores";
import type { IfElseType } from "@/models/IfElse";
import { NodeViewContent, NodeViewWrapper, ReactNodeViewRenderer } from "@tiptap/react";
import type { NodeViewProps } from "@tiptap/react";
import { cloneDeep } from "lodash";
import { Repeat2 } from "lucide-react";
import { observer } from "mobx-react";
import { useEffect, useRef, useState } from "react";
import { v4 as uuidv4 } from "uuid";

const expression = {
  match: {
    firstValue: {
      type: "literal",
      value: "",
    },
    secondValue: {
      type: "literal",
      value: "",
    },
    ignoreCase: true,
    ignoreWhitespace: true,
    ignoreSymbols: true,
  },
  contains: {
    value: {
      type: "literal",
      value: "",
    },
    searchValue: {
      type: "literal",
      value: "",
    },
    ignoreCase: true,
    ignoreWhitespace: true,
    ignoreSymbols: true,
  },
  relative: {
    firstValue: {
      type: "literal",
      value: "",
    },
    secondValue: {
      type: "literal",
      value: "",
    },
    comparator: "gt",
  },
  else: true,
};

const CustomNodeComponent = observer((props: NodeViewProps) => {
  const domRef = useRef(null);
  const { workbench, setting, ifElses } = useStores();

  const [ifElse, setIfElse] = useState<IfElseType | null>(null);

  useEffect(() => {
    const ifElse = ifElses.addIfElse(
      {
        id: props.node.attrs.id,
        label: props.node.attrs.label,
        state: props.node.attrs.state,
      },
      props.node.content,
    );

    setIfElse(ifElse);

    return () => {
      ifElses.removeIfElse(props.node.attrs.id, props.editor);
    };
  }, []);

  useEffect(() => {
    // if (ifElse) {
    //   props.updateAttributes({
    //     label: ifElse.label,
    //   });
    // }
  }, [ifElse?.label]);

  return (
    <NodeViewWrapper
      ref={domRef}
      data-type="ifElse"
      className="mb-4 select-none rounded-lg border-2 bg-white p-3 pt-0 transition-colors duration-200 border-stone-100"
    >
      <div>
        <div
          className="relative left-0 ml-1 mt-[-1px] flex w-fit cursor-pointer items-center rounded-b-lg border-2 px-3 py-1 text-stone-400 transition-colors duration-200 hover:border-stone-200 active:border-stone-300 active:bg-stone-300 active:text-stone-600 border-stone-100 bg-stone-100 hover:bg-stone-200 hover:text-stone-500"
          contentEditable="false"
          onClick={() => {
            ifElses.setSelectedId(props.node.attrs.id);
            ifElses.setNode(props.node);
            // Set editor selection to current node
            const { state, view } = props.editor;
            const pos = props.getPos();
            if (typeof pos === "number") {
              const nodePos = state.doc.resolve(pos);
              // @ts-ignore
              const selection = state.selection.constructor.create(state.doc, nodePos.pos);
              view.dispatch(state.tr.setSelection(selection));
            }
            ifElse.updateData({
              // @ts-ignore
              content: props.node.content.content.map((item) => {
                return {
                  type: item.type.name,
                  id: item.attrs.id,
                  attrs: item.attrs,
                };
              }),
            });
            setting.setSettingComponentName("ifElse");
            workbench.setShowSidebar();
          }}
        >
          <Repeat2 />
          <span className="ml-2 mr-0.5 inline-block select-none align-middle text-xs font-semibold uppercase tracking-tight">
            {ifElse?.label}
          </span>
        </div>
        <NodeViewContent className="mt-4" as="div" />
      </div>
    </NodeViewWrapper>
  );
});

declare module "@tiptap/core" {
  interface Commands<ReturnType> {
    ifElse: {
      /**
       * Insert a tweet
       * @param options The tweet attributes
       * @example editor.commands.setTweet({ src: 'https://x.com/seanpk/status/1800145949580517852' })
       */
      setIfElse: (options: any) => ReturnType;

      setIf: (options: any) => ReturnType;
    };
  }
}

export const IfElse = Node.create({
  name: "ifElse",

  group: "block",
  content: "if* else*",
  defining: true,
  selectable: false,
  isolating: true,

  addOptions() {
    return {
      HTMLAttributes: {},
    };
  },

  addAttributes() {
    return {
      id: {
        default: "",
      },
      label: {
        default: "",
      },
      state: {
        default: "editor",
      },
    };
  },

  addNodeView() {
    return ReactNodeViewRenderer(CustomNodeComponent);
  },

  draggable: true,

  addCommands() {
    return {
      setIfElse:
        (options: any) =>
        ({ commands }) => {
          return commands.insertContent({
            type: this.name,
            attrs: {
              id: options?.id || uuidv4(),
              label: options?.label || "If/Else",
              state: options?.state || "default",
            },
            content: [
              {
                type: "if",
                content: [
                  {
                    type: "paragraph",
                  },
                ],
                attrs: {
                  id: uuidv4(),
                  expression: cloneDeep(expression),
                },
              },
              {
                type: "else",
                content: [
                  {
                    type: "paragraph",
                  },
                ],
              },
            ],
          });
        },
      setIf:
        (options: any) =>
        ({ commands, state, chain }) => {
          const { tr } = state;

          // Find the selected ifElse node position
          let foundNode = null;
          tr.doc.descendants((node, pos) => {
            if (node.type.name === "ifElse" && node.attrs.id === options.selectedId) {
              foundNode = { node, pos };
              return false;
            }
          });

          if (!foundNode) {
            console.log("Selected ifElse node not found");
            return false;
          }

          const { node: ifElseNode, pos: ifElsePos } = foundNode;
          console.log("Found ifElse node at pos:", ifElsePos);

          // Get the position of the last 'if' node or the start position
          let insertPos = ifElsePos + 1; // Start after the opening tag
          let lastIfNode = null;

          ifElseNode.forEach((child, offset) => {
            if (child.type.name === "if") {
              lastIfNode = { node: child, offset };
            }
          });

          if (lastIfNode) {
            insertPos = ifElsePos + 1 + lastIfNode.offset + lastIfNode.node.nodeSize;
          }

          return chain()
            .insertContentAt(insertPos, {
              type: "if",
              content: [
                {
                  type: "paragraph",
                },
              ],
              attrs: {
                id: uuidv4(),
                expression: cloneDeep(expression),
              },
            })
            .run();
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

        return false;
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
    };
  },
});
