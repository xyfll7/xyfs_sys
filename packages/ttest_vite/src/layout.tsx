import { AppSidebar } from "@/components/app-sidebar";
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";

export default function Layout({ children }: { children: React.ReactNode; }) {
  return (
    <div>
      <div className="relative flex min-h-svh flex-col bg-background">
        <div className="themes-wrapper bg-background">
          <SidebarProvider>
            <AppSidebar />
            <main>
              <SidebarTrigger />
              {children}
            </main>
          </SidebarProvider>
        </div>
      </div>
    </div>


  );
}
