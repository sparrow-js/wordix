import { Node, mergeAttributes } from "@tiptap/core";
import { ReactNodeViewRenderer } from "@tiptap/react";
import { nanoid } from "nanoid";
import { AgenticWorkflowNode } from "./agentic-workflow";
declare module "@tiptap/core" {
  interface Commands<ReturnType> {
    agenticWorkflow: {
      setAgenticWorkflow: (options: any) => ReturnType;
      setAgentModel: (options: any) => ReturnType;
    };
  }
}

export const AgenticWorkflow = Node.create({
  name: "agenticWorkflow",
  group: "block",
  content: "(toolWorkflow|toolAgent|agentModel|agentTool)*",
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
        default: "Agentic Workflow",
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
      setAgenticWorkflow:
        (options) =>
        ({ commands }) => {
          return commands.insertContent({
            type: this.name,
            content: [
              {
                type: "agentModel",
                content: [
                    {
                      type: "paragraph",
                    },
                ],
                attrs: {
                  id: nanoid(10),
                  model: "gpt-4o",
                  label: "Model",
                },
              },
              {
                type: "agentTool",
                content: [
                    {
                      type: "toolWorkflow",
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
        setAgentModel:
        (options: any) =>
        ({ commands, state, chain }) => {
            const { tr } = state;

            let foundNode = null;
            tr.doc.descendants((node, pos) => {
              if (node.type.name === "agenticWorkflow" && node.attrs.id === options.selectedId) {
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
                type: "agentModel",
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
        }
    };
  },

  addNodeView() {
    return ReactNodeViewRenderer(AgenticWorkflowNode);
  },
});
