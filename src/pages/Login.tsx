import { useState } from "react";
import { useNavigate } from "react-router-dom";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { toast } from "sonner";

const Login = () => {
  const navigate = useNavigate();
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!name || !phone) {
      toast.error("Mohon isi semua field");
      return;
    }

    const user = {
      name,
      phone,
      createdAt: new Date().toISOString()
    };

    localStorage.setItem("goodbite_user", JSON.stringify(user));
    toast.success("Berhasil masuk!");
    navigate("/jelajahi");
  };

  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-br from-primary/5 via-background to-accent/5">
      <Header />
      
      <main className="flex-1 flex items-center justify-center py-24 md:py-32 relative overflow-hidden">
        {/* Decorative elements */}
        <div className="absolute top-0 right-0 w-96 h-96 bg-accent/10 rounded-full blur-3xl" />
        <div className="absolute bottom-0 left-0 w-96 h-96 bg-primary/10 rounded-full blur-3xl" />
        
        <div className="container max-w-md relative z-10">
          <Card className="shadow-2xl border-none rounded-3xl overflow-hidden">
            {/* Header with gradient */}
            <div className="bg-gradient-to-br from-primary to-primary/80 p-8 text-center relative overflow-hidden">
              <div className="absolute top-0 right-0 w-40 h-40 bg-accent/20 rounded-full blur-2xl" />
              <div className="relative z-10">
                <div className="inline-flex p-4 rounded-full bg-white/10 backdrop-blur-sm mb-4">
                  <svg className="w-12 h-12 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                  </svg>
                </div>
                <CardTitle className="text-3xl font-bold text-white mb-2">Selamat Datang!</CardTitle>
                <CardDescription className="text-white/90 text-base">
                  Masuk untuk mulai berhemat dan selamatkan makanan
                </CardDescription>
              </div>
            </div>
            
            <CardContent className="p-8">
              <form onSubmit={handleLogin} className="space-y-6">
                <div className="space-y-2">
                  <Label htmlFor="name" className="text-base font-semibold">Nama Lengkap</Label>
                  <Input
                    id="name"
                    placeholder="Masukkan nama Anda"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="h-12 rounded-xl border-2 focus:border-primary"
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="phone" className="text-base font-semibold">Nomor HP</Label>
                  <Input
                    id="phone"
                    type="tel"
                    placeholder="08xxxxxxxxxx"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    className="h-12 rounded-xl border-2 focus:border-primary"
                  />
                </div>

                <Button type="submit" className="w-full h-12 rounded-xl text-base font-semibold bg-primary hover:bg-primary/90 shadow-lg hover:shadow-xl hover:scale-105 transition-all">
                  Masuk Sekarang
                </Button>
                
                <p className="text-center text-sm text-muted-foreground">
                  Dengan masuk, Anda menyetujui <span className="text-primary">Syarat & Ketentuan</span> kami
                </p>
              </form>
            </CardContent>
          </Card>
          
          {/* Trust badge */}
          <div className="mt-8 text-center">
            <p className="text-sm text-muted-foreground">
              💚 Dipercaya oleh <span className="font-bold text-primary">50,000+</span> pengguna di Indonesia
            </p>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default Login;
