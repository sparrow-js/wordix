import { auth } from "@/lib/auth";
import { respData } from "@/lib/resp";
import { deleteCollection } from "@/service/action/collection";

export async function POST(request: Request) {
  const body = await request.json();
  const { id } = body;
  const session = await auth();

  if (!session?.user) {
    return new Response("Unauthorized", { status: 401 });
  }

  const collection = await deleteCollection(id, session.user.id);

  return respData(collection);
}
