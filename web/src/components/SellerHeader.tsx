import { useEffect, useState } from "react";
import { Link, useLocation } from "react-router-dom";
import {
  Navbar,
  NavBody,
  NavItems,
  MobileNav,
  NavbarLogo,
  NavbarButton,
  MobileNavHeader,
  MobileNavToggle,
  MobileNavMenu,
} from "./ui/resizable-navbar";
import { ShoppingBag } from "lucide-react";

const navItems = [
  { name: "Dashboard", link: "/seller-dashboard" },
  { name: "Paket", link: "/dashboard-penjual" },
  { name: "Ulasan", link: "/seller-orders" },
];

interface SellerHeaderProps {
  sellerName?: string;
}

const SellerHeader = (_props: SellerHeaderProps) => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const location = useLocation();

  useEffect(() => {
    const seller = localStorage.getItem("goodbite_seller");
    setIsLoggedIn(!!seller);
  }, [location.pathname]);

  const isActive = (path: string) => location.pathname === path;

  return (
    <Navbar className="pt-4">
      <NavBody className="bg-black/70 backdrop-blur-xl border border-white/10 shadow-lg text-white">
        <NavbarLogo name="GoodBite" href="/seller-dashboard">
          <ShoppingBag className="h-6 w-6 text-white" />
        </NavbarLogo>

        <NavItems
          items={navItems.map((item) => ({
            ...item,
            name: isActive(item.link) ? `${item.name}` : item.name,
          }))}
        />

        <div className="flex items-center gap-3 text-white">
          <Link to={isLoggedIn ? "/seller-profil" : "/seller-login"} className="hidden lg:inline-flex">
            <NavbarButton variant="secondary" as="span">
              {isLoggedIn ? "Profil" : "Masuk"}
            </NavbarButton>
          </Link>
        </div>
      </NavBody>

      <MobileNav className="bg-black/70 backdrop-blur-xl border border-white/10 text-white">
        <MobileNavHeader>
          <NavbarLogo name="GoodBite" href="/seller-dashboard">
            <ShoppingBag className="h-6 w-6 text-white" />
          </NavbarLogo>
          <MobileNavToggle isOpen={isMobileMenuOpen} onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)} />
        </MobileNavHeader>

        <MobileNavMenu isOpen={isMobileMenuOpen} onClose={() => setIsMobileMenuOpen(false)}>
          {navItems.map((item, idx) => (
            <Link
              key={`mobile-link-${idx}`}
              to={item.link}
              onClick={() => setIsMobileMenuOpen(false)}
              className="relative text-neutral-600 dark:text-neutral-300 w-full"
            >
              <span className="block">{item.name}</span>
            </Link>
          ))}
          <div className="flex w-full flex-col gap-3 pt-2">
            <Link to={isLoggedIn ? "/seller-profil" : "/seller-login"} onClick={() => setIsMobileMenuOpen(false)}>
              <NavbarButton variant="secondary" as="span" className="w-full">
                {isLoggedIn ? "Profil" : "Masuk"}
              </NavbarButton>
            </Link>
          </div>
        </MobileNavMenu>
      </MobileNav>
    </Navbar>
  );
};

export default SellerHeader;
