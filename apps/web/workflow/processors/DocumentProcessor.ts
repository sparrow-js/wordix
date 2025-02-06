import { Registry } from "../core/registry";
import { BlockquoteHandler } from "../handlers/BlockquoteHandler";
import { BulletListHandler } from "../handlers/BulletListHandler";
import { CodeHandler } from "../handlers/CodeHandler";
import { GenerationHandler } from "../handlers/GenerationHandler";
import { HardBreakHandler } from "../handlers/HardBreak";
import { HeadingHandler } from "../handlers/HeadingHandler";
import { IfElseHandler } from "../handlers/IfElseHandler";
import { ImageGenerationHandler } from "../handlers/ImageGenerationHandler";
import { ImageHandler } from "../handlers/ImageHandler";
import { InputsHandler } from "../handlers/InputsHandler";
import { ListItemHandler } from "../handlers/ListItemHandler";
import { LoopHandler } from "../handlers/LoopHandler";
import { MentionHandler } from "../handlers/MentionHandler";
import { OrderedListHandler } from "../handlers/OrderedListHandler";
import { ParagraphHandler } from "../handlers/ParagraphHandler";
import { PromptHandler } from "../handlers/PromptHandler";
import { TextHandler } from "../handlers/TextHandler";
import { ToolHandler } from "../handlers/ToolHandler";
import { FLUXTool } from "../tools/fluxTool";
import { PromptGenerationTool } from "../tools/promptGenerationTool";
import { TextToSpeechTool } from "../tools/textToSpeech";
import { TextTool } from "../tools/textTool";
import { WebscrapeTool } from "../tools/webscrapeTool";

import { BaseProcessor } from "./baseProcessor";

import { ToolManager } from "../core/toolManager";
import type { DocNode, NodeHandler, NodeState, ProcessingContext, Variable } from "../types/DocNode";

const MAX_DEPTH = 100;

export class DocumentProcessor extends BaseProcessor {
  private handlers: Map<string, NodeHandler>;

  private registry: Registry;

  private toolManager: ToolManager;

  protected context: ProcessingContext;
  private stopped = false;
  private currentNode: DocNode | null = null;
  private skipNodeTypes: Set<string> = new Set(["description", "horizontalRule", "comment", "title"]);
  private skipNodeChildrenTypes: Set<string> = new Set(["loop", "ifElse", "codeExecutor"]);

  constructor(
    onStop?: (node: DocNode) => Promise<void>,
    workflowStreamResponse?: ({ event, data, stream }) => void,
    initialState?: {
      variables?: Map<string, Variable>;
      depth?: number;
      path?: string[];
      markdown?: string[];
      markdownOutput?: string;
      tempParentNode?: DocNode;
      disableDocumentOutput?: boolean;
      apiKey?: string;
    },
  ) {
    super();
    this.registry = new Registry();

    this.handlers = new Map();

    // 使用初始状态或创建新状态
    this.context = {
      apiKey: initialState?.apiKey || "",
      variables: initialState?.variables || new Map<string, Variable>(),
      depth: initialState?.depth || 0,
      path: initialState?.path || [],
      markdown: initialState?.markdown || [],
      messages: [],
      blockContext: {},
      markdownOutput: initialState?.markdownOutput || "",
      handlers: this.handlers,
      tempParentNode: initialState?.tempParentNode || null,
      disableDocumentOutput: initialState?.disableDocumentOutput || false,
      onStop,
      onStreamResponse: (response) => {
        if (response.event === "message") {
          this.context.markdownOutput += response.data;
        }
        workflowStreamResponse?.(response);
      },
    };

    this.registerDefaultTools();

    this.toolManager = new ToolManager(this.registry);

    this.registerDefaultHandlers();
  }

