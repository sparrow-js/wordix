import { Node, mergeAttributes } from "@tiptap/core";
import { ReactNodeViewRenderer } from "@tiptap/react";
import { AgentModelNode } from "./model";

export const AgentModel = Node.create({
  name: "agentModel",
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
        default: "agent",
      },
      label: {
        default: "Model",
      },
      model: {
        default: "",
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
    return ReactNodeViewRenderer(AgentModelNode);
  },
});

export default AgentModel;
