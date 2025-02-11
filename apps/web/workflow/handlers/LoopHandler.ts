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

interface LoopAttrs {
  id: string;
  type: "count" | "match" | "contains" | "relative" | "list";
  expression: MatchExpression;
  count?: string;
  list?: ExpressionValue;
  label?: string;
  currentCount?: number;
  expressionMode?: string;
}

interface LoopState {
  currentCount: number;
  completed: boolean;
  executedIterations: Set<number>;
  lastExecutedIteration: number;
  results: Array<{
    iteration: number;
    variables: Map<string, Variable>;
    markdown: string[];
  }>;
}

export class LoopHandler extends BaseHandler {
  async before(node: DocNode, context: ProcessingContext): Promise<void> {
    const attrs = node.attrs as LoopAttrs;

    if (!node._state) {
      node._state = {
        executed: false,
        timestamp: Date.now(),
        result: {
          currentCount: 0,
          completed: false,
          executedIterations: new Set<number>(),
          lastExecutedIteration: -1,
          results: [],
        } as LoopState,
      };
    }

    node["originalContent"] = cloneDeep(node.content);
  }

  async handle(node: DocNode, context: ProcessingContext): Promise<void> {
    const attrs = node.attrs as LoopAttrs;
    const state = node._state!.result as LoopState;

    switch (attrs.type) {
      case "count":
        const count = Number.parseInt(attrs.count || "0", 10);
        await this.processCountLoop(node, context, count);
        break;

      case "match":
        await this.processMatchLoop(node, context);
        break;

      case "contains":
        await this.processContainsLoop(node, context);
        break;

      case "relative":
        await this.processRelativeLoop(node, context);
        break;

      case "list":
        await this.processListLoop(node, context);
        break;
    }

    node._state!.executed = state.completed;
    node._state!.result = state;
  }

  private async processCountLoop(node: DocNode, context: ProcessingContext, count: number): Promise<void> {
    const attrs = node.attrs as LoopAttrs;
    const state = node._state!.result as LoopState;

    const startIteration = state.lastExecutedIteration + 1;

    for (let i = startIteration; i < count; i++) {
      if (state.executedIterations.has(i)) {
        continue;
      }

      try {
        // 创建循环变量
        const loopVariables = new Map(context.variables);
        loopVariables.set(attrs.id, {
          id: attrs.id,
          type: "loop",
          value: {
            count: i + 1,
          },
        });

        // 创建文档处理器
        const processor = new DocumentProcessor(context.onStop, context.onStreamResponse, {
          variables: loopVariables,
          depth: context.depth,
          path: [...context.path],
          markdown: [...context.markdown],
          apiKey: context.apiKey,
          workspaceId: context.workspaceId,
        });

        // 直接处理 content 作为文档
        const contentDoc: DocNode = {
          type: "doc",
          content: cloneDeep(node.content),
        };

        // 处理文档
        await processor.processNode(contentDoc);

        // 检查处理器是否停止
        if (processor.isProcessingStopped()) {
          state.lastExecutedIteration = i - 1;
          return;
        }

        // 保存这次迭代的结果
        state.results.push({
          iteration: i,
          variables: new Map(processor.getContext().variables),
          markdown: [...processor.getContext().markdown],
        });

        state.executedIterations.add(i);
        state.lastExecutedIteration = i;

        // 更新主上下文的变量
        for (const [key, value] of processor.getContext().variables) {
          context.variables.set(key, value);
        }
      } catch (error) {
        console.error(`Error in loop iteration ${i}:`, error);
        throw error;
      }
    }

    state.completed = state.executedIterations.size === count;
  }

  private async processMatchLoop(node: DocNode, context: ProcessingContext): Promise<void> {
    const attrs = node.attrs as LoopAttrs;
    const state = node._state!.result as LoopState;
    const matchAttrs = attrs.expression?.match;

    if (!matchAttrs) return;

    let iteration = 0;
    const maxIterations = Number.parseInt("10", 10);
    let randomNumber = 0;
    // todo 随机数生成暂时不处理
    while (iteration < maxIterations) {
      try {
        // 生成 1-100 的随机数
        randomNumber = Math.floor(Math.random() * 100) + 1;

        // 设置随机数变量
        context.variables.set("generatedNumber", {
          id: "generatedNumber",
          type: "number",
          value: randomNumber,
        });

        // 设置比较结果变量
        const isGreaterThan75 = randomNumber > 75;
        context.variables.set("comparisonResult", {
          id: "comparisonResult",
          type: "string",
          value: isGreaterThan75.toString(),
        });

        // 获取比较值
        const firstValue = await this.resolveExpressionValue(matchAttrs.firstValue, context.variables);
        const secondValue = await this.resolveExpressionValue(matchAttrs.secondValue, context.variables);

        // 转换为字符串并应用转换
        let compareStr1 = String(firstValue || "");
        let compareStr2 = String(secondValue || "");

        if (matchAttrs.ignoreCase) {
          compareStr1 = compareStr1.toLowerCase();
          compareStr2 = compareStr2.toLowerCase();
        }

        if (matchAttrs.ignoreWhitespace) {
          compareStr1 = compareStr1.replace(/\s+/g, "");
          compareStr2 = compareStr2.replace(/\s+/g, "");
        }

        if (matchAttrs.ignoreSymbols) {
          compareStr1 = compareStr1.replace(/[^\w\s]/g, "");
          compareStr2 = compareStr2.replace(/[^\w\s]/g, "");
        }

        // 处理当前迭代
        const loopVariables = new Map(context.variables);
        loopVariables.set(attrs.id, {
          id: attrs.id,
          type: "loop",
          value: {
            count: iteration + 1,
            currentNumber: randomNumber,
            comparisonResult: isGreaterThan75,
          },
        });

        const isMatch = compareStr1 === compareStr2;
        if (isMatch) {
          break;
        }

        // 处理迭代并检查结果
        const iterationResult = await this.processLoopIteration(node, context, state, iteration, loopVariables);

        // 检查是否需要继续循环

        if (iterationResult.stopped) {
          state.completed = true;
          break;
        }

        iteration++;
      } catch (error) {
        console.error(`Error in match loop iteration ${iteration}:`, error);
        throw error;
      }
    }

    // 如果达到最大迭代次数，也标记为完成
    if (iteration >= maxIterations) {
      state.completed = true;
    }
  }

