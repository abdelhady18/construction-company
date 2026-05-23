import { describe, it, expect } from "vitest";
import { defaultSettings } from "@/lib/defaults";

describe("defaultSettings", () => {
  const requiredKeys = [
    "company_name", "company_name_ar",
    "company_tagline", "company_tagline_ar",
    "company_description", "company_description_ar",
    "about_title", "about_title_ar",
    "about_subtitle", "about_subtitle_ar",
    "about_story", "about_story_ar",
    "about_story_2", "about_story_2_ar",
    "contact_title", "contact_title_ar",
    "contact_subtitle", "contact_subtitle_ar",
    "contact_address", "contact_address_ar",
    "contact_phone", "contact_email",
    "contact_hours",
    "about_stats", "about_stats_ar",
    "footer_about", "footer_about_ar",
  ];

  it("has all required keys", () => {
    for (const key of requiredKeys) {
      expect(defaultSettings).toHaveProperty(key);
    }
  });

  it("has non-empty company_name", () => {
    expect(defaultSettings.company_name).toBe("Abu Suhaib Construction");
  });

  it("has non-empty company_name_ar", () => {
    expect(defaultSettings.company_name_ar).toBe("أبو صهيب للمقاولات");
  });

  it("has contact phone and email", () => {
    expect(defaultSettings.contact_phone).toBe("13620805");
    expect(defaultSettings.contact_email).toBe("abunram@gmail.com");
  });

  it("has address set to Bahrain", () => {
    expect(defaultSettings.contact_address).toBe("Bahrain");
    expect(defaultSettings.contact_address_ar).toBe("البحرين");
  });

  it("parses contact_hours as valid JSON", () => {
    const hours = JSON.parse(defaultSettings.contact_hours);
    expect(Array.isArray(hours)).toBe(true);
    expect(hours.length).toBeGreaterThanOrEqual(6);
    for (const h of hours) {
      expect(h).toHaveProperty("day");
      expect(h).toHaveProperty("open");
      expect(h).toHaveProperty("close");
      expect(h).toHaveProperty("closed");
    }
  });

  it("parses about_stats as valid JSON with 4 stats", () => {
    const stats = JSON.parse(defaultSettings.about_stats);
    expect(Array.isArray(stats)).toBe(true);
    expect(stats).toHaveLength(4);
    expect(stats[0].value).toBe("20+");
    expect(stats[0].label).toBe("Years Experience");
  });

  it("parses about_stats_ar as valid JSON with 4 stats", () => {
    const stats = JSON.parse(defaultSettings.about_stats_ar);
    expect(Array.isArray(stats)).toBe(true);
    expect(stats).toHaveLength(4);
    expect(stats[0].value).toBe("20+");
    expect(stats[0].label).toBe("سنة خبرة");
  });

  it("has every translatable EN string mirrored with an _AR key", () => {
    const noArabic = new Set([
      "contact_phone", "contact_email", "contact_hours",
    ]);
    for (const [key, val] of Object.entries(defaultSettings)) {
      if (key.endsWith("_ar")) continue;
      if (noArabic.has(key)) continue;
      if (typeof val !== "string") continue;
      expect(defaultSettings).toHaveProperty(`${key}_ar`);
    }
  });

  it("has company_name matching Abu Suhaib Construction", () => {
    expect(defaultSettings.company_name).toMatch(/Abu Suhaib/);
    expect(defaultSettings.company_name_ar).toMatch(/أبو صهيب/);
  });
});
