import { action, makeObservable, observable } from "mobx";
import type RootStore from "./RootStore";

class SettingStore {
  @observable
  settingComponentName = "";

  rootStore: RootStore;

  constructor(rootStore: RootStore) {
    this.rootStore = rootStore;
    makeObservable(this);
  }

  @action
  async setSettingComponentName(name: string, inputs?: any) {
    this.settingComponentName = name;
    if (name === "executeResult") {
      this.rootStore.execute.setInputs(inputs);
    }
  }
}

export default SettingStore;
