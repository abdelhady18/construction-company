import { NextRequest } from "next/server";
import { prisma } from "@/lib/prisma";
import { auth } from "@/lib/auth";
import { revalidatePath } from "next/cache";

export async function PUT(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const session = await auth();
  if (!session?.user) {
    return Response.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { id } = await params;
  const body = await req.json();

  const member = await prisma.teamMember.update({
    where: { id },
    data: {
      name: body.name,
      role: body.role,
      imageUrl: body.imageUrl,
      order: body.order,
    },
  });
  revalidatePath("/");
  return Response.json(member);
}

export async function DELETE(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const session = await auth();
  if (!session?.user) {
    return Response.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { id } = await params;
  await prisma.teamMember.delete({ where: { id } });
  revalidatePath("/");
  return Response.json({ success: true });
}
