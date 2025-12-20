import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { Wallet, UtensilsCrossed, Store, Target, Heart, Users } from "lucide-react";

const Tentang = () => {
  const faqs = [
    {
      question: "Apa itu GoodBite?",
      answer: "GoodBite adalah platform yang menghubungkan konsumen dengan restoran dan toko yang memiliki makanan sisa berkualitas. Kami membantu mengurangi food waste sambil memberikan harga terjangkau kepada pelanggan."
    },
    {
      question: "Bagaimana cara kerja surprise bag?",
      answer: "Surprise bag adalah paket berisi makanan sisa dari restoran atau toko yang masih layak konsumsi. Anda memesan paket dengan harga murah, kemudian mengambilnya pada waktu yang ditentukan. Isi paket adalah kejutan yang ditentukan oleh toko."
    },
    {
      question: "Bagaimana cara memesan?",
      answer: "Daftar atau login terlebih dahulu, jelajahi paket yang tersedia, pilih paket yang Anda inginkan, lakukan pemesanan, dan ambil paket pada waktu yang ditentukan dengan menunjukkan kode konfirmasi."
    },
    {
      question: "Kapan pembayaran dilakukan?",
      answer: "Pembayaran dilakukan di tempat saat Anda mengambil paket. Pastikan membawa uang tunai sesuai harga paket yang tertera."
    },
    {
      question: "Bagaimana jika saya tidak bisa mengambil paket?",
      answer: "Mohon pastikan Anda dapat mengambil paket pada waktu yang ditentukan. Jika tidak, pesanan akan otomatis kadaluarsa dan paket akan diberikan ke pelanggan lain."
    },
    {
      question: "Apakah makanan dalam surprise bag masih segar?",
      answer: "Ya! Semua makanan dalam surprise bag masih berkualitas baik dan layak konsumsi. Ini adalah makanan sisa yang tidak terjual di hari tersebut, bukan makanan kadaluarsa."
    }
  ];

  const values = [
    {
      icon: Target,
      title: "Misi Kami",
      description: "Mengurangi food waste dan dampak lingkungan di Indonesia",
      color: "from-primary/20 to-primary/5"
    },
    {
      icon: Heart,
      title: "Nilai Kami",
      description: "Peduli lingkungan dan komunitas berkelanjutan",
      color: "from-accent/20 to-accent/5"
    },
    {
      icon: Users,
      title: "Komunitas",
      description: "Membangun ekosistem yang saling menguntungkan",
      color: "from-primary/20 to-accent/10"
    }
  ];

  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-b from-background via-primary/5 to-background">
      <Header />
      
      <main className="flex-1 pt-24 md:pt-28">
        <section className="py-16 md:py-24 bg-gradient-to-br from-primary/10 via-accent/5 to-background relative overflow-hidden">
          <div className="absolute top-0 right-0 w-96 h-96 bg-accent/10 rounded-full blur-3xl" />
          <div className="absolute bottom-0 left-0 w-96 h-96 bg-primary/10 rounded-full blur-3xl" />
          
          <div className="container max-w-4xl relative z-10">
            <div className="text-center space-y-6">
              <Badge className="bg-primary/10 text-primary border-none px-6 py-2 text-base">
                Tentang Kami
              </Badge>
              <h1 className="font-heading text-4xl md:text-5xl lg:text-6xl font-bold text-foreground">
                Tentang <span className="text-primary">GoodBite</span>
              </h1>
              <p className="text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto leading-relaxed">
                Platform inovatif yang menghubungkan konsumen dengan restoran, 
                kafe, dan toko roti yang memiliki makanan sisa berkualitas tinggi
              </p>
            </div>
          </div>
        </section>

        <section className="py-16 md:py-20">
          <div className="container max-w-4xl">
            <div className="bg-white rounded-3xl shadow-xl p-8 md:p-12 space-y-8">
              <div className="space-y-6 text-muted-foreground leading-relaxed">
                <p className="text-lg first-letter:text-6xl first-letter:font-bold first-letter:text-primary first-letter:mr-3 first-letter:float-left">
                  Setiap hari, jutaan ton makanan terbuang sia-sia meskipun masih layak konsumsi. 
                  GoodBite hadir sebagai solusi untuk mengurangi food waste sambil membantu konsumen 
                  menghemat uang dan mendukung bisnis lokal.
                </p>
                <p>
                  Dengan sistem surprise bag, pelanggan dapat membeli makanan berkualitas dengan 
                  harga hingga 70% lebih murah. Isi paket adalah kejutan yang dipilih oleh toko, 
                  memberikan pengalaman yang menyenangkan sekaligus berkelanjutan.
                </p>
                <p>
                  Kami percaya bahwa setiap makanan berharga dan setiap tindakan kecil dapat membuat 
                  perbedaan besar bagi lingkungan dan komunitas kita.
                </p>
              </div>
            </div>
          </div>
        </section>

        <section className="py-16 md:py-20 bg-gradient-to-b from-background to-white">
          <div className="container max-w-6xl">
            <div className="text-center mb-12">
              <h2 className="font-heading text-3xl md:text-4xl font-bold text-foreground mb-4">
                Nilai dan Misi Kami
              </h2>
            </div>
            
            <div className="grid md:grid-cols-3 gap-8">
              {values.map((value, index) => (
                <Card key={index} className="border-none shadow-lg hover:shadow-xl transition-all duration-500 group hover:-translate-y-2">
                  <CardContent className={"p-8 bg-gradient-to-br " + value.color + " rounded-3xl"}>
                    <div className="text-center space-y-4">
                      <div className="inline-flex p-6 rounded-2xl bg-white/50 backdrop-blur-sm group-hover:scale-110 transition-transform duration-500">
                        <value.icon className="h-10 w-10 text-primary" />
                      </div>
                      <h3 className="font-heading text-xl font-bold text-foreground">{value.title}</h3>
                      <p className="text-muted-foreground">{value.description}</p>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </section>

        <section className="py-16 md:py-20">
          <div className="container max-w-4xl">
            <Card className="bg-gradient-to-br from-primary to-primary/80 border-none shadow-2xl overflow-hidden rounded-3xl">
              <CardContent className="p-10 md:p-14 relative">
                <div className="absolute top-0 right-0 w-64 h-64 bg-accent/20 rounded-full blur-3xl" />
                <div className="relative z-10">
                  <h2 className="font-heading text-3xl md:text-4xl font-bold text-white mb-8">Komitmen Kami</h2>
                  <ul className="space-y-5">
                    <li className="flex items-start gap-4 group/item">
                      <div className="w-12 h-12 bg-white/10 rounded-xl flex items-center justify-center flex-shrink-0 group-hover/item:bg-accent group-hover/item:scale-110 transition-all">
                        <UtensilsCrossed className="h-6 w-6 text-white" />
                      </div>
                      <span className="text-white/90 text-lg pt-2">Mengurangi food waste dan dampak lingkungan di Indonesia</span>
                    </li>
                    <li className="flex items-start gap-4 group/item">
                      <div className="w-12 h-12 bg-white/10 rounded-xl flex items-center justify-center flex-shrink-0 group-hover/item:bg-accent group-hover/item:scale-110 transition-all">
                        <Wallet className="h-6 w-6 text-white" />
                      </div>
                      <span className="text-white/90 text-lg pt-2">Memberikan akses makanan berkualitas dengan harga terjangkau</span>
                    </li>
                    <li className="flex items-start gap-4 group/item">
                      <div className="w-12 h-12 bg-white/10 rounded-xl flex items-center justify-center flex-shrink-0 group-hover/item:bg-accent group-hover/item:scale-110 transition-all">
                        <Store className="h-6 w-6 text-white" />
                      </div>
                      <span className="text-white/90 text-lg pt-2">Mendukung pertumbuhan UMKM dan bisnis lokal</span>
                    </li>
                    <li className="flex items-start gap-4 group/item">
                      <div className="w-12 h-12 bg-white/10 rounded-xl flex items-center justify-center flex-shrink-0 group-hover/item:bg-accent group-hover/item:scale-110 transition-all">
                        <Users className="h-6 w-6 text-white" />
                      </div>
                      <span className="text-white/90 text-lg pt-2">Membangun komunitas yang peduli lingkungan dan berkelanjutan</span>
                    </li>
                  </ul>
                </div>
              </CardContent>
            </Card>
          </div>
        </section>

        <section className="py-16 md:py-20 bg-gradient-to-b from-white to-background">
          <div className="container max-w-4xl">
            <div className="text-center mb-12">
              <Badge className="bg-accent/10 text-accent border-none mb-4">FAQ</Badge>
              <h2 className="font-heading text-3xl md:text-4xl font-bold text-foreground mb-4">
                Pertanyaan Umum
              </h2>
              <p className="text-muted-foreground">
                Temukan jawaban untuk pertanyaan yang sering ditanyakan
              </p>
            </div>
            
            <Accordion type="single" collapsible className="space-y-4">
              {faqs.map((faq, index) => (
                <AccordionItem
                  key={index}
                  value={"item-" + index}
                  className="border-none bg-white rounded-2xl shadow-md hover:shadow-lg transition-shadow px-6"
                >
                  <AccordionTrigger className="text-left font-bold text-foreground hover:no-underline hover:text-primary py-6">
                    {faq.question}
                  </AccordionTrigger>
                  <AccordionContent className="text-muted-foreground leading-relaxed pb-6">
                    {faq.answer}
                  </AccordionContent>
                </AccordionItem>
              ))}
            </Accordion>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
};

export default Tentang;
