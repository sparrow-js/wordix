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
    const generationList = this.rootStore.generations.generationDocumentIds;
    const loopsList = this.rootStore.loopsNode.loopDocumentIds;
    const codeExecutorsList = this.rootStore.codeExecutors.codeExecutorDocumentIds;
    const toolList = this.rootStore.tools.toolDocumentIds;

    const list = [];
    inputsList.forEach((item) => {
      const [id, input] = item;
      list.push({
        title: input.label,
        label: input.label,
        id: id,
        value: id,
        type: "input",
        inputType: input.type,
        searchTerms: [input.label],
        command: ({ editor, range }) => {
          editor
            .chain()
            .focus()
            .deleteRange(range)
            .setMention({
              referenceId: id,
              type: input.type,
            })
            .run();
        },
      });
    });

    generationList.forEach((generation) => {
      list.push({
        id: generation.id,
        title: generation.label,
        label: generation.label,
        value: generation.id,
        type: "generation",
        searchTerms: [generation.label],
        description: "Just start typing with plain text.",
        command: ({ editor, range }) => {
          editor
            .chain()
            .focus()
            .deleteRange(range)
            .setMention({
              referenceId: generation.id,
              type: "generation",
            })
            .run();
        },
      });
    });

    loopsList.forEach((loop) => {
      list.push({
        id: loop.id,
        title: `${loop.label}.count`,
        label: `${loop.label}.count`,
        value: loop.id,
        type: "loop",
        searchTerms: [`${loop.label}.count`],
        description: "Just start typing with plain text.",
        command: ({ editor, range }) => {
          editor
            .chain()
            .focus()
            .deleteRange(range)
            .setMention({
              referenceId: loop.id,
              type: "loop",
              path: ".count",
            })
            .run();
        },
      });
    });

    codeExecutorsList.forEach((codeExecutor) => {
      list.push({
        id: codeExecutor.id,
        title: `${codeExecutor.label}.output`,
        label: `${codeExecutor.label}.output`,
        value: codeExecutor.id,
        type: "codeExecutor",
        searchTerms: [`${codeExecutor.label}.output`],
        description: "Just start typing with plain text.",
        command: ({ editor, range }) => {
          editor
            .chain()
            .focus()
            .deleteRange(range)
            .setMention({
              referenceId: codeExecutor.id,
              type: "codeExecutor",
              path: ".output",
            })
            .run();
        },
      });
    });

    toolList.forEach((tool) => {
      list.push({
        id: tool.id,
        title: `${tool.label}.output`,
        label: `${tool.label}.output`,
        value: tool.id,
        type: "tool",
        searchTerms: [`${tool.label}.output`],
        description: "Just start typing with plain text.",
        command: ({ editor, range }) => {
          editor
            .chain()
            .focus()
            .deleteRange(range)
            .setMention({
              referenceId: tool.id,
              type: "tool",
              path: ".output",
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
    } else if (type === "tool") {
      this.rootStore.tools.setSelectedId(id);
      this.rootStore.setting.setSettingComponentName("tool");
    }

    this.rootStore.workbench.setShowSidebar();
  }
}
