import { auth } from "@/lib/auth";
import { respErr } from "@/lib/resp";
import type { Message } from "@/workflow/ai/providers/base";
import { ServiceFactory } from "@/workflow/ai/services/service-factory";
import type {
  // HarmCategory,
  // HarmBlockThreshold,
  Part,
} from "@google/generative-ai";
import { META_PROMPT } from "./const";

import { getProviderFromModel } from "@/workflow/ai/config/model-configs";

export async function POST(request: Request) {
  const session = await auth();

  if (!session?.user) {
    return respErr("Unauthorized");
  }

  const body = await request.json();
  const { text, model } = body;

  if (!text) {
    return respErr("Text is required");
  }

  try {
    const aiService = ServiceFactory.getInstance().getAIService();
    let messages: string | Message[] | Array<string | Part> = "";
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

    if (model === "gemini-2.0-flash-exp") {
      messages = text;
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
