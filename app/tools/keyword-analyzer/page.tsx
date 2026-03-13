"use client";

import { useState } from "react";

export default function KeywordAnalyzerPage() {
  const [jobDescription, setJobDescription] = useState("");
  const [resumeText, setResumeText] = useState("");
  const [result, setResult] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function analyze() {
    setLoading(true);
    setError(null);

    try {
      const res = await fetch("/api/create-profile/score", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ jobDescription, resumeText }),
      });

      if (!res.ok) {
        throw new Error("Failed to analyze");
      }

      const data = await res.json();
      setResult(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : "An error occurred");
    } finally {
      setLoading(false);
    }
  }

  const getScoreColor = (score: number) => {
    if (score >= 75) return "text-green-600";
    if (score >= 50) return "text-yellow-600";
    return "text-red-600";
  };

  return (
    <main className="p-8">
      <h1 className="mb-6 text-3xl font-bold">Keyword Analyzer</h1>
      <p className="mb-6 text-gray-600">
        Check how well your resume matches the job description.
      </p>

      <div className="grid gap-4">
        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-2">
            Job Description
          </label>
          <textarea
            className="w-full rounded border p-3 min-h-40"
            placeholder="Paste job description"
            value={jobDescription}
            onChange={(e) => setJobDescription(e.target.value)}
          />
        </div>

        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-2">
            Resume Text
          </label>
          <textarea
            className="w-full rounded border p-3 min-h-40"
            placeholder="Paste resume text"
            value={resumeText}
            onChange={(e) => setResumeText(e.target.value)}
          />
        </div>

        {error && (
          <div className="rounded bg-red-100 p-4 text-red-700">{error}</div>
        )}

        <button
          className="rounded bg-black px-4 py-3 text-white disabled:opacity-50"
          onClick={analyze}
          disabled={loading || !jobDescription.trim() || !resumeText.trim()}
        >
          {loading ? "Analyzing..." : "Analyze"}
        </button>

        {result && (
          <div className="rounded border p-4 bg-gray-50">
            <div className="mb-6">
              <p className="text-sm text-gray-600 mb-1">Resume Fit Score</p>
              <p className={`text-4xl font-bold ${getScoreColor(result.score)}`}>
                {result.score}%
              </p>
            </div>

            <div className="grid gap-6 md:grid-cols-2">
              <div>
                <p className="mb-3 font-semibold text-green-900">Matched Keywords</p>
                <div className="flex flex-wrap gap-2">
                  {result.matched.length > 0 ? (
                    result.matched.map((word: string) => (
                      <span
                        key={word}
                        className="rounded bg-green-100 px-2 py-1 text-sm text-green-800"
                      >
                        {word}
                      </span>
                    ))
                  ) : (
                    <p className="text-sm text-gray-600">No keywords matched</p>
                  )}
                </div>
              </div>

              <div>
                <p className="mb-3 font-semibold text-red-900">Missing Keywords</p>
                <div className="flex flex-wrap gap-2">
                  {result.missing.length > 0 ? (
                    result.missing.map((word: string) => (
                      <span
                        key={word}
                        className="rounded bg-red-100 px-2 py-1 text-sm text-red-800"
                      >
                        {word}
                      </span>
                    ))
                  ) : (
                    <p className="text-sm text-gray-600">All keywords matched!</p>
                  )}
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </main>
  );
}
