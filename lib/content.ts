export type Lang = "he" | "en";

export const REGISTRATION_URL = "https://www.stki.info/stki-summit2026";
// TODO: confirm real contact email with STKI before launch
export const SPONSOR_COORDINATION_EMAIL = "sari@stki.info";
export const STKI_WHATSAPP_URL = "https://wa.me/972547000027";
export const STKI_PHONE = "0547000027";

export const VISION_STUDIO_EMAIL = "visionaiacreative@gmail.com";
export const VISION_STUDIO_PHONE = "0523894499";
export const VISION_STUDIO_WHATSAPP_URL = "https://wa.me/972523894499";
export const VISION_STUDIO_INSTAGRAM_URL =
  "https://www.instagram.com/visionaicreative?igsh=NzNiaWYyZW5idmMw&utm_source=qr";

export function formatPhone(digits: string) {
  return `${digits.slice(0, 3)}-${digits.slice(3, 6)}-${digits.slice(6)}`;
}

export const content = {
  meta: {
    he: {
      title: "STKI Summit 2026 | ועידת ה-IT השנתית של ישראל",
      description:
        "האירוע השנתי המשמעותי ביותר בקרב קהילת ה-IT בישראל. 9 בנובמבר 2026, חוות רונית.",
    },
    en: {
      title: "STKI Summit 2026 | Israel's Premier IT Conference",
      description:
        "The most significant annual event for Israel's IT community. November 9, 2026, Ronit Farm.",
    },
  },
  nav: {
    he: {
      languageToggleLabel: "EN",
      links: [
        { id: "about", label: "אודות" },
        { id: "audience", label: "קהל" },
        { id: "tech-talk", label: "Tech Talk" },
        { id: "gallery", label: "גלריה" },
        { id: "sponsorship", label: "חסויות" },
        { id: "info", label: "מידע" },
      ],
    },
    en: {
      languageToggleLabel: "עב",
      links: [
        { id: "about", label: "About" },
        { id: "audience", label: "Audience" },
        { id: "tech-talk", label: "Tech Talk" },
        { id: "gallery", label: "Gallery" },
        { id: "sponsorship", label: "Sponsors" },
        { id: "info", label: "Info" },
      ],
    },
  },
  impact: {
    he: {
      yearsLabel: "שנה.",
      decisionMakersLabel: "בכירים.",
      oneSummit: "כנס אחד.",
    },
    en: {
      yearsLabel: "Years.",
      decisionMakersLabel: "Executives.",
      oneSummit: "One Summit.",
    },
  },
  hero: {
    he: {
      eyebrow: "STKI Summit 2026",
      headline: "האירוע השנתי המשמעותי ביותר בקרב קהילת ה-IT בישראל.",
      subheadline:
        "כנס זה מהווה מוקד משיכה לבכירי תעשיית מערכות המידע ומאגד כבר 34 שנים את צמרת המנהלים מהחברות המובילות בישראל.",
      body: "תובנות אסטרטגיות של ד״ר ג׳ימי שוורצקוף וצוות האנליסטים של STKI מסייעות למקבלי החלטות לבנות יתרון תחרותי אמיתי.",
    },
    en: {
      eyebrow: "STKI Summit 2026",
      headline: "The Most Significant Annual Event in Israel's IT Community.",
      subheadline:
        "This conference is a magnet for senior IT industry leaders, gathering the top executives from Israel's leading companies for 34 years running.",
      body: "Strategic insights from Dr. Jimmy Schwarzkopf and the STKI analyst team help decision-makers build real competitive advantage.",
    },
  },
  about: {
    he: {
      title: "אודות הכנס",
      body: "STKI מלווה את שוק ה-IT הישראלי מזה 34 שנה. ד״ר ג׳ימי שוורצקוף וצוות האנליסטים חושפים בכנס תובנות אסטרטגיות שמניעות החלטות אמיתיות, לא תיאוריה, אלא כלים לבניית יתרון תחרותי. הכנס מציע חוויה מוקפדת, מקצועית ובלתי מתפשרת: תוכן ברמה הגבוהה ביותר, עיצוב מוקפד, אוכל מצוין ואווירה שמקדמת חיבורים אמיתיים.",
      stat1Value: "34",
      stat1Label: "שנות מחקר והובלת תעשייה",
      stat2Value: "1,500+",
      stat2Label: "האנשים הבכירים בשוק מערכות המידע בישראל",
      stat3Value: "7",
      stat3Label: "דקות על במת ה-Tech Talk",
    },
    en: {
      title: "About the Summit",
      body: "STKI has guided Israel's IT market for 34 years. Dr. Jimmy Schwarzkopf and the STKI analyst team reveal strategic insights that drive real decisions, not theory, but tools for building genuine competitive advantage. The summit delivers a meticulous, professional, uncompromising experience: top-tier content, careful design, excellent food, and an atmosphere that fosters real connections.",
      stat1Value: "34",
      stat1Label: "years of research & industry leadership",
      stat2Value: "1,500+",
      stat2Label: "the most senior people in Israel's IT market",
      stat3Value: "7",
      stat3Label: "minutes on the Tech Talk stage",
    },
  },
  audience: {
    he: {
      title: "קהל המשתתפים",
      body: "צמרת המנהלים מהחברות המובילות בישראל, לצד אורחי כבוד ממשרדי הממשלה והמגזר הציבורי, כ-1,500 מהאנשים הבכירים ביותר בשוק מערכות המידע בישראל.",
      sectors: [
        "משרד הביטחון",
        "משרדי ממשלה",
        "בנקים",
        "חברות ביטוח",
        "חברות סלולר",
        "פארמה",
        "נמלים",
        "הייטק",
      ],
    },
    en: {
      title: "Attendees",
      body: "Top executives from Israel's leading companies, alongside guests of honor from government ministries and the public sector, roughly 1,500 of the most senior people in Israel's IT market.",
      sectors: [
        "Ministry of Defense",
        "Government Ministries",
        "Banks",
        "Insurance",
        "Cellular Carriers",
        "Pharma",
        "Ports",
        "Hi-Tech",
      ],
    },
  },
  techTalk: {
    he: {
      badge: "גם השנה",
      title: "Tech Talk",
      unit: "דקות",
      body: "מתחם ייעודי להצגת פתרון או מוצר בעולם ה-AI, במשך 7 דקות ובליווי אנליסט STKI.",
      bullets: ["7 דקות על הבמה", "ליווי אנליסט STKI", "ממוקד בעולם ה-AI"],
    },
    en: {
      badge: "Back this year",
      title: "Tech Talk",
      unit: "minutes",
      body: "A dedicated stage where you can present an AI-world solution or product in 7 minutes, accompanied by an analyst from the STKI research team.",
      bullets: ["7 minutes on stage", "Paired with an STKI analyst", "Focused on AI"],
    },
  },
  gallery: {
    he: {
      eyebrow: "Experience STKI",
      title: "יותר מאירוע, חוויה עסקית.",
    },
    en: {
      eyebrow: "Experience STKI",
      title: "More than an event, a business experience.",
    },
  },
  sponsorship: {
    he: {
      eyebrow: "לנותני חסות",
      title: "הטבה בלעדית לנותני חסות",
      body: "מחפשים סיפור מעניין או חדשני לחשיפה תקשורתית סביב הכנס?",
      body2: "מוצר חדש, טכנולוגיה פורצת דרך, מחקר ייחודי, יוזמה יצירתית, או כל סיפור שקשור לטכנולוגיה, ביטחון, כלכלה, חברה ישראלית או בינה מלאכותית.",
      body3: "נשמח לחבר אתכם לחברת יחסי הציבור המלווה את הכנס, לבחון הזדמנויות לכתבות, ראיונות וחשיפה תקשורתית, לפני הכנס ובמהלכו, ללא עלות.",
      badge: "ללא עלות",
      points: ["כתבות וראיונות", "לפני הכנס ובמהלכו", "חשיפה תקשורתית רחבה"],
    },
    en: {
      eyebrow: "For Sponsors",
      title: "Exclusive Sponsor Benefit",
      body: "Have an interesting or innovative story for media exposure around the conference?",
      body2: "A new product reveal, breakthrough technology, unique research, a creative initiative, or any story tied to technology, security, the economy, Israeli society, or AI.",
      body3: "We'll connect you with the PR agency running press activity for the conference, to explore article, interview, and press opportunities before and during the event, at no cost.",
      badge: "No Cost",
      points: ["Articles & interviews", "Before & during the summit", "Wide media exposure"],
    },
  },
  infoGrid: {
    he: {
      title: "הזדמנויות חסות",
      body: "הצטרפו לחברות המובילות והציגו את המותג שלכם בכנס STKI Summit 2026.",
      cta: "בחרו את מסלול החסות שלכם",
    },
    en: {
      title: "Sponsorship Opportunities",
      body: "Join the leading companies and showcase your brand at STKI Summit 2026.",
      cta: "Choose your sponsorship track",
    },
  },
  eventBar: {
    he: {
      dateLabel: "תאריך",
      dateValue: "9 בנובמבר 2026",
      venueLabel: "מיקום",
      venueValue: "חוות רונית",
      eyebrow: "דברו איתנו",
      ctaLabel: "לפרטים וליצירת קשר",
      whatsappLabel: "וואטסאפ",
      emailLabel: "מייל",
    },
    en: {
      dateLabel: "Date",
      dateValue: "November 9, 2026",
      venueLabel: "Venue",
      venueValue: "Ronit Farm",
      eyebrow: "Talk to us",
      ctaLabel: "Details & Get in Touch",
      whatsappLabel: "WhatsApp",
      emailLabel: "Email",
    },
  },
  visionCredit: {
    he: {
      builtBy: "האתר נבנה על ידי",
      copyright: "© 2026 VISION AI STUDIO. כל הזכויות שמורות.",
    },
    en: {
      builtBy: "Site built by",
      copyright: "© 2026 VISION AI STUDIO. All rights reserved.",
    },
  },
} as const;
