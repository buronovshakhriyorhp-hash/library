import { useState } from "react";
import { Link } from "react-router-dom";
import { ArrowLeft, Plus, Edit, Trash2, Search, Loader2 } from "lucide-react";
import { formatPrice } from "@/data/books";
import type { Book } from "@/types";
import { useBooks, useDeleteBook, useCreateBook, useUpdateBook } from "@/hooks/useBooks";
import BookFormModal from "./components/BookFormModal";

const AdminBooksPage = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [showAddModal, setShowAddModal] = useState(false);
  const [editingBook, setEditingBook] = useState<Book | null>(null);

  const { data, isLoading } = useBooks({ search: searchQuery, limit: 100 });
  const books = data?.books || [];

  const { mutateAsync: createBook, isPending: isCreating } = useCreateBook();
  const { mutateAsync: updateBook, isPending: isUpdating } = useUpdateBook();
  const { mutateAsync: deleteBook } = useDeleteBook();

  const handleCreateOrUpdate = async (formData: any) => {
    try {
      if (editingBook) {
        await updateBook({ id: editingBook.id, data: formData });
      } else {
        await createBook(formData);
      }
      setShowAddModal(false);
      setEditingBook(null);
    } catch (err) {
      console.error(err);
    }
  };

  const handleDelete = async (id: number) => {
    if (confirm("Haqiqatan ham bu kitobni o'chirmoqchimisiz?")) {
      await deleteBook(id);
    }
  };

  const handleEdit = (book: Book) => {
    setEditingBook(book);
    setShowAddModal(true);
  };

  return (
    <div className="min-h-screen bg-secondary/30 pb-20">
      <header className="bg-card border-b border-border px-6 py-4 flex items-center justify-between sticky top-0 z-40">
        <div className="flex items-center gap-3">
          <Link to="/admin" className="text-muted-foreground hover:text-foreground">
            <ArrowLeft className="w-5 h-5" />
          </Link>
          <span className="font-bold text-foreground">Kitoblarni boshqarish</span>
        </div>
        <button
          type="button"
          onClick={() => {
            setEditingBook(null);
            setShowAddModal(true);
          }}
          className="flex items-center gap-2 px-4 py-2 bg-primary text-primary-foreground font-bold rounded-xl text-sm hover:opacity-90 transition-opacity"
        >
          <Plus className="w-4 h-4" />
          Yangi kitob
        </button>
      </header>

      <div className="p-6">
        {/* Search */}
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2 border border-border rounded-xl bg-card px-3 max-w-sm flex-1">
            <Search className="w-4 h-4 text-muted-foreground" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Qidirish (titul yoki muallif)..."
              className="flex-1 py-2.5 bg-transparent outline-none text-sm"
            />
          </div>
          <p className="text-sm text-muted-foreground hidden sm:block">
            {isLoading ? "Izlanmoqda..." : `${books.length} ta kitob topildi`}
          </p>
        </div>

        {/* Books table */}
        <div className="bg-card border border-border rounded-xl overflow-hidden shadow-sm">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="bg-secondary/50 border-b border-border">
                  <th className="text-left px-4 py-3 font-semibold text-foreground">Xususiyatlar</th>
                  <th className="text-left px-4 py-3 font-semibold text-foreground hidden sm:table-cell">Muallif</th>
                  <th className="text-left px-4 py-3 font-semibold text-foreground">Kategoriya</th>
                  <th className="text-left px-4 py-3 font-semibold text-foreground">Narx</th>
                  <th className="text-left px-4 py-3 font-semibold text-foreground">Holat</th>
                  <th className="text-right px-4 py-3 font-semibold text-foreground">Amallar</th>
                </tr>
              </thead>
              <tbody>
                {isLoading && (
                  <tr>
                    <td colSpan={6} className="px-4 py-8 text-center text-muted-foreground">
                       <Loader2 className="w-6 h-6 animate-spin mx-auto mb-2" />
                       Ma'lumotlar yuklanmoqda...
                    </td>
                  </tr>
                )}
                
                {!isLoading && books.length === 0 && (
                   <tr>
                     <td colSpan={6} className="px-4 py-8 text-center text-muted-foreground">
                        Qidiruv bo'yicha yoki bazada hech narsa topilmadi
                     </td>
                   </tr>
                )}

                {!isLoading && books.map((book) => (
                  <tr key={book.id} className="border-b border-border last:border-0 hover:bg-secondary/30 transition-colors">
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-3">
                        <img src={book.image} alt={book.title} className="w-9 h-12 object-cover rounded shadow-sm" />
                        <span className="font-semibold text-foreground line-clamp-1">{book.title}</span>
                      </div>
                    </td>
                    <td className="px-4 py-3 text-muted-foreground hidden sm:table-cell truncate max-w-[150px]">
                      {book.author}
                    </td>
                    <td className="px-4 py-3 text-muted-foreground text-xs">
                      {book.category}
                    </td>
                    <td className="px-4 py-3 font-semibold text-primary">
                      {formatPrice(book.price)}
                    </td>
                    <td className="px-4 py-3">
                      <span className={`text-[10px] sm:text-xs font-bold px-2 py-1 rounded-full ${
                        book.inStock ? "bg-green-100/50 text-green-700" : "bg-red-100/50 text-red-700"
                      }`}>
                        {book.inStock ? "Sotuvda" : "Yo'q"}
                      </span>
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex items-center justify-end gap-1 sm:gap-2">
                        <button 
                          onClick={() => handleEdit(book)}
                          className="p-1.5 sm:p-2 rounded-lg hover:bg-secondary text-muted-foreground hover:text-foreground transition-colors"
                        >
                          <Edit className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => handleDelete(book.id)}
                          className="p-1.5 sm:p-2 rounded-lg hover:bg-destructive/10 text-muted-foreground hover:text-destructive transition-colors"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {showAddModal && (
        <BookFormModal
          book={editingBook}
          onClose={() => {
            setShowAddModal(false);
            setEditingBook(null);
          }}
          onSubmit={handleCreateOrUpdate}
          isSubmitting={isCreating || isUpdating}
        />
      )}
    </div>
  );
};

export default AdminBooksPage;
