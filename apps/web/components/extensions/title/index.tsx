import { Node, mergeAttributes, textblockTypeInputRule } from "@tiptap/core";

/**
 * The title level options.
 */
export type Level = 1 | 2 | 3 | 4 | 5 | 6;

export interface TitleOptions {
  /**
   * The available title levels.
   * @default [1, 2, 3, 4, 5, 6]
   * @example [1, 2, 3]
   */
  levels: Level[];

  /**
   * The HTML attributes for a title node.
   * @default {}
   * @example { class: 'foo' }
   */
  HTMLAttributes: Record<string, any>;
}

declare module "@tiptap/core" {
  interface Commands<ReturnType> {
    title: {
      /**
       * Set a title node
       * @param attributes The title attributes
       * @example editor.commands.setTitle({ level: 1 })
       */
      setTitle: (attributes: { level: Level }) => ReturnType;
      /**
       * Toggle a title node
       * @param attributes The title attributes
       * @example editor.commands.toggleTitle({ level: 1 })
       */
      toggleTitle: (attributes: { level: Level }) => ReturnType;
    };
  }
}

/**
 * This extension allows you to create titles.
 */
export const Title = Node.create<TitleOptions>({
  name: "title",

  addOptions() {
    return {
      levels: [1, 2, 3, 4, 5, 6],
      HTMLAttributes: {
        class: "rounded-lg",
      },
    };
  },

  content: "inline*",

  group: "block",

  defining: true,

  addAttributes() {
    return {
      level: {
        default: 1,
        rendered: false,
      },
    };
  },

  parseHTML() {
    return this.options.levels.map((level: Level) => ({
      tag: `h${level}`,
      attrs: { level },
    }));
  },

  renderHTML({ node, HTMLAttributes }) {
    const hasLevel = this.options.levels.includes(node.attrs.level);
    const level = hasLevel ? node.attrs.level : this.options.levels[0];

    return [`h${level}`, mergeAttributes(this.options.HTMLAttributes, HTMLAttributes), 0];
  },

  addCommands() {
    return {
      setTitle:
        (attributes) =>
        ({ commands }) => {
          if (!this.options.levels.includes(attributes.level)) {
            return false;
          }

          return commands.setNode(this.name, attributes);
        },
      toggleTitle:
        (attributes) =>
        ({ commands }) => {
          if (!this.options.levels.includes(attributes.level)) {
            return false;
          }

          return commands.toggleNode(this.name, "paragraph", attributes);
        },
    };
  },

  // addKeyboardShortcuts() {
  //   return {
  //     Delete: ({ editor }) => {
  //       const { $anchor } = editor.state.selection;

  //       // Find the previous node
  //       const parentPos = $anchor.before();
  //       const node = editor.state.doc.nodeAt(parentPos);
  //       // 如果选择的范围是一个空的 title 节点，则阻止删除
  //       if (node && node.type.name === this.name && node.textContent === "") {
  //         return true; // 阻止删除
  //       }

  //       return false; // 允许正常删除
  //     },
  //     Backspace: ({ editor }) => {
  //       const { $anchor } = editor.state.selection;

  //       // Find the previous node
  //       const parentPos = $anchor.before();
  //       const node = editor.state.doc.nodeAt(parentPos);
  //       // 如果选择的范围是一个空的 title 节点，则阻止删除
  //       if (node && node.type.name === this.name && node.textContent === "") {
  //         return true; // 阻止删除
  //       }

  //       return false; // 允许正常删除
  //     },
  //   };
  // },

  addInputRules() {
    return this.options.levels.map((level) => {
      return textblockTypeInputRule({
        find: new RegExp(`^(#{1,${level}})\\s$`),
        type: this.type,
        getAttributes: {
          level,
        },
      });
    });
  },
});
