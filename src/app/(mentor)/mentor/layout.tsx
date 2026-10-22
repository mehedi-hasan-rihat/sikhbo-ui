import { requireRole } from "@/lib/auth/session";
import { AppHeader } from "@/components/layout/AppHeader";

const NAV = [{ href: "/mentor/submissions", label: "Submissions" }];

export default async function MentorLayout({ children }: LayoutProps<"/mentor">) {
  const user = await requireRole("MENTOR");
  return (
    <div className="flex min-h-svh flex-col bg-canvas">
      <AppHeader user={user} navLinks={NAV} />
      <main className="flex flex-1 flex-col">{children}</main>
    </div>
  );
}
