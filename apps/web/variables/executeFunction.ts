// @ts-nocheck
import { stringifyError } from "@/variables/lib/stringifyError";
import { isDefined } from "@/variables/lib/utils";
import ivm from "isolated-vm";
import { parseTransferrableValue } from "./codeRunners";
import { extractVariablesFromText } from "./extractVariablesFromText";
import { parseGuessedValueType } from "./parseGuessedValueType";
import { parseVariables } from "./parseVariables";
import type { Variable } from "./schemas";

const defaultTimeout = 10 * 1000;

type Props = {
  variables: Variable[];
  body: string;
  args?: Record<string, unknown>;
  onStreamResponse?: ({ event, data, stream }: any) => void;
};

export const executeFunction = async ({ variables, body, onStreamResponse, args: initialArgs }: Props) => {
  const parsedBody = parseVariables(variables, {
    fieldToParse: "id",
  })(body);
  const args = (
    extractVariablesFromText(variables)(body).map((variable) => ({
      id: variable.id,
      value: parseGuessedValueType(variable.value),
    })) as { id: string; value: unknown }[]
  ).concat(initialArgs || []);

  const updatedVariables: Record<string, any> = {};

  const setVariable = (key: string, value: any) => {
    updatedVariables[key] = value;
  };


  const isolate = new ivm.Isolate();
  const context = isolate.createContextSync();
  const jail = context.global;
  jail.setSync("global", jail.derefInto());
  const logs: string[] = [];

  context.evalClosure(
    "globalThis.setVariable = (...args) => $0.apply(undefined, args, { arguments: { copy: true }, promise: true, result: { copy: true, promise: true } })",
    [new ivm.Reference(setVariable)],
  );
  context.evalClosure(
    "globalThis.console = { log: (...args) => $0.apply(undefined, args, { arguments: { copy: true } }) }",
    [
      new ivm.Reference((...args) => {
        const logMessage = args.map((arg) => (typeof arg === "object" ? JSON.stringify(arg) : String(arg))).join(" ");
        onStreamResponse({
          event: "message",
          data: `${logMessage}\n`,
          stream: true,
        });
        logs.push(logMessage);
      }),
    ],
  );
  context.evalClosure(
    "globalThis.fetch = (...args) => $0.apply(undefined, args, { arguments: { copy: true }, promise: true, result: { copy: true, promise: true } })",
    [
      new ivm.Reference(async (...args: any[]) => {
        // @ts-ignore
        const response = await fetch(...args);
        return response.text();
      }),
    ],
  );
  args.forEach(({ id, value }) => {
    jail.setSync(id, parseTransferrableValue(value));
  });
  const run = (code: string) =>
    context.evalClosure(
      `return (async function() {
		const AsyncFunction = async function () {}.constructor;
		return new AsyncFunction($0)();
	}())`,
      [code],
      { result: { copy: true, promise: true }, timeout: defaultTimeout },
    );

  try {
    const output: unknown = await run(parsedBody);

    return {
      output,
      logs,
      newVariables: Object.entries(updatedVariables)
        .map(([name, value]) => {
          const existingVariable = variables.find((v) => v.name === name);
          if (!existingVariable) return;
          return {
            id: existingVariable.id,
            name: existingVariable.name,
            value,
          };
        })
        .filter(isDefined),
    };
  } catch (e) {
    console.log("Error while executing script");
    console.error(e);

    const error = stringifyError(e);

    return {
      error,
      output: error,
      logs,
    };
  }
};
