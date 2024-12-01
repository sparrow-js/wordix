import { Extension } from '@tiptap/core';
export interface NodeRangeOptions {
    depth: number | undefined;
    key: 'Shift' | 'Control' | 'Alt' | 'Meta' | 'Mod' | null | undefined;
}
export declare const NodeRange: Extension<NodeRangeOptions, any>;
