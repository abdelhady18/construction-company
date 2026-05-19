import { NextRequest } from "next/server";
import { prisma } from "@/lib/prisma";
import { auth } from "@/lib/auth";

export async function PUT(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const session = await auth();
  if (!session?.user) {
    return Response.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { id } = await params;
  const body = await req.json();

  const service = await prisma.service.update({
    where: { id },
    data: {
      title: body.title,
      description: body.description,
      icon: body.icon,
      imageUrl: body.imageUrl,
      order: body.order,
    },
  });
  return Response.json(service);
}

export async function DELETE(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const session = await auth();
  if (!session?.user) {
    return Response.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { id } = await params;
  await prisma.service.delete({ where: { id } });
  return Response.json({ success: true });
}
