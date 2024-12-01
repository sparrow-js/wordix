import { isDefined } from "@/variables/lib/utils";
import type { Variable, VariableWithValue } from "./schemas";

export const filterNonSessionVariablesWithValues = (variables: Variable[]): VariableWithValue[] =>
  variables.filter((variable) => isDefined(variable.value) && !variable.isSessionVariable) as VariableWithValue[];
