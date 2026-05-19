import { NextRequest } from "next/server";
import { prisma } from "@/lib/prisma";
import { auth } from "@/lib/auth";

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

  const body = await req.json();
  const project = await prisma.project.create({
    data: {
      title: body.title,
      description: body.description,
      images: JSON.stringify(body.images || []),
      category: body.category || null,
      featured: body.featured || false,
    },
  });
  return Response.json(project, { status: 201 });
}
