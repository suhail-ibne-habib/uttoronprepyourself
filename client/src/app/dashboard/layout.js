import AppSidebar from "@/components/dashboard/AppSidebar";
import AuthGuard from "@/components/dashboard/AuthGuard";
import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar";

export const metadata = {
  title: "Dashboard",
  robots: { index: false, follow: false },
};

export default function DashboardLayout({ children }) {
  return (
    <AuthGuard>
      <SidebarProvider>
        <AppSidebar />
        <SidebarInset className="bg-neutral-50">
          <div className="flex min-h-svh flex-1 flex-col">{children}</div>
        </SidebarInset>
      </SidebarProvider>
    </AuthGuard>
  );
}
