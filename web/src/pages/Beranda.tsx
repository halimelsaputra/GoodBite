import { Link, useNavigate } from "react-router-dom";
import { useEffect, useState, useCallback } from "react";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";
import {
  Wallet,
  UtensilsCrossed,
  Store,
  ShieldCheck,
  ArrowRight,
  Search,
  ShoppingCart,
  Smile,
  MapPin,
  Star,
} from "lucide-react";
import { packageService } from "@/services/PackageService";
import rotiBakarImage from "@/img/Roti-bakar.jpg";
import kopiKananganImage from "@/img/Kopi-kenangan.jpg";
import pizzaHutImage from "@/img/Pizza-hut.jpg";
import orangMakanImage from "@/img/Orang-makan.jpg";
import packaging from "@/img/packaging.png";
import packaging2 from "@/img/packaging2.png";
import { InfiniteMovingCards } from "@/components/InfiniteMovingCards";

// Hero text content
const HERO_WORDS = ["Selamatkan", "Bumi", "Dari", "Limbah", "Makanan!"];
const HERO_WORD_DELAYS = [190, 290, 390, 490, 590];
const SUB_WORDS = ["GoodBite", "membantu", "anda", "mengurangi", "limbah", "makanan"];
const SUB_WORD_DELAYS = [680, 780, 880, 980, 1080, 1180, 1280];

// Popular section text offset (atur X/Y di sini)
const POPULAR_TEXT_OFFSET = { x: "150px", y: "100px" };

const FEATURES = [
  {
    icon: Wallet,
    title: "Hemat Uang",
    description: "Dapatkan makanan berkualitas dengan harga hingga 70% lebih murah dari harga normal",
  },
  {
    icon: UtensilsCrossed,
    title: "Selamatkan Makanan",
    description: "Bantu mengurangi food waste dan dampak lingkungan dengan menyelamatkan makanan sisa",
  },
  {
    icon: Store,
    title: "Dukung UMKM",
    description: "Dukung bisnis lokal dan UMKM Indonesia sambil menikmati makanan lezat",
  },
  {
    icon: ShieldCheck,
    title: "Kualitas Terjamin",
    description: "Makanan yang dijual tetap higienis, layak konsumsi, dan memenuhi standar keamanan pangan",
  },
  {
    icon: MapPin,
    title: "Transaksi Mudah",
    description: "Pesan dan ambil makanan di sekitar kamu dengan proses cepat tanpa antre lama",
  },
];

