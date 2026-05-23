import { cache } from "react";
import { prisma } from "./prisma";

export const defaultSettings = {
  company_name: "BuildCo",
  company_tagline: "Building Your Vision With Excellence",
  company_tagline_ar: "نبني رؤيتك بتميز",
  company_description:
    "From concept to completion, we deliver exceptional construction projects that stand the test of time. Your trusted partner in building the future.",
  company_description_ar:
    "من الفكرة إلى الإنجاز، نقدم مشاريع بناء استثنائية تصمد أمام اختبار الزمن. شريكك الموثوق في بناء المستقبل.",
  about_title: "About Us",
  about_title_ar: "من نحن",
  about_subtitle: "Dedicated to delivering superior construction services since 2010",
  about_subtitle_ar: "ملتزمون بتقديم خدمات بناء متميزة منذ 2010",
  about_story:
    "Founded in 2010, BuildCo has grown from a small local contractor to one of the region's most trusted construction companies. We pride ourselves on quality craftsmanship, innovative solutions, and unwavering commitment to client satisfaction.",
  about_story_ar:
    "تأسست BuildCo في عام 2010، ونمت من مقاول محلي صغير إلى إحدى شركات البناء الأكثر ثقة في المنطقة. نفخر بالحرفية عالية الجودة والحلول المبتكرة والالتزام الثابت برضا العملاء.",
  about_story_2:
    "Every project we undertake is a partnership. We listen, plan, and execute with precision, ensuring your vision becomes reality. Our team of experts brings decades of combined experience to every job.",
  about_story_2_ar:
    "كل مشروع ننفذه هو شراكة. نستمع ونخطط وننفذ بدقة، لنضمن تحقيق رؤيتك على أرض الواقع. فريقنا من الخبراء يمتلك عقوداً من الخبرة المدمجة في كل مهمة.",
  contact_title: "Contact Us",
  contact_title_ar: "اتصل بنا",
  contact_subtitle: "Ready to start your project? Get in touch with us today",
  contact_subtitle_ar: "مستعد لبدء مشروعك؟ تواصل معنا اليوم",
  contact_address: "123 Construction Ave, Building District, NY 10001",
  contact_address_ar: "123 شارع البناء، حي المباني، نيويورك 10001",
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
  about_stats: JSON.stringify([
    { value: "15+", label: "Years Experience" },
    { value: "200+", label: "Projects Completed" },
    { value: "50+", label: "Expert Team" },
    { value: "98%", label: "Client Satisfaction" },
  ]),
  about_stats_ar: JSON.stringify([
    { value: "15+", label: "سنوات خبرة" },
    { value: "200+", label: "مشروع مكتمل" },
    { value: "50+", label: "فريق خبير" },
    { value: "98%", label: "رضا العملاء" },
  ]),
  footer_about:
    "Building excellence since 2010. Your trusted partner in construction projects of all sizes.",
  footer_about_ar:
    "نبني التميز منذ 2010. شريكك الموثوق في مشاريع البناء بجميع أحجامها.",
};

export type SiteSettings = typeof defaultSettings;

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
