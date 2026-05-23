import { NextRequest } from "next/server";
import { prisma } from "@/lib/prisma";
import { sendContactEmail } from "@/lib/email";
import { auth } from "@/lib/auth";
import { parseBody, contactMessageSchema } from "@/lib/validation";

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
  const { data, error, status } = await parseBody(req, contactMessageSchema);
  if (error) {
    return Response.json({ error }, { status: status || 400 });
  }

  try {
    const [result] = await Promise.all([
      prisma.contactMessage.create({
        data: { name: data!.name, email: data!.email, phone: data!.phone ?? null, message: data!.message },
      }),
      sendContactEmail({ name: data!.name, email: data!.email, phone: data!.phone ?? undefined, message: data!.message }).catch(() => {}),
    ]);

    return Response.json({ success: true }, { status: 201 });
  } catch {
    return Response.json({ error: "Failed to send message" }, { status: 500 });
  }
}
