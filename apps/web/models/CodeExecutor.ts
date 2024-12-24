import type InputStore from "@/stores/InputsNodeStore";
import { action, makeObservable, observable } from "mobx";
import Model from "./base/Model";
import Field from "./decorators/Field";

class CodeExecutor extends Model {
  static modelName = "CodeExecutor";

  @Field
  @observable
  label: string;

  @observable
  logs: any[] = [];

  @observable
  state: string;

  @observable
  error: string;

  @observable
  language = "js";

  @observable
  includeOutput: boolean;

  @observable
  continueOnError: boolean;

  @observable
  documentId: string;

  constructor(fields: Record<string, any>, store: InputStore) {
    super(fields, store);
    makeObservable(this);
    this.updateData(fields);
  }

  @action
  update(data: Partial<CodeExecutor>) {
    for (const key in data) {
      try {
        this[key] = data[key];
      } catch (error) {}
    }
  }
}

export default CodeExecutor;
