import { useState, useMemo } from "react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import PackageCard from "@/components/PackageCard";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Search } from "lucide-react";
import { packages } from "@/data/packages";

const Jelajahi = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("semua");
  const [locationFilter, setLocationFilter] = useState("semua");
  const [sortBy, setSortBy] = useState("terbaru");

  const categories = ["semua", ...Array.from(new Set(packages.map(p => p.category)))];
  // Fixed locations: Peuniti, Batoh, Lhambhuk, Darussalam
  const locations = ["semua", "Peuniti", "Batoh", "Lhambhuk", "Darussalam"];

  const filteredPackages = useMemo(() => {
    let filtered = [...packages];

    // Search filter
    if (searchQuery) {
      filtered = filtered.filter(pkg =>
        pkg.storeName.toLowerCase().includes(searchQuery.toLowerCase()) ||
        pkg.location.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    // Category filter
    if (categoryFilter !== "semua") {
      filtered = filtered.filter(pkg => pkg.category === categoryFilter);
    }

    // Location filter
    if (locationFilter !== "semua") {
      filtered = filtered.filter(pkg => pkg.location === locationFilter);
    }

    // Sort
    if (sortBy === "hemat") {
      filtered.sort((a, b) => {
        const discountA = ((a.originalValue - a.price) / a.originalValue) * 100;
        const discountB = ((b.originalValue - b.price) / b.originalValue) * 100;
        return discountB - discountA;
      });
    } else if (sortBy === "harga-rendah") {
      filtered.sort((a, b) => a.price - b.price);
    } else if (sortBy === "harga-tinggi") {
      filtered.sort((a, b) => b.price - a.price);
    }

    return filtered;
  }, [searchQuery, categoryFilter, locationFilter, sortBy]);

  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-b from-background via-primary/5 to-background">
      <Header />
      
      <main className="flex-1 pt-24 md:pt-28 pb-16">
        {/* Hero Header */}
        <section className="py-12 md:py-16 bg-gradient-to-br from-primary/10 via-accent/5 to-background relative overflow-hidden">
          <div className="absolute top-0 right-0 w-96 h-96 bg-accent/10 rounded-full blur-3xl" />
          <div className="absolute bottom-0 left-0 w-96 h-96 bg-primary/10 rounded-full blur-3xl" />
          
          <div className="container relative z-10">
            <div className="max-w-3xl mx-auto text-center space-y-4">
              <h1 className="font-heading text-4xl md:text-5xl lg:text-6xl font-bold text-foreground">
                Jelajahi Surprise <span className="text-primary">Bag</span>
              </h1>
              <p className="text-lg md:text-xl text-muted-foreground">
                Temukan surprise bag terbaik dari restoran di sekitar Anda
              </p>
            </div>
          </div>
        </section>

        <div className="container mt-12">
          {/* Enhanced Filters */}
          <div className="bg-white rounded-3xl shadow-xl p-6 md:p-8 mb-10 border border-border/50">
            <div className="grid md:grid-cols-4 gap-4 mb-6">
              <div className="relative md:col-span-2">
                <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 h-5 w-5 text-primary" />
                <Input
                  placeholder="Cari toko atau lokasi..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-12 h-12 rounded-full border-2 focus:border-primary"
                />
              </div>

              <Select value={categoryFilter} onValueChange={setCategoryFilter}>
                <SelectTrigger className="h-12 rounded-full border-2">
                  <SelectValue placeholder="Kategori" />
                </SelectTrigger>
                <SelectContent>
                  {categories.map(cat => (
                    <SelectItem key={cat} value={cat}>
                      {cat === "semua" ? "Semua Kategori" : cat}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>

              <Select value={locationFilter} onValueChange={setLocationFilter}>
                <SelectTrigger className="h-12 rounded-full border-2">
                  <SelectValue placeholder="Lokasi" />
                </SelectTrigger>
                <SelectContent>
                  {locations.map(loc => (
                    <SelectItem key={loc} value={loc}>
                      {loc === "semua" ? "Semua Lokasi" : loc}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
              <p className="text-sm font-semibold text-foreground">
              </p>
              <Select value={sortBy} onValueChange={setSortBy}>
                <SelectTrigger className="w-full sm:w-[200px] h-11 rounded-full border-2">
                  <SelectValue placeholder="Urutkan" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="terbaru"> Terbaru</SelectItem>
                  <SelectItem value="hemat"> Hemat Terbesar</SelectItem>
                  <SelectItem value="harga-rendah"> Harga Terendah</SelectItem>
                  <SelectItem value="harga-tinggi"> Harga Tertinggi</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* Package Grid */}
          {filteredPackages.length > 0 ? (
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-8">
              {filteredPackages.map(pkg => (
                <PackageCard key={pkg.id} package={pkg} />
              ))}
            </div>
          ) : (
            <div className="text-center py-20">
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
      </main>

      <Footer />
    </div>
  );
};

export default Jelajahi;
