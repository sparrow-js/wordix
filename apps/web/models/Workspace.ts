import type WorkspaceStore from "@/stores/WorkspacesStore";
import type { Plan } from "@prisma/client";
import { makeObservable, observable } from "mobx";
import ParanoidModel from "./base/ParanoidModel";

export default class Workspace extends ParanoidModel {
  static modelName = "Workspace";

  @observable
  name: string;

  @observable
  icon?: string;

  @observable
  plan: Plan = "FREE";

  @observable
  stripeId?: string;

  @observable
  additionalChatsIndex = 0;

  @observable
  additionalStorageIndex = 0;

  @observable
  chatsLimitFirstEmailSentAt?: Date;

  @observable
  storageLimitFirstEmailSentAt?: Date;

  @observable
  chatsLimitSecondEmailSentAt?: Date;

  @observable
  storageLimitSecondEmailSentAt?: Date;

  @observable
  customChatsLimit?: number;

  @observable
  customStorageLimit?: number;

  @observable
  customSeatsLimit?: number;

  @observable
  isVerified?: boolean;

  constructor(fields: Record<string, any>, store: WorkspaceStore) {
    super(fields, store);
    makeObservable(this);
    this.updateData(fields);
  }
}
