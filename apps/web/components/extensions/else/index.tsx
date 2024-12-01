import useStores from "@/hooks/useStores";
import { Node, mergeAttributes } from "@tiptap/core";
import { NodeViewContent, NodeViewWrapper, ReactNodeViewRenderer } from "@tiptap/react";
import type { NodeViewProps } from "@tiptap/react";
import { observer } from "mobx-react";
import { useEffect, useRef } from "react";

const DetailsContentComponent = observer((props: NodeViewProps) => {
  const domRef = useRef(null);
  const { ifElses } = useStores();
  const parentNode = props.editor.state.doc.resolve(props.getPos()).parent;
  const parentId = parentNode.attrs.id;
  const currentIfElse = ifElses.get(parentId);

  useEffect(() => {
    if (!currentIfElse) {
      return;
    }

    currentIfElse.addItem({
      id: props.node.attrs.id,
      type: props.node.attrs.type,
      name: "else",
      expression: props.node.attrs.expression,
    });

    // return () => {
    //   currentIfElse.removeItem(props.node.attrs.id);
    // };
  }, [currentIfElse?.id]);

  return (
    <NodeViewWrapper ref={domRef} data-type="else">
      <div className="m-0 h-fit select-none p-0" style={{ whiteSpace: "normal" }}>
        <div className="px-3 pt-2">
          <div className="group flex cursor-pointer items-center">
            <div className="text-md w-fit cursor-pointer whitespace-nowrap font-semibold uppercase tracking-tight text-stone-300 group-hover:text-stone-400 group-active:text-stone-500">
              else
            </div>
            <div className="ml-3 h-fit font-mono text-sm font-semibold text-stone-200 group-hover:text-stone-300 group-active:text-stone-400"></div>
          </div>
          <NodeViewContent className="grow border-dashed px-2" as="div" />
        </div>
      </div>
    </NodeViewWrapper>
  );
});

export const Else = Node.create({
  name: "else",
  content: "block*",
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
      type: {
        default: "else",
      },
      expression: {
        default: {},
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
      }),
      0,
    ];
  },

  addNodeView() {
    return ReactNodeViewRenderer(DetailsContentComponent);
  },

  // addKeyboardShortcuts() {
  //   return {
  //     Enter: ({ editor }) => {
  //       // 键盘快捷键逻辑保持不变
  //       const { state, view } = editor;
  //       const { selection } = state;
  //       const { $from, empty } = selection;

  //       const parentNode = findParentNode((node) => node.type === this.type)(selection);

  //       if (!empty || !parentNode || !parentNode.node.childCount) {
  //         return false;
  //       }

  //       const index = $from.index(parentNode.depth);
  //       const { childCount } = parentNode.node;

  //       if (childCount !== index + 1) {
  //         return false;
  //       }

  //       const defaultType = parentNode.node.type.contentMatch.defaultType;
  //       const newNode = defaultType?.createAndFill();

  //       if (!newNode) {
  //         return false;
  //       }

  //       const resolvedPos = state.doc.resolve(parentNode.pos + 1);
  //       const lastChildIndex = childCount - 1;
  //       const lastChild = parentNode.node.child(lastChildIndex);
  //       const posAtIndex = resolvedPos.posAtIndex(lastChildIndex, parentNode.depth);

  //       if (!lastChild.eq(newNode)) {
  //         return false;
  //       }

  //       const grandparentNode = $from.node(-3);

  //       if (!grandparentNode) {
  //         return false;
  //       }

  //       const indexAfter = $from.indexAfter(-3);
  //       const nextBlockType = defaultBlockAt(grandparentNode.contentMatchAt(indexAfter));

  //       if (
  //         !nextBlockType ||
  //         !grandparentNode.canReplaceWith(indexAfter, indexAfter, nextBlockType)
  //       ) {
  //         return false;
  //       }

  //       const newBlock = nextBlockType.createAndFill();

  //       if (!newBlock) {
  //         return false;
  //       }

  //       const tr = state.tr;
  //       const insertPos = $from.after(-2);
  //       tr.replaceWith(insertPos, insertPos, newBlock);

  //       const resolvedInsertPos = tr.doc.resolve(insertPos);
  //       const newSelection = Selection.near(resolvedInsertPos, 1);
  //       tr.setSelection(newSelection);

  //       const deleteFrom = posAtIndex;
  //       const deleteTo = posAtIndex + lastChild.nodeSize;
  //       tr.delete(deleteFrom, deleteTo);
  //       tr.scrollIntoView();
  //       view.dispatch(tr);
  //       return true;
  //     },
  //   };
  // },
});

export default Else;
