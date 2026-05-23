import { NextRequest } from "next/server";
import { prisma } from "@/lib/prisma";
import { auth } from "@/lib/auth";
import { revalidatePath } from "next/cache";
import { parseBody, projectSchema } from "@/lib/validation";

export async function GET() {
  const projects = await prisma.project.findMany({
    orderBy: { createdAt: "desc" },
  });
  return Response.json(projects);
}

export async function POST(req: NextRequest) {
  const session = await auth();
  if (!session?.user) {
    return Response.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { data, error, status } = await parseBody(req, projectSchema);
  if (error) {
    return Response.json({ error }, { status: status || 400 });
  }

  const project = await prisma.project.create({
    data: {
      title: data!.title,
      description: data!.description,
      images: JSON.stringify(data!.images),
      category: data!.category || null,
      featured: data!.featured,
    },
  });
  revalidatePath("/");
  revalidatePath("/admin/projects");
  return Response.json(project, { status: 201 });
}
