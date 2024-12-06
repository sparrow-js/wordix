import { InputRule, findParentNode } from "@tiptap/core";
import { Color } from "@tiptap/extension-color";
import Highlight from "@tiptap/extension-highlight";
import HorizontalRule from "@tiptap/extension-horizontal-rule";
import TiptapImage from "@tiptap/extension-image";
import TiptapLink from "@tiptap/extension-link";
import { TaskItem } from "@tiptap/extension-task-item";
import { TaskList } from "@tiptap/extension-task-list";
import TextStyle from "@tiptap/extension-text-style";
import TiptapUnderline from "@tiptap/extension-underline";
import StarterKit from "@tiptap/starter-kit";
import { Markdown } from "tiptap-markdown";
import CustomKeymap from "./custom-keymap";
// import Placeholder from "@tiptap/extension-placeholder";
import Placeholder from "./extension-placeholder";
import { ImageResizer } from "./image-resizer";
import { Mathematics } from "./mathematics";
import UpdatedImage from "./updated-image";

import CharacterCount from "@tiptap/extension-character-count";
import CodeBlockLowlight from "@tiptap/extension-code-block-lowlight";
import Youtube from "@tiptap/extension-youtube";
import GlobalDragHandle from "./tiptap-extension-global-drag-handle";

import { Document } from "./Document";

const PlaceholderExtension = Placeholder.configure({
  // showOnlyCurrent: false,
  forceMarkEmptyNodes: ["title", "description"],
  placeholder: ({ node, editor }) => {
    if (node.type.name === "heading") {
      return `Heading ${node.attrs.level}`;
    }
    const { state } = editor;

    // 在当前选区中查找指定类型的父节点
    const result = findParentNode((node) => node.type.name === "comment")(state.selection);

    if (result) {
      // 找到了匹配的父节点，您可以通过 result.node 访问它
      const parentNode = result.node;
      if (parentNode) {
        return "This is a comment, nothing here will be included in the prompt";
      }
    }

    if (node.type.name === "input" || node.type.name === "inputs") {
      return "";
    }

    if (node.type.name === "title") {
      return "Flow title";
    }

    if (node.type.name === "description") {
      return "Add a description (not part of the prompt)";
    }

    if (node.type.name === "codeExecutor") {
      return "";
    }

    if (node.type.name === "codeBlock") {
      return "JavaScript here will be executed at runtime";
    }

    return "";
  },
  // includeChildren: true,
});

const HighlightExtension = Highlight.configure({
  multicolor: true,
});

const MarkdownExtension = Markdown.configure({
  html: true,
  transformCopiedText: true,
});

const Horizontal = HorizontalRule.extend({
  addInputRules() {
    return [
      new InputRule({
        find: /^(?:---|—-|___\s|\*\*\*\s)$/u,
        handler: ({ state, range }) => {
          const attributes = {};

          const { tr } = state;
          const start = range.from;
          const end = range.to;

          tr.insert(start - 1, this.type.create(attributes)).delete(tr.mapping.map(start), tr.mapping.map(end));
        },
      }),
    ];
  },
});

export * from "./ai-highlight";
export * from "./slash-command";
export * from "./at-command";
export {
  CodeBlockLowlight,
  Horizontal as HorizontalRule,
  ImageResizer,
  InputRule,
  PlaceholderExtension as Placeholder,
  StarterKit,
  TaskItem,
  TaskList,
  TiptapImage,
  TiptapUnderline,
  MarkdownExtension,
  TextStyle,
  Color,
  HighlightExtension,
  CustomKeymap,
  TiptapLink,
  UpdatedImage,
  Youtube,
  Mathematics,
  CharacterCount,
  GlobalDragHandle,
  Document,
};
