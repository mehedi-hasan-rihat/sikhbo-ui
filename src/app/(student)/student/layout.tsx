import { requireRole } from "@/lib/auth/session";
import { AppHeader } from "@/components/layout/AppHeader";

const NAV = [
  { href: "/student/dashboard", label: "Dashboard" },
  { href: "/student/submissions/new", label: "New submission" },
];

export default async function StudentLayout({ children }: LayoutProps<"/student">) {
  const user = await requireRole("STUDENT");
  return (
    <div className="flex min-h-svh flex-col bg-canvas">
      <AppHeader user={user} navLinks={NAV} />
      <main className="flex flex-1 flex-col">{children}</main>
    </div>
  );
}