// -------------------- Hero Section --------------------
const HeroSection = ({
  onLoginClick,
  onRegisterClick,
}: {
  onLoginClick: () => void;
  onRegisterClick: () => void;
}) => (
  <section className="pt-24 md:pt-28 pb-24 min-h-[100vh] flex items-center relative overflow-hidden">
    <div className="absolute inset-0 flex">
      <div className="w-[70%] bg-[#e6e7e8]" />
      <div
        className="w-[30%]"
        style={{
          background: "linear-gradient(135deg, #181819 0%, #252527 45%, #0f1012 100%)",
        }}
      />
    </div>
    <div className="container relative z-10 px-4 md:px-6 reveal" data-reveal>
      <div className="grid lg:grid-cols-[1.1fr_0.9fr] gap-12 items-center">
        <div
          className="space-y-6"
          style={{ transform: "translateX(-110px)" }}
        >
          <div className="font-heading text-3xl md:text-4xl lg:text-6xl font-extrabold leading-[1.15] space-y-2 text-[#181819]">
            {HERO_WORDS.map((word, idx) => (
              <span key={word + idx}>
                <span
                  className="hero-word inline-block"
                  style={{
                    animationDelay: `${HERO_WORD_DELAYS[idx] || idx * 100}ms`,
                    animationDuration: "0.8s",
                  }}
                >
                  {word}
                </span>
                {idx === 1 && <br />}
              </span>
            ))}
          </div>

          <p className="font-body text-lg md:text-xl text-[#5d6269] leading-relaxed max-w-xl flex flex-wrap gap-1">
            {SUB_WORDS.map((word, idx) => (
              <span
                key={word + idx}
                className="hero-word inline-block"
                style={{
                  animationDelay: `${SUB_WORD_DELAYS[idx] || idx * 120}ms`,
                  animationDuration: "0.7s",
                }}
              >
                {word}
              </span>
            ))}
          </p>

          <div
            className="hero-fade flex flex-row flex-nowrap items-center gap-6 pt-6"
            style={{ animationDelay: "1380ms", animationDuration: "0.7s" }}
          >
            <Button
              size="lg"
              onClick={onLoginClick}
              className="rounded-full px-8 py-7 text-lg font-semibold bg-[#181819] hover:bg-[#252527] text-[#e6e7e8] shadow-2xl hover:shadow-black/20 hover:scale-105 transition-all duration-300 group"
            >
              <span
                className="hero-word inline-block"
                style={{ animationDelay: "180ms", animationDuration: "0.7s" }}
              >
                Masuk
              </span>
              <ArrowRight
                className="ml-2 h-5 w-5 group-hover:translate-x-1 transition-transform hero-word"
                style={{ animationDelay: "220ms", animationDuration: "0.7s" }}
              />
            </Button>
            <Button
              size="lg"
              variant="outline"
              onClick={onRegisterClick}
              className="rounded-full px-8 py-7 text-lg font-semibold border-2 border-[#252527] text-[#252527] hover:bg-[#d6d7db] transition-all"
            >
              <span
                className="hero-word inline-block"
                style={{ animationDelay: "250ms", animationDuration: "0.7s" }}
              >
                Daftar
              </span>
            </Button>
          </div>
        </div>

        <div className="relative flex justify-center gap-4" style={{ perspective: "1200px" }}>
          <div className="hero-drop" style={{ animationDelay: "1.7s" }}>
            <img
              src={packaging}
              alt="Hero placeholder 1"
              className="h-[360px] md:h-[520px] w-auto max-w-none object-contain opacity-100"
              style={{
                objectPosition: "var(--hero-image-x, 130%) var(--hero-image-y, 50%)",
                transform: `
                  translate3d(
                    var(--hero-image-tx, 500px),
                    var(--hero-image-ty, 0px),
                    var(--hero-image-tz, 0px)
                  )
                  rotateX(var(--hero-image-tilt-x, -20deg))
                  rotateY(var(--hero-image-tilt-y, 0deg))
                  rotateZ(var(--hero-image-tilt-z, 8deg))
                `,
                transformStyle: "preserve-3d",
              }}
              loading="lazy"
            />
          </div>

          <div className="hero-drop" style={{ animationDelay: "1.5s" }}>
            <img
              src={packaging2}
              alt="Hero placeholder 2"
              className="h-[360px] md:h-[520px] w-auto max-w-none object-contain opacity-100"
              style={{
                objectPosition: "var(--hero-image2-x, 130%) var(--hero-image2-y, 50%)",
                transform: `
                  translate3d(
                    var(--hero-image2-tx, -480px),
                    var(--hero-image2-ty, -20px),
                    var(--hero-image2-tz, 0px)
                  )
                  rotateX(var(--hero-image2-tilt-x, 0deg))
                  rotateY(var(--hero-image2-tilt-y, 0deg))
                  rotateZ(var(--hero-image2-tilt-z, -10deg))
                `,
                transformStyle: "preserve-3d",
              }}
              loading="lazy"
            />
          </div>
        </div>
      </div>
    </div>
  </section>
);

