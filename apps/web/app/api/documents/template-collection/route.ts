import prisma from "@/backend/prisma";
import { auth } from "@/lib/auth";
import { respData, respErr } from "@/lib/resp";

export async function POST(request: Request) {
  const session = await auth();

  if (!session?.user) {
    return respErr("Unauthorized");
  }

  try {
    const body = await request.json();
    const { collections } = body;

    const documents = await prisma.document.findMany({
      where: {
        collectionId: {
          in: collections.map((c: any) => c.id),
        },
      },
      orderBy: {
        createdAt: "desc",
      },
      select: {
        id: true,
        title: true,
        collectionId: true,
        bannerImage: true,
      },
    });

    // Group documents by collectionId into a 2D array matching collections order
    const documentsByCollection = collections.map((collection: any) => {
      return {
        list: documents.filter((doc) => doc.collectionId === collection.id),
        title: collection.title,
        id: collection.id,
      };
    });

    return respData(documentsByCollection);
  } catch (error: any) {
    return respErr(error.message || "Failed to fetch templates");
  }
}
