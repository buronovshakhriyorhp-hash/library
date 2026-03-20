import { BookOpen, Users, MapPin } from "lucide-react";
import { useLanguage } from "@/contexts/LanguageContext";

const StatsSection = () => {
  const { t } = useLanguage();

  const stats = [
    { icon: BookOpen, value: "5,000+", label: t("stats.books") },
    { icon: Users, value: "10,000+", label: t("stats.readers") },
    { icon: MapPin, value: "2", label: t("stats.branches") },
  ];

  return (
    <section className="py-12">
      <div className="container">
        <div className="bg-primary rounded-2xl p-8 md:p-12">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-center">
            {stats.map((stat) => (
              <div key={stat.label} className="flex flex-col items-center gap-2">
                <stat.icon className="w-8 h-8 text-primary-foreground/80" />
                <span className="font-display text-4xl font-bold text-primary-foreground">{stat.value}</span>
                <span className="text-sm text-primary-foreground/80">{stat.label}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default StatsSection;
