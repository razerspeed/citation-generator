import { SidebarWrapper } from "@/components/SidebarWrapper";
import { TopNavbarWrapper } from "@/components/TopNavbarWrapper";
import { redirect } from "next/navigation";
import { createClient } from "@/utils/supabase/server";

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  // Authenticate user
  const supabase = await createClient();
  const { data, error } = await supabase.auth.getUser();

  // Redirect to login if not authenticated
  if (error || !data?.user) {
    redirect("/login");
  }

  return (
    <div className="flex flex-col h-screen">
      {/* Top Navbar - Full Width */}
      <TopNavbarWrapper />

      {/* Main Content Area */}
      <div className="flex flex-1 overflow-hidden">
        {/* Sidebar - Left */}
        <SidebarWrapper />

        {/* Page Content - Right */}
        <main className="flex-1 overflow-auto p-4">{children}</main>
      </div>
    </div>
  );
}
