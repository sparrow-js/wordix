import {
  type Editor,
  Extension,
  Mark,
  type Range,
  createNodeFromContent,
  createStyleTag,
  findChildrenInRange,
  findParentNode,
  getHTMLFromFragment,
  isNodeEmpty,
  mergeAttributes,
} from "@tiptap/core";
import { Fragment, Node, Slice } from "@tiptap/pm/model";
import { NodeSelection, Plugin, PluginKey, TextSelection } from "@tiptap/pm/state";
import { Mapping, ReplaceAroundStep, ReplaceStep } from "@tiptap/pm/transform";
import { Decoration, DecorationSet } from "@tiptap/pm/view";

import { marked } from "marked";

const base_url = process.env.NEXT_PUBLIC_BASE_URL;

const aiinjectcss = `
.tiptap-ai-suggestion {
  cursor: pointer;
  pointer-events: none;
}

.tiptap-ai-suggestion::after {
  color: #6B7280;
  content: attr(data-suggestion);
  pointer-events: none;
}

.tiptap-ai-suggestion br:first-child {
  content: ' ';
  display: inline;
}

.tiptap-ai-suggestion br:last-child {
  content: ' ';
  display: inline;
},
`;

function clamp(r = 0, e = 0, t = 0) {
  return Math.min(Math.max(r, e), t);
}

function calculateDepth(node) {
  if (!node) {
    return -1;
  }
  const firstChildContent = node.firstChild ? node.firstChild.content : undefined;
  return 1 + calculateDepth(firstChildContent);
}

// Class for managing content streaming
class StreamContentHandler {
  content: string;
  lastPartial: string;
  endedWithLessThan: boolean;
  originalContent: string;

  constructor() {
    this.content = "";
    this.lastPartial = "";
    this.endedWithLessThan = false;
    this.originalContent = "";
  }

  static create() {
    return new StreamContentHandler();
  }

  async append(text: string) {
    if (this.endedWithLessThan) {
      this.content += "<";
    }
    this.endedWithLessThan = text.endsWith("<");
    this.lastPartial = this.endedWithLessThan ? text.slice(0, -1) : text;
    this.originalContent += this.lastPartial;
    // this.content += this.lastPartial;
    this.content = await marked.parse(this.originalContent);
  }

  finalize() {
    if (this.endedWithLessThan) {
      this.content += "<";
    }
    this.endedWithLessThan = false;
  }
}

// Utility function to check if selection is within the same parent node
const isSelectionInSameParent = (selection): boolean => {
  const { $from, $to, empty } = selection;
  return !empty && $from.parent === $to.parent;
};

// Function to extract content from document based on selection range
function getContentFromSelection(editorState, from: number, to: number): string {
  const { state } = editorState;
  const docFragment = state.doc.cut(from, to);
  const content = getHTMLFromFragment(
    Node.fromJSON(editorState.schema, docFragment.toJSON()).content,
    editorState.schema,
  );

  return isSelectionInSameParent(editorState.state.selection)
    ? content.slice(content.indexOf(">") + 1, content.lastIndexOf("<"))
    : content;
}

// Function to validate if a string is JSON formatted
const isValidJson = (input: string): boolean => {
  try {
    JSON.parse(input);
  } catch {
    return false;
  }
  return true;
};

interface AiRequestOptions {
  action: string;
  text: string;
  textOptions?: {
    format?: string;
    [key: string]: any;
  };
  extensionOptions: {
    appId: string;
    token: string;
    baseUrl?: string;
  };
}

interface AiErrorResponse {
  error?:
    | {
        status?: string;
        message?: string;
      }
    | string;
  message?: string;
}

interface AiSuccessResponse {
  response?: string;
}

const fetchAiResponse = async ({
  action,
  text,
  textOptions,
  extensionOptions,
}: AiRequestOptions): Promise<string | undefined> => {
  const { baseUrl } = extensionOptions;
  const apiUrl = baseUrl ?? `${base_url}/api/ai`; // Assuming N is the default URL

  const response = await fetch(`${apiUrl}/text/${action}`, {
    method: "POST",
    headers: {
      accept: "application/json",
      "content-type": "application/json",
    },
    body: JSON.stringify({
      html: textOptions?.format === "rich-text" || undefined,
      ...textOptions,
      text,
    }),
  });

  const data = (await response.json()) as AiErrorResponse & AiSuccessResponse;

  if (!response.ok) {
    if (data?.error instanceof Object) {
      throw new Error(`${data.error?.status} ${data.error?.message}`);
    }

    throw new Error(`${data?.error} ${data?.message}`);
  }

  return data?.response;
};

// Function for fetching data from a server
const fetchData = async ({
  action,
  text,
  textOptions,
  extensionOptions,
  aborter,
}): Promise<ReadableStream<Uint8Array> | null> => {
  const { baseUrl } = extensionOptions;
  const apiUrl = baseUrl ?? `${base_url}/api/ai`;

  let fetchOptions: RequestInit = {
    method: "POST",
    headers: {
      Accept: "application/json",
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      html: textOptions?.format === "rich-text" || undefined,
      ...textOptions,
      text,
      stream: true,
    }),
  };

  if (aborter && aborter instanceof AbortController) {
    fetchOptions = {
      ...fetchOptions,
      signal: aborter.signal,
    };
  }

  const response = await fetch(`${apiUrl}/text/${action}?stream=1`, fetchOptions);

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error?.error?.message || "An error occurred while fetching the data");
  }
  return response.body;
};

