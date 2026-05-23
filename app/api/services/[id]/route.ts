import { NextRequest } from "next/server";
import { prisma } from "@/lib/prisma";
import { auth } from "@/lib/auth";
import { revalidatePath } from "next/cache";
import { parseBody, serviceSchema } from "@/lib/validation";

export async function GET(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const service = await prisma.service.findUnique({ where: { id } });
  if (!service) {
    return Response.json({ error: "Not found" }, { status: 404 });
  }
  return Response.json(service);
}

export async function PUT(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const session = await auth();
  if (!session?.user) {
    return Response.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { id } = await params;

  const { data, error, status } = await parseBody(req, serviceSchema);
  if (error) {
    return Response.json({ error }, { status: status || 400 });
  }

  const service = await prisma.service.update({
    where: { id },
    data: {
      title: data!.title,
      description: data!.description,
      titleAr: data!.titleAr || "",
      descriptionAr: data!.descriptionAr || "",
      icon: data!.icon,
      imageUrl: data!.imageUrl,
      order: data!.order,
    },
  });
  revalidatePath("/");
  revalidatePath("/admin/services");
  return Response.json(service);
}

export async function DELETE(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const session = await auth();
  if (!session?.user) {
    return Response.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { id } = await params;
  await prisma.service.delete({ where: { id } });
  revalidatePath("/");
  revalidatePath("/admin/services");
  return Response.json({ success: true });
}
