"use client";

import useStores from "@/hooks/useStores";
import { ChevronsRight } from "lucide-react";
import type React from "react";
import { useEffect, useState } from "react";
import Generation from "./generation";
import { InputSetting } from "./inputs-setting";
import LoopSetting from "./loop";

import DebugExecute from "@/components/settings/execute/debug-execute";
import { observer } from "mobx-react";
import CodeExecutorEditor from "./codeExecutor";
import IfElseSetting from "./ifElse";
import ImageGeneration from "./imageGeneration";
import Prompt from "./prompt";
import Tool from "./tool";
import LoadingDots from "../icons/loading-dots";
const MapComp = {
  generation: Generation,
  imageGeneration: ImageGeneration,
  inputSetting: InputSetting,
  executeResult: DebugExecute,
  loop: LoopSetting,
  ifElse: IfElseSetting,
  codeExecutor: CodeExecutorEditor,
  prompt: Prompt,
  tool: Tool,
};

interface InputSettingProps {
  editor: any;
}
const Settings: React.FC<InputSettingProps> = ({ editor }) => {
  const { workbench, setting, execute } = useStores();
  const [Comp, setComp] = useState<any>(null);

  useEffect(() => {
    setComp(MapComp[setting.settingComponentName] || MapComp.inputSetting);
  }, [setting.settingComponentName]);

  return (
    <div className="flex h-full flex-col bg-background">
      <div className="flex h-10 items-center border-b border-border px-1">
        <div className="grid w-full grid-cols-3 text-sm font-semibold text-muted-foreground">
          <div className="justify-self-start">
            <button
              className="inline-flex items-center justify-center text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:opacity-50 disabled:pointer-events-none ring-offset-background hover:bg-accent hover:text-accent-foreground p-2 rounded-md aspect-square h-fit"
              onClick={() => {
                workbench.setHideSidebar();
              }}
            >
              <ChevronsRight className="h-4 w-4" />
            </button>
          </div>
          <div className="flex items-center justify-self-center">
            {execute.status === "pending" && <LoadingDots />}
          </div>
        </div>
      </div>
      <div className="flex-1 overflow-y-auto">{Comp && <Comp onDelete={() => {}} editor={editor} />}</div>
    </div>
  );
};

export default observer(Settings);
