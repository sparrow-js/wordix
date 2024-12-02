import invariant from "invariant";
import { lowerFirst } from "lodash";
import pluralize from "pluralize";
import ApiKeysStore from "./ApikeysStore";
import CodeExecutorsStore from "./CodeExecutorsStore";
import CollectionsStore from "./CollectionsStore";
import DialogsStore from "./DialogsStore";
import DocumentsStore from "./DocumentsStore";
import ExecuteStore from "./ExecuteStore";
import IfElseStore from "./IfElseStore";
import InputsNodeStore from "./InputsNodeStore";
import LoopsStore from "./LoopsStore";
import PoliciesStore from "./PoliciesStore";
import PromptsStore from "./PromptsStore";
import RunsStore from "./RunsStore";
import SettingStore from "./SettingStore";
import ToolStore from "./ToolStore";
import ViewsStore from "./ViewsStore";
import WorkspacesStore from "./WorkspacesStore";
import type Store from "./base/Store";
import GenerationsStore from "./generationsStore";
import MentionsStore from "./mentionsStore";
import WorkbenchStore from "./workbench";

export default class RootStore {
  views: ViewsStore;
  policies: PoliciesStore;
  workbench: WorkbenchStore;
  dialogs: DialogsStore;
  inputsNode: InputsNodeStore;
  generations: GenerationsStore;
  setting: SettingStore;
  mentions: MentionsStore;
  execute: ExecuteStore;
  documents: DocumentsStore;
  collections: CollectionsStore;
  loopsNode: LoopsStore;
  ifElses: IfElseStore;
  codeExecutors: CodeExecutorsStore;
  prompts: PromptsStore;
  tools: ToolStore;
  runs: RunsStore;
  workspaces: WorkspacesStore;
  apiKeys: ApiKeysStore;

  constructor() {
    // Models
    this.registerStore(ViewsStore);
    this.registerStore(PoliciesStore);
    this.registerStore(GenerationsStore);
    this.registerStore(DocumentsStore);
    this.registerStore(CollectionsStore);
    this.registerStore(LoopsStore, "loopsNode");
    this.registerStore(WorkbenchStore, "workbench");
    this.registerStore(DialogsStore, "dialogs");
    this.registerStore(InputsNodeStore, "inputsNode");
    this.registerStore(SettingStore, "setting");
    this.registerStore(MentionsStore, "mentions");
    this.registerStore(ExecuteStore, "execute");
    this.registerStore(IfElseStore, "ifElses");
    this.registerStore(CodeExecutorsStore, "codeExecutors");
    this.registerStore(PromptsStore, "prompts");
    this.registerStore(ToolStore, "tools");
    this.registerStore(RunsStore, "runs");
    this.registerStore(WorkspacesStore, "workspaces");
    this.registerStore(ApiKeysStore, "apiKeys");
  }

  /**
   * Get a store by model name.
   *
   * @param modelName
   */
  public getStoreForModelName<K extends keyof RootStore>(modelName: string): RootStore[K] {
    const storeName = this.getStoreNameForModelName(modelName);
    const store = this[storeName];
    invariant(store, `No store found for model name "${modelName}"`);

    return store;
  }

  /**
   * Clear all data from the stores except for auth and ui.
   */
  public clear() {
    Object.getOwnPropertyNames(this)
      .filter((key) => ["auth", "ui"].includes(key) === false)
      .forEach((key) => {
        this[key]?.clear?.();
      });
  }

  /**
   * Register a store with the root store.
   *
   * @param StoreClass
   */
  private registerStore<T = typeof Store>(StoreClass: T, name?: string) {
    // @ts-expect-error TS thinks we are instantiating an abstract class.
    const store = new StoreClass(this);
    const storeName = name ?? this.getStoreNameForModelName(store.modelName);
    this[storeName] = store;
  }

  private getStoreNameForModelName(modelName: string) {
    return pluralize(lowerFirst(modelName));
  }
}
