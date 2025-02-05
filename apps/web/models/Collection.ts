import type { NavigationNode } from "@/shared/types";
import type CollectionsStore from "@/stores/CollectionsStore";
import { client } from "@/utils/ApiClient";
import type { CollectionPermission } from "@prisma/client";
import { makeObservable, observable, runInAction } from "mobx";
import ParanoidModel from "./base/ParanoidModel";

export default class Collection extends ParanoidModel {
  static modelName = "Collection";

  declare store: CollectionsStore;

  @observable
  name: string;

  @observable
  privacy: CollectionPermission;

  /** The child documents of the collection. */
  @observable
  documents?: NavigationNode[];

  @observable
  createdById: string;

  @observable
  tools?: string[];

  @observable
  template?: string;

  @observable
  documentStructure?: NavigationNode[];

  @observable
  workspaceId: string;

  @observable
  bannerImage?: string;

  private isFetching = false;

  constructor(fields: Record<string, any>, store: CollectionsStore) {
    super(fields, store);
    makeObservable(this);
    this.updateData(fields);
  }

  fetchDocuments = async (options?: { force: boolean }) => {
    if (this.isFetching) {
      return;
    }
    if (this.documents && options?.force !== true) {
      return;
    }

    try {
      this.isFetching = true;
      const res = await client.post("/collections/documents", {
        id: this.id,
      });
      // "Collection#fetchDocuments",
      runInAction(() => {
        this.documents = res.data;
      });
    } finally {
      this.isFetching = false;
    }
  };

  deleteFolderDocument = async (documentId: string | undefined, folderId: string | undefined) => {
    const res = await client.post("/collections/delete-folder-document", {
      documentId,
      collectionId: this.id,
      folderId,
    });

    if (res.data.documentIds) {
      res.data.documentIds.forEach((id: string) => {
        this.store.rootStore.documents.remove(id);
      });
    }

    this.updateData({ documents: res.data.documents });

    return res.data;
  };

  updateFolderName = async (name: string, id: string) => {
    const updateNodeTitle = (nodes: any[], id: string, name: string) => {
      for (const node of nodes) {
        if (node.id === id) {
          node.title = name;
          return true;
        }
        if (node.children) {
          const found = updateNodeTitle(node.children, id, name);
          if (found) return true;
        }
      }
      return false;
    };

    const documentStructure = [...(this.documents || [])];
    updateNodeTitle(documentStructure, id, name);
    this.updateData({ documents: documentStructure });

    this.save({ documentStructure });
  };
}
