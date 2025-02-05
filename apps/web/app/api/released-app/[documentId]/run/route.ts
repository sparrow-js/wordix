import prisma from "@/backend/prisma";
import { respErr } from "@/lib/resp";
import { createRun } from "@/service/action/run";
import { DocumentProcessor } from "@/workflow/processors/DocumentProcessor";
import { getWorkflowResponseWrite } from "@/workflow/utils/utils";
import type { NextApiResponse } from "next";
import { headers } from "next/headers";

async function authenticateByToken(apiToken: string) {
  const apiKey = await prisma.apiKey.findFirst({
    where: { hash: apiToken },
    include: { user: true },
  });

  return apiKey?.user || null;
}

function extractBearerToken(headers: Headers) {
  return headers.get("authorization")?.slice(7);
}

export async function POST(req: Request, { params }: { params: { documentId: string } }, res: NextApiResponse) {
  try {
    const headersList = headers();
    const bearerToken = extractBearerToken(headersList);
    const user = bearerToken ? await authenticateByToken(bearerToken) : null;

    if (!user) {
      return respErr("Not authenticated");
    }

    const { documentId } = params;
    const body = await req.json();
    const { inputs, version } = body;

    const document = await prisma.revision.findFirst({
      where: { documentId: documentId, version: version },
      include: {
        document: {
          include: {
            workspace: true
          }
        }
      }
    });

    const documentFlow = document?.content;
    const documentContent = typeof documentFlow === "string" ? JSON.parse(documentFlow) : documentFlow;

    const inputList = documentContent?.content?.find((node) => node.type === "inputs");

    if (inputList) {
      const updatedInputs = {};
      inputList.content.forEach((input) => {
        updatedInputs[input.attrs.id] = inputs[input.attrs.label];
      });
    }

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
        apiKey: document?.document?.workspace?.oneApiToken,
      },
    );

    const startTime = new Date();

    processor.processNode(documentFlow as any, inputs).then(async () => {
      const context = processor.getContext();
      const endTime = new Date();
      const duration = endTime.getTime() - startTime.getTime();
      await createRun(documentId, undefined, {
        metadata: {
          markdownOutput: context.markdownOutput,
        },
        duration,
      });
      await writer.close();
      writer.releaseLock();
    });

    return new Response(responseStream.readable);
  } catch (error) {
    console.error("Error creating run:", error);
    return respErr("Failed to create run");
  }
}
