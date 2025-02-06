import { AiOutlineOpenAI } from "react-icons/ai";
import { FcGoogle } from "react-icons/fc";

import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import DeepSeek from "@/components/ui/icons/deepseek";
import useStores from "@/hooks/useStores";
import { cn } from "@/lib/utils";
import type { Editor } from "@tiptap/core";
import { Sparkles } from "lucide-react";
import { Play } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import LoadingDots from "./icons/loading-dots";

const models = [
  {
    name: "openAI gpt-4o",
    value: "gpt-4o",
    icon: <AiOutlineOpenAI className="w-4 h-4 mr-2" />,
    bigIcon: <AiOutlineOpenAI className="w-[36px] h-[36px]" />,
  },
  {
    name: "gemini 2.0",
    value: "gemini-2.0-flash-exp",
    icon: <FcGoogle className="w-4 h-4 mr-2" />,
    bigIcon: <FcGoogle className="w-[36px] h-[36px]" />,
  },
  {
    name: "deepseek v3",
    value: "deepseek-chat",
    icon: <DeepSeek className="w-4 h-4 mr-2" />,
    bigIcon: <DeepSeek className="w-[36px] h-[36px] pb-2" />,
  },
  // {
  //   name: "gemini 2.0 thinking",
  //   value: "gemini-2.0-flash-thinking-exp-1219",
  //   icon: <FcGoogle className="w-4 h-4 mr-2" />,
  //   bigIcon: <FcGoogle className="w-[36px] h-[36px]" />,
  // },
];

const RunButton = () => {
  const { workbench, setting, dialogs, execute } = useStores();
  return (
    <Button
      className="bg-[#fad400] hover:bg-[#fce062] h-[42px] text-black"
      onClick={() => {
        execute.setStatus("end");
        dialogs.showInputsModal();
      }}
    >
      <Play className="mr-2 h-4 w-4" />
      debug
    </Button>
  );
};

const PrompChat = ({ editor }: { editor: Editor }) => {
  const [chatValue, setChatValue] = useState("");
  const inputRef = useRef<any>(null);
  const [model, setModel] = useState("");

  useEffect(() => {
    const storedModel = localStorage.getItem("selectedModel");
    if (storedModel) {
      setModel(storedModel);
    } else {
      setModel(models[0].value);
    }
  }, []);

  const aiStorage = editor.storage.ai;

  useEffect(() => {
    if (inputRef.current) {
      const lineHeight = 20; // 因为我们在 CSS 中设置了 leading-[20px]
      const maxHeight = lineHeight * 6; // 4行的最大高度

      inputRef.current.style.height = "inherit";
      const scrollHeight = Math.min(inputRef.current.scrollHeight, maxHeight);
      inputRef.current.style.height = `${scrollHeight}px`;
    }
  }, [chatValue]);

  return (
    <footer className="text-white p-4 rounded-xl flex items-center justify-between space-x-4">
      <div className="flex flex-1 items-end space-x-2 p-2 rounded-[31px] focus-within:bg-gray-800 bg-black hover:bg-gray-700">
        <div className="flex flex-1 w-full min-h-[36px] items-center justify-center mx-4">
          <textarea
            ref={inputRef}
            className="flex-1 w-full border-none outline-none  leading-[20px] max-h-[80px] bg-transparent"
            spellCheck="false"
            rows={1}
            placeholder="Tell the AI what to change something"
            style={{
              resize: "none",
              overflowY: "scroll", // Allow scrolling
              scrollbarWidth: "none", // For Firefox
              msOverflowStyle: "none", //
            }}
            value={chatValue}
            onChange={(e) => {
              setChatValue(e.target.value);
            }}
            onKeyDown={(e) => {
              if (e.key === "Enter" && !e.shiftKey) {
                e.preventDefault();
                if (chatValue.length === 0) return;

                const parentNode = editor.state.selection.$from.node(0);
                const indexInParent =
                  parentNode.childCount > 0 ? parentNode.childAfter(editor.state.selection.$from.pos).index : -1;

                let insertAt = editor.state.selection.from || editor.state.doc.content.size;
                if (indexInParent < 4) {
                  insertAt = editor.state.doc.content.size;
                }

                editor?.commands.aiTextPrompt({
                  text: chatValue,
                  format: "rich-text",
                  stream: true,
                  insertAt,
                  model: model,
                  workspaceId: localStorage.getItem("workspaceId"),
                });
                setChatValue("");
              }
            }}
          />
        </div>

        <Button
          className={cn(
            " rounded-full h-[36px] self-end",
            chatValue.length === 0 ? "bg-stone-600 hover:bg-stone-600" : "bg-[#fad400] hover:bg-[#fce062] text-black",
          )}
          onClick={() => {
            if (chatValue.length === 0) return;
            const parentNode = editor.state.selection.$from.node(0);
            const indexInParent =
              parentNode.childCount > 0 ? parentNode.childAfter(editor.state.selection.$from.pos).index : -1;

            let insertAt = editor.state.selection.from || editor.state.doc.content.size;
            if (indexInParent < 4) {
              insertAt = editor.state.doc.content.size;
            }

            editor?.commands.aiTextPrompt({
              text: chatValue,
              format: "rich-text",
              stream: true,
              insertAt,
              model: model,
              workspaceId: localStorage.getItem("workspaceId"),
            });
            setChatValue("");
          }}
        >
          {aiStorage.state === "loading" ? (
            <LoadingDots />
          ) : (
            <>
              <Sparkles className="h-4 w-4 mr-2" />
              Run
            </>
          )}
        </Button>
        <DropdownMenu>
          <DropdownMenuTrigger>
            <span className="flex items-center">{models.find((item) => item.value === model)?.bigIcon}</span>
          </DropdownMenuTrigger>
          <DropdownMenuContent>
            {models.map((modelItem) => (
              <DropdownMenuCheckboxItem
                key={modelItem.name}
                checked={modelItem.value === model}
                onCheckedChange={() => {
                  setModel(modelItem.value);
                  localStorage.setItem("selectedModel", modelItem.value);
                }}
              >
                {modelItem.icon}
                {modelItem.name}
              </DropdownMenuCheckboxItem>
            ))}
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
      {/* <Button className="rounded-full">
        <X className="h-6 w-6" />
      </Button> */}
      {/* <RunButton /> */}
    </footer>
  );
};

export default PrompChat;
