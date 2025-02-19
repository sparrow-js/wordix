import { action, computed, makeObservable, observable } from "mobx";
import Model from "./base/Model";

class AgentTool extends Model {
  static modelName = "AgentTool";

  @observable
  label: string;

  @observable
  flowLabel: string;
  @observable
  description: string;
  @observable
  value: string;

  @observable
  state: string;

  @observable
  data: Map<string, any> = new Map();

  @observable
  content: any[] = [];

  @observable
  promptId: string;

  @observable
  parameters: any = {};

  @observable
  inputs: any[] = [];

  constructor(fields: Record<string, any>, store: any) {
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
  update(data: Partial<AgentTool>) {
    for (const key in data) {
      try {
        this[key] = data[key];
      } catch (error) {}
    }
  }

  @action
  addItem(item: any) {
    if (!item.id) {
      return;
    }
    this.data.set(item.id, item);
  }

  @action
  removeItem(id: string, editor: any) {
    const { state, view } = editor;
    const { doc, tr } = state;
    const parentNode = this.store.node;
    const childIndex = this.content.findIndex((item) => item.id === id);

    if (childIndex < 0 || childIndex >= parentNode.childCount) {
      console.error("Invalid child index");
      return;
    }

    let pos = -1;

    doc.descendants((node, posValue) => {
      if (node.attrs?.id === parentNode.attrs.id) {
        pos = posValue;
        return false;
      }
      return true;
    });

    if (pos === -1) {
      console.error("Parent node not found in the document");
      return;
    }

    let childPos = pos + 1;
    for (let i = 0; i < childIndex; i++) {
      childPos += parentNode.child(i).nodeSize;
    }

    const childNode = parentNode.child(childIndex);
    const childSize = childNode.nodeSize;

    const transaction = tr.delete(childPos, childPos + childSize);
    view.dispatch(transaction);
    this.content.splice(childIndex, 1);
  }
}

export default AgentTool;

export type AgentToolType = AgentTool;
