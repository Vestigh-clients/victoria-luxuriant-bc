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
    <div className="group bg-card rounded-[var(--border-radius)] overflow-hidden transition-all duration-300 ease-out hover:-translate-y-1 hover:shadow-[0_12px_28px_rgba(var(--color-primary-rgb),0.12)]">
      <Link to={`/shop/${product.slug}`} className="block">
        <div className="relative w-full overflow-hidden" style={{ aspectRatio: "3/4" }}>
          {image && !hasImageError ? (
            <img
              src={image}
              alt={product.name}
              className="absolute inset-0 h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
              loading="lazy"
              onError={() => setHasImageError(true)}
            />
          ) : (
            <ProductImagePlaceholder className="absolute inset-0 h-full w-full" />
          )}
        </div>
      </Link>

      <div className="pt-5 pb-1 text-left">
        <Link to={`/shop/${product.slug}`}>
          <h3 className="font-display text-[1.35rem] md:text-[1.5rem] font-normal italic leading-tight">{product.name}</h3>
        </Link>
        <p className="font-body font-light text-lg mt-3">{formatPrice(product.price)}</p>

      </div>
    </div>
  );
};

export default ProductCard;

