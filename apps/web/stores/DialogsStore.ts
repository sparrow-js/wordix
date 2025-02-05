import { observable, action, makeAutoObservable } from "mobx";


export default class DialogsStore {
    @observable
    openInputsModal: boolean = false;

    constructor() {
        makeAutoObservable(this);
    }

    @action
    showInputsModal () {
        this.openInputsModal = true;
    }

    @action
    hideInputsModal() {
        this.openInputsModal = false;
    }

    @action
    toggleInputsModal(status: boolean) {
        this.openInputsModal = false;
    }

}