import { Node as ProseMirrorNode } from '@tiptap/pm/model';
import { Mappable } from '@tiptap/pm/transform';
import { NodeRangeSelection } from './NodeRangeSelection';
export declare class NodeRangeBookmark {
    anchor: number;
    head: number;
    constructor(anchor: number, head: number);
    map(mapping: Mappable): NodeRangeBookmark;
    resolve(doc: ProseMirrorNode): NodeRangeSelection;
}