  private async processContainsLoop(node: DocNode, context: ProcessingContext): Promise<void> {
    const attrs = node.attrs as LoopAttrs;
    const state = node._state!.result as LoopState;
    const containsAttrs = attrs.expression?.contains;

    if (!containsAttrs) return;

    let iteration = 0;
    let currentNumber = 1; // 从1开始递增
    const maxIterations = Number.parseInt("10", 10);
    let numberSequence = ""; // 存储数字序列和比较结果

    while (iteration < maxIterations) {
      try {
        // 设置当前数字
        context.variables.set("currentNumber", {
          id: "currentNumber",
          type: "number",
          value: currentNumber,
        });

        // 检查是否大于75
        const isGreaterThan75 = currentNumber > 75;

        // 更新数字序列和比较结果
        numberSequence = isGreaterThan75.toString();
        context.variables.set("numberSequence", {
          id: "numberSequence",
          type: "string",
          value: numberSequence,
        });

        // 获取比较值
        const value = await this.resolveExpressionValue(containsAttrs.value, context.variables);
        const searchValue = await this.resolveExpressionValue(containsAttrs.searchValue, context.variables);

        let mainStr = String(value || "");
        let searchStr = String(searchValue || "");

        if (containsAttrs.ignoreCase) {
          mainStr = mainStr.toLowerCase();
          searchStr = searchStr.toLowerCase();
        }

        if (containsAttrs.ignoreWhitespace) {
          mainStr = mainStr.replace(/\s+/g, "");
          searchStr = searchStr.replace(/\s+/g, "");
        }

        if (containsAttrs.ignoreSymbols) {
          mainStr = mainStr.replace(/[^\w\s]/g, "");
          searchStr = searchStr.replace(/[^\w\s]/g, "");
        }

        // 处理当前迭代
        const loopVariables = new Map(context.variables);
        loopVariables.set(attrs.id, {
          id: attrs.id,
          type: "loop",
          value: {
            count: iteration + 1,
            currentNumber: currentNumber,
            isGreaterThan75: isGreaterThan75,
          },
        });

        // 处理迭代并检查结果
        const iterationResult = await this.processLoopIteration(node, context, state, iteration, loopVariables);

        // 检查是否找到目标值
        const contains = mainStr.includes(searchStr);
        if (contains || iterationResult.stopped) {
          state.completed = true;
          break;
        }

        iteration++;
        currentNumber++; // 递增数字
      } catch (error) {
        console.error(`Error in contains loop iteration ${iteration}:`, error);
        throw error;
      }
    }

    // 如果达到最大迭代次数，也标记为完成
    if (iteration >= maxIterations) {
      state.completed = true;
    }

    // 发送完成事件
    await this.emitStream(context, "loop_complete", {
      id: attrs.id,
      iterations: iteration,
      completed: state.completed,
      finalNumber: currentNumber,
      foundMatch: context.variables.get("numberSequence")?.value === "true",
    });
  }

