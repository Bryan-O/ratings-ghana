"use client"; // Error boundaries must be Client Components

// Replaces the root layout when it fails, so it can't rely on globals.css or fonts.
export default function GlobalError({ error, retry }: { error: Error & { digest?: string }; retry: () => void }) {
  return (
    <html lang="en">
      <body style={{ margin: 0, fontFamily: "system-ui, sans-serif", background: "#ffffff", color: "#16161a" }}>
        <title>That didn’t work · RatingsGhana</title>
        <main style={{ minHeight: "100vh", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", gap: 16, padding: 24, textAlign: "center" }}>
          <h1 style={{ fontSize: 28, margin: 0 }}>That didn’t work.</h1>
          <p style={{ color: "#5c5c66", maxWidth: 420, margin: 0 }}>Try again. If it keeps happening, come back in a few minutes.</p>
          <div style={{ display: "flex", gap: 12 }}>
            <button onClick={() => retry()} style={{ height: 48, padding: "0 24px", borderRadius: 12, border: 0, background: "#16161a", color: "#fff", fontWeight: 600, cursor: "pointer" }}>
              Try again
            </button>
            <button onClick={() => window.location.reload()} style={{ height: 48, padding: "0 24px", borderRadius: 12, border: "2px solid #16161a", background: "#fff", color: "#16161a", fontWeight: 600, cursor: "pointer" }}>
              Reload page
            </button>
          </div>
          {error.digest && <p style={{ fontSize: 12, color: "#5c5c66" }}>Reference: {error.digest}</p>}
        </main>
      </body>
    </html>
  );
}
