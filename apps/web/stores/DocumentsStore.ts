import Document from "@/models/Document";
import type RootStore from "@/stores/RootStore";
import Store from "@/stores/base/Store";
import type { FetchOptions, NavigationNode, PublicTeam } from "@/types/types";
import { client } from "@/utils/ApiClient";
import { cloneDeep, debounce, filter, find, orderBy } from "lodash";
import { action, computed, makeObservable, observable } from "mobx";

export default class DocumentsStore extends Store<Document> {
  sharedCache: Map<string, { sharedTree: NavigationNode; team: PublicTeam } | undefined> = new Map();

  @observable
  documentId: string;

  private debouncedTitleUpdate = debounce(
    async (id: string, title: string, content: any, documents: any) => {
      await client.post("/documents/updateTitle", {
        id,
        title,
        content,
        documentStructure: documents,
      });
    },
    1000, // 1 second delay
  );

  constructor(rootStore: RootStore) {
    super(rootStore, Document);
    makeObservable(this);
  }

  @computed
  get all(): Document[] {
    // @ts-ignore
    return filter(this.orderedData, (d) => !d.archivedAt && !d.deletedAt && !d.template);
  }

  @computed
  get publishedList(): Document[] {
    return orderBy(
      filter(this.all, (d) => !!d.publishedAt),
      "publishedAt",
      "desc",
    );
  }

  publishedInCollection(collectionId: string): Document[] {
    return filter(this.all, (document) => document.collectionId === collectionId && !!document.publishedAt);
  }

  @action
  fetchWithSharedTree = async (
    id: string,
    options: FetchOptions = {},
  ): Promise<{
    document: Document;
    team?: PublicTeam;
    sharedTree?: NavigationNode;
  }> => {
    if (!options.prefetch) {
      this.isFetching = true;
    }

    try {
      const doc: Document | null | undefined = this.data.get(id) || this.getByUrl(id);
      // const policy = doc ? this.rootStore.policies.get(doc.id) : undefined;

      if (doc && !options.shareId && !options.force && doc.content) {
        return {
          document: doc,
        };
      }

      if (doc && options.shareId && !options.force && this.sharedCache.has(options.shareId)) {
        return {
          document: doc,
          ...this.sharedCache.get(options.shareId),
        };
      }

      const res = await client.post("/documents/info", {
        id,
        shareId: options.shareId,
      });

      // this.addPolicies(res.policies);
      this.add(res.data.document);

      const document = this.data.get(res.data.document.id);

      if (options.shareId) {
        this.sharedCache.set(options.shareId, {
          sharedTree: res.data.sharedTree,
          team: res.data.team,
        });
        return {
          document,
          sharedTree: res.data.sharedTree,
          team: res.data.team,
        };
      }

      return {
        document,
      };
    } finally {
      this.isFetching = false;
    }
  };

  get(id: string): Document | undefined {
    return this.data.get(id) ?? this.orderedData.find((doc) => id === doc.id);
  }

  getByUrl = (url = ""): Document | undefined => find(this.orderedData, (doc) => url.endsWith(doc.urlId));

  @action
  updateDocumentTitle = async (id: string, title: string) => {
    const document = this.get(id);

    if (document) {
      // update the document title
      document.title = title;
      // update the document content title
      const titleNode = document.content?.content.filter((item) => item.type === "title");
      if (titleNode && titleNode.length > 0) {
        titleNode[0].content = [
          {
            type: "text",
            text: title,
          },
        ];
      }

      // update the collection title
      const collection = this.rootStore.collections.get(document.collectionId);

      let documents = null;

      if (collection?.documents) {
        documents = cloneDeep(collection.documents);
        // Recursively find and update document node
        const updateNodeTitle = (node: NavigationNode) => {
          if (node.id === document.id) {
            node.title = title;
            return true;
          }
          return node.children?.some(updateNodeTitle) ?? false;
        };

        // Update: iterate through each root node in the array
        documents.some(updateNodeTitle);
        collection.updateData({
          documents: documents,
        });
      }

      this.debouncedTitleUpdate(id, title, document.content, documents);
    }
  };

  @action
  setDocumentId(id: string) {
    this.documentId = id;
  }
}
