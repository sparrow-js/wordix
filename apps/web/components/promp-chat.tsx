import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import type { Editor } from "@tiptap/core";
import { Sparkles } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import LoadingDots from "./icons/loading-dots";

const PrompChat = ({ editor }: { editor: Editor }) => {
  const [chatValue, setChatValue] = useState("");
  const inputRef = useRef<any>(null);

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
      <div className="flex flex-1 items-end space-x-4 p-2 rounded-[31px] focus-within:bg-gray-800 bg-black">
        <div className="flex flex-1 w-full min-h-[36px] items-center justify-center mx-4">
          <textarea
            ref={inputRef}
            className="flex-1 w-full border-none outline-none focus-within:bg-gray-800 bg-black leading-[20px] max-h-[80px]"
            spellCheck="false"
            rows={1}
            placeholder="Tell the AI what to change"
            style={{
              resize: "none",
              overflowY: "auto",
            }}
            value={chatValue}
            onChange={(e) => {
              setChatValue(e.target.value);
            }}
          />
        </div>

        <Button
          className={cn(
            " rounded-full h-[36px] self-end",
            chatValue.length === 0 ? "bg-stone-600 hover:bg-stone-600" : "bg-cyan-400 hover:bg-cyan-700",
          )}
          onClick={() => {
            if (chatValue.length === 0) return;
            editor?.commands.aiTextPrompt({
              text: chatValue,
              format: "rich-text",
              stream: true,
              insertAt: editor.state.doc.content.size,
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
      </div>
      {/* <Button className="rounded-full">
        <X className="h-6 w-6" />
      </Button> */}
    </footer>
  );
};

export default PrompChat;
