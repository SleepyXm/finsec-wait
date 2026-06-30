import { useState } from "react";
import { Label } from "./UI/UI";

// ─── Waitlist form ───────────────────────────────────────────────────────────

export function WaitlistForm({
  t,
  onSubmit,
}: {
  t: any;
  onSubmit: (data: { email: string }) => Promise<void>;
}) {
  const [email, setEmail] = useState("");
  const [emailErr, setEmailErr] = useState(false);
  const [error, setError] = useState<string | null>(null); // 👈
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false); // 👈 optional but useful

  const fieldStyle = (hasError = false) => ({
    background: t.bg2,
    color: t.text,
    border: `0.5px solid ${hasError ? t.errorText : t.border}`,
    borderRadius: 8,
    padding: "10px 14px",
    fontSize: 14,
    width: "100%",
    boxSizing: "border-box" as const,
    fontFamily: "inherit",
    outline: "none",
  });

  const handleSubmit = async () => {
    const valid = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
    if (!valid) {
      setEmailErr(true);
      return;
    }
    setLoading(true);
    setError(null);
    try {
      await onSubmit({ email });
      setSuccess(true);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  if (success) {
    return <p style={{ color: t.text, textAlign: "center" }}>You're on the list! Check your email.</p>;
  }

  return (
    <div>
      <div style={{ marginBottom: 10 }}>
        <Label t={t}>Email address</Label>
        <input
          type="email"
          value={email}
          placeholder="you@example.com"
          onChange={(e) => {
            setEmail(e.target.value);
            setEmailErr(false);
            setError(null); // 👈 clear on change
          }}
          style={fieldStyle(emailErr)}
        />
        {emailErr && (
          <div style={{ fontSize: 12, color: t.errorText, background: t.errorBg, padding: "6px 10px", borderRadius: 8, marginTop: 6 }}>
            Please enter a valid email address.
          </div>
        )}
        {error && ( // 👈
          <div style={{ fontSize: 12, color: t.errorText, background: t.errorBg, padding: "6px 10px", borderRadius: 8, marginTop: 6 }}>
            {error}
          </div>
        )}
      </div>

      <button
        onClick={handleSubmit}
        disabled={loading}
        style={{
          width: "100%",
          background: t.btn,
          color: t.btnText,
          border: "none",
          borderRadius: 8,
          padding: 11,
          fontSize: 14,
          fontWeight: 500,
          cursor: loading ? "not-allowed" : "pointer",
          opacity: loading ? 0.6 : 1,
          fontFamily: "inherit",
        }}
      >
        {loading ? "Joining…" : "Join the waitlist"}
      </button>
      <p style={{ fontSize: 11, color: t.hint, textAlign: "center", margin: "8px 0 0" }}>
        No spam. Unsubscribe anytime.{" "}
        <a href="/privacy" style={{ color: t.hint, textDecoration: "underline" }}>Privacy policy</a>.
      </p>
    </div>
  );
}