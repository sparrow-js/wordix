import ApiKey from "@/models/Apikey";
import type RootStore from "@/stores/RootStore";
import Store from "@/stores/base/Store";
import { filter } from "lodash";
import { computed, makeObservable } from "mobx";

export default class ApiKeysStore extends Store<ApiKey> {
  constructor(rootStore: RootStore) {
    super(rootStore, ApiKey);
    makeObservable(this);
  }

  @computed
  get all(): ApiKey[] {
    return filter(this.orderedData, (d) => !d.deletedAt);
  }

  @computed
  get orderedList(): ApiKey[] {
    let apiKeys = Array.from(this.data.values());
    apiKeys = apiKeys.filter((apiKey) => !apiKey.deletedAt);
    return apiKeys.sort((a, b) => {
      return a.updatedAt > b.updatedAt ? -1 : 1;
    });
  }

  get(id: string): ApiKey | undefined {
    return this.data.get(id) ?? this.orderedData.find((apiKey) => id === apiKey.id);
  }
}