// -------------------- Popular Packages Section --------------------
const PopularPackagesSection = ({ popularPackages }: { popularPackages: any[] }) => (
  <section className="py-20 md:py-28 relative overflow-hidden" style={{ backgroundColor: "#e6e7e8" }}>
    <div className="absolute top-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-border to-transparent" />
    <div className="w-full max-w-none px-4 md:px-0 mx-0 reveal" data-reveal>
      <div className="grid md:grid-cols-[0.3fr_0.7fr] gap-10 items-start">
        <div
          className="space-y-3 pl-4 md:pl-10"
          style={{
            transform: `translate(${POPULAR_TEXT_OFFSET.x}, ${POPULAR_TEXT_OFFSET.y})`,
          }}
        >
          <h2 className="font-heading text-4xl md:text-3xl font-bold text-foreground">Paket Paling Populer</h2>
          <p className="text-lg text-muted-foreground max-w-md">
            Temukan surprise bag menarik dari toko favorit anda. Hemat sampai dengan 70%!
          </p>
        </div>

        <InfiniteMovingCards
          items={popularPackages.map((pkg) => ({
            quote: pkg.storeName,
            name: pkg.location ?? "Lokasi tidak tersedia",
            title: `${pkg.price.toLocaleString("id-ID", {
              style: "currency",
              currency: "IDR",
              minimumFractionDigits: 0,
            })} • Hemat ${Math.round((1 - pkg.price / pkg.originalValue) * 100)}%`,
            imageSrc: pkg.image,
            href: `/paket/${pkg.id}`,
          }))}
          direction="left"
          speed="normal"
          pauseOnHover
          className="mt-[160px]"
        />
      </div>
    </div>
  </section>
);

