import { allModels } from "@/workflow/ai/config/model-configs";
import { Dot, FileText, Focus, WholeWord } from "lucide-react";
export const generationType = [
  {
    label: "Short",
    value: "short",
    icon: <WholeWord />,
  },
  {
    label: "Sentence",
    value: "sentence",
    icon: <Dot />,
  },
  {
    label: "Full",
    value: "full",
    icon: <FileText />,
  },
  {
    label: "Custom",
    value: "custom",
    icon: <Focus />,
  },
];

export const models = allModels;
