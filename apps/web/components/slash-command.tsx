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
  Speaker,
  Spline,
  Split,
  Text,
  TextQuote,
  Wrench,
} from "lucide-react";
import { nanoid } from "nanoid";
import { uploadFn } from "./image-upload";

export const suggestionItems = createSuggestionItems([
  {
    label: "AI",
    list: [
      {
        title: "Generation",
        description: "generation text.",
        searchTerms: ["generation", "text"],
        icon: <Brain size={18} />,
        command: ({ editor, range }) => {
          editor.chain().focus().deleteRange(range).setGeneration({}).run();
        },
      },
      {
        title: "Image Generation",
        description: "a image generation.",
        searchTerms: ["image", "generation"],
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
        description: "execute a loop.",
        searchTerms: ["generation", "execute"],
        icon: <Repeat size={18} />,
        command: ({ editor, range }) => {
          editor
            .chain()
            .focus()
            .deleteRange(range)
            .setLoop({
              id: nanoid(10),
              count: 5,
              expression: {},
            })
            .run();
        },
      },
      {
        title: "CodeExecutor",
        description: "execute a code.",
        searchTerms: ["Code", "execute"],
        icon: <Code size={18} />,
        command: ({ editor, range }) => {
          editor
            .chain()
            .focus()
            .deleteRange(range)
            .setCodeExecutor({
              id: nanoid(10),
              label: "CodeExecutor",
              language: "js",
            })
            .run();
        },
      },
      {
        title: "IfElse",
        description: "if else.",
        searchTerms: ["IfElse", "if"],
        icon: <Split size={18} />,
        command: ({ editor, range }) => {
          editor.chain().focus().deleteRange(range).setIfElse({}).run();
        },
      },
      {
        title: "Flow",
        description: "Flow.",
        searchTerms: ["Flow", "flow"],
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
        title: "webscrape",
        description: "webscrape",
        searchTerms: ["webscrape"],
        icon: <Wrench size={18} />,
        command: ({ editor, range }) => {
          editor
            .chain()
            .focus()
            .deleteRange(range)
            .setTool({
              id: nanoid(10),
              label: "webscrape",
              toolId: "webscrape",
              output: [],
              parameters: {
                url: {
                  type: "literal",
                  value: "",
                },
                selector: {
                  type: "literal",
                  value: "body",
                },
              },
            })
            .run();
        },
      },
      {
        title: "TextToSpeech",
        description: "TextToSpeech",
        searchTerms: ["TextToSpeech"],
        icon: <Speaker size={18} />,
        command: ({ editor, range }) => {
          editor
            .chain()
            .focus()
            .deleteRange(range)
            .setTool({
              id: nanoid(10),
              label: "Text To Speech",
              toolId: "textToSpeech",
              output: [],
              parameters: {
                text: {
                  type: "literal",
                  value: "",
                },
                voice: {
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
