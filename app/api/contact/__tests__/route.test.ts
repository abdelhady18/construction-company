import { describe, it, expect, vi, beforeEach } from "vitest";
import { NextRequest } from "next/server";
import { GET, POST } from "../route";
import { prisma } from "@/lib/prisma";
import { auth } from "@/lib/auth";
import { sendContactEmail } from "@/lib/email";

function createRequest(body?: unknown) {
  return new NextRequest("http://localhost:3000/api/contact", {
    method: body ? "POST" : "GET",
    body: body ? JSON.stringify(body) : undefined,
    headers: { "Content-Type": "application/json" },
  });
}

beforeEach(() => {
  vi.clearAllMocks();
});

describe("GET /api/contact", () => {
  it("returns 401 without auth", async () => {
    vi.mocked(auth).mockResolvedValue(null);
    const res = await GET();
    expect(res.status).toBe(401);
  });

  it("returns all messages ordered by createdAt desc", async () => {
    vi.mocked(auth).mockResolvedValue({ user: { id: "1" } } as never);
    const messages = [
      { id: "m1", name: "A", email: "a@b.com", phone: null, message: "Hi", read: false, createdAt: new Date(), updatedAt: new Date() },
      { id: "m2", name: "B", email: "c@d.com", phone: "123", message: "Hello", read: true, createdAt: new Date(), updatedAt: new Date() },
    ];
    vi.mocked(prisma.contactMessage.findMany).mockResolvedValue(messages);
    const res = await GET();
    expect(res.status).toBe(200);
    expect(await res.json()).toMatchObject(messages.map(m => ({ ...m, createdAt: m.createdAt.toISOString(), updatedAt: m.updatedAt.toISOString() })));
  });
});

describe("POST /api/contact", () => {
  it("returns 400 with missing fields", async () => {
    const res = await POST(createRequest({}));
    expect(res.status).toBe(400);
  });

  it("returns 400 with invalid email", async () => {
    const res = await POST(createRequest({ name: "N", email: "not-an-email", message: "M" }));
    expect(res.status).toBe(400);
  });

  it("returns 400 with empty message", async () => {
    const res = await POST(createRequest({ name: "N", email: "a@b.com", message: "" }));
    expect(res.status).toBe(400);
  });

  it("returns 400 with invalid JSON", async () => {
    const req = new NextRequest("http://localhost:3000/api/contact", { method: "POST" });
    const res = await POST(req);
    expect(res.status).toBe(400);
  });

  it("returns 201 on success and stores in DB", async () => {
    vi.mocked(prisma.contactMessage.create).mockResolvedValue({
      id: "m1", name: "John", email: "john@test.com", phone: null, message: "Hello", read: false, createdAt: new Date(), updatedAt: new Date(),
    });
    vi.mocked(sendContactEmail).mockResolvedValue(undefined);

    const res = await POST(createRequest({ name: "John", email: "john@test.com", message: "Hello" }));
    expect(res.status).toBe(201);
    expect(await res.json()).toEqual({ success: true });
  });

  it("creates DB record with correct data", async () => {
    vi.mocked(prisma.contactMessage.create).mockResolvedValue({
      id: "m1", name: "J", email: "j@t.com", phone: "555", message: "M", read: false, createdAt: new Date(), updatedAt: new Date(),
    });
    vi.mocked(sendContactEmail).mockResolvedValue(undefined);

    await POST(createRequest({ name: "J", email: "j@t.com", phone: "555", message: "M" }));
    expect(prisma.contactMessage.create).toHaveBeenCalledWith({
      data: { name: "J", email: "j@t.com", phone: "555", message: "M" },
    });
  });

  it("calls sendContactEmail in parallel", async () => {
    vi.mocked(prisma.contactMessage.create).mockResolvedValue({
      id: "m1", name: "J", email: "j@t.com", phone: null, message: "M", read: false, createdAt: new Date(), updatedAt: new Date(),
    });
    vi.mocked(sendContactEmail).mockResolvedValue(undefined);

    await POST(createRequest({ name: "J", email: "j@t.com", message: "M" }));
    expect(sendContactEmail).toHaveBeenCalledWith({ name: "J", email: "j@t.com", phone: undefined, message: "M" });
  });

  it("returns 201 even if email fails", async () => {
    vi.mocked(prisma.contactMessage.create).mockResolvedValue({
      id: "m1", name: "J", email: "j@t.com", phone: null, message: "M", read: false, createdAt: new Date(), updatedAt: new Date(),
    });
    vi.mocked(sendContactEmail).mockRejectedValue(new Error("SMTP error"));

    const res = await POST(createRequest({ name: "J", email: "j@t.com", message: "M" }));
    expect(res.status).toBe(201);
  });

  it("returns 500 on DB failure", async () => {
    vi.mocked(prisma.contactMessage.create).mockRejectedValue(new Error("DB down"));
    const res = await POST(createRequest({ name: "J", email: "j@t.com", message: "M" }));
    expect(res.status).toBe(500);
    expect(await res.json()).toEqual({ error: "Failed to send message" });
  });
});
