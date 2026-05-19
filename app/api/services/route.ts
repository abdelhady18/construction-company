import { NextRequest } from "next/server";
import { prisma } from "@/lib/prisma";
import { auth } from "@/lib/auth";

export async function GET() {
  const services = await prisma.service.findMany({
    orderBy: { order: "asc" },
  });
  return Response.json(services);
}

export async function POST(req: NextRequest) {
  const session = await auth();
  if (!session?.user) {
    return Response.json({ error: "Unauthorized" }, { status: 401 });
  }

  const body = await req.json();
  const service = await prisma.service.create({
    data: {
      title: body.title,
      description: body.description,
      icon: body.icon || "Building",
      imageUrl: body.imageUrl || null,
      order: body.order || 0,
    },
  });
  return Response.json(service, { status: 201 });
}
