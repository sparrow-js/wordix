import { Editor } from '@tiptap/core';
import { Node } from '@tiptap/pm/model';
export type FindElementNextToCoords = {
    x: number;
    y: number;
    direction?: 'left' | 'right';
    editor: Editor;
};
export declare const findElementNextToCoords: (options: FindElementNextToCoords) => {
    resultElement: HTMLElement | null;
    resultNode: Node | null;
    pos: number | null;
};
