import { Button } from "@/components/ui/button";
import { NodeViewContent, NodeViewWrapper } from "@tiptap/react";
import { observer } from "mobx-react";
import { useRef } from "react";
import { Hammer } from "lucide-react";
import { Plus } from "lucide-react";
import useStores from "@/hooks/useStores";
import { useState } from "react";
import { useEffect } from "react";
export const AgentToolNode = observer((props: any) => {
  const domRef = useRef<HTMLDivElement>(null);
  const { agentTools, setting, workbench } = useStores();
  const [agentTool, setAgentTool] = useState<any | null>(null);


  useEffect(() => {
    const tool = agentTools.addAgentTool(
      {
        id: props.node.attrs.id,
        label: props.node.attrs.label,
        state: props.node.attrs.state,
      },
    );
    setAgentTool(tool);
  }, []);

  const handleInteraction = () => {
    agentTools.setSelectedId(props.node.attrs.id);
    const { state, view } = props.editor;
    const pos = props.getPos();
    if (typeof pos === "number") {
      const nodePos = state.doc.resolve(pos);
      // @ts-ignore
      const selection = state.selection.constructor.create(state.doc, nodePos.pos);
      view.dispatch(state.tr.setSelection(selection));
    }
    agentTool?.updateData({
      content: props.node.content.content.map((item) => ({
        type: item.type.name,
        id: item.attrs.id,
        attrs: item.attrs,
      })),
    });
    setting.setSettingComponentName("agentTool");
    workbench.setShowSidebar();
  };

  return (
    <NodeViewWrapper ref={domRef} data-type="agentTool" draggable="true" data-drag-handle className="cursor-move">
      <div className="bg-white border-y border-gray-200 mt-4" contentEditable="false">
        <h2 className="px-4 text-lg font-medium text-gray-800 my-4 flex items-center gap-2"
            onClick={handleInteraction}
            onKeyDown={(e) => {
                if (e.key === "Enter" || e.key === " ") {
                    handleInteraction();
                }
            }}
        >
            <Hammer className="w-4 h-4" />
            Tool
        </h2>
        <div className="w-full h-px bg-gray-200" />
        <NodeViewContent className="grow px-2" as="div" />
        <div className="flex justify-center gap-2 my-4">
          {/* <Button
            variant="outline"
            size="sm"
            onClick={() => {
              console.log("add tool agent", props.node.attrs.id);
              props.editor
                .chain()
                .focus()
                .setToolAgent({
                  selectedId: props.node.attrs.id,
                })
                .run();
            }}
          >
            <Plus className="w-4 h-4 mr-1" /> Add Agent
          </Button> */}
          <Button
            variant="outline"
            size="sm"
            onClick={() => {
              console.log("add tool agent", props.node.attrs.id);
              props.editor
                .chain()
                .focus()
                .setToolWorkflow({
                  selectedId: props.node.attrs.id,
                })
                .run();
            }}
          >
            <Plus className="w-4 h-4 mr-1" /> Add Workflow
          </Button>
        </div>
      </div>
    </NodeViewWrapper>
  );
});
