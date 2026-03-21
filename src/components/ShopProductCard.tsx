import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useCart } from "@/contexts/CartContext";
import ProductImagePlaceholder from "@/components/products/ProductImagePlaceholder";
import { getCategoryLabel } from "@/lib/categories";
import { formatPrice } from "@/lib/price";
import { getPrimaryImage, getStockQuantity, isInStock, type Product } from "@/types/product";

interface ShopProductCardProps {
  product: Product;
  size?: "regular" | "banner";
}

const ShopProductCard = ({ product, size = "regular" }: ShopProductCardProps) => {
  const { addToCart } = useCart();
  const navigate = useNavigate();
  const imageUrl = getPrimaryImage(product);
  const [hasImageError, setHasImageError] = useState(false);
  const categoryLabel = product.categories?.name || getCategoryLabel(product.categories?.slug);
  const stockQuantity = getStockQuantity(product);
  const isOutOfStock = !isInStock(product);
  const requiresVariantSelection = product.has_variants === true;

  useEffect(() => {
    setHasImageError(false);
  }, [imageUrl, product.id]);

  const handleAddToCart = () => {
    if (requiresVariantSelection) {
      navigate(`/shop/${product.slug}`);
      return;
    }

    if (isOutOfStock) {
      return;
    }

    addToCart({
      product_id: product.id,
      name: product.name,
      slug: product.slug,
      category: categoryLabel,
      price: product.price,
      compare_at_price: product.compare_at_price ?? null,
      image_url: imageUrl,
      image_alt: product.name,
      sku: product.sku ?? null,
      stock_quantity: stockQuantity,
      variant_id: null,
      variant_label: null,
    });
  };

  const imageHoverOverlay = (
    <div className="pointer-events-none absolute inset-0 flex items-end bg-[linear-gradient(to_top,rgba(var(--color-primary-rgb),0.78)_0%,rgba(var(--color-primary-rgb),0)_60%)] opacity-0 transition-opacity duration-300 ease-in-out group-hover:opacity-100">
      <div className="mb-3 ml-3 rounded-[var(--border-radius)] border border-[rgba(var(--color-secondary-rgb),0.4)] bg-[rgba(var(--color-primary-rgb),0.72)] px-3 py-1">
        <span className="font-body text-[10px] uppercase tracking-[0.14em] text-[var(--color-secondary)]">View Product</span>
      </div>
    </div>
  );

  if (size === "banner") {
    return (
      <article className="group bg-transparent">
        <div className="grid h-[400px] w-full grid-cols-[55fr_45fr]">
          <div className="relative overflow-hidden">
            <Link to={`/shop/${product.slug}`} className="block h-full">
              {imageUrl && !hasImageError ? (
                <img
                  src={imageUrl}
                  alt={product.name}
                  className="h-full w-full object-cover object-center transition-transform ease-out [transition-duration:400ms] group-hover:scale-[1.04]"
                  loading="lazy"
                  onError={() => setHasImageError(true)}
                />
              ) : (
                <ProductImagePlaceholder className="h-full w-full" />
              )}
            </Link>
          </div>

          <div className="flex h-full flex-col justify-center bg-[var(--color-secondary)] p-12">
            <p className="mb-3 font-body text-[10px] font-medium uppercase tracking-[0.2em] text-[var(--color-accent)]">
              {categoryLabel}
            </p>

            <p className="mb-7 font-display text-[30px] font-semibold leading-none text-[var(--color-primary)]">{formatPrice(product.price)}</p>
            {isOutOfStock ? (
              <p className="mb-6 font-body text-[10px] uppercase tracking-[0.08em] text-[var(--color-muted-soft)]">Out of Stock</p>
            ) : null}

            <button
              type="button"
              onClick={handleAddToCart}
              disabled={isOutOfStock}
              className="w-fit rounded-[var(--border-radius)] bg-[var(--color-primary)] px-8 py-[14px] font-body text-[11px] uppercase tracking-[0.15em] text-[var(--color-secondary)] transition-colors duration-300 hover:bg-[var(--color-accent)] hover:text-[var(--color-primary)] disabled:cursor-not-allowed disabled:bg-[var(--color-border)] disabled:text-[var(--color-muted)]"
            >
              {isOutOfStock ? "Out of Stock" : requiresVariantSelection ? "Select Options" : "Add to Cart"}
            </button>
          </div>
        </div>
      </article>
    );
  }

  return (
    <article className="group bg-transparent transition-transform duration-300 ease-out hover:-translate-y-1">
      <div className="relative aspect-[4/5] w-full overflow-hidden rounded-[var(--border-radius)] border border-transparent bg-[rgba(var(--color-primary-rgb),0.02)] transition-all duration-300 ease-out group-hover:border-[rgba(var(--color-primary-rgb),0.12)] group-hover:shadow-[0_14px_28px_rgba(var(--color-primary-rgb),0.08)]">
        <Link to={`/shop/${product.slug}`} className="block h-full">
          {imageUrl && !hasImageError ? (
            <img
              src={imageUrl}
              alt={product.name}
              className="h-full w-full object-cover object-center transition-transform ease-out [transition-duration:450ms] group-hover:scale-[1.035]"
              loading="lazy"
              onError={() => setHasImageError(true)}
            />
          ) : (
            <ProductImagePlaceholder className="h-full w-full" />
          )}
          {imageHoverOverlay}
        </Link>
      </div>

      <div className="mt-3 text-left">
        <p className="mt-1 font-display text-[21px] font-semibold leading-none text-[var(--color-primary)]">{formatPrice(product.price)}</p>
        {isOutOfStock ? (
          <p className="mt-1 font-body text-[10px] uppercase tracking-[0.08em] text-[var(--color-muted-soft)]">Out of Stock</p>
        ) : null}
      </div>
    </article>
  );
};

export default ShopProductCard;


