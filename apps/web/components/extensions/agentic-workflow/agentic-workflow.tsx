import { Button } from "@/components/ui/button";
import useStores from "@/hooks/useStores";
import type { AgenticWorkflowType } from "@/models/AgenticWorkflow";
import { NodeViewContent, NodeViewWrapper } from "@tiptap/react";
import type { NodeViewProps } from "@tiptap/react";
import { Bot } from "lucide-react";
import { Plus } from "lucide-react";
import { observer } from "mobx-react";
import { useEffect, useRef, useState } from "react";

export const AgenticWorkflowNode = observer((props: NodeViewProps) => {
  const domRef = useRef(null);
  const { workbench, setting, agenticWorkflows } = useStores();
  const [agenticWorkflow, setAgenticWorkflow] = useState<AgenticWorkflowType | null>(null);

  useEffect(() => {
    const workflow = agenticWorkflows.addAgenticWorkflow(
      {
        id: props.node.attrs.id,
        label: props.node.attrs.label,
        state: props.node.attrs.state,
      },
      props.node.content,
    );

    setAgenticWorkflow(workflow);

    return () => {
      agenticWorkflows.removeAgenticWorkflow(props.node.attrs.id, props.editor);
    };
  }, []);

  const handleInteraction = () => {
    agenticWorkflows.setSelectedId(props.node.attrs.id);
    agenticWorkflows.setNode(props.node);
    const { state, view } = props.editor;
    const pos = props.getPos();
    if (typeof pos === "number") {
      const nodePos = state.doc.resolve(pos);
      // @ts-ignore
      const selection = state.selection.constructor.create(state.doc, nodePos.pos);
      view.dispatch(state.tr.setSelection(selection));
    }
    agenticWorkflow?.updateData({
      content: props.node.content.content.map((item) => ({
        type: item.type.name,
        id: item.attrs.id,
        attrs: item.attrs,
      })),
    });
    setting.setSettingComponentName("agenticWorkflow");
    workbench.setShowSidebar();
  };

  return (
    <NodeViewWrapper
      ref={domRef}
      data-type="agenticWorkflow"
      className="mb-4 select-none rounded-lg border-2 bg-white p-3 pt-0 transition-colors duration-200 border-stone-100"
    >
      <div>
        <div
          className="relative left-0 ml-1 mt-[-1px] flex w-fit cursor-pointer items-center rounded-b-lg border-2 px-3 py-1 text-stone-400 transition-colors duration-200 hover:border-stone-200 active:border-stone-300 active:bg-stone-300 active:text-stone-600 border-stone-100 bg-stone-100 hover:bg-stone-200 hover:text-stone-500"
          contentEditable="false"
          role="button"
          tabIndex={0}
          onClick={handleInteraction}
          onKeyDown={(e) => {
            if (e.key === "Enter" || e.key === " ") {
              handleInteraction();
            }
          }}
        >
          <Bot />
          <span className="ml-2 mr-0.5 inline-block select-none align-middle text-xs font-semibold uppercase tracking-tight">
            {agenticWorkflow?.label}
          </span>
        </div>

        <NodeViewContent className="mt-4" as="div" />
       
      </div>
    </NodeViewWrapper>
  );
});
