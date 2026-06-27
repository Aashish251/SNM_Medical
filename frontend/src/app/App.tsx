import { useLocation } from "react-router-dom";
import Footer from "@widgets/footer";
import Header from "@widgets/header";
import AppRoutes from "@routes/AppRoutes";
import CustomToaster from "@shared/components/CustomToaster";
import { TooltipProvider } from "@shared/components/ui";
import { WidgetErrorBoundary } from "@shared/error";
import { AdminProviders } from "@admin/providers/AdminProviders";
import { ROUTE_ADMIN_BASE } from "@app/router/routePaths";

function isAdministratorPortal(pathname: string): boolean {
  return pathname === ROUTE_ADMIN_BASE || pathname.startsWith(`${ROUTE_ADMIN_BASE}/`);
}

function App() {
  const { pathname } = useLocation();
  const isAdminPortal = isAdministratorPortal(pathname);

  if (isAdminPortal) {
    return (
      <AdminProviders>
        <TooltipProvider>
          <AppRoutes />
        </TooltipProvider>
      </AdminProviders>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <WidgetErrorBoundary name="header">
        <Header />
      </WidgetErrorBoundary>
      <main className="flex-1">
        <TooltipProvider>
          <CustomToaster />
          <AppRoutes />
        </TooltipProvider>
      </main>
      <WidgetErrorBoundary name="footer">
        <Footer />
      </WidgetErrorBoundary>
    </div>
  );
}

export default App;
