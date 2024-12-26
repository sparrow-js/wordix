import useStores from "@/hooks/useStores";
import { type NodeViewProps, NodeViewWrapper } from "@tiptap/react";
import { observer } from "mobx-react";
import { useEffect } from "react";

export const InputComp = observer((props: NodeViewProps) => {
  const { inputsNode, setting, workbench, mentions } = useStores();
  const { id, label, type, description } = props.node.attrs;
  useEffect(() => {
    inputsNode.addInput({
      id,
      label,
      type,
      description,
    });
    return () => {
      console.log("*************88**");
      inputsNode.remove(id);
    };
  }, []);
  const input = inputsNode.data.get(id);
  const labelValue = input?.label || "";

  useEffect(() => {
    if (input) {
      props.updateAttributes({
        label: input.label,
        description: input.description,
        type: input.type,
      });
    }
  }, [input?.label, input?.description, input?.type]);

  return (
    <NodeViewWrapper as={"span"} style={{ position: "relative" }}>
      <span
        onClick={(e) => {
          e.stopPropagation();
          inputsNode.setSelectedId(input.id);
          setting.setSettingComponentName("inputSetting");
          workbench.setShowSidebar();
        }}
        className="m-2 mr-1 w-fit cursor-grab rounded-full border bg-sky-100 px-2 py-1 text-sm text-sky-600 transition-colors duration-200 hover:bg-sky-200 active:cursor-grabbing border-transparent"
      >
        <span className="whitespace-nowrap">{labelValue}</span>
      </span>
    </NodeViewWrapper>
  );
});
