import { Button } from "@/components/ui/button";
import { NodeViewContent, NodeViewWrapper } from "@tiptap/react";
import { observer } from "mobx-react";
import { useRef } from "react";
import { Bot } from "lucide-react";
import { useState, useEffect } from "react";
import useStores from "@/hooks/useStores";

export const ToolAgentNode = observer((props: any) => {
  const domRef = useRef<HTMLDivElement>(null);
  const toolAttrs = props.node?.attrs || {};

  const parameters = toolAttrs.parameters || {};
  const { agentTools, setting, workbench, documents } = useStores();
  const [agentTool, setAgentTool] = useState<any | null>(null);


  const init = async (tool, promptId) => {
    if (promptId && tool) {
      const { document: documentInfo } = await documents.fetchWithSharedTree(promptId);

      const inputs = documentInfo?.content?.content
        ?.find((item) => item.type === "inputs")
        .content?.map((input) => {
          return {
            ...input.attrs,
          };
        });
      const parameters = {};

      if (inputs) {
        inputs.map((input) => {
          parameters[input.id] = {
            type: "literal",
            value: "",
          };
        });
      }

      tool.update({
        promptId: toolAttrs.promptId,
        document: documentInfo,
        inputs,
      });
    }
  };


  useEffect(() => {
    const tool = agentTools.addAgentTool(
      {
        id: props.node.attrs.id,
        label: props.node.attrs.label,
        flowLabel: props.node.attrs.flowLabel,
        state: props.node.attrs.state,
        description: props.node.attrs.description,
        promptId: toolAttrs.promptId,
        parameters,
      },
    );
    init(tool, toolAttrs.promptId);
    setAgentTool(tool);
  }, []);

  useEffect(() => {
    if (agentTool) {
      props.updateAttributes({
        label: agentTool.label,
        flowLabel: agentTool.flowLabel,
        description: agentTool.description,
        promptId: agentTool.promptId,
        parameters: agentTool.parameters,
      });
    }
  }, [agentTool?.label, agentTool?.flowLabel, agentTool?.description, agentTool?.promptId, agentTool?.parameters]);

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
    <NodeViewWrapper ref={domRef} data-type="toolAgent" draggable="true" data-drag-handle className="cursor-move">
      <div className="bg-white rounded-lg shadow-md border border-gray-200 mt-4" contentEditable="false">
        <h2 className="px-4 text-lg font-medium text-gray-800 my-4 flex items-center gap-2"        
          onClick={handleInteraction}
          onKeyDown={(e) => {
              if (e.key === "Enter" || e.key === " ") {
                  handleInteraction();
              }
          }}>
            <Bot className="w-4 h-4" />
            Agent
        </h2>
        <div className="w-full h-px bg-gray-200" />
        <NodeViewContent className="grow px-2 border-b-2" as="div" />
      </div>
    </NodeViewWrapper>
  );
});
