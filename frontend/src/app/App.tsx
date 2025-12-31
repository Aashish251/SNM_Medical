import Footer from "@shared/components/Footer";
import Header from "@shared/components/Header";
import AppRoutes from "@routes/AppRoutes";
import CustomToaster from "@shared/components/CustomToaster";
import { TooltipProvider } from "@shared/components/ui";

function App() {
  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <Header />
      <main className="flex-1">
        <TooltipProvider>
          <CustomToaster />
          <AppRoutes />
        </TooltipProvider>
      </main>
      <Footer />
    </div>
  );
}

export default App;
