import prisma from "@/backend/prisma";
import { respData } from "@/lib/resp";
export async function POST(request: Request) {
    const body = await request.json();
    const { id } = body;

    const document = await prisma.document.findUnique({
        where: { id }
    })

    return respData({ document });
}
