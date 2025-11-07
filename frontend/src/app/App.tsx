import Footer from "@shared/components/Footer";
import Header from "@shared/components/Header";
import AppRoutes from "@routes/AppRoutes";
import CustomToaster from "@shared/components/CustomToaster";

function App() {
  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <Header />
      <main className="flex-1">
        <CustomToaster />
        <AppRoutes />
      </main>
      <Footer />
    </div>
  );
}

export default App;
