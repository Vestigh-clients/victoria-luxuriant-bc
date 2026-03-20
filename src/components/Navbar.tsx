import { Link, useLocation } from "react-router-dom";
import { useCallback, useEffect, useMemo, useRef, useState, type RefObject } from "react";
import { LayoutDashboard, Menu, ShoppingBag, X } from "lucide-react";
import SignOutConfirmModal from "@/components/auth/SignOutConfirmModal";
import StoreLogo from "@/components/StoreLogo";
import { storeConfig } from "@/config/store.config";
import { useAuth } from "@/contexts/AuthContext";
import { useCart } from "@/contexts/CartContext";
import { useSignOutWithCartWarning } from "@/hooks/useSignOutWithCartWarning";

const baseNavLinks = [
  { to: "/", label: "Home" },
  { to: "/shop", label: "Shop" },
];

const accountMenuLinks = [
  { to: "/account", label: "Overview" },
  { to: "/account/orders", label: "My Orders" },
  { to: "/account/addresses", label: "Addresses" },
  { to: "/account/profile", label: "Personal Details" },
  { to: "/account/password", label: "Change Password" },
];

const CATEGORY_ROUTE_PREFIX = "/category/";

interface ProfileMenuProps {
  isOpen: boolean;
  userInitial: string;
  userName: string;
  userEmail: string;
  menuId: string;
  containerRef: RefObject<HTMLDivElement>;
  triggerClassName: string;
  onToggle: () => void;
  onClose: () => void;
  onSignOut: () => void;
}

const ProfileMenu = ({
  isOpen,
  userInitial,
  userName,
  userEmail,
  menuId,
  containerRef,
  triggerClassName,
  onToggle,
  onClose,
  onSignOut,
}: ProfileMenuProps) => {
  return (
    <div ref={containerRef} className="relative">
      <button
        type="button"
        onClick={onToggle}
        aria-label="Open account menu"
        aria-expanded={isOpen}
        aria-haspopup="menu"
        aria-controls={menuId}
        className={triggerClassName}
      >
        {userInitial}
      </button>

      {isOpen ? (
        <div
          id={menuId}
          role="menu"
          className="absolute right-0 top-full z-[95] mt-3 min-w-[240px] rounded-[var(--border-radius)] border border-[var(--color-border)] bg-[var(--color-secondary)] shadow-[0_18px_40px_rgba(var(--color-primary-rgb),0.08)]"
        >
          <div className="border-b border-[var(--color-border)] px-4 py-3">
            <p className="font-display text-[20px] italic text-[var(--color-primary)]">{userName}</p>
            <p className="font-body text-[11px] text-[var(--color-muted)]">{userEmail}</p>
          </div>

          <div className="py-2">
            {accountMenuLinks.map((link) => (
              <Link
                key={link.to}
                to={link.to}
                onClick={onClose}
                role="menuitem"
                className="block cursor-pointer px-4 py-2.5 font-body text-[11px] uppercase tracking-[0.1em] text-[var(--color-muted)] transition-colors duration-300 hover:bg-[rgba(var(--color-primary-rgb),0.08)] hover:text-[var(--color-accent)]"
              >
                {link.label}
              </Link>
            ))}
          </div>

          <button
            type="button"
            onClick={() => {
              onClose();
              onSignOut();
            }}
            role="menuitem"
            className="w-full cursor-pointer border-t border-[var(--color-border)] px-4 py-3 text-left font-body text-[11px] uppercase tracking-[0.1em] text-[var(--color-muted-soft)] transition-colors duration-300 hover:bg-[rgba(var(--color-primary-rgb),0.08)] hover:text-[var(--color-danger)]"
          >
            Sign Out
          </button>
        </div>
      ) : null}
    </div>
  );
};