// Helper function to apply an AI mark on JSON representation of nodes
function applyAiMarkToNodes(json: any): any {
  if (!json) {
    return { type: "paragraph", content: [] };
  }

  if (Array.isArray(json)) {
    return json.map(applyAiMarkToNodes);
  }

  if (json.content && Array.isArray(json.content)) {
    json.content = applyAiMarkToNodes(json.content);
  }

  if (json.type === "text") {
    const aiMark = { type: "aiMark" };
    json.marks = [].concat(json.marks || []).concat(aiMark);
  }

  return json;
}

// AI-based operation handler
const handleAiOperationsStream =
  ({ props, action, textOptions, extensionOptions, fetchDataFn }) =>
  async () => {
    const { editor } = props;
    const { state } = editor;
    const aiStorage = editor.storage.ai || editor.storage.aiAdvanced;
    const options = {
      collapseToEnd: true,
      format: "plain-text",
      ...textOptions,
    };

    const { from, to } =
      typeof options.insertAt === "number"
        ? { from: options.insertAt, to: options.insertAt }
        : options.insertAt || state.selection;

    const insertContent = textOptions?.insert !== false;
    const appendContent = options.append && options.insertAt === undefined;
    const textSelection =
      textOptions?.text ||
      (!options.plainText || options.format === "plain-text"
        ? getContentFromSelection(editor, from, to)
        : state.doc.textBetween(from, to, " "));

    if (!textSelection) return false;

    Object.assign(aiStorage, {
      state: "loading",
      response: "",
      error: undefined,
      generatedWith: {
        options: textOptions,
        action: action,
        range: undefined,
      },
    });

    editor.chain().setMeta("aiResponse", aiStorage).run();
    extensionOptions.onLoading?.({ editor, action, isStreaming: true });

    const textDecoder = new TextDecoder("utf-8");
    const contentHandler = StreamContentHandler.create();
    let startPosition = from;
    let endPosition = to;

    return editor.commands.streamContent(appendContent ? to : { from, to }, async ({ write }) => {
      try {
        const streamResponse = await fetchDataFn({
          editor,
          action,
          text: textSelection,
          textOptions,
          extensionOptions,
          defaultResolver: fetchData,
        });

        const reader = await streamResponse?.getReader();
        if (!reader) throw new Error("fetchDataFn doesn’t return a stream.");

        while (true) {
          const { done, value } = await reader.read();
          if (done) break;

          const chunk = textDecoder.decode(value, { stream: true });

          if (isValidJson(chunk)) {
            const errorData = JSON.parse(chunk);
            if (Object.prototype.hasOwnProperty.call(errorData, "error")) {
              throw new Error(`${errorData.error.status ?? 500} - ${errorData.error.message}`);
            }
          }

          contentHandler.append(chunk);

          if (aiStorage.state === "idle") return false;

          Object.assign(aiStorage, {
            state: "loading",
            response: contentHandler.content,
            error: undefined,
            generatedWith: {
              options: textOptions,
              action,
              range: undefined,
            },
          });

          extensionOptions.onChunk?.({
            editor,
            action,
            isStreaming: true,
            chunk: contentHandler.lastPartial,
            response: contentHandler.content,
          });

          try {
            if (insertContent) {
              const writingPosition = write({
                partial: chunk,
                transform: ({ defaultTransform }) =>
                  extensionOptions.showDecorations === false
                    ? defaultTransform()
                    : createNodeFromContent(applyAiMarkToNodes(defaultTransform().toJSON()), editor.schema),
                appendToChain: (chain) => chain.setMeta("aiResponse", aiStorage),
              });

              startPosition = writingPosition.from;
              endPosition = writingPosition.to;
            } else {
              editor.chain().setMeta("aiResponse", aiStorage).run();
            }
          } catch (err) {
            if (err instanceof Error && err.message.startsWith("Invalid content for node")) continue;
            throw err;
          }
        }

        contentHandler.finalize();

        Object.assign(aiStorage, {
          state: "idle",
          response: contentHandler.content,
          error: undefined,
          generatedWith: {
            options: textOptions,
            action,
            range: undefined,
          },
        });

        const writingPosition = write({
          partial: ".",
          transform: ({ defaultTransform }) =>
            extensionOptions.showDecorations === false
              ? defaultTransform()
              : createNodeFromContent(applyAiMarkToNodes(defaultTransform().toJSON()), editor.schema),
          appendToChain: (chain) => chain.setMeta("aiResponse", aiStorage),
        });

        startPosition = writingPosition.from;
        endPosition = writingPosition.to;

        aiStorage.pastResponses.push(contentHandler.content);

        extensionOptions.onSuccess?.({
          editor,
          action,
          isStreaming: true,
          response: contentHandler.content,
        });

        let commandChain = editor.chain().setMeta("aiResponse", aiStorage);
        if (insertContent) {
          const collapseToEnd = !(!extensionOptions.collapseToEnd && !options.collapseToEnd);
          commandChain = commandChain.focus();
          if (extensionOptions.showDecorations !== false) {
            commandChain = commandChain.setTextSelection({ from: startPosition, to: endPosition }).unsetAiMark();
          }
          commandChain = commandChain.setTextSelection(collapseToEnd ? endPosition : { from, to: endPosition });
        }

        return commandChain.run();
      } catch (err) {
        Object.assign(aiStorage, {
          state: "error",
          response: undefined,
          error: err,
          generatedWith: {
            options: textOptions,
            action,
            range: undefined,
          },
        });

        editor.chain().setMeta("aiResponse", aiStorage).run();
        extensionOptions.onError?.(err, {
          editor,
          action,
          isStreaming: true,
        });

        return false;
      }
    });
  };

