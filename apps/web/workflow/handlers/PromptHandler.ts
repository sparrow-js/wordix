import prisma from "@/backend/prisma";
import { cloneDeep } from "lodash";
import { DocumentProcessor } from "../processors/DocumentProcessor";
import type { DocNode, ProcessingContext } from "../types/DocNode";
import { BaseHandler } from "./BaseHandler";

interface ParameterValue {
  type: "literal" | "variable";
  value: string;
}

interface PromptAttrs {
  id: string;
  label: string;
  outputs: string;
  promptId: string;
  parameters: Record<string, ParameterValue>;
}

export class PromptHandler extends BaseHandler {
  async before(node: DocNode, context: ProcessingContext): Promise<void> {
    if (!node._state) {
      node._state = {
        executed: false,
        timestamp: Date.now(),
        result: null,
      };
    }

    // 保存原始内容的副本
    node["originalContent"] = cloneDeep(node.content);
  }

  async handle(node: DocNode, context: ProcessingContext): Promise<void> {
    const attrs = node.attrs as PromptAttrs;

    // 使用 Prisma 获取 prompt 文档
    const promptDoc = await prisma.document.findUnique({
      where: {
        id: attrs.promptId,
      },
    });

    if (!promptDoc) {
      throw new Error(`Prompt document not found: ${attrs.promptId}`);
    }

    // Resolve parameter values
    const resolvedParameters: Record<string, any> = {};
    for (const [key, param] of Object.entries(attrs.parameters)) {
      resolvedParameters[key] = await this.resolveParameterValue(param, context);
    }

    // 创建新的处理器上下文
    const processor = new DocumentProcessor(context.onStop, context.onStreamResponse, {
      //   variables: new Map(context.variables),
      depth: context.depth + 1,
      //   path: [...context.path, attrs.id],
      markdown: [],
    });

    // 处理文档
    await processor.processNode(promptDoc.content as any, resolvedParameters);

    const processorResult = processor.getContext();

    // Store the execution result
    node._state!.result = {
      parameters: resolvedParameters,
      promptId: attrs.promptId,
      promptDoc,
      processorResult: {
        variables: new Map(processorResult.variables),
        markdown: [...processorResult.markdown],
      },
    };

    node._state!.executed = true;

    // 更新主上下文
    context.markdown.push(...processorResult.markdown);
    for (const [key, value] of processorResult.variables) {
      context.variables.set(key, value);
    }

    // Emit the prompt execution event
    await this.emitStream(context, "prompt_complete", {
      id: attrs.id,
      promptId: attrs.promptId,
      promptDoc,
      parameters: resolvedParameters,
      result: node._state!.result.processorResult,
    });
  }

  private async resolveParameterValue(param: ParameterValue, context: ProcessingContext): Promise<any> {
    if (param.type === "literal") {
      return param.value;
    }

    if (param.type === "variable") {
      return context.variables.get(param.value)?.value;
    }

    return undefined;
  }

  async toMarkdown(node: DocNode, context: ProcessingContext): Promise<string> {
    const attrs = node.attrs as PromptAttrs;
    const state = node._state?.result;

    if (!state) {
      return "";
    }

    // Format parameters for display
    const parameters = Object.entries(state.parameters)
      .map(([key, value]) => `  ${key}: ${value}`)
      .join("\n");

    // Include processor markdown results
    const processorMarkdown = state.processorResult?.markdown.join("\n") || "";

    return `Prompt: ${attrs.label}\nID: ${attrs.promptId}\nPrompt Content: ${state.promptDoc.content}\nParameters:\n${parameters}\n\nResult:\n${processorMarkdown}`;
  }
}
