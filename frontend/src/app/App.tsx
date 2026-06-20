import { useLocation } from "react-router-dom";
import Footer from "@widgets/footer";
import Header from "@widgets/header";
import AppRoutes from "@routes/AppRoutes";
import CustomToaster from "@shared/components/CustomToaster";
import { TooltipProvider } from "@shared/components/ui";
import { WidgetErrorBoundary } from "@shared/error";
import { AdminPanelProviders } from "@admin-panel/providers/AdminPanelProviders";
import { ADMIN_PANEL_BASE } from "@admin-panel/constants/routePaths";

function App() {
  const { pathname } = useLocation();
  const isAdminPanel = pathname.startsWith(ADMIN_PANEL_BASE);

  if (isAdminPanel) {
    return (
      <AdminPanelProviders>
        <TooltipProvider>
          <AppRoutes />
        </TooltipProvider>
      </AdminPanelProviders>
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
