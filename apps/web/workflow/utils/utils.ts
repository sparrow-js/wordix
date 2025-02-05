import { ChatRoleEnum, NodeOutputKeyEnum, WorkflowIOValueTypeEnum } from "./constants";
import type {
  ChatItemType,
  RuntimeEdgeItemType,
  SystemVariablesType,
  WorkflowResponseParams,
  WorkflowResponseWriteOptions,
} from "./types";

export const getWorkflowResponseWrite = ({
  write,
  detail,
  streamResponse,
  id = Math.random().toString(36).slice(2),
}: WorkflowResponseWriteOptions) => {
  return ({ event, data, stream }: WorkflowResponseParams) => {
    const useStreamResponse = stream ?? streamResponse;
    if (!useStreamResponse) return;
    write.write(
      `data: ${JSON.stringify({
        event: event,
        data: data,
        answer: data,
      })} \n\n`,
    );
  };
};

export const filterToolNodeIdByEdges = ({
  nodeId,
  edges,
}: {
  nodeId: string;
  edges: RuntimeEdgeItemType[];
}) => {
  return edges
    .filter((edge) => edge.source === nodeId && edge.targetHandle === NodeOutputKeyEnum.selectedTools)
    .map((edge) => edge.target);
};

export const getHistories = (history?: ChatItemType[] | number, histories: ChatItemType[] = []) => {
  if (!history) return [];

  const systemHistories = histories.filter((item) => item.obj === ChatRoleEnum.System);

  const filterHistories = (() => {
    if (typeof history === "number") return histories.slice(-(history * 2));
    if (Array.isArray(history)) return history;
    return [];
  })();

  return [...systemHistories, ...filterHistories];
};

export const valueTypeFormat = (value: any, type?: WorkflowIOValueTypeEnum) => {
  if (value === undefined) return;

  switch (type) {
    case "string":
      return typeof value !== "object" ? String(value) : JSON.stringify(value);
    case "number":
      return Number(value);
    case "boolean":
      return typeof value === "string" ? value === "true" : Boolean(value);
    case WorkflowIOValueTypeEnum.datasetQuote:
    case WorkflowIOValueTypeEnum.selectDataset:
      try {
        return !Array.isArray(value) ? JSON.parse(value) : value;
      } catch {
        return value;
      }
    default:
      return value;
  }
};

export const removeSystemVariable = (variables: Record<string, any>) => {
  const { appId, chatId, responseChatItemId, histories, cTime, ...rest } = variables;
  return rest;
};

export const filterSystemVariables = (variables: Record<string, any>): SystemVariablesType => {
  return {
    userId: variables.userId,
    appId: variables.appId,
    chatId: variables.chatId,
    responseChatItemId: variables.responseChatItemId,
    histories: variables.histories,
    cTime: variables.cTime,
  };
};

export const formatHttpError = (error: any) => {
  return {
    message: error?.message || "Unknown error",
    data: error?.response?.data,
    name: error?.name,
    method: error?.config?.method,
    code: error?.code,
    status: error?.status,
  };
};
