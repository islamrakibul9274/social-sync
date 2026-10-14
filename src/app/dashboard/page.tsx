import { redirect } from "next/navigation";
import { auth } from "@/auth";
import { getDashboardMetrics, getExploreUsers } from "@/lib/data";
import AppShell from "@/components/AppShell";
import DashboardView from "@/components/dashboard/DashboardView";

export default async function DashboardPage() {
  const session = await auth();
  if (!session?.user?.id) {
    redirect("/auth/signin?callbackUrl=/dashboard");
  }

  const [metrics, exploreUsers] = await Promise.all([
    getDashboardMetrics(session.user.id),
    getExploreUsers(session.user.id),
  ]);

  if (!metrics) {
    redirect("/feed");
  }

  return (
    <AppShell user={session.user as any} exploreUsers={exploreUsers}>
      <DashboardView metrics={metrics} />
    </AppShell>
  );
}