const Q = (e) => {
  const { $from: t, $to: r, empty: n } = e;
  return n ? !1 : t.parent === r.parent;
};

// Creates a bounded selection within document limits
const createBoundedSelection = (transaction, selection, oldRange) => {
  const { doc } = transaction;
  const docStart = TextSelection.atStart(doc).from;
  const docEnd = TextSelection.atEnd(doc).to;

  // Clamp positions within document boundaries
  const boundedFrom = clamp(oldRange.from, docStart, docEnd);
  // const boundedTo = clamp(selection.to, docStart, docEnd);
  // NodeSelection.create(doc, boundedFrom, boundedTo);
  return NodeSelection.create(doc, boundedFrom);
};

// Finds the last valid step position in transaction
const findLastStepPosition = (transaction, minStepIndex, bias) => {
  const lastStepIndex = transaction.steps.length - 1;

  if (lastStepIndex < minStepIndex) return -1;

  const lastStep = transaction.steps[lastStepIndex];
  if (!(lastStep instanceof ReplaceStep || lastStep instanceof ReplaceAroundStep)) {
    return -1;
  }

  const lastMapping = transaction.mapping.maps[lastStepIndex];
  let position = 0;

  lastMapping.forEach((oldStart, oldEnd, newStart, newEnd) => {
    if (position === 0) {
      position = newEnd;
    }
  });

  return TextSelection.near(transaction.doc.resolve(position), bias);
};

// Updates selection after content changes
const updateSelectionAfterChange = ({ dispatch, tr, oldSelection }) => {
  if (dispatch) {
    const newPos = findLastStepPosition(tr, tr.steps.length - 1, -1);

    if (newPos !== -1) {
      const newSelection = createBoundedSelection(tr, newPos, oldSelection);
      tr.setSelection(newSelection);
      dispatch(tr);
      return true;
    }
  }
  return false;
};

const handleAiOperations =
  ({ props, action, textOptions, extensionOptions, fetchDataFn }) =>
  async () => {
    const { editor } = props;
    const {
      state,
      state: { selection },
    } = editor;
    const aiStorage = editor.storage.ai || editor.storage.aiAdvanced;
    const options = {
      collapseToEnd: true,
      format: "plain-text",
      ...textOptions,
    };
    const { from, to } =
      typeof options.insertAt === "number"
        ? { from: options.insertAt, to: options.insertAt }
        : options.insertAt || state.selection;
    const selectedText =
      textOptions?.text ||
      (!options.plainText || options.format === "plain-text"
        ? getContentFromSelection(editor, from, to)
        : state.doc.textBetween(from, to, " "));
    const shouldInsert = textOptions?.insert !== false;
    const shouldAppend = options.append && options.insertAt === undefined;

    if (!selectedText) return false;

    if (textOptions.startsInline === undefined) {
      textOptions.startsInline = Q(selection);
    }

    Object.assign(aiStorage, {
      state: "loading",
      response: "",
      error: undefined,
      generatedWith: {
        options: textOptions,
        action: action,
        range: undefined,
      },
    });

    editor.chain().setMeta("aiResponse", aiStorage).run();
    extensionOptions.onLoading?.({ editor, action, isStreaming: false });

    let startPosition = from;
    if (options.append) {
      startPosition = to;
    }

    return editor.commands.streamContent(shouldAppend ? to : { from, to }, async ({ write }) => {
      try {
        const aiResponse = await fetchDataFn({
          editor,
          action,
          text: selectedText,
          textOptions,
          extensionOptions,
          defaultResolver: fetchAiResponse,
        });

        if (!aiResponse) return false;

        Object.assign(aiStorage, {
          state: "idle",
          message: aiResponse,
          error: undefined,
          generatedWith: {
            options: textOptions,
            action: action,
            range: shouldInsert ? { from, to } : undefined,
          },
        });

        aiStorage.pastResponses.push(aiResponse);

        if (shouldInsert) {
          const writeResult = write({
            partial: aiResponse,
            appendToChain: (chain) =>
              chain.setMeta("aiResponse", aiStorage).command(({ dispatch, tr }) =>
                updateSelectionAfterChange({
                  dispatch,
                  tr,
                  oldSelection: { from, to },
                }),
              ),
          });

          if (aiStorage.generatedWith) {
            aiStorage.generatedWith.range = { from: writeResult.from, to: writeResult.to };
          }
        } else {
          editor.chain().setMeta("aiResponse", aiStorage).run();
        }

        Object.assign(aiStorage, {
          state: "idle",
          response: aiResponse,
          error: undefined,
          generatedWith: {
            options: textOptions,
            action: action,
            range: shouldInsert ? { from: startPosition, to } : undefined,
          },
        });

        aiStorage.pastResponses.push(aiResponse);
        extensionOptions.onSuccess?.({ editor, action, isStreaming: false, response: aiResponse });
        editor.chain().setMeta("aiResponse", aiStorage).run();
        return true;
      } catch (error) {
        Object.assign(aiStorage, {
          state: "error",
          response: undefined,
          error: error,
          generatedWith: {
            options: textOptions,
            action: action,
            range: undefined,
          },
        });

        editor.chain().setMeta("aiResponse", aiStorage).run();
        extensionOptions.onError?.(error, { editor, action, isStreaming: false });
        return false;
      }
    });
  };

