import { Editor } from '@tiptap/core';
import { Node } from '@tiptap/pm/model';
import { Plugin, PluginKey } from '@tiptap/pm/state';
import { Props as TippyProps } from 'tippy.js';
export interface DragHandlePluginProps {
    pluginKey?: PluginKey | string;
    editor: Editor;
    element: HTMLElement;
    onNodeChange?: (data: {
        editor: Editor;
        node: Node | null;
        pos: number;
    }) => void;
    tippyOptions?: Partial<TippyProps>;
}
export declare const dragHandlePluginDefaultKey: PluginKey<any>;
export declare const DragHandlePlugin: ({ pluginKey, element, editor, tippyOptions, onNodeChange, }: DragHandlePluginProps) => Plugin<{
    locked: boolean;
}>;
