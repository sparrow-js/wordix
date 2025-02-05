import { Node as ProseMirrorNode, ResolvedPos } from '@tiptap/pm/model';
import { Selection } from '@tiptap/pm/state';
import { Mapping } from '@tiptap/pm/transform';
import { NodeRangeBookmark } from './NodeRangeBookmark';
export declare class NodeRangeSelection extends Selection {
    depth: number | undefined;
    constructor($anchor: ResolvedPos, $head: ResolvedPos, depth?: number, bias?: number);
    get $to(): ResolvedPos;
    eq(other: Selection): boolean;
    map(doc: ProseMirrorNode, mapping: Mapping): NodeRangeSelection;
    toJSON(): {
        type: string;
        anchor: number;
        head: number;
    };
    get isForwards(): boolean;
    get isBackwards(): boolean;
    extendBackwards(): NodeRangeSelection;
    extendForwards(): NodeRangeSelection;
    static fromJSON(doc: ProseMirrorNode, json: any): NodeRangeSelection;
    static create(doc: ProseMirrorNode, anchor: number, head: number, depth?: number, bias?: number): NodeRangeSelection;
    getBookmark(): NodeRangeBookmark;
}
