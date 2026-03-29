import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/AppSidebar";
import { ThemeToggle } from "@/components/ThemeToggle";

export function DashboardLayout({ children }: { children: React.ReactNode }) {
  return (
    <SidebarProvider>
      <div className="min-h-screen flex w-full">
        <AppSidebar />
        <div className="flex-1 flex flex-col min-w-0">
          <header className="h-14 flex items-center justify-between border-b px-4 bg-card/50 backdrop-blur-sm sticky top-0 z-10">
            <SidebarTrigger className="ml-0" />
            <ThemeToggle />
          </header>
          <main className="flex-1 p-4 md:p-6 overflow-auto">
            {children}
          </main>
          <footer className="border-t py-4 px-6 text-center text-xs text-muted-foreground">
            Built using Machine Learning for Academic Productivity Enhancement
          </footer>
        </div>
      </div>
    </SidebarProvider>
  );
}
