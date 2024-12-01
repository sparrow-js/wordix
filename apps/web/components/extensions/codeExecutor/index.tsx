import useStores from "@/hooks/useStores";
import { Node, mergeAttributes } from "@tiptap/core";
import { NodeViewContent, NodeViewWrapper, ReactNodeViewRenderer } from "@tiptap/react";
import { Play } from "lucide-react";
import { observer } from "mobx-react";
import { useEffect, useRef } from "react";

interface CodeExecutorAttributes {
  id: string;
  logs: string;
  error: boolean;
  label: string;
  state: "editor" | "running" | "complete";
  language: string;
  includeOutput: boolean;
  continueOnError: boolean;
}

const CustomNodeComponent = observer((props: { node: { attrs: CodeExecutorAttributes } } & any) => {
  const domRef = useRef<HTMLDivElement>(null);
  const { id, label, state, language, logs, error, includeOutput, continueOnError } = props.node.attrs;
  const { workbench, setting, ifElses, codeExecutors } = useStores();

  useEffect(() => {
    codeExecutors.addCodeExecutor({
      id,
      label,
      state,
      language,
      logs,
      error,
      includeOutput,
      continueOnError,
    });
  }, []);
  const codeExecutor = codeExecutors.get(id);

  useEffect(() => {
    if (!codeExecutor) {
      props.updateAttributes({
        id,
        label,
        state,
        language,
        logs,
        error,
        includeOutput,
        continueOnError,
      });
    }
  }, [
    codeExecutor?.label,
    codeExecutor?.state,
    codeExecutor?.logs,
    codeExecutor?.error,
    codeExecutor?.includeOutput,
    codeExecutor?.continueOnError,
  ]);

  const handleClick = (e) => {
    e.stopPropagation();
    codeExecutors.setSelectedId(id);
    setting.setSettingComponentName("codeExecutor");
    workbench.setShowSidebar();
  };

  return (
    <NodeViewWrapper data-type="codeExecutor">
      <div
        className="mb-4 select-none rounded-lg border-2 bg-white p-3 pt-0 transition-colors duration-200 border-stone-100"
        style={{ whiteSpace: "normal" }}
      >
        <div
          className="relative left-0 ml-1 mt-[-1px] flex w-fit cursor-pointer items-center rounded-b-lg border-2 px-3 py-1 text-stone-400 transition-colors duration-200 hover:border-stone-200 active:border-stone-300 active:bg-stone-300 active:text-stone-600 border-stone-100 bg-stone-100 hover:bg-stone-200 hover:text-stone-500"
          contentEditable="false"
          onClick={handleClick}
        >
          <Play size={16} />
          <span className="ml-2 mr-0.5 inline-block select-none align-middle text-xs font-semibold uppercase tracking-tight">
            {codeExecutor?.label || "Execute Code"}
          </span>
        </div>
        <NodeViewContent className="mt-4" as="div" />
      </div>
    </NodeViewWrapper>
  );
});

declare module "@tiptap/core" {
  interface Commands<ReturnType> {
    codeExecutor: {
      setCodeExecutor: (options: Partial<CodeExecutorAttributes>) => ReturnType;
    };
  }
}

export const CodeExecutor = Node.create({
  name: "codeExecutor",

  group: "block",
  content: "block",
  defining: true,
  selectable: false,
  isolating: true,

  addOptions() {
    return {
      HTMLAttributes: {},
    };
  },

  addAttributes() {
    return {
      id: {
        default: null,
        parseHTML: (element) => element.getAttribute("data-id"),
        renderHTML: (attributes) => {
          return { "data-id": attributes.id };
        },
      },
      logs: {
        default: "[]",
      },
      error: {
        default: false,
      },
      label: {
        default: "Execute Code",
      },
      state: {
        default: "editor",
      },
      language: {
        default: "js",
      },
      includeOutput: {
        default: true,
      },
      continueOnError: {
        default: false,
      },
    };
  },

  addNodeView() {
    return ReactNodeViewRenderer(CustomNodeComponent);
  },

  draggable: true,

  addCommands() {
    return {
      setCodeExecutor:
        (options: Partial<CodeExecutorAttributes>) =>
        ({ commands }) => {
          return commands.insertContent({
            type: this.name,
            content: [
              {
                type: "codeBlock",
                attrs: {
                  language: options.language || "js",
                },
              },
            ],
            attrs: options,
          });
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

  addKeyboardShortcuts() {
    return {
      Backspace: ({ editor }) => {
        const { selection } = editor.state;
        const { $anchor } = selection;

        try {
          const parentPos = $anchor.before();
          if (parentPos > 0) {
            // Use -1 to get the previous node before the current parent node
            const prevNode = editor.state.doc.nodeAt(parentPos - 1);

            if (prevNode) {
              console.log("Previous node:", prevNode);
            }
            // Check if the selection is at the start of an empty block within the loop node
            if (
              $anchor.parentOffset === 0 &&
              ($anchor.parent.type.name === this.name || (prevNode && prevNode.type.name === this.name))
            ) {
              return editor.commands.deleteNode(this.name);
            }

            return false; // Allow default behavior if conditions are not met
          }
        } catch (e) {}
      },
      Delete: ({ editor }) => {
        const { selection } = editor.state;
        const { $head } = selection;

        // Check if the selection is at the end of an empty block within the loop node
        if ($head.parentOffset === $head.parent.content.size && $head.parent.type.name === this.name) {
          return editor.commands.deleteNode(this.name);
        }

        return false; // Allow default behavior if conditions are not met
      },
    };
  },
});
