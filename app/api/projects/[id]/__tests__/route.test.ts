import { describe, it, expect, vi, beforeEach } from "vitest";
import { NextRequest } from "next/server";
import { GET, PUT, DELETE } from "../route";
import { prisma } from "@/lib/prisma";
import { auth } from "@/lib/auth";

function createRequest(body?: unknown) {
  return new NextRequest("http://localhost:3000/api/projects/1", {
    method: body ? "PUT" : "GET",
    body: body ? JSON.stringify(body) : undefined,
    headers: { "Content-Type": "application/json" },
  });
}

const params = Promise.resolve({ id: "proj-1" });

beforeEach(() => {
  vi.clearAllMocks();
});

describe("GET /api/projects/[id]", () => {
  it("returns 404 when not found", async () => {
    vi.mocked(prisma.project.findUnique).mockResolvedValue(null);
    const res = await GET(createRequest(), { params });
    expect(res.status).toBe(404);
  });

  it("returns project when found", async () => {
    const project = { id: "proj-1", title: "T", description: "D", images: "[]", category: null, featured: false, createdAt: new Date(), updatedAt: new Date() };
    vi.mocked(prisma.project.findUnique).mockResolvedValue(project);
    const res = await GET(createRequest(), { params });
    expect(res.status).toBe(200);
    expect(await res.json()).toMatchObject({ ...project, createdAt: project.createdAt.toISOString(), updatedAt: project.updatedAt.toISOString() });
  });
});

describe("PUT /api/projects/[id]", () => {
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
    vi.mocked(prisma.project.update).mockResolvedValue({
      id: "proj-1", title: "Updated", description: "D", images: "[]", category: "residential", featured: true, createdAt: new Date(), updatedAt: new Date(),
    });
    const res = await PUT(createRequest({ title: "Updated", description: "D", images: [], category: "residential", featured: true }), { params });
    expect(res.status).toBe(200);
    const data = await res.json();
    expect(data.title).toBe("Updated");
    expect(data.category).toBe("residential");
  });
});

describe("DELETE /api/projects/[id]", () => {
  it("returns 401 without auth", async () => {
    vi.mocked(auth).mockResolvedValue(null);
    const res = await DELETE(createRequest(), { params });
    expect(res.status).toBe(401);
  });

  it("returns 200 on success", async () => {
    vi.mocked(auth).mockResolvedValue({ user: { id: "1" } } as never);
    vi.mocked(prisma.project.delete).mockResolvedValue({} as never);
    const res = await DELETE(createRequest(), { params });
    expect(res.status).toBe(200);
    expect(await res.json()).toEqual({ success: true });
  });
});
