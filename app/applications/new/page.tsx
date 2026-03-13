"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export default function NewApplicationPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [form, setForm] = useState({
    company: "",
    role: "",
    location: "",
    jobUrl: "",
    dateApplied: "",
    notes: "",
    jobDescription: "",
  });

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const res = await fetch("/api/create-profile/applications", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(form),
      });

      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error || "Failed to create application");
      }

      router.push("/applications");
    } catch (err) {
      setError(err instanceof Error ? err.message : "An error occurred");
      setLoading(false);
    }
  }

  return (
    <main className="mx-auto max-w-2xl p-8">
      <h1 className="mb-6 text-3xl font-bold">New Application</h1>
      
      {error && (
        <div className="mb-4 rounded bg-red-100 p-4 text-red-700">
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-4">
        <input
          className="w-full rounded border p-3"
          placeholder="Company"
          value={form.company}
          onChange={(e) => setForm({ ...form, company: e.target.value })}
          required
        />
        <input
          className="w-full rounded border p-3"
          placeholder="Role"
          value={form.role}
          onChange={(e) => setForm({ ...form, role: e.target.value })}
          required
        />
        <input
          className="w-full rounded border p-3"
          placeholder="Location"
          value={form.location}
          onChange={(e) => setForm({ ...form, location: e.target.value })}
        />
        <input
          className="w-full rounded border p-3"
          placeholder="Job URL"
          type="url"
          value={form.jobUrl}
          onChange={(e) => setForm({ ...form, jobUrl: e.target.value })}
        />
        <input
          className="w-full rounded border p-3"
          type="date"
          value={form.dateApplied}
          onChange={(e) => setForm({ ...form, dateApplied: e.target.value })}
        />
        <textarea
          className="w-full rounded border p-3"
          placeholder="Notes"
          value={form.notes}
          onChange={(e) => setForm({ ...form, notes: e.target.value })}
        />
        <textarea
          className="w-full rounded border p-3 min-h-40"
          placeholder="Paste job description here"
          value={form.jobDescription}
          onChange={(e) => setForm({ ...form, jobDescription: e.target.value })}
        />
        <button
          className="rounded bg-black px-4 py-3 text-white disabled:opacity-50"
          type="submit"
          disabled={loading}
        >
          {loading ? "Saving..." : "Save Application"}
        </button>
      </form>
    </main>
  );
}