"use client";

import { usePathname, useRouter } from "next/navigation";
import { Sidebar } from "./Sidebar";
import { createClient } from "@/utils/supabase/client";

export function SidebarWrapper() {
  const pathname = usePathname();
  const router = useRouter();

  const handleLogout = async () => {
    try {
      const supabase = createClient();
      const { error } = await supabase.auth.signOut();
      if (error) {
        console.error("Error signing out:", error.message);
        return;
      }
      // After successful logout, redirect to home page
      router.replace("/");
      router.refresh();
    } catch (error) {
      console.error("Error during sign out:", error);
    }
  };

  return <Sidebar currentPath={pathname} onLogout={handleLogout} />;
}
