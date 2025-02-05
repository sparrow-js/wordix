import { Node, mergeAttributes } from '@tiptap/core';
import { ReactNodeViewRenderer } from '@tiptap/react';
import { NodeViewWrapper, NodeViewContent } from '@tiptap/react';

import React from 'react';

const DescriptionComponent = ({ node, updateAttributes }) => {
    return (
      <NodeViewWrapper className="description">
        <NodeViewContent className="description-content" />
      </NodeViewWrapper>
    );
};

export const Description = Node.create({
  name: 'description',

  group: 'block',

  content: 'inline*',

  parseHTML() {
    return [
      {
        tag: 'div[data-type="description"]',
      },
    ];
  },

  renderHTML({ HTMLAttributes }) {
    return ['div', { 'data-type': 'description', ...HTMLAttributes }, 0];
  },

  addAttributes() {
    return {
      class: {
        default: 'description',
      },
    };
  },

  addNodeView() {
    return ReactNodeViewRenderer(DescriptionComponent);
  },
});