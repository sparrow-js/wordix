import { Editor, Extension } from '@tiptap/core';
import { Node } from '@tiptap/pm/model';
import { Props } from 'tippy.js';
export interface DragHandleOptions {
    /**
     * Renders an element that is positioned with tippy.js
     */
    render(): HTMLElement;
    /**
     * Options for tippy.js
     */
    tippyOptions?: Partial<Props>;
    /**
     * Locks the draghandle in place and visibility
     */
    locked?: boolean;
    /**
     * Returns a node or null when a node is hovered over
     */
    onNodeChange?: (options: {
        node: Node | null;
        editor: Editor;
    }) => void;
}
declare module '@tiptap/core' {
    interface Commands<ReturnType> {
        dragHandle: {
            /**
             * Locks the draghandle in place and visibility
             */
            lockDragHandle: () => ReturnType;
            /**
             * Unlocks the draghandle
             */
            unlockDragHandle: () => ReturnType;
            /**
             * Toggle draghandle lock state
             */
            toggleDragHandle: () => ReturnType;
        };
    }
}
export declare const DragHandle: Extension<DragHandleOptions, any>;
