import { useEffect, useMemo, useState, type CSSProperties, type MouseEvent } from "react";
import { Link } from "react-router-dom";
import ProductImagePlaceholder from "@/components/products/ProductImagePlaceholder";
import { useCart } from "@/contexts/CartContext";
import { formatPrice } from "@/lib/price";
import { getProductColorHexes, getStockQuantity, isInStock, type Product } from "@/types/product";

interface ShopProductCardProps {
  product: Product;
  variant?: "standard" | "lifestyle";
  surface?: "default" | "catalog";
  size?: "regular" | "banner";
}

const clamp = (value: number, min: number, max: number) => Math.min(max, Math.max(min, value));

const ShopProductCard = ({ product, variant = "standard", surface = "default" }: ShopProductCardProps) => {
  const { addToCart, openCart } = useCart();
  const images = useMemo(() => (Array.isArray(product.images) ? product.images : []), [product.images]);
  const primaryImage = useMemo(() => images.find((image) => image.is_primary) ?? images[0] ?? null, [images]);
  const secondaryImage = useMemo(
    () => images.find((image) => image.url !== (primaryImage?.url ?? "")) ?? primaryImage,
    [images, primaryImage],
  );
  const selectedImage = variant === "lifestyle" ? secondaryImage : primaryImage;
  const imageUrl = selectedImage?.url ?? "";
  const imageAlt = selectedImage?.alt_text?.trim() || product.name;
  const [hasImageError, setHasImageError] = useState(false);
  const isOutOfStock = !isInStock(product);
  const stockQuantity = getStockQuantity(product);
  const hasVariants = product.has_variants === true;
  const colorHexes = useMemo(() => getProductColorHexes(product), [product]);
  const visibleColorHexes = colorHexes.slice(0, 4);
  const remainingColorCount = Math.max(0, colorHexes.length - visibleColorHexes.length);
  const hasVisibleSwatches = visibleColorHexes.length > 0;
  const productUrl = `/shop/${product.slug}`;
  const isCatalogSurface = surface === "catalog";
  const cartImageUrl = primaryImage?.url ?? imageUrl;
  const cartImageAlt = primaryImage?.alt_text?.trim() || product.name;

  useEffect(() => {
    setHasImageError(false);
  }, [imageUrl, product.id]);

  const swatches = hasVisibleSwatches ? (
    <div className="flex items-center gap-1.5">
      {visibleColorHexes.map((colorHex) => (
        <span
          key={`${product.id}-${colorHex}`}
          className="inline-flex h-[15px] w-[15px] rounded-full border border-[rgba(var(--color-primary-rgb),0.2)]"
          style={{ backgroundColor: colorHex }}
        />
      ))}
      {remainingColorCount > 0 ? (
        <span className="font-body text-[11px] font-medium text-[var(--color-muted-soft)]">+{remainingColorCount}</span>
      ) : null}
    </div>
  ) : (
    <span className="block h-[15px]" />
  );

  const baseScale = useMemo(() => {
    const fallbackScale = variant === "lifestyle" ? 1.04 : isCatalogSurface ? 1.02 : 1;
    if (typeof selectedImage?.catalog_zoom !== "number") {
      return fallbackScale;
    }

    return clamp(selectedImage.catalog_zoom, 1, 1.35);
  }, [isCatalogSurface, selectedImage?.catalog_zoom, variant]);

  const hoverScale = useMemo(() => {
    if (!isCatalogSurface) {
      return baseScale;
    }

    const delta = variant === "lifestyle" ? 0.04 : 0.05;
    return clamp(baseScale + delta, 1.02, 1.4);
  }, [baseScale, isCatalogSurface, variant]);

  const mediaImageStyle = useMemo(
    () =>
      ({
        objectPosition: selectedImage?.catalog_position ?? (isCatalogSurface && variant === "standard" ? "center top" : "center center"),
        ["--catalog-image-scale" as const]: String(baseScale),
        ["--catalog-image-hover-scale" as const]: String(hoverScale),
      }) as CSSProperties,
    [baseScale, hoverScale, isCatalogSurface, selectedImage?.catalog_position, variant],
  );

  const hoverScrim = isCatalogSurface ? (
    <div
      aria-hidden="true"
      className="pointer-events-none absolute inset-x-0 bottom-0 h-24 bg-[linear-gradient(to_top,rgba(var(--color-secondary-rgb),0.6),rgba(var(--color-secondary-rgb),0))] opacity-0 transition-opacity duration-300 ease-out group-hover:opacity-100 group-focus-within:opacity-100"
    />
  ) : null;

  const handleCatalogAddToCart = (event: MouseEvent<HTMLButtonElement>) => {
    event.preventDefault();
    event.stopPropagation();

    if (hasVariants || isOutOfStock) {
      return;
    }

    addToCart({
      product_id: product.id,
      name: product.name,
      slug: product.slug,
      category: product.categories?.name ?? "Product",
      price: product.price,
      compare_at_price: product.compare_at_price ?? null,
      image_url: cartImageUrl,
      image_alt: cartImageAlt,
      sku: product.sku ?? null,
      stock_quantity: stockQuantity,
      variant_id: null,
      variant_label: null,
    });
    openCart();
  };

  const catalogCtaClass = "lux-btn-primary lux-btn-compact pointer-events-auto w-full max-w-[280px]";

  if (isCatalogSurface) {
    return (
      <article className="h-full bg-[var(--color-secondary)] p-1">
        <div className="group lux-surface-card relative flex h-full min-h-[340px] flex-col overflow-hidden text-current md:min-h-[460px]">
          <Link
            to={productUrl}
            aria-label={`View ${product.name}`}
            className="absolute inset-0 z-10 cursor-pointer focus-visible:outline-none"
          />

          <div className="relative flex min-h-[280px] flex-1 items-stretch justify-center overflow-hidden bg-[rgba(var(--color-primary-rgb),0.02)] md:min-h-[370px]">
            {hasVisibleSwatches ? <div className="absolute right-4 top-4 z-20">{swatches}</div> : null}

            {imageUrl && !hasImageError ? (
              <img
                src={imageUrl}
                alt={imageAlt}
                className="[transform:scale(var(--catalog-image-scale,1.02))] h-full w-full object-cover transition-transform duration-500 ease-out group-hover:[transform:scale(var(--catalog-image-hover-scale,1.07))] group-focus-within:[transform:scale(var(--catalog-image-hover-scale,1.07))]"
                loading="lazy"
                style={mediaImageStyle}
                onError={() => setHasImageError(true)}
              />
            ) : (
              <div className="flex h-full w-full items-center justify-center bg-[rgba(var(--color-primary-rgb),0.03)] p-6 md:p-8">
                <ProductImagePlaceholder className="h-full w-full max-w-[220px]" />
              </div>
            )}

            {hoverScrim}

            <div className="pointer-events-none absolute inset-x-4 bottom-4 z-20 flex translate-y-0 justify-center opacity-100 transition-all duration-300 ease-out md:translate-y-3 md:opacity-0 md:group-hover:translate-y-0 md:group-hover:opacity-100 md:group-focus-within:translate-y-0 md:group-focus-within:opacity-100">
              {hasVariants ? (
                <Link to={productUrl} className={catalogCtaClass}>
                  CHOOSE OPTIONS
                </Link>
              ) : (
                <button
                  type="button"
                  onClick={handleCatalogAddToCart}
                  disabled={isOutOfStock}
                  className={`${catalogCtaClass} ${isOutOfStock ? "cursor-not-allowed opacity-60" : "cursor-pointer"}`}
                >
                  ADD TO CART
                </button>
              )}
            </div>
          </div>

          <div className="px-4 pb-5 pt-4 text-center">
            <p className="font-body text-[13px] font-medium leading-[1.45] text-[var(--color-primary)] md:text-[14px]">
              {product.name}
            </p>
            <p className="mt-1 font-body text-[13px] text-[var(--color-muted)] md:text-[14px]">{formatPrice(product.price)}</p>
            {isOutOfStock ? (
              <p className="mt-2 font-body text-[11px] font-medium text-[var(--color-muted-soft)]">Out of stock</p>
            ) : null}
          </div>
        </div>
      </article>
    );
  }

  if (variant === "lifestyle") {
    return (
      <article className="h-full bg-[var(--color-secondary)] p-1">
        <Link to={productUrl} className="group lux-surface-card flex h-full min-h-[340px] flex-col overflow-hidden text-current md:min-h-[460px]">
          <div className="relative flex min-h-[280px] flex-1 items-stretch justify-center overflow-hidden bg-[rgba(var(--color-primary-rgb),0.03)]">
            <div className="absolute right-4 top-4 z-10">{swatches}</div>

            {imageUrl && !hasImageError ? (
              <img
                src={imageUrl}
                alt={imageAlt}
                className="h-full w-full object-cover transition-transform duration-500 ease-out [transform:scale(var(--catalog-image-scale,1.04))] group-hover:[transform:scale(var(--catalog-image-hover-scale,1.08))] group-focus-visible:[transform:scale(var(--catalog-image-hover-scale,1.08))]"
                loading="lazy"
                style={mediaImageStyle}
                onError={() => setHasImageError(true)}
              />
            ) : (
              <div className="flex h-full w-full items-center justify-center px-6 py-10">
                <ProductImagePlaceholder className="h-full min-h-[220px] w-full max-w-[260px]" />
              </div>
            )}

            <div className="pointer-events-none absolute inset-x-4 bottom-4 z-10">
              <span className="lux-btn-ghost lux-btn-compact flex w-full justify-center text-center">
                CHOOSE OPTIONS
              </span>
            </div>
          </div>

          <div className="px-4 pb-5 pt-5 text-center">
            <p className="font-body text-[13px] font-medium leading-[1.45] text-[var(--color-primary)] md:text-[14px]">
              {product.name}
            </p>
            <p className="mt-1 font-body text-[13px] text-[var(--color-muted)] md:text-[14px]">{formatPrice(product.price)}</p>
            {isOutOfStock ? (
              <p className="mt-2 font-body text-[11px] font-medium text-[var(--color-muted-soft)]">Out of stock</p>
            ) : null}
          </div>
        </Link>
      </article>
    );
  }

  return (
    <article className="h-full bg-[var(--color-secondary)] p-1">
      <Link to={productUrl} className="group lux-surface-card flex h-full min-h-[340px] flex-col overflow-hidden text-current md:min-h-[460px]">
        <div className="flex min-h-[30px] items-start justify-end px-4 pt-4">
          {swatches}
        </div>

        <div className="relative flex flex-1 items-center justify-center overflow-hidden px-5 pb-5 pt-2 md:px-8 md:pb-7">
          <div className="flex aspect-[3/4] w-full max-w-[240px] items-center justify-center bg-[rgba(var(--color-primary-rgb),0.03)] p-3 md:max-w-[300px] md:p-4">
            {imageUrl && !hasImageError ? (
              <img
                src={imageUrl}
                alt={imageAlt}
                className="h-full w-full object-cover transition-transform duration-500 ease-out group-hover:scale-[1.03]"
                loading="lazy"
                onError={() => setHasImageError(true)}
              />
            ) : (
              <ProductImagePlaceholder className="h-full w-full" />
            )}
          </div>
        </div>

        <div className="px-4 pb-5 text-center">
          <p className="font-body text-[13px] font-medium leading-[1.45] text-[var(--color-primary)] md:text-[14px]">
            {product.name}
          </p>
          <p className="mt-1 font-body text-[13px] text-[var(--color-muted)] md:text-[14px]">{formatPrice(product.price)}</p>
          {isOutOfStock ? (
            <p className="mt-2 font-body text-[11px] font-medium text-[var(--color-muted-soft)]">Out of stock</p>
          ) : null}
        </div>
      </Link>
    </article>
  );
};

export default ShopProductCard;
