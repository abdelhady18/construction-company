import { describe, it, expect } from "vitest";
import { NextRequest } from "next/server";
import { parseBody, serviceSchema, projectSchema, teamMemberSchema, contactMessageSchema, settingsSchema } from "@/lib/validation";

describe("serviceSchema", () => {
  it("accepts valid service", () => {
    const result = serviceSchema.safeParse({ title: "Build", description: "We build" });
    expect(result.success).toBe(true);
  });

  it("rejects empty title", () => {
    const result = serviceSchema.safeParse({ title: "", description: "D" });
    expect(result.success).toBe(false);
  });

  it("rejects missing description", () => {
    const result = serviceSchema.safeParse({ title: "T" });
    expect(result.success).toBe(false);
  });

  it("applies defaults", () => {
    const result = serviceSchema.safeParse({ title: "T", description: "D" });
    expect(result.success).toBe(true);
    if (result.success) {
      expect(result.data.icon).toBe("Building");
      expect(result.data.order).toBe(0);
    }
  });
});

describe("projectSchema", () => {
  it("accepts valid project", () => {
    const result = projectSchema.safeParse({ title: "T", description: "D" });
    expect(result.success).toBe(true);
  });

  it("applies defaults for images and featured", () => {
    const result = projectSchema.safeParse({ title: "T", description: "D" });
    expect(result.success).toBe(true);
    if (result.success) {
      expect(result.data.images).toEqual([]);
      expect(result.data.featured).toBe(false);
    }
  });

  it("accepts optional category and images", () => {
    const result = projectSchema.safeParse({ title: "T", description: "D", images: ["a.jpg"], category: "commercial", featured: true });
    expect(result.success).toBe(true);
  });
});

describe("teamMemberSchema", () => {
  it("accepts valid member", () => {
    const result = teamMemberSchema.safeParse({ name: "N", role: "R" });
    expect(result.success).toBe(true);
  });

  it("applies default order", () => {
    const result = teamMemberSchema.safeParse({ name: "N", role: "R" });
    expect(result.success).toBe(true);
    if (result.success) expect(result.data.order).toBe(0);
  });
});

describe("contactMessageSchema", () => {
  it("accepts valid message", () => {
    const result = contactMessageSchema.safeParse({ name: "N", email: "a@b.com", message: "M" });
    expect(result.success).toBe(true);
  });

  it("rejects invalid email", () => {
    const result = contactMessageSchema.safeParse({ name: "N", email: "bad", message: "M" });
    expect(result.success).toBe(false);
  });

  it("rejects empty name", () => {
    const result = contactMessageSchema.safeParse({ name: "", email: "a@b.com", message: "M" });
    expect(result.success).toBe(false);
  });
});

describe("settingsSchema", () => {
  it("accepts any record of strings", () => {
    const result = settingsSchema.safeParse({ key1: "val1", key2: "val2" });
    expect(result.success).toBe(true);
  });

  it("accepts empty object", () => {
    const result = settingsSchema.safeParse({});
    expect(result.success).toBe(true);
  });
});

describe("parseBody", () => {
  async function makeReq(body: unknown) {
    return new NextRequest("http://localhost:3000/api/test", {
      method: "POST",
      body: JSON.stringify(body),
      headers: { "Content-Type": "application/json" },
    });
  }

  it("returns parsed data for valid body", async () => {
    const req = await makeReq({ title: "T", description: "D" });
    const result = await parseBody(req, serviceSchema);
    expect(result.data).toBeDefined();
    expect(result.data!.title).toBe("T");
    expect(result.error).toBeUndefined();
  });

  it("returns error for invalid body", async () => {
    const req = await makeReq({ title: "" });
    const result = await parseBody(req, serviceSchema);
    expect(result.error).toBeDefined();
    expect(result.status).toBe(400);
  });

  it("returns error for malformed JSON", async () => {
    const req = new NextRequest("http://localhost:3000/api/test", {
      method: "POST",
      body: "{broken",
      headers: { "Content-Type": "application/json" },
    });
    const result = await parseBody(req, serviceSchema);
    expect(result.error).toBe("Invalid JSON body");
    expect(result.status).toBe(400);
  });
});
