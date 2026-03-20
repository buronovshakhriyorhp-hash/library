import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { useCart } from "@/contexts/CartContext";
import { useAuth } from "@/contexts/AuthContext";
import { formatPrice } from "@/data/books";
import { CheckCircle } from "lucide-react";
import { useCreateOrder } from "@/hooks/useOrders";

interface CheckoutForm {
  name: string;
  phone: string;
  address: string;
  city: string;
  paymentMethod: "click" | "payme" | "cash";
  note?: string;
}

const CheckoutPage = () => {
  const { items, totalPrice, clearCart } = useCart();
  const { user } = useAuth();
  const navigate = useNavigate();
  const [isSuccess, setIsSuccess] = useState(false);

  const { register, handleSubmit, formState: { errors } } = useForm<CheckoutForm>({
    defaultValues: {
      name: user?.name || "",
      phone: user?.phone || "",
      paymentMethod: "cash",
    },
  });

  const { mutateAsync: createOrder, isPending: isSubmitting } = useCreateOrder();

  const onSubmit = async (data: CheckoutForm) => {
    try {
      const order = await createOrder({
        customerName: data.name,
        phone: data.phone,
        address: data.address,
        city: data.city,
        paymentMethod: data.paymentMethod,
        note: data.note,
        items: items.map(i => ({ bookId: i.book.id, quantity: i.quantity })),
      });
      clearCart();

      if (data.paymentMethod === "click") {
        const serviceId = import.meta.env.VITE_CLICK_SERVICE_ID || "0";
        const merchantId = import.meta.env.VITE_CLICK_MERCHANT_ID || "0";
        window.location.href = `https://my.click.uz/services/pay?service_id=${serviceId}&merchant_id=${merchantId}&amount=${order.total}&transaction_param=${order.id}`;
      } else if (data.paymentMethod === "payme") {
        const merchantId = import.meta.env.VITE_PAYME_MERCHANT_ID || "0";
        const paymeData = btoa(`m=${merchantId};ac.order_id=${order.id};a=${order.total * 100}`);
        window.location.href = `https://checkout.paycom.uz/${paymeData}`;
      } else {
        setIsSuccess(true);
      }
    } catch (err) {
      console.error(err);
    }
  };

  if (isSuccess) {
    return (
      <div className="min-h-screen bg-background">
        <Header />
        <div className="container py-20 flex flex-col items-center text-center">
          <CheckCircle className="w-20 h-20 text-green-500 mb-4" />
          <h2 className="font-display text-2xl font-bold text-foreground mb-2">
            Buyurtmangiz qabul qilindi! 🎉
          </h2>
          <p className="text-muted-foreground mb-6 max-w-sm">
            Tez orada siz bilan bog'lanamiz. Rahmat!
          </p>
          <Link
            to="/"
            className="px-6 py-3 bg-primary text-primary-foreground font-bold rounded-xl hover:opacity-90 transition-opacity"
          >
            Bosh sahifaga qaytish
          </Link>
        </div>
        <Footer />
      </div>
    );
  }

  if (items.length === 0) {
    navigate("/cart");
    return null;
  }

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <div className="container py-6">
        <h1 className="font-display text-2xl font-bold text-foreground mb-6">
          Buyurtma berish
        </h1>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Form */}
          <form onSubmit={handleSubmit(onSubmit)} className="lg:col-span-2 space-y-5">
            {/* Delivery info */}
            <div className="bg-card border border-border rounded-xl p-5 text-left">
              <h3 className="font-bold text-foreground mb-4">Yetkazib berish ma'lumotlari</h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-semibold text-foreground mb-1">
                    Ism-familiya *
                  </label>
                  <input
                    {...register("name", { required: "Ism kiritish shart" })}
                    className="w-full px-3 py-2.5 border border-border rounded-lg bg-background text-foreground outline-none focus:border-primary transition-colors"
                    placeholder="To'liq ismingiz"
                  />
                  {errors.name && (
                    <p className="text-xs text-destructive mt-1">{errors.name.message}</p>
                  )}
                </div>
                <div>
                  <label className="block text-sm font-semibold text-foreground mb-1">
                    Telefon raqami *
                  </label>
                  <input
                    {...register("phone", {
                      required: "Telefon kiritish shart",
                      pattern: { value: /^\+?[0-9]{9,13}$/, message: "Noto'g'ri format" },
                    })}
                    className="w-full px-3 py-2.5 border border-border rounded-lg bg-background text-foreground outline-none focus:border-primary transition-colors"
                    placeholder="+998 XX XXX XX XX"
                  />
                  {errors.phone && (
                    <p className="text-xs text-destructive mt-1">{errors.phone.message}</p>
                  )}
                </div>
                <div>
                  <label className="block text-sm font-semibold text-foreground mb-1">
                    Manzil *
                  </label>
                  <input
                    {...register("address", { required: "Manzil kiritish shart" })}
                    className="w-full px-3 py-2.5 border border-border rounded-lg bg-background text-foreground outline-none focus:border-primary transition-colors"
                    placeholder="Ko'cha, uy raqami"
                  />
                  {errors.address && (
                    <p className="text-xs text-destructive mt-1">{errors.address.message}</p>
                  )}
                </div>
                <div>
                  <label className="block text-sm font-semibold text-foreground mb-1">
                    Tuman/Shahar *
                  </label>
                  <input
                    {...register("city", { required: "Shahar kiritish shart" })}
                    className="w-full px-3 py-2.5 border border-border rounded-lg bg-background text-foreground outline-none focus:border-primary transition-colors"
                    placeholder="Kukdala tumani"
                  />
                  {errors.city && (
                    <p className="text-xs text-destructive mt-1">{errors.city.message}</p>
                  )}
                </div>
              </div>
              <div className="mt-4">
                <label className="block text-sm font-semibold text-foreground mb-1">
                  Izoh (ixtiyoriy)
                </label>
                <textarea
                  {...register("note")}
                  rows={2}
                  className="w-full px-3 py-2.5 border border-border rounded-lg bg-background text-foreground outline-none focus:border-primary transition-colors resize-none"
                  placeholder="Qo'shimcha ma'lumot..."
                />
              </div>
            </div>

            {/* Payment method */}
            <div className="bg-card border border-border rounded-xl p-5 text-left">
              <h3 className="font-bold text-foreground mb-4">To'lov usuli</h3>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                {[
                  { value: "cash", label: "Naqd pul", icon: "💵" },
                  { value: "click", label: "Click", icon: "📱" },
                  { value: "payme", label: "Payme", icon: "💳" },
                ].map((method) => (
                  <label
                    key={method.value}
                    className="flex items-center gap-3 p-3 border border-border rounded-xl cursor-pointer hover:border-primary/50 transition-colors has-[:checked]:border-primary has-[:checked]:bg-primary/5"
                  >
                    <input
                      type="radio"
                      value={method.value}
                      {...register("paymentMethod")}
                      className="accent-primary"
                    />
                    <span className="text-lg">{method.icon}</span>
                    <span className="font-semibold text-sm">{method.label}</span>
                  </label>
                ))}
              </div>
            </div>

            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full py-3.5 bg-primary text-primary-foreground font-bold rounded-xl hover:opacity-90 transition-opacity disabled:opacity-70 flex items-center justify-center gap-2"
            >
              {isSubmitting ? (
                <>
                  <span className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  Yuborilmoqda...
                </>
              ) : (
                `Buyurtma berish — ${formatPrice(totalPrice)}`
              )}
            </button>
          </form>

          {/* Summary */}
          <div className="lg:col-span-1">
            <div className="bg-card border border-border rounded-xl p-5 sticky top-24 space-y-3">
              <h3 className="font-bold text-foreground text-left">Buyurtma</h3>
              {items.map(({ book, quantity }) => (
                <div key={book.id} className="flex justify-between text-sm">
                  <span className="truncate max-w-[65%] text-muted-foreground text-left">
                    {book.title}
                  </span>
                  <span className="font-semibold whitespace-nowrap">
                    {formatPrice(book.price * quantity)}
                  </span>
                </div>
              ))}
              <div className="border-t border-border pt-3 flex justify-between font-bold">
                <span>Jami:</span>
                <span className="text-primary">{formatPrice(totalPrice)}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default CheckoutPage;
