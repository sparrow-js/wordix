import prisma from "@/backend/prisma";
import { createRun } from "@/service/action/run";
import { DocumentProcessor } from "@/workflow/processors/DocumentProcessor";
import { getWorkflowResponseWrite } from "@/workflow/utils/utils";
import type { NextApiResponse } from "next";

export const maxDuration = 300;

export async function POST(request: Request, res: NextApiResponse) {
  const params = await request.json();

  const { inputs, documentFlow, documentId, collectionId } = params;

  // 获取文档对应的工作空间ID
  const document = await prisma.document.findUnique({
    where: { id: documentId },
    include: {
      workspace: true,
    },
  });

  if (!document) {
    throw new Error(`Document not found: ${documentId}`);
  }

  if (!document.workspace) {
    throw new Error(`Document ${document.id} is not associated with any workspace`);
  }

  const workspace = document.workspace;
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
    {
      disableDocumentOutput: true,
      apiKey: workspace.oneApiToken,
    },
  );

  const startTime = new Date();

  const documentInputs = documentFlow?.content.find((node) => node.type === "inputs");

  processor.processNode(documentFlow, inputs).then(async () => {
    const context = processor.getContext();
    const endTime = new Date();
    const duration = endTime.getTime() - startTime.getTime();
    await createRun(documentId, collectionId, {
      metadata: {
        markdownOutput: context.markdownOutput,
      },
      duration,
      inputValues: inputs,
      inputs: documentInputs?.content,
      from: "app",
    });
    await writer.close();
    writer.releaseLock();
  });

  return new Response(responseStream.readable);
}
