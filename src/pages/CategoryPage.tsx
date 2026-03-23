import { useEffect, useMemo, useState } from "react";
import { Link, useParams } from "react-router-dom";
import StoreCatalogView, { getEnabledCatalogCategories } from "@/components/catalog/StoreCatalogView";
import ProductFetchErrorState from "@/components/products/ProductFetchErrorState";
import { storeConfig } from "@/config/store.config";
import { getProductsByCategory } from "@/services/productService";
import type { Product } from "@/types/product";

const CategoryPage = () => {
  const { slug } = useParams<{ slug: string }>();
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const enabledCategories = useMemo(() => getEnabledCatalogCategories(), []);
  const categoryBySlug = useMemo(
    () => Object.fromEntries(enabledCategories.map((category) => [category.slug, category])),
    [enabledCategories],
  );
  const requestedSlug = (slug ?? "").trim().toLowerCase();
  const category = categoryBySlug[requestedSlug] ?? null;
  const uiText = storeConfig.categoryPage.uiText;
  const categoryDescription = useMemo(() => {
    if (!category) {
      return "";
    }

    const directDescription = category.description.trim();
    const configuredDescription = storeConfig.categoryPage.bySlug[category.slug]?.heroDescription?.trim() ?? "";
    return directDescription || configuredDescription || storeConfig.categoryPage.defaults.heroDescription;
  }, [category]);

  useEffect(() => {
    if (!requestedSlug || !category) {
      setLoading(false);
      setProducts([]);
      return;
    }

    const fetchProducts = async () => {
      try {
        setLoading(true);
        setError(null);
        const data = await getProductsByCategory(requestedSlug);
        setProducts(data ?? []);
      } catch (err) {
        console.error(err);
        setError("Failed to load products.");
      } finally {
        setLoading(false);
      }
    };

    void fetchProducts();
  }, [category, requestedSlug]);

  if (!category) {
    return (
      <div className="mx-auto w-full max-w-[1680px] px-4 py-16 text-center md:px-8 md:py-20">
        <h1 className="font-body text-[34px] font-light tracking-[-0.05em] text-[var(--color-primary)] md:text-[44px]">
          {uiText.notFoundTitle}
        </h1>
        <Link
          to="/shop"
          className="mt-6 inline-flex font-body text-[11px] uppercase tracking-[0.08em] text-[var(--color-primary)] transition-colors hover:text-[var(--color-muted-soft)]"
        >
          {uiText.backToShopLabel}
        </Link>
      </div>
    );
  }

  if (error) {
    return (
      <div className="mx-auto w-full max-w-[1680px] px-4 py-16 md:px-8 md:py-20">
        <ProductFetchErrorState />
      </div>
    );
  }

  return (
    <StoreCatalogView
      title={category.name}
      description={categoryDescription}
      descriptionPlacement="side"
      products={products}
      loading={loading}
      activeCategorySlug={category.slug}
      emptyMessage={uiText.emptyCategoryMessage}
    />
  );
};

export default CategoryPage;
