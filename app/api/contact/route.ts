import { NextRequest } from "next/server";
import { prisma } from "@/lib/prisma";
import { sendContactEmail } from "@/lib/email";
import { auth } from "@/lib/auth";

export async function GET() {
  const session = await auth();
  if (!session?.user) {
    return Response.json({ error: "Unauthorized" }, { status: 401 });
  }

  const messages = await prisma.contactMessage.findMany({
    orderBy: { createdAt: "desc" },
  });
  return Response.json(messages);
}

export async function POST(req: NextRequest) {
  const body = await req.json();
  const { name, email, phone, message } = body;

  if (!name || !email || !message) {
    return Response.json({ error: "Missing required fields" }, { status: 400 });
  }

  try {
    await prisma.contactMessage.create({
      data: { name, email, phone, message },
    });

    await sendContactEmail({ name, email, phone, message });

    return Response.json({ success: true }, { status: 201 });
  } catch {
    return Response.json({ error: "Failed to send message" }, { status: 500 });
  }
}
