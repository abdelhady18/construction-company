import { cache } from "react";
import { prisma } from "./prisma";
import { defaultSettings, type SiteSettings } from "./defaults";

export type { SiteSettings };

export const getSettings = cache(async (): Promise<SiteSettings> => {
  try {
    const rows = await prisma.siteSetting.findMany();
    const stored = Object.fromEntries(rows.map((r) => [r.key, r.value]));
    return { ...defaultSettings, ...stored };
  } catch {
    return { ...defaultSettings };
  }
});

export async function updateSetting(key: string, value: string) {
  return prisma.siteSetting.upsert({
    where: { key },
    update: { value },
    create: { key, value },
  });
}
