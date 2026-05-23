import { describe, it, expect, vi, beforeEach } from "vitest";
import { NextRequest } from "next/server";
import { GET, PUT } from "../route";
import { prisma } from "@/lib/prisma";
import { auth } from "@/lib/auth";
import { revalidatePath } from "next/cache";

function createRequest(body?: unknown) {
  return new NextRequest("http://localhost:3000/api/settings", {
    method: body ? "PUT" : "GET",
    body: body ? JSON.stringify(body) : undefined,
    headers: { "Content-Type": "application/json" },
  });
}

beforeEach(() => {
  vi.clearAllMocks();
});

describe("GET /api/settings", () => {
  it("returns empty object when no settings exist", async () => {
    vi.mocked(prisma.siteSetting.findMany).mockResolvedValue([]);
    const res = await GET();
    expect(res.status).toBe(200);
    expect(await res.json()).toEqual({});
  });

  it("returns settings as key-value object", async () => {
    vi.mocked(prisma.siteSetting.findMany).mockResolvedValue([
      { key: "site_name", value: "My Co" },
      { key: "site_description", value: "Best builder" },
    ]);
    const res = await GET();
    expect(res.status).toBe(200);
    expect(await res.json()).toEqual({ site_name: "My Co", site_description: "Best builder" });
  });

  it("returns empty object on prisma error", async () => {
    vi.mocked(prisma.siteSetting.findMany).mockRejectedValue(new Error("DB down"));
    const res = await GET();
    expect(res.status).toBe(200);
    expect(await res.json()).toEqual({});
  });
});

describe("PUT /api/settings", () => {
  it("returns 401 without auth", async () => {
    vi.mocked(auth).mockResolvedValue(null);
    const res = await PUT(createRequest({ site_name: "New" }));
    expect(res.status).toBe(401);
  });

  it("returns 400 with invalid JSON", async () => {
    vi.mocked(auth).mockResolvedValue({ user: { id: "1" } } as never);
    const req = new NextRequest("http://localhost:3000/api/settings", { method: "PUT" });
    const res = await PUT(req);
    expect(res.status).toBe(400);
  });

  it("returns 200 and upserts all settings in parallel", async () => {
    vi.mocked(auth).mockResolvedValue({ user: { id: "1" } } as never);
    vi.mocked(prisma.siteSetting.upsert).mockResolvedValue({} as never);

    const res = await PUT(createRequest({ site_name: "New Co", site_description: "Desc" }));
    expect(res.status).toBe(200);
    expect(await res.json()).toEqual({ success: true });

    expect(prisma.siteSetting.upsert).toHaveBeenCalledTimes(2);
    expect(prisma.siteSetting.upsert).toHaveBeenCalledWith({
      where: { key: "site_name" },
      update: { value: "New Co" },
      create: { key: "site_name", value: "New Co" },
    });
    expect(prisma.siteSetting.upsert).toHaveBeenCalledWith({
      where: { key: "site_description" },
      update: { value: "Desc" },
      create: { key: "site_description", value: "Desc" },
    });
  });

  it("revalidates paths", async () => {
    vi.mocked(auth).mockResolvedValue({ user: { id: "1" } } as never);
    vi.mocked(prisma.siteSetting.upsert).mockResolvedValue({} as never);

    await PUT(createRequest({ site_name: "X" }));
    expect(revalidatePath).toHaveBeenCalledWith("/");
    expect(revalidatePath).toHaveBeenCalledWith("/admin/settings");
  });

  it("handles prisma error", async () => {
    vi.mocked(auth).mockResolvedValue({ user: { id: "1" } } as never);
    vi.mocked(prisma.siteSetting.upsert).mockRejectedValue(new Error("DB down"));
    await expect(PUT(createRequest({ site_name: "X" }))).rejects.toThrow("DB down");
  });
});
