import { auth } from "@/lib/auth";
import { chargeToken } from "@/lib/charge-token";
import { respErr } from "@/lib/resp";

export async function POST(request: Request) {
  const session = await auth();

  if (!session?.user) {
    return respErr("Unauthorized");
  }

  const body = await request.json();
  const { amount } = body;

  if (!amount) {
    return respErr("Amount is required");
  }

  try {
    await chargeToken(session.user.email, amount);
    return new Response("Success");
  } catch (error) {
    return respErr("Failed to charge token");
  }
}
