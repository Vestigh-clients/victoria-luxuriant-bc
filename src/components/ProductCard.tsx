import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import ProductImagePlaceholder from "@/components/products/ProductImagePlaceholder";
import { formatPrice } from "@/lib/price";
import { getPrimaryImage, type Product } from "@/types/product";

interface ProductCardProps {
  product: Product;
}

const ProductCard = ({ product }: ProductCardProps) => {
  const image = getPrimaryImage(product);
  const [hasImageError, setHasImageError] = useState(false);

  useEffect(() => {
    setHasImageError(false);
  }, [image, product.id]);

  return (
    <div className="group lux-surface-card overflow-hidden">
      <Link to={`/shop/${product.slug}`} className="block">
        <div className="relative w-full overflow-hidden" style={{ aspectRatio: "3/4" }}>
          {image && !hasImageError ? (
            <img
              src={image}
              alt={product.name}
              className="absolute inset-0 h-full w-full object-cover transition-transform duration-500 group-hover:scale-[1.03]"
              loading="lazy"
              onError={() => setHasImageError(true)}
            />
          ) : (
            <ProductImagePlaceholder className="absolute inset-0 h-full w-full" />
          )}
        </div>
      </Link>

      <div className="px-4 pb-5 pt-4 text-left">
        <Link to={`/shop/${product.slug}`}>
          <h3 className="font-body text-[15px] font-medium leading-snug text-[var(--color-primary)]">{product.name}</h3>
        </Link>
        <p className="mt-1 font-body text-[14px] text-[var(--color-muted)]">{formatPrice(product.price)}</p>
      </div>
    </div>
  );
};

export default ProductCard;

