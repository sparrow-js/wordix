import AgenticWorkflow from "@/models/AgenticWorkflow";
import { action, computed, makeObservable, observable } from "mobx";
import type RootStore from "./RootStore";
import Store from "./base/Store";

export default class AgenticWorkflowsStore extends Store<AgenticWorkflow> {
  @observable
  selectedId = "";

  @observable
  documentId = "";

  @observable.deep
  agenticWorkflows: AgenticWorkflow[] = [];

  constructor(rootStore: RootStore) {
    super(rootStore, AgenticWorkflow);
    makeObservable(this);
  }

  node: any;

  @computed
  get agenticWorkflow(): AgenticWorkflow {
    return this.data.get(this.selectedId);
  }

  @computed
  get list(): AgenticWorkflow[] {
    const document = this.rootStore.documents.get(this.documentId);
    const agenticWorkflows = [];
    if (document) {
      const { content } = document;
      content?.content
        .find((item) => item.type === "inputs")
        ?.content.forEach((workflow) => {
          const workflowValue = this.data.get(workflow.attrs.id);
          workflowValue && agenticWorkflows.push(workflowValue);
        });
    }

    return agenticWorkflows;
  }

  @action
  addAgenticWorkflow(item: any, content: any) {
    if (!this.data.has(item.id)) {
      const workflow = this.add(item);
      if (content?.content) {
        content.content.forEach((item) => {
          workflow.addItem({
            id: item.attrs.id,
            name: item.type.name,
            type: item.attrs.type,
            expression: item.attrs.expression,
          });
        });
      }

      return workflow;
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
  setAgenticWorkflows(workflows: AgenticWorkflow[]) {
    this.agenticWorkflows = workflows;
  }

  @action
  removeAgenticWorkflow(id: string, editor: any) {
    const workflow = this.data.get(id);
    if (workflow) {
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
      const currentData = JSON.parse(JSON.stringify(this.agenticWorkflow));
      let target = currentData;

      for (let i = 0; i < keys.length - 1; i++) {
        target = target[keys[i]];
      }

      target[keys[keys.length - 1]] = value;
      this.agenticWorkflow.update(currentData);
    } else {
      const attr = { [key]: value };
      this.agenticWorkflow.update(attr);
    }
  }
}
