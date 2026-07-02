'use client';

import { useEffect, useState } from "react";
import {
  theme,
  panelStyle,
  cornerStyle,
  buttonStyle,
  ghostButtonStyle,
} from "~/components/UI/UI";

export function Banner() {
  const [consentGiven, setConsentGiven] = useState("");

  useEffect(() => {
    setConsentGiven("pending");
  }, []);

  if (consentGiven !== "pending") return null;

  const t = theme.dark;

  return (
    <>
      <style jsx>{`
        .cookie-banner-copy-full {
          display: inline;
        }

        .cookie-banner-copy-short {
          display: none;
        }

        @media (max-width: 480px) {
          .cookie-banner-inner {
            padding: 0.85rem !important;
            gap: 0.75rem !important;
          }

          .cookie-banner-copy-full {
            display: none;
          }

          .cookie-banner-copy-short {
            display: inline;
          }

          .cookie-banner-actions {
            gap: 0.5rem !important;
          }
        }
      `}</style>

      <div
        style={{
          position: "fixed",
          left: "1rem",
          right: "1rem",
          bottom: "1rem",
          zIndex: 9999,
          pointerEvents: "none",
        }}
      >
        <div
          className="cookie-banner-inner"
          style={{
            ...panelStyle(t),
            padding: "1rem",
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            gap: "1rem",
            pointerEvents: "auto",
            boxShadow: "0 24px 80px rgba(0,0,0,0.28)",
          }}
        >
          <div style={cornerStyle()} />

          <p
            style={{
              margin: 0,
              maxWidth: 720,
              color: t.muted,
              fontSize: 14,
              lineHeight: 1.55,
              flex: 1,
            }}
          >
            <span className="cookie-banner-copy-full">
              We use tracking cookies to understand how you use the product and
              help us improve it. Please accept cookies to help us improve.
            </span>

            <span className="cookie-banner-copy-short">
              We use cookies to improve the product.
            </span>
          </p>

          <div
            className="cookie-banner-actions"
            style={{
              display: "flex",
              alignItems: "center",
              gap: "0.75rem",
              flexShrink: 0,
            }}
          >
            <button
              type="button"
              onClick={() => setConsentGiven("accepted")}
              style={buttonStyle(t)}
            >
              Accept
            </button>

            <button
              type="button"
              onClick={() => setConsentGiven("declined")}
              style={ghostButtonStyle(t)}
            >
              Decline
            </button>
          </div>
        </div>
      </div>
    </>
  );
}