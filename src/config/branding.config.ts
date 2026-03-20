import type { BrandingConfig } from "./store.types";

export const brandingConfig: BrandingConfig = {
  storeName: "Luxuriant",
  storeTagline: "Satisfaction Our Hallmark",
  logoUrl: "assets/vicky_logo_white.png",
  faviconUrl: "/favicon.ico",

  theme: {
     primaryColor: "#0B0B0B", // deep black (not pure #000 for better UI depth)
  secondaryColor: "#FFFFFF", // clean white background
  accentColor: "#7A7A7A", // neutral grey for subtle elements
  navbarSolidBackgroundColor: "#0B0B0B",
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