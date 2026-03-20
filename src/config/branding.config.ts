import type { BrandingConfig } from "./store.types";

export const brandingConfig: BrandingConfig = {
  storeName: "Luxuriant",
  storeTagline: "Satisfaction Our Hallmark",
  logoUrl: "assets/vicky_logo_white.png",
  faviconUrl: "/favicon.ico",

  theme: {
    primaryColor: "#243843", // main dark teal panel
    secondaryColor: "#F2F2F2", // light background from top section
    accentColor: "#6B7C85", // soft neutral accent from UI elements
    navbarSolidBackgroundColor: "#243843",
    fontHeading: "Playfair Display", // matches elegant brand feel
    fontBody: "Inter",
    borderRadius: "xl", // rounded cards in service grid
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