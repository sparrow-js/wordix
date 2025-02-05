import type PromptsStore from "@/stores/PromptsStore";
import { action, makeObservable, observable } from "mobx";
import Model from "./base/Model";
import Field from "./decorators/Field";

class Prompt extends Model {
  static modelName = "Prompt";

  @Field
  @observable
  label: string;

  @observable
  outputs: any[] = [];

  @observable
  promptId: string;

  @observable
  parameters: any = {};

  document: any;


  @observable
  inputs: any[] = [];



  constructor(fields: Record<string, any>, store: PromptsStore) {
    super(fields, store);
    makeObservable(this);
    this.updateData(fields);
  }

  @action
  update(data: Partial<Prompt>) {
    for (const key in data) {
      try {
        this[key] = data[key];

      } catch (error) {}
    }
  }

}

export default Prompt;
