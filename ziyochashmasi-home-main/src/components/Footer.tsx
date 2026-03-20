import { Link } from "react-router-dom";
import { Phone, Mail, MapPin } from "lucide-react";
import logo from "@/assets/logo.png";
import { useLanguage } from "@/contexts/LanguageContext";

const Footer = () => {
  const { t } = useLanguage();

  return (
    <footer className="bg-foreground text-background">
      <div className="container py-12">
        {/* Logo Section */}
        <div className="flex items-center gap-3 mb-10 pb-6 border-b border-background/10">
          <img src={logo} alt="Ziyo Chashmasi" className="h-12 w-12" />
          <span className="font-display font-bold text-2xl tracking-wide">Ziyo Chashmasi</span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
          {/* Menu */}
          <div>
            <h4 className="font-bold text-lg mb-5 text-primary">Menyu</h4>
            <ul className="space-y-3 text-sm opacity-80">
              <li><Link to="/about" className="hover:text-primary transition-colors">Biz haqimizda</Link></li>
              <li><Link to="/catalog" className="hover:text-primary transition-colors">Katalog</Link></li>
              <li><Link to="/delivery" className="hover:text-primary transition-colors">Yetkazib berish</Link></li>
              <li><Link to="/contact" className="hover:text-primary transition-colors">Biz bilan aloqa</Link></li>
              <li><Link to="/news" className="hover:text-primary transition-colors">Yangiliklar</Link></li>
            </ul>
          </div>

          {/* Contacts */}
          <div>
            <h4 className="font-bold text-lg mb-5 text-primary">Kontaktlar</h4>
            <ul className="space-y-5 text-sm opacity-80">
              <li className="flex items-start gap-4">
                <MapPin className="w-5 h-5 shrink-0 mt-1 text-primary" />
                <span className="leading-relaxed">
                  <strong className="block mb-1 text-foreground mix-blend-difference">Joylashuv:</strong>
                  Qashqadaryo viloyati, Kukdala tumanidagi kutubxona<br/>
                  Kukdala tumani markazi, Oqtunli qishlog'i
                </span>
              </li>
              <li className="flex items-start gap-4">
                <Phone className="w-5 h-5 shrink-0 mt-1 text-primary" />
                <div className="flex flex-col gap-1.5">
                  <a href="tel:+998931358100" className="hover:text-primary transition-colors font-medium text-base">+998 93 135 81 00</a>
                  <a href="tel:+998952227002" className="hover:text-primary transition-colors font-medium text-base">+998 95 222 70 02</a>
                </div>
              </li>
              <li className="flex items-center gap-4">
                <Mail className="w-5 h-5 shrink-0 text-primary" />
                <a href="mailto:info@ziyochashmasi.uz" className="hover:text-primary transition-colors">info@ziyochashmasi.uz</a>
              </li>
            </ul>
          </div>

          {/* Social */}
          <div>
            <h4 className="font-bold text-lg mb-5 text-primary">Ijtimoiy tarmoqlar</h4>
            <p className="text-sm opacity-80 mb-6 leading-relaxed">
              Bizning ijtimoiy tarmoqlardagi sahifalarimizga obuna bo'ling va eng so'nggi yangiliklardan xabardor bo'ling.
            </p>
            <div className="flex gap-4">
              <a href="https://t.me/Ziyo_kutibxonasi" target="_blank" rel="noopener noreferrer"
                className="w-10 h-10 rounded-full bg-background/10 border border-background/20 flex items-center justify-center hover:bg-primary hover:border-primary transition-all text-base font-bold shadow-sm">
                ✈️
              </a>
              <a href="#" aria-label="Instagram"
                className="w-10 h-10 rounded-full bg-background/10 border border-background/20 flex items-center justify-center hover:bg-primary hover:border-primary transition-all text-base font-bold shadow-sm">
                📷
              </a>
              <a href="#" aria-label="Facebook"
                className="w-10 h-10 rounded-full bg-background/10 border border-background/20 flex items-center justify-center hover:bg-primary hover:border-primary transition-all text-base font-bold shadow-sm">
                f
              </a>
            </div>
          </div>
        </div>

        <div className="border-t border-background/20 mt-12 pt-8 flex flex-col md:flex-row justify-between items-center gap-4 text-sm opacity-60">
          <span className="font-medium">© 2026 Ziyo Chashmasi. Kukdala tumani markazi & Oqtunli qishlog'i.</span>
          <div className="flex gap-6 font-medium">
            <Link to="/privacy" className="hover:text-primary transition-colors">Maxfiylik siyosati</Link>
            <Link to="/terms" className="hover:text-primary transition-colors">Ommaviy oferta</Link>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
