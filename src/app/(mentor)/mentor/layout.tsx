import { requireRole } from "@/lib/auth/session";
import { AppHeader } from "@/components/layout/AppHeader";

export const instant = false;

export default async function MentorLayout({ children }: LayoutProps<"/mentor">) {
  const user = await requireRole("MENTOR");
  return (
    <div className="flex min-h-svh flex-col bg-canvas">
      <AppHeader user={user} />
      <main className="flex flex-1 flex-col">{children}</main>
    </div>
  );
}
