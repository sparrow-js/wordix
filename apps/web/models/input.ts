import type InputStore from "@/stores/InputsNodeStore";
import { action, makeObservable, observable } from "mobx";
import Model from "./base/Model";
import Field from "./decorators/Field";

class Input extends Model {
  static modelName = "Input";

  @Field
  @observable
  label: string;

  @Field
  @observable
  description: string;

  @Field
  @observable
  type: string;

  @observable
  value: string;

  @observable
  index: number;

  constructor(fields: Record<string, any>, store: InputStore) {
    super(fields, store);
    makeObservable(this);
    this.updateData(fields);
  }

  @action
  update(data: Partial<Input>) {
    for (const key in data) {
      try {
        this[key] = data[key];
      } catch (error) {}
    }
  }
}

export default Input;
