"use client";

import { useState } from "react";

export default function InterviewPrepPage() {
  const [role, setRole] = useState("");
  const [jobDescription, setJobDescription] = useState("");
  const [result, setResult] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function generate() {
    setLoading(true);
    setError(null);

    try {
      const res = await fetch("/api/interview", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ role, jobDescription }),
      });

      if (!res.ok) {
        throw new Error("Failed to generate questions");
      }

      const data = await res.json();
      setResult(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : "An error occurred");
    } finally {
      setLoading(false);
    }
  }

  return (
    <main className="p-8">
      <h1 className="mb-6 text-3xl font-bold">Interview Prep</h1>
      <p className="mb-6 text-gray-600">
        Generate relevant interview questions based on the job description.
      </p>

      <div className="space-y-4">
        <input
          className="w-full rounded border p-3"
          placeholder="Role (e.g., Senior React Developer)"
          value={role}
          onChange={(e) => setRole(e.target.value)}
        />
        <textarea
          className="w-full rounded border p-3 min-h-40"
          placeholder="Paste job description"
          value={jobDescription}
          onChange={(e) => setJobDescription(e.target.value)}
        />

        {error && (
          <div className="rounded bg-red-100 p-4 text-red-700">{error}</div>
        )}

        <button
          className="rounded bg-black px-4 py-3 text-white disabled:opacity-50"
          onClick={generate}
          disabled={loading || !role.trim() || !jobDescription.trim()}
        >
          {loading ? "Generating..." : "Generate Questions"}
        </button>
      </div>

      {result && (
        <div className="mt-8 grid gap-6 md:grid-cols-2">
          <div className="rounded border border-blue-200 bg-blue-50 p-4">
            <h2 className="mb-3 text-xl font-semibold text-blue-900">Technical Questions</h2>
            <ul className="space-y-3">
              {result.technical.map((q: string, i: number) => (
                <li key={i} className="flex gap-3">
                  <span className="flex-shrink-0 text-blue-600">•</span>
                  <span className="text-gray-700">{q}</span>
                </li>
              ))}
            </ul>
          </div>
          <div className="rounded border border-purple-200 bg-purple-50 p-4">
            <h2 className="mb-3 text-xl font-semibold text-purple-900">Behavioral Questions</h2>
            <ul className="space-y-3">
              {result.behavioral.map((q: string, i: number) => (
                <li key={i} className="flex gap-3">
                  <span className="flex-shrink-0 text-purple-600">•</span>
                  <span className="text-gray-700">{q}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      )}
    </main>
  );
}
