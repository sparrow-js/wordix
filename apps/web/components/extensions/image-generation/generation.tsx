import useStores from "@/hooks/useStores";
import { type NodeViewProps, NodeViewWrapper } from "@tiptap/react";
import { Image } from "lucide-react";
import { observer } from "mobx-react";
import { useEffect } from "react";

export const GenerationComp = observer((props: NodeViewProps) => {
  const { generations, setting, workbench } = useStores();
  const { id, label, model, aspect_ratio } = props.node.attrs;
  useEffect(() => {
    generations.addGeneration({
      id,
      label,
      model,
      aspect_ratio,
    });
    return () => {
      generations.remove(id);
    };
  }, []);
  const generation = generations.data.get(id);
  const labelValue = generation?.label || "";
  const modelName = generation?.model || "";

  useEffect(() => {
    if (generation?.aspect_ratio || generation?.model) {
      props.updateAttributes({
        aspect_ratio: generation?.aspect_ratio,
        model: generation?.model,
      });
    }
  }, [generation?.aspect_ratio, generation?.model]);

  return (
    <NodeViewWrapper as={"span"} style={{ position: "relative" }}>
      <span
        className="react-renderer node-generation"
        onClick={(e) => {
          e.stopPropagation();
          setting.setSettingComponentName("imageGeneration");
          generations.currentId = id;
          workbench.setShowSidebar();
        }}
      >
        <span
          className="cursor-pointer select-text rounded-lg border box-decoration-clone px-1 py-0.5 bg-stone-100 hover:bg-stone-200 active:bg-stone-300 border-transparent text-sky-500"
          style={{ whiteSpace: "normal" }}
        >
          <span className="inline-flex leading-6">
            <span className="ml-0.5 flex items-center justify-center gap-1 align-middle font-mono text-base font-medium text-sky-500">
              ✨ <Image className="w-4 h-4" /> <span>{labelValue}</span>
              <span className="my-auto ml-2 rounded-full bg-stone-300 px-2 py-0 align-middle font-default text-xs font-semibold text-gray-700">
                <span className="pt-1">{modelName}</span>
              </span>
            </span>
          </span>
        </span>
      </span>
    </NodeViewWrapper>
  );
});
