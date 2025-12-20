import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, useLocation } from "react-router-dom";
import { useEffect } from "react";
import Index from "./pages/Beranda";
import Login from "./pages/Login";
import Register from "./pages/Register";
import SellerHub from "./pages/SellerHub";
import Jelajahi from "./pages/Jelajahi";
import PaketDetail from "./pages/PaketDetail";
import Checkout from "./pages/Checkout";
import PesananDetail from "./pages/PesananDetail";
import Profil from "./pages/Profil";
import Tentang from "./pages/Tentang";
import Bisnis from "./pages/Bisnis";
import ReviewPenjual from "./pages/ReviewPenjual";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

// Scroll to top on every route change
const ScrollToTop = () => {
  const { pathname } = useLocation();

  useEffect(() => {
    window.scrollTo({ top: 0, left: 0, behavior: "auto" });
  }, [pathname]);

  return null;
};

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <ScrollToTop />
        <Routes>
          <Route path="/" element={<Index />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/seller-dashboard" element={<SellerHub />} />
          <Route path="/dashboard-penjual" element={<SellerHub />} />
          <Route path="/seller-orders" element={<SellerHub />} />
          <Route path="/seller-reviews" element={<SellerHub />} />
          <Route path="/jelajahi" element={<Jelajahi />} />
          <Route path="/paket/:id" element={<PaketDetail />} />
          <Route path="/checkout/:id" element={<Checkout />} />
          <Route path="/pesanan" element={<Jelajahi />} />
          <Route path="/pesanan/:id" element={<PesananDetail />} />
          <Route path="/riwayat-pesanan" element={<Jelajahi />} />
          <Route path="/profil" element={<Profil />} />
          <Route path="/tentang" element={<Tentang />} />
          <Route path="/bisnis" element={<Bisnis />} />
          <Route path="/review-penjual" element={<ReviewPenjual />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
