import { describe, it, expect, vi, beforeEach } from "vitest";
import { NextRequest } from "next/server";
import { GET, POST } from "../route";
import { prisma } from "@/lib/prisma";
import { auth } from "@/lib/auth";

function createRequest(body?: unknown) {
  return new NextRequest("http://localhost:3000/api/projects", {
    method: body ? "POST" : "GET",
    body: body ? JSON.stringify(body) : undefined,
    headers: { "Content-Type": "application/json" },
  });
}

beforeEach(() => {
  vi.clearAllMocks();
});

describe("GET /api/projects", () => {
  it("returns empty array when no projects exist", async () => {
    vi.mocked(prisma.project.findMany).mockResolvedValue([]);
    const res = await GET();
    expect(res.status).toBe(200);
    expect(await res.json()).toEqual([]);
  });

  it("returns all projects ordered by createdAt desc", async () => {
    const projects = [
      { id: "1", title: "A", description: "d1", images: "[]", category: null, featured: false, createdAt: new Date("2024-01-01"), updatedAt: new Date() },
      { id: "2", title: "B", description: "d2", images: "[]", category: "commercial", featured: true, createdAt: new Date("2024-01-02"), updatedAt: new Date() },
    ];
    vi.mocked(prisma.project.findMany).mockResolvedValue(projects);
    const res = await GET();
    expect(res.status).toBe(200);
    expect(prisma.project.findMany).toHaveBeenCalledWith({ orderBy: { createdAt: "desc" } });
  });
});

describe("POST /api/projects", () => {
  it("returns 401 without auth", async () => {
    vi.mocked(auth).mockResolvedValue(null);
    const res = await POST(createRequest({ title: "T", description: "D" }));
    expect(res.status).toBe(401);
  });

  it("returns 400 with empty title", async () => {
    vi.mocked(auth).mockResolvedValue({ user: { id: "1" } } as never);
    const res = await POST(createRequest({ title: "", description: "D" }));
    expect(res.status).toBe(400);
  });

  it("returns 400 with missing description", async () => {
    vi.mocked(auth).mockResolvedValue({ user: { id: "1" } } as never);
    const res = await POST(createRequest({ title: "T" }));
    expect(res.status).toBe(400);
  });

  it("returns 400 with invalid JSON", async () => {
    vi.mocked(auth).mockResolvedValue({ user: { id: "1" } } as never);
    const req = new NextRequest("http://localhost:3000/api/projects", { method: "POST" });
    const res = await POST(req);
    expect(res.status).toBe(400);
  });

  it("returns 201 with valid body and defaults", async () => {
    vi.mocked(auth).mockResolvedValue({ user: { id: "1" } } as never);
    vi.mocked(prisma.project.create).mockResolvedValue({
      id: "p1", title: "T", description: "D", images: "[]", category: null, featured: false, createdAt: new Date(), updatedAt: new Date(),
    });
    const res = await POST(createRequest({ title: "T", description: "D" }));
    expect(res.status).toBe(201);
    const data = await res.json();
    expect(data.images).toBe("[]");
    expect(data.featured).toBe(false);
  });

  it("passes explicit fields to prisma", async () => {
    vi.mocked(auth).mockResolvedValue({ user: { id: "1" } } as never);
    vi.mocked(prisma.project.create).mockResolvedValue({
      id: "p1", title: "T", description: "D", images: '["img1.jpg"]', category: "commercial", featured: true, createdAt: new Date(), updatedAt: new Date(),
    });
    const res = await POST(createRequest({ title: "T", description: "D", images: ["img1.jpg"], category: "commercial", featured: true }));
    expect(res.status).toBe(201);
    expect(prisma.project.create).toHaveBeenCalledWith({
      data: { title: "T", description: "D", images: '["img1.jpg"]', category: "commercial", featured: true },
    });
  });

  it("handles prisma error", async () => {
    vi.mocked(auth).mockResolvedValue({ user: { id: "1" } } as never);
    vi.mocked(prisma.project.create).mockRejectedValue(new Error("DB error"));
    await expect(POST(createRequest({ title: "T", description: "D" }))).rejects.toThrow("DB error");
  });
});
