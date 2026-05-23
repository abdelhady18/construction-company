import { z } from "zod";

export const serviceSchema = z.object({
  title: z.string().min(1, "Title is required"),
  description: z.string().min(1, "Description is required"),
  icon: z.string().optional().default("Building"),
  imageUrl: z.string().nullable().optional(),
  order: z.number().optional().default(0),
});

export const projectSchema = z.object({
  title: z.string().min(1, "Title is required"),
  description: z.string().min(1, "Description is required"),
  images: z.array(z.string()).optional().default([]),
  category: z.string().nullable().optional(),
  featured: z.boolean().optional().default(false),
});

export const teamMemberSchema = z.object({
  name: z.string().min(1, "Name is required"),
  role: z.string().min(1, "Role is required"),
  imageUrl: z.string().nullable().optional(),
  order: z.number().optional().default(0),
});

export const contactMessageSchema = z.object({
  name: z.string().min(1, "Name is required"),
  email: z.string().email("Invalid email format"),
  phone: z.string().nullable().optional(),
  message: z.string().min(1, "Message is required"),
});

export const settingsSchema = z.record(z.string(), z.string());

export async function parseBody<T>(req: Request, schema: z.ZodSchema<T>): Promise<{ data?: T; error?: string; status?: number }> {
  try {
    const body = await req.json();
    const result = schema.safeParse(body);
    if (!result.success) {
      const firstError = result.error.issues[0];
      return { error: firstError?.message || "Invalid input", status: 400 };
    }
    return { data: result.data };
  } catch {
    return { error: "Invalid JSON body", status: 400 };
  }
}
