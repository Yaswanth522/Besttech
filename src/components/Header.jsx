import { useEffect, useRef, useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { initialsFromName } from "../utils/name";
import { routeFor } from "../data/routes";
import { products } from "../data/products";
import BrandLogo from "./BrandLogo";
import SearchDialog from "./SearchDialog";
import "./Header.css";

// Only the categories that map to one of our 5 real product pages —
// the mega-menu doesn't link anywhere we can't actually show a product.
const SHOP_CATEGORIES = [
  { label: "Mice", image: "/images/home/logitech-navigation-mice-mx-master-4.png" },
  { label: "Keyboards", image: "/images/home/logitech-navigation-keyboards-230-0.png" },
  { label: "Webcams", image: "/images/home/logitech-navigation-webcams-230-0.png" },
  { label: "Streaming", image: "/images/home/lighting-2.png" },
];

// The four products featured on the home page carousel's first view.
const FEATURED = products.slice(0, 4);

const NAV_LINKS = ["Software", "Deals", "Planet"];

const isMac = typeof navigator !== "undefined" && /Mac|iPhone|iPad/.test(navigator.platform);

export default function Header() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [megaOpen, setMegaOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const closeTimer = useRef(null);
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const { pathname } = useLocation();

  // Close every overlay when the route changes (adjusting state during render).
  const [lastPath, setLastPath] = useState(pathname);
  if (lastPath !== pathname) {
    setLastPath(pathname);
    setMegaOpen(false);
    setMenuOpen(false);
  }

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  // ⌘K / Ctrl+K or "/" opens search; Escape closes the mega menu.
  useEffect(() => {
    function onKeyDown(e) {
      const typing = /input|textarea|select/i.test(e.target.tagName) || e.target.isContentEditable;
      if ((e.key === "k" && (e.metaKey || e.ctrlKey)) || (e.key === "/" && !typing)) {
        e.preventDefault();
        setMegaOpen(false);
        setSearchOpen(true);
      } else if (e.key === "Escape") {
        setMegaOpen(false);
      }
    }
    document.addEventListener("keydown", onKeyDown);
    return () => document.removeEventListener("keydown", onKeyDown);
  }, []);

  function openMega() {
    clearTimeout(closeTimer.current);
    setMegaOpen(true);
  }

  function closeMegaSoon() {
    clearTimeout(closeTimer.current);
    closeTimer.current = setTimeout(() => setMegaOpen(false), 140);
  }

  function handleLogout() {
    logout();
    navigate("/");
  }

  return (
    <header className={`site-header${scrolled ? " is-scrolled" : ""}${megaOpen ? " is-mega-open" : ""}`}>
      <div className="utility-bar">
        <div className="container utility-bar__inner">
          <ul className="utility-bar__left">
            <li>
              <Link to="/">Best Tech G</Link>
            </li>
            <li>
              <Link to="/">Business</Link>
            </li>
            <li>
              <Link to="/">Education</Link>
            </li>
            <li>
              <Link to="/">Outlet</Link>
            </li>
          </ul>
          <ul className="utility-bar__right">
            <li>
              <Link to="/">Support</Link>
            </li>
            <li>US, en</li>
          </ul>
        </div>
      </div>

      <div className="announcement-bar">
        <span>Save up to $100 when you bundle MX Master 4*</span>
      </div>

      <div className="site-header__main">
        <div className="site-header__bar container">
          <button
            className={`site-header__burger${menuOpen ? " is-open" : ""}`}
            aria-label="Toggle menu"
            aria-expanded={menuOpen}
            onClick={() => setMenuOpen((open) => !open)}
          >
            <span />
            <span />
            <span />
          </button>

          <Link to="/" className="site-header__logo" aria-label="Best Tech home">
            <BrandLogo />
          </Link>

          <nav className={`site-header__nav ${menuOpen ? "is-open" : ""}`} aria-label="Main">
            <ul>
              <li className="has-mega" onMouseEnter={openMega} onMouseLeave={closeMegaSoon}>
                <button
                  type="button"
                  className={`site-header__nav-link${megaOpen ? " is-active" : ""}`}
                  aria-expanded={megaOpen}
                  aria-controls="shop-mega-menu"
                  onClick={() => setMegaOpen((open) => !open)}
                  onFocus={openMega}
                >
                  Shop
                  <svg className="site-header__caret" width="12" height="12" viewBox="0 0 24 24" fill="none" aria-hidden="true">
                    <path d="M6 9l6 6 6-6" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                </button>

                <div
                  id="shop-mega-menu"
                  className={`mega-menu${megaOpen ? " is-open" : ""}`}
                  onMouseEnter={openMega}
                >
                  <div className="container mega-menu__inner">
                    <div className="mega-menu__categories">
                      <h4>Shop by category</h4>
                      <ul>
                        {SHOP_CATEGORIES.map((c) => (
                          <li key={c.label}>
                            <Link to={routeFor(c.label)} className="mega-menu__category" onClick={() => setMegaOpen(false)}>
                              <img src={c.image} alt="" loading="lazy" />
                              <span>{c.label}</span>
                              <ArrowIcon />
                            </Link>
                          </li>
                        ))}
                      </ul>
                    </div>

                    <div className="mega-menu__featured">
                      <div className="mega-menu__featured-head">
                        <h4>Our Products</h4>
                        <Link to="/" className="mega-menu__all" onClick={() => setMegaOpen(false)}>
                          Shop all <ArrowIcon />
                        </Link>
                      </div>
                      <ul className="mega-menu__products">
                        {FEATURED.map((product) => (
                          <li key={product.slug}>
                            <Link
                              to={`/products/${product.slug}`}
                              className="mega-product"
                              onClick={() => setMegaOpen(false)}
                            >
                              <span className="mega-product__image">
                                <img src={product.heroImage} alt="" loading="lazy" />
                              </span>
                              <span className="mega-product__category">{product.category}</span>
                              <strong className="mega-product__name">{product.name}</strong>
                              <span className="mega-product__tagline">{product.tagline}</span>
                              <span className="mega-product__price">${product.price.toFixed(2)}</span>
                            </Link>
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>
                </div>
              </li>

              {/* Mobile drawer: products listed directly, since there's no hover. */}
              <li className="site-header__mobile-products">
                <span className="site-header__mobile-label">Our Products</span>
                {products.map((product) => (
                  <Link key={product.slug} to={`/products/${product.slug}`}>
                    <img src={product.heroImage} alt="" loading="lazy" />
                    <span>{product.name}</span>
                  </Link>
                ))}
              </li>

              {NAV_LINKS.map((label) => (
                <li key={label}>
                  <Link to="/" className="site-header__nav-link" onClick={() => setMenuOpen(false)}>
                    {label}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>

          <div className="site-header__actions">
            <button
              className="search-trigger"
              aria-label="Search or ask Best Tech"
              aria-keyshortcuts={isMac ? "Meta+K" : "Control+K"}
              onClick={() => {
                setMegaOpen(false);
                setSearchOpen(true);
              }}
            >
              <SearchIcon />
              <span className="search-trigger__text">Search products or ask a question</span>
              <kbd className="search-trigger__kbd">{isMac ? "⌘" : "Ctrl"} K</kbd>
            </button>
            <button className="icon-btn" aria-label="Wishlist">
              <WishlistIcon />
            </button>

            {user ? (
              <div className="account-menu">
                <button className="account-menu__avatar" aria-label="Account menu">
                  {initialsFromName(user.name)}
                </button>
                <div className="account-menu__dropdown">
                  <span className="account-menu__greeting">Hi, {user.name}</span>
                  <span className="account-menu__email">{user.email}</span>
                  <button className="account-menu__logout" onClick={handleLogout}>
                    Log Out
                  </button>
                </div>
              </div>
            ) : (
              <Link to="/login" className="icon-btn" aria-label="Account">
                <AccountIcon />
              </Link>
            )}

            <button className="icon-btn" aria-label="Cart">
              <CartIcon />
            </button>
          </div>
        </div>
      </div>

      <div className="mega-menu__scrim" aria-hidden="true" onMouseEnter={closeMegaSoon} onClick={() => setMegaOpen(false)} />

      <SearchDialog open={searchOpen} onClose={() => setSearchOpen(false)} />
    </header>
  );
}

function ArrowIcon() {
  return (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <path d="M5 12h14M13 6l6 6-6 6" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

function SearchIcon() {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
      <circle cx="11" cy="11" r="7" stroke="currentColor" strokeWidth="2" />
      <line x1="21" y1="21" x2="16.65" y2="16.65" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
    </svg>
  );
}

function WishlistIcon() {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
      <path
        d="M12 20s-7.5-4.6-9.5-9C1 7.6 2.8 4.5 6 4.5c2 0 3.4 1.2 4 2.4.6-1.2 2-2.4 4-2.4 3.2 0 5 3.1 3.5 6.5-2 4.4-9.5 9-9.5 9Z"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function AccountIcon() {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
      <circle cx="12" cy="8" r="4" stroke="currentColor" strokeWidth="2" />
      <path d="M4 20c1.6-3.6 5-5.5 8-5.5s6.4 1.9 8 5.5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
    </svg>
  );
}

function CartIcon() {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
      <path
        d="M4 6h2l1.5 10.5A2 2 0 0 0 9.47 18H18a2 2 0 0 0 1.95-1.56L21.5 9H6.5"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <circle cx="10" cy="21" r="1.4" fill="currentColor" />
      <circle cx="18" cy="21" r="1.4" fill="currentColor" />
    </svg>
  );
}
