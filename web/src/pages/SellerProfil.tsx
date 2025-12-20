import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import SellerHeader from "@/components/SellerHeader";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { toast } from "sonner";
import { Store, LogOut, Mail, Phone as PhoneIcon, Calendar, AlertCircle, Trash2 } from "lucide-react";
import { AuthService } from "@/services/AuthService";

interface SellerInfo {
  id: string;
  username: string;
  storeName: string;
  email: string;
  phone: string;
  location?: string;
  description?: string;
  createdAt: string;
}

const SellerProfil = () => {
  const navigate = useNavigate();
  const [isEditing, setIsEditing] = useState(false);
  const [seller, setSeller] = useState<SellerInfo | null>(null);
  const [storeName, setStoreName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [location, setLocation] = useState("");
  const [description, setDescription] = useState("");
  const [isSaving, setIsSaving] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

  useEffect(() => {
    // Check if customer user is logged in
    const customerUser = localStorage.getItem("goodbite_user");
    if (customerUser) {
      toast.error("Anda sudah login sebagai pembeli. Silakan logout terlebih dahulu untuk akses profil penjual.");
      navigate("/", { replace: true });
      return;
    }

    const stored = localStorage.getItem("goodbite_seller");
    if (!stored) {
      toast.error("Silakan login terlebih dahulu");
      navigate("/seller-login");
      return;
    }
    const sellerData: SellerInfo = JSON.parse(stored);
    setSeller(sellerData);
    setStoreName(sellerData.storeName);
    setEmail(sellerData.email);
    setPhone(sellerData.phone);
    setLocation(sellerData.location || "");
    setDescription(sellerData.description || "");
  }, [navigate]);

  const handleSave = async () => {
    if (!storeName || !email || !phone) {
      toast.error("Mohon isi semua field wajib");
      return;
    }

    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      toast.error("Email tidak valid");
      return;
    }

    setIsSaving(true);

    try {
      // Update seller profile via API
      await AuthService.updateSellerProfile(seller!.id, {
        storeName,
        email,
        phone,
        location,
        description
      });

      const updatedSeller = {
        ...seller!,
        storeName,
        email,
        phone,
        location,
        description
      };

      // Update current seller session
      localStorage.setItem("goodbite_seller", JSON.stringify(updatedSeller));
      setSeller(updatedSeller);
      setIsEditing(false);
      toast.success("Profil berhasil diperbarui!");
    } catch (error: any) {
      toast.error(error.message || "Gagal memperbarui profil");
    } finally {
      setIsSaving(false);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("goodbite_seller");
    toast.success("Berhasil logout");
    navigate("/", { replace: true });
  };

  const handleDeleteAccount = async () => {
    if (!seller) return;

    setIsDeleting(true);

    try {
      // Delete seller account via API
      await AuthService.deleteSellerAccount(seller.id);

      // Remove seller session
      localStorage.removeItem("goodbite_seller");

      toast.success("Akun berhasil dihapus");
      setShowDeleteModal(false);
      navigate("/seller-login", { replace: true });
    } catch (error: any) {
      console.error("Error deleting account:", error);
      toast.error(error.message || "Gagal menghapus akun");
    } finally {
      setIsDeleting(false);
    }
  };

  const createdDate = seller?.createdAt
    ? new Date(seller.createdAt).toLocaleDateString("id-ID", {
        year: "numeric",
        month: "long",
        day: "numeric"
      })
    : "";

  if (!seller) {
    return null;
  }

  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-b from-background via-primary/5 to-background">
      <SellerHeader sellerName={seller.storeName} />

      <main className="flex-1 pt-24 md:pt-28 pb-16">
        <div className="container max-w-4xl">
          <div className="mb-8">
            <h1 className="text-4xl md:text-5xl font-bold text-foreground mb-2">
              Profil Toko
            </h1>
            <p className="text-lg text-muted-foreground">
              Kelola informasi toko Anda
            </p>
          </div>

          {/* Profile Card */}
          <Card className="mb-8 border-2 border-primary/10">
            <CardHeader className="bg-gradient-to-r from-primary/5 to-accent/5">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <div className="bg-primary/10 rounded-lg p-4">
                    <Store className="h-8 w-8 text-primary" />
                  </div>
                  <div>
                    <CardTitle className="text-2xl">{seller.storeName}</CardTitle>
                    <p className="text-sm text-muted-foreground mt-1">@{seller.username}</p>
                  </div>
                </div>
                {!isEditing && (
                  <Button
                    onClick={() => setIsEditing(true)}
                    className="bg-primary hover:bg-primary/90"
                  >
                    Edit Profil
                  </Button>
                )}
              </div>
            </CardHeader>

            <CardContent className="p-6 space-y-6">
              {isEditing ? (
                <form onSubmit={(e) => {
                  e.preventDefault();
                  handleSave();
                }} className="space-y-6">
                  <div className="grid md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <Label htmlFor="storeName" className="font-semibold">
                        Nama Toko *
                      </Label>
                      <Input
                        id="storeName"
                        value={storeName}
                        onChange={(e) => setStoreName(e.target.value)}
                        placeholder="Nama toko Anda"
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="email" className="font-semibold">
                        Email *
                      </Label>
                      <Input
                        id="email"
                        type="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        placeholder="email@example.com"
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="phone" className="font-semibold">
                        Nomor HP *
                      </Label>
                      <Input
                        id="phone"
                        value={phone}
                        onChange={(e) => setPhone(e.target.value)}
                        placeholder="08xxxxxxxxxx"
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="location" className="font-semibold">
                        Lokasi
                      </Label>
                      <Input
                        id="location"
                        value={location}
                        onChange={(e) => setLocation(e.target.value)}
                        placeholder="Kota atau wilayah operasional"
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="description" className="font-semibold">
                      Deskripsi Toko
                    </Label>
                    <textarea
                      id="description"
                      value={description}
                      onChange={(e) => setDescription(e.target.value)}
                      placeholder="Ceritakan tentang toko Anda..."
                      className="w-full px-4 py-2 border border-input rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/50 resize-none"
                      rows={4}
                    />
                  </div>

                  <div className="flex gap-3 pt-4">
                    <Button
                      type="submit"
                      disabled={isSaving}
                      className="bg-primary hover:bg-primary/90"
                    >
                      {isSaving ? "Menyimpan..." : "Simpan Perubahan"}
                    </Button>
                    <Button
                      type="button"
                      variant="outline"
                      onClick={() => {
                        setIsEditing(false);
                        setStoreName(seller.storeName);
                        setEmail(seller.email);
                        setPhone(seller.phone);
                        setLocation(seller.location || "");
                        setDescription(seller.description || "");
                      }}
                    >
                      Batal
                    </Button>
                  </div>
                </form>
              ) : (
                <div className="space-y-6">
                  <div className="grid md:grid-cols-2 gap-6">
                    <div>
                      <Label className="text-muted-foreground text-sm mb-2 block">
                        Nama Toko
                      </Label>
                      <p className="font-semibold text-lg">{seller.storeName}</p>
                    </div>

                    <div>
                      <Label className="text-muted-foreground text-sm mb-2 block">
                        Username
                      </Label>
                      <p className="font-semibold text-lg">@{seller.username}</p>
                    </div>

                    <div className="flex items-start gap-3">
                      <Mail className="h-5 w-5 text-primary mt-1 flex-shrink-0" />
                      <div>
                        <Label className="text-muted-foreground text-sm mb-2 block">
                          Email
                        </Label>
                        <p className="font-semibold">{seller.email}</p>
                      </div>
                    </div>

                    <div className="flex items-start gap-3">
                      <PhoneIcon className="h-5 w-5 text-primary mt-1 flex-shrink-0" />
                      <div>
                        <Label className="text-muted-foreground text-sm mb-2 block">
                          Nomor HP
                        </Label>
                        <p className="font-semibold">{seller.phone}</p>
                      </div>
                    </div>
                  </div>

                  {location && (
                    <div className="pt-4 border-t">
                      <Label className="text-muted-foreground text-sm mb-2 block">
                        Lokasi
                      </Label>
                      <p className="font-semibold">{location}</p>
                    </div>
                  )}

                  {description && (
                    <div className="pt-4 border-t">
                      <Label className="text-muted-foreground text-sm mb-2 block">
                        Deskripsi Toko
                      </Label>
                      <p className="text-foreground leading-relaxed">{description}</p>
                    </div>
                  )}

                  <div className="pt-4 border-t flex items-center justify-between">
                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                      <Calendar className="h-4 w-4" />
                      Terdaftar sejak {createdDate}
                    </div>
                    <Button
                      onClick={handleLogout}
                      variant="destructive"
                      size="sm"
                    >
                      <LogOut className="h-4 w-4 mr-2" />
                      Logout
                    </Button>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Delete Account Section */}
          <Card className="border-2 border-destructive/50 bg-destructive/5">
            <CardHeader>
              <CardTitle className="text-destructive flex items-center gap-2">
                <Trash2 className="h-5 w-5" />
                Hapus Akun Secara Permanen
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-destructive/80 mb-4">
                <strong>Perhatian:</strong> Menghapus akun akan menghapus semua data toko dan paket Anda secara permanen. Tindakan ini tidak dapat dibatalkan.
              </p>
              <Button
                onClick={() => setShowDeleteModal(true)}
                variant="destructive"
                className="gap-2"
              >
                <Trash2 className="h-4 w-4" />
                Hapus Akun
              </Button>
            </CardContent>
          </Card>

          {/* Delete Confirmation Modal */}
          {showDeleteModal && (
            <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
              <Card className="w-full max-w-md border-2 border-destructive">
                <CardHeader className="bg-destructive/10">
                  <CardTitle className="text-destructive flex items-center gap-2">
                    <AlertCircle className="h-5 w-5" />
                    Konfirmasi Penghapusan Akun
                  </CardTitle>
                </CardHeader>
                <CardContent className="pt-6 space-y-4">
                  <div className="space-y-2">
                    <p className="font-semibold text-foreground">
                      Apakah Anda yakin ingin menghapus akun ini?
                    </p>
                    <p className="text-sm text-muted-foreground">
                      Toko: <strong>{seller.storeName}</strong>
                    </p>
                    <p className="text-sm text-destructive font-medium">
                      ⚠️ Data toko dan semua paket akan dihapus secara permanen dan tidak dapat dipulihkan.
                    </p>
                  </div>

                  <div className="flex gap-3 pt-4">
                    <Button
                      onClick={() => setShowDeleteModal(false)}
                      variant="outline"
                      className="flex-1"
                      disabled={isDeleting}
                    >
                      Batal
                    </Button>
                    <Button
                      onClick={handleDeleteAccount}
                      variant="destructive"
                      className="flex-1"
                      disabled={isDeleting}
                    >
                      {isDeleting ? "Menghapus..." : "Ya, Hapus Akun"}
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </div>
          )}
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default SellerProfil;
