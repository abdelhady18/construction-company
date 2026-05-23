import { NextRequest } from "next/server";
import { prisma } from "@/lib/prisma";
import { auth } from "@/lib/auth";
import { revalidatePath } from "next/cache";
import { parseBody, serviceSchema } from "@/lib/validation";

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

  const { data, error, status } = await parseBody(req, serviceSchema);
  if (error) {
    return Response.json({ error }, { status: status || 400 });
  }

  const service = await prisma.service.create({
    data: {
      title: data!.title,
      description: data!.description,
      icon: data!.icon,
      imageUrl: data!.imageUrl || null,
      order: data!.order,
    },
  });
  revalidatePath("/");
  revalidatePath("/admin/services");
  return Response.json(service, { status: 201 });
}
