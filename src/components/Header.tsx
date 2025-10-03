import { Link, useLocation } from "react-router-dom";
import { Button } from "./ui/button";
import { ShoppingBag, User, Menu } from "lucide-react";
import { useState } from "react";

const Header = () => {
  const location = useLocation();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const isLoggedIn = localStorage.getItem("goodbite_user");

  const navItems = [
    { label: "Beranda", path: "/" },
    { label: "Jelajahi", path: "/jelajahi" },
    { label: "Pesanan", path: "/pesanan" },
    { label: "Tentang", path: "/tentang" },
  ];

  return (
    <header className="fixed top-0 left-0 right-0 z-50 w-full pt-4 md:pt-6 pb-4 bg-background/80 backdrop-blur-sm">
      <div className="container">
        <div className="bg-[#205A3F] rounded-full shadow-lg px-6 md:px-8 py-4 flex items-center justify-between">
          
          {/* Logo di kiri - Desktop */}
          <Link to="/" className="hidden md:flex items-center space-x-2">
            <ShoppingBag className="h-6 w-6 text-white" />
            <span className="text-xl md:text-2xl font-bold text-white font-heading">
              GoodBite
            </span>
          </Link>

          {/* Navigation - Desktop */}
          <nav className="hidden md:flex items-center space-x-8 lg:space-x-10 absolute left-1/2 -translate-x-1/2">
            {navItems.map((item) => (
              <Link
                key={item.path}
                to={item.path}
                className={`text-sm font-medium transition-colors font-body ${
                  location.pathname === item.path
                    ? "text-accent font-semibold"
                    : "text-white/90 hover:text-white"
                }`}
              >
                {item.label}
              </Link>
            ))}
          </nav>

          {/* Tombol Profil - Desktop (pojok kanan) */}
          <div className="hidden md:block">
            <Link to="/profil">
              <Button
                variant="ghost"
                size="sm"
                className={`text-white hover:bg-white/10 rounded-full ${
                  location.pathname === "/profil" ? "bg-white/20" : ""
                }`}
              >
                <User className="h-4 w-4 mr-2" />
                Profil
              </Button>
            </Link>
          </div>

          {/* Mobile: Logo */}
          <Link to="/" className="md:hidden flex items-center space-x-2">
            <ShoppingBag className="h-6 w-6 text-white" />
            <span className="text-xl font-bold text-white font-heading">GoodBite</span>
          </Link>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="md:hidden"
          >
            <Menu className="h-6 w-6 text-white" />
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      {mobileMenuOpen && (
        <div className="md:hidden mt-2 container">
          <div className="bg-[#205A3F] rounded-3xl shadow-lg p-6">
            <nav className="flex flex-col space-y-4">
              {navItems.map((item) => (
                <Link
                  key={item.path}
                  to={item.path}
                  onClick={() => setMobileMenuOpen(false)}
                  className={`text-sm font-medium transition-colors ${
                    location.pathname === item.path
                      ? "text-accent font-semibold"
                      : "text-white/90 hover:text-white"
                  }`}
                >
                  {item.label}
                </Link>
              ))}
              <Link
                to="/profil"
                onClick={() => setMobileMenuOpen(false)}
                className={`text-sm font-medium transition-colors flex items-center gap-2 ${
                  location.pathname === "/profil"
                    ? "text-accent font-semibold"
                    : "text-white/90 hover:text-white"
                }`}
              >
                <User className="h-4 w-4" />
                Profil
              </Link>
              {!isLoggedIn && (
                <Link to="/login" onClick={() => setMobileMenuOpen(false)}>
                  <Button size="sm" className="w-full rounded-full bg-white hover:bg-white/90 text-[#205A3F] font-semibold mt-2">
                    Masuk
                  </Button>
                </Link>
              )}
            </nav>
          </div>
        </div>
      )}
    </header>
  );
};

export default Header;
