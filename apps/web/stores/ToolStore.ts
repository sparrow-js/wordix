import { action, computed, makeObservable, observable } from "mobx";

import Tool from "@/models/Tool";
import type RootStore from "./RootStore";
import Store from "./base/Store";

export default class ToolsNodeStore extends Store<Tool> {
  @observable
  selectedId = "";

  @observable
  documentId = "";

  @observable.deep
  tools: Tool[] = [];

  constructor(rootStore: RootStore) {
    super(rootStore, Tool);
    makeObservable(this);
  }

  @computed
  get tool(): Tool {
    return this.data.get(this.selectedId);
  }

  @computed
  get toolDocumentIds(): Tool[] {
    return this.orderedData.filter((tool) => tool.documentId === this.rootStore.documents.documentId);
  }

  @action
  addTool(item: any) {
    if (!this.data.has(item.id)) {
      if (item.toolId === "stableDiffusion") {
        item.inputs = [
          {
            label: "aspect ratio",
            value: "aspect_ratio",
          },
          {
            label: "model",
            value: "model",
          },
          {
            label: "prompt",
            value: "prompt",
          },
        ];
      }

      if (item.toolId === "webscrape") {
        item.inputs = [
          {
            label: "url",
            value: "url",
          },
          {
            label: "selector",
            value: "selector",
          },
        ];
      }

      if (item.toolId === "textToSpeech") {
        item.inputs = [
          {
            label: "text",
            value: "text",
          },
          {
            label: "voice",
            value: "voice",
          },
        ];
      }

      if (item.toolId === "duckduckgo") {
        item.inputs = [
          {
            label: "query",
            value: "query",
          },
          {
            label: "search type",
            value: "searchType",
          },
        ];
      }
      this.add(item as Tool);
    }
  }

  @action
  setSelectedId(id: string) {
    this.selectedId = id;
  }

  @action
  setTools(tools: Tool[]) {
    this.tools = tools;
  }

  @action
  updateDataSyncToNode(key: string, value: any) {
    const keys = key.split(".");
    if (keys.length > 1) {
      // Clone the existing object for nested keys
      const currentData = JSON.parse(JSON.stringify(this.tool));
      let target = currentData;

      // Navigate through the object until the second-to-last key
      for (let i = 0; i < keys.length - 1; i++) {
        target = target[keys[i]];
      }

      // Set the value on the last key
      target[keys[keys.length - 1]] = value;
      this.tool.update(currentData);
    } else {
      // For single level keys, use the original logic
      const attr = { [key]: value };
      this.tool.update(attr);
    }
  }

  @action
  removeTool(editor: any): void {
    const { state, dispatch } = editor.view;
    let foundNode = null;
    let foundPos = -1;
    this.rootStore.workbench.setHideSidebar();

    state.doc.descendants((node, pos) => {
      if (node.attrs?.id === this.selectedId) {
        foundNode = node;
        foundPos = pos;
        return false;
      }
      return true;
    });

    if (foundPos >= 0 && foundNode) {
      const transaction = state.tr.delete(foundPos, foundPos + foundNode.nodeSize);
      dispatch(transaction);
    }
    this.remove(this.selectedId);
  }

  @action
  setDocumentId(id: string) {
    this.documentId = id;
  }
}
