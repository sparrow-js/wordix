import { NodeViewContent, NodeViewWrapper } from "@tiptap/react";
import { observer } from "mobx-react";
import { Workflow, ChevronDown, ChevronRight } from "lucide-react";
import { useState, useEffect, useRef } from "react";
import useStores from "@/hooks/useStores";

export const ToolWorkflowNode = observer((props: any) => {
  const domRef = useRef<HTMLDivElement>(null);
  const toolAttrs = props.node?.attrs || {};

  const parameters = toolAttrs.parameters || {};
  const { agentTools, setting, workbench, documents } = useStores();
  const tool = agentTools.get(toolAttrs.id);

  const [isExpanded, setIsExpanded] = useState(true);

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
  }, []);

  useEffect(() => {
    if (tool) {
      props.updateAttributes({
        label: tool.label,
        flowLabel: tool.flowLabel,
        description: tool.description,
        promptId: tool.promptId,
        parameters: tool.parameters,
      });
    }
  }, [tool?.label, tool?.flowLabel, tool?.description, tool?.promptId, tool?.parameters]);

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
    tool?.updateData({
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
    <NodeViewWrapper ref={domRef} data-type="toolWorkflow" draggable="true" data-drag-handle className="cursor-move">
      <div className="bg-white rounded-lg shadow-md border border-gray-200 mt-4" contentEditable="false">
        <div className="flex items-center">
          <h2 className="flex-1 px-4 text-lg font-medium text-gray-800 my-4 flex items-center gap-2 cursor-pointer rounded-md transition-colors bg-gray-50/50"
            onClick={handleInteraction}
            onKeyDown={(e) => {
                if (e.key === "Enter" || e.key === " ") {
                    handleInteraction();
                }
            }}
            role="button"
            tabIndex={0}
          >
              <span className="flex items-center gap-2 text-blue-500 hover:text-blue-600 active:text-blue-800">
                <Workflow className="w-4 h-4" />
                {tool?.label}
              </span>
          </h2>
          <button 
            className="p-2 hover:bg-gray-100 rounded-lg mr-2"
            onClick={(e) => {
              e.stopPropagation();
              setIsExpanded(!isExpanded);
            }}
          >
            {isExpanded ? (
              <ChevronDown className="w-4 h-4" />
            ) : (
              <ChevronRight className="w-4 h-4" />
            )}
          </button>
        </div>
        {isExpanded && (
          <>
            <div className="w-full h-px bg-gray-200" />
            <div className="p-4">
              {tool?.description}
            </div>
            <NodeViewContent className="h-0" as="div" />
          </>
        )}
      </div>
    </NodeViewWrapper>
  );
});
