import { useState, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";
import { OrderService } from "@/services/OrderService";
import { AuthService } from "@/services/AuthService";
import { cn } from "@/lib/utils";

const Register = () => {
  const navigate = useNavigate();
  const [username, setUsername] = useState("");
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    const customerUser = localStorage.getItem("goodbite_user");
    if (customerUser) {
      navigate("/", { replace: true });
      return;
    }
    const sellerUser = localStorage.getItem("goodbite_seller");
    if (sellerUser) {
      toast.error("Anda sudah login sebagai penjual. Silakan logout terlebih dahulu untuk mendaftar sebagai pembeli.");
      navigate("/dashboard-penjual", { replace: true });
      return;
    }
  }, [navigate]);

  const validateEmail = (email: string) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  const validatePhone = (phone: string) => /^(08|62)[0-9]{9,11}$/.test(phone.replace(/\D/g, ""));

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    if (!username || !name || !email || !phone || !password || !confirmPassword) {
      toast.error("Mohon isi semua field");
      setIsLoading(false);
      return;
    }
    if (username.length < 3) {
      toast.error("Username minimal 3 karakter");
      setIsLoading(false);
      return;
    }
    if (!validateEmail(email)) {
      toast.error("Email tidak valid");
      setIsLoading(false);
      return;
    }
    if (!validatePhone(phone)) {
      toast.error("Nomor HP tidak valid. Gunakan format 08xxxxxxxxxx atau 628xxxxxxxxxx");
      setIsLoading(false);
      return;
    }
    if (password.length < 6) {
      toast.error("Password minimal 6 karakter");
      setIsLoading(false);
      return;
    }
    if (password !== confirmPassword) {
      toast.error("Password tidak cocok");
      setIsLoading(false);
      return;
    }

    try {
      const result = await AuthService.registerCustomer({
        username,
        name,
        email,
        phone,
        password,
        confirmPassword,
      });

      localStorage.setItem("goodbite_user", JSON.stringify(result.user));
      OrderService.getInstance().switchUser(phone);

      toast.success("Akun berhasil dibuat! Selamat datang!");
      navigate("/jelajahi");
    } catch (error: any) {
      toast.error(error.message || "Gagal mendaftar");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col" style={{ backgroundColor: "#e6e7e8" }}>

      <main className="flex-1 flex items-center justify-center py-16 md:py-24 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-96 h-96 bg-accent/10 rounded-full blur-3xl" />
        <div className="absolute bottom-0 left-0 w-96 h-96 bg-primary/10 rounded-full blur-3xl" />

        <div className="container max-w-lg relative z-10">
          <div className="shadow-input mx-auto w-full rounded-none bg-white p-4 md:rounded-2xl md:p-8 dark:bg-black">
            <h2 className="text-xl font-bold text-neutral-800 dark:text-neutral-200">Buat Akun GoodBite</h2>
            <p className="mt-2 max-w-sm text-sm text-neutral-600 dark:text-neutral-300">
              Daftar untuk mulai berhemat, selamatkan makanan, dan dukung UMKM lokal.
            </p>

            <form onSubmit={handleRegister} className="my-8 space-y-4">
              <LabelInputContainer>
                <Label htmlFor="username">Username</Label>
                <Input
                  id="username"
                  placeholder="username (min 3 karakter)"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                />
              </LabelInputContainer>

              <LabelInputContainer>
                <Label htmlFor="name">Nama Lengkap</Label>
                <Input
                  id="name"
                  placeholder="Masukkan nama Anda"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                />
              </LabelInputContainer>

              <LabelInputContainer>
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="your@email.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
              </LabelInputContainer>

              <LabelInputContainer>
                <Label htmlFor="phone">Nomor HP</Label>
                <Input
                  id="phone"
                  type="tel"
                  placeholder="08xxxxxxxxxx"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                />
              </LabelInputContainer>

              <LabelInputContainer>
                <Label htmlFor="password">Password</Label>
                <Input
                  id="password"
                  type="password"
                  placeholder="Min. 6 karakter"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                />
              </LabelInputContainer>

              <LabelInputContainer>
                <Label htmlFor="confirmPassword">Konfirmasi Password</Label>
                <Input
                  id="confirmPassword"
                  type="password"
                  placeholder="Masukkan password lagi"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                />
              </LabelInputContainer>

              <button
                type="submit"
                disabled={isLoading}
                className="group/btn relative block h-12 w-full rounded-md bg-gradient-to-br from-black to-neutral-600 font-medium text-white shadow-[0px_1px_0px_0px_#ffffff40_inset,0px_-1px_0px_0px_#ffffff40_inset] disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isLoading ? "Membuat Akun..." : "Daftar Sekarang"}
                <BottomGradient />
              </button>

              <p className="text-center text-xs text-muted-foreground">
                Dengan mendaftar, Anda menyetujui{" "}
                <span className="text-black font-semibold">Syarat & Ketentuan</span> kami
              </p>

              <div className="pt-4 border-t">
                <p className="text-center text-sm text-muted-foreground">
                  Sudah punya akun?{" "}
                  <Link to="/login" className="text-black font-semibold hover:underline">
                    Masuk di sini
                  </Link>
                </p>
              </div>
            </form>
          </div>
        </div>
      </main>

    </div>
  );
};

const BottomGradient = () => (
  <>
    <span className="absolute inset-x-0 -bottom-px block h-px w-full bg-gradient-to-r from-transparent via-cyan-500 to-transparent opacity-0 transition duration-500 group-hover/btn:opacity-100" />
    <span className="absolute inset-x-10 -bottom-px mx-auto block h-px w-1/2 bg-gradient-to-r from-transparent via-indigo-500 to-transparent opacity-0 blur-sm transition duration-500 group-hover/btn:opacity-100" />
  </>
);

const LabelInputContainer = ({ children, className }: { children: React.ReactNode; className?: string }) => (
  <div className={cn("flex w-full flex-col space-y-2", className)}>{children}</div>
);

export default Register;
