import { describe, it, expect, vi, beforeEach } from "vitest";
import { prisma } from "@/lib/prisma";

const mockFindMany = prisma.siteSetting.findMany as ReturnType<typeof vi.fn>;
const mockUpsert = prisma.siteSetting.upsert as ReturnType<typeof vi.fn>;

beforeEach(() => {
  vi.resetAllMocks();
});

// Dynamic import so mocks reset before module loads
async function loadModule() {
  return import("@/lib/settings");
}

describe("getSettings", () => {
  it("returns merged defaults when DB succeeds", async () => {
    mockFindMany.mockResolvedValue([
      { key: "company_name", value: "Custom Name" },
      { key: "contact_phone", value: "12345678" },
    ]);
    const { getSettings } = await loadModule();
    const result = await getSettings();
    expect(result.company_name).toBe("Custom Name");
    expect(result.contact_phone).toBe("12345678");
    expect(result.contact_email).toBe("abunram@gmail.com");
  });

  it("falls back to defaults when DB throws", async () => {
    mockFindMany.mockRejectedValue(new Error("DB down"));
    const { getSettings } = await loadModule();
    const result = await getSettings();
    expect(result.company_name).toBe("Abu Suhaib Construction");
    expect(result.contact_phone).toBe("13620805");
  });

  it("replaces only stored keys, keeps defaults for missing", async () => {
    mockFindMany.mockResolvedValue([
      { key: "company_tagline", value: "Custom Tagline" },
    ]);
    const { getSettings } = await loadModule();
    const result = await getSettings();
    expect(result.company_tagline).toBe("Custom Tagline");
    expect(result.company_name).toBe("Abu Suhaib Construction");
    expect(result.contact_email).toBe("abunram@gmail.com");
  });
});

describe("updateSetting", () => {
  it("calls upsert with correct args", async () => {
    mockUpsert.mockResolvedValue({ key: "company_name", value: "New Name" });
    const { updateSetting } = await loadModule();
    await updateSetting("company_name", "New Name");
    expect(mockUpsert).toHaveBeenCalledWith({
      where: { key: "company_name" },
      update: { value: "New Name" },
      create: { key: "company_name", value: "New Name" },
    });
  });
});
