import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Store, TrendingUp, Users, Leaf, Mail, Phone, ArrowRight, CheckCircle2 } from "lucide-react";
import { Link } from "react-router-dom";

const HERO_GRADIENT = "linear-gradient(135deg, #181819 0%, #252527 45%, #0f1012 100%)";

const Bisnis = () => {
  const benefits = [
    {
      icon: TrendingUp,
      title: "Tingkatkan Pendapatan",
      description: "Ubah makanan sisa menjadi sumber pendapatan tambahan tanpa perlu usaha ekstra",
    },
    {
      icon: Users,
      title: "Jangkau Pelanggan Baru",
      description: "Dapatkan akses ke ribuan pelanggan yang mencari makanan berkualitas dengan harga terjangkau",
    },
    {
      icon: Leaf,
      title: "Kurangi Food Waste",
      description: "Berkontribusi dalam mengurangi limbah makanan dan dampak lingkungan",
    },
    {
      icon: Store,
      title: "Mudah Dikelola",
      description: "Platform yang user-friendly dengan sistem manajemen yang sederhana",
    },
  ];

  const steps = [
    {
      number: 1,
      title: "Daftar",
      description: "Isi formulir pendaftaran bisnis dan verifikasi akun Anda",
    },
    {
      number: 2,
      title: "Buat Profil Toko",
      description: "Lengkapi informasi bisnis, foto, dan jam operasional toko Anda",
    },
    {
      number: 3,
      title: "Unggah Paket",
      description: "Buat surprise bag dengan detail harga dan waktu pengambilan",
    },
    {
      number: 4,
      title: "Terima Pesanan",
      description: "Pelanggan memesan paket dan melakukan pembayaran",
    },
    {
      number: 5,
      title: "Serahkan Paket",
      description: "Siapkan dan serahkan paket kepada pelanggan sesuai jadwal",
    },
  ];


  return (
    <div className="min-h-screen flex flex-col bg-[#e6e7e8]">
      <main className="flex-1">
        <section className="pt-24 md:pt-28 pb-24 min-h-[80vh] flex items-center relative overflow-hidden">
          <div className="absolute inset-0 flex">
            <div className="w-[70%] bg-[#e6e7e8]" />
            <div className="w-[30%]" style={{ background: HERO_GRADIENT }} />
          </div>

          <div className="container relative z-10 px-4 md:px-6">
            <div className="grid lg:grid-cols-[1.1fr_0.9fr] gap-12 items-center">
              <div className="space-y-6" style={{ transform: "translateX(-90px)" }}>
                <span className="inline-flex items-center rounded-full border border-[#252527] px-4 py-1 text-sm font-semibold text-[#252527]">
                  Untuk Bisnis
                </span>
                <h1 className="font-heading text-4xl md:text-5xl lg:text-6xl font-bold text-[#181819] leading-tight">
                  Bergabunglah dengan <span className="text-[#0f1012]">GoodBite</span>
                </h1>
                <p className="text-lg md:text-xl text-[#5d6269] leading-relaxed max-w-xl">
                  Maksimalkan potensi bisnis Anda sambil mengurangi food waste. Raih pelanggan baru dan tingkatkan
                  pendapatan dengan platform kami.
                </p>
                <div className="flex flex-wrap gap-4 pt-4">
                  <Link to="/seller-login">
                    <Button
                      size="lg"
                      className="rounded-full px-8 py-7 text-lg font-semibold bg-[#181819] hover:bg-[#252527] text-[#e6e7e8] shadow-2xl hover:shadow-black/20 hover:scale-105 transition-all duration-300"
                    >
                      Daftar Sekarang
                      <ArrowRight className="ml-2 h-5 w-5" />
                    </Button>
                  </Link>
                  <Button
                    size="lg"
                    variant="outline"
                    className="rounded-full px-8 py-7 text-lg font-semibold border-2 border-[#252527] text-[#252527] hover:bg-[#d6d7db] transition-all"
                  >
                    Hubungi Kami
                    <Phone className="ml-2 h-5 w-5" />
                  </Button>
                </div>
              </div>

              <div className="hidden lg:block" />
            </div>
          </div>
        </section>

        <section className="py-20 md:py-28" style={{ backgroundColor: "#e6e7e8" }}>
          <div className="container px-4 md:px-6">
            <div className="text-center mb-12">
              <h2 className="font-heading text-3xl md:text-4xl font-bold text-[#181819] mb-4">
                Mengapa Bergabung dengan GoodBite?
              </h2>
              <p className="text-[#5d6269] max-w-2xl mx-auto">
                Dapatkan berbagai keuntungan yang mendukung pertumbuhan bisnis Anda
              </p>
            </div>

            <div className="grid md:grid-cols-2 gap-6 lg:gap-8">
              {benefits.map((benefit, index) => (
                <div
                  key={index}
                  className="relative rounded-3xl p-8 shadow-lg border border-[#2f2f32] bg-[linear-gradient(135deg,#181819_0%,#252527_45%,#0f1012_100%)]"
                >
                  <div className="flex items-start gap-6">
                    <div className="w-16 h-16 rounded-2xl bg-white/10 flex items-center justify-center flex-shrink-0">
                      <benefit.icon className="h-8 w-8 text-white" />
                    </div>
                    <div className="space-y-2">
                      <h3 className="font-heading text-xl font-bold text-white">{benefit.title}</h3>
                      <p className="text-gray-200 leading-relaxed">{benefit.description}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        <section className="py-20 md:py-28" style={{ backgroundColor: "#e6e7e8" }}>
          <div className="container px-4 md:px-6">
            <div className="text-center mb-12">
              <h2 className="font-heading text-3xl md:text-4xl font-bold text-[#181819] mb-4">
                Mudah untuk Memulai
              </h2>
              <p className="text-[#5d6269] max-w-2xl mx-auto">
                Lima langkah sederhana untuk bergabung dan mulai berjualan
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-5 gap-6">
              {steps.map((step, index) => (
                <div
                  key={index}
                  className="rounded-3xl p-6 border border-[#2f2f32] bg-[linear-gradient(135deg,#181819_0%,#252527_45%,#0f1012_100%)] text-white"
                >
                  <div className="text-3xl font-bold mb-4">{step.number}</div>
                  <h3 className="font-heading text-lg font-bold mb-2">{step.title}</h3>
                  <p className="text-sm text-white/70 leading-relaxed">{step.description}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        <section className="py-20 md:py-28" style={{ backgroundColor: "#e6e7e8" }}>
          <div className="container px-4 md:px-6 max-w-5xl">
            <div className="rounded-[3rem] p-10 md:p-14 text-white relative overflow-hidden" style={{ background: HERO_GRADIENT }}>
              <div className="absolute top-10 right-10 w-72 h-72 bg-white/10 rounded-full blur-3xl" />
              <div className="absolute bottom-10 left-10 w-64 h-64 bg-white/5 rounded-full blur-3xl" />

              <div className="relative z-10 text-center space-y-8">
                <div className="inline-flex p-5 rounded-2xl bg-white/10 backdrop-blur-sm">
                  <Store className="h-12 w-12 text-white" />
                </div>
                <h2 className="font-heading text-3xl md:text-4xl font-bold text-white">
                  Siap Bergabung?
                </h2>
                <p className="text-white/90 text-lg max-w-2xl mx-auto leading-relaxed">
                  Daftarkan bisnis Anda sekarang dan mulai tingkatkan pendapatan sambil berkontribusi mengurangi food
                  waste.
                </p>

                <div className="flex flex-col sm:flex-row gap-6 justify-center items-center">
                  <div className="flex items-center gap-3 text-white">
                    <div className="p-3 rounded-xl bg-white/10">
                      <Mail className="h-6 w-6" />
                    </div>
                    <div className="text-left">
                      <div className="text-sm text-white/70">Email</div>
                      <div className="font-semibold">bisnis@goodbite.com</div>
                    </div>
                  </div>

                  <div className="hidden sm:block w-px h-12 bg-white/30" />

                  <div className="flex items-center gap-3 text-white">
                    <div className="p-3 rounded-xl bg-white/10">
                      <Phone className="h-6 w-6" />
                    </div>
                    <div className="text-left">
                      <div className="text-sm text-white/70">Telepon</div>
                      <div className="font-semibold">+62 812-3456-7890</div>
                    </div>
                  </div>
                </div>

                <Button
                  size="lg"
                  className="rounded-full px-10 py-7 text-lg font-semibold bg-[#e6e7e8] text-[#181819] hover:bg-white transition-all"
                >
                  Hubungi Tim Kami
                  <ArrowRight className="ml-2 h-6 w-6" />
                </Button>

                <div className="flex items-center justify-center gap-2 text-white/80 text-sm">
                  <CheckCircle2 className="h-5 w-5 text-white" />
                  <span>Gratis untuk bergabung, tanpa biaya tersembunyi</span>
                </div>
              </div>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
};

export default Bisnis;
