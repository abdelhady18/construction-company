import { NextRequest } from "next/server";
import { prisma } from "@/lib/prisma";
import { auth } from "@/lib/auth";
import { parseBody, settingsSchema } from "@/lib/validation";
import { revalidatePath } from "next/cache";

export async function GET() {
  try {
    const rows = await prisma.siteSetting.findMany();
    return Response.json(
      Object.fromEntries(rows.map((r) => [r.key, r.value]))
    );
  } catch {
    return Response.json({});
  }
}

export async function PUT(req: NextRequest) {
  const session = await auth();
  if (!session?.user) {
    return Response.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { data: updates, error, status } = await parseBody(req, settingsSchema);
  if (error) {
    return Response.json({ error }, { status: status || 400 });
  }

  await Promise.all(
    Object.entries(updates!).map(([key, value]) =>
      prisma.siteSetting.upsert({
        where: { key },
        update: { value },
        create: { key, value },
      })
    )
  );

  revalidatePath("/");
  revalidatePath("/admin/settings");

  return Response.json({ success: true });
}
