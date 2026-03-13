import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { prisma } from "@/lib/prisma";

export default async function DashboardPage() {
  const supabase = await createClient();
  const { data, error } = await supabase.auth.getUser();

  if (error || !data.user) {
    redirect("/auth/login");
  }

  const applications = await prisma.application.findMany({
    where: { userId: data.user.id },
  });

  const total = applications.length;
  const applied = applications.filter((a: any) => a.status === "APPLIED").length;
  const interviews = applications.filter((a: any) => a.status === "INTERVIEW").length;
  const offers = applications.filter((a: any) => a.status === "OFFER").length;

  return (
    <main className="p-8">
      <h1 className="mb-6 text-3xl font-bold">Dashboard</h1>
      <div className="grid grid-cols-1 gap-4 md:grid-cols-4">
        <div className="rounded border p-4 bg-gradient-to-br from-blue-50 to-blue-100">
          <p className="text-sm text-gray-600">Total Applications</p>
          <p className="text-3xl font-bold text-blue-600">{total}</p>
        </div>
        <div className="rounded border p-4 bg-gradient-to-br from-green-50 to-green-100">
          <p className="text-sm text-gray-600">Applied</p>
          <p className="text-3xl font-bold text-green-600">{applied}</p>
        </div>
        <div className="rounded border p-4 bg-gradient-to-br from-yellow-50 to-yellow-100">
          <p className="text-sm text-gray-600">Interviews</p>
          <p className="text-3xl font-bold text-yellow-600">{interviews}</p>
        </div>
        <div className="rounded border p-4 bg-gradient-to-br from-purple-50 to-purple-100">
          <p className="text-sm text-gray-600">Offers</p>
          <p className="text-3xl font-bold text-purple-600">{offers}</p>
        </div>
      </div>
    </main>
  );
}
