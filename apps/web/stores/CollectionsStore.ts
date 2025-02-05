import Collection from "@/models/Collection";
import type { CollectionStatusFilter } from "@/shared/types";
import type { PaginationParams } from "@/types/types";
import { client } from "@/utils/ApiClient";
import { action, computed, makeObservable, override, runInAction } from "mobx";
import type RootStore from "./RootStore";
import Store from "./base/Store";

export default class CollectionsStore extends Store<Collection> {
  constructor(rootStore: RootStore) {
    super(rootStore, Collection);
    makeObservable(this);
  }

  @computed
  get orderedList(): Collection[] {
    let collections = Array.from(this.data.values());
    collections = collections.filter((collection) => !collection.deletedAt);
    return collections.sort((a, b) => {
      return a.updatedAt > b.updatedAt ? -1 : 1;
    });
  }

  @override
  async fetch(id: string, options?: { force: boolean }): Promise<Collection> {
    const model = await super.fetch(id, options);

    await model.fetchDocuments(options);
    return model;
  }

  @action
  fetchNamedPage = async (
    request = "list",
    options: (PaginationParams & { statusFilter: CollectionStatusFilter[] }) | undefined,
  ): Promise<Collection[]> => {
    this.isFetching = true;

    try {
      const res = await client.post(`/collections/${request}`, options);
      // "CollectionsStore#fetchNamedPage",
      runInAction(() => {
        res.data.forEach(this.add);
        this.addPolicies(res.policies);
        this.isLoaded = true;
      });
      return res.data;
    } finally {
      this.isFetching = false;
    }
  };

  @action
  getDocuments = (id: string) => {
    const documents = this.get(id).documents;
    const flattenDocuments = (docs: any[]): any[] => {
      return docs.reduce((acc: any[], doc: any) => {
        acc.push(doc);
        if (doc.children && Array.isArray(doc.children)) {
          acc.push(...flattenDocuments(doc.children));
        }
        return acc;
      }, []);
    };
    return Array.isArray(documents) ? flattenDocuments(documents) : [];
  };
}
