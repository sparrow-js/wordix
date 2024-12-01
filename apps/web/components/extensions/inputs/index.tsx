import { Node, mergeAttributes } from '@tiptap/core'

import { ReactNodeViewRenderer } from "@tiptap/react";
import {InputView} from './node-inputs';
import { v4 as uuidv4 } from 'uuid';


declare module "@tiptap/core" {
  interface Commands<ReturnType> {
    inputs: {
      /**
       * Insert a tweet
       * @param options The tweet attributes
       * @example editor.commands.setTweet({ src: 'https://x.com/seanpk/status/1800145949580517852' })
       */
      setInputs: (options: any) => ReturnType;
      setInput: (options: any) => ReturnType;

    };
  }
}

export const Inputs = Node.create({
  name: 'inputs',

  group: 'block',

  content: 'input*',

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
        default: uuidv4(),
      },
    };
  },

  addNodeView() {
    return ReactNodeViewRenderer(InputView);
  },

  draggable: true,

  addCommands() {
    return {
      setInputs:
        (options: any) =>
        ({ commands }) => {
          // return commands.insertContent({
          //   type: this.name,
          //   attrs: {
          //     ...options,
          //     inputs: [
          //       {
          //         id: uuidv4(),
          //         label: "input",
          //         description: '',
          //         type: 'text'
          //       }
          //     ]
          //   },
          // });

          return commands.insertContent({
            type: this.name,
            content: [
              {
                type: 'input',
                attrs: {
                  id: uuidv4(),
                  label: "input",
                  description: '',
                  type: 'text'
                }
              }
            ],
            attrs: options,
          });

        },
      setInput: (options: any) =>
        ({ commands, chain}) => {
          return commands.insertContent({
            type: 'input',
            attrs: options
          });
        }
    };
  },

  parseHTML() {
    return [
      {
        tag: "div[data-inputs]",
      },
    ];
  },

  renderHTML({ HTMLAttributes }) {
    return ["div", mergeAttributes({ "data-inputs": "" }, HTMLAttributes)];
  },

  // Your code goes here.
})