const handleSuggestionInsertion = (editor, decoration) => {
  const suggestionContent = decoration.type.attrs["data-suggestion"];

  editor
    .chain()
    .focus()
    .insertContentAt(decoration.to - 1, suggestionContent, {
      updateSelection: true,
      errorOnInvalidContent: false,
    })
    .focus()
    .run();
};

// 获取当前选中的表格单元格节点
const getSelectedTableCell = (editor) => {
  const findTableCell = (selection) => selection.type.name === "tableCell";
  return editor.state.selection.node?.type === findTableCell ? editor.state.selection.node : undefined;
};

// Function to handle AI-based suggestions within the editor
const handleAiSuggestions = (editor, chunk, promptText, suggestionText) => {
  const decorations = editor.flatMap((deco) => [
    Decoration.inline(deco.pos, deco.pos + deco.node.nodeSize, { class: "tiptap-ai-prompt" }),
    Decoration.node(deco.pos, deco.pos + deco.node.nodeSize, {
      class: "tiptap-ai-suggestion",
      "data-prompt": promptText,
      "data-suggestion": suggestionText,
    }),
  ]);
  return decorations;
};

// Global variable for managing abort operations within the AI process
let abortController: AbortController | undefined;

// Function to handle aborting ongoing processes
const abortProcess = () => {
  abortController?.abort();
  abortController = undefined;
};

// AI autocompletion implementation
const aiAutocompletion = async (editor, context, options) => {
  if (!abortController) {
    abortController = new AbortController();
  }

  const aiExtension = editor.extensionManager.extensions.find((ext) => ext.name === "ai" || ext.name === "aiAdvanced");

  if (!aiExtension) {
    throw new Error("AI extension not found.");
  }

  const { aiStreamResolver } = aiExtension.options;
  const lastChunks = context
    .slice(Math.max(context.length - 3, 0))
    .filter((chunk) => chunk.node.textContent)
    .map((chunk) => chunk.node.textContent)
    .join(" ")
    .trim();

  const { inputLength, modelName } = options;
  const userInput = lastChunks.slice(-inputLength).trim();
  const docContent = editor.view.state.doc;

  if (!userInput.length) return;

  // Function to fetch and process AI completion data
  (async ({ text, aborter }) => {
    let responseContent = "";
    try {
      aiExtension.options.onLoading?.({
        action: "autocomplete",
        isStreaming: true,
        editor: editor,
      });

      const fetchStream = await aiStreamResolver({
        editor,
        action: "autocomplete",
        text,
        textOptions: { modelName },
        extensionOptions: aiExtension.options,
        aborter,
        defaultResolver: fetchData,
      });

      if (!fetchStream) return;

      const reader = fetchStream.getReader();
      const textDecoder = new TextDecoder();
      let isCancelled = false;

      async function readStream() {
        while (!isCancelled) {
          const { value, done } = await reader.read();
          const decodedValue = textDecoder.decode(value, { stream: true });
          isCancelled = done;
          responseContent += decodedValue;
          if (done) {
            const decorations = handleAiSuggestions(
              [context[context.length - 1]],
              context.nodeSize,
              context[context.length - 1].node.textContent,
              `${responseContent || ""}`,
            );

            const transaction = editor.view.state.tr.setMeta("asyncDecorations", decorations);
            editor.view.dispatch(transaction);
          }
          aiExtension.options.onSuccess?.({
            action: "autocomplete",
            isStreaming: true,
            editor: editor,
            response: responseContent,
          });
        }
      }

      readStream();
    } catch (error) {
      aiExtension.options.onError?.(error, {
        action: "autocomplete",
        isStreaming: true,
        editor: editor,
      });
    }
  })({ text: userInput, aborter: abortController });
};

