import useStores from "@/hooks/useStores";
import { observer } from "mobx-react";
import StableDiffusion from "./stableDiffusion";

const MapComp = {
  stableDiffusion: StableDiffusion,
};

const Prompt = ({ onDelete, editor }) => {
  const { tools } = useStores();

  const tool = tools.get(tools.selectedId);

  const Comp = MapComp[tool.toolId];

  return Comp ? <Comp editor={editor} onDelete={onDelete} /> : null;
};

export default observer(Prompt);
