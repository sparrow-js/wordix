import { Node, mergeAttributes } from "@tiptap/core";
import { ReactNodeViewRenderer } from "@tiptap/react";
import { nanoid } from "nanoid";
import { AgentToolNode } from "./tool";
declare module "@tiptap/core" {
  interface Commands<ReturnType> {
    agentTool: {
      setAgentTool: (options: any) => ReturnType;
      setToolWorkflow: (options: any) => ReturnType;
      setAgentModel: (options: any) => ReturnType;
    };
  }
}

export const AgentTool = Node.create({
  name: "agentTool",
  group: "block",
  content: "(toolWorkflow|toolAgent)*",
  defining: true,
  selectable: true,
  isolating: true,
  draggable: false,

  addAttributes() {
    return {
      id: {
        default: null,
      },
      label: {
        default: "tool",
      },
      state: {
        default: {},
      },
    };
  },

  parseHTML() {
    return [
      {
        tag: 'div[data-type="agenticWorkflow"]',
      },
    ];
  },

  renderHTML({ HTMLAttributes }) {
    return ["div", mergeAttributes(HTMLAttributes, { "data-type": "agenticWorkflow" }), 0];
  },

  addCommands() {
    return {
      setAgentTool:
        (options) =>
        ({ commands }) => {
          return commands.insertContent({
            type: this.name,
            content: [
              {
                type: "toolAgent",
                content: [
                    {
                      type: "paragraph",
                    },
                ],
                attrs: {
                  id: nanoid(10),
                },
              },
            ],
            attrs: {
              id: options?.id || nanoid(10),
              label: options?.label || "Agentic Workflow",
              state: options?.state || "default",
            },
          });
        },
        setToolWorkflow:
        (options: any) =>
        ({ commands, state, chain }) => {
          const { tr } = state;

          let foundNode = null;
          tr.doc.descendants((node, pos) => {
            if (node.type.name === "agentTool" && node.attrs.id === options.selectedId) {
              foundNode = { node, pos };
              return false;
            }
          });

          if (!foundNode) {
            console.log("Selected agentic workflow node not found");
            return false;
          }

          const { pos: workflowPos, node: agenticWorkflowNode } = foundNode;
          
          // 计算 agenticWorkflowNode 内容的总大小
          const insertPos = workflowPos + agenticWorkflowNode.nodeSize - 1;

          return chain()
            .insertContentAt(insertPos, {
              type: "toolWorkflow",
              content: [
                {
                  type: "paragraph",
                },
              ],
              attrs: {
                id: nanoid(10),
              },
            })
            .run();
        },
      setToolAgent:
        (options: any) =>
        ({ commands, state, chain }) => {
          const { tr } = state;

          let foundNode = null;
          tr.doc.descendants((node, pos) => {
            if (node.type.name === "agentTool" && node.attrs.id === options.selectedId) {
              foundNode = { node, pos };
              return false;
            }
          });

          if (!foundNode) {
            console.log("Selected agentic workflow node not found");
            return false;
          }

          const { pos: workflowPos, node: agenticWorkflowNode } = foundNode;
          
          // 计算 agenticWorkflowNode 内容的总大小
          const insertPos = workflowPos + agenticWorkflowNode.nodeSize - 1;

          return chain()
            .insertContentAt(insertPos, {
              type: "toolAgent",
              content: [
                {
                  type: "paragraph",
                },
              ],
              attrs: {
                id: nanoid(10),
              },
            })
            .run();
        },
    };
  },

  addNodeView() {
    return ReactNodeViewRenderer(AgentToolNode);
  },
});