// AI Autocompletion ProseMirror Plugin for handling AI-triggered suggestions
const aiAutocompletionPlugin = ({ editor, options, pluginKey = "AiAutocompletionPlugin" }) => {
  return new Plugin({
    key: new PluginKey(pluginKey),
    state: {
      init() {
        return DecorationSet.empty;
      },
      apply(tr, value, oldState, newState) {
        const docChanged = tr.docChanged;
        const asyncDecorations = tr.getMeta("asyncDecorations");

        if (typeof asyncDecorations !== "undefined" || docChanged || !oldState.selection.eq(newState.selection)) {
          if (!docChanged || oldState.selection.eq(newState.selection)) {
            abortProcess();
          }
          value = value.map(tr.mapping, tr.doc);
          return DecorationSet.create(newState.doc, asyncDecorations || []);
        }
        return value;
      },
    },
    props: {
      decorations(state) {
        return this.getState(state);
      },
      handleKeyDown(view, event) {
        const decorationSet = this.getState(view.state);
        const [fromDeco, toDeco] = view.state.tr.getMeta("asyncDecorations") || decorationSet?.find() || [];

        const removeDecorations = () => {
          const tr = view.state.tr.setMeta("asyncDecorations", []);
          decorationSet?.remove([fromDeco]);
          decorationSet?.remove([toDeco]);
          view.dispatch(tr);
        };

        const hasDecorations = !!fromDeco;

        switch (event.key) {
          case "Escape":
            if (hasDecorations) {
              abortProcess();
              removeDecorations();
            }
            break;
          case "Enter":
            if (hasDecorations) {
              abortProcess();
              removeDecorations();
            }
            break;
          case options.trigger: {
            event.preventDefault();
            event.stopPropagation();

            const isInTableCell = findParentNode((node) => node.type.name === "tableCell")(view.state.selection)?.node;

            if (options.trigger === "Tab" && isInTableCell) return false;

            if (hasDecorations) {
              handleSuggestionInsertion(editor, toDeco);
              abortProcess();
            } else {
              const { selection } = editor.state;
              const insertionStart = selection.to;
              const textBlocks = findChildrenInRange(
                view.state.doc,
                { from: 0, to: insertionStart },
                (nodeInfo) => nodeInfo.isTextblock,
              );
              const lastBlock = textBlocks[textBlocks.length - 1];

              const nodeEnd = lastBlock.pos + lastBlock.node.nodeSize;
              if (
                insertionStart === nodeEnd - 1 &&
                (lastBlock.node.type.isText ||
                  (lastBlock.node.type.isTextblock &&
                    lastBlock.node.childCount !== 0 &&
                    lastBlock.node.lastChild.type.isText))
              ) {
                aiAutocompletion(editor, textBlocks, options);
              }
              break;
            }
            break;
          }
          default:
            abortProcess();
            removeDecorations();
        }
        return false;
      },
    },
  });
};

declare module "@tiptap/core" {
  interface Commands<ReturnType> {
    aiMark: {
      setAiMark: () => ReturnType;
      toggleAiMark: () => ReturnType;
      unsetAiMark: () => ReturnType;
    };
  }
}

// Mark extension for managing AI marks
const aiMarkExtension = Mark.create({
  name: "aiMark",
  addOptions() {
    return {
      HTMLAttributes: {
        class: "tiptap-ai-insertion",
      },
    };
  },
  parseHTML() {
    return [
      {
        tag: "span",
        getAttrs: (element) => element.classList.contains("tiptap-ai-insertion") && null,
      },
    ];
  },
  renderHTML({ HTMLAttributes }) {
    return ["span", mergeAttributes(this.options.HTMLAttributes, HTMLAttributes), 0];
  },
  addCommands() {
    return {
      setAiMark:
        () =>
        ({ commands }) =>
          commands.setMark(this.name),
      toggleAiMark:
        () =>
        ({ commands }) =>
          commands.toggleMark(this.name),
      unsetAiMark:
        () =>
        ({ commands }) =>
          commands.unsetMark(this.name),
    };
  },
});

declare module "@tiptap/core" {
  interface Commands<ReturnType> {
    ai: {
      aiAdjustTone: (tone: string, options?: any) => ReturnType;
      aiBloggify: (options?: any) => ReturnType;
      aiComplete: (options?: { append: boolean }) => ReturnType;
      aiDeEmojify: (options?: any) => ReturnType;
      aiExtend: (options?: any) => ReturnType;
      aiEmojify: (options?: any) => ReturnType;
      aiFixSpellingAndGrammar: (options?: any) => ReturnType;
      aiRephrase: (options?: any) => ReturnType;
      aiShorten: (options?: any) => ReturnType;
      aiSimplify: (options?: any) => ReturnType;
      aiSummarize: (options?: any) => ReturnType;
      aiKeypoints: (options?: any) => ReturnType;
      aiTextPrompt: (options?: any) => ReturnType;
      aiTldr: (options?: any) => ReturnType;
      aiTranslate: (language: string, options?: any) => ReturnType;
      aiRestructure: (options?: any) => ReturnType;
      aiImagePrompt: (options?: any) => ReturnType;
      aiAccept: ({
        insertAt,
        append,
      }: { insertAt: number | { from: number; to: number }; append?: boolean }) => ReturnType;
      aiReject: ({ type }: { type: "reset" | "pause" }) => ReturnType;
      aiRegenerate: ({
        insert,
        insertAt,
      }: { insert?: boolean; insertAt?: number | { from: number; to: number } }) => ReturnType;
    };
  }
}

