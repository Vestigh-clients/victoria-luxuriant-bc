import { useMemo } from "react";
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
    <div className="lux-surface-card flex h-full min-h-[340px] flex-col overflow-hidden bg-[var(--color-secondary)] md:min-h-[460px]">
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
  const productsLabel = loading ? "Loading products..." : `${products.length} ${products.length === 1 ? "product" : "products"}`;
  const hasProducts = products.length > 0;
  const hasDescription = typeof description === "string" && description.trim().length > 0;
  const hasSideDescription = hasDescription && descriptionPlacement === "side";

  return (
    <div className="lux-catalog-scope bg-[var(--color-secondary)] text-[var(--color-primary)]">
      <section className="mx-auto w-full max-w-[1680px] px-4 pb-7 pt-5 md:px-8">
        <div
          className={
            hasSideDescription
              ? "grid grid-cols-1 gap-3 md:grid-cols-12"
              : "flex flex-col gap-3"
          }
        >
          <h1
            className={`font-display text-[40px] font-normal italic leading-[1.04] tracking-[-0.03em] text-[var(--color-primary)] md:text-[58px] ${
              hasSideDescription ? "md:col-span-12" : ""
            }`}
          >
            {title}
          </h1>

          {hasDescription ? (
            <p
              className={`font-body text-[15px] leading-[1.75] text-[var(--color-muted)] md:text-[16px] ${
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
          <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
            <p className="font-body text-[13px] font-medium text-[var(--color-muted)] md:text-[14px]">{productsLabel}</p>

            <div className="lux-catalog-tabs overflow-x-auto whitespace-nowrap [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]">
              <div className="flex min-w-max items-center gap-5 md:gap-6">
                {tabs.map((tab) => (
                  <Link
                    key={tab.to}
                    to={tab.to}
                    aria-current={tab.isActive ? "page" : undefined}
                    className={`border-b pb-1 font-body text-[13px] font-medium transition-colors duration-200 md:text-[14px] ${
                      tab.isActive
                        ? "border-[var(--color-primary)] text-[var(--color-primary)]"
                        : "border-transparent text-[var(--color-muted)] hover:text-[var(--color-primary)]"
                    }`}
                  >
                    {tab.label}
                  </Link>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="w-full pb-16 md:pb-24">
        {loading ? (
          <div>
            <div className="grid grid-cols-2 gap-1.5 md:grid-cols-3 md:gap-2 xl:grid-cols-4">
              {Array.from({ length: CATALOG_SKELETON_COUNT }).map((_, index) => (
                <div key={`catalog-skeleton-${index}`}>
                  <ProductCardSkeleton />
                </div>
              ))}
            </div>
          </div>
        ) : hasProducts ? (
          <div>
            <div className="grid grid-cols-2 gap-1.5 md:grid-cols-3 md:gap-2 xl:grid-cols-4">
              {products.map((product) => (
                <div key={product.id}>
                  <ShopProductCard product={product} surface="catalog" />
                </div>
              ))}
            </div>
          </div>
        ) : (
          <div className="mx-auto w-full max-w-[1680px] border border-[rgba(var(--color-primary-rgb),0.08)] px-6 py-12 text-center">
            <p className="font-body text-[13px] text-[var(--color-muted-soft)]">{emptyMessage}</p>
          </div>
        )}
      </section>
    </div>
  );
};

export default StoreCatalogView;
