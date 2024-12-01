import { action, observable, makeObservable } from "mobx";
import Model from "./base/Model";
import Field from "./decorators/Field";
import GenerationsStore from "@/stores/generationsStore";

class Generation extends Model {
    static modelName = "Generation";

    @Field
    @observable
    label: string;


    @Field
    @observable
    temperature: number;

    @Field
    @observable
    model: string;

    @Field
    @observable
    type: string;

    @Field
    @observable
    stopBefore: string[]

    constructor(fields: Record<string, any>, store: GenerationsStore) {
        super(fields, store);
        makeObservable(this);
        this.updateData(fields);
    }


    @action
    update(data: Partial<Generation>) {
        for (const key in data) {
            try {
              this[key] = data[key];
            } catch (error) {
            }
        }
    }

}

export default Generation;