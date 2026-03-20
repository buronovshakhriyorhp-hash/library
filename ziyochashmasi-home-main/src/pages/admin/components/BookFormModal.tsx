import { useForm } from "react-hook-form";
import { useCategories } from "@/hooks/useCategories";
import { Book } from "@/types";

interface BookFormModalProps {
  book?: Book | null;
  onClose: () => void;
  onSubmit: (data: any) => void;
  isSubmitting: boolean;
}

const BookFormModal = ({ book, onClose, onSubmit, isSubmitting }: BookFormModalProps) => {
  const { data: categories = [] } = useCategories();
  const { register, handleSubmit, formState: { errors } } = useForm({
    defaultValues: {
      title: book?.title || "",
      author: book?.author || "",
      price: book?.price || 0,
      image: book?.image || "",
      description: book?.description || "",
      categoryId: book?.categoryId || "",
      inStock: book?.inStock ?? true,
    },
  });

  const generateSlug = (title: string) => title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)+/g, '');

  const handleFormSubmit = (data: any) => {
    onSubmit({
      ...data,
      slug: book?.id ? undefined : generateSlug(data.title),
      price: Number(data.price),
      categoryId: data.categoryId ? Number(data.categoryId) : undefined,
    });
  };

  return (
    <div className="fixed inset-0 bg-foreground/30 flex items-center justify-center z-50 p-4 overflow-y-auto">
      <div className="bg-card border border-border rounded-2xl p-6 w-full max-w-lg my-8">
        <h3 className="font-bold text-foreground mb-6 text-xl">
          {book ? "Kitobni tahrirlash" : "Yangi kitob qo'shish"}
        </h3>
        
        <form onSubmit={handleSubmit(handleFormSubmit)} className="space-y-4">
          <div>
            <label className="block text-sm font-semibold mb-1">Sarlavha *</label>
            <input
              {...register("title", { required: "Sarlavha kiritish shart" })}
              className="w-full px-3 py-2 border rounded-lg bg-background"
              placeholder="Kitob nomi"
            />
            {errors.title && <p className="text-xs text-destructive mt-1">{String(errors.title.message)}</p>}
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-semibold mb-1">Muallif *</label>
              <input
                {...register("author", { required: "Muallifni kiriting" })}
                className="w-full px-3 py-2 border rounded-lg bg-background"
              />
            </div>
            <div>
              <label className="block text-sm font-semibold mb-1">Narxi (UZS) *</label>
              <input
                type="number"
                {...register("price", { required: "Narxni kiriting", min: 0 })}
                className="w-full px-3 py-2 border rounded-lg bg-background"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-semibold mb-1">Kategoriya *</label>
            <select
              {...register("categoryId", { required: "Kategoriyani tanlang" })}
              className="w-full px-3 py-2 border rounded-lg bg-background"
            >
              <option value="">Tanlang...</option>
              {categories.map((c) => (
                <option key={c.id} value={c.id}>{c.nameUz}</option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-semibold mb-1">Rasm URL *</label>
            <input
              {...register("image", { required: "Rasm silkasini kiriting" })}
              className="w-full px-3 py-2 border rounded-lg bg-background"
              placeholder="https://..."
            />
          </div>

          <div>
            <label className="block text-sm font-semibold mb-1">Ta'rif</label>
            <textarea
              {...register("description")}
              rows={3}
              className="w-full px-3 py-2 border rounded-lg bg-background resize-none"
            />
          </div>

          <label className="flex items-center gap-2">
            <input type="checkbox" {...register("inStock")} className="accent-primary w-4 h-4" />
            <span className="text-sm font-semibold">Sotuvda mavjud</span>
          </label>

          <div className="flex gap-3 pt-4 border-t border-border mt-6">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 py-2 border border-border rounded-xl text-sm hover:bg-secondary font-semibold"
            >
              Bekor qilish
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className="flex-1 py-2 bg-primary text-primary-foreground rounded-xl text-sm font-semibold disabled:opacity-50"
            >
              {isSubmitting ? "Saqlanmoqda..." : "Saqlash"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default BookFormModal;
