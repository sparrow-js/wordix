import { Extension } from "@tiptap/core";
import type { Editor, Range } from "@tiptap/core";
import { PluginKey } from "@tiptap/pm/state";
import { ReactRenderer } from "@tiptap/react";
import Suggestion, { type SuggestionOptions } from "@tiptap/suggestion";
import type { RefObject } from "react";
import type { ReactNode } from "react";
import tippy, { type GetReferenceClientRect, type Instance, type Props } from "tippy.js";
import { EditorAtCommandOut } from "../components/editor-at-command";

const CommandAt = Extension.create({
  name: "at-command",
  addOptions() {
    return {
      suggestion: {
        char: "@",
        command: ({ editor, range, props }) => {
          props.command({ editor, range });
        },
      } as SuggestionOptions,
    };
  },
  addProseMirrorPlugins() {
    return [
      Suggestion({
        pluginKey: new PluginKey("atCommandSuggestion"),
        editor: this.editor,
        ...this.options.suggestion,
      }),
    ];
  },
});

const renderItemsAt = (elementRef?: RefObject<Element> | null) => {
  let component: ReactRenderer | null = null;
  let popup: Instance<Props>[] | null = null;

  return {
    onStart: (props: { editor: Editor; clientRect: DOMRect }) => {
      component = new ReactRenderer(EditorAtCommandOut, {
        props,
        editor: props.editor,
      });

      const { selection } = props.editor.state;

      const parentNode = selection.$from.node(selection.$from.depth);
      const blockType = parentNode.type.name;

      // if (blockType === "codeBlock") {
      //   return false;
      // }

      // @ts-ignore
      popup = tippy("body", {
        getReferenceClientRect: props.clientRect,
        appendTo: () => (elementRef ? elementRef.current : document.body),
        content: component.element,
        showOnCreate: true,
        interactive: true,
        trigger: "manual",
        placement: "bottom-start",
      });
    },
    onUpdate: (props: { editor: Editor; clientRect: GetReferenceClientRect }) => {
      component?.updateProps(props);

      popup?.[0]?.setProps({
        getReferenceClientRect: props.clientRect,
      });
    },

    onKeyDown: (props: { event: KeyboardEvent }) => {
      if (props.event.key === "Escape") {
        popup?.[0]?.hide();

        return true;
      }

      // @ts-ignore
      return component?.ref?.onKeyDown(props);
    },
    onExit: () => {
      popup?.[0]?.destroy();
      component?.destroy();
    },
  };
};

export interface SuggestionItemAt {
  title: string;
  description: string;
  icon: ReactNode;
  searchTerms?: string[];
  command?: (props: { editor: Editor; range: Range }) => void;
}

export const createSuggestionItemsAt = (items: SuggestionItemAt[]) => items;

export const handleCommandNavigationAt = (event: KeyboardEvent) => {
  if (["ArrowUp", "ArrowDown", "Enter"].includes(event.key)) {
    const slashCommand = document.querySelector("#slash-command");
    if (slashCommand) {
      return true;
    }
  }
};

export { CommandAt, renderItemsAt };
