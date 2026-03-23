import { useMemo } from "react";
import { LayoutGrid, List } from "lucide-react";
import { Link } from "react-router-dom";
import ShopProductCard from "@/components/ShopProductCard";
import { storeConfig, type CategoryConfig } from "@/config/store.config";
import type { Product } from "@/types/product";

const CATALOG_SKELETON_COUNT = 8;

interface StoreCatalogViewProps {
  title: string;
  description?: string | null;
  descriptionPlacement?: "below" | "side";
  products: Product[];
  loading: boolean;
  activeCategorySlug: string | null;
  emptyMessage: string;
}

export const getEnabledCatalogCategories = (): CategoryConfig[] => {
  const seen = new Set<string>();

  return storeConfig.categories
    .filter((category) => category.enabled)
    .map((category) => ({
      ...category,
      slug: category.slug.trim().toLowerCase(),
    }))
    .filter((category) => category.slug.length > 0)
    .filter((category) => {
      if (seen.has(category.slug)) {
        return false;
      }

      seen.add(category.slug);
      return true;
    });
};

const ProductCardSkeleton = () => {
  return (
    <div className="flex h-full min-h-[340px] flex-col bg-[var(--color-secondary)] md:min-h-[460px]">
      <div className="flex min-h-[280px] flex-1 items-center justify-center overflow-hidden px-3 pb-5 pt-0 md:min-h-[370px] md:px-4 md:pb-6">
        <div className="lux-product-shimmer h-full w-full" />
      </div>

      <div className="px-4 pb-5 text-center">
        <div className="mx-auto h-3 w-2/3 lux-product-shimmer" />
        <div className="mx-auto mt-2 h-3 w-20 lux-product-shimmer" />
      </div>
    </div>
  );
};

const StoreCatalogView = ({
  title,
  description = null,
  descriptionPlacement = "below",
  products,
  loading,
  activeCategorySlug,
  emptyMessage,
}: StoreCatalogViewProps) => {
  const enabledCategories = useMemo(() => getEnabledCatalogCategories(), []);
  const tabs = useMemo(
    () => [
      {
        label: "All",
        to: "/shop",
        isActive: activeCategorySlug === null,
      },
      ...enabledCategories.map((category) => ({
        label: category.name,
        to: `/category/${encodeURIComponent(category.slug)}`,
        isActive: category.slug === activeCategorySlug,
      })),
    ],
    [activeCategorySlug, enabledCategories],
  );
  const productsLabel = loading ? "Loading products" : `${products.length} ${products.length === 1 ? "PRODUCT" : "PRODUCTS"}`;
  const hasProducts = products.length > 0;
  const hasDescription = typeof description === "string" && description.trim().length > 0;
  const hasSideDescription = hasDescription && descriptionPlacement === "side";

  return (
    <div className="lux-catalog-scope bg-[var(--color-secondary)] text-[var(--color-primary)]">
      <section className="mx-auto w-full max-w-[1680px] px-4 pb-6 pt-4 md:px-8">
  <div
    className={
      hasSideDescription
        ? "grid grid-cols-1 gap-3 md:grid-cols-12"
        : "flex flex-col gap-3"
    }
  >
    <h1
      className={`font-body text-[42px] font-light tracking-[-0.06em] text-[var(--color-primary)] md:text-[64px] ${
        hasSideDescription ? "md:col-span-12" : ""
      }`}
    >
      {title}
    </h1>

    {hasDescription ? (
      <p
        className={`font-body text-[14px] leading-[1.7] text-[var(--color-muted-soft)] md:text-[15px] ${
          hasSideDescription
            ? "md:col-span-12 max-w-[680px]"
            : "max-w-[680px]"
        }`}
      >
        {description}
      </p>
    ) : null}
  </div>
</section>

      <section className="border-y border-[rgba(var(--color-primary-rgb),0.08)]">
        <div className="mx-auto w-full max-w-[1680px] px-4 py-4 md:px-8">
          <div className="flex flex-row items-center justify-between gap-4 xl:grid xl:grid-cols-[200px_minmax(0,1fr)_auto] xl:items-center">
            <p className="font-body text-[12px] uppercase tracking-[0.1em] text-[var(--color-muted-soft)] md:text-[13px]">{productsLabel}</p>

            <div className="lux-catalog-tabs overflow-x-auto whitespace-nowrap [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]">
              <div className="flex min-w-max items-center gap-7 xl:justify-center">
                {tabs.map((tab) => (
                  <Link
                    key={tab.to}
                    to={tab.to}
                    aria-current={tab.isActive ? "page" : undefined}
                    className={`font-body text-[12px] uppercase tracking-[0.1em] transition-colors duration-200 md:text-[13px] ${
                      tab.isActive ? "text-[var(--color-primary)]" : "text-[var(--color-muted-soft)] hover:text-[var(--color-primary)]"
                    }`}
                  >
                    {tab.label}
                  </Link>
                ))}
              </div>
            </div>

            <div className="flex items-center gap-4 text-[var(--color-muted-soft)] xl:justify-end" aria-hidden="true">
              <div className="flex items-center gap-3">
                <LayoutGrid size={18} strokeWidth={1.8} className="text-[var(--color-primary)]" />
                <List size={18} strokeWidth={1.8} />
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="w-full pb-16 md:pb-24">
        {loading ? (
          <div className="overflow-hidden border-l border-t border-[rgba(var(--color-primary-rgb),0.08)]">
            <div className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-4">
              {Array.from({ length: CATALOG_SKELETON_COUNT }).map((_, index) => (
                <div key={`catalog-skeleton-${index}`} className="border-b border-r border-[rgba(var(--color-primary-rgb),0.08)]">
                  <ProductCardSkeleton />
                </div>
              ))}
            </div>
          </div>
        ) : hasProducts ? (
          <div className="overflow-hidden border-l border-t border-[rgba(var(--color-primary-rgb),0.08)]">
            <div className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-4">
              {products.map((product) => (
                <div key={product.id} className="border-b border-r border-[rgba(var(--color-primary-rgb),0.08)]">
                  <ShopProductCard product={product} surface="catalog" />
                </div>
              ))}
            </div>
          </div>
        ) : (
          <div className="mx-auto w-full max-w-[1680px] border border-[rgba(var(--color-primary-rgb),0.08)] px-6 py-12 text-center">
            <p className="font-body text-[12px] uppercase tracking-[0.08em] text-[var(--color-muted-soft)]">{emptyMessage}</p>
          </div>
        )}
      </section>
    </div>
  );
};

export default StoreCatalogView;
