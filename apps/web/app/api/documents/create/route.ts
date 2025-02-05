import { auth } from "@/lib/auth";
import { respData } from "@/lib/resp";
import { createDocument } from "@/service/action/document";
import { nanoid } from "nanoid";
import { defaultEditorContent } from "./default-doc";

export async function POST(request: Request) {
  const body = await request.json();
  const { title, collectionId, parentId, workspaceId, bannerImage, content } = body;
  const session = await auth();

  if (!session?.user) {
    return new Response("Unauthorized", { status: 401 });
  }

  const document = await createDocument(
    {
      title,
      urlId: nanoid(10),
      collectionId,
      isWelcome: false,
      collaboratorIds: [],
      content: content ||defaultEditorContent,
      createdById: session.user.id,
      lastModifiedById: session.user.id,
      workspaceId,
      bannerImage,
    },
    parentId,
  );

  return respData(document);
}