// -------------------- Features Section --------------------
const FeaturesSection = () => (
  <section
    className="py-20 md:py-32 relative overflow-visible"
    style={{ backgroundColor: "#e6e7e8" }}
  >
    <div className="container relative z-10 px-8 md:px-16 reveal" data-reveal>
      <div className="grid md:grid-cols-2 gap-12 items-start">
        <div className="space-y-4 px-8 md:px-16 md:sticky md:top-28 md:self-start">
          <h2 className="font-heading text-4xl md:text-5xl font-bold text-foreground">
            Manfaat untuk Semua Pihak
          </h2>
          <p className="text-lg text-muted-foreground">
            Solusi win-win yang menguntungkan pelanggan, restoran, dan lingkungan
          </p>
        </div>

        <div className="grid grid-cols-1 gap-8 md:gap-10 px-6 md:px-16">
          {FEATURES.map((feature, index) => (
            <div
              key={index}
              className="group relative"
              style={{ animation: `fadeInUp 0.6s ease-out ${index * 0.15}s both` }}
            >
              <div className="relative max-w-md w-full rounded-3xl p-8 shadow-lg hover:shadow-2xl transition-all duration-500 border border-[#2f2f32] bg-[linear-gradient(135deg,#181819_0%,#252527_45%,#0f1012_100%)] group-hover:-translate-y-2">
                <div className="relative mb-6">
                  <div className="relative w-20 h-20 flex items-center justify-center">
                    <feature.icon className="h-10 w-10 text-white" />
                  </div>
                </div>

                <h3 className="font-heading text-2xl font-bold text-white mb-3">
                  {feature.title}
                </h3>
                <p className="text-gray-200 leading-relaxed">{feature.description}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>

    <style>{`
      @keyframes fadeInUp {
        from {
          opacity: 0;
          transform: translateY(30px);
        }
        to {
          opacity: 1;
          transform: translateY(0);
        }
      }
    `}</style>
  </section>
);

// -------------------- Promo Banner Section --------------------
const PromoBannerSection = () => (
  <section
    className="py-20 md:py-32 relative overflow-hidden"
    style={{ backgroundColor: "#e6e7e8" }}
  >
    <div className="container px-4 md:px-6 reveal" data-reveal>
      <div className="grid lg:grid-cols-2 gap-12 items-center">
        <div className="relative order-2 lg:order-1 group">
          <div className="absolute inset-0 bg-gradient-to-br from-primary/20 to-accent/20 rounded-[3rem] blur-3xl scale-95 group-hover:scale-100 transition-transform duration-700" />

          <div className="relative rounded-[3rem] overflow-hidden shadow-2xl">
            <img
              src={orangMakanImage}
              alt="GoodBite App Preview"
              className="w-full h-[550px] object-cover transform group-hover:scale-105 transition-transform duration-700"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent" />

          </div>
        </div>

        <div className="space-y-8 order-1 lg:order-2">
          <div className="space-y-4">
            <h2 className="font-heading text-5xl md:text-6xl font-bold text-foreground leading-tight">
              Lepaskan Keinginan{" "}
              <span className="text-black relative inline-block">
                Hemat
                <svg className="absolute -bottom-2 left-0 w-full" height="12" viewBox="0 0 200 12" fill="none">
                  <path d="M0 8C50 4 100 4 150 8C175 10 200 10 200 8" stroke="#1c1c1cff" strokeWidth="3" />
                </svg>
              </span>{" "}
              Dengan GoodBite
            </h2>
          </div>

          <p className="text-xl text-muted-foreground leading-relaxed">
            Hemat adalah cara yang indah untuk menjelajahi makanan baru,
            pelajari tentang berbagai UMKM, dan dapatkan pengalaman unik.
          </p>

          <div className="space-y-4">
            {[
              { icon: Wallet, text: "Hemat hingga 70% untuk makanan berkualitas" },
              { icon: UtensilsCrossed, text: "Kurangi food waste & bantu lingkungan" },
              { icon: Store, text: "Dukung UMKM lokal di sekitar Anda" },
            ].map((item, i) => (
              <div key={i} className="flex items-center gap-4 group/item">
                <div className="w-12 h-12 bg-[#0f1012] rounded-xl flex items-center justify-center group-hover/item:bg-[#1a1a1a] group-hover/item:scale-110 transition-all">
                  <item.icon className="h-6 w-6 text-white transition-colors" />
                </div>
                <span className="text-base text-foreground font-medium">{item.text}</span>
              </div>
            ))}
          </div>

          <div className="flex flex-wrap gap-4 pt-4">
            <Link to="/jelajahi">
              <Button
                size="lg"
                className="rounded-full px-10 py-7 text-lg font-semibold bg-[linear-gradient(135deg,#181819_0%,#252527_45%,#0f1012_100%)] hover:brightness-110 shadow-xl hover:shadow-2xl hover:scale-105 transition-all group text-white"
              >
                Mulai Hemat Sekarang
                <ArrowRight className="ml-2 h-6 w-6 group-hover:translate-x-2 transition-transform" />
              </Button>
            </Link>
            <Link to="/tentang">
              <Button
                size="lg"
                variant="outline"
                className="rounded-full px-10 py-7 text-lg font-semibold border-2 border-white text-foreground hover:bg-white/10 hover:border-white transition-all"
              >
                Pelajari Lebih Lanjut
              </Button>
            </Link>
          </div>

          <div className="flex items-center gap-8 pt-6 border-t">
          </div>
        </div>
      </div>
    </div>
  </section>
);

// -------------------- Final CTA Section --------------------
const FinalCtaSection = () => (
  <section
    className="py-20 md:py-32 relative overflow-hidden"
    style={{ backgroundColor: "#e6e7e8" }}
  >
    <div className="container px-4 md:px-6 reveal" data-reveal>
      <div className="relative">
        <div className="border-none shadow-2xl overflow-hidden rounded-[3rem]" style={{ background: "linear-gradient(135deg, #181819 0%, #252527 45%, #0f1012 100%)" }}>
          <div className="p-12 md:p-24 relative">
            <div className="absolute top-10 right-10 w-72 h-72 bg-white/10 rounded-full blur-3xl animate-pulse" style={{ animationDuration: "4s" }} />
            <div className="absolute bottom-10 left-10 w-96 h-96 bg-white/5 rounded-full blur-3xl animate-pulse" style={{ animationDuration: "5s", animationDelay: "1s" }} />
            <div className="absolute top-1/2 left-1/4 w-40 h-40 bg-white/10 rounded-full blur-2xl animate-bounce" style={{ animationDuration: "6s" }} />

            <div className="relative z-10 text-center space-y-8">
              <div className="space-y-4">
                <h2 className="font-heading text-4xl md:text-6x1 lg:text-6xl font-bold text-white leading-tight">
                  Ubah Sisa Stok{" "}
                  <span className="inline-block">Menjadi Pendapatan</span>{" "}
                  Tambahan
                </h2>
              </div>

              <p className="text-xl md:text-2xl text-white/90 max-w-3xl mx-auto leading-relaxed">
                Jangan biarkan makanan berkualitas berakhir sia-sia. Jual sisa stok harian Anda kepada ribuan pelanggan yang siap membeli di GoodBite.
              </p>

              <div className="grid grid-cols-3 gap-6 md:gap-12 max-w-3xl mx-auto py-8">
                <div className="space-y-2">
                  <div className="text-4xl md:text-5xl font-bold text-white">500+</div>
                  <div className="text-sm md:text-base text-white/70">Restoran Partner</div>
                </div>
                <div className="space-y-2">
                  <div className="text-4xl md:text-5xl font-bold text-white">50K+</div>
                  <div className="text-sm md:text-base text-white/70">Pengguna Aktif</div>
                </div>
                <div className="space-y-2">
                  <div className="text-4xl md:text-5xl font-bold text-white">4.9</div>
                  <div className="text-sm md:text-base text-white/70">Rating App</div>
                </div>
              </div>

              <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-4">
                <Link to="/bisnis">
                  <Button
                    size="lg"
                    variant="outline"
                    className="rounded-full px-10 py-7 text-lg font-semibold border-2 border-white/30 text-white hover:bg-white/10 hover:border-white transition-all min-w-[250px]"
                  >
                    <Store className="mr-2 h-5 w-5" />
                    Daftarkan Bisnis
                  </Button>
                </Link>
                <Link to="/tentang">
                  <Button
                    size="lg"
                    variant="outline"
                    className="rounded-full px-10 py-7 text-lg font-semibold border-2 border-white/30 text-white hover:bg-white/10 hover:border-white transition-all min-w-[250px]"
                  >
                    Tentang GoodBite
                    <ArrowRight className="ml-2 h-5 w-5" />
                  </Button>
                </Link>
              </div>

              <div className="pt-8">
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </section>
);

const Index = () => {
  const [popularPackages, setPopularPackages] = useState<any[]>([]);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    let isMounted = true;

    const loadPackages = async () => {
      try {
        const allPackages = await packageService.getAllPackages();
        const featured = packageService.getFeaturedPackages(3);

        if (!isMounted) return;
        if (featured.length > 0) {
          setPopularPackages(featured);
        } else if (allPackages.length > 0) {
          setPopularPackages(allPackages.slice(0, 3));
        } else {
          setPopularPackages([
            {
              id: "1",
              storeName: "Roti Bakar 88",
              location: "Batoh",
              image: rotiBakarImage,
              rating: 4.7,
              price: 15000,
              originalValue: 45000,
            },
            {
              id: "2",
              storeName: "Kopi Kenangan",
              location: "Peuniti",
              image: kopiKananganImage,
              rating: 4.8,
              price: 20000,
              originalValue: 50000,
            },
            {
              id: "3",
              storeName: "Pizzza Hut",
              location: "Peuniti",
              image: pizzaHutImage,
              rating: 4.9,
              price: 35000,
              originalValue: 100000,
            },
          ]);
        }
      } catch (error) {
        console.error("Failed to load packages", error);
      }
    };

    loadPackages();

    return () => {
      isMounted = false;
    };
  }, []);

  useEffect(() => {
    const user = localStorage.getItem("goodbite_user");
    const seller = localStorage.getItem("goodbite_seller");
    setIsLoggedIn(!!user || !!seller);
  }, []);

  const handlePrimaryCta = useCallback(() => {
    if (isLoggedIn) {
      navigate("/jelajahi");
    } else {
      navigate("/login");
    }
  }, [isLoggedIn, navigate]);

  const handleSecondaryCta = useCallback(() => {
    if (isLoggedIn) {
      navigate("/jelajahi");
    } else {
      navigate("/register");
    }
  }, [isLoggedIn, navigate]);

  useEffect(() => {
    const revealElements = document.querySelectorAll("[data-reveal]");
    if (!revealElements.length) return;

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("reveal-show");
          } else {
            entry.target.classList.remove("reveal-show");
          }
        });
      },
      { threshold: 0.15 }
    );

    revealElements.forEach((el) => observer.observe(el));

    return () => {
      revealElements.forEach((el) => observer.unobserve(el));
      observer.disconnect();
    };
  }, []);

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <HeroSection onLoginClick={handlePrimaryCta} onRegisterClick={handleSecondaryCta} />
      <PopularPackagesSection popularPackages={popularPackages} />
      <FeaturesSection />
      <PromoBannerSection />
      <FinalCtaSection />
      <Footer />
    </div>
  );
};

export default Index;









