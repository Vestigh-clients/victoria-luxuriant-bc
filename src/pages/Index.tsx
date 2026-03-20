import { useCallback, useEffect, useMemo, useRef, useState, type CSSProperties } from "react";
import { Link } from "react-router-dom";
import CategoryCard from "@/components/CategoryCard";
import { storeConfig } from "@/config/store.config";

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

const Index = () => {
  const [activeSlideIndex, setActiveSlideIndex] = useState(0);
  const [incomingSlideIndex, setIncomingSlideIndex] = useState<number | null>(null);
  const [navigationDirection, setNavigationDirection] = useState<SlideDirection>("next");
  const [trackTranslatePercent, setTrackTranslatePercent] = useState(0);
  const [trackHasTransition, setTrackHasTransition] = useState(false);
  const [isEnteringTextVisible, setIsEnteringTextVisible] = useState(false);
  const [isAnimating, setIsAnimating] = useState(false);

  const animationTimeoutRef = useRef<number | null>(null);
  const animationFrameRef = useRef<number | null>(null);

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
    </div>
  );
};

export default Index;
