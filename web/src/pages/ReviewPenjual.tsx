import { useEffect, useState } from "react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Card, CardContent } from "@/components/ui/card";
import { toast } from "sonner";
import { AuthService } from "@/services/AuthService";

interface Seller {
  id: string;
  storeName: string;
}

interface Package {
  id: string;
  storeName: string;
}

const ReviewPenjual = () => {
  const [sellers, setSellers] = useState<Seller[]>([]);
  const [packages, setPackages] = useState<Package[]>([]);
  const [sellerId, setSellerId] = useState("");
  const [packageId, setPackageId] = useState("");
  const [name, setName] = useState("");
  const [rating, setRating] = useState<number>(5);
  const [comment, setComment] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    const loadSellers = async () => {
      try {
        const data = await AuthService.getAllSellers();
        setSellers(data || []);
      } catch (error) {
        console.error("Failed to load sellers", error);
        toast.error("Gagal memuat daftar penjual");
      }
    };

    loadSellers();
  }, []);

  useEffect(() => {
    if (!sellerId) {
      setPackages([]);
      setPackageId("");
      return;
    }

    const loadPackages = async () => {
      try {
        const data = await AuthService.getSellerPackages(sellerId);
        setPackages(data || []);
        setPackageId("");
      } catch (error) {
        console.error("Failed to load packages", error);
        toast.error("Gagal memuat paket penjual");
      }
    };

    loadPackages();
  }, [sellerId]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!sellerId || !packageId || !name || !comment) {
      toast.error("Lengkapi semua kolom sebelum kirim");
      return;
    }

    try {
      setIsSubmitting(true);
      await AuthService.createPackageReview(packageId, {
        name,
        rating,
        comment,
        sellerId,
      });
      toast.success("Review berhasil dikirim");
      setComment("");
      setRating(5);
    } catch (error: any) {
      console.error("Failed to submit review", error);
      toast.error(error?.message || "Gagal mengirim review");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-b from-background via-primary/5 to-background">
      <Header />

      <main className="flex-1 pt-24 pb-16">
        <div className="container max-w-3xl">
          <h1 className="text-3xl md:text-4xl font-bold text-foreground mb-4">Tulis Review Penjual</h1>
          <p className="text-muted-foreground mb-8">
            Bagikan pengalaman Anda agar pengguna lain dapat memilih penjual terbaik.
          </p>

          <Card className="shadow-lg">
            <CardContent className="p-6 md:p-8">
              <form className="space-y-6" onSubmit={handleSubmit}>
                <div className="space-y-2">
                  <label className="text-sm font-medium text-foreground">Pilih Penjual</label>
                  <Select value={sellerId} onValueChange={setSellerId}>
                    <SelectTrigger>
                      <SelectValue placeholder="Pilih penjual" />
                    </SelectTrigger>
                    <SelectContent>
                      {sellers.map((seller) => (
                        <SelectItem key={seller.id} value={seller.id}>
                          {seller.storeName}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-medium text-foreground">Pilih Paket</label>
                  <Select value={packageId} onValueChange={setPackageId} disabled={!packages.length}>
                    <SelectTrigger>
                      <SelectValue placeholder="Pilih paket dari penjual" />
                    </SelectTrigger>
                    <SelectContent>
                      {packages.map((pkg) => (
                        <SelectItem key={pkg.id} value={pkg.id}>
                          {pkg.storeName}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-medium text-foreground">Nama Anda</label>
                  <Input
                    placeholder="Nama"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                  />
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-medium text-foreground">Rating</label>
                  <Select value={String(rating)} onValueChange={(val) => setRating(Number(val))}>
                    <SelectTrigger>
                      <SelectValue placeholder="Pilih rating" />
                    </SelectTrigger>
                    <SelectContent>
                      {[5, 4, 3, 2, 1].map((r) => (
                        <SelectItem key={r} value={String(r)}>
                          {r} bintang
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-medium text-foreground">Komentar</label>
                  <Textarea
                    rows={4}
                    placeholder="Bagikan pengalaman Anda"
                    value={comment}
                    onChange={(e) => setComment(e.target.value)}
                  />
                </div>

                <Button type="submit" className="w-full" disabled={isSubmitting}>
                  {isSubmitting ? "Mengirim..." : "Kirim Review"}
                </Button>
              </form>
            </CardContent>
          </Card>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default ReviewPenjual;
