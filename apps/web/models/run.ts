import ParanoidModel from "@/models/base/ParanoidModel";
import type { JSONObject } from "@/shared/types";
import type RunsStore from "@/stores/RunsStore";
import type { Properties } from "@/types/types";
import { action, makeObservable, observable, set } from "mobx";

import Field from "./decorators/Field";
type SaveOptions = JSONObject & {
  publish?: boolean;
  done?: boolean;
  autosave?: boolean;
};
export default class Run extends ParanoidModel {
  static modelName = "Run";

  @Field
  @observable
  documentId: string;

  @observable
  collectionId: string;

  @observable
  document: any;

  @observable
  metadata: any;

  @observable
  version: string;

  @observable
  duration: number;

  @observable
  user: any;

  @observable
  organization: any;

  declare store: RunsStore;

  constructor(fields: Record<string, any>, store: RunsStore) {
    super(fields, store);
    makeObservable(this);
    this.updateData(fields);
  }

  @action
  save = async (fields?: Properties<typeof this>, options?: SaveOptions): Promise<Run> => {
    const params = fields ?? this.toAPI();
    this.isSaving = true;

    try {
      const model = await this.store.save({ ...params, ...fields, id: this.id }, options);

      // if saving is successful set the new values on the model itself
      set(this, { ...params, ...model });

      this.persistedAttributes = this.toAPI();

      return model;
    } finally {
      this.isSaving = false;
    }
  };

  updateToLocal(doc: any) {
    this.updateData({
      data: doc,
    });
  }
}
