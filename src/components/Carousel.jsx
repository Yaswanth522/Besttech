import { useCallback, useEffect, useRef, useState } from "react";
import "./Carousel.css";

/**
 * Horizontal scroll-snap carousel with prev/next arrows and a progress bar.
 * Native scrolling keeps touch/trackpad swiping and keyboard focus working;
 * the arrows just page the track by its visible width.
 */
export default function Carousel({ title, eyebrow, action, children, className = "", itemClassName = "" }) {
  const trackRef = useRef(null);
  const [state, setState] = useState({ atStart: true, atEnd: false, progress: 0, thumb: 1 });

  const measure = useCallback(() => {
    const el = trackRef.current;
    if (!el) return;
    const max = el.scrollWidth - el.clientWidth;
    setState({
      atStart: el.scrollLeft <= 2,
      atEnd: el.scrollLeft >= max - 2,
      progress: max > 0 ? el.scrollLeft / max : 0,
      thumb: el.scrollWidth > 0 ? Math.min(1, el.clientWidth / el.scrollWidth) : 1,
    });
  }, []);

  useEffect(() => {
    const el = trackRef.current;
    if (!el) return undefined;
    measure();
    el.addEventListener("scroll", measure, { passive: true });
    const ro = new ResizeObserver(measure);
    ro.observe(el);
    return () => {
      el.removeEventListener("scroll", measure);
      ro.disconnect();
    };
  }, [measure]);

  function page(direction) {
    const el = trackRef.current;
    if (!el) return;
    el.scrollBy({ left: direction * el.clientWidth * 0.85, behavior: "smooth" });
  }

  const scrollable = state.thumb < 1;
  const items = Array.isArray(children) ? children : [children];

  return (
    <div className={`carousel ${className}`.trim()}>
      <div className="carousel__head">
        <div>
          {eyebrow && <span className="eyebrow">{eyebrow}</span>}
          {title && <h2 className="carousel__title">{title}</h2>}
        </div>
        <div className="carousel__controls">
          {action}
          {scrollable && (
            <>
              <button
                type="button"
                className="carousel__arrow"
                onClick={() => page(-1)}
                disabled={state.atStart}
                aria-label="Previous"
              >
                <Chevron dir="left" />
              </button>
              <button
                type="button"
                className="carousel__arrow"
                onClick={() => page(1)}
                disabled={state.atEnd}
                aria-label="Next"
              >
                <Chevron dir="right" />
              </button>
            </>
          )}
        </div>
      </div>

      <ul className="carousel__track" ref={trackRef}>
        {items.map((child, i) => (
          <li key={child?.key ?? i} className={`carousel__item ${itemClassName}`.trim()}>
            {child}
          </li>
        ))}
      </ul>

      {scrollable && (
        <div className="carousel__progress" aria-hidden="true">
          <span
            style={{
              width: `${state.thumb * 100}%`,
              left: `${state.progress * (1 - state.thumb) * 100}%`,
            }}
          />
        </div>
      )}
    </div>
  );
}

function Chevron({ dir }) {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <path
        d={dir === "left" ? "M15 5l-7 7 7 7" : "M9 5l7 7-7 7"}
        stroke="currentColor"
        strokeWidth="2.2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}
