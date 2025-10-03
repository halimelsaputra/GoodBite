import { useState, useMemo, useEffect } from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { QRCodeSVG } from "qrcode.react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { MapPin, Clock, ShoppingBag, QrCode, Calendar, TrendingUp } from "lucide-react";
import { OrderService } from "@/services/OrderService";
import { Order } from "@/models/Order";

const Pesanan = () => {
  const [activeTab, setActiveTab] = useState("semua");
  const [timeLeft, setTimeLeft] = useState<{[key: string]: {hours: number, minutes: number}}>({});
  const orderService = OrderService.getInstance();
  
  const orders: Order[] = useMemo(() => {
    return orderService.getAllOrders();
  }, [orderService]);

  useEffect(() => {
    const calculateTimers = () => {
      const timers: {[key: string]: {hours: number, minutes: number}} = {};
      orders.forEach(order => {
        if (order.isPending()) {
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
          
          timers[order.id] = { hours: hoursLeft, minutes: minutesLeft };
        }
      });
      setTimeLeft(timers);
    };

    calculateTimers();
    const interval = setInterval(calculateTimers, 60000);
    return () => clearInterval(interval);
  }, [orders]);

  const filteredOrders = useMemo(() => {
    if (activeTab === "semua") return orders;
    return orderService.getOrdersByStatus(activeTab as "pending" | "picked" | "expired");
  }, [orders, activeTab, orderService]);

  const getStatusBadge = (status: "pending" | "picked" | "expired") => {
    const variants = {
      pending: { label: "Aktif", variant: "default" as const, color: "bg-primary" },
      picked: { label: "Selesai", variant: "secondary" as const, color: "bg-green-500" },
      expired: { label: "Kadaluarsa", variant: "destructive" as const, color: "bg-gray-400" }
    };
    return variants[status];
  };

  const stats = {
    total: orderService.getTotalOrdersCount(),
    pending: orderService.getPendingOrders().length,
    picked: orderService.getPickedOrders().length,
    totalSaved: orders.reduce((sum, order) => sum + order.price * 0.7, 0)
  };

  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-b from-background to-primary/5">
      <Header />
      
      <main className="flex-1 pt-24 md:pt-28 pb-12">
        <div className="container max-w-6xl">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <div className="flex items-center justify-between mb-8">
              <div>
                <h1 className="text-3xl md:text-4xl font-heading font-bold mb-2">Pesanan Saya</h1>
                <p className="text-muted-foreground">Kelola dan pantau semua pesanan kamu</p>
              </div>
            </div>

            {/* Stats Cards */}
            {orders.length > 0 && (
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
                <Card className="border-none shadow-lg bg-gradient-to-br from-primary/10 to-primary/5">
                  <CardContent className="p-6">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm text-muted-foreground mb-1">Total Pesanan</p>
                        <p className="text-3xl font-bold text-primary">{stats.total}</p>
                      </div>
                      <ShoppingBag className="h-10 w-10 text-primary opacity-20" />
                    </div>
                  </CardContent>
                </Card>

                <Card className="border-none shadow-lg bg-gradient-to-br from-blue-50 to-blue-100/50">
                  <CardContent className="p-6">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm text-muted-foreground mb-1">Aktif</p>
                        <p className="text-3xl font-bold text-blue-600">{stats.pending}</p>
                      </div>
                      <Clock className="h-10 w-10 text-blue-600 opacity-20" />
                    </div>
                  </CardContent>
                </Card>

                <Card className="border-none shadow-lg bg-gradient-to-br from-green-50 to-emerald-100/50">
                  <CardContent className="p-6">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm text-muted-foreground mb-1">Selesai</p>
                        <p className="text-3xl font-bold text-green-600">{stats.picked}</p>
                      </div>
                      <Badge className="h-10 w-10 bg-green-600 opacity-20 rounded-full" />
                    </div>
                  </CardContent>
                </Card>

                <Card className="border-none shadow-lg bg-gradient-to-br from-accent/20 to-accent/10">
                  <CardContent className="p-6">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm text-muted-foreground mb-1">Hemat</p>
                        <p className="text-2xl font-bold text-accent">
                          Rp {Math.round(stats.totalSaved).toLocaleString('id-ID')}k
                        </p>
                      </div>
                      <TrendingUp className="h-10 w-10 text-accent opacity-20" />
                    </div>
                  </CardContent>
                </Card>
              </div>
            )}

            <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
              <TabsList className="grid w-full grid-cols-4 h-12">
                <TabsTrigger value="semua" className="text-base">
                  Semua {orders.length > 0 && `(${orders.length})`}
                </TabsTrigger>
                <TabsTrigger value="pending" className="text-base">
                  Aktif {stats.pending > 0 && `(${stats.pending})`}
                </TabsTrigger>
                <TabsTrigger value="picked" className="text-base">
                  Selesai {stats.picked > 0 && `(${stats.picked})`}
                </TabsTrigger>
                <TabsTrigger value="expired" className="text-base">
                  Kadaluarsa
                </TabsTrigger>
              </TabsList>

              <TabsContent value={activeTab} className="space-y-4">
                {filteredOrders.length > 0 ? (
                  <div className="grid gap-4">
                    {filteredOrders.map((order, index) => {
                      const statusInfo = getStatusBadge(order.status);
                      const timer = timeLeft[order.id];
                      
                      return (
                        <motion.div
                          key={order.id}
                          initial={{ opacity: 0, y: 20 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ duration: 0.3, delay: index * 0.1 }}
                        >
                          <Card className="border-none shadow-lg hover:shadow-xl transition-all duration-300 overflow-hidden">
                            <CardContent className="p-0">
                              <div className="grid md:grid-cols-12 gap-6">
                                {/* Left Section - Order Info */}
                                <div className="md:col-span-7 p-6 space-y-4">
                                  <div className="flex items-start justify-between">
                                    <div className="flex-1">
                                      <div className="flex items-center gap-3 mb-3">
                                        <h3 className="font-bold text-xl">{order.storeName}</h3>
                                        <Badge className={statusInfo.color + " text-white"}>
                                          {statusInfo.label}
                                        </Badge>
                                      </div>
                                      
                                      <div className="space-y-2 text-sm">
                                        <div className="flex items-start gap-2 text-muted-foreground">
                                          <MapPin className="h-4 w-4 mt-0.5 flex-shrink-0" />
                                          <span>{order.location}</span>
                                        </div>
                                        <div className="flex items-center gap-2">
                                          <Clock className="h-4 w-4 text-primary" />
                                          <span className="font-medium">Ambil: {order.pickupTime}</span>
                                        </div>
                                        <div className="flex items-center gap-2 text-muted-foreground">
                                          <Calendar className="h-4 w-4" />
                                          <span>Dipesan: {new Date(order.orderTime).toLocaleDateString('id-ID', {
                                            day: 'numeric',
                                            month: 'short',
                                            year: 'numeric',
                                            hour: '2-digit',
                                            minute: '2-digit'
                                          })}</span>
                                        </div>
                                      </div>

                                      {/* Countdown Timer for Pending Orders */}
                                      {order.isPending() && timer && timer.hours < 24 && (
                                        <div className="mt-4 p-4 bg-accent/10 rounded-xl border-2 border-accent/20">
                                          <div className="flex items-center gap-3">
                                            <Clock className="h-5 w-5 text-accent" />
                                            <div>
                                              <p className="text-xs text-muted-foreground font-medium">Waktu pickup</p>
                                              <p className="text-2xl font-bold text-accent">
                                                {timer.hours}j {timer.minutes}m lagi
                                              </p>
                                            </div>
                                          </div>
                                        </div>
                                      )}
                                    </div>
                                  </div>

                                  {/* Total Price */}
                                  <div className="flex items-center justify-between pt-4 border-t">
                                    <div>
                                      <p className="text-sm text-muted-foreground mb-1">Total Pembayaran</p>
                                      <p className="text-2xl font-bold text-primary">
                                        {order.getFormattedPrice()}
                                      </p>
                                    </div>
                                  </div>
                                </div>

                                {/* Right Section - QR & Actions */}
                                <div className="md:col-span-5 bg-gradient-to-br from-primary/5 to-primary/10 p-6 flex flex-col justify-between">
                                  {/* QR Code Preview */}
                                  <div className="space-y-4">
                                    <div className="flex items-center gap-2 text-sm font-medium text-primary">
                                      <QrCode className="h-4 w-4" />
                                      <span>Kode Booking</span>
                                    </div>
                                    
                                    <div className="bg-white p-4 rounded-xl inline-block">
                                      <QRCodeSVG
                                        value={order.confirmationCode}
                                        size={120}
                                        level="H"
                                      />
                                    </div>

                                    <div className="bg-white/50 backdrop-blur-sm rounded-xl p-3">
                                      <p className="text-xs text-muted-foreground mb-1">Kode Konfirmasi</p>
                                      <p className="text-2xl font-mono font-bold text-primary">
                                        {order.confirmationCode}
                                      </p>
                                    </div>
                                  </div>

                                  {/* Action Buttons */}
                                  <div className="space-y-2 mt-4">
                                    <Link to={`/pesanan/${order.id}`} className="block">
                                      <Button className="w-full" size="lg">
                                        Lihat Detail
                                      </Button>
                                    </Link>
                                  </div>
                                </div>
                              </div>
                            </CardContent>
                          </Card>
                        </motion.div>
                      );
                    })}
                  </div>
                ) : (
                  <motion.div
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 0.5 }}
                  >
                    <Card className="border-none shadow-lg">
                      <CardContent className="p-16 text-center space-y-6">
                        <div className="w-24 h-24 mx-auto bg-primary/10 rounded-full flex items-center justify-center">
                          <ShoppingBag className="h-12 w-12 text-primary" />
                        </div>
                        <div>
                          <h3 className="font-bold text-2xl mb-2">
                            {activeTab === "semua" ? "Belum Ada Pesanan" : `Tidak Ada Pesanan ${getStatusBadge(activeTab as Order["status"]).label}`}
                          </h3>
                          <p className="text-muted-foreground text-lg">
                            Mulai jelajahi dan pesan paket kejutan favorit kamu!
                          </p>
                        </div>
                        <Link to="/jelajahi">
                          <Button size="lg" className="px-8">
                            Jelajahi Paket Sekarang
                          </Button>
                        </Link>
                      </CardContent>
                    </Card>
                  </motion.div>
                )}
              </TabsContent>
            </Tabs>
          </motion.div>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default Pesanan;
