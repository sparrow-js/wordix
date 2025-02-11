import { getToken } from "@/service/action/oneapi";
import { createRun } from "@/service/action/run";
import { DocumentProcessor } from "@/workflow/processors/DocumentProcessor";
import { getWorkflowResponseWrite } from "@/workflow/utils/utils";
import type { NextApiResponse } from "next";
export const maxDuration = 300;
export const dynamic = "force-dynamic";

import { auth } from "@/lib/auth";
export async function POST(request: Request, res: NextApiResponse) {
  const params = await request.json();

  const session = await auth();

  if (!session?.user) {
    return new Response("Unauthorized", { status: 401 });
  }

  const {
    inputs,
    documentFlow,
    documentId,
    collectionId,
    workspaceId,
    messages = [],
    variables = {},

    appName,
    appId,
    chatConfig,
  } = params;

  const responseStream = new TransformStream();
  const writer = responseStream.writable.getWriter();

  const workflowResponseWrite = getWorkflowResponseWrite({
    res,
    detail: true,
    write: writer,
    streamResponse: true,
  });

  let apiKey = "";

  const token = await getToken(workspaceId);

  if (token) {
    const { remain_quota, key } = token;
    if (remain_quota < 10) {
      workflowResponseWrite({
        event: "error",
        data: "No quota",
      });
      return new Response(
        JSON.stringify({
          code: "no_quota",
          message: "No quota",
        }),
        { status: 401 },
      );
    }
    apiKey = `sk-${key}`;
  }

  const processor = new DocumentProcessor(
    // onStop 回调
    async (node) => {},
    workflowResponseWrite,
    {
      // disableDocumentOutput: true,
      apiKey,
      workspaceId,
    },
  );

  const startTime = new Date();

  processor
    .processNode(documentFlow, inputs)
    .then(async () => {
      const context = processor.getContext();
      const endTime = new Date();
      const duration = endTime.getTime() - startTime.getTime();
      await createRun(documentId, collectionId, {
        metadata: {
          markdownOutput: context.markdownOutput,
        },
        duration,
        from: "test",
      });
      await writer.close();
      // writer.releaseLock();
    })
    .catch(async (e) => {
      await writer.close();
      // writer.releaseLock();
    });

  request.signal.onabort = async () => {
    console.log("abort");
    processor.abort();
    await writer.ready;
    await writer.close();
  };

  return new Response(responseStream.readable);
}
