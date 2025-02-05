import { action, computed, makeObservable, observable } from "mobx";

import Loop from "@/models/Loop";
import type RootStore from "./RootStore";
import Store from "./base/Store";

export default class LoopsNodeStore extends Store<Loop> {
  @observable
  selectedId = "";

  @observable
  documentId = "";

  @observable.deep
  loops: Loop[] = [];

  constructor(rootStore: RootStore) {
    super(rootStore, Loop);
    makeObservable(this);
  }

  @computed
  get loop(): Loop {
    return this.data.get(this.selectedId);
  }

  @computed
  get loopDocumentIds(): Loop[] {
    return this.orderedData.filter((loop) => loop.documentId === this.rootStore.documents.documentId);
  }

  @action
  addLoop(item: any) {
    if (!this.data.has(item.id)) {
      this.add(item as Loop);
    }
  }

  @action
  setSelectedId(id: string) {
    this.selectedId = id;
  }

  @action
  setLoops(loops: Loop[]) {
    this.loops = loops;
  }

  @action
  updateDataSyncToNode(key: string, value: any) {
    const keys = key.split(".");
    if (keys.length > 1) {
      // Clone the existing object for nested keys
      const currentData = JSON.parse(JSON.stringify(this.loop));
      let target = currentData;

      // Navigate through the object until the second-to-last key
      for (let i = 0; i < keys.length - 1; i++) {
        target = target[keys[i]];
      }

      // Set the value on the last key
      target[keys[keys.length - 1]] = value;
      this.loop.update(currentData);
    } else {
      // For single level keys, use the original logic
      const attr = { [key]: value };
      this.loop.update(attr);
    }
  }

  @action
  removeLoop(editor: any): void {
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
