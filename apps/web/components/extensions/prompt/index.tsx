import { Node, mergeAttributes } from "@tiptap/core";

import useStores from "@/hooks/useStores";
import { NodeViewWrapper, ReactNodeViewRenderer } from "@tiptap/react";
import { observer } from "mobx-react";
import { nanoid } from "nanoid";
import { useEffect } from "react";

const CustomNodeComponent = observer((props) => {
  const { node } = props;
  const promptAttrs = node?.attrs || {};
  const parameters = promptAttrs.parameters || {};
  const { prompts, workbench, setting, mentions, documents } = useStores();

  const prompt = prompts.get(promptAttrs.id);

  const init = async (prompt, promptId) => {
    if (promptId && prompt) {
      const { document: documentInfo } = await documents.fetchWithSharedTree(promptId);

      const inputs = documentInfo?.content?.content
        ?.find((item) => item.type === "inputs")
        .content?.map((input) => {
          return {
            ...input.attrs,
          };
        });
      const parameters = {};

      if (inputs) {
        inputs.map((input) => {
          parameters[input.id] = {
            type: "literal",
            value: "",
          };
        });
      }

      prompt.update({
        promptId: promptAttrs.promptId,
        document: documentInfo,
        inputs,
      });
    }
  };

  useEffect(() => {
    const prompt = prompts.addPrompt({
      id: promptAttrs.id,
      label: promptAttrs.label,
      outputs: promptAttrs.outputs,
      promptId: promptAttrs.promptId,
      parameters,
    });

    init(prompt, promptAttrs.promptId);
  }, []);

  useEffect(() => {
    if (prompt) {
      props.updateAttributes({
        label: prompt.label,
        outputs: prompt.outputs,
        promptId: prompt.promptId,
        parameters: prompt.parameters,
      });
    }
  }, [prompt?.label, prompt?.outputs, prompt?.promptId, prompt?.parameters]);

  const handleClick = (e) => {
    e.stopPropagation();
    prompts.setSelectedId(promptAttrs.id);
    setting.setSettingComponentName("prompt");
    workbench.setShowSidebar();
  };

  return (
    <NodeViewWrapper data-tool="">
      <div className="mb-4 mt-2 select-none rounded-lg border-2 p-3 pt-0 transition-colors duration-200 border-stone-100">
        <div>
          <div
            className="relative left-0 ml-1 mt-[-1px] flex w-fit cursor-pointer items-center rounded-b-lg border-2 px-3 py-1 text-stone-400 transition-colors duration-200 hover:border-stone-200 active:border-stone-300 active:bg-stone-300 active:text-stone-600 border-stone-100 bg-stone-100 hover:bg-stone-200 hover:text-stone-500"
            contentEditable="false"
            onClick={handleClick}
          >
            <span className="ml-2 mr-0.5 inline-block cursor-pointer select-none truncate align-middle text-xs font-semibold uppercase tracking-tight">
              {prompt?.label || "Prompt"}
            </span>
          </div>
          <div className="flex-0 mt-2 w-full px-2">
            <div>
              {prompt?.inputs.map((input) => {
                return (
                  <span
                    key={input.id}
                    className="my-4 inline-flex shrink align-middle text-sm font-semibold text-stone-700"
                  >
                    <span className="cursor-pointer break-normal rounded-full border border-stone-100 bg-stone-50 px-3 py-1.5 hover:bg-stone-100 active:bg-stone-200">
                      {input.label}
                    </span>
                    <span className="mt-0.5 text-lg">:</span>
                    <span className="mx-2 mr-4 mt-0.5 h-full max-w-xs py-1">
                      <div className="inline-block max-w-fit truncate align-bottom w-full">
                        {prompt.parameters[input.id].type === "variable"
                          ? mentions.getMetion(prompt.parameters[input.id].value)?.title
                          : prompt.parameters[input.id].value || ""}
                      </div>
                    </span>
                  </span>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    </NodeViewWrapper>
  );
});

declare module "@tiptap/core" {
  interface Commands<ReturnType> {
    prompt: {
      /**
       * Insert a tweet
       * @param options The tweet attributes
       * @example editor.commands.setTweet({ src: 'https://x.com/seanpk/status/1800145949580517852' })
       */
      setPrompt: (options: any) => ReturnType;
    };
  }
}

export const Prompt = Node.create({
  name: "prompt",

  group: "block",
  draggable: true,
  defining: true,
  selectable: true,
  isolating: false,

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
      label: {
        default: "",
      },
      outputs: {
        default: [],
      },
      promptId: {
        default: "",
      },
      parameters: {
        default: {},
      },
    };
  },

  addNodeView() {
    return ReactNodeViewRenderer(CustomNodeComponent);
  },

  addCommands() {
    return {
      setPrompt:
        (options: any) =>
        ({ commands }) => {
          return commands.insertContent({
            type: this.name,
            attrs: {
              id: nanoid(10),
              ...options,
            },
          });
        },
    };
  },

  parseHTML() {
    return [
      {
        tag: "div[data-prompt]",
      },
    ];
  },

  renderHTML({ HTMLAttributes }) {
    return ["div", mergeAttributes({ "data-prompt": "" }, HTMLAttributes)];
  },
});
