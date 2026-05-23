import { NextRequest } from "next/server";
import { prisma } from "@/lib/prisma";
import { auth } from "@/lib/auth";
import { revalidatePath } from "next/cache";
import { parseBody, projectSchema } from "@/lib/validation";

export async function GET(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const project = await prisma.project.findUnique({ where: { id } });
  if (!project) {
    return Response.json({ error: "Not found" }, { status: 404 });
  }
  return Response.json(project);
}

export async function PUT(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const session = await auth();
  if (!session?.user) {
    return Response.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { id } = await params;

  const { data, error, status } = await parseBody(req, projectSchema);
  if (error) {
    return Response.json({ error }, { status: status || 400 });
  }

  const project = await prisma.project.update({
    where: { id },
    data: {
      title: data!.title,
      description: data!.description,
      images: JSON.stringify(data!.images),
      category: data!.category,
      featured: data!.featured,
    },
  });
  revalidatePath("/");
  revalidatePath("/admin/projects");
  return Response.json(project);
}

export async function DELETE(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const session = await auth();
  if (!session?.user) {
    return Response.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { id } = await params;
  await prisma.project.delete({ where: { id } });
  revalidatePath("/");
  revalidatePath("/admin/projects");
  return Response.json({ success: true });
}
