import { NodeViewContent, NodeViewWrapper } from "@tiptap/react";
import { observer } from "mobx-react";
import { useRef, useState } from "react";

import { Brain } from "lucide-react";
import { useEffect } from "react";
import useStores from "@/hooks/useStores";
import type { IconType } from "react-icons";

import { agentModelOptions } from "@/workflow/ai/config/model-configs";



export const AgentModelNode = observer((props: any) => {
  const domRef = useRef<HTMLDivElement>(null);
  const { workbench, setting, agentModels } = useStores();
  const agentModel = agentModels.get(props.node.attrs.id);
  const modelConfig = agentModelOptions.find(opt => opt.value === agentModel?.model);
  const [isRunning, setIsRunning] = useState(false);
  const ModelAvatar = modelConfig?.avatar as IconType;

  useEffect(() => {
    const model = agentModels.addAgentModel(
      {
        id: props.node.attrs.id,
        label: props.node.attrs.label,
        nodeName: props.node.type.name,
        model: props.node.attrs.model,
        state: props.node.attrs.state,
      },
    );

    return () => {
      agentModels.removeAgentModel(props.node.attrs.id, props.editor);
    };
  }, []);

  useEffect(() => {
    if (agentModel) {
      props.updateAttributes({
        label: agentModel.label,
        model: agentModel.model,
      });
    }
  }, [agentModel?.model, agentModel?.label]);

  useEffect(() => {
    if (workbench.agenticWorkflowRunning && workbench.agenticWorkflowRunning.data === props.node.attrs.id) {
        if (workbench.agenticWorkflowRunning.event === "node_agenticworkflow_started") {
            setIsRunning(true);
        }
        if (workbench.agenticWorkflowRunning.event === "node_agenticworkflow_finished") {
            setIsRunning(false);
        }
    }
  }, [workbench.agenticWorkflowRunning]);


  const handleInteraction = () => {
    agentModels.setSelectedId(props.node.attrs.id);
    const { state, view } = props.editor;
    const pos = props.getPos();
    if (typeof pos === "number") {
      const nodePos = state.doc.resolve(pos);
      // @ts-ignore
      const selection = state.selection.constructor.create(state.doc, nodePos.pos);
      view.dispatch(state.tr.setSelection(selection));
    }
    agentModel?.updateData({
      content: props.node.content.content.map((item) => ({
        type: item.type.name,
        id: item.attrs.id,
        attrs: item.attrs,
      })),
    });
    setting.setSettingComponentName("agentModel");
    workbench.setShowSidebar();
  };

  return (
    <NodeViewWrapper ref={domRef} data-type="agentModel" draggable="true" data-drag-handle className="cursor-move">
      <div className="w-[200px] bg-gradient-to-br from-slate-50 to-slate-100 rounded-xl shadow-lg border-2 border-slate-200/60 mt-4 hover:border-blue-400 hover:shadow-blue-100/50 transition-all backdrop-blur-sm" contentEditable="false"
        onClick={handleInteraction}
        onKeyDown={(e) => {
          if (e.key === "Enter" || e.key === " ") {
            handleInteraction();
          }
        }}
      >
        <h2 className="px-4 text-lg font-medium text-slate-700 my-4 flex items-center gap-2 hover:text-blue-600 transition-all cursor-pointer group">
            <Brain className="w-5 h-5 text-blue-500 group-hover:animate-pulse" />
            Model
        </h2>
        <div className="w-full h-px bg-gradient-to-r from-transparent via-slate-200 to-transparent" />
        <div className="flex flex-col items-center gap-2 px-4 py-3">
            {ModelAvatar && (
                <div className="p-3 rounded-lg bg-blue-50/50 hover:bg-blue-100/50 transition-colors group">
                    <ModelAvatar 
                        className={`w-12 h-12 text-blue-600 ${
                            isRunning 
                                ? 'animate-[spin_2s_linear_infinite]' 
                                : 'group-hover:animate-[spin_5s_linear_infinite]'
                        }`} 
                    />
                </div>
            )}
            <span className="text-base text-slate-700">
                {modelConfig?.label || agentModel?.model}
            </span>
        </div>
        <NodeViewContent className="h-0" as="div" />
      </div>
    </NodeViewWrapper>
  );
});
