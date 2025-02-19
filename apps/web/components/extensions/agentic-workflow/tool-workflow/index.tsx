import { Node, mergeAttributes } from "@tiptap/core";
import { ReactNodeViewRenderer } from "@tiptap/react";
import { ToolWorkflowNode } from "./tool-workflow";

export const ToolWorkflow = Node.create({
  name: "toolWorkflow",
  content: "block*",
  defining: true,
  selectable: true,
  isolating: true,
  draggable: true,

  addOptions() {
    return {
      HTMLAttributes: {},
    };
  },

  addAttributes() {
    return {
      id: {
        default: "",
      },
      type: {
        default: "workflow",
      },
      label: {
        default: "workflow",
      },
      flowLabel: {
        default: "workflow",
      },
      promptId: {
        default: "",
      },
      description: {
        default: "",
      },
      parameters: {
        default: {},
      },
    };
  },

  parseHTML() {
    return [
      {
        tag: `div[data-type="${this.name}"]`,
      },
    ];
  },

  renderHTML({ HTMLAttributes }) {
    return [
      "div",
      mergeAttributes(this.options.HTMLAttributes, HTMLAttributes, {
        "data-type": this.name,
      }),
      0,
    ];
  },

  addNodeView() {
    return ReactNodeViewRenderer(ToolWorkflowNode);
  },
});

export default ToolWorkflow;
