import Generation from "@/models/generation";
import { action, computed, makeObservable, observable } from "mobx";
import type RootStore from "./RootStore";
import Store from "./base/Store";

export default class GenerationsStore extends Store<Generation> {
  @observable
  currentId: string;

  constructor(rootStore: RootStore) {
    super(rootStore, Generation);
    makeObservable(this);
  }

  @action
  addGeneration(item: any) {
    if (!this.data.has(item.id)) {
      this.add(item);
    }
  }

  @computed
  get currentGeneration(): Generation {
    return this.data.get(this.currentId);
  }

  @action
  updateDataSyncToNode(key: string, value: any, editor?: any) {
    const attr = {};
    attr[key] = value;
    this.currentGeneration.update(attr);
    editor && this.syncAttrToNode(editor, key, value);
  }

  syncAttrToNode(editor: any, key: string, value: string | number) {
    const { commands, state, chain } = editor;

    const { selection } = state;
    const { from } = selection;
    const node = state.doc.nodeAt(from);

    const attr = node.attrs;
    attr[key] = value;
    const json = editor.getJSON();

    commands.updateAttributes("generation", attr);
  }

  removeGeneration(id: string) {
    let foundNode = null;
    let foundPos = -1;

    // @ts-ignore
    const editor = window.editor;

    editor?.view.state.doc.descendants((node, pos) => {
      if (node.attrs?.id === id) {
        foundNode = node;
        foundPos = pos;
        return false;
      }
      return true;
    });

    if (foundNode && foundPos !== -1) {
      const { state, dispatch } = editor.view;
      const transaction = state.tr.delete(foundPos, foundPos + foundNode.nodeSize);
      dispatch(transaction);
    }

    this.remove(id);
  }
}
