import View from "@/models/View";
import { filter, find, orderBy, reduce } from "lodash";
import type RootStore from "./RootStore";
import Store, { RPCAction } from "./base/Store";

export default class ViewsStore extends Store<View> {
  actions = [RPCAction.List, RPCAction.Create];

  constructor(rootStore: RootStore) {
    super(rootStore, View);
  }

  inDocument(documentId: string): View[] {
    return orderBy(
      filter(this.orderedData, (view) => view.documentId === documentId),
      "lastViewedAt",
      "desc",
    );
  }

  countForDocument(documentId: string): number {
    const views = this.inDocument(documentId);
    return reduce(views, (memo, view) => memo + view.count, 0);
  }

  touch(documentId: string, userId: string) {
    const view = find(this.orderedData, (view) => view.documentId === documentId && view.userId === userId);
    if (!view) {
      return;
    }

    // view.touch();
  }
}
