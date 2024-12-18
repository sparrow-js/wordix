import type GenerationsStore from "@/stores/generationsStore";
import { action, makeObservable, observable } from "mobx";
import Model from "./base/Model";
import Field from "./decorators/Field";

class Generation extends Model {
  static modelName = "Generation";

  @Field
  @observable
  label: string;

  @Field
  @observable
  model: string;

  @Field
  @observable
  aspect_ratio?: string;

  @Field
  @observable
  temperature?: number;

  @Field
  @observable
  type?: string;

  @Field
  @observable
  stopBefore?: string[];

  @Field
  @observable
  generationType?: string;

  constructor(fields: Record<string, any>, store: GenerationsStore) {
    super(fields, store);
    makeObservable(this);
    this.updateData(fields);
  }

  @action
  update(data: Partial<Generation>) {
    for (const key in data) {
      try {
        this[key] = data[key];
      } catch (error) {}
    }
  }
}

export default Generation;
