import { useState } from "react";
import { storeConfig } from "@/config/store.config";
import { cn } from "@/lib/utils";

interface StoreLogoProps {
  className?: string;
  textClassName?: string;
  alt?: string;
}

const resolveLogoUrl = (logoUrl: string) => {
  const trimmedLogoUrl = logoUrl.trim();
  if (!trimmedLogoUrl) {
    return "";
  }

  const isAbsoluteUrl = /^(?:[a-z][a-z0-9+.-]*:|\/\/)/i.test(trimmedLogoUrl);
  if (trimmedLogoUrl.startsWith("/") || isAbsoluteUrl) {
    return trimmedLogoUrl;
  }

  const normalizedBaseUrl = import.meta.env.BASE_URL.endsWith("/")
    ? import.meta.env.BASE_URL
    : `${import.meta.env.BASE_URL}/`;
  const normalizedPath = trimmedLogoUrl.replace(/^\.?\//, "");

  return `${normalizedBaseUrl}${normalizedPath}`;
};

const StoreLogo = ({ className, textClassName, alt }: StoreLogoProps) => {
  const [hasImageError, setHasImageError] = useState(false);
  const resolvedLogoUrl = resolveLogoUrl(storeConfig.logoUrl);
  const hasLogo = Boolean(resolvedLogoUrl) && !hasImageError;

  if (hasLogo) {
    return (
      <img
        src={resolvedLogoUrl}
        alt={alt ?? storeConfig.storeName}
        className={className}
        onError={() => setHasImageError(true)}
      />
    );
  }

  return (
    <span className={cn("font-display text-[24px] italic text-foreground", textClassName)}>
      {storeConfig.storeName}
    </span>
  );
};

export default StoreLogo;
