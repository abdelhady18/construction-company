export const defaultSettings = {
  company_name: "Abu Suhaib Construction",
  company_name_ar: "أبو صهيب للمقاولات",
  company_tagline: "Building Bahrain With Excellence",
  company_tagline_ar: "نبني البحرين بإتقان",
  company_description:
    "From our headquarters in Bahrain, we deliver exceptional construction projects across all sectors. With nearly two decades of expertise in luxury villas, commercial developments, design & build, and landscape architecture, we are your trusted partner in building excellence.",
  company_description_ar:
    "من مقرنا في البحرين، نقدم مشاريع بناء استثنائية في جميع القطاعات. مع ما يقرب من عقدين من الخبرة في الفلل الفاخرة والمشاريع التجارية والتصميم والبناء وهندسة المناظر الطبيعية، نحن شريكك الموثوق في بناء التميز.",
  about_title: "About Us",
  about_title_ar: "من نحن",
  about_subtitle: "Serving Bahrain with distinction since 2006",
  about_subtitle_ar: "نخدم البحرين بتميز منذ 2006",
  about_story:
    "Founded in 2006 with our head office in the Kingdom of Bahrain, Abu Suhaib Construction has established itself as a trusted name in the construction industry. We carry out all types of construction, with particular expertise in luxury villas, residential developments, and commercial projects. Our qualified team of engineers, designers, and project managers brings decades of combined experience to every project, ensuring the highest standards of quality and craftsmanship.",
  about_story_ar:
    "تأسست شركة أبو صهيب للمقاولات عام 2006 ومقرها الرئيسي في مملكة البحرين، وأثبتت نفسها كاسم موثوق في صناعة البناء والتشييد. نقوم بجميع أنواع البناء، مع خبرة خاصة في الفلل الفاخرة والمشاريع السكنية والتجارية. فريقنا المؤهل من المهندسين والمصممين ومديري المشاريع يمتلك عقوداً من الخبرة المدمجة في كل مشروع، مما يضمن أعلى معايير الجودة والحرفية.",
  about_story_2:
    "We specialize in design and build services, offering comprehensive solutions from concept to completion. Our integrated approach combines architectural vision with practical execution, while our landscape design services transform outdoor spaces into breathtaking environments. At Abu Suhaib Construction, every project is a partnership built on trust, transparency, and unwavering commitment to client satisfaction.",
  about_story_2_ar:
    "نتميز في خدمات التصميم والبناء، ونقدم حلولاً شاملة من الفكرة إلى الإنجاز. يجمع نهجنا المتكامل بين الرؤية المعمارية والتنفيذ العملي، بينما تحول خدمات تنسيق الحدائق المساحات الخارجية إلى بيئات خلابة. في أبو صهيب للمقاولات، كل مشروع هو شراكة مبنية على الثقة والشفافية والالتزام الثابت برضا العملاء.",
  contact_title: "Contact Us",
  contact_title_ar: "اتصل بنا",
  contact_subtitle: "Ready to start your project? Get in touch with us today",
  contact_subtitle_ar: "مستعد لبدء مشروعك؟ تواصل معنا اليوم",
  contact_address: "Bahrain",
  contact_address_ar: "البحرين",
  contact_phone: "13620805",
  contact_email: "abunram@gmail.com",
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
    { value: "20+", label: "Years Experience" },
    { value: "50+", label: "Projects Completed" },
    { value: "15+", label: "Expert Team" },
    { value: "100%", label: "Client Satisfaction" },
  ]),
  about_stats_ar: JSON.stringify([
    { value: "20+", label: "سنة خبرة" },
    { value: "50+", label: "مشروع مكتمل" },
    { value: "15+", label: "فريق خبير" },
    { value: "100%", label: "رضا العملاء" },
  ]),
  footer_about:
    "Building excellence in Bahrain since 2006. Your trusted partner in construction projects of all sizes.",
  footer_about_ar:
    "نبني التميز في البحرين منذ 2006. شريكك الموثوق في مشاريع البناء بجميع أحجامها.",
};

export type SiteSettings = typeof defaultSettings;