// Function to handle AI-based extensions and their options
const aiExtension = Extension.create({
  name: "ai",
  addStorage() {
    return {
      pastResponses: [],
      state: "idle",
      response: undefined,
      error: undefined,
      generatedWith: undefined,
    };
  },
  addOptions() {
    return {
      appId: "YOUR_APP_ID",
      token: "YOUR_TOKEN_HERE",
      baseUrl: `${base_url}/api/ai`,
      autocompletion: false,
      autocompletionOptions: {
        inputLength: 4000,
        trigger: "Tab",
      },
      append: false,
      collapseToEnd: true,
      aiStreamResolver: fetchData,
      aiCompletionResolver: fetchData,
      aiImageResolver: fetchData,
      onLoading: () => null,
      onSuccess: () => null,
      onError: () => null,
    };
  },
  addExtensions() {
    return [aiMarkExtension.configure(), streamContentPlugin.configure()];
  },
  addProseMirrorPlugins() {
    const proseMirrorPlugins = [];
    if (this.editor.options.injectCSS) createStyleTag(aiinjectcss, this.editor.options.injectNonce, "ai");

    if (this.options.autocompletion) {
      proseMirrorPlugins.push(
        aiAutocompletionPlugin({
          editor: this.editor,
          options: {
            appId: this.options.appId,
            token: this.options.token,
            baseUrl: this.options.baseUrl || `${base_url}/api/ai`,
            inputLength: this.options.autocompletionOptions.inputLength || 4000,
            modelName: this.options.autocompletionOptions.modelName,
            trigger: this.options.autocompletionOptions.trigger || "Tab",
          },
        }),
      );
    }
    return proseMirrorPlugins;
  },
  addCommands() {
    return {
      aiAdjustTone:
        (tone, options = {}) =>
        (instance) =>
          invokeAiCommand(instance, "adjust-tone", { ...options, tone }),
      aiBloggify:
        (options = {}) =>
        (instance) =>
          invokeAiCommand(instance, "bloggify", options),
      aiComplete:
        (options = { append: true }) =>
        (instance) =>
          invokeAiCommand(instance, "complete", options),
      aiDeEmojify:
        (options = {}) =>
        (instance) =>
          invokeAiCommand(instance, "de-emojify", options),
      aiExtend:
        (options = {}) =>
        (instance) =>
          invokeAiCommand(instance, "extend", options),
      aiEmojify:
        (options = {}) =>
        (instance) =>
          invokeAiCommand(instance, "emojify", options),
      aiFixSpellingAndGrammar:
        (options = {}) =>
        (instance) =>
          invokeAiCommand(instance, "fix-spelling-and-grammar", options),
      aiRephrase:
        (options = {}) =>
        (instance) =>
          invokeAiCommand(instance, "rephrase", options),
      aiShorten:
        (options = {}) =>
        (instance) =>
          invokeAiCommand(instance, "shorten", options),
      aiSimplify:
        (options = {}) =>
        (instance) =>
          invokeAiCommand(instance, "simplify", options),
      aiSummarize:
        (options = {}) =>
        (instance) =>
          invokeAiCommand(instance, "summarize", options),
      aiKeypoints:
        (options = {}) =>
        (instance) =>
          invokeAiCommand(instance, "keypoints", options),
      aiTextPrompt:
        (options = {}) =>
        (instance) =>
          invokeAiCommand(instance, "prompt", options),
      aiTldr:
        (options = {}) =>
        (instance) =>
          invokeAiCommand(instance, "tldr", options),
      aiTranslate:
        (language, options = {}) =>
        (instance) =>
          invokeAiCommand(instance, "translate", { ...options, language }),
      aiRestructure:
        (options = {}) =>
        (instance) =>
          invokeAiCommand(instance, "restructure", options),
      aiImagePrompt:
        (options = {}) =>
        (instance) => {
          processAiImage(this, instance, options);
          return true;
        },
      aiAccept:
        ({ insertAt, append }) =>
        ({ dispatch, editor, chain }) => {
          const aiStorage = editor.storage.ai || editor.storage.aiAdvanced;
          const { from, to } =
            typeof insertAt === "number" ? { from: insertAt, to: insertAt } : insertAt || editor.state.selection;
          const shouldAppend = append !== undefined ? append : aiStorage.generatedWith?.options?.append;

          if (aiStorage.state === "loading" || aiStorage.response == null || aiStorage.generatedWith?.range) {
            return false;
          }

          if (dispatch) {
            const response = aiStorage.response;
            Object.assign(aiStorage, {
              state: "idle",
              response: null,
              error: void 0,
              generatedWith: void 0,
            });
            aiStorage.pastResponses = [];
            const commandChain = chain()
              .setMeta("aiResponse", aiStorage)
              .focus()
              .insertContentAt(shouldAppend ? to : { from, to }, response, {
                parseOptions: {
                  preserveWhitespace: false,
                },
                errorOnInvalidContent: false,
              })
              .run();
            return true;
          }
          return false;
        },
      aiReject:
        ({ type = "reset" }) =>
        ({ dispatch, editor, chain }) => {
          const aiStorage = editor.storage.ai || editor.storage.aiAdvanced;
          if (aiStorage.state === "error" || aiStorage.response == null || aiStorage.generatedWith?.range) {
            return false;
          }
          if (dispatch) {
            if (type === "reset") {
              Object.assign(aiStorage, {
                state: "idle",
                response: void 0,
                error: void 0,
                generatedWith: void 0,
              });
              aiStorage.pastResponses = [];
            } else if (type === "pause") {
              Object.assign(aiStorage, { state: "idle" });
            }
            chain().setMeta("aiResponse", aiStorage).run();
            return true;
          }
          return false;
        },
      aiRegenerate:
        ({ insert, insertAt }) =>
        (props) => {
          const { dispatch, editor } = props;
          const aiStorage = editor.storage.ai || editor.storage.aiAdvanced;

          if (
            aiStorage.pastResponses.length === 0 ||
            !aiStorage.generatedWith ||
            (insert && (!aiStorage.generatedWith.range || insertAt === undefined))
          ) {
            return false;
          }

          if (dispatch) {
            let options = aiStorage.generatedWith.options;
            if (insert || (insert === undefined && aiStorage.generatedWith.range)) {
              options = {
                ...options,
                insert: true,
                insertAt: insertAt || aiStorage.generatedWith.range,
              };
            }
            return invokeAiCommand(props, aiStorage.generatedWith.action, options);
          }
          return true;
        },
    };
  },
});

