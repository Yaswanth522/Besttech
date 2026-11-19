import { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { resolveSearch } from "../data/search";
import { products } from "../data/products";
import { prewarmLogi } from "../utils/logiBridge";
import { useLogiAnswer } from "../utils/useLogiAnswer";
import LogiAnswer from "./LogiAnswer";
import "./SearchDialog.css";

/**
 * Chips are phrased as questions on purpose, and verified against the live
 * assistant. Two constraints, both learned the hard way:
 *
 *  - the query must hit an indexed document, or the answer is "I don't have
 *    that" — the knowledge base covers setup guides, not the whole catalog;
 *  - the phrasing must read as informational. A fault-shaped query ("my
 *    keyboard stopped connecting") correctly routes to the Troubleshoot agent,
 *    which opens with an identity check — a question, not an answer, and the
 *    wrong thing to show in a search result.
 */
const SUGGESTIONS = [
  "How do I set up my MX Master 3S?",
  "How do I pair a Best Tech keyboard using Easy-Switch?",
  "How do I set up my Brio 4K webcam?",
  "What is MX Master 3S?",
];

/** Instant, local product matches while the customer types. */
function matchProducts(text) {
  const words = text.toLowerCase().split(/\s+/).filter((w) => w.length > 1);
  if (!words.length) return [];
  return products.filter((p) => {
    const hay = `${p.name} ${p.category} ${p.tagline}`.toLowerCase();
    return words.some((w) => hay.includes(w));
  });
}

export default function SearchDialog({ open, onClose }) {
  const [query, setQuery] = useState("");
  const [asked, setAsked] = useState("");
  const inputRef = useRef(null);
  const navigate = useNavigate();

  const answer = useLogiAnswer(asked, { enabled: open });
  const product = asked ? resolveSearch(asked).pack?.product : null;
  const matches = !asked && query.trim() ? matchProducts(query) : [];
  const shownProducts = query.trim() && !asked ? matches : products;

  useEffect(() => {
    if (!open) return;
    setQuery("");
    setAsked("");
    // Bring the conversation up while the customer is still typing.
    prewarmLogi();
    const focusTimer = setTimeout(() => inputRef.current?.focus(), 50);
    return () => clearTimeout(focusTimer);
  }, [open]);

  useEffect(() => {
    if (!open) return;
    function onKeyDown(e) {
      if (e.key === "Escape") onClose();
    }
    document.addEventListener("keydown", onKeyDown);
    return () => document.removeEventListener("keydown", onKeyDown);
  }, [open, onClose]);

  function ask(text) {
    const trimmed = text.trim();
    if (!trimmed) return;
    setQuery(trimmed);
    setAsked(trimmed);
  }

  function goTo(href) {
    onClose();
    navigate(href);
  }

  function handleSubmit(e) {
    e.preventDefault();
    ask(query);
  }

  if (!open) return null;

  return (
    <div className="search-dialog__backdrop" onMouseDown={onClose}>
      <div
        className="search-dialog"
        role="dialog"
        aria-modal="true"
        aria-label="Ask Best Tech"
        onMouseDown={(e) => e.stopPropagation()}
      >
        <form className="search-dialog__form" onSubmit={handleSubmit}>
          <SparkleIcon />
          <input
            ref={inputRef}
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search products or ask Best Tech a question"
            aria-label="Ask Best Tech"
          />
          {query && !asked && (
            <button type="submit" className="search-dialog__ask">
              Ask
            </button>
          )}
          {query && (
            <button
              type="button"
              className="search-dialog__clear"
              onClick={() => {
                setQuery("");
                setAsked("");
              }}
              aria-label="Clear search"
            >
              ×
            </button>
          )}
          <button type="button" className="search-dialog__close" onClick={onClose} aria-label="Close search">
            <CloseIcon />
          </button>
        </form>

        <div className="search-dialog__body">
          {!asked ? (
            <>
              {(shownProducts.length > 0 || query.trim()) && (
                <div className="search-dialog__section">
                  <span className="search-dialog__label">
                    {query.trim() ? "Matching products" : "Popular products"}
                  </span>
                  {shownProducts.length ? (
                    <ul className="search-dialog__products">
                      {shownProducts.map((p) => (
                        <li key={p.slug}>
                          <button type="button" onClick={() => goTo(`/products/${p.slug}`)}>
                            <span className="search-dialog__product-img">
                              <img src={p.heroImage} alt="" />
                            </span>
                            <span className="search-dialog__product-copy">
                              <strong>{p.name}</strong>
                              <em>{p.tagline}</em>
                            </span>
                            <span className="search-dialog__product-price">${p.price.toFixed(2)}</span>
                          </button>
                        </li>
                      ))}
                    </ul>
                  ) : (
                    <p className="search-dialog__empty">
                      No products match “{query.trim()}”. Press Enter to ask Best Tech instead.
                    </p>
                  )}
                </div>
              )}

              <div className="search-dialog__section search-dialog__suggestions">
                <span className="search-dialog__label">Try asking</span>
                <div className="search-dialog__chips">
                  {SUGGESTIONS.map((s) => (
                    <button key={s} type="button" onClick={() => ask(s)}>
                      <SparkleIcon size={14} />
                      {s}
                    </button>
                  ))}
                </div>
              </div>
            </>
          ) : (
            <>
              <LogiAnswer
                compact
                query={asked}
                answer={answer}
                product={product}
                onGo={goTo}
                onContinue={onClose}
              />
            </>
          )}
        </div>

        <div className="search-dialog__footer" aria-hidden="true">
          <span><kbd>↵</kbd> to ask</span>
          <span><kbd>Esc</kbd> to close</span>
        </div>
      </div>
    </div>
  );
}

function SparkleIcon({ size = 20 }) {
  return (
    <svg className="search-dialog__sparkle" width={size} height={size} viewBox="0 0 24 24" aria-hidden="true">
      <defs>
        <linearGradient id="search-sparkle" x1="0" y1="0" x2="24" y2="24" gradientUnits="userSpaceOnUse">
          <stop offset="0" stopColor="#6d28d9" />
          <stop offset="0.55" stopColor="#c026d3" />
          <stop offset="1" stopColor="#ff6b3d" />
        </linearGradient>
      </defs>
      <path
        fill="url(#search-sparkle)"
        d="M11 2l1.9 5.6L18.5 9.5l-5.6 1.9L11 17l-1.9-5.6L3.5 9.5l5.6-1.9L11 2Zm8 11l.9 2.6 2.6.9-2.6.9L19 20l-.9-2.6-2.6-.9 2.6-.9L19 13Z"
      />
    </svg>
  );
}

function CloseIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
      <line x1="5" y1="5" x2="19" y2="19" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
      <line x1="19" y1="5" x2="5" y2="19" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
    </svg>
  );
}
