import ParanoidModel from "@/models/base/ParanoidModel";
import type { JSONObject } from "@/shared/types";
import type ApiKeysStore from "@/stores/ApikeysStore";
import type { Properties } from "@/types/types";
import { action, makeObservable, observable, set } from "mobx";
import Field from "./decorators/Field";

type SaveOptions = JSONObject & {
  publish?: boolean;
  done?: boolean;
  autosave?: boolean;
};

export default class ApiKey extends ParanoidModel {
  static modelName = "ApiKey";

  @Field
  @observable
  name: string;

  @observable
  hash: string;

  @observable
  last4: string;

  @observable
  expiresAt?: Date;

  @observable
  lastActiveAt?: Date;

  @observable
  userId: string;

  declare store: ApiKeysStore;

  constructor(fields: Record<string, any>, store: ApiKeysStore) {
    super(fields, store);
    makeObservable(this);
    this.updateData(fields);
  }

  @action
  save = async (fields?: Properties<typeof this>, options?: SaveOptions): Promise<ApiKey> => {
    const params = fields ?? this.toAPI();
    this.isSaving = true;

    try {
      const model = await this.store.save({ ...params, ...fields, id: this.id }, options);
      set(this, { ...params, ...model });
      this.persistedAttributes = this.toAPI();
      return model;
    } finally {
      this.isSaving = false;
    }
  };

  updateToLocal(data: any) {
    this.updateData({
      data,
    });
  }
}
