import useStores from "@/hooks/useStores";
import { Node, mergeAttributes } from "@tiptap/core";
import { NodeViewContent, NodeViewWrapper, ReactNodeViewRenderer } from "@tiptap/react";
import type { NodeViewProps } from "@tiptap/react";
import { observer } from "mobx-react";
import { useEffect, useRef } from "react";

const DetailsContentComponent = observer((props: NodeViewProps) => {
  const domRef = useRef(null);
  const { ifElses, setting, workbench, mentions } = useStores();

  const parentNode = props.editor.state.doc.resolve(props.getPos()).parent;
  const parentId = parentNode.attrs.id;
  const currentIfElse = ifElses.get(parentId);
  // const editor = useEditor();

  useEffect(() => {
    if (!currentIfElse) {
      return;
    }

    console.log("currentIfElse", currentIfElse);

    currentIfElse.addItem({
      id: props.node.attrs.id,
      type: props.node.attrs.type,
      name: "if",
      expression: props.node.attrs.expression,
    });

    currentIfElse.updateData({
      // @ts-ignore
      content: parentNode.content?.content.map((item) => {
        return {
          type: item.type.name,
          id: item.attrs.id,
          attrs: item.attrs,
        };
      }),
    });

    return () => {
      currentIfElse.removeItem(props.node.attrs.id, props.editor);
    };
  }, []);

  const currentIf = currentIfElse?.data.get(props.node.attrs.id);

  useEffect(() => {
    if (currentIf) {
      props.updateAttributes({
        type: currentIf.type,
        expression: currentIf.expression,
      });
    }
  }, [currentIf?.type, currentIf?.expression]);

  const handleClick = (e: any) => {
    e.stopPropagation();
    const { doc } = props.editor.state;

    // 获取直接父节点
    let parentNode = null;

    doc.descendants((node) => {
      if (node.attrs?.id === currentIfElse?.id) {
        parentNode = node;

        return false; // Stop traversal
      }
      return true; // Continue traversal
    });

    ifElses.setSelectedId(parentNode.attrs.id);
    ifElses.setNode(parentNode);
    currentIfElse.updateData({
      content: parentNode.content?.content.map((item) => {
        return {
          type: item.type.name,
          id: item.attrs.id,
          attrs: item.attrs,
        };
      }),
    });
    setting.setSettingComponentName("ifElse");
    workbench.setShowSidebar();
  };

  return (
    <NodeViewWrapper ref={domRef} data-type="if">
      <div className="m-0 h-fit select-none p-0" style={{ whiteSpace: "normal" }}>
        <div className="px-3 pt-2">
          <div
            contentEditable="false"
            className="group flex cursor-pointer items-center"
            onClick={(e) => {
              e.stopPropagation();
              handleClick(e);
            }}
          >
            <div className="text-md w-fit cursor-pointer whitespace-nowrap font-semibold uppercase tracking-tight text-stone-300 group-hover:text-stone-400 group-active:text-stone-500">
              if
            </div>
            {/* <div className="ml-3 h-fit font-mono text-sm font-semibold text-stone-200 group-hover:text-stone-300 group-active:text-stone-400">
              <div className="w-fit">
                <div className="inline-block max-w-fit truncate align-bottom w-44">@loop (new).count</div>
                <span> == </span>
                <div className="inline-block max-w-fit truncate align-bottom w-44">@number</div>
              </div>
            </div> */}

            {currentIf && (
              <div className="ml-3 h-fit font-mono text-sm font-semibold text-stone-200 group-hover:text-stone-300 group-active:text-stone-400">
                {currentIf.type === "match" && (
                  <div className="w-fit">
                    <div className="inline-block max-w-fit truncate align-bottom w-44">
                      {mentions.parseMentionValue(currentIf.expression.match?.firstValue)}
                    </div>
                    <span> == </span>
                    <div className="inline-block max-w-fit truncate align-bottom w-44">
                      {mentions.parseMentionValue(currentIf.expression.match?.secondValue)}
                    </div>
                  </div>
                )}

                {currentIf.type === "contains" && (
                  <div className="w-fit">
                    <div className="inline-block max-w-fit truncate align-bottom w-44">
                      {mentions.parseMentionValue(currentIf.expression.contains?.value)}
                    </div>
                    <span> in </span>
                    <div className="inline-block max-w-fit truncate align-bottom w-44">
                      {mentions.parseMentionValue(currentIf.expression.contains?.searchValue)}
                    </div>
                  </div>
                )}

                {currentIf.type === "relative" && (
                  <div className="w-fit">
                    <div className="inline-block max-w-fit truncate align-bottom w-44">
                      {mentions.parseMentionValue(currentIf.expression.relative?.firstValue)}
                    </div>
                    <span> {currentIf.expression.relative?.comparator} </span>
                    <div className="inline-block max-w-fit truncate align-bottom w-44">
                      {mentions.parseMentionValue(currentIf.expression.relative?.secondValue)}
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>
          <NodeViewContent className="grow border-dashed px-2 border-b-2" as="div" />
        </div>
      </div>
    </NodeViewWrapper>
  );
});

export const If = Node.create({
  name: "if",
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
        default: "match",
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
});

export default If;
