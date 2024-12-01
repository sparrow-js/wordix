import { action, computed, makeObservable, observable } from "mobx";

import CodeExecutor from "@/models/CodeExecutor";
import type RootStore from "./RootStore";
import Store from "./base/Store";

export default class CodeExecutorsStore extends Store<CodeExecutor> {
  @observable
  selectedId = "";

  @observable.deep
  codeExecutors: CodeExecutor[] = [];

  constructor(rootStore: RootStore) {
    super(rootStore, CodeExecutor);
    makeObservable(this);
  }

  @computed
  get codeExecutor(): CodeExecutor {
    return this.data.get(this.selectedId);
  }

  @action
  addCodeExecutor(item: any) {
    if (!this.data.has(item.id)) {
      this.add(item as CodeExecutor);
    }
  }

  @action
  setSelectedId(id: string) {
    this.selectedId = id;
  }

  @action
  updateDataSyncToNode(key: string, value: any) {
    const keys = key.split(".");
    if (keys.length > 1) {
      // Clone the existing object for nested keys
      const currentData = JSON.parse(JSON.stringify(this.codeExecutor));
      let target = currentData;

      // Navigate through the object until the second-to-last key
      for (let i = 0; i < keys.length - 1; i++) {
        target = target[keys[i]];
      }

      // Set the value on the last key
      target[keys[keys.length - 1]] = value;
      this.codeExecutor.update(currentData);
    } else {
      // For single level keys, use the original logic
      const attr = { [key]: value };
      this.codeExecutor.update(attr);
    }
  }

  @action
  removeCodeExecutor(editor: any): void {
    const { state, dispatch } = editor.view;
    let foundNode = null;
    let foundPos = -1;
    this.rootStore.workbench.setHideSidebar();

    state.doc.descendants((node, pos) => {
      if (node.attrs?.id === this.selectedId) {
        foundNode = node;
        foundPos = pos;
        return false;
      }
      return true;
    });

    if (foundPos >= 0 && foundNode) {
      const transaction = state.tr.delete(foundPos, foundPos + foundNode.nodeSize);
      dispatch(transaction);
    }
    this.remove(this.selectedId);
  }
}
