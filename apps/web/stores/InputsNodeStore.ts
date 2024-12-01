import { action, computed, makeObservable, observable } from "mobx";

import Input from "@/models/input";
import type RootStore from "./RootStore";
import Store from "./base/Store";

export default class InputsNodeStore extends Store<Input> {
  @observable
  selectedId = "";

  @observable
  documentId = "";

  @observable.deep
  inputs: any[] = [];

  constructor(rootStore: RootStore) {
    super(rootStore, Input);
    makeObservable(this);
  }

  @computed
  get input(): any {
    return this.data.get(this.selectedId);
  }

  @computed
  get list(): Input[] {
    const document = this.rootStore.documents.get(this.documentId);
    const inputs = [];
    if (document) {
      const { content } = document;
      content &&
        content.content
          .find((item) => item.type === "inputs")
          ?.content?.forEach((input) => {
            const inputValue = this.data.get(input.attrs.id);
            inputValue && inputs.push(inputValue);
          });
    }

    return inputs;
  }

  @action
  addInput(item: any) {
    item.index = Array.from(this.data.values()).length;
    if (!this.data.has(item.id)) {
      this.add(item);
    }
  }

  @action
  setSelectedId(id: string) {
    this.selectedId = id;
  }

  @action
  setInputs(inputs: any[]) {
    this.inputs = inputs;
  }

  @action
  updateDataSyncToNode(key: string, value: string | number, editor: any) {
    const attr = {};
    attr[key] = value;
    this.input.update(attr);
  }

  syncAttrToNode(editor: any, key: string, value: string | number) {
    const { commands, state, chain } = editor;
    const { selection } = state;
    const { from, $from } = selection;
    let node = state.doc.nodeAt(from);

    // 找不到节点遍历父节点
    if (!node) {
      const parentNode = $from.node();
      const content = parentNode.content.content;
      node = content.find((item) => item.attrs.id === this.selectedId);
    }

    const attr = node.attrs;
    attr[key] = value;
    commands.updateAttributes("input", attr);
  }

  @action
  removeInput(editor: any): void {
    const { state, dispatch } = editor.view;
    const { selection } = state;
    this.rootStore.workbench.setHideSidebar();
    const transaction = state.tr.delete(selection.from, selection.from + 1);
    dispatch(transaction);
    this.remove(this.selectedId);
  }

  @action
  setDocumentId(id: string) {
    this.documentId = id;
  }
}
