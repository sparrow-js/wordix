import type { SystemPluginTemplateItemType } from "@/global/core/workflow/type";

export type SystemPluginResponseType = Promise<Record<string, any>>;

declare global {
  var systemPlugins: SystemPluginTemplateItemType[];
  var systemPluginCb: Record<string, (e: any) => SystemPluginResponseType>;
}
