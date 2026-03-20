import { Truck, BookOpen, CreditCard, Shield } from "lucide-react";
import { useLanguage } from "@/contexts/LanguageContext";

const FeaturesSection = () => {
  const { t } = useLanguage();

  const features = [
    { icon: Truck, title: t("feat.delivery.title"), desc: t("feat.delivery.desc") },
    { icon: BookOpen, title: t("feat.selection.title"), desc: t("feat.selection.desc") },
    { icon: CreditCard, title: t("feat.payment.title"), desc: t("feat.payment.desc") },
    { icon: Shield, title: t("feat.security.title"), desc: t("feat.security.desc") },
  ];

  return (
    <section className="py-8">
      <div className="container grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {features.map((f) => (
          <div key={f.title} className="flex items-start gap-3 p-4 bg-feature rounded-lg border border-border">
            <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center shrink-0">
              <f.icon className="w-5 h-5 text-primary" />
            </div>
            <div>
              <h3 className="font-bold text-sm text-foreground">{f.title}</h3>
              <p className="text-xs text-muted-foreground mt-0.5">{f.desc}</p>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
};

export default FeaturesSection;
