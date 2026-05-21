import { NextRequest } from "next/server";
import { prisma } from "@/lib/prisma";
import { auth } from "@/lib/auth";

export async function GET() {
  try {
    const rows = await prisma.siteSetting.findMany();
    return Response.json(
      Object.fromEntries(rows.map((r) => [r.key, r.value]))
    );
  } catch {
    return Response.json({});
  }
}

export async function PUT(req: NextRequest) {
  const session = await auth();
  if (!session?.user) {
    return Response.json({ error: "Unauthorized" }, { status: 401 });
  }

  const body = await req.json();
  const updates = body as Record<string, string>;

  for (const [key, value] of Object.entries(updates)) {
    await prisma.siteSetting.upsert({
      where: { key },
      update: { value },
      create: { key, value },
    });
  }

  return Response.json({ success: true });
}
