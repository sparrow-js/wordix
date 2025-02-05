import { auth } from "@/lib/auth";
import { respData } from "@/lib/resp";
import { deleteDocument } from "@/service/action/document";

export async function POST(request: Request) {
  const body = await request.json();
  const { documentId, collectionId } = body;
  const session = await auth();

  if (!session?.user) {
    return new Response("Unauthorized", { status: 401 });
  }

  await deleteDocument(documentId, collectionId);

  return respData({
    message: "删除成功",
  });
}
