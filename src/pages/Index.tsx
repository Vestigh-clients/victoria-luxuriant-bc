import { useCallback, useEffect, useMemo, useRef, useState, type CSSProperties } from "react";
import { Link, useLocation } from "react-router-dom";
import CategoryCard from "@/components/CategoryCard";
import ShopProductCard from "@/components/ShopProductCard";
import ProductFetchErrorState from "@/components/products/ProductFetchErrorState";
import { storeConfig } from "@/config/store.config";
import { getAllProducts } from "@/services/productService";
import { getPrimaryImage, type Product } from "@/types/product";

const AUTOPLAY_INTERVAL_SECONDS = 5;

type TransitionType = "push";
const TRANSITION_TYPE: TransitionType = "push";
const HERO_TRANSITION_DURATION_MS = 700;
const HERO_TRANSITION_EASING = "cubic-bezier(0.77, 0, 0.175, 1)";

type HeroCtaStyle = "outline" | "solid" | "bronze";

interface HeroSlide {
  id: number;
  category: string;
  image: string;
  label: string;
  heading: string;
  subtext: string;
  cta: {
    text: string;
    href: string;
    style: HeroCtaStyle;
  };
}

const slides: HeroSlide[] = [
  {
    id: 1,
    category: "Hair Care",
    image: "/images/hero-haircare.jpg",
    label: "HAIR CARE COLLECTION",
    heading: "Rituals for your most luxurious self.",
    subtext: "Premium formulas for healthy, beautiful hair.",
    cta: {
      text: "Shop Hair Care",
      href: "/category/hair-care",
      style: "outline",
    },
  },
  {
    id: 2,
    category: "Men",
    image: "/images/hero-men.jpg",
    label: "MEN'S COLLECTION",
    heading: "Dressed with intention. Built to last.",
    subtext: "Elevated essentials for the modern wardrobe.",
    cta: {
      text: "Shop Men",
      href: "/category/mens-fashion",
      style: "solid",
    },
  },
  {
    id: 3,
    category: "Women",
    image: "/images/hero-women.jpg",
    label: "WOMEN'S COLLECTION",
    heading: "Worn with intention. Made to last.",
    subtext: "Timeless pieces for the discerning woman.",
    cta: {
      text: "Explore Women",
      href: "/category/womens-fashion",
      style: "outline",
    },
  },
  {
    id: 4,
    category: "Bags",
    image: "/images/hero-bags.jpg",
    label: "BAG COLLECTION",
    heading: "Carry something worth noticing.",
    subtext: "Handcrafted leather and refined silhouettes.",
    cta: {
      text: "Shop Bags",
      href: "/category/bags",
      style: "bronze",
    },
  },
  {
    id: 5,
    category: "Shoes",
    image: "/images/hero-shoes.jpg",
    label: "FOOTWEAR COLLECTION",
    heading: "Stand in something worth remembering.",
    subtext: "Every step, considered.",
    cta: {
      text: "Shop Shoes",
      href: "/category/shoes",
      style: "solid",
    },
  },
];

const ctaBaseClass =
  "inline-flex cursor-pointer items-center justify-center rounded-sm border border-[var(--color-secondary)] bg-[var(--color-secondary)] px-10 py-4 font-body text-[11px] uppercase tracking-[0.2em] text-[var(--color-primary)] transition-all duration-300";

const ctaClassByStyle: Record<HeroCtaStyle, string> = {
  outline:
    "hover:border-[var(--color-secondary)] hover:bg-[rgba(var(--color-primary-rgb),0.92)] hover:text-[var(--color-secondary)]",
  solid:
    "hover:border-[var(--color-secondary)] hover:bg-[rgba(var(--color-primary-rgb),0.92)] hover:text-[var(--color-secondary)]",
  bronze:
    "hover:border-[var(--color-secondary)] hover:bg-[rgba(var(--color-primary-rgb),0.92)] hover:text-[var(--color-secondary)]",
};

type SlideDirection = "next" | "prev";

const ENTERING_TEXT_DELAYS_MS = {
  label: 420,
  heading: 520,
  subtext: 600,
  button: 680,
};

