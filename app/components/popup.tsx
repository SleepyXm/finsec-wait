export function Success({ t }: {t: any}) {
  return (
    <div
      style={{
        background: t.success,
        borderRadius: 12,
        padding: "2rem",
        textAlign: "center",
      }}
    >
      <p style={{ fontSize: 16, fontWeight: 500, color: t.successText, margin: "0 0 5px" }}>
        ✓ You're on the list!
      </p>
      <p style={{ fontSize: 13, color: t.successText, margin: 0, opacity: 0.8 }}>
        We'll reach out when your early access spot is ready.
      </p>
    </div>
  );
}