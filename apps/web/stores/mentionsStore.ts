import { computed, makeObservable } from "mobx";
import type RootStore from "./RootStore";

export default class AtsStore {
  rootStore: RootStore;

  constructor(rootStore: RootStore) {
    makeObservable(this);
    this.rootStore = rootStore;
  }

  @computed
  get atList(): any[] {
    const inputsList = Array.from(this.rootStore.inputsNode.data);
    const generationList = Array.from(this.rootStore.generations.data);
    const loopsList = Array.from(this.rootStore.loopsNode.data);

    const list = [];
    inputsList.forEach((item) => {
      const [id, input] = item;
      list.push({
        title: input.label,
        label: input.label,
        id: id,
        value: id,
        type: "input",
        searchTerms: [input.label],
        command: ({ editor, range }) => {
          editor
            .chain()
            .focus()
            .deleteRange(range)
            .setMention({
              referenceId: id,
              type: "input",
            })
            .run();
        },
      });
    });

    generationList.forEach((item) => {
      const [id, generation] = item;
      list.push({
        id,
        title: generation.label,
        label: generation.label,
        value: id,
        type: "generation",
        searchTerms: [generation.label],
        description: "Just start typing with plain text.",
        command: ({ editor, range }) => {
          editor
            .chain()
            .focus()
            .deleteRange(range)
            .setMention({
              referenceId: id,
              type: "generation",
            })
            .run();
        },
      });
    });

    loopsList.forEach((item) => {
      const [id, loop] = item;
      list.push({
        id,
        title: `${loop.label}.count`,
        label: `${loop.label}.count`,
        value: id,
        type: "loop",
        searchTerms: [`${loop.label}.count`],
        description: "Just start typing with plain text.",
        command: ({ editor, range }) => {
          editor
            .chain()
            .focus()
            .deleteRange(range)
            .setMention({
              referenceId: id,
              type: "loop",
              path: ".count",
            })
            .run();
        },
      });
    });

    return list;
  }

  getMetion(id: string) {
    return this.atList.find((item) => item.id === id);
  }

  parseMentionValue(expression: {
    value: string;
    type: string;
    path?: string;
  }) {
    if (expression.type === "variable") {
      const mention = this.getMetion(expression.value);

      if (mention) {
        return `@${mention.label}`;
      }
    }

    return expression.value || " -- ";
  }

  editAttr(id: string, type: string) {
    if (type === "input") {
      this.rootStore.inputsNode.setSelectedId(id);
      this.rootStore.setting.setSettingComponentName("inputSetting");
    } else if (type === "generation") {
      this.rootStore.generations.currentId = id;
      this.rootStore.setting.setSettingComponentName("generation");
    } else if (type === "loop") {
      this.rootStore.loopsNode.setSelectedId(id);
      this.rootStore.setting.setSettingComponentName("loop");
    }
    this.rootStore.workbench.setShowSidebar();
  }
}
