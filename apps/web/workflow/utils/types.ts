import type { ChatRoleEnum } from "./constants";

export interface ChatItemType {
  obj: ChatRoleEnum;
  [key: string]: any;
}

export interface RuntimeEdgeItemType {
  source: string;
  target: string;
  targetHandle: string;
}

export interface SystemVariablesType {
  userId: string;
  appId: string;
  chatId: string;
  responseChatItemId: string;
  histories: ChatItemType[];
  cTime: number;
}

export interface WorkflowResponseWriteOptions {
  res?: any;
  write?: any;
  detail: boolean;
  streamResponse: boolean;
  id?: string;
}

export interface WorkflowResponseParams {
  event: string;
  data: Record<string, any> | string;
  stream?: boolean;
}
