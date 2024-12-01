import { action, makeAutoObservable, observable } from "mobx";

class WorkbenchStore {
  @observable
  showSidebar = false;

  @observable
  showRunDetails = false;

  constructor() {
    makeAutoObservable(this);
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
}

export default WorkbenchStore;
