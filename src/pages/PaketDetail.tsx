import { useParams, Link, useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { MapPin, Clock, Store, ArrowLeft, Star, Heart, Share2, ChevronLeft, ChevronRight, TrendingUp, Flame, Award } from "lucide-react";
import { packages } from "@/data/packages";
import { toast } from "sonner";

const PaketDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const pkg = packages.find(p => p.id === id);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [isFavorite, setIsFavorite] = useState(false);
  const [timeLeft, setTimeLeft] = useState({ hours: 0, minutes: 0 });

  // Mock data for reviews
  const reviews = [
    { id: 1, name: "Andi S.", rating: 5, date: "2 hari lalu", comment: "Paketnya bagus! Dapat roti dan kue yang masih fresh", avatar: "A" },
    { id: 2, name: "Budi P.", rating: 5, date: "5 hari lalu", comment: "Worth it banget, hemat banyak!", avatar: "B" },
    { id: 3, name: "Citra M.", rating: 4, date: "1 minggu lalu", comment: "Lumayan banyak isinya, recommended", avatar: "C" }
  ];

  // Mock images (in real app, this would come from pkg.images array)
  const images = [pkg?.image || "", pkg?.image || "", pkg?.image || ""];

  useEffect(() => {
    // Countdown timer untuk pickup time
    const calculateTimeLeft = () => {
      const now = new Date();
      const pickup = new Date();
      const [startTime] = pkg?.pickupTime.split(" - ") || ["18:00"];
      const [hours, minutes] = startTime.split(":").map(Number);
      pickup.setHours(hours, minutes, 0, 0);
      
      if (pickup < now) {
        pickup.setDate(pickup.getDate() + 1);
      }
      
      const diff = pickup.getTime() - now.getTime();
      const hoursLeft = Math.floor(diff / (1000 * 60 * 60));
      const minutesLeft = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
      
      setTimeLeft({ hours: hoursLeft, minutes: minutesLeft });
    };

    calculateTimeLeft();
    const timer = setInterval(calculateTimeLeft, 60000);
    return () => clearInterval(timer);
  }, [pkg]);

  if (!pkg) {
    return (
      <div className="min-h-screen flex flex-col">
        <main className="flex-1 flex items-center justify-center pt-12">
          <div className="text-center space-y-4">
            <h2 className="text-2xl font-bold">Paket tidak ditemukan</h2>
            <Link to="/jelajahi">
              <Button>Kembali ke Jelajahi</Button>
            </Link>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  const discount = Math.round(((pkg.originalValue - pkg.price) / pkg.originalValue) * 100);
  const stockPercentage = (pkg.available / 10) * 100; // Assuming max 10 packages
  const avgRating = 4.7;

  const handleOrder = () => {
    const user = localStorage.getItem("goodbite_user");
    if (!user) {
      toast.error("Silakan login terlebih dahulu");
      navigate("/login");
      return;
    }
    navigate(`/checkout/${pkg.id}`);
  };

  const handlePrevImage = () => {
    setCurrentImageIndex((prev) => (prev === 0 ? images.length - 1 : prev - 1));
  };

  const handleNextImage = () => {
    setCurrentImageIndex((prev) => (prev === images.length - 1 ? 0 : prev + 1));
  };

  const toggleFavorite = () => {
    setIsFavorite(!isFavorite);
    toast.success(isFavorite ? "Dihapus dari favorit" : "Ditambahkan ke favorit");
  };

  const handleShare = () => {
    if (navigator.share) {
      navigator.share({
        title: pkg.storeName,
        text: `Cek paket surprise dari ${pkg.storeName} di GoodBite!`,
        url: window.location.href,
      });
    } else {
      navigator.clipboard.writeText(window.location.href);
      toast.success("Link disalin ke clipboard!");
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-b from-background to-primary/5">
      <main className="flex-1 pt-8 md:pt-12 pb-12">
        <div className="container max-w-7xl">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <Link to="/jelajahi">
              <Button variant="ghost" className="mb-6 hover:bg-primary/10">
                <ArrowLeft className="h-4 w-4 mr-2" />
                Kembali
              </Button>
            </Link>

            <div className="grid lg:grid-cols-3 gap-8">
              {/* Left Column - Image Gallery & Info */}
              <div className="lg:col-span-2 space-y-6">
                {/* Image Gallery */}
                <motion.div
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.5, delay: 0.1 }}
                  className="relative group"
                >
                  <div className="aspect-[4/3] rounded-3xl overflow-hidden bg-muted shadow-2xl">
                    <img
                      src={images[currentImageIndex]}
                      alt={pkg.storeName}
                      className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                    />
                    
                    {/* Image Navigation */}
                    {images.length > 1 && (
                      <>
                        <button
                          onClick={handlePrevImage}
                          className="absolute left-4 top-1/2 -translate-y-1/2 bg-white/90 backdrop-blur-sm hover:bg-white rounded-full p-3 shadow-lg transition-all opacity-0 group-hover:opacity-100"
                        >
                          <ChevronLeft className="h-6 w-6 text-primary" />
                        </button>
                        <button
                          onClick={handleNextImage}
                          className="absolute right-4 top-1/2 -translate-y-1/2 bg-white/90 backdrop-blur-sm hover:bg-white rounded-full p-3 shadow-lg transition-all opacity-0 group-hover:opacity-100"
                        >
                          <ChevronRight className="h-6 w-6 text-primary" />
                        </button>
                      </>
                    )}

                    {/* Action Buttons Overlay */}
                    <div className="absolute top-4 right-4 flex gap-2">
                      <Button
                        size="icon"
                        variant="secondary"
                        className="rounded-full backdrop-blur-sm bg-white/90 hover:bg-white shadow-lg"
                        onClick={toggleFavorite}
                      >
                        <Heart className={`h-5 w-5 ${isFavorite ? 'fill-red-500 text-red-500' : ''}`} />
                      </Button>
                      <Button
                        size="icon"
                        variant="secondary"
                        className="rounded-full backdrop-blur-sm bg-white/90 hover:bg-white shadow-lg"
                        onClick={handleShare}
                      >
                        <Share2 className="h-5 w-5" />
                      </Button>
                    </div>

                    {/* Badges Overlay */}
                    <div className="absolute top-4 left-4 flex flex-wrap gap-2">
                      <Badge className="bg-accent text-primary font-bold px-4 py-2 text-base shadow-lg">
                        <TrendingUp className="h-4 w-4 mr-1" />
                        Hemat {discount}%
                      </Badge>
                      {pkg.available <= 3 && pkg.available > 0 && (
                        <Badge className="bg-red-500 text-white font-bold px-4 py-2 text-base shadow-lg animate-pulse">
                          <Flame className="h-4 w-4 mr-1" />
                          Hampir Habis!
                        </Badge>
                      )}
                    </div>

                    {/* Image Dots */}
                    {images.length > 1 && (
                      <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-2">
                        {images.map((_, index) => (
                          <button
                            key={index}
                            onClick={() => setCurrentImageIndex(index)}
                            className={`h-2 rounded-full transition-all ${
                              index === currentImageIndex ? 'w-8 bg-white' : 'w-2 bg-white/50'
                            }`}
                          />
                        ))}
                      </div>
                    )}
                  </div>
                </motion.div>

                {/* Store Info Card */}
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: 0.2 }}
                >
                  <Card className="border-none shadow-lg">
                    <CardContent className="p-6 space-y-6">
                      <div>
                        <div className="flex items-start justify-between mb-3">
                          <div>
                            <h1 className="text-3xl md:text-4xl font-heading font-bold mb-2">{pkg.storeName}</h1>
                            <div className="flex items-center gap-3 flex-wrap">
                              <Badge variant="secondary" className="text-sm">
                                <Store className="h-3 w-3 mr-1" />
                                {pkg.category}
                              </Badge>
                              <div className="flex items-center gap-1 text-sm">
                                <Star className="h-4 w-4 fill-accent text-accent" />
                                <span className="font-semibold">{avgRating}</span>
                                <span className="text-muted-foreground">({reviews.length} ulasan)</span>
                              </div>
                            </div>
                          </div>
                        </div>

                        <div className="flex items-start gap-2 text-muted-foreground">
                          <MapPin className="h-5 w-5 mt-0.5 flex-shrink-0" />
                          <span>{pkg.location}</span>
                        </div>
                      </div>

                      <div className="pt-4 border-t space-y-4">
                        <div>
                          <h3 className="font-semibold mb-3 flex items-center gap-2">
                            <Award className="h-5 w-5 text-primary" />
                            Tentang Paket Ini
                          </h3>
                          <p className="text-muted-foreground leading-relaxed">{pkg.description}</p>
                        </div>

                        <div className="bg-primary/5 rounded-2xl p-4 space-y-2">
                          <p className="font-semibold text-sm"> Yang Mungkin Kamu Dapat:</p>
                          <ul className="text-sm text-muted-foreground space-y-1 ml-4">
                            <li>• Roti dan pastry berbagai jenis</li>
                            <li>• Kue dan dessert premium</li>
                            <li>• Sandwich atau snack</li>
                          </ul>
                          <p className="text-xs text-muted-foreground italic mt-2">
                            *Isi paket bervariasi tergantung ketersediaan toko
                          </p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>

                {/* Reviews Section */}
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: 0.3 }}
                >
                  <Card className="border-none shadow-lg">
                    <CardContent className="p-6">
                      <h2 className="text-2xl font-heading font-bold mb-6">Ulasan Pelanggan</h2>
                      
                      {/* Rating Summary */}
                      <div className="flex items-center gap-8 pb-6 border-b mb-6">
                        <div className="text-center">
                          <div className="text-5xl font-bold text-primary mb-2">{avgRating}</div>
                          <div className="flex items-center gap-1 mb-1">
                            {[...Array(5)].map((_, i) => (
                              <Star key={i} className="h-4 w-4 fill-accent text-accent" />
                            ))}
                          </div>
                          <p className="text-sm text-muted-foreground">{reviews.length} ulasan</p>
                        </div>
                        
                        <div className="flex-1 space-y-2">
                          {[5, 4, 3, 2, 1].map((stars) => (
                            <div key={stars} className="flex items-center gap-3">
                              <span className="text-sm w-8">{stars}★</span>
                              <Progress value={stars === 5 ? 80 : stars === 4 ? 20 : 0} className="h-2" />
                              <span className="text-sm text-muted-foreground w-8">{stars === 5 ? reviews.length - 1 : stars === 4 ? 1 : 0}</span>
                            </div>
                          ))}
                        </div>
                      </div>

                      {/* Reviews List */}
                      <div className="space-y-4">
                        {reviews.map((review) => (
                          <div key={review.id} className="pb-4 border-b last:border-0">
                            <div className="flex items-start gap-4">
                              <div className="w-10 h-10 rounded-full bg-primary text-white flex items-center justify-center font-semibold flex-shrink-0">
                                {review.avatar}
                              </div>
                              <div className="flex-1">
                                <div className="flex items-center justify-between mb-1">
                                  <h4 className="font-semibold">{review.name}</h4>
                                  <span className="text-sm text-muted-foreground">{review.date}</span>
                                </div>
                                <div className="flex items-center gap-1 mb-2">
                                  {[...Array(review.rating)].map((_, i) => (
                                    <Star key={i} className="h-3 w-3 fill-accent text-accent" />
                                  ))}
                                </div>
                                <p className="text-sm text-muted-foreground">{review.comment}</p>
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>
              </div>

              {/* Right Column - Sticky Booking Card */}
              <div className="lg:col-span-1">
                <motion.div
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.5, delay: 0.2 }}
                  className="lg:sticky lg:top-28 space-y-4"
                >
                  {/* Countdown Timer Card */}
                  {timeLeft.hours < 24 && (
                    <Card className="border-2 border-accent bg-gradient-to-br from-accent/10 to-accent/5">
                      <CardContent className="p-6 text-center">
                        <p className="text-sm font-medium mb-2">⏰ Ambil Hari Ini!</p>
                        <div className="text-3xl font-bold text-primary">
                          {timeLeft.hours}j {timeLeft.minutes}m
                        </div>
                        <p className="text-xs text-muted-foreground mt-1">menuju waktu pickup</p>
                      </CardContent>
                    </Card>
                  )}

                  {/* Price Card */}
                  <Card className="border-none shadow-2xl overflow-hidden">
                    <div className="bg-gradient-to-br from-primary to-primary/80 p-6 text-white">
                      <p className="text-sm opacity-90 mb-2">Harga Paket Surprise</p>
                      <div className="flex items-baseline gap-3">
                        <span className="text-4xl font-bold">
                          Rp {pkg.price.toLocaleString('id-ID')}
                        </span>
                        <Badge className="bg-accent text-primary font-bold">
                          -{discount}%
                        </Badge>
                      </div>
                      <p className="text-sm opacity-75 line-through mt-1">
                        Nilai normal: Rp {pkg.originalValue.toLocaleString('id-ID')}
                      </p>
                      <div className="mt-4 pt-4 border-t border-white/20">
                        <p className="text-sm font-semibold mb-1"> Kamu Hemat</p>
                        <p className="text-2xl font-bold">
                          Rp {(pkg.originalValue - pkg.price).toLocaleString('id-ID')}
                        </p>
                      </div>
                    </div>

                    <CardContent className="p-6 space-y-6">
                      {/* Pickup Details */}
                      <div className="space-y-4">
                        <div className="flex items-start gap-3 p-4 bg-primary/5 rounded-xl">
                          <Clock className="h-5 w-5 text-primary mt-0.5 flex-shrink-0" />
                          <div className="flex-1">
                            <p className="font-semibold mb-1">Waktu Pengambilan</p>
                            <p className="text-sm text-muted-foreground">{pkg.pickupTime}</p>
                          </div>
                        </div>

                        {/* Stock Indicator */}
                        <div className="space-y-2">
                          <div className="flex items-center justify-between text-sm">
                            <span className="font-medium">Stok Tersedia</span>
                            <span className={`font-bold ${pkg.available <= 3 ? 'text-red-500' : 'text-primary'}`}>
                              {pkg.available} paket
                            </span>
                          </div>
                          <Progress value={stockPercentage} className="h-2" />
                          {pkg.available <= 3 && pkg.available > 0 && (
                            <p className="text-xs text-red-500 font-medium">
                            </p>
                          )}
                        </div>
                      </div>

                      {/* Order Button */}
                      <Button
                        size="lg"
                        className="w-full py-6 text-lg font-bold shadow-lg hover:shadow-xl hover:scale-105 transition-all"
                        onClick={handleOrder}
                        disabled={pkg.available === 0}
                      >
                        {pkg.available === 0 ? "Habis" : "Pesan Sekarang"}
                      </Button>
                    </CardContent>
                  </Card>
                </motion.div>
              </div>
            </div>
          </motion.div>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default PaketDetail;
