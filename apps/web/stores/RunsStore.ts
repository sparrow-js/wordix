import Run from "@/models/run";
import type RootStore from "@/stores/RootStore";
import Store from "@/stores/base/Store";
import type { NavigationNode, PublicTeam } from "@/types/types";
import { filter, find, orderBy } from "lodash";
import { computed, makeObservable } from "mobx";

export default class RunsStore extends Store<Run> {
  sharedCache: Map<string, { sharedTree: NavigationNode; team: PublicTeam } | undefined> = new Map();

  constructor(rootStore: RootStore) {
    super(rootStore, Run);
    makeObservable(this);
  }

  @computed
  get all(): Run[] {
    // @ts-ignore
    return filter(this.orderedData, (d) => !d.archivedAt && !d.deletedAt && !d.template);
  }

  @computed
  get publishedList(): Run[] {
    return orderBy(
      // @ts-ignore
      filter(this.all, (d) => !!d.publishedAt),
      "publishedAt",
      "desc",
    );
  }

  publishedInCollection(collectionId: string): Run[] {
    return filter(this.all, (run) => run.collectionId === collectionId);
  }

  get(id: string): Run | undefined {
    return this.data.get(id) ?? this.orderedData.find((doc) => id === doc.id);
  }

  // @ts-ignore
  getByUrl = (url = ""): Run | undefined => find(this.orderedData, (doc) => url.endsWith(doc.urlId));
}
