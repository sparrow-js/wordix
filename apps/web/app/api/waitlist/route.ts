import prisma from "@/backend/prisma";
import { NextResponse } from "next/server";
import { z } from "zod";

const schema = z.object({
  email: z.string().email(),
  name: z.string().optional(),
  reason: z.string().optional(),
});

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { email, name, reason } = schema.parse(body);

    // Check if email already exists
    const existingEntry = await prisma.waitlist.findUnique({
      where: { email },
    });

    if (existingEntry) {
      return NextResponse.json({ error: "Email already registered" }, { status: 409 });
    }

    const waitlistEntry = await prisma.waitlist.create({
      data: {
        email,
        name,
        reason,
      },
    });

    return NextResponse.json(waitlistEntry, { status: 201 });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json({ error: error.errors }, { status: 400 });
    }
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
