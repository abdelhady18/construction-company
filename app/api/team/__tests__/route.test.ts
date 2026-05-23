import { describe, it, expect, vi, beforeEach } from "vitest";
import { NextRequest } from "next/server";
import { GET, POST } from "../route";
import { prisma } from "@/lib/prisma";
import { auth } from "@/lib/auth";

function createRequest(body?: unknown) {
  return new NextRequest("http://localhost:3000/api/team", {
    method: body ? "POST" : "GET",
    body: body ? JSON.stringify(body) : undefined,
    headers: { "Content-Type": "application/json" },
  });
}

beforeEach(() => {
  vi.clearAllMocks();
});

describe("GET /api/team", () => {
  it("returns empty array when no members exist", async () => {
    vi.mocked(prisma.teamMember.findMany).mockResolvedValue([]);
    const res = await GET();
    expect(res.status).toBe(200);
    expect(await res.json()).toEqual([]);
  });

  it("returns all members ordered by order asc", async () => {
    vi.mocked(prisma.teamMember.findMany).mockResolvedValue([
      { id: "1", name: "B", role: "r2", imageUrl: null, order: 2, createdAt: new Date(), updatedAt: new Date() },
      { id: "2", name: "A", role: "r1", imageUrl: null, order: 1, createdAt: new Date(), updatedAt: new Date() },
    ]);
    const res = await GET();
    expect(res.status).toBe(200);
    expect(prisma.teamMember.findMany).toHaveBeenCalledWith({ orderBy: { order: "asc" } });
  });
});

describe("POST /api/team", () => {
  it("returns 401 without auth", async () => {
    vi.mocked(auth).mockResolvedValue(null);
    const res = await POST(createRequest({ name: "N", role: "R" }));
    expect(res.status).toBe(401);
  });

  it("returns 400 with empty name", async () => {
    vi.mocked(auth).mockResolvedValue({ user: { id: "1" } } as never);
    const res = await POST(createRequest({ name: "", role: "R" }));
    expect(res.status).toBe(400);
  });

  it("returns 400 with empty role", async () => {
    vi.mocked(auth).mockResolvedValue({ user: { id: "1" } } as never);
    const res = await POST(createRequest({ name: "N", role: "" }));
    expect(res.status).toBe(400);
  });

  it("returns 201 with valid body and defaults", async () => {
    vi.mocked(auth).mockResolvedValue({ user: { id: "1" } } as never);
    vi.mocked(prisma.teamMember.create).mockResolvedValue({
      id: "t1", name: "N", role: "R", imageUrl: null, order: 0, createdAt: new Date(), updatedAt: new Date(),
    });
    const res = await POST(createRequest({ name: "N", role: "R" }));
    expect(res.status).toBe(201);
    const data = await res.json();
    expect(data.imageUrl).toBeNull();
    expect(data.order).toBe(0);
  });

  it("passes explicit fields to prisma", async () => {
    vi.mocked(auth).mockResolvedValue({ user: { id: "1" } } as never);
    vi.mocked(prisma.teamMember.create).mockResolvedValue({
      id: "t1", name: "N", role: "R", nameAr: "", roleAr: "", imageUrl: "https://img.com/p.jpg", order: 3, createdAt: new Date(), updatedAt: new Date(),
    });
    const res = await POST(createRequest({ name: "N", role: "R", imageUrl: "https://img.com/p.jpg", order: 3 }));
    expect(res.status).toBe(201);
    expect(prisma.teamMember.create).toHaveBeenCalledWith({
      data: { name: "N", role: "R", nameAr: "", roleAr: "", imageUrl: "https://img.com/p.jpg", order: 3 },
    });
  });
});
