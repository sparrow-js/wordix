import {
  AIHighlight,
  CharacterCount,
  // CodeBlockLowlight,
  Color,
  CustomKeymap,
  Document,
  HighlightExtension,
  HorizontalRule,
  MarkdownExtension,
  Mathematics,
  Placeholder,
  StarterKit,
  TaskItem,
  TaskList,
  TextStyle,
  TiptapImage,
  TiptapLink,
  TiptapUnderline,
  UpdatedImage,
  Youtube,
} from "@/components/headless/extensions";
import { UploadImagesPlugin } from "@/components/headless/plugins";

import { cx } from "class-variance-authority";
import { common, createLowlight } from "lowlight";

import { Custom } from "./extensions/custom";
import { Generation } from "./extensions/generation";
import { Loop } from "./extensions/loop";

import { Inputs } from "./extensions/inputs";
import { Mention } from "./extensions/mention";

import { CodeExecutor } from "./extensions/codeExecutor";
import { Else } from "./extensions/else";
import CodeBlockLowlight from "./extensions/extension-code-block-lowlight";
import { If } from "./extensions/if";
import { IfElse } from "./extensions/ifElse";

import { Comment } from "./extensions/comment";
import { Description } from "./extensions/description";
import { ImageGeneration } from "./extensions/image-generation";
import { Input } from "./extensions/inputs/input";
import { Prompt } from "./extensions/prompt";
import { Title } from "./extensions/title";
import { Tool } from "./extensions/tool";

//TODO I am using cx here to get tailwind autocomplete working, idk if someone else can write a regex to just capture the class key in objects
const aiHighlight = AIHighlight;
//You can overwrite the placeholder with your own configuration
const placeholder = Placeholder;
const tiptapLink = TiptapLink.configure({
  HTMLAttributes: {
    class: cx(
      "text-muted-foreground underline underline-offset-[3px] hover:text-primary transition-colors cursor-pointer",
    ),
  },
});

const tiptapImage = TiptapImage.extend({
  addProseMirrorPlugins() {
    return [
      UploadImagesPlugin({
        imageClass: cx("opacity-40 rounded-lg border border-stone-200"),
      }),
    ];
  },
}).configure({
  allowBase64: true,
  HTMLAttributes: {
    class: cx("rounded-lg border border-muted"),
  },
});

const updatedImage = UpdatedImage.configure({
  HTMLAttributes: {
    class: cx("rounded-lg border border-muted"),
  },
});

const taskList = TaskList.configure({
  HTMLAttributes: {
    class: cx("not-prose pl-2 "),
  },
});
const taskItem = TaskItem.configure({
  HTMLAttributes: {
    class: cx("flex gap-2 items-start my-4"),
  },
  nested: true,
});

const horizontalRule = HorizontalRule.configure({
  HTMLAttributes: {
    class: cx("mt-4 mb-6 border-t border-muted-foreground"),
  },
});

const starterKit = StarterKit.configure({
  bulletList: {
    HTMLAttributes: {
      class: cx("list-disc list-outside leading-3 -mt-2"),
    },
  },
  orderedList: {
    HTMLAttributes: {
      class: cx("list-decimal list-outside leading-3 -mt-2"),
    },
  },
  listItem: {
    HTMLAttributes: {
      class: cx("leading-normal -mb-2"),
    },
  },
  blockquote: {
    HTMLAttributes: {
      class: cx("border-l-4 border-primary"),
    },
  },
  codeBlock: {
    HTMLAttributes: {
      class: cx("rounded-md bg-muted text-muted-foreground border p-5 font-mono font-medium"),
    },
  },
  code: {
    HTMLAttributes: {
      class: cx("rounded-md bg-muted  px-1.5 py-1 font-mono font-medium"),
      spellcheck: "false",
    },
  },
  horizontalRule: false,
  dropcursor: {
    color: "#DBEAFE",
    width: 4,
  },
  gapcursor: false,
});

const codeBlock = CodeBlockLowlight.configure({
  // configure lowlight: common /  all / use highlightJS in case there is a need to specify certain language grammars only
  // common: covers 37 language grammars which should be good enough in most cases
  lowlight: createLowlight(common),
});

const youtube = Youtube.configure({
  HTMLAttributes: {
    class: cx("rounded-lg border border-muted"),
  },
  inline: false,
});

const custom = Custom.configure({
  HTMLAttributes: {
    class: cx("rounded-lg"),
  },
});

const inputs = Inputs.configure({
  HTMLAttributes: {
    class: cx("rounded-lg"),
  },
});

const generation = Generation.configure({
  HTMLAttributes: {
    class: cx("rounded-lg"),
  },
});

const mention = Mention.configure({
  HTMLAttributes: {
    class: cx("rounded-lg"),
  },
});

const loop = Loop.configure({
  HTMLAttributes: {
    class: cx("rounded-lg"),
  },
});

const mathematics = Mathematics.configure({
  HTMLAttributes: {
    class: cx("text-foreground rounded p-1 hover:bg-accent cursor-pointer"),
  },
  katexOptions: {
    throwOnError: false,
  },
});

const characterCount = CharacterCount.configure();

const codeExecutor = CodeExecutor.configure({
  HTMLAttributes: {
    class: "CodeExecutor",
  },
});

export const defaultExtensions = [
  starterKit,
  placeholder,
  tiptapLink,
  tiptapImage,
  updatedImage,
  taskList,
  taskItem,
  horizontalRule,
  aiHighlight,
  codeBlock,
  youtube,

  custom,
  inputs,
  Input,
  generation,
  ImageGeneration.configure({
    HTMLAttributes: {},
  }),
  mention,
  loop,
  codeExecutor,
  Description,

  IfElse.configure({
    HTMLAttributes: {},
  }),

  If.configure({
    HTMLAttributes: {},
  }),

  Else.configure({
    HTMLAttributes: {},
  }),

  Comment,
  Tool.configure({
    HTMLAttributes: {},
  }),

  Prompt,
  Title.configure({
    HTMLAttributes: {
      class: "title custom-placeholder",
      "data-custom-placeholder": "Flow title",
    },
  }),

  mathematics,
  characterCount,
  TiptapUnderline,
  MarkdownExtension,
  HighlightExtension,
  TextStyle,
  Color,
  CustomKeymap,
  // GlobalDragHandle,
  Document,
];

export const descriptionExtensions = [
  starterKit,
  placeholder,
  tiptapLink,
  tiptapImage,
  updatedImage,
  taskList,
  taskItem,
  horizontalRule,
  aiHighlight,
  codeBlock,

  mathematics,
  characterCount,
  TiptapUnderline,
  MarkdownExtension,
  HighlightExtension,
  TextStyle,
  Color,
  CustomKeymap,
  // GlobalDragHandle,
  Document,

  Description,
];
