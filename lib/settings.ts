import { prisma } from "./prisma";

export const defaultSettings = {
  company_name: "BuildCo",
  company_tagline: "Building Your Vision With Excellence",
  company_description:
    "From concept to completion, we deliver exceptional construction projects that stand the test of time. Your trusted partner in building the future.",
  about_title: "About Us",
  about_subtitle: "Dedicated to delivering superior construction services since 2010",
  about_story:
    "Founded in 2010, BuildCo has grown from a small local contractor to one of the region's most trusted construction companies. We pride ourselves on quality craftsmanship, innovative solutions, and unwavering commitment to client satisfaction.",
  about_story_2:
    "Every project we undertake is a partnership. We listen, plan, and execute with precision, ensuring your vision becomes reality. Our team of experts brings decades of combined experience to every job.",
  contact_title: "Contact Us",
  contact_subtitle: "Ready to start your project? Get in touch with us today",
  contact_address: "123 Construction Ave, Building District, NY 10001",
  contact_phone: "+1 (555) 123-4567",
  contact_email: "info@buildco.com",
  contact_hours: JSON.stringify([
    { day: "Monday", open: "08:00", close: "18:00", closed: false },
    { day: "Tuesday", open: "08:00", close: "18:00", closed: false },
    { day: "Wednesday", open: "08:00", close: "18:00", closed: false },
    { day: "Thursday", open: "08:00", close: "18:00", closed: false },
    { day: "Friday", open: "08:00", close: "18:00", closed: false },
    { day: "Saturday", open: "09:00", close: "13:00", closed: false },
    { day: "Sunday", open: "09:00", close: "13:00", closed: true },
  ]),
  footer_about:
    "Building excellence since 2010. Your trusted partner in construction projects of all sizes.",
};

export type SiteSettings = typeof defaultSettings;

export async function getSettings(): Promise<SiteSettings> {
  try {
    const rows = await prisma.siteSetting.findMany();
    const stored = Object.fromEntries(rows.map((r) => [r.key, r.value]));
    return { ...defaultSettings, ...stored };
  } catch {
    return { ...defaultSettings };
  }
}

export async function updateSetting(key: string, value: string) {
  return prisma.siteSetting.upsert({
    where: { key },
    update: { value },
    create: { key, value },
  });
}
