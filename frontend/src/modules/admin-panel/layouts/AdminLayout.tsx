import { Outlet } from "react-router-dom";
import { getCookie } from "@admin-panel/lib/cookies";
import { cn } from "@admin-panel/lib/utils";
import { LayoutProvider } from "@admin-panel/context/layout-provider";
import { SearchProvider } from "@admin-panel/context/search-provider";
import {
  SidebarInset,
  SidebarProvider,
} from "@admin-panel/components/ui/sidebar";
import { AppSidebar } from "@admin-panel/components/layout/app-sidebar";

import { NavigationProgress } from "@admin-panel/components/navigation-progress";
import { RouteErrorBoundary } from "@shared/error";
import "@admin-panel/styles/admin-panel.css";

export function AdminLayout() {
  const defaultOpen = getCookie("sidebar_state") !== "false";

  return (
    <div className="admin-panel-root min-h-svh w-full bg-background text-foreground">
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
              <RouteErrorBoundary name="admin-panel-page">
                <Outlet />
              </RouteErrorBoundary>
            </SidebarInset>
          </SidebarProvider>
        </LayoutProvider>
      </SearchProvider>
    </div>
  );
}
