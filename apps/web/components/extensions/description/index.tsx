import { Node, mergeAttributes } from "@tiptap/core";
import { ReactNodeViewRenderer } from "@tiptap/react";
import { NodeViewContent, NodeViewWrapper } from "@tiptap/react";

import type React from "react";

interface DescriptionComponentProps {
  node: any;
  updateAttributes: (attrs: Record<string, any>) => void;
}

const DescriptionComponent: React.FC<DescriptionComponentProps> = ({ node, updateAttributes }) => {
  return (
    <NodeViewWrapper className="description">
      <NodeViewContent className="description-content" />
    </NodeViewWrapper>
  );
};

export const Description = Node.create({
  name: "description",

  group: "block",

  content: "block*",

  defining: true,
  selectable: false,
  isolating: true,
  draggable: false,

  parseHTML() {
    return [
      {
        tag: 'div[data-type="description"]',
      },
    ];
  },

  renderHTML({ HTMLAttributes }) {
    return ["div", mergeAttributes({ "data-type": "description" }, HTMLAttributes), 0];
  },

  addAttributes() {
    return {
      class: {
        default: "description",
      },
    };
  },

  addNodeView() {
    return ReactNodeViewRenderer(DescriptionComponent);
  },
});
