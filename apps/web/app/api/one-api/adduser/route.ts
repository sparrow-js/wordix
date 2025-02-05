import { NextResponse } from "next/server";

export async function POST(req: Request) {
  try {
    const response = await fetch("https://gsmlmasy.cloud.sealos.io/api/user", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: "Bearer 50a17ea4cff4452c84a0e919edc4d09d",
      },
      body: JSON.stringify({
        username: "wordix-local",
        password: "12345qwert",
      }),
    });

    const data = await response.json();

    return NextResponse.json(data);
  } catch (error) {
    console.error("Error adding user:", error);
    return NextResponse.json({ error: "Failed to add user" }, { status: 500 });
  }
}
