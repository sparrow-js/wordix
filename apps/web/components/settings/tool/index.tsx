import useStores from "@/hooks/useStores";
import { observer } from "mobx-react";
import Duckduckgo from "./duckduckgo";
import StableDiffusion from "./stableDiffusion";
import TextToSpeech from "./textToSpeech";
import Webscrape from "./webscrape";
const MapComp = {
  stableDiffusion: StableDiffusion,
  webscrape: Webscrape,
  textToSpeech: TextToSpeech,
  duckduckgo: Duckduckgo,
};

const Prompt = ({ onDelete, editor }) => {
  const { tools } = useStores();

  const tool = tools.get(tools.selectedId);

  const Comp = MapComp[tool.toolId];

  return Comp ? <Comp editor={editor} onDelete={onDelete} /> : null;
};

export default observer(Prompt);
