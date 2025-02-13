"use client";

import { EditorContent, EditorRoot } from "@/components/headless/components";
import { ImageResizer, handleCommandNavigation } from "@/components/headless/extensions";
import { handleImageDrop, handleImagePaste } from "@/components/headless/plugins";
import { descriptionExtensions } from "./extensions";
import { uploadFn } from "./image-upload";

const extensions = [...descriptionExtensions];

export default function DescriptionEditor({ initialContent }) {
  return (
    <div className="w-full h-full overflow-y-auto max-h-[calc(100vh-260px)]">
      <div className="relative w-full">
        <EditorRoot>
          <EditorContent
            editable={false}
            initialContent={initialContent}
            extensions={extensions}
            className="relative w-full"
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
            slotAfter={<ImageResizer />}
          />
        </EditorRoot>
      </div>
    </div>
  );
}
