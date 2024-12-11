import { auth } from "@/lib/auth";
import { respErr } from "@/lib/resp";
import type { Message } from "@/workflow/ai/providers/base";
import { ServiceFactory } from "@/workflow/ai/services/service-factory";

export async function POST(request: Request) {
  const session = await auth();

  if (!session?.user) {
    return respErr("Unauthorized");
  }

  const body = await request.json();
  const { text, modelName } = body;

  if (!text) {
    return respErr("Text is required");
  }

  try {
    const aiService = ServiceFactory.getInstance().getAIService();

    const messages: Message[] = [
      {
        role: "system",
        content:
          "You are a document auto-completion assistant, providing you with the previous text and completion content. Content is limited to 10 words",
      },
      {
        role: "user",
        content: text,
      },
    ];
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
            "openai",
            messages,
            async (text) => {
              noticeHost(controller, text);
            },
            "gpt-4o",
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