const Navbar = () => {
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [badgeScaleClass, setBadgeScaleClass] = useState("scale-100");
  const [isDesktopUserMenuOpen, setIsDesktopUserMenuOpen] = useState(false);
  const [isMobileUserMenuOpen, setIsMobileUserMenuOpen] = useState(false);

  const location = useLocation();
  const normalizedPathname = useMemo(() => {
    const trimmedPathname = location.pathname.replace(/\/+$/, "");
    return trimmedPathname.length > 0 ? trimmedPathname : "/";
  }, [location.pathname]);
  const desktopUserMenuRef = useRef<HTMLDivElement | null>(null);
  const mobileUserMenuRef = useRef<HTMLDivElement | null>(null);

  const { totalItems, openCart } = useCart();
  const { user, isAuthenticated, isAdmin } = useAuth();
  const { isConfirmOpen, isSubmitting, requestSignOut, confirmSignOut, cancelSignOut } = useSignOutWithCartWarning();
  const previousTotalItemsRef = useRef(totalItems);
  const badgeResetTimeoutRef = useRef<number | null>(null);
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
  const isTransparentRoute = useMemo(() => {
    if (normalizedPathname === "/") {
      return true;
    }

    if (!normalizedPathname.startsWith(CATEGORY_ROUTE_PREFIX)) {
      return false;
    }

    const categorySlug = normalizedPathname.slice(CATEGORY_ROUTE_PREFIX.length);
    if (!categorySlug || categorySlug.includes("/")) {
      return false;
    }

    let decodedCategorySlug = categorySlug;
    try {
      decodedCategorySlug = decodeURIComponent(categorySlug);
    } catch {
      decodedCategorySlug = categorySlug;
    }

    const normalizedCategorySlug = decodedCategorySlug.trim().toLowerCase();
    if (!normalizedCategorySlug) {
      return false;
    }

    return enabledCategories.some((category) => category.slug === normalizedCategorySlug);
  }, [enabledCategories, normalizedPathname]);
  const overlayHero = isTransparentRoute && !scrolled && !open;

  useEffect(() => {
    if (!isTransparentRoute) {
      setScrolled(true);
      return;
    }

    const handleScroll = () => {
      setScrolled(window.scrollY > 28);
    };

    handleScroll();
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, [isTransparentRoute]);

  useEffect(() => {
    if (totalItems > previousTotalItemsRef.current) {
      setBadgeScaleClass("scale-[1.3]");

      if (badgeResetTimeoutRef.current) {
        window.clearTimeout(badgeResetTimeoutRef.current);
      }

      badgeResetTimeoutRef.current = window.setTimeout(() => {
        setBadgeScaleClass("scale-100");
      }, 20);
    }

    previousTotalItemsRef.current = totalItems;
  }, [totalItems]);

  useEffect(() => {
    return () => {
      if (badgeResetTimeoutRef.current) {
        window.clearTimeout(badgeResetTimeoutRef.current);
      }
    };
  }, []);

  const closeUserMenus = useCallback(() => {
    setIsDesktopUserMenuOpen(false);
    setIsMobileUserMenuOpen(false);
  }, []);

  useEffect(() => {
    setOpen(false);
    closeUserMenus();
  }, [location.pathname, closeUserMenus]);

  useEffect(() => {
    if (!isDesktopUserMenuOpen && !isMobileUserMenuOpen) {
      return;
    }

    const handlePointerDown = (event: MouseEvent) => {
      const targetNode = event.target as Node;
      const clickedDesktopMenu = desktopUserMenuRef.current?.contains(targetNode) ?? false;
      const clickedMobileMenu = mobileUserMenuRef.current?.contains(targetNode) ?? false;

      if (clickedDesktopMenu || clickedMobileMenu) {
        return;
      }

      closeUserMenus();
    };

    const handleEscape = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        closeUserMenus();
      }
    };

    window.addEventListener("mousedown", handlePointerDown);
    window.addEventListener("keydown", handleEscape);
    return () => {
      window.removeEventListener("mousedown", handlePointerDown);
      window.removeEventListener("keydown", handleEscape);
    };
  }, [closeUserMenus, isDesktopUserMenuOpen, isMobileUserMenuOpen]);

  const solidNavTextClass = "text-[var(--color-navbar-solid-foreground)]";
  const solidNavMutedTextClass = "text-[rgba(var(--color-navbar-solid-foreground-rgb),0.78)]";
  const solidNavInteractiveTextClass = "text-[var(--color-navbar-solid-interactive)]";
  const solidNavInteractiveHoverClass = "hover:text-[var(--color-navbar-solid-interactive)]";
  const navTextColor = isTransparentRoute ? "text-[var(--color-secondary)]" : solidNavTextClass;
  const navDefaultTextClass = isTransparentRoute
    ? "text-[rgba(var(--color-secondary-rgb),0.82)]"
    : solidNavMutedTextClass;
  const navActiveTextClass = isTransparentRoute ? "text-[var(--color-secondary)] font-medium" : `${solidNavInteractiveTextClass} font-medium`;
  const navUnderlineClass = isTransparentRoute
    ? "after:bg-[var(--color-secondary)]"
    : "after:bg-[var(--color-navbar-solid-interactive)]";
  const iconButtonHoverClass = isTransparentRoute
    ? "hover:bg-[rgba(var(--color-secondary-rgb),0.1)]"
    : "hover:bg-[rgba(var(--color-navbar-solid-foreground-rgb),0.08)]";
  const navLinks = useMemo(() => {
    if (enabledCategories.length === 0) {
      return baseNavLinks;
    }

    const shopLinkIndex = baseNavLinks.findIndex((link) => link.to === "/shop");
    if (shopLinkIndex < 0) {
      return baseNavLinks;
    }

    const categoryLinks = enabledCategories.map((category) => ({
      to: `/category/${encodeURIComponent(category.slug)}`,
      label: category.name,
    }));

    return [
      ...baseNavLinks.slice(0, shopLinkIndex + 1),
      ...categoryLinks,
      ...baseNavLinks.slice(shopLinkIndex + 1),
    ];
  }, [enabledCategories]);
  const isNavLinkActive = useCallback(
    (to: string) => {
      return location.pathname === to;
    },
    [location.pathname],
  );
  const metadata = (user?.user_metadata ?? {}) as Record<string, unknown>;
  const metadataFirstName = typeof metadata.first_name === "string" ? metadata.first_name.trim() : "";
  const metadataLastName = typeof metadata.last_name === "string" ? metadata.last_name.trim() : "";
  const fallbackName = (user?.email ?? "").split("@")[0];
  const userName = [metadataFirstName, metadataLastName].filter(Boolean).join(" ") || fallbackName || "My Account";
  const userEmail = user?.email ?? "";
  const userInitial = (metadataFirstName || userEmail || "U").slice(0, 1).toUpperCase();

  const cartButton = (
    <button
      type="button"
      aria-label="Open cart"
      onClick={() => {
        setOpen(false);
        openCart();
      }}
      className={`relative cursor-pointer rounded-full p-2 transition-all duration-300 ${navTextColor} ${iconButtonHoverClass}`}
    >
      <ShoppingBag size={20} strokeWidth={1.35} />
      {totalItems > 0 ? (
        <span
          className={`absolute -right-[9px] -top-[8px] inline-flex h-[18px] min-w-[18px] items-center justify-center rounded-full bg-[var(--color-accent)] px-[4px] font-body text-[9px] font-medium leading-none text-[var(--color-primary)] transition-transform duration-300 ease-out ${badgeScaleClass}`}
        >
          {totalItems > 99 ? "99+" : totalItems}
        </span>
      ) : null}
    </button>
  );

  const signInLinkClass = isTransparentRoute
    ? "text-[rgba(var(--color-secondary-rgb),0.88)] hover:text-[var(--color-secondary)]"
    : `${solidNavTextClass} ${solidNavInteractiveHoverClass}`;
  const adminIconClass = isTransparentRoute
    ? "text-[rgba(var(--color-secondary-rgb),0.86)] hover:text-[var(--color-secondary)]"
    : `${solidNavMutedTextClass} ${solidNavInteractiveHoverClass}`;
  const profileTriggerClassName = isTransparentRoute
    ? "flex h-9 w-9 cursor-pointer items-center justify-center rounded-full bg-[rgba(var(--color-secondary-rgb),0.12)] font-body text-[12px] text-[var(--color-secondary)] transition-all duration-300 hover:bg-[rgba(var(--color-secondary-rgb),0.22)]"
    : "flex h-9 w-9 cursor-pointer items-center justify-center rounded-full bg-[rgba(var(--color-primary-rgb),0.1)] font-body text-[12px] text-[var(--color-primary)] transition-all duration-300 hover:bg-[rgba(var(--color-primary-rgb),0.2)]";

  const adminAction = isAuthenticated && isAdmin ? (
    <Link
      to="/admin"
      aria-label="Open admin panel"
      title="Admin Panel"
      className={`cursor-pointer rounded-full p-2 transition-all duration-300 ${adminIconClass} ${iconButtonHoverClass}`}
    >
      <LayoutDashboard size={19} strokeWidth={1.4} />
    </Link>
  ) : null;

  const authActionDesktop = isAuthenticated ? (
    <ProfileMenu
      isOpen={isDesktopUserMenuOpen}
      userInitial={userInitial}
      userName={userName}
      userEmail={userEmail}
      menuId="desktop-account-menu"
      containerRef={desktopUserMenuRef}
      triggerClassName={profileTriggerClassName}
      onToggle={() => {
        setIsMobileUserMenuOpen(false);
        setIsDesktopUserMenuOpen((previous) => !previous);
      }}
      onClose={closeUserMenus}
      onSignOut={requestSignOut}
    />
  ) : (
    <Link
      to="/auth/login"
      className={`cursor-pointer font-body text-[11px] uppercase tracking-[0.1em] transition-colors duration-300 ${signInLinkClass}`}
    >
      Sign In
    </Link>
  );

  const authActionMobile = isAuthenticated ? (
    <ProfileMenu
      isOpen={isMobileUserMenuOpen}
      userInitial={userInitial}
      userName={userName}
      userEmail={userEmail}
      menuId="mobile-account-menu"
      containerRef={mobileUserMenuRef}
      triggerClassName={profileTriggerClassName}
      onToggle={() => {
        setIsDesktopUserMenuOpen(false);
        setIsMobileUserMenuOpen((previous) => !previous);
      }}
      onClose={closeUserMenus}
      onSignOut={requestSignOut}
    />
  ) : (
    <Link
      to="/auth/login"
      className={`cursor-pointer font-body text-[11px] uppercase tracking-[0.1em] transition-colors duration-300 ${signInLinkClass}`}
    >
      Sign In
    </Link>
  );

  return (
    <>
      <nav
        className={`top-0 left-0 z-50 w-full transition-[background-color,border-color,backdrop-filter] duration-300 ${
          isTransparentRoute
            ? overlayHero
              ? "fixed border-transparent bg-transparent"
              : "fixed border-b border-[rgba(var(--color-secondary-rgb),0.16)] bg-[rgba(var(--color-primary-rgb),0.92)] backdrop-blur-md"
            : "sticky bg-[rgba(var(--color-navbar-solid-rgb),0.95)] backdrop-blur-md border-b border-border"
        }`}
      >
        <div className="container mx-auto flex items-center justify-between py-5 px-4">
          <Link to="/" aria-label={`${storeConfig.storeName} home`} className="inline-flex cursor-pointer items-center">
            <StoreLogo
              className="h-10 w-auto sm:h-12 lg:h-14"
              textClassName={`text-[20px] sm:text-[24px] ${isTransparentRoute ? "text-[var(--color-secondary)]" : "text-foreground"}`}
            />
          </Link>

          <div className="hidden lg:flex items-center gap-7">
            <div className="flex items-center gap-10">
              {navLinks.map((link) => (
                <Link
                  key={link.to}
                  to={link.to}
                  className={`relative cursor-pointer font-body text-[11px] uppercase tracking-[0.1em] transition-colors duration-300 after:absolute after:-bottom-[7px] after:left-0 after:h-px after:w-full after:origin-left after:scale-x-0 after:transition-transform after:duration-300 hover:after:scale-x-100 ${
                    isNavLinkActive(link.to) ? `${navActiveTextClass} after:scale-x-100` : navDefaultTextClass
                  } ${navUnderlineClass}`}
                >
                  {link.label}
                </Link>
              ))}
            </div>
            {adminAction}
            {cartButton}
            {authActionDesktop}
          </div>

          <div className="flex items-center gap-4 lg:hidden">
            {adminAction}
            {cartButton}
            {authActionMobile}
            <button
              type="button"
              className={`relative inline-flex h-10 w-10 cursor-pointer items-center justify-center rounded-full transition-all duration-300 ${navTextColor} ${iconButtonHoverClass}`}
              onClick={() => setOpen(!open)}
              aria-label={open ? "Close menu" : "Open menu"}
            >
              <span className="relative block h-6 w-6">
                <Menu
                  size={24}
                  className={`absolute left-0 top-0 transition-all duration-300 ${
                    open ? "rotate-45 scale-75 opacity-0" : "rotate-0 scale-100 opacity-100"
                  }`}
                  aria-hidden="true"
                />
                <X
                  size={24}
                  className={`absolute left-0 top-0 transition-all duration-300 ${
                    open ? "rotate-0 scale-100 opacity-100" : "-rotate-45 scale-75 opacity-0"
                  }`}
                  aria-hidden="true"
                />
              </span>
            </button>
          </div>
        </div>

        {open ? (
          <div
            className={`lg:hidden px-4 pb-4 animate-fade-in ${
              isTransparentRoute
                ? "bg-[rgba(var(--color-primary-rgb),0.92)] backdrop-blur-md border-b border-[rgba(var(--color-secondary-rgb),0.16)]"
                : "bg-[rgba(var(--color-navbar-solid-rgb),0.95)] backdrop-blur-md border-b border-border"
            }`}
          >
            {navLinks.map((link) => (
              <Link
                key={link.to}
                to={link.to}
                onClick={() => setOpen(false)}
                className={`block cursor-pointer py-2.5 font-body text-[11px] uppercase tracking-[0.1em] transition-colors duration-300 ${
                  isNavLinkActive(link.to) ? navActiveTextClass : navDefaultTextClass
                }`}
              >
                {link.label}
              </Link>
            ))}

            {isAuthenticated ? (
              <button
                type="button"
                onClick={() => {
                  setOpen(false);
                  closeUserMenus();
                  requestSignOut();
                }}
                className={`mt-2 block w-full cursor-pointer py-2.5 text-left font-body text-[11px] uppercase tracking-[0.1em] transition-colors duration-300 ${signInLinkClass}`}
              >
                Sign Out
              </button>
            ) : null}
          </div>
        ) : null}
      </nav>

      <SignOutConfirmModal
        isOpen={isConfirmOpen}
        isSubmitting={isSubmitting}
        onConfirm={confirmSignOut}
        onCancel={cancelSignOut}
      />
    </>
  );
};

export default Navbar;
