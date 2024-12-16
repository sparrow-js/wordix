import useStores from "@/hooks/useStores";
import { type NodeViewProps, NodeViewWrapper } from "@tiptap/react";
import { Image } from "lucide-react";
import { observer } from "mobx-react";
import { useEffect, useState } from "react";

export const MentionComp = observer((props: NodeViewProps) => {
  const { generations, setting, workbench, mentions } = useStores();
  const [label, setLabel] = useState<string>("");
  const { referenceId } = props.node.attrs;
  const [type, setType] = useState<string>("");
  const [inputType, setInputType] = useState<string>("");

  useEffect(() => {
    const metion = mentions.getMetion(referenceId);
    if (metion) {
      setLabel(metion.title);
      setType(metion.type);
      if (metion.inputType) {
        setInputType(metion.inputType);
        props.updateAttributes({ type: metion.inputType });
      }
    }
  }, [mentions.atList]);

  return (
    <NodeViewWrapper as={"span"} style={{ position: "relative" }}>
      <span
        className="inline-flex items-center h-[30px] cursor-pointer rounded-lg border box-decoration-clone px-1 py-0.5 font-mono hover:bg-stone-100 active:bg-stone-200 border-black"
        onClick={() => {
          mentions.editAttr(referenceId, type);
        }}
      >
        @{label}
        {type === "input" && inputType === "image" && <Image className="ml-2 w-4 h-4" />}
      </span>
    </NodeViewWrapper>
  );
});
