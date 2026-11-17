import { useId } from "react";
import { BRAND_COLORS, BRAND_NAME } from "../data/brand";
import "./BrandLogo.css";

/**
 * Best Tech logo: a gradient tile holding a geometric "b", followed by the
 * lowercase wordmark. `tone="light"` is for dark surfaces (footer).
 */
export default function BrandLogo({ tone = "dark", showWordmark = true, className = "" }) {
  const gradientId = useId();

  return (
    <span className={`brand-logo brand-logo--${tone} ${className}`.trim()} role="img" aria-label={BRAND_NAME}>
      <svg className="brand-logo__mark" viewBox="0 0 32 32" aria-hidden="true">
        <defs>
          <linearGradient id={gradientId} x1="0" y1="0" x2="32" y2="32" gradientUnits="userSpaceOnUse">
            <stop offset="0" stopColor={BRAND_COLORS.violet} />
            <stop offset="0.55" stopColor={BRAND_COLORS.magenta} />
            <stop offset="1" stopColor={BRAND_COLORS.coral} />
          </linearGradient>
        </defs>
        <rect width="32" height="32" rx="9" fill={`url(#${gradientId})`} />
        <rect x="8.5" y="6.5" width="4" height="19" rx="2" fill="#fff" />
        <circle cx="17" cy="19" r="5.25" fill="none" stroke="#fff" strokeWidth="4" />
        <circle cx="25" cy="8" r="2" fill="#fff" opacity="0.9" />
      </svg>
      {showWordmark && (
        <span className="brand-logo__word" aria-hidden="true">
          best<span className="brand-logo__accent">tech</span>
        </span>
      )}
    </span>
  );
}
