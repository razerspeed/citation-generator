"use client";

import React from "react";
import { usePathname } from "next/navigation";
import { TopNavbar } from "@/components/TopNavbar";
import { createClient } from "@/utils/supabase/client";
import { useRouter } from "next/navigation";

export function TopNavbarWrapper() {
  const pathname = usePathname();
  const router = useRouter();

  const handleSignOut = async () => {
    const supabase = createClient();
    await supabase.auth.signOut();
    router.push("/login");
  };

  return <TopNavbar currentPath={pathname} onSignOut={handleSignOut} />;
}
