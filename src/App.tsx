import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import Index from "./pages/Index.tsx";
import SAPDPage from "./pages/SAPDPage.tsx";
import VetadosPage from "./pages/VetadosPage.tsx";
import NoticiasPage from "./pages/NoticiasPage.tsx";

import ImportantePage from "./pages/ImportantePage.tsx";
import NotFound from "./pages/NotFound.tsx";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Index />} />
          <Route path="/sapd" element={<SAPDPage />} />
          <Route path="/vetados" element={<VetadosPage />} />
          <Route path="/informacion" element={<NoticiasPage />} />
          <Route path="/importante" element={<ImportantePage />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
