"use client";

import {
  EditorAtCommand,
  EditorCommand,
  EditorCommandAtList,
  EditorCommandEmpty,
  EditorCommandGroup,
  EditorCommandItem,
  EditorCommandList,
  EditorContent,
  type EditorInstance,
  EditorRoot,
  type JSONContent,
} from "@/components/headless/components";

import { ImageResizer, handleCommandNavigation } from "@/components/headless/extensions";
import { useEffect, useState } from "react";
import { useDebouncedCallback } from "use-debounce";
import { defaultExtensions } from "./extensions";
import { ColorSelector } from "./selectors/color-selector";
import { LinkSelector } from "./selectors/link-selector";
import { MathSelector } from "./selectors/math-selector";
import { NodeSelector } from "./selectors/node-selector";
import { Separator } from "./ui/separator";

import { handleImageDrop, handleImagePaste } from "@/components/headless/plugins";
import { ResizableHandle, ResizablePanel, ResizablePanelGroup } from "@/components/ui/resizable";
import { atCommand } from "./at-command";
import GenerativeMenuSwitch from "./generative/generative-menu-switch";
import { uploadFn } from "./image-upload";
import { TextButtons } from "./selectors/text-buttons";
import { slashCommand, suggestionItems } from "./slash-command";

import { ContentItemMenu } from "@/components/menus";
import Settings from "@/components/settings";
import useStores from "@/hooks/useStores";
import { observer } from "mobx-react";

const hljs = require("highlight.js");

const extensions = [...defaultExtensions, slashCommand, atCommand];

