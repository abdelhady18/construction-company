import { NextRequest } from "next/server";
import { prisma } from "@/lib/prisma";
import { auth } from "@/lib/auth";
import { revalidatePath } from "next/cache";
import { parseBody, teamMemberSchema } from "@/lib/validation";

export async function GET(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const member = await prisma.teamMember.findUnique({ where: { id } });
  if (!member) {
    return Response.json({ error: "Not found" }, { status: 404 });
  }
  return Response.json(member);
}

export async function PUT(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const session = await auth();
  if (!session?.user) {
    return Response.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { id } = await params;

  const { data, error, status } = await parseBody(req, teamMemberSchema);
  if (error) {
    return Response.json({ error }, { status: status || 400 });
  }

  const member = await prisma.teamMember.update({
    where: { id },
    data: {
      name: data!.name,
      role: data!.role,
      imageUrl: data!.imageUrl,
      order: data!.order,
    },
  });
  revalidatePath("/");
  revalidatePath("/admin/team");
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
  revalidatePath("/admin/team");
  return Response.json({ success: true });
}