// Utility function to trigger AI command and decide on streaming
const invokeAiCommand = (props, action, options) => {
  const { editor } = props;
  const { stream = false } = options;

  const aiExtension = editor.extensionManager.extensions.find((ext) => ext.name === "ai" || ext.name === "aiAdvanced");
  const aiStorage = editor.storage.ai || editor.storage.aiAdvanced;

  if (!aiExtension || aiStorage.state === "loading") return false;

  const { baseUrl } = aiExtension.options;

  if (shouldWarnUser({ baseUrl, action })) {
    console.warn(`Using the Tiptap demo AI endpoint. It's not recommended to use it in production as it may break.`);
  }

  if (stream) {
    handleAiOperationsStream({
      props,
      action,
      textOptions: options,
      extensionOptions: aiExtension.options,
      fetchDataFn: fetchData,
      // defaultResolver: fetchData,
    })();
    return true;
  }
  handleAiOperations({
    props,
    action,
    textOptions: options,
    extensionOptions: aiExtension.options,
    fetchDataFn: fetchData,
  })();
  return true;
};

// Function to conditionally warn the user based on the base URL
function shouldWarnUser({ baseUrl, action }) {
  const isProductionEnvironment = !["localhost", "wordix-web-jm9f.vercel.app"].includes(window.location.hostname);
  return isProductionEnvironment && baseUrl === "https://wordix-web-jm9f.vercel.app/api/ai";
}

// Helper function for AI image processing and generation
async function processAiImage(extension, instance, options) {
  const { editor, state } = instance;

  const aiExtension = editor.extensionManager.extensions.find((ext) => ext.name === "ai" || ext.name === "aiAdvanced");
  const {
    selection: { from, to },
  } = state;

  const textForImage = options.text || state.doc.textBetween(from, to, " ");

  if (!textForImage || !aiExtension) return false;

  const imageExtension = editor.extensionManager.extensions.find((ext) => ext.name === "image");
  if (!imageExtension) throw new Error("Image extension not loaded.");

  return await generateImageUsingAi({
    props: instance,
    text: textForImage,
    imageOptions: options,
    extensionOptions: aiExtension.options,
    fetchDataFn: aiExtension.options.aiImageResolver,
  });
}

// Function to manage image processing with AI
export const generateImageUsingAi = async ({ props, text, imageOptions, extensionOptions, fetchDataFn }) => {
  const { editor } = props;
  const { state } = editor;

  const {
    selection: { from, to },
  } = state;
  const inputTextForImage = imageOptions.text || state.doc.textBetween(from, to, " ");

  extensionOptions.onLoading?.({
    action: "image",
    isStreaming: false,
    editor: editor,
  });

  try {
    const imageData = await fetchDataFn({
      editor,
      text: inputTextForImage,
      imageOptions,
      extensionOptions,
    });

    editor
      .chain()
      .focus()
      .setImage({
        src: imageData,
        alt: inputTextForImage,
        title: inputTextForImage,
      })
      .run();

    extensionOptions.onSuccess?.({
      action: "image",
      isStreaming: false,
      editor: editor,
    });
    return true;
  } catch (error) {
    extensionOptions.onError?.(error, {
      action: "image",
      isStreaming: false,
      editor: editor,
    });
    return false;
  }
};

// Function and variables related to the plugin for streaming content
const streamContentKey = new PluginKey("streamContent");
let transactionListeners = [];

declare module "@tiptap/core" {
  interface Commands<ReturnType> {
    streamContent: {
      streamContent: (
        /**
         * The position to insert the content at.
         */
        position: number | Range,
        /**
         * The callback to write the content into the editor.
         */
        callback: (options: StreamContentAPI) => Promise<any>,
        /**
         * The options to pass to the `insertContentAt` command.
         */
        options?: {
          parseOptions?: any;
          /**
           * This will insert the content at the same depth as the `from` position.
           * Effectively, this will insert the content as a sibling of the node at the `from` position.
           * @default true
           */
          respondInline?: boolean;
        },
      ) => ReturnType;
    };
  }
}

type StreamContentAPI = {
  /**
   * The function to write content into the editor.
   */
  write: (ctx: {
    /**
     * The partial content of the stream to insert.
     */
    partial: string;
    /**
     * This function allows you to transform the content before inserting it into the editor.
     * It must return a Prosemirror `Fragment` or `Node`.
     */
    transform?: (ctx: {
      /**
       * The accumulated content of the stream.
       */
      buffer: string;
      /**
       * The current partial content of the stream.
       */
      partial: string;
      editor: Editor;
      /**
       * Allows you to use the default transform function.
       */
      defaultTransform: (
        /**
         * The content to insert as an HTML string.
         * @default ctx.buffer
         */
        htmlString?: string,
      ) => Fragment;
    }) => Fragment | Node | Node[];
    /**
     * Allows you to append commands to the chain before it is executed.
     */
    appendToChain?: (chain: any) => any;
  }) => {
    /**
     * The buffer that is being written to.
     */
    buffer: string;
    /**
     * The start of the inserted content in the editor.
     */
    from: number;
    /**
     * The end of the inserted content in the editor.
     */
    to: number;
  };
  /**
   * A writable stream to write content into the editor.
   * @example fetch('https://example.com/stream').then(response => response.body.pipeTo(ctx.getWritableStream()))
   */
  getWritableStream: () => WritableStream;
};

