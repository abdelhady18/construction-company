import { NextRequest } from "next/server";
import { prisma } from "@/lib/prisma";
import { auth } from "@/lib/auth";
import { revalidatePath } from "next/cache";

export async function GET() {
  const members = await prisma.teamMember.findMany({
    orderBy: { order: "asc" },
  });
  return Response.json(members);
}

export async function POST(req: NextRequest) {
  const session = await auth();
  if (!session?.user) {
    return Response.json({ error: "Unauthorized" }, { status: 401 });
  }

  const body = await req.json();
  const member = await prisma.teamMember.create({
    data: {
      name: body.name,
      role: body.role,
      imageUrl: body.imageUrl || null,
      order: body.order || 0,
    },
  });
  revalidatePath("/");
  return Response.json(member, { status: 201 });
}
