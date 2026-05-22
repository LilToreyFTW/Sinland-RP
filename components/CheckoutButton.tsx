"use client";

import { useState } from "react";

export function CheckoutButton({ tierSlug }: { tierSlug: string }) {
  const [loading, setLoading] = useState(false);

  async function handleClick() {
    setLoading(true);

    try {
      const response = await fetch("/api/checkout", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({ tierSlug })
      });

      const data = (await response.json()) as { url?: string; error?: string };
      if (data.url) {
        window.location.href = data.url;
        return;
      }

      alert(data.error || "Checkout is not configured yet.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <button className="tier-action" onClick={handleClick} disabled={loading}>
      {loading ? "Opening..." : "Buy Tier"}
    </button>
  );
}
