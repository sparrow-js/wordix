import { respData } from "@/lib/resp";

export async function POST(request: Request) {
    const body = await request.json();
    const { id } = body;
    console.log("id", id);

    const collection = await prisma.collection.findUnique({
        where: {
            id
        }
    });

    return respData(collection);
}