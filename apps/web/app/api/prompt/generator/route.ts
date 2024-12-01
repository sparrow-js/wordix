import { auth } from "@/lib/auth";
import type { Message } from "@/workflow/ai/providers/base";
import { ServiceFactory } from "@/workflow/ai/services/service-factory";
import { META_PROMPT } from "@/workflow/tools/promptGenerationTool/const";
import { getWorkflowResponseWrite } from "@/workflow/utils/utils";
import type { NextApiResponse } from "next";
import { NextResponse } from "next/server";
export async function POST(req: Request, res: NextApiResponse) {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const responseStream = new TransformStream();
    const writer = responseStream.writable.getWriter();
    let { prompt, imageUrl } = await req.json();
    if (!prompt) {
      prompt =
        "根据图片信息生成prompt，prompt的内容是提取图片描述网站信息，使用技术为nextjs、shadcn、tailwindcss、typescript、react";
    }

    const workflowResponseWrite = getWorkflowResponseWrite({
      res,
      detail: true,
      write: writer,
      streamResponse: true,
    });

    //

    workflowResponseWrite({
      event: "workflow_started",
      data: "",
      stream: true,
    });

    const aiService = ServiceFactory.getInstance().getAIService();
    const messages: Message[] = [
      {
        role: "system",
        content: META_PROMPT,
      },
      {
        role: "user",
        content: [
          {
            type: "text" as const,
            text: prompt,
          },
          imageUrl
            ? {
                type: "image_url" as const,
                image_url: imageUrl,
              }
            : null,
        ].filter(Boolean),
      },
    ];

    aiService
      .streamChat(
        "openai",
        messages,
        async (text) => {
          workflowResponseWrite({
            event: "message",
            data: text,
            stream: true,
          });
        },
        "gpt-4o",
      )
      .then(async () => {
        workflowResponseWrite({
          event: "workflow_finished",
          data: "",
          stream: true,
        });
        await writer.close();
        writer.releaseLock();
      });

    return new Response(responseStream.readable);
  } catch (error) {
    console.error("Error generating prompt:", error);
    return NextResponse.json({ error: "Failed to generate prompt" }, { status: 500 });
  }
}
