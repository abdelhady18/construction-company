import { describe, it, expect, vi, beforeEach } from "vitest";
import { NextRequest } from "next/server";
import { GET, POST } from "../route";
import { prisma } from "@/lib/prisma";
import { auth } from "@/lib/auth";

function createRequest(body?: unknown) {
  return new NextRequest("http://localhost:3000/api/services", {
    method: body ? "POST" : "GET",
    body: body ? JSON.stringify(body) : undefined,
    headers: { "Content-Type": "application/json" },
  });
}

beforeEach(() => {
  vi.clearAllMocks();
});

describe("GET /api/services", () => {
  it("returns empty array when no services exist", async () => {
    vi.mocked(prisma.service.findMany).mockResolvedValue([]);
    const res = await GET();
    expect(res.status).toBe(200);
    expect(await res.json()).toEqual([]);
  });

  it("returns all services ordered by order asc", async () => {
    const services = [
      { id: "1", title: "B", description: "d2", icon: "Hammer", imageUrl: null, order: 2, createdAt: new Date(), updatedAt: new Date() },
      { id: "2", title: "A", description: "d1", icon: "Wrench", imageUrl: null, order: 1, createdAt: new Date(), updatedAt: new Date() },
    ];
    vi.mocked(prisma.service.findMany).mockResolvedValue(services);
    const res = await GET();
    expect(res.status).toBe(200);
    const data = await res.json();
    expect(data).toHaveLength(2);
    expect(data[0].order).toBe(2);
    expect(data[1].order).toBe(1);
    expect(prisma.service.findMany).toHaveBeenCalledWith({ orderBy: { order: "asc" } });
  });

  it("throws 500 on prisma error", async () => {
    vi.mocked(prisma.service.findMany).mockRejectedValue(new Error("DB down"));
    await expect(GET()).rejects.toThrow("DB down");
  });
});

describe("POST /api/services", () => {
  it("returns 401 without auth", async () => {
    vi.mocked(auth).mockResolvedValue(null);
    const res = await POST(createRequest({ title: "Test", description: "Desc" }));
    expect(res.status).toBe(401);
    expect(await res.json()).toEqual({ error: "Unauthorized" });
  });

  it("returns 400 with empty title", async () => {
    vi.mocked(auth).mockResolvedValue({ user: { id: "1" } } as never);
    const res = await POST(createRequest({ title: "", description: "Desc" }));
    expect(res.status).toBe(400);
  });

  it("returns 400 with missing description", async () => {
    vi.mocked(auth).mockResolvedValue({ user: { id: "1" } } as never);
    const res = await POST(createRequest({ title: "Test" }));
    expect(res.status).toBe(400);
  });

  it("returns 400 with invalid JSON body", async () => {
    vi.mocked(auth).mockResolvedValue({ user: { id: "1" } } as never);
    const req = new NextRequest("http://localhost:3000/api/services", { method: "POST" });
    const res = await POST(req);
    expect(res.status).toBe(400);
  });

  it("returns 201 with valid body and defaults", async () => {
    vi.mocked(auth).mockResolvedValue({ user: { id: "1" } } as never);
    vi.mocked(prisma.service.create).mockResolvedValue({
      id: "new-id", title: "Test", description: "Desc", icon: "Building", imageUrl: null, order: 0, createdAt: new Date(), updatedAt: new Date(),
    });
    const res = await POST(createRequest({ title: "Test", description: "Desc" }));
    expect(res.status).toBe(201);
    const data = await res.json();
    expect(data.title).toBe("Test");
    expect(data.icon).toBe("Building");
    expect(data.order).toBe(0);
  });

  it("passes explicit fields to prisma", async () => {
    vi.mocked(auth).mockResolvedValue({ user: { id: "1" } } as never);
    vi.mocked(prisma.service.create).mockResolvedValue({
      id: "n", title: "T", description: "D", icon: "Wrench", imageUrl: "https://img.com/a.jpg", order: 5, createdAt: new Date(), updatedAt: new Date(),
    });
    const res = await POST(createRequest({ title: "T", description: "D", icon: "Wrench", imageUrl: "https://img.com/a.jpg", order: 5 }));
    expect(res.status).toBe(201);
    expect(prisma.service.create).toHaveBeenCalledWith({
      data: { title: "T", description: "D", icon: "Wrench", imageUrl: "https://img.com/a.jpg", order: 5 },
    });
  });

  it("handles prisma error on create", async () => {
    vi.mocked(auth).mockResolvedValue({ user: { id: "1" } } as never);
    vi.mocked(prisma.service.create).mockRejectedValue(new Error("DB error"));
    await expect(POST(createRequest({ title: "T", description: "D" }))).rejects.toThrow("DB error");
  });
});
