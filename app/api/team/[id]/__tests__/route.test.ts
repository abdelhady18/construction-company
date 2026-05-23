import { describe, it, expect, vi, beforeEach } from "vitest";
import { NextRequest } from "next/server";
import { GET, PUT, DELETE } from "../route";
import { prisma } from "@/lib/prisma";
import { auth } from "@/lib/auth";

function createRequest(body?: unknown) {
  return new NextRequest("http://localhost:3000/api/team/1", {
    method: body ? "PUT" : "GET",
    body: body ? JSON.stringify(body) : undefined,
    headers: { "Content-Type": "application/json" },
  });
}

const params = Promise.resolve({ id: "tm-1" });

beforeEach(() => {
  vi.clearAllMocks();
});

describe("GET /api/team/[id]", () => {
  it("returns 404 when not found", async () => {
    vi.mocked(prisma.teamMember.findUnique).mockResolvedValue(null);
    const res = await GET(createRequest(), { params });
    expect(res.status).toBe(404);
  });

  it("returns member when found", async () => {
    const member = { id: "tm-1", name: "N", role: "R", imageUrl: null, order: 0, createdAt: new Date(), updatedAt: new Date() };
    vi.mocked(prisma.teamMember.findUnique).mockResolvedValue(member);
    const res = await GET(createRequest(), { params });
    expect(res.status).toBe(200);
    expect(await res.json()).toMatchObject({ ...member, createdAt: member.createdAt.toISOString(), updatedAt: member.updatedAt.toISOString() });
  });
});

describe("PUT /api/team/[id]", () => {
  it("returns 401 without auth", async () => {
    vi.mocked(auth).mockResolvedValue(null);
    const res = await PUT(createRequest({ name: "N", role: "R" }), { params });
    expect(res.status).toBe(401);
  });

  it("returns 400 with empty name", async () => {
    vi.mocked(auth).mockResolvedValue({ user: { id: "1" } } as never);
    const res = await PUT(createRequest({ name: "", role: "R" }), { params });
    expect(res.status).toBe(400);
  });

  it("returns 200 with valid update", async () => {
    vi.mocked(auth).mockResolvedValue({ user: { id: "1" } } as never);
    vi.mocked(prisma.teamMember.update).mockResolvedValue({
      id: "tm-1", name: "Updated", role: "R", imageUrl: null, order: 1, createdAt: new Date(), updatedAt: new Date(),
    });
    const res = await PUT(createRequest({ name: "Updated", role: "R", order: 1 }), { params });
    expect(res.status).toBe(200);
    const data = await res.json();
    expect(data.name).toBe("Updated");
    expect(data.order).toBe(1);
  });
});

describe("DELETE /api/team/[id]", () => {
  it("returns 401 without auth", async () => {
    vi.mocked(auth).mockResolvedValue(null);
    const res = await DELETE(createRequest(), { params });
    expect(res.status).toBe(401);
  });

  it("returns 200 on success", async () => {
    vi.mocked(auth).mockResolvedValue({ user: { id: "1" } } as never);
    vi.mocked(prisma.teamMember.delete).mockResolvedValue({} as never);
    const res = await DELETE(createRequest(), { params });
    expect(res.status).toBe(200);
    expect(await res.json()).toEqual({ success: true });
  });
});