  private async processRelativeLoop(node: DocNode, context: ProcessingContext): Promise<void> {
    const attrs = node.attrs as LoopAttrs;
    const state = node._state!.result as LoopState;
    const relativeAttrs = attrs.expression?.relative;

    if (!relativeAttrs) return;

    let iteration = 0;
    let currentNumber = 1; // 从1开始递增
    const maxIterations = Number.parseInt(attrs.count || "100", 10);

    while (iteration < maxIterations) {
      try {
        // 设置当前数字变量
        context.variables.set("currentNumber", {
          id: "currentNumber",
          type: "number",
          value: currentNumber,
        });

        // 获取比较值
        const firstValue = await this.resolveExpressionValue(relativeAttrs.firstValue, context.variables);
        const secondValue = await this.resolveExpressionValue(relativeAttrs.secondValue, context.variables);

        // 执行比较
        let shouldContinue = true;
        switch (relativeAttrs.comparator) {
          case "gt":
            shouldContinue = !(firstValue > secondValue);
            break;
          case "lt":
            shouldContinue = !(firstValue < secondValue);
            break;
          case "gte":
            shouldContinue = !(firstValue >= secondValue);
            break;
          case "lte":
            shouldContinue = !(firstValue <= secondValue);
            break;
          case "eq":
            shouldContinue = !(firstValue === secondValue);
            break;
        }

        // 处理当前迭代
        const loopVariables = new Map(context.variables);
        loopVariables.set(attrs.id, {
          id: attrs.id,
          type: "loop",
          value: {
            count: iteration + 1,
            currentNumber: currentNumber,
            comparisonResult: !shouldContinue,
          },
        });

        // 处理迭代并检查结果
        const iterationResult = await this.processLoopIteration(node, context, state, iteration, loopVariables);

        // 检查是否需要继续循环
        if (!shouldContinue || iterationResult.stopped) {
          state.completed = true;
          break;
        }

        iteration++;
        currentNumber++; // 递增数字
      } catch (error) {
        console.error(`Error in relative loop iteration ${iteration}:`, error);
        throw error;
      }
    }

    // 如果达到最大迭代次数，也标记为完成
    if (iteration >= maxIterations) {
      state.completed = true;
    }
  }

  private async processListLoop(node: DocNode, context: ProcessingContext): Promise<void> {
    const attrs = node.attrs as LoopAttrs;
    const state = node._state!.result as LoopState;
    const list = await this.resolveExpressionValue(attrs.list, context.variables);
    for (let i = 0; i < list.length; i++) {
      if (state.executedIterations.has(i)) continue;

      const loopVariables = new Map(context.variables);
      loopVariables.set(attrs.id, {
        id: attrs.id,
        type: "loop",
        value: {
          count: i + 1,
          item: list[i],
        },
      });

      await this.processLoopIteration(node, context, state, i, loopVariables);
      if (state.lastExecutedIteration !== i) break;
    }

    state.completed = state.executedIterations.size === list.length;
  }

  /**
   * 处理单次循环迭代
   */
  private async processLoopIteration(
    node: DocNode,
    context: ProcessingContext,
    state: LoopState,
    iteration: number,
    loopVariables: Map<string, Variable>,
  ): Promise<{ stopped: boolean }> {
    const contentDoc: DocNode = {
      type: "doc",
      content: cloneDeep(node.content),
    };

    // 创建新的文档处理器
    const iterationProcessor = new DocumentProcessor(context.onStop, context.onStreamResponse, {
      variables: loopVariables,
      depth: context.depth,
      path: [...context.path],
      markdown: [...context.markdown],
      apiKey: context.apiKey,
      workspaceId: context.workspaceId,
    });

    // 处理文档
    await iterationProcessor.processNode(contentDoc);

    // 保存迭代结果
    state.results.push({
      iteration,
      variables: new Map(iterationProcessor.getContext().variables),
      markdown: [...iterationProcessor.getContext().markdown],
    });

    state.executedIterations.add(iteration);
    state.lastExecutedIteration = iteration;

    // 更新主上下文的变量
    for (const [key, value] of iterationProcessor.getContext().variables) {
      context.variables.set(key, value);
    }

    // 发送迭代完成事件
    await this.emitStream(context, "loop_iteration", {
      id: node.attrs.id,
      iteration,
      count: state.results.length,
      completed: true,
      result: state.results[state.results.length - 1],
    });

    // 返回处理器状态
    return {
      stopped: iterationProcessor.isProcessingStopped(),
    };
  }

  private async resolveExpressionValue(expr: ExpressionValue, variables: Map<string, Variable>): Promise<any> {
    if (!expr) return undefined;

    if (expr.type === "literal") {
      return expr.value;
    }

    if (expr.type === "variable") {
      const parts = expr.value.split(".");
      let value = variables.get(parts[0])?.value;

      for (let i = 1; i < parts.length; i++) {
        if (value && typeof value === "object") {
          value = value[parts[i]];
        } else {
          return undefined;
        }
      }

      return value;
    }

    return undefined;
  }

  async after(node: DocNode, context: ProcessingContext): Promise<void> {
    const attrs = node.attrs as LoopAttrs;
    const state = node._state!.result as LoopState;

    const allMarkdown = state.results.flatMap((result) => result.markdown);
    context.markdown.push(...allMarkdown);

    await this.emitStream(context, "loop_complete", {
      id: attrs.id,
      iterations: state.results.length,
      completed: state.completed,
      executedIterations: Array.from(state.executedIterations),
      lastExecutedIteration: state.lastExecutedIteration,
      results: state.results,
    });
  }

  async toMarkdown(node: DocNode, context: ProcessingContext): Promise<string> {
    const state = node._state?.result as LoopState;
    if (state?.results) {
      return state.results.flatMap((result) => result.markdown).join("\n");
    }
    return "";
  }
}
