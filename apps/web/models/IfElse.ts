import type IfElseStore from "@/stores/IfElseStore";
import { action, computed, makeObservable, observable } from "mobx";
import Else from "./Else";
import If from "./If";
import Model from "./base/Model";

class IfElse extends Model {
  static modelName = "IfElse";

  @observable
  label: string;

  @observable
  value: string;

  @observable
  state: string;

  @observable
  data: Map<string, If | Else> = new Map();

  @observable
  content: any[] = [];

  declare store: IfElseStore;

  constructor(fields: Record<string, any>, store: IfElseStore) {
    super(fields, store);
    makeObservable(this);
    this.updateData(fields);
  }

  @computed
  get list() {
    return this.content.map((item) => {
      return this.data.get(item.id);
    });
  }

  @action
  update(data: Partial<IfElse>) {
    for (const key in data) {
      try {
        this[key] = data[key];
      } catch (error) {}
    }
  }

  @action
  addIf(ifCl: If) {
    this.data.set(ifCl.id, new If(ifCl));
  }

  @action
  addElse(elseCl: Else) {
    this.data.set(elseCl.id, new Else(elseCl));
  }

  @action
  addItem(item: any) {
    if (!item.id) {
      return;
    }

    if (item.name === "if") {
      this.addIf(item);
    } else if (item.name === "else") {
      this.addElse(item);
    }
  }

  @action
  removeItem(id: string, editor: any) {
    const { state, view } = editor;
    const { doc, tr } = state;
    const parentNode = this.store.node;
    const childIndex = this.content.findIndex((item) => item.id === id);

    // Validate if the child index is within the range
    if (childIndex < 0 || childIndex >= parentNode.childCount) {
      console.error("Invalid child index");
      return;
    }

    // We'll locate the position of the parentNode in the document
    let pos = -1;

    doc.descendants((node, posValue) => {
      if (node.attrs?.id === parentNode.attrs.id) {
        pos = posValue;
        return false; // Stop the traversal once the parent node is found
      }
      return true; // Continue traversing
    });

    if (pos === -1) {
      console.error("Parent node not found in the document");
      return;
    }

    // Calculate the starting position of the nth child
    let childPos = pos + 1; // Starting from after the parent node's start position
    for (let i = 0; i < childIndex; i++) {
      childPos += parentNode.child(i).nodeSize;
    }

    const childNode = parentNode.child(childIndex);
    const childSize = childNode.nodeSize;

    // Perform the delete transaction
    const transaction = tr.delete(childPos, childPos + childSize);
    view.dispatch(transaction);
    this.content.splice(childIndex, 1);
  }
}

export default IfElse;

export type IfElseType = IfElse;
