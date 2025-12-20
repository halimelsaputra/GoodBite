import { Link } from "react-router-dom";
import { ShoppingBag, Mail, Phone, Instagram, Facebook, Twitter } from "lucide-react";

const Footer = () => {
  return (
    <footer className="relative mx-auto mt-10 w-full max-w-4xl bg-transparent px-5 py-8 sm:px-6 sm:py-10">
      <div className="relative flex flex-col items-center gap-6 text-neutral-900">
        <div className="flex items-center space-x-2 text-xl font-bold">
          <ShoppingBag className="h-6 w-6 text-neutral-900" />
          <span>GoodBite</span>
        </div>

        <p className="text-sm text-neutral-600 text-center max-w-xl">
          Selamatkan makanan, hemat lebih banyak, dukung UMKM lokal Indonesia.
        </p>

        <div className="flex flex-wrap items-start justify-center gap-8 text-sm text-neutral-700">
          <div className="text-center">
            <h3 className="font-semibold mb-2 text-neutral-900">Tautan Cepat</h3>
            <ul className="space-y-1">
              <li>
                <Link to="/jelajahi" className="hover:text-neutral-900 transition-colors">
                  Jelajahi Paket
                </Link>
              </li>
              <li>
                <Link to="/tentang" className="hover:text-neutral-900 transition-colors">
                  Tentang Kami
                </Link>
              </li>
              <li>
                <Link to="/bisnis" className="hover:text-neutral-900 transition-colors">
                  Untuk Bisnis
                </Link>
              </li>
            </ul>
          </div>

          <div className="text-center">
            <h3 className="font-semibold mb-2 text-neutral-900">Kontak</h3>
            <ul className="space-y-1">
              <li className="flex items-center justify-center gap-2">
                <Mail className="h-4 w-4" />
                <span>hello@goodbite.id</span>
              </li>
              <li className="flex items-center justify-center gap-2">
                <Phone className="h-4 w-4" />
                <span>+62 812-3456-7890</span>
              </li>
            </ul>
          </div>

          <div className="text-center">
            <h3 className="font-semibold mb-2 text-neutral-900">Ikuti Kami</h3>
            <div className="flex items-center justify-center gap-3">
              <a href="#" className="text-neutral-700 hover:text-neutral-900 transition-colors">
                <Instagram className="h-5 w-5" />
              </a>
              <a href="#" className="text-neutral-700 hover:text-neutral-900 transition-colors">
                <Facebook className="h-5 w-5" />
              </a>
              <a href="#" className="text-neutral-700 hover:text-neutral-900 transition-colors">
                <Twitter className="h-5 w-5" />
              </a>
            </div>
          </div>
        </div>

        <div className="text-xs text-neutral-500 text-center">
          &copy; 2024 GoodBite. Semua hak dilindungi.
        </div>
      </div>
    </footer>
  );
};

export default Footer;
