import { createSuggestionItems } from "@/components/headless/extensions";
import { Command, renderItems } from "@/components/headless/extensions";
import {
  BookLock,
  Brain,
  CheckSquare,
  Code,
  Heading1,
  Heading2,
  Heading3,
  ImageIcon,
  List,
  ListOrdered,
  MessageSquarePlus,
  Parentheses,
  Repeat,
  Spline,
  Split,
  Text,
  TextQuote,
  Wrench,
} from "lucide-react";
import { v4 as uuidv4 } from "uuid";
import { uploadFn } from "./image-upload";

export const suggestionItems = createSuggestionItems([
  {
    label: "AI",
    list: [
      {
        title: "Generation",
        description: "Embed a generation.",
        searchTerms: ["generation", "embed"],
        icon: <Brain size={18} />,
        command: ({ editor, range }) => {
          editor.chain().focus().deleteRange(range).setGeneration({}).run();
        },
      },
      {
        title: "Image Generation",
        description: "Embed a image generation.",
        searchTerms: ["image", "generation", "embed"],
        icon: <ImageIcon size={18} />,
        command: ({ editor, range }) => {
          editor.chain().focus().deleteRange(range).setImageGeneration({}).run();
        },
      },
    ],
  },
  {
    label: "Logic",
    list: [
      {
        title: "Loop",
        description: "Embed a generation.",
        searchTerms: ["generation", "embed"],
        icon: <Repeat size={18} />,
        command: ({ editor, range }) => {
          editor.chain().focus().deleteRange(range).setLoop({}).run();
        },
      },
      {
        title: "CodeExecutor",
        description: "CodeExecutor.",
        searchTerms: ["Code", "embed"],
        icon: <Code size={18} />,
        command: ({ editor, range }) => {
          editor.chain().focus().deleteRange(range).setCodeExecutor({}).run();
        },
      },
      {
        title: "IfElse",
        description: "IfElse.",
        searchTerms: ["IfElse", "embed"],
        icon: <Split size={18} />,
        command: ({ editor, range }) => {
          editor.chain().focus().deleteRange(range).setIfElse({}).run();
        },
      },
      {
        title: "Prompt",
        description: "Prompt.",
        searchTerms: ["Prompt", "embed"],
        icon: <Parentheses size={18} />,
        command: ({ editor, range }) => {
          editor.chain().focus().deleteRange(range).setPrompt({}).run();
        },
      },
    ],
  },
  // {
  //   label: "Inputs",
  //   list: [
  //     {
  //       title: "inputs",
  //       searchTerms: ["inputs", "inputs"],
  //       icon: <RectangleHorizontal size={18} />,
  //       description: "Insert a inputs divider",
  //       // @ts-ignore
  //       aliases: ["hr"],
  //       command: ({ editor, range }) => {
  //         editor.chain().focus().deleteRange(range).setInputs({}).run();
  //       },
  //     },
  //   ],
  // },
  {
    label: "Tools",
    list: [
      {
        title: "Image Generation",
        description: "Image Generation.",
        searchTerms: ["Image", "embed"],
        icon: <Wrench size={18} />,
        command: ({ editor, range }) => {
          editor
            .chain()
            .focus()
            .deleteRange(range)
            .setTool({
              id: uuidv4(),
              label: "Image generation",
              toolId: "stableDiffusion",
              output: [],
              parameters: {
                aspect_ratio: {
                  type: "literal",
                  value: "16:9",
                },
                model: {
                  type: "literal",
                  value: "black-forest-labs/flux-1.1-pro",
                },
                prompt: {
                  type: "literal",
                  value: "",
                },
              },
            })
            .run();
        },
      },
    ],
  },
  {
    label: "Formatting",
    list: [
      {
        title: "Text",
        description: "Just start typing with plain text.",
        searchTerms: ["p", "paragraph"],
        icon: <Text size={18} />,
        command: ({ editor, range }) => {
          editor.chain().focus().deleteRange(range).toggleNode("paragraph", "paragraph").run();
        },
      },
      {
        title: "To-do List",
        description: "Track tasks with a to-do list.",
        searchTerms: ["todo", "task", "list", "check", "checkbox"],
        icon: <CheckSquare size={18} />,
        command: ({ editor, range }) => {
          editor.chain().focus().deleteRange(range).toggleTaskList().run();
        },
      },
      {
        title: "Heading 1",
        description: "Big section heading.",
        searchTerms: ["title", "big", "large"],
        icon: <Heading1 size={18} />,
        command: ({ editor, range }) => {
          editor.chain().focus().deleteRange(range).setNode("heading", { level: 1 }).run();
        },
      },
      {
        title: "Heading 2",
        description: "Medium section heading.",
        searchTerms: ["subtitle", "medium"],
        icon: <Heading2 size={18} />,
        command: ({ editor, range }) => {
          editor.chain().focus().deleteRange(range).setNode("heading", { level: 2 }).run();
        },
      },
      {
        title: "Heading 3",
        description: "Small section heading.",
        searchTerms: ["subtitle", "small"],
        icon: <Heading3 size={18} />,
        command: ({ editor, range }) => {
          editor.chain().focus().deleteRange(range).setNode("heading", { level: 3 }).run();
        },
      },
      {
        title: "Bullet List",
        description: "Create a simple bullet list.",
        searchTerms: ["unordered", "point"],
        icon: <List size={18} />,
        command: ({ editor, range }) => {
          editor.chain().focus().deleteRange(range).toggleBulletList().run();
        },
      },
      {
        title: "Numbered List",
        description: "Create a list with numbering.",
        searchTerms: ["ordered"],
        icon: <ListOrdered size={18} />,
        command: ({ editor, range }) => {
          editor.chain().focus().deleteRange(range).toggleOrderedList().run();
        },
      },
      {
        title: "Quote",
        description: "Capture a quote.",
        searchTerms: ["blockquote"],
        icon: <TextQuote size={18} />,
        command: ({ editor, range }) =>
          editor.chain().focus().deleteRange(range).toggleNode("paragraph", "paragraph").toggleBlockquote().run(),
      },
      {
        title: "Image",
        description: "Upload an image from your computer.",
        searchTerms: ["photo", "picture", "media"],
        icon: <ImageIcon size={18} />,
        command: ({ editor, range }) => {
          editor.chain().focus().deleteRange(range).run();
          // upload image
          const input = document.createElement("input");
          input.type = "file";
          input.accept = "image/*";
          input.onchange = async () => {
            if (input.files?.length) {
              const file = input.files[0];
              const pos = editor.view.state.selection.from;
              uploadFn(file, editor.view, pos);
            }
          };
          input.click();
        },
      },
      {
        title: "horizontalRule",
        searchTerms: ["horizontalRule", "Horizontal"],
        icon: <Spline size={18} />,
        description: "Insert a horizontal divider",
        // @ts-ignore
        aliases: ["hr"],
        command: ({ editor, range }) => {
          editor.chain().focus().deleteRange(range).setHorizontalRule().run();
        },
      },
      {
        title: "codeBlock",
        description: "codeBlock.",
        searchTerms: ["codeBlock", "embed"],
        icon: <Code size={18} />,
        command: ({ editor, range }) => {
          editor.chain().focus().deleteRange(range).setCodeBlock({ language: "javascript" }).run();
        },
      },
      {
        title: "comment",
        description: "comment.",
        searchTerms: ["comment", "embed"],
        icon: <BookLock size={18} />,
        command: ({ editor, range }) => {
          editor.chain().focus().deleteRange(range).setComment({}).run();
        },
      },
    ],
  },
  {
    label: "Other",
    list: [
      {
        title: "Send Feedback",
        description: "Let us know how we can improve.",
        icon: <MessageSquarePlus size={18} />,
        command: ({ editor, range }) => {
          editor.chain().focus().deleteRange(range).run();
          window.open("/feedback", "_blank");
        },
      },
    ],
  },
]);

export const slashCommand = Command.configure({
  suggestion: {
    items: () => suggestionItems,
    render: renderItems,
  },
});
