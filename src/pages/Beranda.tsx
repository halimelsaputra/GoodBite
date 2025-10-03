import { Link } from "react-router-dom";
import { useState, useEffect } from "react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Wallet, UtensilsCrossed, Store, ArrowRight, Search, ShoppingCart, Smile, MapPin, Star, ChevronLeft, ChevronRight } from "lucide-react";

// Import images
import heroImage1 from "@/img/gambar_dashboard_atas1.jpg";
import heroImage2 from "@/img/gambar_dashboard_atas2.jpg";
import heroImage3 from "@/img/gambar_dashboard_atas3.jpg";
import kfcImage from "@/img/KfC.jpg";
import jcoImage from "@/img/J.co.jpg";
import rotiBakarImage from "@/img/Roti-bakar.jpg";
import kopiKananganImage from "@/img/Kopi-kenangan.jpg";
import pizzaHutImage from "@/img/Pizza-hut.jpg";
import orangMakanImage from "@/img/Orang-makan.jpg";

const Index = () => {
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const heroImages = [heroImage1, heroImage2, heroImage3];

  // Auto slide effect
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentImageIndex((prevIndex) => 
        prevIndex === heroImages.length - 1 ? 0 : prevIndex + 1
      );
    }, 5000); // Change image every 5 seconds

    return () => clearInterval(interval);
  }, [heroImages.length]);
  const features = [
    {
      icon: Wallet,
      title: "Hemat Uang",
      description: "Dapatkan makanan berkualitas dengan harga hingga 70% lebih murah dari harga normal"
    },
    {
      icon: UtensilsCrossed,
      title: "Selamatkan Makanan",
      description: "Bantu mengurangi food waste dan dampak lingkungan dengan menyelamatkan makanan sisa"
    },
    {
      icon: Store,
      title: "Dukung UMKM",
      description: "Dukung bisnis lokal dan UMKM Indonesia sambil menikmati makanan lezat"
    }
  ];

  const partners = [
    { name: "Airbnb", logo: "/placeholder.svg" },
    { name: "Booking.com", logo: "/placeholder.svg" },
    { name: "Trivago", logo: "/placeholder.svg" },
    { name: "Expedia", logo: "/placeholder.svg" },
  ];

  const popularPackages = [
    {
      id: "1",
      name: "Roti Bakar 88",
      location: "Batoh",
      image: rotiBakarImage,
      rating: 4.7,
      price: 15000,
      originalPrice: 45000
    },
    {
      id: "2",
      name: "Kopi Kenangan",
      location: "Peuniti",
      image: kopiKananganImage,
      rating: 4.8,
      price: 20000,
      originalPrice: 50000
    },
    {
      id: "3",
      name: "Pizzza Hut",
      location: "Peuniti",
      image: pizzaHutImage,
      rating: 4.9,
      price: 35000,
      originalPrice: 100000
    }
  ];

  const journeySteps = [
    {
      icon: Search,
      title: "Cari Makanan",
      description: "Jelajahi paket surprise bag dari restoran favorit di sekitar Anda"
    },
    {
      icon: ShoppingCart,
      title: "Pesan Paket",
      description: "Pilih paket yang Anda inginkan dan lakukan pembayaran dengan mudah"
    },
    {
      icon: Smile,
      title: "Ambil & Nikmati",
      description: "Ambil paket Anda di waktu yang ditentukan dan nikmati makanan lezat"
    }
  ];

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Header />
      
      {/* Hero Section - Premium Design with Floating Elements */}
      <section className="relative py-8 md:py-12 pt-24 md:pt-28 overflow-hidden">
        <div className="container">
          {/* Floating decoration elements */}
          <div className="absolute top-20 right-10 w-72 h-72 bg-accent/10 rounded-full blur-3xl animate-pulse" />
          <div className="absolute bottom-20 left-10 w-96 h-96 bg-primary/5 rounded-full blur-3xl" />
          
          <div className="relative rounded-[2.5rem] overflow-hidden bg-gradient-to-br from-primary via-primary/95 to-[#1a4d33] shadow-2xl">
            {/* Background Images Carousel */}
            <div className="absolute inset-0 z-0">
              {heroImages.map((image, index) => (
                <div
                  key={index}
                  className={`absolute inset-0 transition-all duration-1000 ${
                    index === currentImageIndex ? 'opacity-30 scale-100' : 'opacity-0 scale-105'
                  }`}
                >
                  <img 
                    src={image}
                    alt={`Hero background ${index + 1}`}
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute inset-0 bg-gradient-to-r from-primary/80 via-primary/60 to-transparent" />
                </div>
              ))}
            </div>
            
            {/* Animated gradient overlay */}
            <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,_var(--tw-gradient-stops))] from-accent/10 via-transparent to-transparent opacity-50" />
            
            {/* Content */}
            <div className="relative z-10 grid md:grid-cols-2 gap-12 p-8 md:p-16 lg:p-20 min-h-[600px] items-center">
              {/* Left - Text Content */}
              <div className="text-white space-y-6 animate-fadeIn">
                <h1 className="font-heading text-4xl md:text-5xl lg:text-7xl font-extrabold leading-[1.1] drop-shadow-lg">
                  <span className="text-accent bg-clip-text text-transparent bg-gradient-to-r from-accent via-accent/90 to-accent/80">
                    Selamatkan Bumi
                  </span>
                  <br />
                  Dari Limbah Makanan!
                </h1>
                
                <p className="font-body text-lg md:text-xl text-white/90 leading-relaxed max-w-xl">
                  GoodBite membantu anda mengurangi limbah dari makanan
                </p>
                
                <div className="flex flex-col sm:flex-row gap-4 pt-6">
                  <Link to="/jelajahi" className="flex-1 sm:flex-initial">
                    <Button 
                      size="lg" 
                      className="w-full rounded-full px-8 py-7 text-lg font-bold bg-accent hover:bg-accent/90 text-foreground shadow-2xl hover:shadow-accent/20 hover:scale-105 transition-all duration-300 group border-2 border-accent/20"
                    >
                      <Search className="mr-2 h-5 w-5" />
                      Jelajahi Paket
                      <ArrowRight className="ml-2 h-5 w-5 group-hover:translate-x-1 transition-transform" />
                    </Button>
                  </Link>
                  <Link to="/login" className="flex-1 sm:flex-initial">
                    <Button 
                      size="lg" 
                      variant="outline"
                      className="w-full rounded-full px-8 py-7 text-lg font-bold bg-white/5 hover:bg-white/10 text-white border-2 border-white/30 hover:border-white/50 shadow-lg backdrop-blur-sm transition-all duration-300"
                    >
                      Masuk
                    </Button>
                  </Link>
                </div>
                
                {/* Stats */}
                <div className="flex items-center gap-6 pt-8 flex-wrap">
                  <div className="space-y-1">
                    <div className="text-3xl font-bold text-accent">500+</div>
                    <div className="text-sm text-white/70">Restoran Partner</div>
                  </div>
                  <div className="w-px h-12 bg-white/20" />
                  <div className="space-y-1">
                    <div className="text-3xl font-bold text-accent">50K+</div>
                    <div className="text-sm text-white/70">Pengguna Aktif</div>
                  </div>
                  <div className="w-px h-12 bg-white/20" />
                  <div className="space-y-1">
                    <div className="text-3xl font-bold text-accent">70%</div>
                    <div className="text-sm text-white/70">Hemat Maksimal</div>
                  </div>
                </div>
              </div>
              
              {/* Right - Floating Cards Preview */}
              <div className="hidden md:flex relative h-[500px] items-center justify-center">
                {/* Floating Card 1 */}
                <div className="absolute top-0 right-0 w-64 bg-white rounded-2xl shadow-2xl p-4 transform rotate-6 hover:rotate-3 transition-transform duration-300">
                  <img src={kfcImage} alt="KFC" className="w-full h-40 object-cover rounded-xl mb-3" />
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <h4 className="font-bold text-foreground">KFC, Suzuya Mall</h4>
                      <Badge className="bg-accent text-foreground">-60%</Badge>
                    </div>
                    <p className="text-2xl font-bold text-primary">Rp 15.000</p>
                  </div>
                </div>
                
                {/* Floating Card 2 */}
                <div className="absolute bottom-0 left-0 w-64 bg-white rounded-2xl shadow-2xl p-4 transform -rotate-6 hover:-rotate-3 transition-transform duration-300">
                  <img src={jcoImage} alt="JCO" className="w-full h-40 object-cover rounded-xl mb-3" />
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <h4 className="font-bold text-foreground">JCO Donuts & Coffee</h4>
                      <Badge className="bg-accent text-foreground">-70%</Badge>
                    </div>
                    <p className="text-2xl font-bold text-primary">Rp 20.000</p>
                  </div>
                </div>
              </div>
            </div>
            
            {/* Slider Indicators */}
            <div className="absolute bottom-8 left-1/2 -translate-x-1/2 z-20 flex gap-2">
              {heroImages.map((_, index) => (
                <button
                  key={index}
                  onClick={() => setCurrentImageIndex(index)}
                  className={`h-2 rounded-full transition-all duration-300 ${
                    index === currentImageIndex 
                      ? 'bg-accent w-12' 
                      : 'bg-white/30 hover:bg-white/50 w-2'
                  }`}
                  aria-label={`Go to slide ${index + 1}`}
                />
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Popular Packages Section - Enhanced Modern Design */}
      <section className="py-20 md:py-28 bg-background relative overflow-hidden">
        {/* Background decoration */}
        <div className="absolute top-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-border to-transparent" />
        
        <div className="container">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-12">
            <div className="space-y-3">
              <h2 className="font-heading text-4xl md:text-5xl font-bold text-foreground">
                Paket Paling Populer
              </h2>
              <p className="text-lg text-muted-foreground max-w-2xl">
                Temukan surprise bag menarik dari toko favorit anda. Hemat sampai dengan 70%!
              </p>
            </div>
            
            <div className="flex items-center gap-3">
              <Button variant="outline" size="icon" className="rounded-full h-12 w-12 border-2 hover:bg-primary hover:text-white hover:border-primary transition-all">
                <ChevronLeft className="h-5 w-5" />
              </Button>
              <Button variant="default" size="icon" className="rounded-full h-12 w-12 bg-primary hover:bg-primary/90 shadow-lg">
                <ChevronRight className="h-5 w-5" />
              </Button>
            </div>
          </div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-8">
            {popularPackages.map((pkg, index) => (
              <Link key={pkg.id} to={`/paket/${pkg.id}`} className="group">
                <Card className="overflow-hidden border-none shadow-md hover:shadow-2xl transition-all duration-500 bg-white rounded-3xl">
                  {/* Image Container */}
                  <div className="relative h-72 overflow-hidden">
                    <img
                      src={pkg.image}
                      alt={pkg.name}
                      className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                    />
                    {/* Gradient Overlay */}
                    <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                    
                    {/* Badges */}
                    <div className="absolute top-4 left-4 right-4 flex justify-between items-start">
                      <Badge className="bg-white/95 backdrop-blur text-foreground font-bold px-3 py-1.5 rounded-full shadow-lg">
                        <Star className="h-3 w-3 fill-accent text-accent mr-1" />
                        {pkg.rating}
                      </Badge>
                      <Badge className="bg-accent text-foreground font-bold px-4 py-1.5 rounded-full shadow-lg">
                        HEMAT {Math.round((1 - pkg.price / pkg.originalPrice) * 100)}%
                      </Badge>
                    </div>
                    
                    {/* Quick View Button - Shows on Hover */}
                    <div className="absolute bottom-4 left-1/2 -translate-x-1/2 opacity-0 group-hover:opacity-100 transition-all duration-300 transform translate-y-4 group-hover:translate-y-0">
                      <Button size="sm" className="rounded-full bg-white text-primary hover:bg-white/90 shadow-xl font-semibold">
                        <Search className="h-4 w-4 mr-2" />
                        Lihat Detail
                      </Button>
                    </div>
                  </div>
                  
                  {/* Content */}
                  <CardContent className="p-6 space-y-4">
                    <div className="space-y-2">
                      <h3 className="font-heading font-bold text-xl text-foreground group-hover:text-primary transition-colors line-clamp-1">
                        {pkg.name}
                      </h3>
                      <p className="text-sm text-muted-foreground flex items-center gap-1.5">
                        <MapPin className="h-4 w-4 text-primary" />
                        {pkg.location}
                      </p>
                    </div>
                    
                    <div className="flex items-center justify-between pt-3 border-t">
                      <div className="space-y-1">
                        <div className="flex items-baseline gap-2">
                          <span className="text-3xl font-bold text-primary">
                            {pkg.price.toLocaleString('id-ID', { style: 'currency', currency: 'IDR', minimumFractionDigits: 0 })}
                          </span>
                        </div>
                        <span className="text-sm text-muted-foreground line-through">
                          {pkg.originalPrice.toLocaleString('id-ID', { style: 'currency', currency: 'IDR', minimumFractionDigits: 0 })}
                        </span>
                      </div>
                      <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center group-hover:bg-primary group-hover:scale-110 transition-all duration-300">
                        <ArrowRight className="h-5 w-5 text-primary group-hover:text-white transition-colors" />
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </Link>
            ))}
          </div>
          
          {/* View All Button */}
          <div className="text-center mt-12">
            <Link to="/jelajahi">
              <Button size="lg" variant="outline" className="rounded-full px-10 py-6 text-base font-semibold border-2 hover:bg-primary hover:text-white hover:border-primary transition-all group">
                Lihat Semua Paket
                <ArrowRight className="ml-2 h-5 w-5 group-hover:translate-x-2 transition-transform" />
              </Button>
            </Link>
          </div>
        </div>
      </section>


      {/* Features Section - Premium Modern Design */}
      <section className="py-20 md:py-32 bg-gradient-to-br from-primary/5 via-background to-accent/5 relative overflow-hidden">
        {/* Decorative Elements */}
        <div className="absolute top-1/4 right-0 w-96 h-96 bg-primary/5 rounded-full blur-3xl" />
        <div className="absolute bottom-1/4 left-0 w-96 h-96 bg-accent/5 rounded-full blur-3xl" />
        
        <div className="container relative z-10">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <h2 className="font-heading text-4xl md:text-5xl font-bold text-foreground mb-4">
              Manfaat untuk <span className="text-primary">Semua Pihak</span>
            </h2>
            <p className="text-lg text-muted-foreground">
              Solusi win-win yang menguntungkan pelanggan, restoran, dan lingkungan
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8 md:gap-10">
            {features.map((feature, index) => (
              <div 
                key={index} 
                className="group relative"
                style={{ 
                  animation: `fadeInUp 0.6s ease-out ${index * 0.15}s both` 
                }}
              >
                {/* Connecting Line (except last) */}
                {index < features.length - 1 && (
                  <div className="hidden md:block absolute top-24 left-full w-full h-0.5 bg-gradient-to-r from-primary/20 to-transparent -translate-x-1/2 z-0" />
                )}
                
                <div className="relative bg-white rounded-3xl p-8 shadow-lg hover:shadow-2xl transition-all duration-500 border-2 border-transparent hover:border-primary/20 group-hover:-translate-y-2">
                  {/* Icon Container with Gradient */}
                  <div className="relative mb-6">
                    <div className="absolute inset-0 bg-gradient-to-br from-primary to-primary/70 rounded-2xl blur-xl opacity-20 group-hover:opacity-30 transition-opacity" />
                    <div className="relative w-20 h-20 bg-gradient-to-br from-primary to-primary/80 rounded-2xl flex items-center justify-center shadow-lg group-hover:scale-110 group-hover:rotate-3 transition-all duration-500">
                      <feature.icon className="h-10 w-10 text-white" />
                    </div>
                    
                    {/* Number Badge */}
                    <div className="absolute -top-2 -right-2 w-8 h-8 bg-accent rounded-full flex items-center justify-center text-sm font-bold text-foreground shadow-lg">
                      {index + 1}
                    </div>
                  </div>
                  
                  <h3 className="font-heading text-2xl font-bold text-foreground mb-3 group-hover:text-primary transition-colors">
                    {feature.title}
                  </h3>
                  <p className="text-muted-foreground leading-relaxed">
                    {feature.description}
                  </p>
                  
                  {/* Hover Effect Arrow */}
                  <div className="mt-6 flex items-center gap-2 text-primary opacity-0 group-hover:opacity-100 transition-all duration-300 transform translate-y-2 group-hover:translate-y-0">
                    <span className="text-sm font-semibold">Pelajari lebih lanjut</span>
                    <ArrowRight className="h-4 w-4" />
                  </div>
                </div>
              </div>
            ))}
          </div>
          
          {/* Bottom CTA */}
          <div className="text-center mt-16">
            <Link to="/tentang">
              <Button size="lg" className="rounded-full px-10 py-6 text-base font-semibold bg-primary hover:bg-primary/90 shadow-lg hover:shadow-xl transition-all group">
                Pelajari Lebih Lanjut Tentang Kami
                <ArrowRight className="ml-2 h-5 w-5 group-hover:translate-x-2 transition-transform" />
              </Button>
            </Link>
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


      {/* Promo Banner Section - Immersive Premium Design */}
      <section className="py-20 md:py-32 bg-white relative overflow-hidden">
        {/* Animated floating elements */}
        <div className="absolute top-10 right-1/4 w-20 h-20 bg-accent/10 rounded-full animate-bounce" style={{ animationDuration: '3s' }} />
        <div className="absolute bottom-20 left-1/4 w-16 h-16 bg-primary/10 rounded-full animate-bounce" style={{ animationDuration: '4s', animationDelay: '1s' }} />
        
        <div className="container">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            {/* Left - Enhanced Image */}
            <div className="relative order-2 lg:order-1 group">
              {/* Glow effect behind image */}
              <div className="absolute inset-0 bg-gradient-to-br from-primary/20 to-accent/20 rounded-[3rem] blur-3xl scale-95 group-hover:scale-100 transition-transform duration-700" />
              
              <div className="relative rounded-[3rem] overflow-hidden shadow-2xl">
                <img 
                  src={orangMakanImage} 
                  alt="GoodBite App Preview"
                  className="w-full h-[550px] object-cover transform group-hover:scale-105 transition-transform duration-700"
                />
                
                {/* Overlay gradient */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent" />
                
                {/* Animated Discount Badge */}
                <div className="absolute bottom-10 left-10 bg-white rounded-3xl p-8 shadow-2xl transform group-hover:-translate-y-2 group-hover:rotate-2 transition-all duration-500">
                  <div className="text-center space-y-2">
                    <div className="text-6xl font-bold bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent animate-pulse">
                      70%
                    </div>
                    <div className="text-lg font-semibold text-foreground">
                      HEMAT MAKSIMAL
                    </div>
                    <div className="text-sm text-muted-foreground">
                      Untuk paket pilihan
                    </div>
                  </div>
                </div>
                
                {/* Floating Stats Cards */}
                <div className="absolute top-10 right-10 bg-white/95 backdrop-blur rounded-2xl p-4 shadow-xl transform group-hover:-translate-y-2 group-hover:-rotate-2 transition-all duration-500">
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 bg-primary/10 rounded-xl flex items-center justify-center">
                      <Smile className="h-6 w-6 text-primary" />
                    </div>
                    <div>
                      <div className="text-2xl font-bold text-foreground">4.9</div>
                      <div className="text-xs text-muted-foreground">Rating App</div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Right - Enhanced Content */}
            <div className="space-y-8 order-1 lg:order-2">
              <div className="space-y-4">
                <h2 className="font-heading text-5xl md:text-6xl font-bold text-foreground leading-tight">
                  Lepaskan Keinginan{" "}
                  <span className="text-primary relative inline-block">
                    Hemat
                    <svg className="absolute -bottom-2 left-0 w-full" height="12" viewBox="0 0 200 12" fill="none">
                      <path d="M0 8C50 4 100 4 150 8C175 10 200 10 200 8" stroke="currentColor" strokeWidth="3" className="text-accent" />
                    </svg>
                  </span>
                  {" "}Dengan GoodBite
                </h2>
              </div>
              
              <p className="text-xl text-muted-foreground leading-relaxed">
                Hemat adalah cara yang indah untuk menjelajahi makanan baru, 
                pelajari tentang berbagai UMKM, dan dapatkan pengalaman unik.
              </p>
              
              {/* Feature points */}
              <div className="space-y-4">
                {[
                  { icon: Wallet, text: "Hemat hingga 70% untuk makanan berkualitas" },
                  { icon: UtensilsCrossed, text: "Kurangi food waste & bantu lingkungan" },
                  { icon: Store, text: "Dukung UMKM lokal di sekitar Anda" }
                ].map((item, i) => (
                  <div key={i} className="flex items-center gap-4 group/item">
                    <div className="w-12 h-12 bg-primary/10 rounded-xl flex items-center justify-center group-hover/item:bg-primary group-hover/item:scale-110 transition-all">
                      <item.icon className="h-6 w-6 text-primary group-hover/item:text-white transition-colors" />
                    </div>
                    <span className="text-base text-foreground font-medium">{item.text}</span>
                  </div>
                ))}
              </div>
              
              <div className="flex flex-wrap gap-4 pt-4">
                <Link to="/jelajahi">
                  <Button 
                    size="lg"
                    className="rounded-full px-10 py-7 text-lg font-semibold bg-primary hover:bg-primary/90 shadow-xl hover:shadow-2xl hover:scale-105 transition-all group"
                  >
                    Mulai Hemat Sekarang
                    <ArrowRight className="ml-2 h-6 w-6 group-hover:translate-x-2 transition-transform" />
                  </Button>
                </Link>
                <Link to="/tentang">
                  <Button 
                    size="lg"
                    variant="outline"
                    className="rounded-full px-10 py-7 text-lg font-semibold border-2 hover:bg-primary/5 hover:border-primary transition-all"
                  >
                    Pelajari Lebih Lanjut
                  </Button>
                </Link>
              </div>
              
              {/* Trust indicators */}
              <div className="flex items-center gap-8 pt-6 border-t">
                <div>
                  <div className="text-3xl font-bold text-primary">500+</div>
                  <div className="text-sm text-muted-foreground">Restoran Partner</div>
                </div>
                <div>
                  <div className="text-3xl font-bold text-primary">50K+</div>
                  <div className="text-sm text-muted-foreground">Pengguna Aktif</div>
                </div>
                <div>
                  <div className="text-3xl font-bold text-primary">100K+</div>
                  <div className="text-sm text-muted-foreground">Paket Terjual</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>


      {/* Journey Steps Section - Connected Timeline Design */}
      <section className="py-20 md:py-32 bg-gradient-to-b from-background to-white relative overflow-hidden">
        {/* Decorative background */}
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_50%,rgba(31,91,59,0.05),transparent_50%),radial-gradient(circle_at_70%_50%,rgba(242,183,5,0.05),transparent_50%)]" />
        
        <div className="container relative z-10">
          <div className="text-center mb-16">
            <Badge className="bg-accent/10 text-accent border-none mb-4">🚀 Cara Kerja</Badge>
            <h2 className="font-heading text-4xl md:text-5xl font-bold text-foreground mb-4">
              Perjalanan Hemat <span className="text-primary">Dibuat Simpel!</span>
            </h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Cuma 3 langkah mudah untuk mulai berhemat dan selamatkan makanan
            </p>
          </div>
          
          {/* Desktop Timeline View */}
          <div className="hidden md:grid md:grid-cols-3 gap-12 relative">
            {/* Connecting line */}
            <div className="absolute top-24 left-0 right-0 h-1 bg-gradient-to-r from-primary via-accent to-primary hidden lg:block" style={{ width: 'calc(100% - 200px)', left: '100px' }} />
            
            {journeySteps.map((step, index) => (
              <div 
                key={index} 
                className="relative group"
                style={{ 
                  animation: `slideInUp 0.6s ease-out ${index * 0.2}s both` 
                }}
              >
                {/* Step Number Circle */}
                <div className="absolute -top-6 left-1/2 -translate-x-1/2 z-20">
                  <div className="w-16 h-16 rounded-full bg-gradient-to-br from-primary to-accent flex items-center justify-center shadow-xl border-4 border-white group-hover:scale-125 transition-transform duration-500">
                    <span className="text-2xl font-bold text-white">{index + 1}</span>
                  </div>
                </div>
                
                {/* Card */}
                <div className="relative mt-12 bg-white rounded-3xl p-8 shadow-lg hover:shadow-2xl transition-all duration-500 border-2 border-transparent hover:border-primary/20 group-hover:-translate-y-2">
                  {/* Glow effect */}
                  <div className="absolute inset-0 bg-gradient-to-br from-primary/5 to-accent/5 rounded-3xl opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                  
                  <div className="relative z-10 text-center space-y-4">
                    {/* Icon */}
                    <div className="inline-flex p-6 rounded-2xl bg-gradient-to-br from-primary/10 to-accent/10 group-hover:scale-110 transition-transform duration-500">
                      <step.icon className="h-12 w-12 text-primary" />
                    </div>
                    
                    <h3 className="font-heading text-2xl font-bold text-foreground group-hover:text-primary transition-colors">
                      {step.title}
                    </h3>
                    
                    <p className="text-muted-foreground leading-relaxed">
                      {step.description}
                    </p>
                    
                    {/* Animated arrow */}
                    {index < journeySteps.length - 1 && (
                      <div className="hidden lg:block absolute top-1/2 -right-14 text-accent">
                        <ArrowRight className="h-8 w-8 animate-pulse" />
                      </div>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
          
          {/* Mobile Vertical Timeline */}
          <div className="md:hidden space-y-8 relative">
            {/* Vertical connecting line */}
            <div className="absolute left-8 top-0 bottom-0 w-1 bg-gradient-to-b from-primary via-accent to-primary" />
            
            {journeySteps.map((step, index) => (
              <div key={index} className="relative pl-20">
                {/* Step Number Circle */}
                <div className="absolute left-0 top-0">
                  <div className="w-16 h-16 rounded-full bg-gradient-to-br from-primary to-accent flex items-center justify-center shadow-xl border-4 border-white">
                    <span className="text-2xl font-bold text-white">{index + 1}</span>
                  </div>
                </div>
                
                {/* Card */}
                <div className="bg-white rounded-2xl p-6 shadow-lg border-2 border-transparent">
                  <div className="space-y-3">
                    <div className="inline-flex p-4 rounded-xl bg-gradient-to-br from-primary/10 to-accent/10">
                      <step.icon className="h-8 w-8 text-primary" />
                    </div>
                    <h3 className="font-heading text-xl font-bold text-foreground">
                      {step.title}
                    </h3>
                    <p className="text-sm text-muted-foreground leading-relaxed">
                      {step.description}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>
          
          {/* Bottom CTA */}
          <div className="text-center mt-16">
            <Link to="/jelajahi">
              <Button size="lg" className="rounded-full px-12 py-7 text-lg font-semibold bg-gradient-to-r from-primary to-primary/90 hover:from-primary/90 hover:to-primary shadow-xl hover:shadow-2xl hover:scale-105 transition-all group">
                Mulai Perjalanan Hemat
                <ArrowRight className="ml-2 h-6 w-6 group-hover:translate-x-2 transition-transform" />
              </Button>
            </Link>
          </div>
        </div>
        
        <style>{`
          @keyframes slideInUp {
            from {
              opacity: 0;
              transform: translateY(50px);
            }
            to {
              opacity: 1;
              transform: translateY(0);
            }
          }
        `}</style>
      </section>


      {/* Final CTA Section - Immersive Design */}
      <section className="py-20 md:py-32 bg-gradient-to-b from-background to-white relative overflow-hidden">
        <div className="container">
          <div className="relative">
            {/* Main CTA Card */}
            <Card className="bg-gradient-to-br from-primary via-[#1a5239] to-primary border-none shadow-2xl overflow-hidden rounded-[3rem]">
              <CardContent className="p-12 md:p-24 relative">
                {/* Animated floating elements */}
                <div className="absolute top-10 right-10 w-72 h-72 bg-accent/20 rounded-full blur-3xl animate-pulse" style={{ animationDuration: '4s' }} />
                <div className="absolute bottom-10 left-10 w-96 h-96 bg-white/5 rounded-full blur-3xl animate-pulse" style={{ animationDuration: '5s', animationDelay: '1s' }} />
                <div className="absolute top-1/2 left-1/4 w-40 h-40 bg-accent/10 rounded-full blur-2xl animate-bounce" style={{ animationDuration: '6s' }} />
                
                {/* Content */}
                <div className="relative z-10 text-center space-y-8">
                  <div className="space-y-4">
                    
                    <h2 className="font-heading text-4xl md:text-6xl lg:text-7xl font-bold text-white leading-tight">
                      Siap Mulai{" "}
                      <span className="inline-block">
                        <span className="relative">
                          Berhemat
                          <svg className="absolute -bottom-2 left-0 w-full" height="16" viewBox="0 0 300 16" fill="none">
                            <path d="M5 12C75 6 150 6 225 12C265 15 295 15 295 12" stroke="#F2B705" strokeWidth="4" strokeLinecap="round" />
                          </svg>
                        </span>
                      </span>
                      ?
                    </h2>
                  </div>
                  
                  <p className="text-xl md:text-2xl text-white/90 max-w-3xl mx-auto leading-relaxed">
                    Jelajahi ratusan paket surprise bag dari restoran dan toko favorit Anda. 
                    <br className="hidden md:block" />
                    <span className="font-semibold text-accent">Hemat hingga 70%</span> sambil selamatkan makanan & dukung UMKM lokal.
                  </p>
                  
                  {/* Stats */}
                  <div className="grid grid-cols-3 gap-6 md:gap-12 max-w-3xl mx-auto py-8">
                    <div className="space-y-2">
                      <div className="text-4xl md:text-5xl font-bold text-accent">500+</div>
                      <div className="text-sm md:text-base text-white/70">Restoran Partner</div>
                    </div>
                    <div className="space-y-2">
                      <div className="text-4xl md:text-5xl font-bold text-accent">50K+</div>
                      <div className="text-sm md:text-base text-white/70">Pengguna Aktif</div>
                    </div>
                    <div className="space-y-2">
                      <div className="text-4xl md:text-5xl font-bold text-accent">4.9</div>
                      <div className="text-sm md:text-base text-white/70">Rating App</div>
                    </div>
                  </div>
                  
                  {/* CTA Buttons */}
                  <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-4">
                    <Link to="/jelajahi">
                      <Button 
                        size="lg" 
                        className="rounded-full px-12 py-7 text-lg font-bold bg-accent hover:bg-accent/90 text-foreground shadow-2xl hover:shadow-accent/30 hover:scale-110 transition-all group min-w-[250px]"
                      >
                        <ShoppingCart className="mr-2 h-6 w-6" />
                        Jelajahi Paket Sekarang
                        <ArrowRight className="ml-2 h-6 w-6 group-hover:translate-x-2 transition-transform" />
                      </Button>
                    </Link>
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
                  </div>
                  
                  {/* Trust Badge */}
                  <div className="pt-8">
                    <div className="inline-flex items-center gap-3 bg-white/10 backdrop-blur-sm rounded-full px-6 py-3">
                      <div className="flex -space-x-2">
                        {[1, 2, 3, 4].map((i) => (
                          <div key={i} className="w-10 h-10 rounded-full bg-white/20 border-2 border-white flex items-center justify-center">
                            <Smile className="h-5 w-5 text-accent" />
                          </div>
                        ))}
                      </div>
                      <div className="text-left">
                        <div className="text-white font-semibold">50,000+ Pengguna Puas</div>
                        <div className="text-white/70 text-sm">Bergabung minggu ini</div>
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
            
            {/* Floating Testimonial Cards */}
            <div className="hidden xl:block absolute -left-10 top-1/2 -translate-y-1/2 w-64 bg-white rounded-2xl shadow-2xl p-6 transform -rotate-6 hover:rotate-0 transition-transform duration-500">
              <div className="flex items-center gap-3 mb-3">
                <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center">
                  <Smile className="h-6 w-6 text-primary" />
                </div>
                <div>
                  <div className="font-bold text-foreground">Sarah M.</div>
                  <div className="flex text-accent">
                    {[1,2,3,4,5].map(i => <Star key={i} className="h-3 w-3 fill-current" />)}
                  </div>
                </div>
              </div>
              <p className="text-sm text-muted-foreground italic">
                "Hemat banget! Setiap hari dapet makanan enak dengan harga murah!"
              </p>
            </div>
            
            <div className="hidden xl:block absolute -right-10 top-1/3 w-64 bg-white rounded-2xl shadow-2xl p-6 transform rotate-6 hover:rotate-0 transition-transform duration-500">
              <div className="flex items-center gap-3 mb-3">
                <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center">
                  <Store className="h-6 w-6 text-primary" />
                </div>
                <div>
                  <div className="font-bold text-foreground">Warung Barokah</div>
                  <div className="flex text-accent">
                    {[1,2,3,4,5].map(i => <Star key={i} className="h-3 w-3 fill-current" />)}
                  </div>
                </div>
              </div>
              <p className="text-sm text-muted-foreground italic">
                "Omset naik, food waste turun. Win-win solution!"
              </p>
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default Index;
