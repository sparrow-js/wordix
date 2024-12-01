import { v4 as uuidv4 } from "uuid";
export const defaultEditorContent = {
  type: "doc",
  content: [
    { type: "title", attrs: { level: 1 }, content: [{ type: "text", text: "Untitled" }] },
    { type: "description", attrs: { class: "description" }, content: [{ type: "paragraph" }] },
    {
      type: "inputs",
      attrs: { inputs: [], test: 1 },
      content: [
        {
          type: "input",
          attrs: {
            id: uuidv4(),
            label: "name",
            description: "",
            type: "text",
          },
        },
      ],
    },
    { type: "horizontalRule" },
    { type: "paragraph" },
  ],
};
