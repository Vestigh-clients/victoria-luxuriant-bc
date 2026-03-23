import type { BrandingConfig } from "./store.types";

export const brandingConfig: BrandingConfig = {
  storeName: "Luxuriant",
  storeTagline: "Satisfaction Our Hallmark",
  logoUrl: "assets/vicky_logo_blue.png",
  faviconUrl: "/favicon.ico",

theme: {
  primaryColor: "#F2EAE0",
  secondaryColor: "#181411",
  accentColor: "#D3BC95",
  navbarSolidBackgroundColor: "#1B1714",
  fontHeading: "Inter",
  fontBody: "Inter",
  borderRadius: "lg",
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
    heroSubtitle:
      "Shop premium fashion pieces — shoes, suits, dresses, bags, and more with nationwide delivery",
    heroImageUrl: "/images/fashion-hero.jpg",
    aboutText:
      "Luxuriant is a fashion store offering a curated selection of men’s and women’s wear including shoes, suits, dresses, bags, and hair care products. Designed for style, confidence, and everyday elegance in Ghana.",
  },
};
