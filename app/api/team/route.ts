import { NextRequest } from "next/server";
import { prisma } from "@/lib/prisma";
import { auth } from "@/lib/auth";
import { revalidatePath } from "next/cache";
import { parseBody, teamMemberSchema } from "@/lib/validation";

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

  const { data, error, status } = await parseBody(req, teamMemberSchema);
  if (error) {
    return Response.json({ error }, { status: status || 400 });
  }

  const member = await prisma.teamMember.create({
    data: {
      name: data!.name,
      role: data!.role,
      nameAr: data!.nameAr || "",
      roleAr: data!.roleAr || "",
      imageUrl: data!.imageUrl || null,
      order: data!.order,
    },
  });
  revalidatePath("/");
  revalidatePath("/admin/team");
  return Response.json(member, { status: 201 });
}
