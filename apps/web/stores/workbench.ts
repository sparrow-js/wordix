import { action, makeObservable, observable } from "mobx";

class WorkbenchStore {
  @observable
  showSidebar = false;

  @observable
  showRunDetails = false;

  @observable
  agenticWorkflowRunning: any = null;

  @observable
  editor: any;

  constructor() {
    makeObservable(this);
  }

  toggleSidebar = () => {
    this.showSidebar = !this.showSidebar;
  };

  @action
  setShowSidebar = () => {
    this.showSidebar = true;
  };

  @action
  setHideSidebar = () => {
    this.showSidebar = false;
  };

  @action
  setShowRunDetails = () => {
    this.showRunDetails = true;
  };

  @action
  setHideRunDetails = () => {
    this.showRunDetails = false;
  };

  @action
  setEditor = (editor: any) => {
    this.editor = editor;
  };

  @action
  setAgenticWorkflowRunning = (agenticWorkflowRunning: any) => {
    this.agenticWorkflowRunning = agenticWorkflowRunning;
  };
}

export default WorkbenchStore;
