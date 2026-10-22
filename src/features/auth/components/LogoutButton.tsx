"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { logout } from "@/features/auth/services/auth.service";
import { ROUTES } from "@/lib/constants";
import { Button } from "@/components/ui/button";

export function LogoutButton() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  async function handleLogout() {
    setLoading(true);
    try {
      await logout();
    } catch {
      // Cookie is cleared even if server call fails
    } finally {
      router.push(ROUTES.login);
      router.refresh();
    }
  }

  return (
    <Button variant="outline" size="sm" onClick={handleLogout} disabled={loading}>
      {loading ? "Logging out…" : "Log out"}
    </Button>
  );
}
