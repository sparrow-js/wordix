import prisma from "@/backend/prisma";
import { respData } from "@/lib/resp";

export async function POST(request: Request) {
    const body = await request.json();
    const { id, ...params } = body;

    const collection = await prisma.collection.update({
        where: { id },
        data: params
    });

    return respData(collection);
}