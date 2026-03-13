import Link from "next/link";

export default function HomePage() {
  return (
    <main className="min-h-screen p-10">
      <h1 className="text-4xl font-bold">ApplyPilot</h1>
      <p className="mt-4 text-lg">
        Track applications, analyze keywords, improve resume bullets, and prep for interviews.
      </p>
      <div className="mt-6 flex gap-4">
        <Link href="/auth/signup" className="rounded bg-black px-4 py-2 text-white">
          Get Started
        </Link>
        <Link href="/auth/login" className="rounded border px-4 py-2">
          Login
        </Link>
      </div>
    </main>
  );
}