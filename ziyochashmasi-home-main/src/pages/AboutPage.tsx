import { Link } from "react-router-dom";
import { MapPin, Phone, Clock } from "lucide-react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";

const AboutPage = () => {
  return (
    <div className="min-h-screen bg-background">
      <Header />
      <div className="container py-10 max-w-3xl">
        <h1 className="font-display text-3xl font-bold text-foreground mb-6">
          Biz haqimizda
        </h1>

        <div className="space-y-6 text-muted-foreground leading-relaxed">
          <p>
            <strong className="text-foreground">Ziyo Chashmasi</strong> kutubxonasi
            Qashqadaryo viloyatining Kukdala tumanida joylashgan bo'lib, 2018-yildan beri
            mintaqaning kitobxonlariga xizmat ko'rsatib kelmoqda.
          </p>
          <p>
            Bizning maqsadimiz — o'quvchilarimizga eng keng tanlovdagi sifatli kitoblarni
            qulay narxlarda taqdim etish va bilim olamiga yo'l ochish.
          </p>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 my-8">
            {[
              { value: "5,000+", label: "Nomdagi kitoblar" },
              { value: "10,000+", label: "Faol kitobxonlar" },
              { value: "2", label: "Filiallar" },
            ].map((s) => (
              <div key={s.label} className="bg-card border border-border rounded-xl p-4 text-center">
                <span className="font-display text-3xl font-bold text-primary">{s.value}</span>
                <p className="text-sm mt-1">{s.label}</p>
              </div>
            ))}
          </div>

          <h2 className="font-bold text-xl text-foreground">Filiallar</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {[
              { name: "Kukdala tumani markazi", address: "Kukdala tumani, Markaziy ko'cha" },
              { name: "Oqtunli qishlog'i", address: "Kukdala tumani, Oqtunli MFY" },
            ].map((branch) => (
              <div key={branch.name} className="bg-card border border-border rounded-xl p-4">
                <h3 className="font-bold text-foreground mb-2">{branch.name}</h3>
                <p className="text-sm flex items-start gap-1.5">
                  <MapPin className="w-3.5 h-3.5 mt-0.5 shrink-0" />
                  {branch.address}
                </p>
                <p className="text-sm flex items-center gap-1.5 mt-1.5">
                  <Clock className="w-3.5 h-3.5 shrink-0" />
                  Ish vaqti: Du–Sha, 9:00 – 18:00
                </p>
              </div>
            ))}
          </div>
        </div>

        <div className="mt-8">
          <Link to="/contact" className="px-5 py-2.5 bg-primary text-primary-foreground font-bold rounded-xl hover:opacity-90 transition-opacity inline-block">
            Biz bilan bog'lanish →
          </Link>
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default AboutPage;
