import { simpleMarkdownText } from "./markdown";
// import { runWorker } from '@/worker/utils';

import { html2md } from "@/worker/htmlStr2Md/utils";

export enum WorkerNameEnum {
  readFile = "readFile",
  htmlStr2Md = "htmlStr2Md",
  countGptMessagesTokens = "countGptMessagesTokens",
  systemPluginRun = "systemPluginRun",
}
export type ImageType = {
  uuid: string;
  base64: string;
  mime: string;
};
export const htmlToMarkdown = async (html?: string | null) => {
  // const md = await runWorker<{
  //   rawText: string;
  //   imageList: ImageType[];
  // }>(WorkerNameEnum.htmlStr2Md, { html: html || '' });

  const md = html2md(html || "");

  return simpleMarkdownText(md.rawText);
};
