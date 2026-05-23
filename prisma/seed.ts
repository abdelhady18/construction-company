import "dotenv/config";
import { prisma } from "../lib/prisma";
import { defaultSettings } from "../lib/settings";

async function main() {
  for (const [key, value] of Object.entries(defaultSettings)) {
    await prisma.siteSetting.upsert({
      where: { key },
      update: { value },
      create: { key, value },
    });
  }

  await prisma.service.deleteMany();
  await prisma.project.deleteMany();
  await prisma.teamMember.deleteMany();

  await prisma.service.createMany({
    data: [
      { title: "Architectural Design", description: "Comprehensive architectural planning and design services for residential, commercial, and industrial projects.", titleAr: "التصميم المعماري", descriptionAr: "خدمات التخطيط والتصميم المعماري الشاملة للمشاريع السكنية والتجارية والصناعية.", icon: "Building2", order: 1 },
      { title: "Construction Management", description: "End-to-end project management ensuring timely delivery, budget adherence, and quality control.", titleAr: "إدارة الإنشاءات", descriptionAr: "إدارة مشاريع شاملة تضمن التسليم في الوقت المحدد والالتزام بالميزانية ومراقبة الجودة.", icon: "HardHat", order: 2 },
      { title: "Renovation & Restoration", description: "Expert renovation and historical restoration services that blend modern comfort with original character.", titleAr: "التجديد والترميم", descriptionAr: "خدمات تجديد وترميم تاريخية خبيرة تمزج بين الراحة الحديثة والطابع الأصلي.", icon: "Paintbrush", order: 3 },
      { title: "Interior Design", description: "Sophisticated interior design solutions tailored to your aesthetic and functional needs.", titleAr: "التصميم الداخلي", descriptionAr: "حلول تصميم داخلي راقية مصممة خصيصًا لتلبية احتياجاتك الجمالية والوظيفية.", icon: "Layers", order: 4 },
      { title: "Structural Engineering", description: "Structural analysis and engineering for safe, durable, and cost-effective buildings.", titleAr: "الهندسة الإنشائية", descriptionAr: "تحليل وهندسة إنشائية لمباني آمنة ومتينة وفعالة من حيث التكلفة.", icon: "Ruler", order: 5 },
      { title: "Sustainable Building", description: "Eco-friendly construction solutions with energy-efficient designs and sustainable materials.", titleAr: "البناء المستدام", descriptionAr: "حلول بناء صديقة للبيئة بتصاميم موفرة للطاقة ومواد مستدامة.", icon: "Leaf", order: 6 },
    ],
  });

  await prisma.project.createMany({
    data: [
      { title: "Al-Noor Tower", description: "A 25-story commercial tower featuring a striking glass facade and sustainable energy systems.", titleAr: "برج النور", descriptionAr: "برج تجاري من 25 طابقًا يتميز بواجهة زجاجية ملفتة وأنظمة طاقة مستدامة.", images: "[]", category: "commercial", featured: true },
      { title: "Green Valley Residences", description: "A luxury residential community with 120 units, landscaped gardens, and a central community hub.", titleAr: "مساكن الوادي الأخضر", descriptionAr: "مجتمع سكني فاخر يضم 120 وحدة وحدائق طبيعية ومنصة مجتمعية مركزية.", images: "[]", category: "residential", featured: true },
      { title: "Riverside Plaza", description: "Mixed-use development combining retail, office, and entertainment spaces along the riverfront.", titleAr: "بلازا الواجهة النهرية", descriptionAr: "تطوير متعدد الاستخدامات يجمع بين المساحات التجارية والمكتبية والترفيهية على الواجهة النهرية.", images: "[]", category: "commercial", featured: false },
      { title: "Heritage Hotel", description: "Restoration and expansion of a historic building into a 5-star boutique hotel.", titleAr: "فندق التراث", descriptionAr: "ترميم وتوسيع مبنى تاريخي ليصبح فندقًا بوتيكيًا من فئة 5 نجوم.", images: "[]", category: "hospitality", featured: false },
    ],
  });

  await prisma.teamMember.createMany({
    data: [
      { name: "Ahmed Hassan", role: "CEO & Founder", nameAr: "أحمد حسن", roleAr: "الرئيس التنفيذي والمؤسس", order: 1 },
      { name: "Layla Mahmoud", role: "Lead Architect", nameAr: "ليلى محمود", roleAr: "كبيرة المهندسين المعماريين", order: 2 },
      { name: "Khaled Ibrahim", role: "Project Manager", nameAr: "خالد إبراهيم", roleAr: "مدير المشاريع", order: 3 },
      { name: "Nadia Yousef", role: "Interior Designer", nameAr: "نادية يوسف", roleAr: "مصممة داخلية", order: 4 },
      { name: "Omar Farouk", role: "Structural Engineer", nameAr: "عمر فاروق", roleAr: "مهندس إنشائي", order: 5 },
      { name: "Sara Amin", role: "Sustainability Consultant", nameAr: "سارة أمين", roleAr: "مستشارة الاستدامة", order: 6 },
    ],
  });

  console.log("Database seeded successfully.");
}

main()
  .catch((e) => {
    console.error("Seed failed:", e);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());
