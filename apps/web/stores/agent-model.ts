import { action, computed, makeObservable, observable } from "mobx";
import type RootStore from "./RootStore";
import Store from "./base/Store";
import AgentModel from "@/models/AgentModel";

export default class AgentModelStore extends Store<AgentModel> {
  @observable
  selectedId = "";

  @observable.deep
  agentModels: AgentModel[] = [];

  constructor(rootStore: RootStore) {
    super(rootStore, AgentModel);
    makeObservable(this);
  }

  @computed
  get agentModel(): AgentModel {
    return this.data.get(this.selectedId);
  }

  @computed 
  get list(): AgentModel[] {
    return Array.from(this.data.values());
  }

  @action
  setSelectedId(id: string) {
    this.selectedId = id;
  }

  @action
  setAgentModels(models: AgentModel[]) {
    this.agentModels = models;
  }

  @action
  removeAgentModel(id: string, editor?: any) {
    const model = this.data.get(id);
    if (model) {
      let foundNode = null;
      let foundPos = -1;

      // 在编辑器中查找对应节点
      editor?.view.state.doc.descendants((node, pos) => {
        if (node.attrs?.id === id) {
          foundNode = node;
          foundPos = pos;
          return false;
        }
        return true;
      });

      // 如果找到节点，从编辑器中删除
      if (foundNode && foundPos !== -1) {
        const { state, dispatch } = editor.view;
        const transaction = state.tr.delete(foundPos, foundPos + foundNode.nodeSize);
        dispatch(transaction);
      }

      // 隐藏侧边栏
      this.rootStore.workbench.setHideSidebar();
    }
    this.remove(id);
  }

  @action
  addAgentModel(item: any) {
    return this.add(item);
  }

  @action
  updateDataSyncToNode(key: string, value: any) {
    const keys = key.split(".");
    if (keys.length > 1) {
      const currentData = JSON.parse(JSON.stringify(this.agentModel));
      let target = currentData;

      for (let i = 0; i < keys.length - 1; i++) {
        target = target[keys[i]];
      }

      target[keys[keys.length - 1]] = value;
      this.agentModel.update(currentData);
    } else {
      const attr = { [key]: value };
      this.agentModel.update(attr);
    }
  }
}
