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
import { CornerDownLeft } from "lucide-react";


const models = [
  {
    name: "openAI gpt-4o",
    value: "gpt-4o",
    icon: <AiOutlineOpenAI className="w-5 h-5 mr-2" />,
    bigIcon: <AiOutlineOpenAI className="w-5 h-5" />,
  },
  {
    name: "gemini 2.0",
    value: "gemini-2.0-flash-exp",
    icon: <FcGoogle className="w-5 h-5 mr-2" />,
    bigIcon: <FcGoogle className="w-5 h-5" />,
  },
  {
    name: "deepseek v3",
    value: "deepseek-chat",
    icon: <DeepSeek className="w-5 h-5 mr-2" />,
    bigIcon: <DeepSeek className="w-5 h-5" />,
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
    const model = models.find((item) => item.value === storedModel);

    if (model) {
      setModel(model.value);
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
      <div className="flex flex-1 items-end space-x-2 p-2 rounded-sm focus-within:bg-gray-100 bg-white hover:bg-gray-50 border border-gray-200">
        <div className="flex flex-1 w-full min-h-[72px] justify-center mx-2">
          <textarea
            ref={inputRef}
            className="flex-1 w-full border-none outline-none leading-[20px] max-h-[80px] bg-transparent text-gray-900 mt-2"
            spellCheck="false"
            rows={1}
            placeholder="Ask Wordix"
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
            "rounded-sm h-[30px] self-end shadow-sm transition-all duration-200 bg-gray-100 hover:bg-gray-200 text-gray-700",
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
            <CornerDownLeft className="h-4 w-4 text-gray-700" />
          )}
        </Button>
        <DropdownMenu>
          <DropdownMenuTrigger className="p-2 bg-gray-100 text-gray-700 rounded-sm transition-all duration-200 hover:bg-gray-200 hover:shadow-md active:scale-95 w-[30px] h-[30px] flex items-center justify-center">
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
    </footer>
  );
};

export default PrompChat;