  /**
   * Register default handlers for different node types
   */
  private registerDefaultHandlers(): void {
    this.handlers.set("heading", new HeadingHandler());
    this.handlers.set("paragraph", new ParagraphHandler());
    this.handlers.set("text", new TextHandler());
    this.handlers.set("inputs", new InputsHandler());
    this.handlers.set("mention", new MentionHandler());
    this.handlers.set("generation", new GenerationHandler());
    this.handlers.set("bulletList", new BulletListHandler());
    this.handlers.set("listItem", new ListItemHandler());
    this.handlers.set("loop", new LoopHandler());
    this.handlers.set("ifElse", new IfElseHandler());
    this.handlers.set("codeExecutor", new CodeHandler());
    this.handlers.set("prompt", new PromptHandler());
    this.handlers.set("tool", new ToolHandler(this.toolManager));
    this.handlers.set("hardBreak", new HardBreakHandler());
    this.handlers.set("orderedList", new OrderedListHandler());
    this.handlers.set("blockquote", new BlockquoteHandler());
    this.handlers.set("image", new ImageHandler());
    this.handlers.set("imageGeneration", new ImageGenerationHandler());
  }

  private registerDefaultTools(): void {
    this.registry.registerTool("text", new TextTool({}));
    // this.context
    this.registry.registerTool("stableDiffusion", new FLUXTool(this.context));
    this.registry.registerTool("promptGeneration", new PromptGenerationTool(this.context));
    this.registry.registerTool("webscrape", new WebscrapeTool(this.context));
    this.registry.registerTool("textToSpeech", new TextToSpeechTool(this.context));
  }

  /**
   * Register a custom handler for a node type
   */
  public registerHandler(type: string, handler: NodeHandler): void {
    this.handlers.set(type, handler);
  }

  /**
   * Emit stream response for workflow events
   */
  private async emitStreamResponse(type: string, node: DocNode, result?: string): Promise<void> {
    if (this.context.onStreamResponse) {
      const response = {
        type,
        data: result,
        stream: true,
      };
      await this.context.onStreamResponse(response);
    }
  }

  /**
   * Process a document node and its children
   */
  // public async processNode(node: DocNode, inputData?: any): Promise<void> {
  //   if (!node) return;

  //   if (this.skipNodeTypes.has(node.type)) {
  //     return;
  //   }

  //   this.stopped = false;
  //   this.context.inputData = inputData;

  //   try {
  //     await this.enterNode(node);
  //     await this.processCurrentNode(node);
  //     await this.processChildren(node, inputData);
  //     await this.completeNode(node);
  //   } finally {
  //     this.exitNode(node);
  //   }
  // }

  public async processNode(node: DocNode, inputData?: any): Promise<void> {
    if (!node || this.skipNodeTypes.has(node.type)) {
      return;
    }

    this.stopped = false;
    this.context.inputData = inputData;

    try {
      const handler = this.handlers.get(node.type);
      if (this.context.depth > MAX_DEPTH) {
        return;
      }
      // 1. Parent before
      await this.enterNode(node);
      if (handler?.before) {
        await handler.before(node, this.context);
      }

      // 2. Process current node
      // if (!this.shouldSkipNode(node)) {
      //   await this.handleNode(node, handler);
      //   await this.updateNodeState(node);
      //   await this.checkStopCondition(node);
      // }

      await this.processCurrentNode(node);
      if (!this.skipNodeChildrenTypes.has(node.type)) {
        await this.processChildren(node, inputData);
      }
      await this.completeNode(node);

      // 4. Parent after
      if (handler?.after) {
        await handler.after(node, this.context);
      }
      await this.completeNode(node);
    } catch (e) {
      console.error(e);
      this.context.onStreamResponse({
        event: "error",
        data: e,
        stream: true,
      });
    } finally {
      this.exitNode(node);
    }
  }

  /**
   * Setup for entering a node
   */
  private async enterNode(node: DocNode): Promise<void> {
    this.context.depth++;
    this.context.path.push(node.type);
    this.currentNode = node;
  }

  /**
   * Process the current node
   */
  private async processCurrentNode(node: DocNode): Promise<void> {
    // Skip if already executed and not waiting for input
    if (this.shouldSkipNode(node)) {
      return;
    }

    const handler = this.handlers.get(node.type);
    if (!handler) return;

    await this.handleNode(node, handler);
    await this.updateNodeState(node);
    await this.checkStopCondition(node);
  }

  /**
   * Check if node should be skipped
   */
  private shouldSkipNode(node: DocNode): boolean {
    return !!(node._state?.executed && !node._state?.waitingForInput);
  }

