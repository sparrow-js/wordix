import type { ParentIdType } from "../../common/parentFolder/type";
import type { AppPermission } from "../../support/permission/app/controller";
import type { PermissionSchemaType } from "../../support/permission/type";
import type { DatasetSearchModeEnum } from "../dataset/constants";
import type { SelectedDatasetType } from "../workflow/api";
import { NodeInputKeyEnum, type VariableInputEnum, type WorkflowIOValueTypeEnum } from "../workflow/constants";
import type { StoreEdgeItemType } from "../workflow/type/edge";
import type { FlowNodeTemplateType, StoreNodeItemType } from "../workflow/type/node";
import type { AppTypeEnum } from "./constants";

export type AppSchema = {
  _id: string;
  parentId?: ParentIdType;
  teamId: string;
  tmbId: string;
  type: AppTypeEnum;
  version?: "v1" | "v2";

  name: string;
  avatar: string;
  intro: string;

  updateTime: Date;

  modules: StoreNodeItemType[];
  edges: StoreEdgeItemType[];
  pluginData?: {
    nodeVersion?: string;
    pluginUniId?: string; // plugin unique id(plugin name)
    apiSchemaStr?: string; // api schema string
    customHeaders?: string;
  };

  // App system config
  chatConfig: AppChatConfigType;
  scheduledTriggerConfig?: AppScheduledTriggerConfigType | null;
  scheduledTriggerNextTime?: Date;

  inited?: boolean;
  teamTags: string[];
} & PermissionSchemaType;

export type AppListItemType = {
  _id: string;
  tmbId: string;
  name: string;
  avatar: string;
  intro: string;
  type: AppTypeEnum;
  updateTime: Date;
  pluginData?: AppSchema["pluginData"];
  permission: AppPermission;
} & PermissionSchemaType;

export type AppDetailType = AppSchema & {
  permission: AppPermission;
};

export type AppSimpleEditFormType = {
  // templateId: string;
  aiSettings: {
    model: string;
    systemPrompt?: string | undefined;
    temperature: number;
    maxToken: number;
    isResponseAnswerText: boolean;
    maxHistories: number;
  };
  dataset: {
    datasets: SelectedDatasetType;
    searchMode: `${DatasetSearchModeEnum}`;
    similarity?: number;
    limit?: number;
    usingReRank?: boolean;
    datasetSearchUsingExtensionQuery?: boolean;
    datasetSearchExtensionModel?: string;
    datasetSearchExtensionBg?: string;
  };
  selectedTools: FlowNodeTemplateType[];
  chatConfig: AppChatConfigType;
};

/* app chat config type */
export type AppChatConfigType = {
  welcomeText?: string;
  variables?: VariableItemType[];
  questionGuide?: boolean;
  ttsConfig?: AppTTSConfigType;
  whisperConfig?: AppWhisperConfigType;
  scheduledTriggerConfig?: AppScheduledTriggerConfigType;
  chatInputGuide?: ChatInputGuideConfigType;
  fileSelectConfig?: AppFileSelectConfigType;

  // plugin
  instruction?: string;
};
export type SettingAIDataType = {
  model: string;
  temperature: number;
  maxToken: number;
  isResponseAnswerText?: boolean;
  maxHistories?: number;
  [NodeInputKeyEnum.aiChatVision]?: boolean; // Is open vision mode
};

// variable
export type VariableItemType = {
  id: string;
  key: string;
  label: string;
  type: `${VariableInputEnum}`;
  required: boolean;
  maxLen: number;
  enums: { value: string }[];
  valueType: WorkflowIOValueTypeEnum;
};
// tts
export type AppTTSConfigType = {
  type: "none" | "web" | "model";
  model?: string;
  voice?: string;
  speed?: number;
};
// whisper
export type AppWhisperConfigType = {
  open: boolean;
  autoSend: boolean;
  autoTTSResponse: boolean;
};
// question guide text
export type ChatInputGuideConfigType = {
  open: boolean;
  customUrl: string;
};
// interval timer
export type AppScheduledTriggerConfigType = {
  cronString: string;
  timezone: string;
  defaultPrompt: string;
};
// File
export type AppFileSelectConfigType = {
  canSelectFile: boolean;
  canSelectImg: boolean;
  maxFiles: number;
};
