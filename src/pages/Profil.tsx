import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { toast } from "sonner";
import { User, LogOut, ShoppingBag, Wallet } from "lucide-react";

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

  useEffect(() => {
    const stored = localStorage.getItem("goodbite_user");
    if (!stored) {
      navigate("/login");
      return;
    }
    const user: UserData = JSON.parse(stored);
    setUserData(user);
    setName(user.name);
    setPhone(user.phone);
  }, [navigate]);

  const orders = JSON.parse(localStorage.getItem("goodbite_orders") || "[]");
  const totalOrders = orders.length;
  const totalSavings = orders.reduce((sum: number, order: any) => {
    return sum + (order.originalValue || order.price * 2.5) - order.price;
  }, 0);

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
    localStorage.removeItem("goodbite_user");
    toast.success("Berhasil keluar");
    navigate("/");
  };

  if (!userData) {
    return null;
  }

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      
      <main className="flex-1 py-12">
        <div className="container max-w-4xl">
          <h1 className="text-3xl font-bold mb-8">Profil Saya</h1>

          <div className="grid md:grid-cols-3 gap-6 mb-8">
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
                <p className="text-3xl font-bold">Rp {totalSavings.toLocaleString('id-ID')}</p>
                <p className="text-sm text-muted-foreground">Total Hemat</p>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6 text-center space-y-2">
                <User className="h-8 w-8 mx-auto text-primary" />
                <p className="text-3xl font-bold">
                  {Math.floor((Date.now() - new Date(userData.createdAt).getTime()) / (1000 * 60 * 60 * 24))}
                </p>
                <p className="text-sm text-muted-foreground">Hari Bergabung</p>
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

          <Card className="mt-6">
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
      </main>

      <Footer />
    </div>
  );
};

export default Profil;
