import ParanoidModel from "@/models/base/ParanoidModel";
import type { JSONObject } from "@/shared/types";
import type DocumentsStore from "@/stores/DocumentsStore";
import type { Properties } from "@/types/types";
import { action, makeObservable, observable, set } from "mobx";

import type { DocumentVisibility } from "@prisma/client";

import Field from "./decorators/Field";
type SaveOptions = JSONObject & {
  publish?: boolean;
  done?: boolean;
  autosave?: boolean;
};
export default class Document extends ParanoidModel {
  static modelName = "Document";

  // @Field
  // @observable
  // declare id: string;

  @Field
  @observable
  urlId?: string;

  @observable.shallow
  data: any;

  @observable
  title: string;

  @observable
  collectionId: string;

  @observable.shallow
  content?: any;

  @observable
  version: number;

  @observable
  visibility: DocumentVisibility;

  @observable
  publishedContent?: any;

  @observable
  collection?: any;

  @observable
  publishedAt: Date;

  @observable
  workspaceId?: string;

  declare store: DocumentsStore;

  constructor(fields: Record<string, any>, store: DocumentsStore) {
    super(fields, store);
    makeObservable(this);
    this.updateData(fields);
  }

  @action
  save = async (fields?: Properties<typeof this>, options?: SaveOptions): Promise<Document> => {
    const params = fields ?? this.toAPI();
    this.isSaving = true;

    console.log("params", params);

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
