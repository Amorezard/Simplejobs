"use client";

import { useState } from "react";

export default function BulletOptimizerPage() {
  const [bullet, setBullet] = useState("");
  const [suggestions, setSuggestions] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function optimize() {
    setLoading(true);
    setError(null);

    try {
      const res = await fetch("/api/bullets", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ bullet }),
      });

      if (!res.ok) {
        throw new Error("Failed to optimize bullet");
      }

      const data = await res.json();
      setSuggestions(data.suggestions);
    } catch (err) {
      setError(err instanceof Error ? err.message : "An error occurred");
    } finally {
      setLoading(false);
    }
  }

  return (
    <main className="p-8">
      <h1 className="mb-6 text-3xl font-bold">Bullet Optimizer</h1>
      <p className="mb-4 text-gray-600">
        Transform weak resume bullets into powerful, impactful statements.
      </p>

      <textarea
        className="w-full rounded border p-3 min-h-32"
        placeholder="Paste a weak resume bullet"
        value={bullet}
        onChange={(e) => setBullet(e.target.value)}
      />

      {error && (
        <div className="mt-4 rounded bg-red-100 p-4 text-red-700">{error}</div>
      )}

      <button
        className="mt-4 rounded bg-black px-4 py-3 text-white disabled:opacity-50"
        onClick={optimize}
        disabled={loading || !bullet.trim()}
      >
        {loading ? "Optimizing..." : "Optimize"}
      </button>

      <div className="mt-8 space-y-3">
        {suggestions.map((s, i) => (
          <div key={i} className="rounded border border-green-200 bg-green-50 p-4">
            <p className="text-sm font-semibold text-gray-600">Option {i + 1}:</p>
            <p className="mt-2">{s}</p>
            <button
              className="mt-3 text-sm text-blue-600 hover:underline"
              onClick={() => {
                navigator.clipboard.writeText(s);
                alert("Copied to clipboard!");
              }}
            >
              Copy
            </button>
          </div>
        ))}
      </div>
    </main>
  );
}
