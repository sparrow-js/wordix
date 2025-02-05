import { auth } from "@/lib/auth";
import { respErr } from "@/lib/resp";
import { getToken } from "@/service/action/oneapi";
import type { Message } from "@/workflow/ai/providers/base";
import { ServiceFactory } from "@/workflow/ai/services/service-factory";
import { META_PROMPT } from "./const";

import { getProviderFromModel } from "@/workflow/ai/config/model-configs";
export const maxDuration = 60;

export async function POST(request: Request) {
  const session = await auth();

  if (!session?.user) {
    return respErr("Unauthorized");
  }

  const body = await request.json();
  const { text, model, workspaceId } = body;

  if (!text) {
    return respErr("Text is required");
  }

  try {
    let apiKey = "";

    const token = await getToken(workspaceId);

    if (token) {
      const { remain_quota, key } = token;
      if (remain_quota < 10) {
        return new Response("No quota", { status: 401 });
      }
      apiKey = `sk-${key}`;
    }

    const service = new ServiceFactory(apiKey);
    const aiService = service.getAIService();
    let messages: Message[];
    if (model === "gpt-4o") {
      messages = [
        {
          role: "system",
          content: META_PROMPT,
        },
        {
          role: "user",
          content: text,
        },
      ];
    }

    if (model === "gemini-2.0-flash-thinking-exp-1219" || model === "gemini-2.0-flash-exp") {
      messages = [
        {
          role: "user",
          content: text,
        },
      ];
    }

    if (model === "deepseek/deepseek-r1") {
      messages = [
        {
          role: "user",
          content: text,
        },
      ];
    }

    const encoder = new TextEncoder();

    function noticeHost(socket: any, text: string) {
      if (socket.enqueue) {
        socket.enqueue(encoder.encode(text));
      }
    }

    const stream = new ReadableStream({
      start(controller) {
        aiService
          .streamChat(
            getProviderFromModel(model),
            messages,
            async (text) => {
              noticeHost(controller, text);
            },
            model,
          )
          .finally(() => {
            controller.close();
          });
      },
    });

    return new Response(stream, {
      headers: {
        "Content-Type": "text/event-stream",
        "Cache-Control": "no-cache",
        Connection: "keep-alive",
      },
    });
  } catch (error: any) {
    return respErr(error.message || "Something went wrong");
  }
}
