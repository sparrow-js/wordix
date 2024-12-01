import Workspace from "@/models/Workspace";
import { action, computed, makeObservable, observable } from "mobx";
import type RootStore from "./RootStore";
import Store from "./base/Store";

export default class WorkspaceStore extends Store<Workspace> {
  @observable
  selectedWorkspaceId: string | null = null;

  constructor(rootStore: RootStore) {
    super(rootStore, Workspace);
    makeObservable(this);
  }

  @computed
  get orderedList(): Workspace[] {
    let workspaces = Array.from(this.data.values());
    workspaces = workspaces.filter((workspace) => !workspace.deletedAt);
    return workspaces.sort((a, b) => {
      return a.updatedAt > b.updatedAt ? -1 : 1;
    });
  }

  @action
  setSelectedWorkspaceId(id: string) {
    localStorage.setItem("workspaceId", id);
    this.selectedWorkspaceId = id;
  }
}
