import { useState } from "react";
import { useForm } from "react-hook-form";
import { Phone, Mail, MapPin, Send, CheckCircle } from "lucide-react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";

interface ContactForm {
  name: string;
  phone: string;
  message: string;
}

const ContactPage = () => {
  const [isSent, setIsSent] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const { register, handleSubmit, formState: { errors } } = useForm<ContactForm>();

  const onSubmit = async (_data: ContactForm) => {
    setIsLoading(true);
    await new Promise((r) => setTimeout(r, 1000));
    setIsSent(true);
    setIsLoading(false);
  };

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <div className="container py-10">
        <h1 className="font-display text-3xl font-bold text-foreground mb-8">Biz bilan bog'lanish</h1>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Contact info */}
          <div className="space-y-4">
            <div className="bg-card border border-border rounded-xl p-5 space-y-4">
              <h3 className="font-bold text-foreground">Aloqa ma'lumotlari</h3>
              {[
                { icon: Phone, label: "Telefon", values: ["+998 93 135 81 00", "+998 95 222 70 02"] },
                { icon: MapPin, label: "Manzil", values: ["Qashqadaryo viloyati, Kukdala tumani"] },
                { icon: Mail, label: "Telegram", values: ["@Ziyo_kutibxonasi"] },
              ].map(({ icon: Icon, label, values }) => (
                <div key={label} className="flex gap-3">
                  <Icon className="w-5 h-5 text-primary shrink-0 mt-0.5" />
                  <div>
                    <p className="text-xs text-muted-foreground">{label}</p>
                    {values.map((v) => <p key={v} className="text-sm font-semibold text-foreground">{v}</p>)}
                  </div>
                </div>
              ))}
            </div>

            <div className="bg-card border border-border rounded-xl p-5">
              <h3 className="font-bold text-foreground mb-3">Ish vaqti</h3>
              <div className="space-y-1.5 text-sm">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Dushanba – Shanba</span>
                  <span className="font-semibold">9:00 – 18:00</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Yakshanba</span>
                  <span className="font-semibold text-destructive">Dam olish kuni</span>
                </div>
              </div>
            </div>
          </div>

          {/* Contact form */}
          <div className="bg-card border border-border rounded-xl p-6">
            {isSent ? (
              <div className="flex flex-col items-center text-center py-8">
                <CheckCircle className="w-14 h-14 text-green-500 mb-3" />
                <h3 className="font-bold text-foreground text-lg mb-1">Xabaringiz yuborildi!</h3>
                <p className="text-muted-foreground text-sm">Tez orada siz bilan bog'lanamiz. Rahmat!</p>
              </div>
            ) : (
              <>
                <h3 className="font-bold text-foreground mb-4">Xabar yuboring</h3>
                <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
                  <div>
                    <label className="block text-sm font-semibold text-foreground mb-1.5">Ismingiz</label>
                    <input
                      {...register("name", { required: "Ism kiritish shart" })}
                      className="w-full px-3 py-2.5 border border-border rounded-lg bg-background text-foreground outline-none focus:border-primary transition-colors"
                      placeholder="To'liq ismingiz"
                    />
                    {errors.name && <p className="text-xs text-destructive mt-1">{errors.name.message}</p>}
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-foreground mb-1.5">Telefon</label>
                    <input
                      {...register("phone", { required: "Telefon kiritish shart" })}
                      className="w-full px-3 py-2.5 border border-border rounded-lg bg-background text-foreground outline-none focus:border-primary transition-colors"
                      placeholder="+998 XX XXX XX XX"
                    />
                    {errors.phone && <p className="text-xs text-destructive mt-1">{errors.phone.message}</p>}
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-foreground mb-1.5">Xabar</label>
                    <textarea
                      {...register("message", { required: "Xabar kiritish shart", minLength: { value: 10, message: "Kamida 10 ta belgi" } })}
                      rows={4}
                      className="w-full px-3 py-2.5 border border-border rounded-lg bg-background text-foreground outline-none focus:border-primary transition-colors resize-none"
                      placeholder="Savolingizni yozing..."
                    />
                    {errors.message && <p className="text-xs text-destructive mt-1">{errors.message.message}</p>}
                  </div>
                  <button
                    type="submit"
                    disabled={isLoading}
                    className="w-full py-3 bg-primary text-primary-foreground font-bold rounded-xl hover:opacity-90 transition-opacity disabled:opacity-70 flex items-center justify-center gap-2"
                  >
                    {isLoading ? <span className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" /> : <><Send className="w-4 h-4" /> Yuborish</>}
                  </button>
                </form>
              </>
            )}
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default ContactPage;
