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
export default class Revision extends ParanoidModel {
  static modelName = "Revision";

  @Field
  @observable
  version: string | null = null;

  @Field
  @observable
  editorVersion = "";

  @Field
  @observable
  title = "";

  @Field
  @observable
  text = "";

  @Field
  @observable
  content: JSONObject | null = null;

  @Field
  @observable
  icon: string | null = null;

  @Field
  @observable
  color: string | null = null;

  @Field
  @observable
  documentId = "";

  @Field
  @observable
  userId = "";

  @Field
  @observable
  document: any;

  @Field
  @observable
  user: any;

  declare store: RunsStore;

  constructor(fields: Record<string, any>, store: RunsStore) {
    super(fields, store);
    makeObservable(this);
    this.updateData(fields);
  }

  @action
  save = async (fields?: Properties<typeof this>, options?: SaveOptions): Promise<Revision> => {
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
