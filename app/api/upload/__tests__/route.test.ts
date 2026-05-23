import { describe, it, expect, vi, beforeEach } from "vitest";
import { NextRequest } from "next/server";
import { POST } from "../route";
import { auth } from "@/lib/auth";

function createRequest(file: File | null) {
  const formData = new FormData();
  if (file) formData.append("file", file);
  return new NextRequest("http://localhost:3000/api/upload", {
    method: "POST",
    body: formData,
  });
}

beforeEach(() => {
  vi.clearAllMocks();
  vi.mocked(auth).mockResolvedValue({ user: { id: "1" } } as never);
});

describe("POST /api/upload", () => {
  it("returns 401 without auth", async () => {
    vi.mocked(auth).mockResolvedValue(null);
    const req = createRequest(new File([], "test.jpg"));
    const res = await POST(req);
    expect(res.status).toBe(401);
    expect(await res.json()).toEqual({ error: "Unauthorized" });
  });

  it("returns 400 if no file provided", async () => {
    const req = createRequest(null);
    const res = await POST(req);
    expect(res.status).toBe(400);
    const body = await res.json();
    expect(body.error).toBe("No file provided");
  });

  it("returns 400 if file exceeds 500 KB", async () => {
    const file = new File([new Uint8Array(600_000)], "large.jpg", {
      type: "image/jpeg",
    });
    const req = createRequest(file);
    const res = await POST(req);
    expect(res.status).toBe(400);
    const body = await res.json();
    expect(body.error).toBe("Image must be under 500 KB");
  });

  it("returns 200 for file at exactly 500 KB boundary", async () => {
    const file = new File([new Uint8Array(512_000)], "exact.jpg", {
      type: "image/jpeg",
    });
    const req = createRequest(file);
    const res = await POST(req);
    expect(res.status).toBe(200);
  });

  it("returns 200 with a data URL for a valid file", async () => {
    const content = new Uint8Array([0xff, 0xd8, 0xff, 0xe0]);
    const file = new File([content], "photo.jpg", { type: "image/jpeg" });
    const req = createRequest(file);
    const res = await POST(req);
    expect(res.status).toBe(200);
    const body = await res.json();
    const expected = Buffer.from(content).toString("base64");
    expect(body.url).toBe(`data:image/jpeg;base64,${expected}`);
  });

  it("returns 200 and preserves MIME type for PNG", async () => {
    const content = new Uint8Array(1024);
    const file = new File([content], "image.png", { type: "image/png" });
    const req = createRequest(file);
    const res = await POST(req);
    expect(res.status).toBe(200);
    const body = await res.json();
    expect(body.url).toMatch(/^data:image\/png;base64,/);
  });

  it("uses application/octet-stream for files with no explicit type", async () => {
    const content = new Uint8Array(1024);
    const file = new File([content], "unknown", { type: "" });
    const req = createRequest(file);
    const res = await POST(req);
    expect(res.status).toBe(200);
    const body = await res.json();
    expect(body.url).toMatch(/^data:application\/octet-stream;base64,/);
  });

  it("returns 500 when formData parsing fails", async () => {
    const req = new NextRequest("http://localhost:3000/api/upload", {
      method: "POST",
    });
    vi.spyOn(req, "formData").mockRejectedValue(new Error("Bad request"));
    const res = await POST(req);
    expect(res.status).toBe(500);
    const body = await res.json();
    expect(body.error).toBe("Bad request");
  });

  it("returns 500 with generic message for non-Error throws", async () => {
    const req = new NextRequest("http://localhost:3000/api/upload", {
      method: "POST",
    });
    vi.spyOn(req, "formData").mockRejectedValue("string error");
    const res = await POST(req);
    expect(res.status).toBe(500);
    const body = await res.json();
    expect(body.error).toBe("Upload failed");
  });
});
