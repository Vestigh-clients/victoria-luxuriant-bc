import type { BrandingConfig } from "./store.types";

export const brandingConfig: BrandingConfig = {
  storeName: "Luxuriant",
  storeTagline: "Satisfaction Our Hallmark",
  logoUrl: "assets/vicky_logo_.png",
  faviconUrl: "/favicon.ico",

  theme: {
   primaryColor: "#1F1F1F",
    secondaryColor: "#FFFFFF",
    accentColor: "#8C6239",
    navbarSolidBackgroundColor: "#1F1F1F",
    fontHeading: "'Cormorant Garamond', serif",
    fontBody: "'Inter', system-ui, sans-serif",
    borderRadius: "md",
  },

  adminTheme: {
    primaryColor: "#1F1F1F",
    secondaryColor: "#FFFFFF",
    accentColor: "#767676",
    navbarSolidBackgroundColor: "#1F1F1F",
    fontHeading: "'Cormorant Garamond', serif",
    fontBody: "'Inter', system-ui, sans-serif",
    borderRadius: "sm",
  },

  contact: {
    email: "",
    phone: "0594817032",
    whatsapp: "0594817032",
    address: "",
    city: "Accra",
    country: "Ghana",
  },

  socials: {
    instagram: "Torrie Febri",
    facebook: "Luxuriant",
    twitter: "",
    tiktok: "TORRIE",
  },

  currency: {
    code: "GHS",
    symbol: "GH\u20B5",
    position: "before",
  },

  pages: {
    heroTitle: "Elevate Your Style",
    heroSubtitle: "Shop premium fashion pieces \u2014 shoes, suits, dresses, bags, and more with nationwide delivery",
    heroImageUrl: "/images/fashion-hero.jpg",
    aboutText:
      "Luxuriant is a fashion store offering a curated selection of men\u2019s and women\u2019s wear including shoes, suits, dresses, bags, and hair care products. Designed for style, confidence, and everyday elegance in Ghana.",
  },
};