// ProseMirror Plugin for managing content streaming
const streamContentPlugin = Extension.create({
  name: "streamContent",
  onTransaction({ transaction }) {
    transactionListeners.forEach((listener) => listener(transaction));
  },
  addCommands() {
    return {
      streamContent:
        (range, callback, options) =>
        ({ editor }) => {
          const shouldRespondInline = !!(options?.respondInline === undefined || options.respondInline);
          const startTime = Date.now();
          let startPos = -1;
          let endPos = -1;

          if (typeof range === "number") {
            startPos = range;
            endPos = range;
          } else if ("from" in range && "to" in range) {
            startPos = range.from;
            endPos = range.to;
          }

          const isSinglePoint = startPos === endPos;
          if (startPos === -1 || endPos === -1) return false;

          let contentSize = 0;
          const contentHandler = StreamContentHandler.create();
          const mapping = new Mapping();

          function registerTransactionListener(listener) {
            // transactionListeners.push(listener);
            listener.docChanged &&
              (listener.getMeta(streamContentKey) === void 0 ||
                listener.getMeta(streamContentKey).startTime !== startTime) &&
              mapping.appendMapping(listener.mapping);
          }

          transactionListeners.push(registerTransactionListener);

          function createContentFragment(handler) {
            return Fragment.from(
              createNodeFromContent(handler.buffer, editor.state.schema, {
                parseOptions: options?.parseOptions || { preserveWhitespace: false },
              }),
            );
          }

          const operations = {
            cleanUp() {
              const originalLength = transactionListeners.length;
              transactionListeners = transactionListeners.filter((fn) => fn !== registerTransactionListener);
              if (transactionListeners.length === originalLength - 1) {
                contentHandler.finalize();
                editor
                  .chain()
                  .setMeta(streamContentKey, {
                    startTime,
                    partial: contentHandler.lastPartial,
                    buffer: contentHandler.content,
                    done: true,
                  })
                  .run();
              }
            },
            write({ partial, transform = createContentFragment, appendToChain = (chain) => chain }) {
              let chain = editor.chain();

              if (contentHandler.content === "" && !isSinglePoint) {
                chain = chain.deleteRange({
                  from: startPos,
                  to: endPos,
                });
              }

              contentHandler.append(partial);
              const fragment = Fragment.from(
                transform({
                  partial: contentHandler.lastPartial,
                  buffer: contentHandler.content,
                  editor,
                  defaultTransform: (buffer) =>
                    createContentFragment({ buffer: buffer || contentHandler.content, partial, editor }),
                }),
              );

              chain
                .setMeta(streamContentKey, {
                  startTime,
                  partial: contentHandler.lastPartial,
                  buffer: contentHandler.content,
                  done: true,
                })
                .setMeta("preventClearDocument", true);

              // @ts-ignore
              const isInvalidContent = !isNodeEmpty(fragment) || fragment.firstChild?.isText || false;

              const maxDocumentSize = editor.state.doc.nodeSize - 2;
              let from = clamp(mapping.map(startPos, 1), isInvalidContent ? 1 : 0, maxDocumentSize);
              const to = clamp(from + contentSize, 0, maxDocumentSize);

              if (from === 1 && !isInvalidContent) {
                from = 0;
              }

              let positions = { from, to };

              chain.command(({ tr }) => {
                tr.replaceRange(
                  from,
                  to,
                  new Slice(
                    fragment,
                    shouldRespondInline ? Math.min(tr.doc.resolve(from).depth, calculateDepth(fragment)) : 0,
                    0,
                  ),
                );
                const step = tr.steps[tr.steps.length - 1];
                if (step) {
                  // @ts-ignore
                  positions = { from: step.from, to: step.from + step.slice.size };
                }
                // positions = { from: step.from, to: step.from + step.slice.size };
                return true;
              });

              chain = appendToChain(chain);
              contentSize = fragment.size;
              chain.run();

              return {
                buffer: contentHandler.content,
                from: positions.from,
                to: positions.to,
              };
            },
          };

          contentHandler.append("");

          (async () => {
            const writableStream = new WritableStream({
              write(chunk) {
                return new Promise((resolve) => {
                  const decodedChunk = new TextDecoder("utf-8").decode(chunk, { stream: true });
                  operations.write({ partial: decodedChunk });
                  resolve();
                });
              },
              close() {
                operations.cleanUp();
              },
            });

            try {
              await callback({ write: operations.write, getWritableStream: () => writableStream });
            } finally {
              operations.cleanUp();
            }
          })();

          return true;
        },
    };
  },
});

// Exporting AI Extensions and other modules
export {
  aiExtension as AiExtension,
  aiAutocompletion,
  aiAutocompletionPlugin,
  handleAiOperations as aiOperationHandler,
  processAiImage,
  fetchData,
};

const Ai = aiExtension;

export default Ai;
