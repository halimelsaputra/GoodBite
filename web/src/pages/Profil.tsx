import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Footer from "@/components/Footer";
import "@/components/profile-card/ProfileCard.css";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { toast } from "sonner";
import { User, LogOut, ShoppingBag, Wallet, Calendar } from "lucide-react";
import { OrderService } from "@/services/OrderService";

interface UserData {
  name: string;
  phone: string;
  createdAt: string;
}

const Profil = () => {
  const navigate = useNavigate();
  const [isEditing, setIsEditing] = useState(false);
  const [userData, setUserData] = useState<UserData | null>(null);
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [totalOrders, setTotalOrders] = useState(0);
  const [totalSavings, setTotalSavings] = useState(0);
  const [daysSinceJoined, setDaysSinceJoined] = useState(0);

  useEffect(() => {
    // Check if seller is logged in
    const sellerUser = localStorage.getItem("goodbite_seller");
    if (sellerUser) {
      toast.error("Anda sudah login sebagai penjual. Silakan logout terlebih dahulu untuk akses profil pembeli.");
      navigate("/dashboard-penjual", { replace: true });
      return;
    }

    const stored = localStorage.getItem("goodbite_user");
    if (!stored) {
      navigate("/login");
      return;
    }
    const user: UserData = JSON.parse(stored);
    setUserData(user);
    setName(user.name);
    setPhone(user.phone);

    // Load orders using OrderService with correct user
    const orderService = OrderService.getInstance();
    if (user.phone) {
      orderService.switchUser(user.phone);
    }
    const orders = orderService.getAllOrders();
    setTotalOrders(orders.length);

    // Calculate total savings
    const savings = orders.reduce((sum: number, order: any) => {
      const originalValue = order.originalValue;
      if (!originalValue || originalValue <= 0) return sum;
      return sum + (originalValue - order.price);
    }, 0);
    setTotalSavings(savings);

    // Calculate days since joined
    if (user.createdAt) {
      const createdDate = new Date(user.createdAt);
      const today = new Date();
      const diffTime = today.getTime() - createdDate.getTime();
      const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));
      setDaysSinceJoined(diffDays);
    }
  }, [navigate]);

  const getFormattedDate = () => {
    if (!userData?.createdAt) return "-";
    const date = new Date(userData.createdAt);
    return date.toLocaleDateString("id-ID", {
      year: "numeric",
      month: "long",
      day: "numeric"
    });
  };

  const handleSave = () => {
    if (!name || !phone) {
      toast.error("Mohon isi semua field");
      return;
    }

    const updatedUser = {
      ...userData!,
      name,
      phone
    };

    localStorage.setItem("goodbite_user", JSON.stringify(updatedUser));
    setUserData(updatedUser);
    setIsEditing(false);
    toast.success("Profil berhasil diperbarui");
  };

  const handleLogout = () => {
    // Clear user session in OrderService
    const orderService = OrderService.getInstance();
    orderService.clearUserSession();
    
    // Remove user data from localStorage
    localStorage.removeItem("goodbite_user");
    
    toast.success("Berhasil keluar");
    navigate("/", { replace: true });
  };

  if (!userData) {
    return null;
  }

  return (
    <div className="min-h-screen flex flex-col">
      <main className="flex-1 py-12">
        <div className="container">
          <div className="mx-auto w-full max-w-5xl">
            <div
              className="profile-card profile-card-wrap"
              style={{
                width: "100%",
                minWidth: "100%",
                height: "auto",
                minHeight: "auto",
                padding: "2rem",
                justifyContent: "flex-start",
                background: "transparent",
                boxShadow: "none",
              }}
            >
              <div className="profile-card-status">
                <span className="profile-card-status-dot" />
                Akun aktif
              </div>

              <div className="relative z-10 space-y-8">
                <h1 className="text-3xl font-bold text-neutral-900">Profil Saya</h1>

                <div className="grid md:grid-cols-3 gap-6">
                  <Card>
                    <CardContent className="p-6 text-center space-y-2">
                      <ShoppingBag className="h-8 w-8 mx-auto text-primary" />
                      <p className="text-3xl font-bold">{totalOrders}</p>
                      <p className="text-sm text-muted-foreground">Total Pesanan</p>
                    </CardContent>
                  </Card>

                  <Card>
                    <CardContent className="p-6 text-center space-y-2">
                      <Wallet className="h-8 w-8 mx-auto text-primary" />
                      <p className="text-3xl font-bold">Rp {totalSavings.toLocaleString("id-ID")}</p>
                      <p className="text-sm text-muted-foreground">Total Hemat</p>
                    </CardContent>
                  </Card>

                  <Card>
                    <CardContent className="p-6 text-center space-y-2">
                      <Calendar className="h-8 w-8 mx-auto text-primary" />
                      <p className="text-lg font-bold">{getFormattedDate()}</p>
                      <p className="text-sm text-muted-foreground">Terdaftar Sejak</p>
                    </CardContent>
                  </Card>
                </div>

                <Card>
                  <CardHeader className="flex flex-row items-center justify-between">
                    <CardTitle>Informasi Profil</CardTitle>
                    {!isEditing && (
                      <Button variant="outline" onClick={() => setIsEditing(true)}>
                        Edit
                      </Button>
                    )}
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="name">Nama Lengkap</Label>
                      {isEditing ? (
                        <Input
                          id="name"
                          value={name}
                          onChange={(e) => setName(e.target.value)}
                        />
                      ) : (
                        <p className="text-lg font-medium">{userData.name}</p>
                      )}
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="phone">Nomor HP</Label>
                      {isEditing ? (
                        <Input
                          id="phone"
                          type="tel"
                          value={phone}
                          onChange={(e) => setPhone(e.target.value)}
                        />
                      ) : (
                        <p className="text-lg font-medium">{userData.phone}</p>
                      )}
                    </div>

                    {isEditing && (
                      <div className="flex space-x-4">
                        <Button onClick={handleSave}>Simpan</Button>
                        <Button
                          variant="outline"
                          onClick={() => {
                            setIsEditing(false);
                            setName(userData.name);
                            setPhone(userData.phone);
                          }}
                        >
                          Batal
                        </Button>
                      </div>
                    )}
                  </CardContent>
                </Card>

                <Card>
                  <CardContent className="p-6">
                    <Button
                      variant="destructive"
                      onClick={handleLogout}
                      className="w-full"
                    >
                      <LogOut className="h-4 w-4 mr-2" />
                      Keluar
                    </Button>
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

export default Profil;
