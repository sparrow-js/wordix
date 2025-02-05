import { action, makeObservable, observable } from "mobx";

class ExecuteStore {
  @observable
  inputs: any;

  @observable
  status = "start";

  /***
agent_thoughts: [],
content: "# Hello world 👋🌍\nSay hello to kitty .\nHello, Kitty! 🐱👋 Welcome to the world!\n\n"
id: "answer-placeholder-1732504480606"
isAnswer: true
message_files: []
   */

  @observable
  injectChatList: any[] = [];

  constructor() {
    makeObservable(this);
  }

  @action
  setInputs(inputs: any) {
    this.inputs = inputs;
  }

  @action
  setStatus(status: string) {
    this.status = status;
  }

  @action
  setInjectChatList(chatList: any[]) {
    this.injectChatList = chatList;
  }
}

export default ExecuteStore;