type HomeShopFilter = "all" | string;
const HOME_SHOP_SKELETON_COUNT = 4;

const ProductCardSkeleton = () => {
  return (
    <div className="flex h-full flex-col">
      <div className="lux-product-shimmer aspect-[4/5] w-full" />
      <div className="mt-3 space-y-2">
        <div className="lux-product-shimmer h-4 w-2/3" />
        <div className="lux-product-shimmer h-3 w-1/3" />
      </div>
    </div>
  );
};

const ProductBannerSkeleton = () => {
  return (
    <article className="bg-transparent">
      <div className="grid h-[400px] w-full grid-cols-[55fr_45fr]">
        <div className="lux-product-shimmer h-full w-full" />
        <div className="bg-[var(--color-secondary)] p-12">
          <div className="space-y-3">
            <div className="lux-product-shimmer h-3 w-1/3" />
            <div className="lux-product-shimmer h-8 w-3/4" />
            <div className="lux-product-shimmer h-4 w-1/3" />
            <div className="lux-product-shimmer mt-6 h-11 w-40" />
          </div>
        </div>
      </div>
    </article>
  );
};

const renderProductRows = (items: Product[], loading: boolean, expectedCount = HOME_SHOP_SKELETON_COUNT) => {
  if (loading) {
    const regularCount = Math.max(0, expectedCount - 1);

    return (
      <>
        {regularCount > 0 ? (
          <div className="grid grid-cols-3 gap-[2px]">
            {Array.from({ length: regularCount }).map((_, index) => (
              <ProductCardSkeleton key={`home-shop-card-skeleton-${index}`} />
            ))}
          </div>
        ) : null}

        <div className={regularCount > 0 ? "mt-[2px]" : ""}>
          <ProductBannerSkeleton />
        </div>
      </>
    );
  }

  if (items.length === 0) {
    return (
      <div className="border border-[var(--color-border)] px-6 py-8 text-center">
        <p className="font-body text-[12px] text-[var(--color-muted)]">No products available in this category right now.</p>
      </div>
    );
  }

  const standardProducts = items.slice(0, -1);
  const bannerProduct = items[items.length - 1];

  return (
    <>
      {standardProducts.length > 0 ? (
        <div className="grid grid-cols-3 gap-[2px]">
          {standardProducts.map((product) => (
            <ShopProductCard key={product.id} product={product} size="regular" />
          ))}
        </div>
      ) : null}

      <div className={standardProducts.length > 0 ? "mt-[2px]" : ""}>
        <ShopProductCard product={bannerProduct} size="banner" />
      </div>
    </>
  );
};

