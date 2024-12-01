import { action, makeObservable, observable } from "mobx";

class If {
  static modelName = "If";

  @observable
  name: string;

  @observable
  id: string;
  @observable
  type: string;

  @observable
  expression: any;

  @observable
  isOpen = false;

  constructor(fields: Record<string, any>) {
    makeObservable(this);
    this.update(fields);
  }

  @action
  update(data: Partial<If>) {
    for (const key in data) {
      try {
        this[key] = data[key];
      } catch (error) {}
    }
  }

  @action
  updateDataSyncToNode(key: string, value: any) {
    const keys = key.split(".");
    if (keys.length > 1) {
      // Clone the existing object for nested keys
      const currentData = JSON.parse(JSON.stringify(this));
      let target = currentData;

      // Navigate through the object until the second-to-last key
      for (let i = 0; i < keys.length - 1; i++) {
        target = target[keys[i]];
      }

      // Set the value on the last key
      target[keys[keys.length - 1]] = value;
      this.update(currentData);
    } else {
      // For single level keys, use the original logic
      const attr = { [key]: value };
      this.update(attr);
    }
  }
}

export default If;
