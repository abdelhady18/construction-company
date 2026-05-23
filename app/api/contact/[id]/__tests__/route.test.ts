import { describe, it, expect, vi, beforeEach } from "vitest";
import { NextRequest } from "next/server";
import { PATCH, DELETE } from "../route";
import { prisma } from "@/lib/prisma";
import { auth } from "@/lib/auth";

function createRequest() {
  return new NextRequest("http://localhost:3000/api/contact/1", { method: "PATCH" });
}

const params = Promise.resolve({ id: "msg-1" });

beforeEach(() => {
  vi.clearAllMocks();
});

describe("PATCH /api/contact/[id]", () => {
  it("returns 401 without auth", async () => {
    vi.mocked(auth).mockResolvedValue(null);
    const res = await PATCH(createRequest(), { params });
    expect(res.status).toBe(401);
  });

  it("returns 200 and marks message as read", async () => {
    vi.mocked(auth).mockResolvedValue({ user: { id: "1" } } as never);
    vi.mocked(prisma.contactMessage.update).mockResolvedValue({
      id: "msg-1", name: "N", email: "e@m.com", phone: null, message: "M", read: true, createdAt: new Date(), updatedAt: new Date(),
    });
    const res = await PATCH(createRequest(), { params });
    expect(res.status).toBe(200);
    expect(prisma.contactMessage.update).toHaveBeenCalledWith({
      where: { id: "msg-1" },
      data: { read: true },
    });
  });

  it("handles prisma error", async () => {
    vi.mocked(auth).mockResolvedValue({ user: { id: "1" } } as never);
    vi.mocked(prisma.contactMessage.update).mockRejectedValue(new Error("Not found"));
    await expect(PATCH(createRequest(), { params })).rejects.toThrow("Not found");
  });
});

describe("DELETE /api/contact/[id]", () => {
  it("returns 401 without auth", async () => {
    vi.mocked(auth).mockResolvedValue(null);
    const res = await DELETE(createRequest(), { params });
    expect(res.status).toBe(401);
  });

  it("returns 200 on success", async () => {
    vi.mocked(auth).mockResolvedValue({ user: { id: "1" } } as never);
    vi.mocked(prisma.contactMessage.delete).mockResolvedValue({} as never);
    const res = await DELETE(createRequest(), { params });
    expect(res.status).toBe(200);
    expect(await res.json()).toEqual({ success: true });
  });
});