const Index = () => {
  const location = useLocation();
  const [activeSlideIndex, setActiveSlideIndex] = useState(0);
  const [incomingSlideIndex, setIncomingSlideIndex] = useState<number | null>(null);
  const [navigationDirection, setNavigationDirection] = useState<SlideDirection>("next");
  const [trackTranslatePercent, setTrackTranslatePercent] = useState(0);
  const [trackHasTransition, setTrackHasTransition] = useState(false);
  const [isEnteringTextVisible, setIsEnteringTextVisible] = useState(false);
  const [isAnimating, setIsAnimating] = useState(false);
  const [products, setProducts] = useState<Product[]>([]);
  const [isShopLoading, setIsShopLoading] = useState(true);
  const [shopError, setShopError] = useState<string | null>(null);
  const [activeShopFilter, setActiveShopFilter] = useState<HomeShopFilter>("all");

  const animationTimeoutRef = useRef<number | null>(null);
  const animationFrameRef = useRef<number | null>(null);
  const shopSectionRef = useRef<HTMLElement | null>(null);

  const hasMultipleSlides = slides.length > 1;
  const isPushTransition = TRANSITION_TYPE === "push";
  const enabledCategories = useMemo(
    () =>
      storeConfig.categories
        .filter((category) => category.enabled)
        .map((category) => ({
          ...category,
          slug: category.slug.trim().toLowerCase(),
        }))
        .filter((category) => category.slug.length > 0),
    [],
  );
  const categoryBySlug = useMemo(() => {
    return Object.fromEntries(enabledCategories.map((category) => [category.slug, category]));
  }, [enabledCategories]);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        setIsShopLoading(true);
        setShopError(null);
        const data = await getAllProducts();
        setProducts(data ?? []);
      } catch (error) {
        console.error(error);
        setShopError("Failed to load products. Please refresh.");
      } finally {
        setIsShopLoading(false);
      }
    };

    void fetchProducts();
  }, []);

  useEffect(() => {
    if (activeShopFilter === "all") {
      return;
    }

    if (!categoryBySlug[activeShopFilter]) {
      setActiveShopFilter("all");
    }
  }, [activeShopFilter, categoryBySlug]);

  useEffect(() => {
    return () => {
      if (animationTimeoutRef.current) {
        window.clearTimeout(animationTimeoutRef.current);
      }
      if (animationFrameRef.current) {
        window.cancelAnimationFrame(animationFrameRef.current);
      }
    };
  }, []);

  const getWrappedIndex = useCallback((index: number) => {
    return (index + slides.length) % slides.length;
  }, []);

  const startPushTransition = useCallback(
    (targetIndex: number, direction: SlideDirection) => {
      if (!isPushTransition || !hasMultipleSlides || isAnimating || targetIndex === activeSlideIndex) {
        return;
      }

      if (animationTimeoutRef.current) {
        window.clearTimeout(animationTimeoutRef.current);
      }
      if (animationFrameRef.current) {
        window.cancelAnimationFrame(animationFrameRef.current);
      }

      setNavigationDirection(direction);
      setIncomingSlideIndex(targetIndex);
      setIsAnimating(true);
      setIsEnteringTextVisible(false);
      setTrackHasTransition(false);
      setTrackTranslatePercent(direction === "next" ? 0 : -50);

      animationFrameRef.current = window.requestAnimationFrame(() => {
        animationFrameRef.current = window.requestAnimationFrame(() => {
          setTrackHasTransition(true);
          setTrackTranslatePercent(direction === "next" ? -50 : 0);
          setIsEnteringTextVisible(true);
        });
      });

      animationTimeoutRef.current = window.setTimeout(() => {
        setActiveSlideIndex(targetIndex);
        setIncomingSlideIndex(null);
        setTrackHasTransition(false);
        setTrackTranslatePercent(0);
        setIsEnteringTextVisible(false);
        setIsAnimating(false);
        animationTimeoutRef.current = null;
      }, HERO_TRANSITION_DURATION_MS);
    },
    [activeSlideIndex, hasMultipleSlides, isAnimating, isPushTransition],
  );

  useEffect(() => {
    if (!hasMultipleSlides || !isPushTransition || isAnimating) {
      return;
    }

    const timeoutId = window.setTimeout(() => {
      startPushTransition(getWrappedIndex(activeSlideIndex + 1), "next");
    }, AUTOPLAY_INTERVAL_SECONDS * 1000);

    return () => window.clearTimeout(timeoutId);
  }, [activeSlideIndex, getWrappedIndex, hasMultipleSlides, isAnimating, isPushTransition, startPushTransition]);

  const goToNextSlide = useCallback(() => {
    startPushTransition(getWrappedIndex(activeSlideIndex + 1), "next");
  }, [activeSlideIndex, getWrappedIndex, startPushTransition]);

  const goToPreviousSlide = useCallback(() => {
    startPushTransition(getWrappedIndex(activeSlideIndex - 1), "prev");
  }, [activeSlideIndex, getWrappedIndex, startPushTransition]);

  const handleDotClick = useCallback(
    (targetIndex: number) => {
      if (targetIndex === activeSlideIndex || isAnimating) {
        return;
      }

      const forwardDistance = (targetIndex - activeSlideIndex + slides.length) % slides.length;
      const backwardDistance = (activeSlideIndex - targetIndex + slides.length) % slides.length;
      const direction: SlideDirection = forwardDistance <= backwardDistance ? "next" : "prev";

      startPushTransition(targetIndex, direction);
    },
    [activeSlideIndex, isAnimating, startPushTransition],
  );

  const slidesOnTrack = useMemo(() => {
    if (!isAnimating || incomingSlideIndex === null) {
      return [{ slide: slides[activeSlideIndex], isEntering: false }];
    }

    const activeSlide = slides[activeSlideIndex];
    const incomingSlide = slides[incomingSlideIndex];

    if (navigationDirection === "next") {
      return [
        { slide: activeSlide, isEntering: false },
        { slide: incomingSlide, isEntering: true },
      ];
    }

    return [
      { slide: incomingSlide, isEntering: true },
      { slide: activeSlide, isEntering: false },
    ];
  }, [activeSlideIndex, incomingSlideIndex, isAnimating, navigationDirection]);

  const trackStyle: CSSProperties = {
    width: `${slidesOnTrack.length * 100}%`,
    transform: `translateX(${trackTranslatePercent}%)`,
    transition: trackHasTransition ? `transform ${HERO_TRANSITION_DURATION_MS}ms ${HERO_TRANSITION_EASING}` : "none",
  };
  const slideItemWidthPercent = 100 / slidesOnTrack.length;

  const getTextAnimationClass = (isEntering: boolean) => {
    if (!isEntering) {
      return "translate-y-0 opacity-100";
    }
    return isEnteringTextVisible ? "translate-y-0 opacity-100" : "translate-y-[24px] opacity-0";
  };

  const getEnteringTextStyle = (isEntering: boolean, delayMs: number): CSSProperties | undefined => {
    if (!isEntering) {
      return undefined;
    }
    return {
      transitionProperty: "transform, opacity",
      transitionDuration: "300ms",
      transitionTimingFunction: "ease-out",
      transitionDelay: `${delayMs}ms`,
    };
  };

  const currentIndicatorIndex = isAnimating && incomingSlideIndex !== null ? incomingSlideIndex : activeSlideIndex;
  const groupedProducts = useMemo(() => {
    const groups = Object.fromEntries(enabledCategories.map((category) => [category.slug, [] as Product[]]));

    for (const product of products) {
      const categorySlug = (product.categories?.slug ?? "").trim().toLowerCase();
      if (!categorySlug || !groups[categorySlug]) {
        continue;
      }
      groups[categorySlug].push(product);
    }

    return groups;
  }, [enabledCategories, products]);
  const bannerImageByCategory = useMemo(() => {
    const result = Object.fromEntries(enabledCategories.map((category) => [category.slug, category.imageUrl || ""]));

    for (const category of enabledCategories) {
      const categoryProducts = groupedProducts[category.slug] ?? [];
      const firstWithImage = categoryProducts.find((item) => Boolean(getPrimaryImage(item)));
      if (firstWithImage) {
        result[category.slug] = getPrimaryImage(firstWithImage);
      }
    }

    return result;
  }, [enabledCategories, groupedProducts]);
  const homeShopFilterItems = useMemo(
    () => [
      { label: "All", value: "all" as HomeShopFilter },
      ...enabledCategories.map((category) => ({ label: category.name, value: category.slug as HomeShopFilter })),
    ],
    [enabledCategories],
  );
  const categoriesToShow = useMemo(
    () => (activeShopFilter === "all" ? enabledCategories.map((category) => category.slug) : [activeShopFilter]),
    [activeShopFilter, enabledCategories],
  );
  const matchingTotalCount = useMemo(() => {
    if (isShopLoading) {
      return categoriesToShow.length * HOME_SHOP_SKELETON_COUNT;
    }

    return categoriesToShow.reduce((total, categorySlug) => total + (groupedProducts[categorySlug]?.length ?? 0), 0);
  }, [categoriesToShow, groupedProducts, isShopLoading]);
  const displayedPreviewCount = useMemo(() => {
    if (isShopLoading) {
      return categoriesToShow.length * HOME_SHOP_SKELETON_COUNT;
    }

    return categoriesToShow.reduce(
      (total, categorySlug) => total + Math.min(groupedProducts[categorySlug]?.length ?? 0, HOME_SHOP_SKELETON_COUNT),
      0,
    );
  }, [categoriesToShow, groupedProducts, isShopLoading]);
  const showingProductsLabel = useMemo(() => {
    if (isShopLoading) {
      return `Showing ${displayedPreviewCount} products`;
    }

    if (displayedPreviewCount < matchingTotalCount) {
      return `Showing ${displayedPreviewCount} of ${matchingTotalCount} products`;
    }

    return `Showing ${matchingTotalCount} products`;
  }, [displayedPreviewCount, isShopLoading, matchingTotalCount]);

  useEffect(() => {
    if (location.pathname !== "/" || location.hash !== "#shop") {
      return;
    }

    const scrollToShop = () => {
      if (!shopSectionRef.current) {
        return;
      }

      const navElement = document.querySelector("nav");
      const navHeight = navElement instanceof HTMLElement ? navElement.offsetHeight : 88;
      const nextTop = shopSectionRef.current.getBoundingClientRect().top + window.scrollY - navHeight - 12;
      window.scrollTo({ top: Math.max(0, nextTop), behavior: "smooth" });
    };

    const timeoutId = window.setTimeout(scrollToShop, 0);
    return () => window.clearTimeout(timeoutId);
  }, [location.hash, location.pathname]);

  return (
    <div>
      {/* Hero */}
      <section className="relative h-screen overflow-hidden border-b border-[var(--color-border)] shadow-[0_4px_20px_rgba(var(--color-primary-rgb),0.15)]">
        <div className="absolute inset-0 overflow-hidden">
          <div className="flex h-full" style={trackStyle}>
            {slidesOnTrack.map(({ slide, isEntering }) => (
              <div
                key={`${slide.id}-${isEntering ? "incoming" : "active"}-${isAnimating ? "animating" : "static"}`}
                className="relative h-full flex-shrink-0"
                style={{ width: `${slideItemWidthPercent}%` }}
              >
                <img src={slide.image} alt={`${slide.category} collection`} className="h-full w-full object-cover object-center" />
                <div className="absolute inset-0 bg-[linear-gradient(to_right,rgba(var(--color-primary-rgb),0.75)_0%,rgba(var(--color-primary-rgb),0.3)_50%,rgba(var(--color-primary-rgb),0)_100%)]" />

                <div className="absolute bottom-8 left-6 right-6 z-20 text-left md:bottom-[80px] md:left-[80px] md:right-auto">
                  <div
                    className={`mb-4 flex items-center gap-3 ${isEntering ? "transition-[transform,opacity]" : ""} ${getTextAnimationClass(isEntering)}`}
                    style={getEnteringTextStyle(isEntering, ENTERING_TEXT_DELAYS_MS.label)}
                  >
                    <span className="h-[2px] w-6 bg-[var(--color-accent)]" aria-hidden="true" />
                    <p className="font-body text-[10px] font-light uppercase tracking-[0.3em] text-[var(--color-accent)]">
                      {slide.label}
                    </p>
                  </div>

                  <h1
                    className={`mb-4 max-w-[600px] font-display text-[48px] font-light italic leading-[1.1] text-[var(--color-secondary)] md:text-[72px] ${isEntering ? "transition-[transform,opacity]" : ""} ${getTextAnimationClass(isEntering)}`}
                    style={getEnteringTextStyle(isEntering, ENTERING_TEXT_DELAYS_MS.heading)}
                  >
                    {slide.heading}
                  </h1>

                  <p
                    className={`mb-[36px] max-w-[420px] font-body text-[15px] font-light text-[rgba(var(--color-secondary-rgb),0.7)] ${isEntering ? "transition-[transform,opacity]" : ""} ${getTextAnimationClass(isEntering)}`}
                    style={getEnteringTextStyle(isEntering, ENTERING_TEXT_DELAYS_MS.subtext)}
                  >
                    {slide.subtext}
                  </p>

                  <div
                    className={`${isEntering ? "transition-[transform,opacity]" : ""} ${getTextAnimationClass(isEntering)}`}
                    style={getEnteringTextStyle(isEntering, ENTERING_TEXT_DELAYS_MS.button)}
                  >
                    <Link to={slide.cta.href} className={`${ctaBaseClass} ${ctaClassByStyle[slide.cta.style]}`}>
                      {slide.cta.text}
                    </Link>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {hasMultipleSlides && (
          <>
            <button
              type="button"
              onClick={goToPreviousSlide}
              disabled={isAnimating}
              aria-label="Previous slide"
              className="absolute left-4 top-1/2 z-20 inline-flex h-12 w-12 -translate-y-1/2 cursor-pointer items-center justify-center rounded-full bg-[rgba(var(--color-primary-rgb),0.4)] text-[var(--color-secondary)] transition-all duration-300 hover:bg-[rgba(var(--color-primary-rgb),0.7)] disabled:cursor-not-allowed disabled:opacity-40 md:left-8"
            >
              <svg width="20" height="20" viewBox="0 0 20 20" fill="none" aria-hidden="true">
                <path d="M12 4L6 10L12 16" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </button>

            <button
              type="button"
              onClick={goToNextSlide}
              disabled={isAnimating}
              aria-label="Next slide"
              className="absolute right-4 top-1/2 z-20 inline-flex h-12 w-12 -translate-y-1/2 cursor-pointer items-center justify-center rounded-full bg-[rgba(var(--color-primary-rgb),0.4)] text-[var(--color-secondary)] transition-all duration-300 hover:bg-[rgba(var(--color-primary-rgb),0.7)] disabled:cursor-not-allowed disabled:opacity-40 md:right-8"
            >
              <svg width="20" height="20" viewBox="0 0 20 20" fill="none" aria-hidden="true">
                <path d="M8 4L14 10L8 16" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </button>

            <div className="absolute bottom-8 left-1/2 z-20 flex w-[min(360px,calc(100%-2.5rem))] -translate-x-1/2 items-center gap-2">
              {slides.map((slide, index) => (
                <button
                  key={slide.id}
                  type="button"
                  onClick={() => handleDotClick(index)}
                  disabled={isAnimating}
                  aria-label={`Go to slide ${index + 1}`}
                  className="relative h-px flex-1 cursor-pointer overflow-hidden bg-[rgba(var(--color-secondary-rgb),0.35)] disabled:cursor-not-allowed"
                >
                  <span
                    key={`${slide.id}-${currentIndicatorIndex}`}
                    className={`absolute inset-y-0 left-0 w-0 bg-[var(--color-secondary)] ${
                      index === currentIndicatorIndex ? "lux-hero-progress-active" : ""
                    }`}
                    style={index === currentIndicatorIndex ? { animationDuration: `${AUTOPLAY_INTERVAL_SECONDS}s` } : undefined}
                  />
                </button>
              ))}
            </div>
          </>
        )}
      </section>

      {/* Categories */}
      {enabledCategories.length > 0 ? (
        <section className="bg-background py-16 lg:py-20">
          <div className="container mx-auto px-4">
            <div className="mb-4 flex items-center justify-center gap-3">
              <span className="h-[2px] w-6 bg-[var(--color-accent)]" aria-hidden="true" />
              <p className="text-center font-body text-[10px] font-light uppercase tracking-[0.3em] text-[var(--color-accent)]">
                Our Collections
              </p>
            </div>
            <h2 className="mb-2 text-center font-display text-[42px] font-normal italic text-foreground">Shop by Category</h2>
            <p className="mx-auto mb-12 max-w-2xl text-center font-body text-[14px] font-light text-[var(--color-muted)]">
              Considered categories for wardrobe staples, elevated accessories, and restorative hair care.
            </p>
            <div className="grid grid-cols-2 gap-5 sm:grid-cols-3 lg:grid-cols-5 lg:gap-8">
              {enabledCategories.map((category) => (
                <CategoryCard
                  key={category.slug}
                  name={category.name}
                  slug={category.slug}
                  imageUrl={category.imageUrl}
                />
              ))}
            </div>
          </div>
        </section>
      ) : null}

      <section id="shop" ref={shopSectionRef} className="scroll-mt-32 bg-background py-16 md:py-20">
        <div className="container mx-auto px-4">
          <div className="text-center mb-8">
            <h2 className="font-display text-[42px] md:text-[52px] font-light italic leading-tight">Our Collection</h2>
          </div>

          <div className="mb-12 border-b border-[var(--color-border)] pb-6">
            <div className="flex flex-col gap-5 md:flex-row md:items-center md:justify-between">
              <div className="flex flex-wrap gap-2.5">
                {homeShopFilterItems.map((filter) => {
                  const isActive = activeShopFilter === filter.value;

                  return (
                    <button
                      key={filter.value}
                      type="button"
                      onClick={() => setActiveShopFilter(filter.value)}
                      className={`border px-7 py-[10px] font-body text-[11px] font-light uppercase tracking-[0.1em] transition-colors duration-300 ${
                        isActive
                          ? "border-[var(--color-primary)] bg-[var(--color-primary)] text-[var(--color-secondary)]"
                          : "border-[var(--color-border)] text-foreground hover:border-foreground/40"
                      }`}
                    >
                      {filter.label}
                    </button>
                  );
                })}
              </div>

              <p className="font-body text-[12px] font-normal text-[var(--color-muted)] md:text-right">{showingProductsLabel}</p>
            </div>
          </div>

          {shopError ? (
            <ProductFetchErrorState />
          ) : enabledCategories.length === 0 ? (
            <div className="border border-[var(--color-border)] px-6 py-8 text-center">
              <p className="font-body text-[12px] text-[var(--color-muted)]">No enabled categories configured for this store.</p>
            </div>
          ) : (
            <div>
              {categoriesToShow.map((categorySlug, index) => {
                const category = categoryBySlug[categorySlug];
                const categoryProducts = groupedProducts[categorySlug] ?? [];
                const previewProducts = categoryProducts.slice(0, HOME_SHOP_SKELETON_COUNT);
                const hasMoreProducts = categoryProducts.length > HOME_SHOP_SKELETON_COUNT;
                const showDivider = index > 0;
                const bannerImage = bannerImageByCategory[categorySlug];
                const categoryLabel = category?.name ?? categorySlug;
                const categoryHeadline = category?.description?.trim() || `Explore ${categoryLabel}.`;

                return (
                  <section key={categorySlug} className={showDivider ? "pt-20" : ""}>
                    {showDivider ? (
                      <div className="mt-0 mb-10 border-t border-[var(--color-border)] pt-8">
                        <p className="font-body text-[10px] font-medium uppercase tracking-[0.2em] text-accent">{categoryLabel}</p>
                      </div>
                    ) : (
                      <div className="mb-10">
                        <p className="font-body text-[10px] font-medium uppercase tracking-[0.2em] text-accent">{categoryLabel}</p>
                      </div>
                    )}

                    {showDivider && activeShopFilter === "all" ? (
                      <div className="relative left-1/2 right-1/2 my-20 min-h-[60vh] w-screen -translate-x-1/2 overflow-hidden">
                        {bannerImage ? (
                          <img src={bannerImage} alt={categoryLabel} className="absolute inset-0 h-full w-full object-cover" loading="lazy" />
                        ) : (
                          <div className="absolute inset-0 bg-[rgba(var(--color-primary-rgb),0.12)]" />
                        )}
                        <div className="absolute inset-0 bg-[rgba(var(--color-primary-rgb),0.4)]" />

                        <div className="relative z-10 flex min-h-[60vh] items-center">
                          <div className="max-w-[600px] px-6 md:px-0 md:pl-[80px]">
                            <p className="mb-4 font-body text-[11px] font-medium uppercase tracking-[0.2em] text-accent">{categoryLabel}</p>
                            <h3 className="font-display text-[38px] md:text-[52px] font-light italic leading-[1.2] text-white">{categoryHeadline}</h3>
                          </div>
                        </div>
                      </div>
                    ) : null}

                    <div>{renderProductRows(previewProducts, isShopLoading, HOME_SHOP_SKELETON_COUNT)}</div>
                    {hasMoreProducts && !isShopLoading ? (
                      <div className="mt-6 flex justify-end">
                        <Link
                          to={`/category/${encodeURIComponent(categorySlug)}`}
                          className="font-body text-[11px] uppercase tracking-[0.12em] text-[var(--color-primary)] underline decoration-[rgba(var(--color-primary-rgb),0.35)] underline-offset-4 transition-colors duration-200 hover:text-[var(--color-accent)]"
                        >
                          View more
                        </Link>
                      </div>
                    ) : null}
                  </section>
                );
              })}
            </div>
          )}
        </div>
      </section>
    </div>
  );
};

export default Index;
