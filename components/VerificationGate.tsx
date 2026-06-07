"use client";

import { useState } from "react";

type ResultState = {
  error?: string;
  success?: boolean;
};

export function VerificationGate({
  steamIdentifier,
  discordId
}: {
  steamIdentifier?: string | null;
  discordId: string;
}) {
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<ResultState>({});

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setLoading(true);
    setResult({});

    try {
      const response = await fetch("/api/verification", {
        method: "POST",
        credentials: "same-origin",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({ discordId, steamInput: input })
      });

      const payload = (await response.json()) as { error?: string; success?: boolean };
      if (!response.ok) {
        setResult({ error: payload.error || "Verification failed." });
        return;
      }

      setResult({ success: true });
      window.location.reload();
    } catch {
      setResult({ error: "Could not submit verification." });
    } finally {
      setLoading(false);
    }
  }

  return (
    <section className="verification-panel" id="verification-gate">
      <div className="section-heading">
        <span className="section-kicker">Must Do Verification</span>
        <h2>Enter your Steam profile or FiveM hex before full access.</h2>
        <p>
          If you are in the Sinland Discord, you must link your Steam/FiveM identity here before you can fully access
          the site or be cleared for Sinland-RP. You can paste a Steam profile URL, a 17-digit SteamID64, or a
          `steam:110000...` FiveM hex.
        </p>
      </div>

      <div className="resource-grid two-up">
        <article className="resource-card">
          <h3>How to get it</h3>
          <p>
            Use <a href="https://steamid.pro/" target="_blank" rel="noreferrer">steamid.pro</a>, paste your Steam
            profile link, and copy the FiveM hex. Example profile:
            <br />
            <a
              href="https://steamcommunity.com/profiles/76561199667609484/"
              target="_blank"
              rel="noreferrer"
            >
              https://steamcommunity.com/profiles/76561199667609484/
            </a>
          </p>
        </article>
        <article className="resource-card">
          <h3>Current verification</h3>
          <p>{steamIdentifier ? `Saved hex: ${steamIdentifier}` : "No verified FiveM hex saved yet."}</p>
        </article>
      </div>

      <form className="forum-form verification-form" onSubmit={handleSubmit}>
        <label>
          <span>Steam profile link or FiveM hex</span>
          <input
            value={input}
            onChange={(event) => setInput(event.target.value)}
            placeholder="https://steamcommunity.com/profiles/... or steam:110000..."
            required
          />
        </label>
        <div className="forum-form-footer">
          <button className="button" type="submit" disabled={loading}>
            {loading ? "Saving..." : "Verify Steam Hex"}
          </button>
          <span className="status-copy">{result.error || (result.success ? "Verification saved." : "")}</span>
        </div>
      </form>
    </section>
  );
}
