import { action, computed, makeObservable, observable } from "mobx";

import Prompt from "@/models/Prompt";
import type RootStore from "./RootStore";
import Store from "./base/Store";

export default class LoopsNodeStore extends Store<Prompt> {
  @observable
  selectedId = "";

  @observable
  documentId = "";

  @observable.deep
  prompts: Prompt[] = [];

  constructor(rootStore: RootStore) {
    super(rootStore, Prompt);
    makeObservable(this);
  }

  @computed
  get prompt(): Prompt {
    return this.data.get(this.selectedId);
  }

  @computed
  get promptList(): Prompt[] {
    return Array.from(this.data.values());
  }

  @action
  addPrompt(item: any) {
    if (!this.data.has(item.id)) {
      return this.add(item as Prompt);
    }
  }

  @action
  setSelectedId(id: string) {
    this.selectedId = id;
  }

  @action
  setPrompts(prompts: Prompt[]) {
    this.prompts = prompts;
  }

  @action
  updateDataSyncToNode(key: string, value: any) {
    const keys = key.split(".");
    if (keys.length > 1) {
      // Clone the existing object for nested keys
      const currentData = JSON.parse(JSON.stringify(this.prompt));
      let target = currentData;

      // Navigate through the object until the second-to-last key
      for (let i = 0; i < keys.length - 1; i++) {
        target = target[keys[i]];
      }

      // Set the value on the last key
      target[keys[keys.length - 1]] = value;
      this.prompt.update(currentData);
    } else {
      // For single level keys, use the original logic
      const attr = { [key]: value };
      this.prompt.update(attr);
    }
  }

  @action
  removePrompt(editor: any): void {
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

  @action
  setDocumentId(id: string) {
    this.documentId = id;
  }
}
