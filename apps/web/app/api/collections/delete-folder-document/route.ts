import { deleteFolderDocument } from "@/service/action/collection";
import { respData } from "@/lib/resp";

export async function POST(request: Request) {
    const body = await request.json();
    const { documentId, collectionId, folderId } = body;


    const data = await deleteFolderDocument(documentId, collectionId, folderId);
    return respData(data);
}