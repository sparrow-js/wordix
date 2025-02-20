import { nanoid } from "nanoid";
export const defaultEditorContent = (title: string) => {
  return {
    type: "doc",
    content: [
      { type: "title", attrs: { level: 1 }, content: [{ type: "text", text: title }] },
      { type: "description", attrs: { class: "description" }, content: [{ type: "paragraph" }] },
      {
        type: "inputs",
        attrs: { inputs: [], test: 1 },
        content: [
          {
            type: "input",
            attrs: {
              id: nanoid(10),
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
};
