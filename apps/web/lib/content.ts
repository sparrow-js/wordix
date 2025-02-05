export const defaultEditorContent = {
  type: "doc",
  content: [
    {
      type: "title",
      attrs: { level: 1 },
      content: [{ type: "text", text: "Introducing Novel" }],
    },
    {
      type: "description",
      content: [
        {
          type: "text",
          text: " is a Notion-style WYSIWYG editor with AI-powered autocompletion. Built with ",
        },
      ],
    },
    { type: "horizontalRule" },
    {
      "type": "inputs",
      "content": [
        {
          "type": "input",
          "attrs": {
            "id": "2ca29f17-825b-4e60-85c3-eceb43ddf562",
            "type": "text",
            "label": "name",
            "description": "Enter the name of the person to say hello to"
          }
        }
      ]
    }
  ],
};
