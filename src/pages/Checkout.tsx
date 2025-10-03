import { useParams, useNavigate, Link } from "react-router-dom";
import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { QRCodeSVG } from "qrcode.react";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { MapPin, Clock, ArrowLeft, CheckCircle2, Wallet, CreditCard, Smartphone, User, Phone as PhoneIcon, ArrowRight } from "lucide-react";
import { packages } from "@/data/packages";
import { toast } from "sonner";

interface Order {
  id: string;
  packageId: string;
  storeName: string;
  location: string;
  price: number;
  pickupTime: string;
  orderTime: string;
  status: "pending" | "picked" | "expired";
  confirmationCode: string;
  customerName: string;
  customerPhone: string;
}

type CheckoutStep = 1 | 2 | 3;

const Checkout = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [isProcessing, setIsProcessing] = useState(false);
  const [currentStep, setCurrentStep] = useState<CheckoutStep>(1);
  const [orderConfirmed, setOrderConfirmed] = useState(false);
  const [confirmedOrder, setConfirmedOrder] = useState<Order | null>(null);
  
  // Form state
  const [customerName, setCustomerName] = useState("");
  const [customerPhone, setCustomerPhone] = useState("");
  const [paymentMethod, setPaymentMethod] = useState("cash");
  
  const pkg = packages.find(p => p.id === id);

  useEffect(() => {
    // Load user data from localStorage
    const userData = localStorage.getItem("goodbite_user");
    if (userData) {
      const user = JSON.parse(userData);
      setCustomerName(user.name || "");
      setCustomerPhone(user.phone || "");
    }
  }, []);

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

  const generateConfirmationCode = () => {
    return Math.floor(100000 + Math.random() * 900000).toString();
  };

  const validateStep1 = () => {
    if (!customerName.trim()) {
      toast.error("Mohon isi nama lengkap");
      return false;
    }
    if (!customerPhone.trim() || customerPhone.length < 10) {
      toast.error("Mohon isi nomor telepon yang valid");
      return false;
    }
    return true;
  };

  const handleNextStep = () => {
    if (currentStep === 1) {
      if (validateStep1()) {
        setCurrentStep(2);
      }
    } else if (currentStep === 2) {
      // Check if selected payment method is coming soon
      const selectedMethod = paymentMethods.find(method => method.id === paymentMethod);
      if (selectedMethod?.comingSoon) {
        toast.error(`${selectedMethod.title} belum tersedia. Silakan gunakan "Bayar di Tempat" untuk sementara.`);
        return;
      }
      setCurrentStep(3);
    }
  };

  const handleConfirmOrder = () => {
    const user = localStorage.getItem("goodbite_user");
    if (!user) {
      toast.error("Silakan login terlebih dahulu");
      navigate("/login");
      return;
    }

    setIsProcessing(true);

    // Simulate payment processing
    setTimeout(() => {
      const orderId = Date.now().toString();
      const confirmationCode = generateConfirmationCode();
      const newOrder: Order = {
        id: orderId,
        packageId: pkg.id,
        storeName: pkg.storeName,
        location: pkg.location,
        price: pkg.price,
        pickupTime: pkg.pickupTime,
        orderTime: new Date().toISOString(),
        status: "pending",
        confirmationCode,
        customerName,
        customerPhone
      };

      // Save to localStorage
      const existingOrders = localStorage.getItem("goodbite_orders");
      const orders = existingOrders ? JSON.parse(existingOrders) : [];
      orders.push(newOrder);
      localStorage.setItem("goodbite_orders", JSON.stringify(orders));

      setConfirmedOrder(newOrder);
      setOrderConfirmed(true);
      setIsProcessing(false);
      toast.success("Pesanan berhasil dibuat!");
    }, 2000);
  };

  const steps = [
    { number: 1, title: "Info Pembeli", icon: User },
    { number: 2, title: "Metode Bayar", icon: Wallet },
    { number: 3, title: "Konfirmasi", icon: CheckCircle2 }
  ];

  const paymentMethods = [
    { id: "cash", title: "Bayar di Tempat", subtitle: "Bayar saat ambil paket", icon: Wallet, recommended: true },
    { id: "ewallet", title: "E-Wallet", subtitle: "GoPay, OVO, Dana", icon: Smartphone, comingSoon: true },
    { id: "card", title: "Kartu Kredit/Debit", subtitle: "Visa, Mastercard", icon: CreditCard, comingSoon: true }
  ];

  // Success screen
  if (orderConfirmed && confirmedOrder) {
    return (
      <div className="min-h-screen flex flex-col bg-gradient-to-b from-background to-primary/5">
        <main className="flex-1 pt-8 md:pt-12 pb-12">
          <div className="container max-w-2xl">
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.5 }}
              className="text-center space-y-8"
            >
              {/* Success Animation */}
              <div className="relative">
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ delay: 0.2, type: "spring", stiffness: 200 }}
                  className="w-32 h-32 mx-auto bg-gradient-to-br from-green-400 to-emerald-500 rounded-full flex items-center justify-center shadow-2xl"
                >
                  <CheckCircle2 className="h-16 w-16 text-white" />
                </motion.div>
              </div>

              <div className="space-y-3">
                <h1 className="text-4xl font-heading font-bold">Pesanan Berhasil!</h1>
                <p className="text-xl text-muted-foreground">
                  Pesanan kamu telah dikonfirmasi
                </p>
              </div>

              {/* QR Code Card */}
              <Card className="border-none shadow-2xl overflow-hidden">
                <div className="bg-gradient-to-br from-primary to-primary/80 p-8 text-white">
                  <h2 className="text-2xl font-bold mb-2">Kode Booking</h2>
                  <p className="text-4xl font-mono font-bold tracking-wider">
                    {confirmedOrder.confirmationCode}
                  </p>
                </div>
                
                <CardContent className="p-8 space-y-6">
                  {/* QR Code */}
                  <div className="flex justify-center p-6 bg-white rounded-2xl">
                    <QRCodeSVG
                      value={confirmedOrder.confirmationCode}
                      size={200}
                      level="H"
                      includeMargin
                    />
                  </div>

                  <div className="text-center space-y-2">
                    <p className="font-semibold">Tunjukkan kode ini saat ambil paket</p>
                    <p className="text-sm text-muted-foreground">
                      Simpan screenshot atau tunjukkan kode di atas
                    </p>
                  </div>

                  <Separator />

                  {/* Order Details */}
                  <div className="space-y-4">
                    <div className="flex justify-between items-start">
                      <span className="text-muted-foreground">Toko</span>
                      <span className="font-semibold text-right">{confirmedOrder.storeName}</span>
                    </div>
                    <div className="flex justify-between items-start">
                      <span className="text-muted-foreground">Lokasi</span>
                      <span className="font-semibold text-right max-w-[200px]">{confirmedOrder.location}</span>
                    </div>
                    <div className="flex justify-between items-start">
                      <span className="text-muted-foreground">Waktu Ambil</span>
                      <span className="font-semibold text-right">{confirmedOrder.pickupTime}</span>
                    </div>
                    <div className="flex justify-between items-start">
                      <span className="text-muted-foreground">Total</span>
                      <span className="text-2xl font-bold text-primary">
                        Rp {confirmedOrder.price.toLocaleString('id-ID')}
                      </span>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Action Buttons */}
              <div className="flex flex-col sm:flex-row gap-4">
                <Button
                  size="lg"
                  className="flex-1"
                  onClick={() => navigate(`/pesanan/${confirmedOrder.id}`)}
                >
                  Lihat Detail Pesanan
                </Button>
                <Button
                  size="lg"
                  variant="outline"
                  className="flex-1"
                  onClick={() => navigate("/jelajahi")}
                >
                  Pesan Lagi
                </Button>
              </div>

              <p className="text-sm text-muted-foreground">
              </p>
            </motion.div>
          </div>
        </main>

        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-b from-background to-primary/5">
      <main className="flex-1 pt-8 md:pt-12 pb-12">
        <div className="container max-w-6xl">
          <Link to={`/paket/${pkg.id}`}>
            <Button variant="ghost" className="mb-6 hover:bg-primary/10">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Kembali
            </Button>
          </Link>

          <h1 className="text-3xl md:text-4xl font-heading font-bold mb-8">Checkout</h1>

          {/* Progress Steps */}
          <div className="mb-12">
            <div className="flex items-center justify-between max-w-2xl mx-auto">
              {steps.map((step, index) => (
                <div key={step.number} className="flex items-center flex-1">
                  <div className="flex flex-col items-center flex-1">
                    <div className={`w-12 h-12 rounded-full flex items-center justify-center font-bold transition-all ${
                      currentStep >= step.number
                        ? 'bg-primary text-white shadow-lg'
                        : 'bg-gray-200 text-gray-400'
                    }`}>
                      <step.icon className="h-6 w-6" />
                    </div>
                    <p className={`text-sm mt-2 font-medium hidden md:block ${
                      currentStep >= step.number ? 'text-primary' : 'text-muted-foreground'
                    }`}>
                      {step.title}
                    </p>
                  </div>
                  {index < steps.length - 1 && (
                    <div className={`h-1 flex-1 mx-2 rounded transition-all ${
                      currentStep > step.number ? 'bg-primary' : 'bg-gray-200'
                    }`} />
                  )}
                </div>
              ))}
            </div>
          </div>

          <div className="grid lg:grid-cols-3 gap-8">
            {/* Left Column - Form */}
            <div className="lg:col-span-2 space-y-6">
              <AnimatePresence mode="wait">
                {/* Step 1: Customer Info */}
                {currentStep === 1 && (
                  <motion.div
                    key="step1"
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -20 }}
                    transition={{ duration: 0.3 }}
                  >
                    <Card className="border-none shadow-lg">
                      <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                          <User className="h-5 w-5 text-primary" />
                          Informasi Pembeli
                        </CardTitle>
                      </CardHeader>
                      <CardContent className="space-y-6">
                        <div className="space-y-4">
                          <div className="space-y-2">
                            <Label htmlFor="name">Nama Lengkap *</Label>
                            <Input
                              id="name"
                              placeholder="Masukkan nama lengkap"
                              value={customerName}
                              onChange={(e) => setCustomerName(e.target.value)}
                              className="h-12"
                            />
                          </div>

                          <div className="space-y-2">
                            <Label htmlFor="phone">Nomor Telepon *</Label>
                            <div className="relative">
                              <PhoneIcon className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
                              <Input
                                id="phone"
                                type="tel"
                                placeholder="08123456789"
                                value={customerPhone}
                                onChange={(e) => setCustomerPhone(e.target.value)}
                                className="h-12 pl-11"
                              />
                            </div>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  </motion.div>
                )}

                {/* Step 2: Payment Method */}
                {currentStep === 2 && (
                  <motion.div
                    key="step2"
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -20 }}
                    transition={{ duration: 0.3 }}
                  >
                    <Card className="border-none shadow-lg">
                      <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                          <Wallet className="h-5 w-5 text-primary" />
                          Metode Pembayaran
                        </CardTitle>
                      </CardHeader>
                      <CardContent className="space-y-4">
                        {paymentMethods.map((method) => (
                          <button
                            key={method.id}
                            onClick={() => setPaymentMethod(method.id)}
                            className={`w-full p-6 rounded-2xl border-2 transition-all text-left ${
                              paymentMethod === method.id
                                ? 'border-primary bg-primary/5 shadow-lg'
                                : 'border-gray-200 hover:border-primary/50 hover:shadow'
                            }`}
                          >
                            <div className="flex items-center gap-4">
                              <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${
                                paymentMethod === method.id ? 'bg-primary text-white' : 'bg-gray-100'
                              }`}>
                                <method.icon className="h-6 w-6" />
                              </div>
                              <div className="flex-1">
                                <div className="flex items-center gap-2">
                                  <h3 className="font-semibold">{method.title}</h3>
                                  {method.recommended && (
                                    <Badge className="bg-accent text-primary text-xs">Recommended</Badge>
                                  )}
                                  {method.comingSoon && (
                                    <Badge variant="secondary" className="text-xs">Fitur Dalam Pengembangan</Badge>
                                  )}
                                </div>
                                <p className="text-sm text-muted-foreground">{method.subtitle}</p>
                              </div>
                              {paymentMethod === method.id && (
                                <CheckCircle2 className="h-6 w-6 text-primary" />
                              )}
                            </div>
                          </button>
                        ))}

                        <div className="bg-green-50 border border-green-200 rounded-xl p-4">
                          <p className="text-sm text-green-800">
                             Pembayaran aman dan mudah saat ambil paket
                          </p>
                        </div>
                      </CardContent>
                    </Card>
                  </motion.div>
                )}

                {/* Step 3: Confirmation */}
                {currentStep === 3 && (
                  <motion.div
                    key="step3"
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -20 }}
                    transition={{ duration: 0.3 }}
                  >
                    <Card className="border-none shadow-lg">
                      <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                          <CheckCircle2 className="h-5 w-5 text-primary" />
                          Konfirmasi Pesanan
                        </CardTitle>
                      </CardHeader>
                      <CardContent className="space-y-6">
                        {/* Customer Info */}
                        <div className="space-y-4">
                          <h3 className="font-semibold">Informasi Pembeli</h3>
                          <div className="bg-gray-50 rounded-xl p-4 space-y-2">
                            <div className="flex justify-between">
                              <span className="text-muted-foreground">Nama</span>
                              <span className="font-medium">{customerName}</span>
                            </div>
                            <div className="flex justify-between">
                              <span className="text-muted-foreground">Telepon</span>
                              <span className="font-medium">{customerPhone}</span>
                            </div>
                          </div>
                        </div>

                        {/* Payment Method */}
                        <div className="space-y-4">
                          <h3 className="font-semibold">Metode Pembayaran</h3>
                          <div className="bg-gray-50 rounded-xl p-4">
                            <div className="flex items-center gap-3">
                              <Wallet className="h-5 w-5 text-primary" />
                              <span className="font-medium">Bayar di Tempat</span>
                            </div>
                          </div>
                        </div>

                        {/* Important Info */}
                        <div className="bg-yellow-50 border border-yellow-200 rounded-xl p-4">
                          <h4 className="font-semibold mb-2 flex items-center gap-2">
                             Penting untuk Diperhatikan
                          </h4>
                          <ul className="space-y-1 text-sm text-yellow-800">
                            <li>• Pastikan ambil paket sesuai waktu yang ditentukan</li>
                            <li>• Tunjukkan kode konfirmasi saat pengambilan</li>
                            <li>• Paket tidak dapat dikembalikan atau ditukar</li>
                            <li>• Siapkan uang pas untuk mempercepat transaksi</li>
                          </ul>
                        </div>
                      </CardContent>
                    </Card>
                  </motion.div>
                )}
              </AnimatePresence>

              {/* Navigation Buttons */}
              <div className="flex gap-4">
                {currentStep > 1 && (
                  <Button
                    variant="outline"
                    size="lg"
                    onClick={() => setCurrentStep((currentStep - 1) as CheckoutStep)}
                    className="flex-1"
                  >
                    <ArrowLeft className="h-5 w-5 mr-2" />
                    Kembali
                  </Button>
                )}
                
                {currentStep < 3 ? (
                  <Button
                    size="lg"
                    onClick={handleNextStep}
                    className="flex-1"
                  >
                    Lanjutkan
                    <ArrowRight className="h-5 w-5 ml-2" />
                  </Button>
                ) : (
                  <Button
                    size="lg"
                    onClick={handleConfirmOrder}
                    disabled={isProcessing}
                    className="flex-1"
                  >
                    {isProcessing ? "Memproses..." : "Konfirmasi Pesanan"}
                  </Button>
                )}
              </div>
            </div>

            {/* Right Column - Order Summary (Sticky) */}
            <div className="lg:col-span-1">
              <div className="lg:sticky lg:top-28">
                <Card className="border-none shadow-2xl">
                  <CardHeader className="bg-gradient-to-br from-primary/10 to-primary/5">
                    <CardTitle>Ringkasan Pesanan</CardTitle>
                  </CardHeader>
                  <CardContent className="p-6 space-y-6">
                    <div className="aspect-video rounded-xl overflow-hidden">
                      <img
                        src={pkg.image}
                        alt={pkg.storeName}
                        className="w-full h-full object-cover"
                      />
                    </div>

                    <div className="space-y-3">
                      <div>
                        <h3 className="font-semibold text-lg mb-1">{pkg.storeName}</h3>
                        <div className="flex items-start gap-2 text-sm text-muted-foreground">
                          <MapPin className="h-4 w-4 mt-0.5 flex-shrink-0" />
                          <span>{pkg.location}</span>
                        </div>
                      </div>

                      <div className="flex items-start gap-2 text-sm">
                        <Clock className="h-4 w-4 mt-0.5 flex-shrink-0 text-primary" />
                        <div>
                          <p className="font-medium">Waktu Pengambilan</p>
                          <p className="text-muted-foreground">{pkg.pickupTime}</p>
                        </div>
                      </div>
                    </div>

                    <Separator />

                    <div className="space-y-3">
                      <div className="flex justify-between text-sm">
                        <span className="text-muted-foreground">Harga Paket</span>
                        <span className="font-medium">Rp {pkg.price.toLocaleString('id-ID')}</span>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span className="text-muted-foreground">Jumlah</span>
                        <span className="font-medium">1 paket</span>
                      </div>
                      <div className="flex justify-between text-sm text-green-600">
                        <span>Hemat</span>
                        <span className="font-semibold">
                          Rp {(pkg.originalValue - pkg.price).toLocaleString('id-ID')}
                        </span>
                      </div>
                    </div>

                    <Separator />

                    <div className="flex justify-between items-center">
                      <span className="font-semibold text-lg">Total Bayar</span>
                      <div className="text-right">
                        <p className="text-3xl font-bold text-primary">
                          Rp {pkg.price.toLocaleString('id-ID')}
                        </p>
                        <p className="text-xs text-muted-foreground line-through">
                          Rp {pkg.originalValue.toLocaleString('id-ID')}
                        </p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default Checkout;
