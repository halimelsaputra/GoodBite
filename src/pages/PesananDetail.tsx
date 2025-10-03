import { useParams, Link, useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { QRCodeSVG } from "qrcode.react";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { MapPin, ArrowLeft, CheckCircle2, Navigation, Phone, Share2, Calendar, Star } from "lucide-react";
import { toast } from "sonner";
import { OrderService } from "@/services/OrderService";
import { Order } from "@/models/Order";

const PesananDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const orderService = OrderService.getInstance();
  const [order, setOrder] = useState<Order | null>(() => {
    return orderService.getOrderById(id || "") || null;
  });
  const [showRating, setShowRating] = useState(false);
  const [rating, setRating] = useState(0);
  const [timeLeft, setTimeLeft] = useState({ hours: 0, minutes: 0 });

  useEffect(() => {
    if (!order || !order.isPending()) return;
    
    const calculateTimeLeft = () => {
      const now = new Date();
      const [startTime] = order.pickupTime.split(" - ");
      const [hours, minutes] = startTime.split(":").map(Number);
      const pickup = new Date();
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
  }, [order]);

  if (!order) {
    return (
      <div className="min-h-screen flex flex-col bg-gradient-to-b from-background to-primary/5">
        <main className="flex-1 flex items-center justify-center pt-12">
          <div className="text-center space-y-6 p-8">
            <div className="w-20 h-20 mx-auto bg-red-100 rounded-full flex items-center justify-center">
              <span className="text-4xl">❌</span>
            </div>
            <div>
              <h2 className="text-3xl font-bold mb-2">Pesanan Tidak Ditemukan</h2>
              <p className="text-muted-foreground">Pesanan yang kamu cari tidak ada di sistem</p>
            </div>
            <Link to="/pesanan">
              <Button size="lg">Kembali ke Riwayat Pesanan</Button>
            </Link>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  const handleConfirmPickup = () => {
    if (!order) return;
    
    // Use OrderService to mark order as picked
    const success = orderService.markOrderAsPicked(order.id);
    
    if (success) {
      // Update local state
      const updatedOrder = orderService.getOrderById(order.id);
      if (updatedOrder) {
        setOrder(updatedOrder);
        setShowRating(true);
        toast.success("Pesanan berhasil dikonfirmasi! 🎉");
      }
    } else {
      toast.error("Gagal mengkonfirmasi pesanan");
    }
  };

  const handleRatingSubmit = () => {
    if (rating === 0) {
      toast.error("Pilih rating terlebih dahulu");
      return;
    }
    toast.success("Terima kasih atas rating kamu! ⭐");
    setShowRating(false);
  };

  const handleShare = () => {
    if (navigator.share) {
      navigator.share({
        title: `Pesanan GoodBite - ${order.storeName}`,
        text: `Kode booking: ${order.confirmationCode}`,
      });
    } else {
      navigator.clipboard.writeText(order.confirmationCode);
      toast.success("Kode konfirmasi disalin!");
    }
  };



  const getStatusInfo = (status: "pending" | "picked" | "expired") => {
    const variants = {
      pending: { 
        label: "Menunggu Pengambilan", 
        variant: "default" as const, 
        color: "bg-primary",
        icon: "",
        message: "Segera ambil paket kamu sesuai jadwal"
      },
      picked: { 
        label: "Sudah Diambil", 
        variant: "secondary" as const, 
        color: "bg-green-500",
        icon: "",
        message: "Pesanan telah selesai"
      },
      expired: { 
        label: "Kadaluarsa", 
        variant: "destructive" as const, 
        color: "bg-gray-400",
        icon: "",
        message: "Waktu pengambilan telah lewat"
      }
    };
    return variants[status];
  };

  const statusInfo = getStatusInfo(order.status);

  // Timeline steps
  const timelineSteps = [
    { label: "Pesanan Dibuat", completed: true, time: order.getFormattedOrderTime() },
    { label: "Menunggu Pickup", completed: !order.isExpired(), time: order.pickupTime },
    { label: "Diambil", completed: order.isPicked(), time: order.isPicked() ? "Selesai" : "-" }
  ];

  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-b from-background via-primary/5 to-background">
      <main className="flex-1 pt-8 md:pt-12 pb-12">
        <div className="container max-w-5xl">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <div className="flex items-center justify-between mb-8">
              <Link to="/pesanan">
                <Button variant="ghost" size="lg" className="hover:bg-primary/10">
                  <ArrowLeft className="h-5 w-5 mr-2" />
                  Kembali
                </Button>
              </Link>
              
              <Button variant="outline" size="lg" onClick={handleShare}>
                <Share2 className="h-5 w-5 mr-2" />
                Bagikan
              </Button>
            </div>

            {/* Status Banner */}
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.5, delay: 0.1 }}
            >
              <Card className={`border-none shadow-2xl overflow-hidden mb-8 ${statusInfo.color}`}>
                <CardContent className="p-8 text-white text-center">
                  <Badge className="bg-white/20 text-white border-none mb-3 text-lg px-6 py-2">
                    {statusInfo.label}
                  </Badge>
                  <p className="text-white/90 text-lg">{statusInfo.message}</p>
                  {order.isPending() && timeLeft.hours < 24 && (
                    <div className="mt-6 pt-6 border-t border-white/20">
                      <p className="text-sm text-white/80 mb-2">Waktu pickup dalam:</p>
                      <p className="text-4xl font-bold">
                        {timeLeft.hours}j {timeLeft.minutes}m
                      </p>
                    </div>
                  )}
                </CardContent>
              </Card>
            </motion.div>

            <div className="grid lg:grid-cols-2 gap-8">
              {/* Left Column - QR Code & Info */}
              <div className="space-y-6">
                {/* QR Code Card */}
                <motion.div
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.5, delay: 0.2 }}
                >
                  <Card className="border-none shadow-2xl overflow-hidden">
                    <div className="bg-gradient-to-br from-primary to-primary/80 p-8 text-white text-center">
                      <h2 className="text-2xl font-bold mb-2">Kode Booking</h2>
                      <p className="text-5xl font-mono font-bold tracking-wider">
                        {order.confirmationCode}
                      </p>
                    </div>
                    
                    <CardContent className="p-8 bg-gradient-to-br from-white to-primary/5">
                      <div className="flex justify-center mb-6">
                        <div className="bg-white p-6 rounded-3xl shadow-xl">
                          <QRCodeSVG
                            id="qr-code-svg"
                            value={order.confirmationCode}
                            size={280}
                            level="H"
                            includeMargin
                          />
                        </div>
                      </div>


                    </CardContent>
                  </Card>
                </motion.div>
              </div>

              {/* Right Column - Order Details */}
              <div className="space-y-6">
                {/* Order Info Card */}
                <motion.div
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.5, delay: 0.2 }}
                >
                  <Card className="border-none shadow-lg">
                    <CardContent className="p-8 space-y-6">
                      <div>
                        <h2 className="text-3xl font-heading font-bold mb-4">{order.storeName}</h2>
                        
                        <div className="space-y-4">
                          <div className="flex items-start gap-3 p-4 bg-primary/5 rounded-xl">
                            <MapPin className="h-5 w-5 text-primary mt-1 flex-shrink-0" />
                            <div className="flex-1">
                              <p className="font-semibold mb-1">Lokasi Toko</p>
                              <p className="text-muted-foreground">{order.location}</p>
                            </div>
                          </div>

                          <div className="flex items-start gap-3 p-4 bg-primary/5 rounded-xl">
                            <div className="flex-1">
                              <p className="font-semibold mb-1">Waktu Pengambilan</p>
                              <p className="text-muted-foreground">{order.pickupTime}</p>
                            </div>
                          </div>

                          <div className="flex items-start gap-3 p-4 bg-primary/5 rounded-xl">
                            <Calendar className="h-5 w-5 text-primary mt-1 flex-shrink-0" />
                            <div className="flex-1">
                              <p className="font-semibold mb-1">Tanggal Pesan</p>
                              <p className="text-muted-foreground">
                                {new Date(order.orderTime).toLocaleString('id-ID', {
                                  weekday: 'long',
                                  year: 'numeric',
                                  month: 'long',
                                  day: 'numeric',
                                  hour: '2-digit',
                                  minute: '2-digit'
                                })}
                              </p>
                            </div>
                          </div>
                        </div>
                      </div>

                      <Separator />

                      {/* Payment Summary */}
                      <div className="space-y-4">
                        <h3 className="font-bold text-lg">Rincian Pembayaran</h3>
                        <div className="space-y-3 text-sm">
                          <div className="flex justify-between">
                            <span className="text-muted-foreground">Harga Paket</span>
                            <span className="font-medium">{order.getFormattedPrice()}</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-muted-foreground">Metode Pembayaran</span>
                            <span className="font-medium">Bayar di Tempat</span>
                          </div>
                        </div>
                        
                        <Separator />
                        
                        <div className="flex justify-between items-center">
                          <span className="font-bold text-lg">Total</span>
                          <span className="text-3xl font-bold text-primary">
                            {order.getFormattedPrice()}
                          </span>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>

                {/* Timeline Card */}
                <motion.div
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.5, delay: 0.3 }}
                >
                  <Card className="border-none shadow-lg">
                    <CardContent className="p-8">
                      <h3 className="font-bold text-lg mb-6">Timeline Pesanan</h3>
                      <div className="space-y-6">
                        {timelineSteps.map((step, index) => (
                          <div key={index} className="flex gap-4">
                            <div className="flex flex-col items-center">
                              <div className={`w-10 h-10 rounded-full flex items-center justify-center font-bold ${
                                step.completed ? 'bg-primary text-white' : 'bg-gray-200 text-gray-400'
                              }`}>
                                {step.completed ? <CheckCircle2 className="h-5 w-5" /> : index + 1}
                              </div>
                              {index < timelineSteps.length - 1 && (
                                <div className={`w-0.5 h-12 ${
                                  step.completed ? 'bg-primary' : 'bg-gray-200'
                                }`} />
                              )}
                            </div>
                            <div className="flex-1 pb-8">
                              <p className={`font-semibold mb-1 ${
                                step.completed ? 'text-foreground' : 'text-muted-foreground'
                              }`}>
                                {step.label}
                              </p>
                              <p className="text-sm text-muted-foreground">{step.time}</p>
                            </div>
                          </div>
                        ))}
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>

                {/* Action Card */}
                {order.isPending() && (
                  <motion.div
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.5, delay: 0.4 }}
                  >
                    <Card className="border-2 border-primary/20 bg-gradient-to-br from-primary/5 to-accent/5">
                      <CardContent className="p-8">
                        <div className="text-center space-y-4">
                          <div className="w-16 h-16 mx-auto bg-primary/10 rounded-full flex items-center justify-center">
                            <CheckCircle2 className="h-8 w-8 text-primary" />
                          </div>
                          <div>
                            <h4 className="font-bold text-xl mb-2">Sudah Mengambil Paket?</h4>
                            <p className="text-muted-foreground">
                              Konfirmasi setelah kamu berhasil mengambil paket dari toko
                            </p>
                          </div>
                          <Button
                            size="lg"
                            className="w-full"
                            onClick={handleConfirmPickup}
                          >
                            <CheckCircle2 className="h-5 w-5 mr-2" />
                            Konfirmasi Sudah Diambil
                          </Button>
                        </div>
                      </CardContent>
                    </Card>
                  </motion.div>
                )}

                {/* Rating Modal/Card */}
                {showRating && (
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5 }}
                  >
                    <Card className="border-2 border-accent">
                      <CardContent className="p-8 text-center space-y-6">
                        <div>
                          <h3 className="font-bold text-2xl mb-2">Beri Rating</h3>
                          <p className="text-muted-foreground">
                            Bagaimana pengalaman kamu dengan {order.storeName}?
                          </p>
                        </div>

                        <div className="flex justify-center gap-2">
                          {[1, 2, 3, 4, 5].map((star) => (
                            <button
                              key={star}
                              onClick={() => setRating(star)}
                              className="transition-transform hover:scale-110"
                            >
                              <Star
                                className={`h-12 w-12 ${
                                  star <= rating
                                    ? 'fill-accent text-accent'
                                    : 'text-gray-300'
                                }`}
                              />
                            </button>
                          ))}
                        </div>

                        <Button
                          size="lg"
                          className="w-full"
                          onClick={handleRatingSubmit}
                          disabled={rating === 0}
                        >
                          Kirim Rating
                        </Button>
                      </CardContent>
                    </Card>
                  </motion.div>
                )}

                {/* Success Card */}
                {order.isPicked() && !showRating && (
                  <motion.div
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 0.5 }}
                  >
                    <Card className="border-none bg-gradient-to-br from-green-50 to-emerald-100">
                      <CardContent className="p-8 text-center space-y-4">
                        <div className="w-20 h-20 mx-auto bg-green-500 rounded-full flex items-center justify-center">
                          <CheckCircle2 className="h-10 w-10 text-white" />
                        </div>
                        <div>
                          <h3 className="font-bold text-2xl text-green-900 mb-2">Pesanan Selesai!</h3>
                          <p className="text-green-700">
                            Terima kasih telah menggunakan GoodBite
                          </p>
                        </div>
                      </CardContent>
                    </Card>
                  </motion.div>
                )}
              </div>
            </div>
          </motion.div>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default PesananDetail;
