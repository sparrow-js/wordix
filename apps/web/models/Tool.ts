import type ToolStore from "@/stores/ToolStore";
import { action, makeObservable, observable } from "mobx";
import Model from "./base/Model";
import Field from "./decorators/Field";

class Tool extends Model {
  static modelName = "Loop";

  @Field
  @observable
  label: string;

  @observable
  toolId: string;

  @observable
  output: any[];

  @observable
  parameters: any = {
    aspect_ratio: {
      type: "literal",
      value: "16:9",
    },
    model: {
      type: "literal",
      value: "black-forest-labs/flux-1.1-pro",
    },
    prompt: {
      type: "literal",
      value: "",
    },
  };

  inputs: any[];

  constructor(fields: Record<string, any>, store: ToolStore) {
    super(fields, store);
    makeObservable(this);
    this.updateData(fields);
  }

  @action
  update(data: Partial<Tool>) {
    for (const key in data) {
      try {
        this[key] = data[key];
      } catch (error) {}
    }
  }
}

export default Tool;
