import { Outlet } from "react-router-dom";
import { getCookie } from "@admin/lib/cookies";
import { cn } from "@admin/lib/utils";
import { LayoutProvider } from "@admin/context/layout-provider";
import { SearchProvider } from "@admin/context/search-provider";
import {
  SidebarInset,
  SidebarProvider,
} from "@admin/components/ui/sidebar";
import { AppSidebar } from "@admin/components/layout/app-sidebar";

import { NavigationProgress } from "@admin/components/navigation-progress";
import { RouteErrorBoundary } from "@shared/error";
import "@admin/styles/admin.css";

export function AdminLayout() {
  const defaultOpen = getCookie("sidebar_state") !== "false";

  return (
    <div className="admin-root min-h-svh w-full bg-background text-foreground">
      <SearchProvider>
        <LayoutProvider>
          <SidebarProvider defaultOpen={defaultOpen}>
            <NavigationProgress />
            <AppSidebar />
            <SidebarInset
              className={cn(
                "@container/content",
                "has-data-[layout=fixed]:h-svh",
                "peer-data-[variant=inset]:has-data-[layout=fixed]:h-[calc(100svh-(var(--spacing)*4))]"
              )}
            >
              <RouteErrorBoundary name="admin-page">
                <Outlet />
              </RouteErrorBoundary>
            </SidebarInset>
          </SidebarProvider>
        </LayoutProvider>
      </SearchProvider>
    </div>
  );
}
