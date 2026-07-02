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
  const [isSmallScreen, setIsSmallScreen] = useState(false);

  useEffect(() => {
    setConsentGiven("pending");

    const checkScreen = () => {
      setIsSmallScreen(window.innerWidth <= 480);
    };

    checkScreen();
    window.addEventListener("resize", checkScreen);

    return () => window.removeEventListener("resize", checkScreen);
  }, []);

  if (consentGiven !== "pending") return null;

  const t = theme.dark;

  return (
    <div
      style={{
        position: "fixed",
        left: isSmallScreen ? "0.75rem" : "1rem",
        right: isSmallScreen ? "0.75rem" : "1rem",
        bottom: isSmallScreen ? "0.75rem" : "1rem",
        zIndex: 9999,
        pointerEvents: "none",
      }}
    >
      <div
        style={{
          ...panelStyle(t),
          padding: isSmallScreen ? "0.9rem" : "1rem",
          display: "flex",
          flexDirection: isSmallScreen ? "column" : "row",
          alignItems: isSmallScreen ? "stretch" : "center",
          justifyContent: "space-between",
          gap: isSmallScreen ? "0.85rem" : "1rem",
          pointerEvents: "auto",
          boxShadow: "0 24px 80px rgba(0,0,0,0.28)",
        }}
      >
        <div style={cornerStyle()} />

        <p
          style={{
            margin: 0,
            width: "100%",
            maxWidth: isSmallScreen ? "100%" : 720,
            color: t.muted,
            fontSize: 14,
            lineHeight: 1.55,
          }}
        >
          We use tracking cookies to understand how you use the product and help
          us improve it. Please accept cookies to help us improve.
        </p>

        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: isSmallScreen ? "stretch" : "flex-end",
            gap: "0.75rem",
            width: isSmallScreen ? "100%" : "auto",
          }}
        >
          <button
            type="button"
            onClick={() => setConsentGiven("accepted")}
            style={{
              ...buttonStyle(t),
              flex: isSmallScreen ? 1 : undefined,
            }}
          >
            Accept cookies
          </button>

          <button
            type="button"
            onClick={() => setConsentGiven("declined")}
            style={{
              ...ghostButtonStyle(t),
              flex: isSmallScreen ? 1 : undefined,
            }}
          >
            Decline
          </button>
        </div>
      </div>
    </div>
  );
}