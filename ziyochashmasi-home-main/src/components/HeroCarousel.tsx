import { useState, useEffect } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import heroBanner1 from "@/assets/hero-banner-1.jpg";
import heroBanner2 from "@/assets/hero-banner-2.jpg";
import heroBanner3 from "@/assets/hero-banner-3.jpg";
import { useLanguage } from "@/contexts/LanguageContext";

const banners = [
  { src: heroBanner1, alt: "Kutubxona ichki ko'rinishi" },
  { src: heroBanner2, alt: "Kitoblar to'plami" },
  { src: heroBanner3, alt: "Bolalar o'qiyapti" },
];

const HeroCarousel = () => {
  const [current, setCurrent] = useState(0);
  const { t } = useLanguage();

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrent((prev) => (prev + 1) % banners.length);
    }, 5000);
    return () => clearInterval(timer);
  }, []);

  const prev = () => setCurrent((c) => (c - 1 + banners.length) % banners.length);
  const next = () => setCurrent((c) => (c + 1) % banners.length);

  return (
    <div className="relative rounded-lg overflow-hidden group">
      <div className="aspect-[16/6] relative">
        {banners.map((banner, i) => (
          <img
            key={i}
            src={banner.src}
            alt={banner.alt}
            className={`absolute inset-0 w-full h-full object-cover transition-opacity duration-700 ${
              i === current ? "opacity-100" : "opacity-0"
            }`}
          />
        ))}
        <div className="absolute inset-0 bg-gradient-to-r from-foreground/40 to-transparent" />
        <div className="absolute bottom-6 left-6 text-primary-foreground">
          <h2 className="font-display text-2xl md:text-3xl font-bold drop-shadow-lg">
            {t("hero.title")}
          </h2>
          <p className="text-sm md:text-base mt-1 opacity-90 drop-shadow">
            {t("hero.subtitle")}
          </p>
        </div>
      </div>

      <button onClick={prev} className="absolute left-2 top-1/2 -translate-y-1/2 w-9 h-9 rounded-full bg-background/80 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity text-foreground hover:bg-background">
        <ChevronLeft className="w-5 h-5" />
      </button>
      <button onClick={next} className="absolute right-2 top-1/2 -translate-y-1/2 w-9 h-9 rounded-full bg-background/80 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity text-foreground hover:bg-background">
        <ChevronRight className="w-5 h-5" />
      </button>

      <div className="absolute bottom-2 left-1/2 -translate-x-1/2 flex gap-2">
        {banners.map((_, i) => (
          <button
            key={i}
            onClick={() => setCurrent(i)}
            className={`w-2.5 h-2.5 rounded-full transition-all ${
              i === current ? "bg-primary w-6" : "bg-background/60"
            }`}
          />
        ))}
      </div>
    </div>
  );
};

export default HeroCarousel;
