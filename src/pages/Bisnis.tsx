import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Store, TrendingUp, Users, Leaf, Mail, Phone, ArrowRight, CheckCircle2 } from "lucide-react";
import { Link } from "react-router-dom";

const Bisnis = () => {
  const benefits = [
    {
      icon: TrendingUp,
      title: "Tingkatkan Pendapatan",
      description: "Ubah makanan sisa menjadi sumber pendapatan tambahan tanpa perlu usaha ekstra"
    },
    {
      icon: Users,
      title: "Jangkau Pelanggan Baru",
      description: "Dapatkan akses ke ribuan pelanggan yang mencari makanan berkualitas dengan harga terjangkau"
    },
    {
      icon: Leaf,
      title: "Kurangi Food Waste",
      description: "Berkontribusi dalam mengurangi limbah makanan dan dampak lingkungan"
    },
    {
      icon: Store,
      title: "Mudah Dikelola",
      description: "Platform yang user-friendly dengan sistem manajemen yang sederhana"
    }
  ];

  const steps = [
    {
      number: 1,
      title: "Daftar",
      description: "Isi formulir pendaftaran bisnis dan verifikasi akun Anda"
    },
    {
      number: 2,
      title: "Buat Profil Toko",
      description: "Lengkapi informasi bisnis, foto, dan jam operasional toko Anda"
    },
    {
      number: 3,
      title: "Unggah Paket",
      description: "Buat surprise bag dengan detail harga dan waktu pengambilan"
    },
    {
      number: 4,
      title: "Terima Pesanan",
      description: "Pelanggan memesan paket dan melakukan pembayaran"
    },
    {
      number: 5,
      title: "Serahkan Paket",
      description: "Siapkan dan serahkan paket kepada pelanggan sesuai jadwal"
    }
  ];

  const stats = [
    { value: "500+", label: "Mitra Bisnis" },
    { value: "50K+", label: "Pengguna Aktif" },
    { value: "100K+", label: "Paket Terjual" },
    { value: "30%", label: "Peningkatan Pendapatan" }
  ];

  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-b from-background via-primary/5 to-background">
      <Header />
      
      <main className="flex-1 pt-24 md:pt-28">
        <section className="py-16 md:py-24 bg-gradient-to-br from-primary/10 via-accent/5 to-background relative overflow-hidden">
          <div className="absolute top-0 right-0 w-96 h-96 bg-accent/10 rounded-full blur-3xl" />
          <div className="absolute bottom-0 left-0 w-96 h-96 bg-primary/10 rounded-full blur-3xl" />
          
          <div className="container max-w-6xl relative z-10">
            <div className="grid lg:grid-cols-2 gap-12 items-center">
              <div className="space-y-8">
                <Badge className="bg-primary/10 text-primary border-none px-6 py-2 text-base">
                  Untuk Bisnis
                </Badge>
                <h1 className="font-heading text-4xl md:text-5xl lg:text-6xl font-bold text-foreground leading-tight">
                  Bergabunglah dengan <span className="text-primary">GoodBite</span>
                </h1>
                <p className="text-lg md:text-xl text-muted-foreground leading-relaxed">
                  Maksimalkan potensi bisnis Anda sambil mengurangi food waste. 
                  Raih pelanggan baru dan tingkatkan pendapatan dengan platform kami.
                </p>
                <div className="flex flex-col sm:flex-row gap-4">
                  <Button size="lg" className="bg-primary hover:bg-primary/90 text-white px-8 py-6 rounded-2xl shadow-lg hover:shadow-xl hover:scale-105 transition-all text-base">
                    Daftar Sekarang
                    <ArrowRight className="ml-2 h-5 w-5" />
                  </Button>
                  <Button size="lg" variant="outline" className="border-2 border-primary text-primary hover:bg-primary/10 px-8 py-6 rounded-2xl text-base">
                    Hubungi Kami
                    <Phone className="ml-2 h-5 w-5" />
                  </Button>
                </div>
              </div>
              
              <div className="relative">
                <div className="absolute inset-0 bg-gradient-to-br from-primary/20 to-accent/20 rounded-3xl blur-3xl" />
                <Card className="relative border-none shadow-2xl rounded-3xl overflow-hidden">
                  <CardContent className="p-8 md:p-10 bg-gradient-to-br from-white to-primary/5">
                    <div className="grid grid-cols-2 gap-6">
                      {stats.map((stat, index) => (
                        <div key={index} className="text-center space-y-2">
                          <div className="text-3xl md:text-4xl font-bold text-primary">{stat.value}</div>
                          <div className="text-sm text-muted-foreground">{stat.label}</div>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </div>
            </div>
          </div>
        </section>

        <section className="py-16 md:py-20">
          <div className="container max-w-6xl">
            <div className="text-center mb-12">
              <Badge className="bg-accent/10 text-accent border-none mb-4">Keuntungan</Badge>
              <h2 className="font-heading text-3xl md:text-4xl font-bold text-foreground mb-4">
                Mengapa Bergabung dengan GoodBite?
              </h2>
              <p className="text-muted-foreground max-w-2xl mx-auto">
                Dapatkan berbagai keuntungan yang mendukung pertumbuhan bisnis Anda
              </p>
            </div>
            
            <div className="grid md:grid-cols-2 gap-6 lg:gap-8">
              {benefits.map((benefit, index) => (
                <Card key={index} className="border-none shadow-lg hover:shadow-xl transition-all duration-500 group hover:-translate-y-2">
                  <CardContent className="p-8 bg-gradient-to-br from-white to-primary/5 rounded-3xl">
                    <div className="flex items-start gap-6">
                      <div className="p-4 rounded-2xl bg-primary/10 group-hover:bg-primary group-hover:scale-110 transition-all duration-500 flex-shrink-0">
                        <benefit.icon className="h-8 w-8 text-primary group-hover:text-white transition-colors" />
                      </div>
                      <div className="space-y-2">
                        <h3 className="font-heading text-xl font-bold text-foreground">{benefit.title}</h3>
                        <p className="text-muted-foreground leading-relaxed">{benefit.description}</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </section>

        <section className="py-16 md:py-20 bg-gradient-to-b from-background to-white">
          <div className="container max-w-6xl">
            <div className="text-center mb-16">
              <Badge className="bg-primary/10 text-primary border-none mb-4">Cara Kerja</Badge>
              <h2 className="font-heading text-3xl md:text-4xl font-bold text-foreground mb-4">
                Mudah untuk Memulai
              </h2>
              <p className="text-muted-foreground max-w-2xl mx-auto">
                Lima langkah sederhana untuk bergabung dan mulai berjualan
              </p>
            </div>
            
            <div className="relative">
              <div className="hidden md:block absolute top-16 left-0 right-0 h-1 bg-gradient-to-r from-primary via-accent to-primary" style={{width: "calc(100% - 8rem)", marginLeft: "4rem"}} />
              
              <div className="grid md:grid-cols-5 gap-8 relative">
                {steps.map((step, index) => (
                  <div key={index} className="text-center space-y-4 group">
                    <div className="relative inline-flex">
                      <div className="w-32 h-32 rounded-full bg-gradient-to-br from-primary to-primary/70 flex items-center justify-center relative z-10 group-hover:scale-110 transition-transform duration-500 shadow-xl">
                        <span className="text-4xl font-bold text-white">{step.number}</span>
                      </div>
                      <div className="absolute inset-0 rounded-full bg-accent blur-2xl opacity-0 group-hover:opacity-50 transition-opacity duration-500" />
                    </div>
                    <h3 className="font-heading text-xl font-bold text-foreground">{step.title}</h3>
                    <p className="text-muted-foreground text-sm leading-relaxed">{step.description}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>

        <section className="py-16 md:py-20 bg-gradient-to-br from-primary/5 to-accent/5">
          <div className="container max-w-4xl">
            <Card className="bg-gradient-to-br from-primary to-primary/80 border-none shadow-2xl overflow-hidden rounded-3xl">
              <CardContent className="p-10 md:p-14 relative">
                <div className="absolute top-0 right-0 w-64 h-64 bg-accent/20 rounded-full blur-3xl" />
                <div className="absolute bottom-0 left-0 w-64 h-64 bg-white/10 rounded-full blur-3xl" />
                
                <div className="relative z-10 text-center space-y-8">
                  <div className="inline-flex p-5 rounded-2xl bg-white/10 backdrop-blur-sm">
                    <Store className="h-12 w-12 text-white" />
                  </div>
                  <h2 className="font-heading text-3xl md:text-4xl font-bold text-white">
                    Siap Bergabung?
                  </h2>
                  <p className="text-white/90 text-lg max-w-2xl mx-auto leading-relaxed">
                    Daftarkan bisnis Anda sekarang dan mulai tingkatkan pendapatan 
                    sambil berkontribusi mengurangi food waste
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
                  
                  <Button size="lg" className="bg-accent hover:bg-accent/90 text-primary px-10 py-7 rounded-2xl shadow-2xl hover:shadow-accent/50 hover:scale-105 transition-all text-lg font-bold">
                    Hubungi Tim Kami
                    <ArrowRight className="ml-2 h-6 w-6" />
                  </Button>
                  
                  <div className="flex items-center justify-center gap-2 text-white/80 text-sm">
                    <CheckCircle2 className="h-5 w-5 text-accent" />
                    <span>Gratis untuk bergabung, tanpa biaya tersembunyi</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
};

export default Bisnis;
