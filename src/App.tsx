import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Index from "./pages/Beranda";
import Login from "./pages/Login";
import Jelajahi from "./pages/Jelajahi";
import PaketDetail from "./pages/PaketDetail";
import Checkout from "./pages/Checkout";
import Pesanan from "./pages/Pesanan";
import PesananDetail from "./pages/PesananDetail";
import Profil from "./pages/Profil";
import Tentang from "./pages/Tentang";
import Bisnis from "./pages/Bisnis";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Index />} />
          <Route path="/login" element={<Login />} />
          <Route path="/jelajahi" element={<Jelajahi />} />
          <Route path="/paket/:id" element={<PaketDetail />} />
          <Route path="/checkout/:id" element={<Checkout />} />
          <Route path="/pesanan" element={<Pesanan />} />
          <Route path="/pesanan/:id" element={<PesananDetail />} />
          <Route path="/profil" element={<Profil />} />
          <Route path="/tentang" element={<Tentang />} />
          <Route path="/bisnis" element={<Bisnis />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
