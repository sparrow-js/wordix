import useStores from "@/hooks/useStores";
import { Node, mergeAttributes } from "@tiptap/core";
import { observer } from "mobx-react";
import { useEffect } from "react";

import { NodeViewWrapper, ReactNodeViewRenderer } from "@tiptap/react";
import { nanoid } from "nanoid";
import PromptGenerationComponent from "./component/promptGeneration";
import StableDiffusionComponent from "./component/stableDiffusion";

const TOOL_COMPONENTS = {
  stableDiffusion: StableDiffusionComponent,
  promptGeneration: PromptGenerationComponent,
};

const CustomNodeComponent = observer((props) => {
  const { setting, workbench, tools } = useStores();

  useEffect(() => {
    tools.addTool({
      id: props.node.attrs.id,
      label: props.node.attrs.label,
      toolId: props.node.attrs.toolId,
      output: props.node.attrs.output,
      parameters: props.node.attrs.parameters,
    });
  }, []);

  const tool = tools.get(props.node.attrs.id);
  const Component = TOOL_COMPONENTS[tool?.toolId];

  const handlerClick = () => {
    setting.setSettingComponentName("tool");
    tools.setSelectedId(props.node.attrs.id);
    workbench.setShowSidebar();
  };

  return (
    <NodeViewWrapper>
      <div className="mb-4 mt-2 select-none rounded-lg border-2 p-3 pt-0 transition-colors duration-200 border-stone-100">
        <div>
          <div
            className="relative left-0 ml-1 mt-[-1px] flex w-fit cursor-pointer items-center rounded-b-lg border-2 px-3 py-1 text-stone-400 transition-colors duration-200 hover:border-stone-200 active:border-stone-300 active:bg-stone-300 active:text-stone-600 border-stone-100 bg-stone-100 hover:bg-stone-200 hover:text-stone-500"
            contentEditable="false"
            onClick={handlerClick}
          >
            <span className="ml-2 mr-0.5 inline-block cursor-pointer select-none truncate align-middle text-xs font-semibold uppercase tracking-tight">
              {tool?.label}
            </span>
          </div>
          {Component && <Component {...props} />}
        </div>
      </div>
    </NodeViewWrapper>
  );
});

declare module "@tiptap/core" {
  interface Commands<ReturnType> {
    tool: {
      /**
       * Insert a tweet
       * @param options The tweet attributes
       * @example editor.commands.setTweet({ src: 'https://x.com/seanpk/status/1800145949580517852' })
       */
      setTool: (options: any) => ReturnType;
    };
  }
}

export const Tool = Node.create({
  name: "tool",

  group: "block",

  // content: 'inline*',

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
      toolId: {
        default: "",
      },
      output: {
        default: {},
      },
      parameters: {
        default: {},
      },
    };
  },

  addNodeView() {
    return ReactNodeViewRenderer(CustomNodeComponent);
  },

  draggable: true,

  addCommands() {
    return {
      setTool:
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
        tag: "div[data-tool]",
      },
    ];
  },

  renderHTML({ HTMLAttributes }) {
    return ["div", mergeAttributes({ "data-tool": "" }, HTMLAttributes)];
  },

  // Your code goes here.
});
