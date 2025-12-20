import { useEffect, useMemo, useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { QRCodeSVG } from "qrcode.react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import PackageCard from "@/components/PackageCard";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Calendar, Clock, MapPin, QrCode, Search, ShoppingBag, TrendingUp } from "lucide-react";
import { packageService } from "@/services/PackageService";
import { OrderService } from "@/services/OrderService";
import { Order } from "@/models/Order";
import { toast } from "sonner";
import { BackgroundRippleEffect } from "@/components/BackgroundRippleEffect";

const JelajahiSection = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [packages, setPackages] = useState<any[]>([]);

  useEffect(() => {
    let isMounted = true;

    const loadPackages = async () => {
      try {
        const allPackages = await packageService.getAllPackages();
        const filled = allPackages.filter(
          (pkg: any) =>
            pkg.category &&
            pkg.location &&
            pkg.pickupTime &&
            pkg.description &&
            Number(pkg.price) > 0 &&
            Number(pkg.originalValue) > 0,
        );
        if (isMounted) {
          setPackages(filled);
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

  const filteredPackages = useMemo(() => {
    let filtered = [...packages];
    if (searchQuery) {
      filtered = filtered.filter(
        (pkg) =>
          pkg.storeName.toLowerCase().includes(searchQuery.toLowerCase()) ||
          pkg.location.toLowerCase().includes(searchQuery.toLowerCase()),
      );
    }
    return filtered;
  }, [searchQuery, packages]);

  return (
    <div className="container space-y-6">
      <div className="text-center text-white">
        <h1 className="font-heading font-extrabold leading-none tracking-tight text-[42px] md:text-[78px] lg:text-[96px]">
          Jelajahi <span className="text-white/80">Surprise</span> Bag
        </h1>
      </div>

      <div className="max-w-5xl mx-auto rounded-3xl shadow-2xl p-4 md:p-6 border border-white/15 space-y-6 bg-white/90 backdrop-blur">
        <div className="relative">
          <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 h-5 w-5 text-primary" />
          <Input
            placeholder="Cari toko atau lokasi..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-12 h-10 rounded-full border-2 focus:border-primary text-sm"
          />
        </div>

        {filteredPackages.length > 0 ? (
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {filteredPackages.map((pkg) => (
              <div key={pkg.id} className="scale-[0.92] origin-top">
                <PackageCard package={pkg} />
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-16">
            <div className="inline-flex p-6 rounded-full bg-muted/50 mb-6">
              <Search className="h-16 w-16 text-muted-foreground" />
            </div>
            <h3 className="text-2xl font-bold text-foreground mb-2">Tidak Ada Hasil</h3>
            <p className="text-lg text-muted-foreground">
              Tidak ada paket yang ditemukan dengan filter tersebut
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

const PesananSection = () => {
  const navigate = useNavigate();
  const [timeLeft, setTimeLeft] = useState<{ [key: string]: { hours: number; minutes: number } }>({});
  const [orders, setOrders] = useState<Order[]>([]);
  const orderService = OrderService.getInstance();

  useEffect(() => {
    const sellerUser = localStorage.getItem("goodbite_seller");
    if (sellerUser) {
      toast.error("Anda sudah login sebagai penjual. Silakan logout terlebih dahulu untuk akses pesanan pembeli.");
      navigate("/dashboard-penjual", { replace: true });
      return;
    }

    const userData = localStorage.getItem("goodbite_user");
    if (!userData) {
      navigate("/login", { replace: true });
      return;
    }

    try {
      const user = JSON.parse(userData);
      if (user.phone) {
        orderService.switchUser(user.phone);
      }
    } catch (error) {
      console.error("Error parsing user data:", error);
      navigate("/login", { replace: true });
    }
  }, [navigate, orderService]);

  useEffect(() => {
    const loadOrders = () => {
      orderService.refreshOrders();
      const pendingOrders = orderService.getPendingOrders();
      setOrders(pendingOrders);
    };

    loadOrders();

    const handleStorageChange = (e: StorageEvent) => {
      if (e.key && e.key.startsWith("goodbite_orders_")) {
        loadOrders();
      }
    };

    window.addEventListener("storage", handleStorageChange);
    return () => {
      window.removeEventListener("storage", handleStorageChange);
    };
  }, [orderService]);

  useEffect(() => {
    const calculateTimers = () => {
      const timers: { [key: string]: { hours: number; minutes: number } } = {};
      orders.forEach((order) => {
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

  const stats = {
    total: orderService.getPendingOrders().length,
    pending: orderService.getPendingOrders().length,
    totalSaved: orders.reduce((sum, order) => {
      const originalValue = (order as any).originalValue;
      if (!originalValue || originalValue <= 0) return sum;
      return sum + (originalValue - order.price);
    }, 0),
  };

  return (
    <div className="container space-y-6">
      <div className="text-center text-white">
        <h1 className="font-heading font-extrabold leading-none tracking-tight text-[42px] md:text-[78px] lg:text-[96px]">
          Pesanan <span className="text-white/80">Berlangsung</span>
        </h1>
      </div>

      <div className="max-w-5xl mx-auto rounded-3xl shadow-2xl border border-white/15 bg-white/90 backdrop-blur p-6 md:p-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <div className="flex items-center justify-between mb-8">
            <div>
              <h1 className="text-3xl md:text-4xl font-heading font-bold mb-2">Pesanan Berlangsung</h1>
              <p className="text-muted-foreground">Pantau pesanan yang sedang aktif</p>
            </div>
            <Link to="/riwayat-pesanan">
              <Button variant="outline" className="rounded-full">
                Lihat Riwayat
              </Button>
            </Link>
          </div>

          {orders.length > 0 && (
            <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mb-8">
              <Card className="border-none shadow-lg bg-gradient-to-br from-primary/10 to-primary/5">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-muted-foreground mb-1">Pesanan Aktif</p>
                      <p className="text-3xl font-bold text-primary">{stats.pending}</p>
                    </div>
                    <Clock className="h-10 w-10 text-primary opacity-20" />
                  </div>
                </CardContent>
              </Card>

              <Card className="border-none shadow-lg bg-gradient-to-br from-accent/20 to-accent/10">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-muted-foreground mb-1">Hemat</p>
                      <p className="text-2xl font-bold text-accent">
                        Rp {Math.round(stats.totalSaved).toLocaleString("id-ID")}
                      </p>
                    </div>
                    <TrendingUp className="h-10 w-10 text-accent opacity-20" />
                  </div>
                </CardContent>
              </Card>

              <Card className="border-none shadow-lg bg-gradient-to-br from-blue-50 to-blue-100/50">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-muted-foreground mb-1">Total Pesanan</p>
                      <p className="text-3xl font-bold text-blue-600">{stats.total}</p>
                    </div>
                    <ShoppingBag className="h-10 w-10 text-blue-600 opacity-20" />
                  </div>
                </CardContent>
              </Card>
            </div>
          )}

          {orders.length > 0 ? (
            <div className="grid gap-4">
              {orders.map((order, index) => {
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
                          <div className="md:col-span-7 p-6 space-y-4">
                            <div className="flex items-start justify-between">
                              <div className="flex-1">
                                <div className="flex items-center gap-3 mb-3">
                                  <h3 className="font-bold text-xl">{order.storeName}</h3>
                                  <Badge className="bg-primary text-white">Aktif</Badge>
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
                                    <span>
                                      Dipesan:{" "}
                                      {new Date(order.orderTime).toLocaleDateString("id-ID", {
                                        day: "numeric",
                                        month: "short",
                                        year: "numeric",
                                        hour: "2-digit",
                                        minute: "2-digit",
                                      })}
                                    </span>
                                  </div>
                                </div>

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

                            <div className="flex items-center justify-between pt-4 border-t">
                              <div>
                                <p className="text-sm text-muted-foreground mb-1">Total Pembayaran</p>
                                <p className="text-2xl font-bold text-primary">
                                  {order.getFormattedPrice()}
                                </p>
                              </div>
                            </div>
                          </div>

                          <div className="md:col-span-5 bg-gradient-to-br from-primary/5 to-primary/10 p-6 flex flex-col justify-between">
                            <div className="space-y-4">
                              <div className="flex items-center gap-2 text-sm font-medium text-primary">
                                <QrCode className="h-4 w-4" />
                                <span>Kode Booking</span>
                              </div>

                              <div className="bg-white p-4 rounded-xl inline-block">
                                <QRCodeSVG value={order.confirmationCode} size={120} level="H" />
                              </div>

                              <div className="bg-white/50 backdrop-blur-sm rounded-xl p-3">
                                <p className="text-xs text-muted-foreground mb-1">Kode Konfirmasi</p>
                                <p className="text-2xl font-mono font-bold text-primary">
                                  {order.confirmationCode}
                                </p>
                              </div>
                            </div>

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
            <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} transition={{ duration: 0.5 }}>
              <Card className="border-none shadow-lg">
                <CardContent className="p-16 text-center space-y-6">
                  <div className="w-24 h-24 mx-auto bg-primary/10 rounded-full flex items-center justify-center">
                    <ShoppingBag className="h-12 w-12 text-primary" />
                  </div>
                  <div>
                    <h3 className="font-bold text-2xl mb-2">Belum Ada Pesanan Aktif</h3>
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
        </motion.div>
      </div>
    </div>
  );
};

const RiwayatSection = () => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState<"semua" | "picked" | "expired">("semua");
  const [orders, setOrders] = useState<Order[]>([]);
  const orderService = OrderService.getInstance();

  useEffect(() => {
    const sellerUser = localStorage.getItem("goodbite_seller");
    if (sellerUser) {
      toast.error("Anda sudah login sebagai penjual. Silakan logout terlebih dahulu untuk akses riwayat pesanan.");
      navigate("/dashboard-penjual", { replace: true });
      return;
    }

    const userData = localStorage.getItem("goodbite_user");
    if (!userData) {
      navigate("/login", { replace: true });
      return;
    }

    try {
      const user = JSON.parse(userData);
      if (user.phone) {
        orderService.switchUser(user.phone);
      }
    } catch (error) {
      console.error("Error parsing user data:", error);
      navigate("/login", { replace: true });
    }
  }, [navigate, orderService]);

  useEffect(() => {
    const loadOrders = () => {
      orderService.refreshOrders();
      const historical = orderService.getAllOrders().filter((order) => order.isPicked() || order.isExpired());
      setOrders(historical);
    };

    loadOrders();

    const handleStorageChange = (e: StorageEvent) => {
      if (e.key && e.key.startsWith("goodbite_orders_")) {
        loadOrders();
      }
    };

    window.addEventListener("storage", handleStorageChange);
    return () => window.removeEventListener("storage", handleStorageChange);
  }, [orderService]);

  const filteredOrders = useMemo(() => {
    if (activeTab === "semua") {
      return orders;
    }
    return orders.filter((order) => (activeTab === "picked" ? order.isPicked() : order.isExpired()));
  }, [orders, activeTab]);

  const stats = {
    total: orders.length,
    picked: orders.filter((o) => o.isPicked()).length,
    expired: orders.filter((o) => o.isExpired()).length,
    totalSaved: orders.reduce((sum, order) => {
      const originalValue = (order as any).originalValue;
      if (!originalValue || originalValue <= 0) return sum;
      return sum + (originalValue - order.price);
    }, 0),
  };

  const getStatusBadge = (status: "picked" | "expired") => {
    const variants = {
      picked: { label: "Selesai", color: "bg-green-600" },
      expired: { label: "Kadaluarsa", color: "bg-gray-500" },
    };
    return variants[status];
  };

  return (
    <div className="container space-y-6">
      <div className="text-center text-white">
        <h1 className="font-heading font-extrabold leading-none tracking-tight text-[42px] md:text-[78px] lg:text-[96px]">
          Riwayat <span className="text-white/80">Pesanan</span>
        </h1>
      </div>

      <div className="max-w-5xl mx-auto rounded-3xl shadow-2xl border border-white/15 bg-white/90 backdrop-blur p-6 md:p-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <div className="flex items-center justify-between mb-8">
            <div>
              <h1 className="text-3xl md:text-4xl font-heading font-bold mb-2">Riwayat Pesanan</h1>
              <p className="text-muted-foreground">Lihat pesanan yang sudah selesai atau kadaluarsa</p>
            </div>
          </div>

          {orders.length > 0 && (
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
              <Card className="border-none shadow-lg bg-gradient-to-br from-primary/10 to-primary/5">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-muted-foreground mb-1">Total Riwayat</p>
                      <p className="text-3xl font-bold text-primary">{stats.total}</p>
                    </div>
                    <ShoppingBag className="h-10 w-10 text-primary opacity-20" />
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

              <Card className="border-none shadow-lg bg-gradient-to-br from-gray-100 to-gray-200/80">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-muted-foreground mb-1">Kadaluarsa</p>
                      <p className="text-3xl font-bold text-gray-700">{stats.expired}</p>
                    </div>
                    <Badge className="h-10 w-10 bg-gray-500 opacity-20 rounded-full" />
                  </div>
                </CardContent>
              </Card>

              <Card className="border-none shadow-lg bg-gradient-to-br from-accent/20 to-accent/10">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-muted-foreground mb-1">Total Hemat</p>
                      <p className="text-2xl font-bold text-accent">
                        Rp {Math.round(stats.totalSaved).toLocaleString("id-ID")}
                      </p>
                    </div>
                    <TrendingUp className="h-10 w-10 text-accent opacity-20" />
                  </div>
                </CardContent>
              </Card>
            </div>
          )}

          <Tabs value={activeTab} onValueChange={(val) => setActiveTab(val as typeof activeTab)} className="space-y-6">
            <TabsList className="grid w-full grid-cols-3 h-12">
              <TabsTrigger value="semua" className="text-base">
                Semua {orders.length > 0 && `(${orders.length})`}
              </TabsTrigger>
              <TabsTrigger value="picked" className="text-base">
                Selesai {stats.picked > 0 && `(${stats.picked})`}
              </TabsTrigger>
              <TabsTrigger value="expired" className="text-base">
                Kadaluarsa {stats.expired > 0 && `(${stats.expired})`}
              </TabsTrigger>
            </TabsList>

            <TabsContent value={activeTab} className="space-y-4">
              {filteredOrders.length > 0 ? (
                <div className="grid gap-4">
                  {filteredOrders.map((order, index) => {
                    const statusInfo = getStatusBadge(order.status as "picked" | "expired");

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
                                      <div className="flex items-center gap-2 text-muted-foreground">
                                        <Calendar className="h-4 w-4" />
                                        <span>Dipesan: {order.getFormattedOrderTime()}</span>
                                      </div>
                                    </div>
                                  </div>
                                </div>

                                <div className="flex items-center justify-between pt-4 border-t">
                                  <div>
                                    <p className="text-sm text-muted-foreground mb-1">Total Pembayaran</p>
                                    <p className="text-2xl font-bold text-primary">
                                      {order.getFormattedPrice()}
                                    </p>
                                  </div>
                                </div>
                              </div>

                              <div className="md:col-span-5 bg-gradient-to-br from-primary/5 to-primary/10 p-6 flex flex-col justify-between">
                                <div className="space-y-4">
                                  <div className="flex items-center gap-2 text-sm font-medium text-primary">
                                    <QrCode className="h-4 w-4" />
                                    <span>Kode Booking</span>
                                  </div>

                                  <div className="bg-white/50 backdrop-blur-sm rounded-xl p-3">
                                    <p className="text-xs text-muted-foreground mb-1">Kode Konfirmasi</p>
                                    <p className="text-2xl font-mono font-bold text-primary">
                                      {order.confirmationCode}
                                    </p>
                                  </div>
                                </div>

                                <div className="space-y-2 mt-4">
                                  <Link to={`/pesanan/${order.id}`} className="block">
                                    <Button className="w-full" size="lg" variant="secondary">
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
                <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} transition={{ duration: 0.5 }}>
                  <Card className="border-none shadow-lg">
                    <CardContent className="p-16 text-center space-y-6">
                      <div className="w-24 h-24 mx-auto bg-primary/10 rounded-full flex items-center justify-center">
                        <ShoppingBag className="h-12 w-12 text-primary" />
                      </div>
                      <div>
                        <h3 className="font-bold text-2xl mb-2">Belum Ada Riwayat</h3>
                        <p className="text-muted-foreground text-lg">
                          Pesanan yang selesai atau kadaluarsa akan muncul di sini.
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
    </div>
  );
};

const Jelajahi = () => {
  const location = useLocation();
  const [gridSize, setGridSize] = useState({ rows: 12, cols: 36 });
  const CELL_SIZE = 90;
  const isPesanan = location.pathname.startsWith("/pesanan");
  const isRiwayat = location.pathname.startsWith("/riwayat-pesanan");

  useEffect(() => {
    const updateGrid = () => {
      const height = Math.max(document.documentElement.scrollHeight, window.innerHeight);
      const width = Math.max(document.documentElement.clientWidth, window.innerWidth);
      setGridSize({
        rows: Math.ceil(height / CELL_SIZE),
        cols: Math.ceil(width / CELL_SIZE),
      });
    };

    updateGrid();
    const timeout = setTimeout(updateGrid, 100);
    window.addEventListener("resize", updateGrid);
    return () => {
      clearTimeout(timeout);
      window.removeEventListener("resize", updateGrid);
    };
  }, [location.pathname]);

  return (
    <div className="relative min-h-screen flex flex-col overflow-hidden">
      <div className="absolute inset-0 z-0 bg-[#0f1012]">
        <BackgroundRippleEffect
          rows={gridSize.rows}
          cols={gridSize.cols}
          cellSize={CELL_SIZE}
          triggerOnDocumentClick
          className="pointer-events-none [--cell-border-color:rgba(40,40,40,0.85)] [--cell-fill-color:rgba(10,10,10,0.9)] [--cell-shadow-color:rgba(0,0,0,0.8)]"
        />
      </div>

      <Header />

      <main className="flex-1 pt-24 md:pt-28 pb-12 relative z-10">
        {isPesanan ? <PesananSection /> : isRiwayat ? <RiwayatSection /> : <JelajahiSection />}
      </main>

      <div className="relative z-10">
        <Footer />
      </div>
    </div>
  );
};

export default Jelajahi;