  /**
   * Handle node using its registered handler
   */
  private async handleNode(node: DocNode, handler: NodeHandler): Promise<void> {
    await handler.handle(node, this.context);
  }

  /**
   * Update node state after processing
   */
  private async updateNodeState(node: DocNode): Promise<void> {
    if (!node._state) {
      node._state = {
        executed: true,
        timestamp: Date.now(),
      };
    }

    if (node._state.waitingForInput && this.context.inputData) {
      this.handleInputData(node);
    }
  }

  /**
   * Handle input data for node
   */
  private handleInputData(node: DocNode): void {
    node._state!.waitingForInput = false;
    node._state!.result = {
      ...node._state!.result,
      input: this.context.inputData,
    };
  }

  /**
   * Check and handle stop condition
   */
  private async checkStopCondition(node: DocNode): Promise<void> {
    if (!node.stop) return;

    node._state!.stopped = true;
    node._state!.waitingForInput = true;
    this.stopped = true;

    if (this.context.onStop) {
      await this.context.onStop(node);
    }

    delete node.stop;
  }

  /**
   * Process child nodes
   */
  private async processChildren(node: DocNode, inputData?: any): Promise<void> {
    if (!node.content?.length || this.stopped) return;

    for (const child of node.content) {
      await this.processNode(child, inputData);
      if (this.stopped) break;
    }
  }

  /**
   * Complete node processing
   */
  private async completeNode(node: DocNode): Promise<void> {
    if (!this.stopped) {
      if (node.type === "doc") {
      }
    }
  }

  /**
   * Cleanup after node processing
   */
  private exitNode(node: DocNode): void {
    this.context.depth--;
    this.context.path.pop();
    if (node === this.currentNode) {
      this.currentNode = null;
    }
  }

  /**
   * Get variable by ID
   */
  public getVariable(id: string): any {
    return this.context.variables.get(id);
  }

  /**
   * Set variable value
   */
  public setVariableValue(id: string, value: any): void {
    const variable = this.context.variables.get(id);
    if (variable) {
      variable.value = value;
    }
  }

  /**
   * Get current processing node
   */
  public getCurrentNode(): DocNode | null {
    return this.currentNode;
  }

  /**
   * Check if processing is stopped
   */
  public isProcessingStopped(): boolean {
    return this.stopped;
  }

  /**
   * Get node state
   */
  public getNodeState(node: DocNode): NodeState | undefined {
    return node._state;
  }

  /**
   * Get node result
   */
  public getNodeResult(node: DocNode): any {
    return node._state?.result;
  }

  /**
   * Get processing context
   */
  public getContext(): ProcessingContext {
    return this.context;
  }

  /**
   * Reset processor state
   */
  public reset(): void {
    this.stopped = false;
    this.currentNode = null;
    this.context.depth = 0;
    this.context.path = [];
    this.context.markdown = [];
    this.context.inputData = undefined;
  }

  /**
   * Clone context for a new processing session
   */
  private cloneContext(): ProcessingContext {
    return {
      ...this.context,
      variables: new Map(this.context.variables),
      path: [...this.context.path],
      markdown: [...this.context.markdown],
    };
  }

  /**
   * Generate a unique identifier for a node
   */
  private getNodeIdentifier(node: DocNode): string {
    // Combine node type, text content, and attributes
    const typeId = node.type;
    const textId = node.text || "";
    const attrsId = JSON.stringify(node.attrs || {});

    return `${typeId}:${textId}:${attrsId}`;
  }

  /**
   * Capture the current state of the document for potential resumption
   */
  public captureState(): {
    variables: Map<string, Variable>;
    depth: number;
    path: string[];
    markdown: string[];
  } {
    return {
      variables: new Map(this.context.variables),
      depth: this.context.depth,
      path: [...this.context.path],
      markdown: [...this.context.markdown],
    };
  }

  public static restore(
    document: DocNode,
    previousState: {
      variables?: Map<string, Variable>;
      depth?: number;
      path?: string[];
      markdown?: string[];
    },
    onStop?: (node: DocNode) => Promise<void>,
    workflowStreamResponse?: ({ event, data, stream }) => void,
  ): DocumentProcessor {
    return new DocumentProcessor(onStop, workflowStreamResponse, previousState);
  }
}
