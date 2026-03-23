import { useEffect, useState } from "react";
import StoreCatalogView from "@/components/catalog/StoreCatalogView";
import ProductFetchErrorState from "@/components/products/ProductFetchErrorState";
import { getAllProducts } from "@/services/productService";
import type { Product } from "@/types/product";

const Shop = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        setLoading(true);
        setError(null);
        const data = await getAllProducts();
        setProducts(data ?? []);
      } catch (err) {
        console.error(err);
        setError("Failed to load products. Please refresh.");
      } finally {
        setLoading(false);
      }
    };

    void fetchProducts();
  }, []);

  if (error) {
    return (
      <div className="mx-auto w-full max-w-[1680px] px-4 py-16 md:px-8 md:py-20">
        <ProductFetchErrorState />
      </div>
    );
  }

  return (
    <StoreCatalogView
      title="Shop"
      description="Explore the full collection across all categories."
      descriptionPlacement="below"
      products={products}
      loading={loading}
      activeCategorySlug={null}
      emptyMessage="No products available right now."
    />
  );
};

export default Shop;
