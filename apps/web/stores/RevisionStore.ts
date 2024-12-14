import Revision from "@/models/revision";
import type RootStore from "@/stores/RootStore";
import Store from "@/stores/base/Store";
import type { NavigationNode, PublicTeam } from "@/types/types";
import { filter, find, orderBy } from "lodash";
import { computed, makeObservable } from "mobx";

export default class RevisionStore extends Store<Revision> {
  sharedCache: Map<string, { sharedTree: NavigationNode; team: PublicTeam } | undefined> = new Map();

  constructor(rootStore: RootStore) {
    super(rootStore, Revision);
    makeObservable(this);
  }

  @computed
  get all(): Revision[] {
    // @ts-ignore
    return filter(this.orderedData, (d) => !d.archivedAt && !d.deletedAt && !d.template);
  }

  @computed
  get publishedList(): Revision[] {
    return orderBy(
      // @ts-ignore
      filter(this.all, (d) => !!d.publishedAt),
      "publishedAt",
      "desc",
    );
  }

  publishedInDocument(documentId: string): Revision[] {
    return filter(this.all, (run) => run.documentId === documentId);
  }

  get(id: string): Revision | undefined {
    return this.data.get(id) ?? this.orderedData.find((doc) => id === doc.id);
  }

  // @ts-ignore
  getByUrl = (url = ""): Run | undefined => find(this.orderedData, (doc) => url.endsWith(doc.urlId));
}
