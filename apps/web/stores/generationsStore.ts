import Store, { RPCAction } from "./base/Store";
import Generation from '@/models/generation'
import RootStore from "./RootStore";
import { observable, action, computed, runInAction, makeObservable } from "mobx";

export default class GenerationsStore extends Store<Generation> {

    @observable
    currentId: string


    constructor(rootStore: RootStore) {
        super(rootStore, Generation);
        makeObservable(this);
    }

    @action
    addGeneration(item: any) {
        if (!this.data.has(item.id)) {
            this.add(item)
        }
    }
    

    @computed
    get currentGeneration(): Generation {
        return this.data.get(this.currentId);
    }

    @action
    updateDataSyncToNode(key: string, value: any, editor: any) {
        const attr = {};
        attr[key] = value;
        this.currentGeneration.update(attr)
        this.syncAttrToNode(editor, key, value);
    }

    syncAttrToNode (editor: any, key: string, value: string|number) {
        const {commands, state, chain} = editor;

       
        const {selection} = state;
        const { from } = selection;
        const node = state.doc.nodeAt(from);

        const attr = node.attrs;
        attr[key] = value;
        const json = editor.getJSON();
        
        commands.updateAttributes('generation', attr);
    }

}