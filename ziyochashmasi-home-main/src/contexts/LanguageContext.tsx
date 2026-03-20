import { createContext, useContext, useState, ReactNode } from "react";

export type Lang = "uz" | "ru" | "en";

const translations: Record<string, Record<Lang, string>> = {
  // Header
  "topbar.slogan": { uz: "Mutolaa Ziyo Chashmasi bilan boshlanar", ru: "Чтение начинается с Зиё Чашмаси", en: "Reading begins with Ziyo Chashmasi" },
  "search.placeholder": { uz: "Kitob qidiring", ru: "Поиск книг", en: "Search books" },
  "nav.books": { uz: "Kitoblar", ru: "Книги", en: "Books" },
  "nav.collections": { uz: "To'plamlar", ru: "Коллекции", en: "Collections" },
  "nav.authors": { uz: "Mualliflar", ru: "Авторы", en: "Authors" },
  "nav.discounts": { uz: "Chegirmalar", ru: "Скидки", en: "Discounts" },
  "nav.news": { uz: "Yangiliklar", ru: "Новости", en: "News" },
  "action.cart": { uz: "Savatcha", ru: "Корзина", en: "Cart" },
  "action.favorites": { uz: "Sevimlilar", ru: "Избранное", en: "Favorites" },
  "action.profile": { uz: "Profil", ru: "Профиль", en: "Profile" },
  // Categories
  "cat.title": { uz: "Kategoriyalar", ru: "Категории", en: "Categories" },
  "cat.fiction": { uz: "Badiiy adabiyotlar", ru: "Художественная литература", en: "Fiction" },
  "cat.children": { uz: "Bolalar adabiyoti", ru: "Детская литература", en: "Children's Literature" },
  "cat.educational": { uz: "O'quv adabiyotlar", ru: "Учебная литература", en: "Educational" },
  "cat.biography": { uz: "Biografik va memuar", ru: "Биография и мемуары", en: "Biography & Memoir" },
  "cat.business": { uz: "Biznes adabiyotlar", ru: "Бизнес литература", en: "Business" },
  "cat.religious": { uz: "Diniy adabiyotlar", ru: "Религиозная литература", en: "Religious" },
  "cat.popular_science": { uz: "Ilmiy-ommabop", ru: "Научно-популярная", en: "Popular Science" },
  "cat.psychology": { uz: "Psixologiya", ru: "Психология", en: "Psychology" },
  "cat.philosophy": { uz: "Falsafa", ru: "Философия", en: "Philosophy" },
  "cat.economy": { uz: "Iqtisodiyot va Moliya", ru: "Экономика и Финансы", en: "Economy & Finance" },
  // Features
  "feat.delivery.title": { uz: "Yetkazib berish", ru: "Доставка", en: "Delivery" },
  "feat.delivery.desc": { uz: "Buyurtmangizni Kukdala tumani bo'ylab yetkazib beramiz", ru: "Доставка по Кукдалинскому району", en: "Delivery across Kukdala district" },
  "feat.selection.title": { uz: "Keng tanlov", ru: "Широкий выбор", en: "Wide Selection" },
  "feat.selection.desc": { uz: "Istalgan turdagi kitoblarni topishingiz mumkin", ru: "Найдите книги любого жанра", en: "Find books of any genre" },
  "feat.payment.title": { uz: "Oson to'lov", ru: "Удобная оплата", en: "Easy Payment" },
  "feat.payment.desc": { uz: "Istalgan turdagi to'lov asosida xarid qilishingiz mumkin", ru: "Оплата любым удобным способом", en: "Pay with any convenient method" },
  "feat.security.title": { uz: "Himoyalangan tizim", ru: "Безопасная система", en: "Secure System" },
  "feat.security.desc": { uz: "Sizning xavfsizligingizni ta'minlaymiz", ru: "Мы обеспечиваем вашу безопасность", en: "We ensure your security" },
  // Sections
  "section.available": { uz: "Mavjud kitoblar", ru: "Доступные книги", en: "Available Books" },
  "section.viewAll": { uz: "Barchasini ko'rish →", ru: "Показать все →", en: "View all →" },
  "section.topBooks": { uz: "Mart oyining TOP kitoblari", ru: "ТОП книги марта", en: "March TOP Books" },
  "section.authorBooks": { uz: "\"Alisher Navoiy\" asarlari", ru: "Произведения «Алишера Навои»", en: "Works of \"Alisher Navoi\"" },
  "section.news": { uz: "Yangiliklar", ru: "Новости", en: "News" },
  "section.newsLink": { uz: "Yangiliklar →", ru: "Новости →", en: "News →" },
  "book.quickBuy": { uz: "Tezkor sotib olish", ru: "Быстрая покупка", en: "Quick Buy" },
  "book.reviews": { uz: "Odam", ru: "чел.", en: "reviews" },
  // Stats
  "stats.books": { uz: "Nomdagi kitoblar mavjud", ru: "Книг в наличии", en: "Books available" },
  "stats.readers": { uz: "Faol kitobxonlar", ru: "Активных читателей", en: "Active readers" },
  "stats.branches": { uz: "Kukdala tumanida filiallar", ru: "Филиалы в Кукдалинском районе", en: "Branches in Kukdala" },
  // Footer
  "footer.desc": { uz: "Qashqadaryo viloyati, Kukdala tumanidagi kutubxona", ru: "Библиотека в Кукдалинском районе, Кашкадарьинская область", en: "Library in Kukdala district, Kashkadarya region" },
  "footer.menu": { uz: "Menu", ru: "Меню", en: "Menu" },
  "footer.about": { uz: "Biz haqimizda", ru: "О нас", en: "About Us" },
  "footer.howToBuy": { uz: "Qanday xarid qilinadi?", ru: "Как купить?", en: "How to buy?" },
  "footer.delivery": { uz: "Yetkazib berish", ru: "Доставка", en: "Delivery" },
  "footer.branches": { uz: "Filiallar", ru: "Филиалы", en: "Branches" },
  "footer.contacts": { uz: "Kontaktlar", ru: "Контакты", en: "Contacts" },
  "footer.social": { uz: "Ijtimoiy tarmoqlar", ru: "Социальные сети", en: "Social Media" },
  "footer.offer": { uz: "Ommaviy oferta", ru: "Публичная оферта", en: "Public Offer" },
  "footer.policy": { uz: "Politika", ru: "Политика", en: "Policy" },
  "footer.branch1": { uz: "Kukdala tumani markazi", ru: "Центр Кукдала", en: "Kukdala center" },
  "footer.branch2": { uz: "Oqtunli qishlog'i", ru: "Селение Октунли", en: "Oqtunli village" },
  // Hero
  "hero.title": { uz: "Ziyo Chashmasi kutubxonasi", ru: "Библиотека Зиё Чашмаси", en: "Ziyo Chashmasi Library" },
  "hero.subtitle": { uz: "Qashqadaryo, Kukdala tumani", ru: "Кашкадарья, Кукдалинский район", en: "Kashkadarya, Kukdala district" },
};

interface LanguageContextType {
  lang: Lang;
  setLang: (lang: Lang) => void;
  t: (key: string) => string;
}

const LanguageContext = createContext<LanguageContextType>({
  lang: "uz",
  setLang: () => {},
  t: (key) => key,
});

export const useLanguage = () => useContext(LanguageContext);

export const LanguageProvider = ({ children }: { children: ReactNode }) => {
  const [lang, setLang] = useState<Lang>(() => {
    return (localStorage.getItem("lang") as Lang) || "uz";
  });

  const handleSetLang = (l: Lang) => {
    setLang(l);
    localStorage.setItem("lang", l);
  };

  const t = (key: string): string => {
    return translations[key]?.[lang] || key;
  };

  return (
    <LanguageContext.Provider value={{ lang, setLang: handleSetLang, t }}>
      {children}
    </LanguageContext.Provider>
  );
};
