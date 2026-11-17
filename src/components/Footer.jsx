import { Link } from "react-router-dom";
import BrandLogo from "./BrandLogo";
import "./Footer.css";

const COLUMNS = [
  {
    title: "Best Tech",
    groups: [
      {
        links: [
          "Our Story",
          "Careers",
          "Investors",
          "Learning Center",
          "Blog",
          "Press",
          "Sustainability",
          "Recycling",
          "Accessibility",
        ],
      },
    ],
  },
  {
    title: "Shop products",
    groups: [
      {
        links: [
          "Mice",
          "Keyboards",
          "Headsets & Earbuds",
          "Webcams",
          "Speakers",
          "iPad Keyboard Cases",
          "Gaming Mice",
          "Gaming Keyboards",
          "Gaming Headsets",
          "Microphones",
        ],
      },
    ],
  },
  {
    title: null,
    groups: [
      { heading: "For Productivity", links: ["Master Series", "Ergo Series"] },
      {
        heading: "For Gaming and Streaming",
        links: ["Astro Gaming", "Pro Gaming", "SIM Racing", "Streaming Gear"],
      },
    ],
  },
  {
    title: "For Business",
    groups: [
      {
        links: [
          "Shop Spaces",
          "Shop Business Products",
          "Software & Services",
          "Partners",
          "Alliance Partners",
          "Business Resources",
        ],
      },
    ],
  },
  {
    title: "For Education",
    groups: [
      {
        links: [
          "Shop Education Products",
          "K-12 Solutions",
          "Education Resources",
          "Student Discount",
        ],
      },
    ],
  },
  {
    title: "Support",
    groups: [
      {
        links: [
          "Individual Support",
          "Gaming Support",
          "Business & Education Support",
          "Contact us",
          "Spare Parts",
          "Track Your Order",
          "Returns & Cancellations",
        ],
      },
    ],
  },
  {
    title: "Software",
    groups: [{ links: ["GHub for Gaming & Streaming", "Options+ for Performance"] }],
  },
];

export default function Footer() {
  return (
    <footer className="site-footer">
      <div className="site-footer__glow" aria-hidden="true" />
      <div className="container">
        <div className="site-footer__newsletter">
          <div className="site-footer__newsletter-copy">
            <h3>Subscribe to receive your special offer and exclusive benefits.</h3>
            <label className="site-footer__consent">
              <input type="checkbox" />
              <span>
                I want personalized marketing from Best Tech. You can
                unsubscribe anytime. See our{" "}
                <Link to="/">Privacy Policy.</Link>
              </span>
            </label>
          </div>
          <form className="site-footer__form" onSubmit={(e) => e.preventDefault()}>
            <input type="email" placeholder="Email address" aria-label="Email address" />
            <button type="submit" className="site-footer__subscribe" aria-label="Subscribe">
              Subscribe
            </button>
          </form>
        </div>

        <div className="site-footer__main">
          <div className="site-footer__brand">
            <Link to="/" aria-label="Best Tech home">
              <BrandLogo tone="light" />
            </Link>
            <div className="site-footer__social">
              <a href="#" aria-label="Instagram" onClick={(e) => e.preventDefault()}>
                <InstagramIcon />
              </a>
              <a href="#" aria-label="Twitter" onClick={(e) => e.preventDefault()}>
                <TwitterIcon />
              </a>
              <a href="#" aria-label="Facebook" onClick={(e) => e.preventDefault()}>
                <FacebookIcon />
              </a>
            </div>
            <span className="site-footer__locale">
              <GlobeIcon /> US, en
            </span>
          </div>

          <div className="site-footer__columns">
            {COLUMNS.map((col, i) => (
              <div key={col.title ?? i} className="site-footer__column">
                {col.groups.map((group) => (
                  <div key={group.heading ?? col.title} className="site-footer__group">
                    <h4>{group.heading ?? col.title}</h4>
                    <ul>
                      {group.links.map((label) => (
                        <li key={label}>
                          <Link to="/">{label}</Link>
                        </li>
                      ))}
                    </ul>
                  </div>
                ))}
              </div>
            ))}
          </div>
        </div>

        <div className="site-footer__trademark">
          <h4>Legal Trademark Statement</h4>
          <p>
            Best Tech, its logos, and all other Best Tech trademarks are
            trademarks or registered trademarks of Best Tech and/or its
            affiliates in the U.S. and other countries. All other third party
            trademarks are the property of their respective owners.{" "}
            <Link to="/">See all trademarks</Link>
          </p>
        </div>

        <div className="site-footer__bottom">
          <p>&copy; {new Date().getFullYear()} Best Tech. All rights reserved</p>
          <ul className="site-footer__legal-links">
            <li>
              <Link to="/">Terms of Use</Link>
            </li>
            <li>
              <Link to="/">Privacy Policy</Link>
            </li>
            <li>
              <Link to="/">Cookie Settings</Link>
            </li>
            <li>
              <Link to="/">Sitemap</Link>
            </li>
          </ul>
        </div>
      </div>

      <div className="site-footer__wordmark" aria-hidden="true">
        best<span>tech</span>
      </div>
    </footer>
  );
}

function GlobeIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <circle cx="12" cy="12" r="9" stroke="currentColor" strokeWidth="1.8" />
      <path d="M3 12h18M12 3c2.5 2.6 3.8 5.6 3.8 9s-1.3 6.4-3.8 9c-2.5-2.6-3.8-5.6-3.8-9S9.5 5.6 12 3Z" stroke="currentColor" strokeWidth="1.8" />
    </svg>
  );
}

function InstagramIcon() {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
      <rect x="3" y="3" width="18" height="18" rx="5" stroke="currentColor" strokeWidth="1.8" />
      <circle cx="12" cy="12" r="4" stroke="currentColor" strokeWidth="1.8" />
      <circle cx="17.5" cy="6.5" r="1" fill="currentColor" />
    </svg>
  );
}

function TwitterIcon() {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
      <path
        d="M22 5.9c-.7.3-1.5.6-2.3.7a4 4 0 0 0 1.8-2.2 8 8 0 0 1-2.5 1 4 4 0 0 0-6.9 3.6A11.4 11.4 0 0 1 3.8 4.6a4 4 0 0 0 1.2 5.3 4 4 0 0 1-1.8-.5v.1a4 4 0 0 0 3.2 3.9 4 4 0 0 1-1.8.1 4 4 0 0 0 3.7 2.8A8 8 0 0 1 2 17.6a11.3 11.3 0 0 0 6.1 1.8c7.4 0 11.4-6.1 11.4-11.4v-.5A8 8 0 0 0 22 5.9Z"
        fill="currentColor"
      />
    </svg>
  );
}

function FacebookIcon() {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
      <path
        d="M14 22v-8h2.7l.4-3.1H14V9c0-.9.3-1.5 1.6-1.5H17V4.7C16.7 4.6 15.8 4.5 14.7 4.5c-2.3 0-3.8 1.4-3.8 3.9v2.5H8.2V14H11v8h3Z"
        fill="currentColor"
      />
    </svg>
  );
}
