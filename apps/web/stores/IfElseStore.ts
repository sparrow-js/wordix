import { action, computed, makeObservable, observable } from "mobx";

import IfElse from "@/models/IfElse";
import type RootStore from "./RootStore";
import Store from "./base/Store";

export default class IfElseStore extends Store<IfElse> {
  @observable
  selectedId = "";

  @observable
  documentId = "";

  @observable.deep
  ifElses: IfElse[] = [];

  constructor(rootStore: RootStore) {
    super(rootStore, IfElse);
    makeObservable(this);
  }

  node: any;

  @computed
  get ifElse(): IfElse {
    return this.data.get(this.selectedId);
  }

  @computed
  get list(): IfElse[] {
    const document = this.rootStore.documents.get(this.documentId);
    const ifElses = [];
    if (document) {
      const { content } = document;
      content &&
        content.content
          .find((item) => item.type === "inputs")
          ?.content.forEach((ifElse) => {
            const ifElseValue = this.data.get(ifElse.attrs.id);
            ifElseValue && ifElses.push(ifElseValue);
          });
    }

    return ifElses;
  }

  @action
  addIfElse(item: any, content: any) {
    if (!this.data.has(item.id)) {
      const ifElse = this.add(item);
      if (content?.content) {
        content.content.forEach((item) => {
          ifElse.addItem({
            id: item.attrs.id,
            name: item.type.name,
            type: item.attrs.type,
            expression: item.attrs.expression,
          });
        });
      }

      return ifElse;
    }
  }

  @action
  setSelectedId(id: string) {
    this.selectedId = id;
  }

  @action
  setNode(node: any) {
    this.node = node;
  }

  @action
  setIfElses(ifElses: IfElse[]) {
    this.ifElses = ifElses;
  }

  @action
  removeIfElse(id: string, editor: any) {
    const ifElse = this.data.get(id);
    if (ifElse) {
      let foundNode = null;
      let foundPos = -1;

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

      this.rootStore.workbench.setHideSidebar();
    }
    this.remove(id);
  }

  @action
  updateDataSyncToNode(key: string, value: any) {
    const keys = key.split(".");
    if (keys.length > 1) {
      // Clone the existing object for nested keys
      const currentData = JSON.parse(JSON.stringify(this.ifElse));
      let target = currentData;

      // Navigate through the object until the second-to-last key
      for (let i = 0; i < keys.length - 1; i++) {
        target = target[keys[i]];
      }

      // Set the value on the last key
      target[keys[keys.length - 1]] = value;
      this.ifElse.update(currentData);
    } else {
      // For single level keys, use the original logic
      const attr = { [key]: value };
      this.ifElse.update(attr);
    }
  }
}
