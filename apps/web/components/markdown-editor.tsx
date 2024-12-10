"use client";

import { EditorContent, EditorRoot } from "@/components/headless/components";
import { ImageResizer, handleCommandNavigation } from "@/components/headless/extensions";
import { handleImageDrop, handleImagePaste } from "@/components/headless/plugins";
import { useState } from "react";
import { descriptionExtensions } from "./extensions";
import { uploadFn } from "./image-upload";

const extensions = [...descriptionExtensions];

export default function MarkdownEditor({ initialContent }) {
  const [editor, setEditor] = useState<any | null>(null);

  return (
    <div className="w-full h-full min-w-[600px] overflow-y-auto">
      <div className="relative w-full">
        <EditorRoot>
          <EditorContent
            editable={false}
            initialContent={initialContent}
            extensions={extensions}
            className="relative w-full sm:mb-[calc(20vh)]"
            editorProps={{
              handleDOMEvents: {
                keydown: (_view, event) => handleCommandNavigation(event),
              },
              handlePaste: (view, event) => handleImagePaste(view, event, uploadFn),
              handleDrop: (view, event, _slice, moved) => handleImageDrop(view, event, moved, uploadFn),
              attributes: {
                class:
                  "prose prose-lg dark:prose-invert prose-headings:font-title font-default focus:outline-none max-w-full !px-2 !py-0",
              },
            }}
            onCreate={({ editor }) => {
              setEditor(editor);
            }}
            slotAfter={<ImageResizer />}
          />
        </EditorRoot>
      </div>
    </div>
  );
}
