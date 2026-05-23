import { describe, it, expect, vi, beforeEach } from "vitest";
import { NextRequest } from "next/server";
import { GET, PUT, DELETE } from "../route";
import { prisma } from "@/lib/prisma";
import { auth } from "@/lib/auth";

function createRequest(body?: unknown) {
  return new NextRequest("http://localhost:3000/api/services/1", {
    method: body ? "PUT" : "GET",
    body: body ? JSON.stringify(body) : undefined,
    headers: { "Content-Type": "application/json" },
  });
}

const params = Promise.resolve({ id: "svc-1" });

beforeEach(() => {
  vi.clearAllMocks();
});

describe("GET /api/services/[id]", () => {
  it("returns 404 when not found", async () => {
    vi.mocked(prisma.service.findUnique).mockResolvedValue(null);
    const res = await GET(createRequest(), { params });
    expect(res.status).toBe(404);
    expect(await res.json()).toEqual({ error: "Not found" });
  });

  it("returns service when found", async () => {
    const service = { id: "svc-1", title: "Test", description: "Desc", icon: "Hammer", imageUrl: null, order: 0, createdAt: new Date(), updatedAt: new Date() };
    vi.mocked(prisma.service.findUnique).mockResolvedValue(service);
    const res = await GET(createRequest(), { params });
    expect(res.status).toBe(200);
    expect(await res.json()).toMatchObject({ ...service, createdAt: service.createdAt.toISOString(), updatedAt: service.updatedAt.toISOString() });
  });

  it("throws on prisma error", async () => {
    vi.mocked(prisma.service.findUnique).mockRejectedValue(new Error("DB down"));
    await expect(GET(createRequest(), { params })).rejects.toThrow("DB down");
  });
});

describe("PUT /api/services/[id]", () => {
  it("returns 401 without auth", async () => {
    vi.mocked(auth).mockResolvedValue(null);
    const res = await PUT(createRequest({ title: "T", description: "D" }), { params });
    expect(res.status).toBe(401);
  });

  it("returns 400 with empty title", async () => {
    vi.mocked(auth).mockResolvedValue({ user: { id: "1" } } as never);
    const res = await PUT(createRequest({ title: "", description: "D" }), { params });
    expect(res.status).toBe(400);
  });

  it("returns 200 with valid update", async () => {
    vi.mocked(auth).mockResolvedValue({ user: { id: "1" } } as never);
    vi.mocked(prisma.service.update).mockResolvedValue({
      id: "svc-1", title: "Updated", description: "D", icon: "Building", imageUrl: null, order: 0, createdAt: new Date(), updatedAt: new Date(),
    });
    const res = await PUT(createRequest({ title: "Updated", description: "D" }), { params });
    expect(res.status).toBe(200);
    const data = await res.json();
    expect(data.title).toBe("Updated");
  });

  it("handles prisma update error", async () => {
    vi.mocked(auth).mockResolvedValue({ user: { id: "1" } } as never);
    vi.mocked(prisma.service.update).mockRejectedValue(new Error("Not found"));
    await expect(PUT(createRequest({ title: "T", description: "D" }), { params })).rejects.toThrow("Not found");
  });
});

describe("DELETE /api/services/[id]", () => {
  it("returns 401 without auth", async () => {
    vi.mocked(auth).mockResolvedValue(null);
    const res = await DELETE(createRequest(), { params });
    expect(res.status).toBe(401);
  });

  it("returns 200 on success", async () => {
    vi.mocked(auth).mockResolvedValue({ user: { id: "1" } } as never);
    vi.mocked(prisma.service.delete).mockResolvedValue({} as never);
    const res = await DELETE(createRequest(), { params });
    expect(res.status).toBe(200);
    expect(await res.json()).toEqual({ success: true });
  });

  it("handles prisma delete error", async () => {
    vi.mocked(auth).mockResolvedValue({ user: { id: "1" } } as never);
    vi.mocked(prisma.service.delete).mockRejectedValue(new Error("Not found"));
    await expect(DELETE(createRequest(), { params })).rejects.toThrow("Not found");
  });
});
