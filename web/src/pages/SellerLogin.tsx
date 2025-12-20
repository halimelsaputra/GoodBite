import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";
import { AuthService } from "@/services/AuthService";
import { cn } from "@/lib/utils";

const SellerLogin = () => {
  const navigate = useNavigate();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");

  useEffect(() => {
    const customerUser = localStorage.getItem("goodbite_user");
    if (customerUser) {
      toast.error("Anda sudah login sebagai pembeli. Silakan logout terlebih dahulu untuk login sebagai penjual.");
      navigate("/", { replace: true });
      return;
    }

    const sellerUser = localStorage.getItem("goodbite_seller");
    if (sellerUser) {
      navigate("/dashboard-penjual", { replace: true });
      return;
    }
  }, [navigate]);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!username || !password) {
      toast.error("Mohon isi semua field");
      return;
    }

    try {
      const result = await AuthService.loginSeller(username, password);
      localStorage.setItem("goodbite_seller", JSON.stringify(result.seller));

      toast.success("Berhasil masuk!");
      navigate("/dashboard-penjual");
    } catch (error: any) {
      toast.error(error.message || "Gagal login");
    }
  };

  return (
    <div className="min-h-screen flex flex-col" style={{ backgroundColor: "#e6e7e8" }}>
      <main className="flex-1 flex items-center justify-center py-24 md:py-32 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-96 h-96 bg-accent/10 rounded-full blur-3xl" />
        <div className="absolute bottom-0 left-0 w-96 h-96 bg-primary/10 rounded-full blur-3xl" />

        <div className="container relative z-10 max-w-lg">
          <div className="shadow-input mx-auto w-full rounded-none bg-white p-4 md:rounded-2xl md:p-8 dark:bg-black">
            <h2 className="text-xl font-bold text-neutral-800 dark:text-neutral-200">Masuk Penjual</h2>
            <p className="mt-2 max-w-sm text-sm text-neutral-600 dark:text-neutral-300">
              Masuk untuk kelola toko dan paket jualan Anda.
            </p>

            <form className="my-8 space-y-6" onSubmit={handleLogin}>
              <LabelInputContainer>
                <Label htmlFor="username">Username</Label>
                <Input
                  id="username"
                  placeholder="Masukkan username Anda"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                />
              </LabelInputContainer>

              <LabelInputContainer>
                <Label htmlFor="password">Password</Label>
                <Input
                  id="password"
                  type="password"
                  placeholder="Masukkan password Anda"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                />
              </LabelInputContainer>

              <button
                type="submit"
                className="group/btn relative block h-12 w-full rounded-md bg-gradient-to-br from-black to-neutral-600 font-medium text-white shadow-[0px_1px_0px_0px_#ffffff40_inset,0px_-1px_0px_0px_#ffffff40_inset]"
              >
                Masuk Sekarang
                <BottomGradient />
              </button>

              <p className="text-center text-sm text-muted-foreground">
                Dengan masuk, Anda menyetujui <span className="text-black font-semibold">Syarat & Ketentuan</span> kami
              </p>

              <div className="pt-4 border-t">
                <p className="text-center text-sm text-muted-foreground">
                  Belum punya akun?{" "}
                  <Link to="/seller-register" className="text-black font-semibold hover:underline">
                    Daftar di sini
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

export default SellerLogin;
