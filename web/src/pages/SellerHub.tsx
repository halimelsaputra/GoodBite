import { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import SellerHeader from "@/components/SellerHeader";
import Footer from "@/components/Footer";
import { BackgroundRippleEffect } from "@/components/BackgroundRippleEffect";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Upload, ImageIcon } from "lucide-react";
import { AuthService } from "@/services/AuthService";
import { toast } from "sonner";

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

interface SellerPackage {
  id: string;
  sellerId: string;
  storeName: string;
  location: string;
  category: string;
  price: number;
  originalValue: number;
  available: number;
  pickupTime: string;
  description: string;
  image: string;
  createdAt: string;
}

const PACKAGE_CATEGORIES = [
  { value: "bakery", label: "Bakery" },
  { value: "restaurant", label: "Restaurant" },
  { value: "coffee-shop", label: "Coffee Shop" },
];

const DEFAULT_FORM = {
  location: "",
  category: "",
  price: "",
  originalValue: "",
  available: "",
  pickupTime: "",
  description: "",
};

const SellerHub = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [gridSize, setGridSize] = useState({ rows: 12, cols: 36 });
  const [seller, setSeller] = useState<SellerInfo | null>(null);
  const [packageData, setPackageData] = useState<SellerPackage | null>(null);
  const [reviews, setReviews] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [isReviewsLoading, setIsReviewsLoading] = useState(false);
  const [imagePreview, setImagePreview] = useState<string>("");
  const [formData, setFormData] = useState(DEFAULT_FORM);
  const CELL_SIZE = 90;

  const isPaket = location.pathname.startsWith("/dashboard-penjual");
  const isPesanan =
    location.pathname.startsWith("/seller-orders") || location.pathname.startsWith("/seller-reviews");

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

  useEffect(() => {
    const customerUser = localStorage.getItem("goodbite_user");
    if (customerUser) {
      toast.error("Anda sudah login sebagai pembeli. Silakan logout terlebih dahulu untuk akses penjual.");
      navigate("/", { replace: true });
      return;
    }

    const sellerData = localStorage.getItem("goodbite_seller");
    if (!sellerData) {
      toast.error("Silakan login sebagai penjual");
      navigate("/seller-login", { replace: true });
      return;
    }

    try {
      const info = JSON.parse(sellerData) as SellerInfo;
      setSeller(info);
      loadSellerPackage(info.id);
      loadReviews(info.id);
    } catch (error) {
      console.error("Error parsing seller data", error);
      toast.error("Data penjual tidak valid");
      navigate("/seller-login", { replace: true });
    }
  }, [navigate]);

  const loadSellerPackage = async (sellerId: string) => {
    setIsLoading(true);
    try {
      const packages = await AuthService.getSellerPackages(sellerId);
      if (packages.length > 0) {
        const pkg = packages[0];
        setPackageData(pkg);
        setFormData({
          location: pkg.location || "",
          category: pkg.category || "",
          price: pkg.price?.toString() || "",
          originalValue: pkg.originalValue?.toString() || "",
          available: pkg.available?.toString() || "",
          pickupTime: pkg.pickupTime || "",
          description: pkg.description || "",
        });
        setImagePreview(pkg.image || "");
      } else {
        setPackageData(null);
        setFormData(DEFAULT_FORM);
        setImagePreview("");
      }
    } catch (error) {
      console.error("Error loading package", error);
      toast.error("Gagal memuat paket");
    } finally {
      setIsLoading(false);
    }
  };

  const loadReviews = async (sellerId: string) => {
    try {
      setIsReviewsLoading(true);
      const data = await AuthService.getSellerReviews(sellerId);
      setReviews(Array.isArray(data) ? data : []);
    } catch (error) {
      console.error("Error loading reviews", error);
      toast.error("Gagal memuat ulasan");
    } finally {
      setIsReviewsLoading(false);
    }
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (file.size > 2 * 1024 * 1024) {
      toast.error("Ukuran foto maksimal 2MB");
      return;
    }

    if (!file.type.startsWith("image/")) {
      toast.error("File harus berupa gambar");
      return;
    }

    const reader = new FileReader();
    reader.onload = (event) => {
      const base64String = event.target?.result as string;
      setImagePreview(base64String);
      toast.success("Foto berhasil dipilih");
    };
    reader.readAsDataURL(file);
  };

  const handleSavePackage = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);

    if (!seller || !packageData) {
      toast.error("Data penjual atau paket tidak ditemukan");
      setIsSaving(false);
      return;
    }

    if (
      !formData.location ||
      !formData.category ||
      !formData.price ||
      !formData.originalValue ||
      !formData.available ||
      !formData.pickupTime ||
      !formData.description
    ) {
      toast.error("Mohon isi semua field yang diperlukan");
      setIsSaving(false);
      return;
    }

    const price = Number(formData.price);
    const originalValue = Number(formData.originalValue);
    const available = Number(formData.available);

    if (price <= 0 || originalValue <= 0 || available < 0) {
      toast.error("Harga dan jumlah paket harus bernilai positif");
      setIsSaving(false);
      return;
    }

    if (price >= originalValue) {
      toast.error("Harga paket harus lebih rendah dari harga normal");
      setIsSaving(false);
      return;
    }

    try {
      await AuthService.updatePackage(seller.id, packageData.id, {
        location: formData.location,
        category: formData.category,
        price,
        originalValue,
        available,
        pickupTime: formData.pickupTime,
        description: formData.description,
        image: imagePreview,
      });

      setPackageData({
        ...packageData,
        location: formData.location,
        category: formData.category,
        price,
        originalValue,
        available,
        pickupTime: formData.pickupTime,
        description: formData.description,
        image: imagePreview,
      });
      toast.success("Paket berhasil disimpan!");
    } catch (error: any) {
      console.error("Error saving package", error);
      toast.error(error.message || "Terjadi kesalahan saat menyimpan paket");
    }

    setIsSaving(false);
  };

  const discountPercentage =
    packageData && packageData.originalValue
      ? Math.round(((packageData.originalValue - packageData.price) / packageData.originalValue) * 100)
      : 0;

  const renderDashboardSection = () => {
    const discount =
      packageData && packageData.originalValue
        ? Math.round(((packageData.originalValue - packageData.price) / packageData.originalValue) * 100)
        : 0;

    return (
      <div className="container space-y-6">
        <div className="text-center text-white">
          <h1 className="font-heading font-extrabold leading-none tracking-tight text-[42px] md:text-[78px] lg:text-[96px]">
            Dashboard <span className="text-white/80">Penjual</span>
          </h1>
        </div>

        <div className="max-w-5xl mx-auto rounded-3xl shadow-2xl border border-white/15 bg-white/90 backdrop-blur p-6 md:p-8 space-y-8">
          <div className="flex flex-col md:flex-row justify-between gap-4">
            <div>
              <h2 className="text-3xl font-bold">Ringkasan Toko</h2>
              <p className="text-muted-foreground">Pantau performa toko Anda</p>
            </div>
            <div className="flex flex-wrap gap-3">
              <Button variant="secondary" onClick={() => navigate("/dashboard-penjual")}>
                Kelola Paket
              </Button>
              <Button variant="secondary" onClick={() => navigate("/seller-orders")}>
                Pesanan
              </Button>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <Card>
              <CardContent className="pt-6">
                <p className="text-sm text-muted-foreground">Paket Aktif</p>
                <p className="text-3xl font-bold">{packageData ? 1 : 0}</p>
                <p className="text-xs text-muted-foreground mt-1">Toko hanya memiliki 1 paket</p>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="pt-6">
                <p className="text-sm text-muted-foreground">Stok Tersedia</p>
                <p className="text-3xl font-bold text-primary">{packageData?.available ?? 0}</p>
                <p className="text-xs text-muted-foreground mt-1">Siap dibeli</p>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="pt-6">
                <p className="text-sm text-muted-foreground">Potensi Pendapatan</p>
                <p className="text-3xl font-bold text-primary">
                  Rp {((packageData?.price || 0) * (packageData?.available || 0)).toLocaleString("id-ID")}
                </p>
                <p className="text-xs text-muted-foreground mt-1">Harga paket x stok</p>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="pt-6">
                <p className="text-sm text-muted-foreground">Diskon</p>
                <p className="text-3xl font-bold text-green-600">{discount}%</p>
                <p className="text-xs text-muted-foreground mt-1">Dari harga normal</p>
              </CardContent>
            </Card>
          </div>

          <Card>
            <CardHeader>
              <CardTitle>Paket Anda</CardTitle>
              <CardDescription>Ringkasan paket yang tampil ke pembeli</CardDescription>
            </CardHeader>
            <CardContent className="grid md:grid-cols-2 gap-4">
              {packageData ? (
                <>
                  <div className="space-y-2">
                    <p className="text-sm text-muted-foreground">Nama Paket</p>
                    <p className="text-lg font-semibold">{packageData.storeName}</p>
                    <p className="text-sm text-muted-foreground">Kategori: {packageData.category || "-"}</p>
                    <p className="text-sm text-muted-foreground">Pickup: {packageData.pickupTime || "-"}</p>
                    <p className="text-sm text-muted-foreground">Lokasi: {packageData.location || "-"}</p>
                  </div>
                  <div className="space-y-2">
                    <p className="text-sm text-muted-foreground">Harga</p>
                    <p className="text-xl font-bold text-primary">
                      Rp {packageData.price.toLocaleString("id-ID")}
                      <span className="text-sm text-muted-foreground line-through ml-2">
                        Rp {packageData.originalValue.toLocaleString("id-ID")}
                      </span>
                    </p>
                    <p className="text-sm text-muted-foreground">Stok: {packageData.available}</p>
                    <p className="text-sm text-muted-foreground">Diskon: {discount}%</p>
                  </div>
                </>
              ) : (
                <p className="text-muted-foreground text-sm">Belum ada paket. Buat di halaman Kelola Paket.</p>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    );
  };

  const renderPaketSection = () => (
    <div className="container space-y-6">
      <div className="text-center text-white">
        <h1 className="font-heading font-extrabold leading-none tracking-tight text-[42px] md:text-[78px] lg:text-[96px]">
          Kelola <span className="text-white/80">Paket</span>
        </h1>
      </div>

      <div className="max-w-5xl mx-auto rounded-3xl shadow-2xl border border-white/15 bg-white/90 backdrop-blur p-6 md:p-8 space-y-8">
        {!seller || !packageData ? (
          <Card>
            <CardHeader>
              <CardTitle>Belum Ada Paket</CardTitle>
              <CardDescription>Silakan lengkapi data paket untuk mulai berjualan.</CardDescription>
            </CardHeader>
          </Card>
        ) : (
          <>
            <Card>
              <CardHeader>
                <CardTitle>Informasi Toko</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <p className="text-sm text-muted-foreground">Nama Toko</p>
                    <p className="text-lg font-semibold">{seller.storeName}</p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Username</p>
                    <p className="text-lg font-semibold">{seller.username}</p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Email</p>
                    <p className="text-lg font-semibold">{seller.email}</p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Nomor HP</p>
                    <p className="text-lg font-semibold">{seller.phone}</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <Card>
                <CardContent className="pt-6">
                  <div className="text-center">
                    <p className="text-sm text-muted-foreground mb-2">Harga Paket</p>
                    <p className="text-3xl font-bold text-primary">
                      Rp {packageData.price.toLocaleString("id-ID")}
                    </p>
                  </div>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="pt-6">
                  <div className="text-center">
                    <p className="text-sm text-muted-foreground mb-2">Stok Tersedia</p>
                    <p className="text-3xl font-bold text-primary">{packageData.available}</p>
                  </div>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="pt-6">
                  <div className="text-center">
                    <p className="text-sm text-muted-foreground mb-2">Diskon</p>
                    <p className="text-3xl font-bold text-green-600">{discountPercentage}%</p>
                  </div>
                </CardContent>
              </Card>
            </div>

            <Card>
              <CardHeader>
                <CardTitle>Edit Paket Anda</CardTitle>
                <CardDescription>Lengkapi dan edit informasi paket toko Anda</CardDescription>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleSavePackage} className="space-y-6">
                  <div className="space-y-2">
                    <div className="border-2 border-dashed border-border rounded-lg p-8 text-center">
                      {imagePreview ? (
                        <div className="space-y-4">
                          <img
                            src={imagePreview}
                            alt="Preview paket"
                            className="h-64 w-full object-cover rounded-lg"
                          />
                          <Button
                            type="button"
                            variant="outline"
                            onClick={() => document.getElementById("image-input")?.click()}
                          >
                            <Upload className="h-4 w-4 mr-2" />
                            Ganti Foto
                          </Button>
                        </div>
                      ) : (
                        <div className="space-y-4">
                          <div className="inline-flex p-6 rounded-full bg-primary/10">
                            <ImageIcon className="h-8 w-8 text-primary" />
                          </div>
                          <div>
                            <p className="font-semibold text-foreground mb-2">Unggah Foto</p>
                            <p className="text-sm text-muted-foreground mb-4">
                              Klik tombol di bawah untuk memilih foto (maksimal 2MB)
                            </p>
                            <Button
                              type="button"
                              variant="outline"
                              onClick={() => document.getElementById("image-input")?.click()}
                            >
                              <Upload className="h-4 w-4 mr-2" />
                              Pilih Foto
                            </Button>
                          </div>
                        </div>
                      )}
                      <input
                        id="image-input"
                        type="file"
                        accept="image/*"
                        onChange={handleImageUpload}
                        className="hidden"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="location">Lokasi Toko</Label>
                      <Input
                        id="location"
                        placeholder="Contoh: Peuniti, Batoh, Lhambhuk"
                        value={formData.location}
                        onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="category">Kategori Paket</Label>
                      <Select
                        value={formData.category}
                        onValueChange={(value) => setFormData({ ...formData, category: value })}
                      >
                        <SelectTrigger id="category">
                          <SelectValue placeholder="Pilih kategori paket" />
                        </SelectTrigger>
                        <SelectContent>
                          {PACKAGE_CATEGORIES.map((cat) => (
                            <SelectItem key={cat.value} value={cat.value}>
                              {cat.label}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="price">Harga Paket (Rp)</Label>
                      <Input
                        id="price"
                        type="number"
                        placeholder="Contoh: 25000"
                        value={formData.price}
                        onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="originalValue">Harga Normal (Rp)</Label>
                      <Input
                        id="originalValue"
                        type="number"
                        placeholder="Contoh: 75000"
                        value={formData.originalValue}
                        onChange={(e) => setFormData({ ...formData, originalValue: e.target.value })}
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="available">Jumlah Paket Tersedia</Label>
                      <Input
                        id="available"
                        type="number"
                        placeholder="Contoh: 10"
                        value={formData.available}
                        onChange={(e) => setFormData({ ...formData, available: e.target.value })}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="pickupTime">Waktu Pengambilan</Label>
                      <Input
                        id="pickupTime"
                        placeholder="Contoh: 18:00 - 20:00"
                        value={formData.pickupTime}
                        onChange={(e) => setFormData({ ...formData, pickupTime: e.target.value })}
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="description">Deskripsi Paket</Label>
                    <Textarea
                      id="description"
                      placeholder="Jelaskan isi paket, bahan, cara pemesanan, dll..."
                      rows={5}
                      value={formData.description}
                      onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                    />
                  </div>

                  <Button
                    type="submit"
                    disabled={isSaving}
                    className="w-full bg-primary hover:bg-primary/90 py-6"
                    size="lg"
                  >
                    {isSaving ? "Menyimpan..." : "Simpan Paket"}
                  </Button>
                </form>
              </CardContent>
            </Card>

            <Card className="bg-blue-50 border-blue-200">
              <CardContent className="pt-6">
                <div className="space-y-2">
                  <p className="font-semibold text-foreground">Informasi Penting</p>
                  <ul className="text-sm text-muted-foreground space-y-1">
                    <li>Setiap toko hanya memiliki 1 paket</li>
                    <li>Anda dapat mengedit isi dan detail paket kapan saja</li>
                    <li>Paket akan langsung terlihat oleh pembeli setelah disimpan</li>
                    <li>Pastikan foto paket menarik agar pembeli tertarik</li>
                  </ul>
                </div>
              </CardContent>
            </Card>
          </>
        )}
      </div>
    </div>
  );

  const renderPesananSection = () => (
    <div className="container space-y-6">
      <div className="text-center text-white">
        <h1 className="font-heading font-extrabold leading-none tracking-tight text-[42px] md:text-[78px] lg:text-[96px]">
          Ulasan <span className="text-white/80">Toko</span>
        </h1>
      </div>

      <div className="max-w-5xl mx-auto rounded-3xl shadow-2xl border border-white/15 bg-white/90 backdrop-blur p-6 md:p-8 space-y-6">
        <Card>
          <CardHeader>
            <CardTitle>Ulasan Pelanggan</CardTitle>
            <CardDescription>Daftar ulasan untuk paket Anda</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {isReviewsLoading && <p className="text-sm text-muted-foreground">Memuat ulasan...</p>}
            {!isReviewsLoading && reviews.length === 0 && (
              <p className="text-sm text-muted-foreground">Belum ada ulasan.</p>
            )}
            {!isReviewsLoading && reviews.length > 0 && (
              <div className="space-y-3">
                {reviews.map((review) => (
                  <div key={review.id} className="p-3 border rounded-lg">
                    <div className="flex items-center justify-between">
                      <div className="font-semibold">{review.name}</div>
                      <Badge variant="secondary">{review.rating} / 5</Badge>
                    </div>
                    <p className="text-sm text-muted-foreground mt-1">{review.comment}</p>
                    <p className="text-xs text-muted-foreground mt-2">
                      {new Date(review.createdAt).toLocaleString("id-ID")}
                    </p>
                    {review.packageId && (
                      <p className="text-xs text-primary mt-1">Paket: {review.packageId}</p>
                    )}
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );

  const renderContent = () => {
    if (isLoading) {
      return (
        <div className="container">
          <div className="max-w-5xl mx-auto rounded-3xl shadow-2xl border border-white/15 bg-white/90 backdrop-blur p-8 text-center">
            <p className="text-muted-foreground">Memuat dashboard penjual...</p>
          </div>
        </div>
      );
    }

    if (isPesanan) {
      return renderPesananSection();
    }

    if (isPaket) {
      return renderPaketSection();
    }

    return renderDashboardSection();
  };

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

      <SellerHeader />

      <main className="flex-1 pt-24 md:pt-28 pb-12 relative z-10">{renderContent()}</main>

      <div className="relative z-10">
        <Footer />
      </div>
    </div>
  );
};

export default SellerHub;
