import { set } from "lodash";
// @ts-nocheck
import { executeFunction } from "../../variables/executeFunction";
import type { DocNode, ProcessingContext } from "../types/DocNode";
import { BaseHandler } from "./BaseHandler";

interface CodeExecutorAttrs {
  id: string;
  logs: string;
  error: string;
  label?: string;
  state: string;
  language: string;
  includeOutput: string;
  continueOnError: string;
}

interface CodeBlockAttrs {
  language: string;
}

export class CodeHandler extends BaseHandler {
  async before(node: DocNode, context: ProcessingContext): Promise<void> {
    if (!node._state) {
      node._state = {
        executed: false,
        timestamp: Date.now(),
        logs: [],
      };
    }
  }

  private async handleCodeBlock(
    node: DocNode,
    context: ProcessingContext,
  ): Promise<{ codeText: string; variables: Record<string, any> }> {
    // First pass: Handle mentions
    let codeText = "";
    const variables = {};
    if (node.content) {
      for (const content of node.content) {
        if (content.type === "text") {
          codeText += content.text || "";
        } else if (content.type === "mention") {
          let variablePath = content.attrs?.referenceId;
          if (content.attrs?.path) {
            variablePath += content.attrs?.path;
          }
          set(variables, variablePath, this.resolveValue(content, context));

          codeText += `variables['${variablePath}']`;
        }
      }
    }

    // Second pass: Handle remaining UUID patterns
    const uuidPattern = /(?:\${\s*)([\da-f]{8}-[\da-f]{4}-[\da-f]{4}-[\da-f]{4}-[\da-f]{12})(?:\.([\w.]+))?\s*}?/gi;
    codeText = codeText.replace(uuidPattern, (match, referenceId, path) => {
      const variable = context.variables.get(referenceId);
      if (!variable) {
        return match;
      }

      const value = path ? this.getNestedValue(variable.value, path) : variable.value;
      return value !== undefined ? String(value) : match;
    });

    return {
      codeText,
      variables,
    };
  }

  private resolveValue(node: DocNode, context: ProcessingContext): any {
    const { referenceId, path } = node.attrs;

    if (!referenceId) {
      return undefined;
    }

    const variable = context.variables.get(referenceId);

    if (!variable) {
      return undefined;
    }

    if (path) {
      return this.getNestedValue(variable.value, path);
    }

    return variable.value;
  }

  private getNestedValue(obj: any, path: string): any {
    const cleanPath = path.startsWith(".") ? path.slice(1) : path;
    const parts = cleanPath.split(".");

    let result = obj;
    for (const part of parts) {
      if (result == null || typeof result !== "object") {
        return undefined;
      }
      result = result[part];
    }

    return result;
  }

  async handle(node: DocNode, context: ProcessingContext): Promise<void> {
    node._state.executed = true;
    let variablesObject = {};

    if (node.type === "codeExecutor") {
      const attrs = node.attrs as CodeExecutorAttrs;
      let codeToExecute = "";

      // Process nested code blocks
      if (node.content) {
        for (const block of node.content) {
          if (block.type === "codeBlock") {
            const { codeText, variables } = await this.handleCodeBlock(block, context);
            variablesObject = {
              ...variablesObject,
              ...variables,
            };
            codeToExecute += codeText;
          }
        }
      }

      if (codeToExecute) {
        codeToExecute = `const variables = ${JSON.stringify(variablesObject)};\n${codeToExecute}`;

        try {
          const result = await executeFunction({
            variables: [],
            body: codeToExecute,
            onStreamResponse: context.onStreamResponse,
          });

          if (result.logs) {
            node._state.logs = result.logs;
          }

          if (result.error) {
            node._state.error = result.error;
            if (!attrs.continueOnError) {
              throw new Error(result.error);
            }
          } else {
            node._state.result = result.output;
          }

          // Update variables if execution returned new values
          context.variables.set(node.attrs.id, {
            id: node.attrs.id,
            type: "codeExecutor",
            value: {
              output: result.output || "",
            },
          });
          // Emit execution result
          await this.emitStream(context, "code_execution", {
            id: attrs.id,
            output: node._state.result,
            error: node._state.error,
            logs: node._state.logs,
          });

          // If execution failed and continueOnError is false, throw the error
          if (node._state.error && attrs.continueOnError === "false") {
            throw new Error(node._state.error);
          }
        } catch (error) {
          console.error("Error executing code:", error);
          node._state.result = { error: String(error) };
          await this.emitStream(context, "code_execution", {
            id: attrs.id,
            error: String(error),
            logs: node._state.logs,
          });

          if (attrs.continueOnError === "false") {
            throw error;
          }
        }
      }
    }

    const markdown = await this.toMarkdown(node, context);
    context.markdown.push(markdown);
    await this.emitStream(context, "code", markdown);
  }

  async toMarkdown(node: DocNode, context: ProcessingContext): Promise<string> {
    let markdown = "";

    if (node.type === "codeExecutor") {
      const attrs = node.attrs as CodeExecutorAttrs;

      // Add label if present
      if (attrs.label) {
        markdown += `### ${attrs.label}\n\n`;
      }

      // Process nested code blocks
      if (node.content) {
        for (const block of node.content) {
          if (block.type === "codeBlock") {
            const blockAttrs = block.attrs as CodeBlockAttrs;
            markdown += `\`\`\`${blockAttrs.language}\n`;
            markdown += await this.handleCodeBlock(block, context);
            if (!markdown.endsWith("\n")) {
              markdown += "\n";
            }
            markdown += "```\n";
          }
        }
      }

      // Add execution results if includeOutput is true
      if (attrs.includeOutput === "true" && node._state?.result) {
        const result = node._state.result;
        if (result.error) {
          markdown += `\n\`\`\`error\n${result.error}\n\`\`\`\n`;
        } else if (result.output !== undefined) {
          markdown += `\n\`\`\`output\n${String(result.output)}\n\`\`\`\n`;
        }

        // Add logs if present
        if (node._state.logs && node._state.logs.length > 0) {
          markdown += `\n\`\`\`logs\n${node._state.logs.join("\n")}\n\`\`\`\n`;
        }
      }
    }

    return markdown;
  }
}
