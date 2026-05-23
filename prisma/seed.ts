import "dotenv/config";
import { prisma } from "../lib/prisma";
import { defaultSettings } from "../lib/defaults";

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
      { title: "Residential Construction", description: "Comprehensive residential construction services including luxury villas, apartment complexes, and private residences. We bring your dream home to life with meticulous attention to detail and superior craftsmanship.", titleAr: "خدمات البناء السكني", descriptionAr: "خدمات بناء سكني شاملة تشمل الفلل الفاخرة والمجمعات السكنية والمساكن الخاصة. نحقق حلم منزلك بأدق التفاصيل والحرفية العالية.", icon: "Home", order: 1 },
      { title: "Commercial Construction", description: "End-to-end commercial construction solutions for office buildings, retail spaces, factories, and mixed-use developments. Delivered on time and within budget.", titleAr: "خدمات البناء التجاري", descriptionAr: "حلول بناء تجاري شاملة للمباني الإدارية والمساحات التجارية والمصانع والمشاريع متعددة الاستخدامات. نسلم في الوقت المحدد وضمن الميزانية.", icon: "Building", order: 2 },
      { title: "Interior Design & Implementation", description: "Sophisticated interior design solutions tailored to your aesthetic and functional needs, from concept development through to full implementation and finishing.", titleAr: "التصميم الداخلي والتنفيذ", descriptionAr: "حلول تصميم داخلي راقية مصممة خصيصًا لتلبية احتياجاتك الجمالية والوظيفية، من تطوير المفهوم وصولاً إلى التنفيذ الكامل والتشطيب.", icon: "Interior", order: 3 },
      { title: "3D Design Modeling", description: "Professional 3D architectural visualization and modeling services that bring your vision to life before construction begins, enabling informed design decisions.", titleAr: "النمذجة ثلاثية الأبعاد", descriptionAr: "خدمات نمذجة وتصور معماري ثلاثي الأبعاد احترافية تجعل رؤيتك واقعاً قبل بدء البناء، مما يتيح اتخاذ قرارات تصميم مدروسة.", icon: "Design", order: 4 },
      { title: "Project Management", description: "Comprehensive project management services ensuring timely delivery, budget adherence, and quality control across all phases of construction.", titleAr: "إدارة المشاريع", descriptionAr: "خدمات إدارة مشاريع شاملة تضمن التسليم في الوقت المحدد والالتزام بالميزانية ومراقبة الجودة في جميع مراحل البناء.", icon: "Consulting", order: 5 },
      { title: "Engineering Consulting", description: "Professional engineering consulting services covering structural analysis, feasibility studies, and technical supervision for construction projects of all scales.", titleAr: "الاستشارات الهندسية", descriptionAr: "خدمات استشارات هندسية احترافية تشمل التحليل الإنشائي ودراسات الجدوى والإشراف الفني لمشاريع البناء بجميع المقاييس.", icon: "Consulting", order: 6 },
    ],
  });

  await prisma.project.createMany({
    data: [
      { title: "3 Story Villa @ Busaiteen", description: "A luxurious three-story residential villa in the prestigious Busaiteen area, featuring contemporary architectural design with premium finishes and stunning sea views.", titleAr: "فيلا 3 طوابق بالبسيتين", descriptionAr: "فيلا سكنية فاخرة من ثلاثة طوابق في منطقة البسيتين الراقية، تتميز بتصميم معماري عصري مع تشطيبات راقية وإطلالة بحرية خلابة.", images: "[]", category: "residential", featured: true },
      { title: "Khan Alsaboon @ Refaa", description: "A traditional-inspired commercial complex in Refaa, blending heritage architectural elements with modern retail functionality.", titleAr: "خان الصابون بالرفاع", descriptionAr: "مجمع تجاري مستوحى من التراث في الرفاع، يمزج بين العناصر المعمارية التراثية والوظائف التجارية العصرية.", images: "[]", category: "commercial", featured: true },
      { title: "Applied Plastic Factory @ Hidd", description: "Industrial facility construction for an applied plastic manufacturing plant at the Bahrain International Industrial Park in Hidd.", titleAr: "مصنع البلاستيك التطبيقي بالحد", descriptionAr: "إنشاء منشأة صناعية لمصنع بلاستيك تطبيقي في مدينة البحرين الصناعية الدولية بالحد.", images: "[]", category: "commercial", featured: false },
      { title: "4 Story Building @ Refaa", description: "A four-story commercial building in Refaa, designed for mixed-use purposes with modern infrastructure and efficient space planning.", titleAr: "مبنى 4 طوابق بالرفاع", descriptionAr: "مبنى تجاري من أربعة طوابق في الرفاع، مصمم للاستخدامات المتعددة مع بنية تحتية حديثة وتخطيط مساحات فعال.", images: "[]", category: "commercial", featured: false },
      { title: "Zad Pharmacy @ Amwaj", description: "A modern pharmacy retail space at the Cineplex complex in Amwaj Islands, featuring a clean, contemporary design with efficient customer flow.", titleAr: "صيدلية زاد بأمواج", descriptionAr: "صيدلية عصرية في مجمع سينيبلكس بجزر أمواج، تتميز بتصميم نظيف ومعاصر مع تدفق فعال للعملاء.", images: "[]", category: "commercial", featured: false },
      { title: "Pure Fit Gym @ Seef", description: "A state-of-the-art fitness center at Pavillion Mall in the Seef District, with spacious workout areas, premium changing facilities, and modern interiors.", titleAr: "صالة بيور فت بالسيف", descriptionAr: "مركز لياقة بدنية متطور في مول بافيليون بمنطقة السيف، مع مساحات تمرين واسعة ومرافق تغيير راقية وتصميم داخلي عصري.", images: "[]", category: "commercial", featured: false },
      { title: "2 Story Villa @ Qalali", description: "An elegant two-story villa in Qalali, designed with a perfect blend of modern aesthetics and functional living spaces.", titleAr: "فيلا طابقين بالقلالي", descriptionAr: "فيلا أنيقة من طابقين في القلالي، مصممة بمزيج مثالي من الجماليات العصرية ومساحات المعيشة الوظيفية.", images: "[]", category: "residential", featured: false },
      { title: "2 Story Villa @ Saar", description: "A contemporary two-story villa in the serene Saar area, featuring open-plan living areas and high-quality finishes throughout.", titleAr: "فيلا طابقين بسار", descriptionAr: "فيلا عصرية من طابقين في منطقة سار الهادئة، تتميز بمساحات معيشة مفتوحة وتشطيبات عالية الجودة في جميع الأنحاء.", images: "[]", category: "residential", featured: false },
      { title: "Park View @ Hidd", description: "A residential development in Hidd offering modern apartments with park views, landscaped surroundings, and community amenities.", titleAr: "بارك فيو بالحد", descriptionAr: "مشروع سكني في الحد يقدم شققاً عصرية مع إطلالة على الحديقة ومحيط طبيعي ومرافق مجتمعية.", images: "[]", category: "residential", featured: true },
      { title: "3 Story Villa @ Diyar Muharaq", description: "A magnificent three-story villa in the Diyar Al Muharraq development, combining luxury living with coastal lifestyle.", titleAr: "فيلا 3 طوابق بدوار المحرق", descriptionAr: "فيلا رائعة من ثلاثة طوابق في مشروع ديار المحرق، تجمع بين السكن الفاخر وأسلوب الحياة الساحلي.", images: "[]", category: "residential", featured: false },
      { title: "4 Story Building @ Hidd", description: "A four-story commercial building in Hidd, strategically located for business operations with modern facilities and ample parking.", titleAr: "مبنى 4 طوابق بالحد", descriptionAr: "مبنى تجاري من أربعة طوابق في الحد، موقع استراتيجي للعمليات التجارية مع مرافق حديثة ومواقف سيارات واسعة.", images: "[]", category: "commercial", featured: false },
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
