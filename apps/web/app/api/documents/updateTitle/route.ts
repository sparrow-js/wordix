import prisma from "@/backend/prisma";
import { respData, respErr } from "@/lib/resp";

export async function POST(request: Request) {
    const body = await request.json();
    const { id, title, content, documentStructure } = body;

    // 首先获取当前文档以获取collectionId
    const currentDoc = await prisma.document.findUnique({
        where: { id },
        select: { collectionId: true }
    });

    if (!currentDoc) {
        return respErr('Document not found');
    }

    // 在事务中同时更新文档和collection
    const document = await prisma.$transaction(async (tx) => {
        // 更新文档
        const updatedDoc = await tx.document.update({
            where: { id },
            data: { title, content },
        });

        // 直接更新 collection 的 documentStructure
        await tx.collection.update({
            where: { id: currentDoc.collectionId },
            data: { documentStructure }
        });

        return updatedDoc;
    });

    return respData(document);
}