import { Facebook, Instagram, MessageCircle } from "lucide-react";
import { Link } from "react-router-dom";
import StoreLogo from "@/components/StoreLogo";
import { storeConfig } from "@/config/store.config";
import { getWhatsAppContactLink } from "@/lib/contact";

interface FooterSocialLink {
  label: string;
  href: string;
}

const socialLinkClass =
  "flex w-fit cursor-pointer items-center gap-2 font-body text-sm text-primary-foreground/70 transition-all duration-300 hover:-translate-y-[2px] hover:text-accent";

const footerLinkClass =
  "w-fit cursor-pointer font-body text-sm text-primary-foreground/70 transition-all duration-300 hover:-translate-y-[2px] hover:text-accent";

const Footer = () => {
  const socialLinks: FooterSocialLink[] = [
    { label: "Instagram", href: storeConfig.socials.instagram },
    { label: "Facebook", href: storeConfig.socials.facebook },
    { label: "TikTok", href: storeConfig.socials.tiktok },
  ].filter((entry) => Boolean(entry.href.trim()));

  return (
    <footer className="border-t border-[rgba(var(--color-secondary-rgb),0.16)] bg-primary text-primary-foreground">
      <div className="container mx-auto px-4 py-16">
        <div className="grid grid-cols-1 gap-10 md:grid-cols-4">
          <div className="md:col-span-1">
            <div className="mb-2">
              <StoreLogo className="h-9 w-auto" textClassName="text-2xl font-bold tracking-wider text-primary-foreground" />
            </div>
            <p className="mb-3 font-body text-xs italic text-primary-foreground/60">{storeConfig.storeTagline}</p>
            <p className="font-body text-sm leading-relaxed text-primary-foreground/70">
              Luxury fashion essentials, curated for your store.
            </p>
          </div>

          <div>
            <h4 className="mb-4 font-display text-sm font-medium uppercase tracking-[0.14em]">Shop</h4>
            <div className="flex flex-col gap-2">
              <Link to="/category/hair-care" className={footerLinkClass}>
                Hair Care
              </Link>
              <Link to="/category/mens-fashion" className={footerLinkClass}>
                Men's Fashion
              </Link>
              <Link to="/category/womens-fashion" className={footerLinkClass}>
                Women's Fashion
              </Link>
              <Link to="/category/bags" className={footerLinkClass}>
                Bags
              </Link>
              <Link to="/category/shoes" className={footerLinkClass}>
                Shoes
              </Link>
            </div>
          </div>

          <div>
            <h4 className="mb-4 font-display text-sm font-medium uppercase tracking-[0.14em]">Company</h4>
            <div className="flex flex-col gap-2">
              <Link to="/about" className={footerLinkClass}>
                About
              </Link>
              <Link to="/contact" className={footerLinkClass}>
                Contact
              </Link>
            </div>
          </div>

          <div>
            <h4 className="mb-4 font-display text-sm font-medium uppercase tracking-[0.14em]">Connect</h4>
            <div className="flex flex-col gap-3">
              {storeConfig.contact.whatsapp ? (
                <a href={getWhatsAppContactLink()} target="_blank" rel="noopener noreferrer" className={socialLinkClass}>
                  <MessageCircle size={16} />
                  WhatsApp: {storeConfig.contact.whatsapp}
                </a>
              ) : null}
              {storeConfig.contact.email ? (
                <a href={`mailto:${storeConfig.contact.email}`} className={socialLinkClass}>
                  Email: {storeConfig.contact.email}
                </a>
              ) : null}
              {socialLinks.map((social) => (
                <a key={social.label} href={social.href} target="_blank" rel="noopener noreferrer" className={socialLinkClass}>
                  {social.label === "Instagram" ? <Instagram size={16} /> : null}
                  {social.label === "Facebook" ? <Facebook size={16} /> : null}
                  {social.label === "TikTok" ? (
                    <span className="inline-flex h-4 min-w-[18px] items-center justify-center rounded-full border border-[rgba(var(--color-secondary-rgb),0.35)] px-1 text-[10px] leading-none text-primary-foreground/80">
                      T
                    </span>
                  ) : null}
                  {social.label}
                </a>
              ))}
            </div>
          </div>
        </div>

        <div className="mt-12 border-t border-[rgba(var(--color-secondary-rgb),0.1)] pt-8 text-center">
          <p className="font-body text-xs text-primary-foreground/50">
            &copy; {new Date().getFullYear()} {storeConfig.storeName}. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