const TailwindAdvancedEditor = ({ response }: any) => {
  const [initialContent, setInitialContent] = useState<null | JSONContent>(null);
  const [saveStatus, setSaveStatus] = useState("Saved");
  const [charsCount, setCharsCount] = useState();

  const [openNode, setOpenNode] = useState(false);
  const [openColor, setOpenColor] = useState(false);
  const [openLink, setOpenLink] = useState(false);
  const [openAI, setOpenAI] = useState(false);
  const [editor, setEditor] = useState<any | null>(null);

  const { workbench, generations, mentions, inputsNode, dialogs, documents } = useStores();

  //Apply Codeblock Highlighting on the HTML from editor.getHTML()
  const highlightCodeblocks = (content: string) => {
    const doc = new DOMParser().parseFromString(content, "text/html");
    doc.querySelectorAll("pre code").forEach((el) => {
      // @ts-ignore
      // https://highlightjs.readthedocs.io/en/latest/api.html?highlight=highlightElement#highlightelement
      hljs.highlightElement(el);
    });
    return new XMLSerializer().serializeToString(doc);
  };

  const debouncedUpdates = useDebouncedCallback(async (editor: EditorInstance) => {
    const json = editor.getJSON();

    const { document } = response;
    document && document.updateData({ content: json });

    setCharsCount(editor.storage.characterCount.words());
    window.localStorage.setItem("html-content", highlightCodeblocks(editor.getHTML()));
    window.localStorage.setItem("novel-content", JSON.stringify(json));
    window.localStorage.setItem("markdown", editor.storage.markdown.getMarkdown());
    setSaveStatus("Saved");
  }, 500);

  useEffect(() => {
    setInitialContent(response.document.content);
  }, []);

  if (!initialContent) return null;

  return (
    <ResizablePanelGroup direction="horizontal">
      <ResizablePanel defaultSize={60}>
        <div className="w-full h-full min-w-[600px] overflow-y-auto">
          <div className="relative w-full">
            <div className="flex absolute right-5 top-5 z-10 mb-5 gap-2">
              <div className="rounded-lg bg-accent px-2 py-1 text-sm text-muted-foreground">{saveStatus}</div>
              <div className={charsCount ? "rounded-lg bg-accent px-2 py-1 text-sm text-muted-foreground" : "hidden"}>
                {charsCount} Words
              </div>
            </div>
            <EditorRoot>
              <EditorContent
                initialContent={initialContent}
                extensions={extensions}
                className="relative min-h-[500px] w-full border-muted bg-background sm:mb-[calc(20vh)] sm:rounded-lg sm:border sm:shadow-lg"
                editorProps={{
                  handleDOMEvents: {
                    keydown: (_view, event) => handleCommandNavigation(event),
                  },
                  handlePaste: (view, event) => handleImagePaste(view, event, uploadFn),
                  handleDrop: (view, event, _slice, moved) => handleImageDrop(view, event, moved, uploadFn),
                  attributes: {
                    class:
                      "prose prose-lg dark:prose-invert prose-headings:font-title font-default focus:outline-none max-w-full",
                  },
                }}
                onUpdate={({ editor }) => {
                  const { doc } = editor.state;

                  let currentTitleContent = "";
                  let hasChanged = false;
                  const { document } = response;

                  // 遍历文档，查找 title 节点
                  doc.descendants((node, pos) => {
                    if (node.type.name === "title") {
                      const nodeContent = node.textContent;

                      // 将所有 title 节点内容拼接为一个字符串
                      currentTitleContent += nodeContent;

                      // 比较当前节点内容与上一次记录的内容
                      if (document.title !== currentTitleContent) {
                        hasChanged = true;
                      }
                      if (hasChanged) {
                        documents.updateDocumentTitle(document.id, currentTitleContent);
                        // response.document
                      }
                    }
                    return true;
                  });

                  debouncedUpdates(editor);
                  setSaveStatus("Unsaved");
                }}
                onCreate={({ editor }) => {
                  (window as any).editor = editor;
                  setEditor(editor);
                }}
                onSelectionUpdate={({ editor }) => {
                  const { commands, state, chain } = editor;
                  const { selection } = state;
                  const { from } = selection;
                  const node = state.doc.nodeAt(from);
                  const toggleNodes = ["input", "generation"];
                  if (!node || !toggleNodes.includes(node.type.name)) {
                    workbench.setHideSidebar();
                  }
                }}
                slotAfter={<ImageResizer />}
              >
                <EditorCommand className="z-50 h-auto max-h-[330px] overflow-y-auto rounded-md border border-muted bg-background px-2 py-2 shadow-md transition-all">
                  <EditorCommandEmpty className="px-2 text-muted-foreground">No results</EditorCommandEmpty>
                  <EditorCommandList>
                    {suggestionItems.map((group: any) => (
                      <EditorCommandGroup heading={group.label}>
                        {group.list.map((item: any) => (
                          <EditorCommandItem
                            value={item.title}
                            onCommand={(val) => item.command(val)}
                            className="flex w-full items-center space-x-2 rounded-md px-1 py-1 text-left text-sm hover:bg-accent aria-selected:bg-accent"
                            key={item.title}
                          >
                            <div className="flex h-10 w-10 items-center justify-center rounded-md border border-muted bg-background">
                              {item.icon}
                            </div>
                            <div>
                              <p className="font-medium">{item.title}</p>
                              <p className="text-xs text-muted-foreground">{item.description}</p>
                            </div>
                          </EditorCommandItem>
                        ))}
                      </EditorCommandGroup>
                    ))}
                  </EditorCommandList>
                </EditorCommand>

                <EditorAtCommand className="z-50 h-auto max-h-[330px] overflow-y-auto rounded-md border border-muted bg-background px-1 py-2 shadow-md transition-all">
                  <EditorCommandEmpty className="px-2 text-muted-foreground">No results</EditorCommandEmpty>
                  <EditorCommandAtList>
                    {mentions.atList.map((item) => (
                      <EditorCommandItem
                        value={item.title}
                        onCommand={(val) => item.command(val)}
                        className="flex w-full items-center space-x-2 rounded-md px-2 py-1 text-left text-sm hover:bg-accent aria-selected:bg-accent"
                        key={item.title}
                      >
                        <div className="flex h-10 w-10 items-center justify-center rounded-md border border-muted bg-background">
                          {/* {item.icon} */}
                          icon
                        </div>
                        <div>
                          <p className="font-medium">{item.title}</p>
                          <p className="text-xs text-muted-foreground">{item.description}</p>
                        </div>
                      </EditorCommandItem>
                    ))}
                  </EditorCommandAtList>
                </EditorAtCommand>

                <GenerativeMenuSwitch open={openAI} onOpenChange={setOpenAI}>
                  <Separator orientation="vertical" />
                  <NodeSelector open={openNode} onOpenChange={setOpenNode} />
                  <Separator orientation="vertical" />

                  <LinkSelector open={openLink} onOpenChange={setOpenLink} />
                  <Separator orientation="vertical" />
                  <MathSelector />
                  <Separator orientation="vertical" />
                  <TextButtons />
                  <Separator orientation="vertical" />
                  <ColorSelector open={openColor} onOpenChange={setOpenColor} />
                </GenerativeMenuSwitch>
                {editor && <ContentItemMenu editor={editor} />}
              </EditorContent>
            </EditorRoot>
          </div>
        </div>
      </ResizablePanel>
      <ResizableHandle />

      {workbench.showSidebar && editor && (
        <ResizablePanel defaultSize={40}>
          <div className="w-full h-full">
            <Settings editor={editor} />
          </div>
        </ResizablePanel>
      )}
    </ResizablePanelGroup>
  );
};

export default observer(TailwindAdvancedEditor);
