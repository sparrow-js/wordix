import { action, computed, makeObservable, observable } from "mobx";
import type RootStore from "./RootStore";
import Store from "./base/Store";
import AgentTool from "@/models/AgentTool";

export default class AgentToolStore extends Store<AgentTool> {
  @observable
  selectedId = "";

  @observable.deep
  agentTools: AgentTool[] = [];

  constructor(rootStore: RootStore) {
    super(rootStore, AgentTool);
    makeObservable(this);
  }

  @computed
  get agentTool(): AgentTool {
    return this.data.get(this.selectedId);
  }

  @computed 
  get list(): AgentTool[] {
    return Array.from(this.data.values());
  }

  @action
  setSelectedId(id: string) {
    this.selectedId = id;
  }

  @action
  setAgentTools(tools: AgentTool[]) {
    this.agentTools = tools;
  }

  @action
  removeAgentTool(id: string, editor?: any) {
    const tool = this.data.get(id);
    if (tool) {
      let foundNode = null;
      let foundPos = -1;

      // Find the corresponding node in editor
      editor?.view.state.doc.descendants((node, pos) => {
        if (node.attrs?.id === id) {
          foundNode = node;
          foundPos = pos;
          return false;
        }
        return true;
      });

      // If node found, remove it from editor
      if (foundNode && foundPos !== -1) {
        const { state, dispatch } = editor.view;
        const transaction = state.tr.delete(foundPos, foundPos + foundNode.nodeSize);
        dispatch(transaction);
      }

      // Hide sidebar
      this.rootStore.workbench.setHideSidebar();
    }
    this.remove(id);
  }

  @action
  addAgentTool(item: any) {
    return this.add(item);
  }

  @action
  updateDataSyncToNode(key: string, value: any) {
    const keys = key.split(".");
    if (keys.length > 1) {
      const currentData = JSON.parse(JSON.stringify(this.agentTool));
      let target = currentData;

      for (let i = 0; i < keys.length - 1; i++) {
        target = target[keys[i]];
      }

      target[keys[keys.length - 1]] = value;
      this.agentTool.update(currentData);
    } else {
      const attr = { [key]: value };
      this.agentTool.update(attr);
    }
  }
}
