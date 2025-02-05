import { action, observable } from "mobx";
import Model from "./base/Model";

class View extends Model {
  static modelName = "View";

//   id: string;

  documentId: string;



  firstViewedAt: string;

  @observable
  lastViewedAt: string;

  @observable
  count: number;

  userId: string;

}

export default View;
