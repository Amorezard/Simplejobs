import Link from "next/link";

async function getApplications() {
  try {
    const res = await fetch(
      `${process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'}/api/create-profile/applications`,
      {
        cache: "no-store",
        headers: {
          "Content-Type": "application/json",
        },
      }
    );

    if (!res.ok) return [];
    return res.json();
  } catch (error) {
    console.error("Failed to fetch applications:", error);
    return [];
  }
}

export default async function ApplicationsPage() {
  const applications = await getApplications();

  return (
    <main className="p-8">
      <div className="mb-6 flex items-center justify-between">
        <h1 className="text-3xl font-bold">Applications</h1>
        <Link href="/applications/new" className="rounded bg-black px-4 py-2 text-white">
          Add Application
        </Link>
      </div>

      <div className="space-y-4">
        {applications.map((app: any) => (
          <div key={app.id} className="rounded border p-4">
            <h2 className="text-xl font-semibold">{app.company}</h2>
            <p>{app.role}</p>
            <p className="text-sm text-gray-500">{app.status}</p>
          </div>
        ))}
      </div>
    </main>
  );
}