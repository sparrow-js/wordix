import { cloneDeep } from "lodash";
import { DocumentProcessor } from "../processors/DocumentProcessor";
import type { DocNode, ProcessingContext, Variable } from "../types/DocNode";
import { BaseHandler } from "./BaseHandler";

interface ExpressionValue {
  type: "literal" | "variable";
  value: string;
}

interface MatchExpression {
  match: {
    firstValue: ExpressionValue;
    secondValue: ExpressionValue;
    ignoreCase: boolean;
    ignoreWhitespace: boolean;
    ignoreSymbols: boolean;
  };
  contains: {
    value: ExpressionValue;
    searchValue: ExpressionValue;
    ignoreCase: boolean;
    ignoreWhitespace: boolean;
    ignoreSymbols: boolean;
  };
  relative: {
    firstValue: ExpressionValue;
    secondValue: ExpressionValue;
    comparator: "gt" | "lt" | "gte" | "lte" | "eq";
  };
  else: boolean;
}

interface IfElseState {
  executedBranch: string | null;
  result: {
    variables: Map<string, Variable>;
    markdown: string[];
  } | null;
}

export class IfElseHandler extends BaseHandler {
  async before(node: DocNode, context: ProcessingContext): Promise<void> {
    if (!node._state) {
      node._state = {
        executed: false,
        timestamp: Date.now(),
        result: {
          executedBranch: null,
          result: null,
        } as IfElseState,
      };
    }

    // 保存原始内容的副本
    node["originalContent"] = cloneDeep(node.content);
  }

  async handle(node: DocNode, context: ProcessingContext): Promise<void> {
    const state = node._state!.result as IfElseState;

    // 处理每个分支条件
    for (const child of node.content || []) {
      if (child.type === "if") {
        const shouldExecute = await this.evaluateCondition(child, context);

        if (shouldExecute) {
          await this.executeBranch(node, child, context, state);
          break;
        }
      } else if (child.type === "else") {
        await this.executeBranch(node, child, context, state);
      }
    }

    node._state!.executed = true;

    // 发送完成事件
    await this.emitStream(context, "if_else_complete", {
      id: node.attrs.id,
      executedBranch: state.executedBranch,
      result: state.result,
    });
  }

  private async executeBranch(
    parentNode: DocNode,
    branchNode: DocNode,
    context: ProcessingContext,
    state: IfElseState,
  ): Promise<void> {
    try {
      // 创建新的处理器上下文
      const processor = new DocumentProcessor(context.onStop, context.onStreamResponse, {
        variables: new Map(context.variables),
        depth: context.depth + 1,
        path: [...context.path, branchNode.attrs.id],
        markdown: [],
        apiKey: context.apiKey,
      });

      // 创建文档节点
      const contentDoc: DocNode = {
        type: "doc",
        content: cloneDeep(branchNode.content),
      };

      // 处理分支内容
      await processor.processNode(contentDoc);

      // 保存执行结果
      state.executedBranch = branchNode.attrs.id;
      state.result = {
        variables: new Map(processor.getContext().variables),
        markdown: [...processor.getContext().markdown],
      };

      // 更新主上下文
      context.markdown.push(...processor.getContext().markdown);
      for (const [key, value] of processor.getContext().variables) {
        context.variables.set(key, value);
      }

      // 发送分支执行完成事件
      await this.emitStream(context, "branch_complete", {
        id: parentNode.attrs.id,
        branchId: branchNode.attrs.id,
        type: branchNode.type,
        result: state.result,
      });
    } catch (error) {
      console.error(`Error executing branch ${branchNode.attrs.id}:`, error);
      throw error;
    }
  }

  private async evaluateCondition(node: DocNode, context: ProcessingContext): Promise<boolean> {
    const expression = node.attrs.expression as MatchExpression;

    // Match 逻辑
    if (node.attrs.type === "match" && expression.match) {
      return this.evaluateMatchCondition(expression.match, context);
    }

    // Contains 逻辑
    if (node.attrs.type === "contains" && expression.contains) {
      return this.evaluateContainsCondition(expression.contains, context);
    }

    // Relative 逻辑
    if (node.attrs.type === "relative" && expression.relative) {
      return this.evaluateRelativeCondition(expression.relative, context);
    }

    return false;
  }

  private async evaluateMatchCondition(
    matchExpr: MatchExpression["match"],
    context: ProcessingContext,
  ): Promise<boolean> {
    const firstValue = await this.resolveExpressionValue(matchExpr.firstValue, context.variables);
    const secondValue = await this.resolveExpressionValue(matchExpr.secondValue, context.variables);

    let compareStr1 = String(firstValue || "");
    let compareStr2 = String(secondValue || "");

    if (matchExpr.ignoreCase) {
      compareStr1 = compareStr1.toLowerCase();
      compareStr2 = compareStr2.toLowerCase();
    }

    if (matchExpr.ignoreWhitespace) {
      compareStr1 = compareStr1.replace(/\s+/g, "");
      compareStr2 = compareStr2.replace(/\s+/g, "");
    }

    if (matchExpr.ignoreSymbols) {
      compareStr1 = compareStr1.replace(/[^\w\s]/g, "");
      compareStr2 = compareStr2.replace(/[^\w\s]/g, "");
    }

    return compareStr1 === compareStr2;
  }

  private async evaluateContainsCondition(
    containsExpr: MatchExpression["contains"],
    context: ProcessingContext,
  ): Promise<boolean> {
    const value = await this.resolveExpressionValue(containsExpr.value, context.variables);
    const searchValue = await this.resolveExpressionValue(containsExpr.searchValue, context.variables);

    let mainStr = String(value || "");
    let searchStr = String(searchValue || "");

    if (containsExpr.ignoreCase) {
      mainStr = mainStr.toLowerCase();
      searchStr = searchStr.toLowerCase();
    }

    if (containsExpr.ignoreWhitespace) {
      mainStr = mainStr.replace(/\s+/g, "");
      searchStr = searchStr.replace(/\s+/g, "");
    }

    if (containsExpr.ignoreSymbols) {
      mainStr = mainStr.replace(/[^\w\s]/g, "");
      searchStr = searchStr.replace(/[^\w\s]/g, "");
    }

    return mainStr.includes(searchStr);
  }

  private async evaluateRelativeCondition(
    relativeExpr: MatchExpression["relative"],
    context: ProcessingContext,
  ): Promise<boolean> {
    const firstValue = await this.resolveExpressionValue(relativeExpr.firstValue, context.variables);
    const secondValue = await this.resolveExpressionValue(relativeExpr.secondValue, context.variables);

    const num1 = Number(firstValue);
    const num2 = Number(secondValue);

    if (isNaN(num1) || isNaN(num2)) {
      return false;
    }

    switch (relativeExpr.comparator) {
      case "gt":
        return num1 > num2;
      case "lt":
        return num1 < num2;
      case "gte":
        return num1 >= num2;
      case "lte":
        return num1 <= num2;
      case "eq":
        return num1 === num2;
      default:
        return false;
    }
  }

  private async resolveExpressionValue(expr: ExpressionValue, variables: Map<string, any>): Promise<any> {
    if (!expr) return undefined;

    if (expr.type === "literal") {
      return expr.value;
    }

    if (expr.type === "variable") {
      return variables.get(expr.value)?.value;
    }

    return undefined;
  }

  async toMarkdown(node: DocNode, context: ProcessingContext): Promise<string> {
    const state = node._state?.result as IfElseState;
    if (state?.result) {
      return state.result.markdown.join("");
    }
    return "";
  }
}
