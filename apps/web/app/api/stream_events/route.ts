import { createRun } from "@/service/action/run";
import { DocumentProcessor } from "@/workflow/processors/DocumentProcessor";
import { getWorkflowResponseWrite } from "@/workflow/utils/utils";
import type { NextApiResponse } from "next";

export async function POST(request: Request, res: NextApiResponse) {
  const params = await request.json();
  console.log("***************", params.input);

  const {
    inputs,
    documentFlow,
    documentId,
    collectionId,
    messages = [],
    variables = {},

    appName,
    appId,
    chatConfig,
  } = params.input;

  const responseStream = new TransformStream();
  const writer = responseStream.writable.getWriter();

  const workflowResponseWrite = getWorkflowResponseWrite({
    res,
    detail: true,
    write: writer,
    streamResponse: true,
  });
  const processor = new DocumentProcessor(
    // onStop 回调
    async (node) => {},
    workflowResponseWrite,
  );

  const startTime = new Date();

  processor.processNode(documentFlow, inputs).then(async () => {
    const context = processor.getContext();
    const endTime = new Date();
    const duration = endTime.getTime() - startTime.getTime();
    await createRun(documentId, collectionId, {
      metadata: {
        markdownOutput: context.markdownOutput,
      },
      duration,
    });
    await writer.close();
    writer.releaseLock();
  });

  return new Response(responseStream.readable);
}
