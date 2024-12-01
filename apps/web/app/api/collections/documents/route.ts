import prisma from "@/backend/prisma";
import { respData } from "@/lib/resp";

export async function POST(request: Request) {
    const body = await request.json();
    const { id } = body;

    const collection = await prisma.collection.findUnique({
        where: {
            id
        }
    });
    console.log("id", id);
    return respData(collection?.documentStructure || []);
}