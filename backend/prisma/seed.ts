import { PrismaClient, Role } from "@prisma/client";
import bcrypt from "bcryptjs";

const prisma = new PrismaClient();

async function main() {
  console.log("🌱 Seeding database...");

  // ---- Categories ----
  const categories = await Promise.all([
    prisma.category.upsert({ where: { slug: "fiction" }, update: {}, create: { slug: "fiction", nameUz: "Badiiy adabiyotlar", nameRu: "Художественная литература", nameEn: "Fiction", sortOrder: 1 } }),
    prisma.category.upsert({ where: { slug: "children" }, update: {}, create: { slug: "children", nameUz: "Bolalar adabiyoti", nameRu: "Детская литература", nameEn: "Children's Literature", sortOrder: 2 } }),
    prisma.category.upsert({ where: { slug: "educational" }, update: {}, create: { slug: "educational", nameUz: "O'quv adabiyotlar", nameRu: "Учебная литература", nameEn: "Educational", sortOrder: 3 } }),
    prisma.category.upsert({ where: { slug: "biography" }, update: {}, create: { slug: "biography", nameUz: "Biografik va memuar", nameRu: "Биография и мемуары", nameEn: "Biography & Memoir", sortOrder: 4 } }),
    prisma.category.upsert({ where: { slug: "business" }, update: {}, create: { slug: "business", nameUz: "Biznes adabiyotlar", nameRu: "Бизнес литература", nameEn: "Business", sortOrder: 5 } }),
    prisma.category.upsert({ where: { slug: "religious" }, update: {}, create: { slug: "religious", nameUz: "Diniy adabiyotlar", nameRu: "Религиозная литература", nameEn: "Religious", sortOrder: 6 } }),
    prisma.category.upsert({ where: { slug: "popular-science" }, update: {}, create: { slug: "popular-science", nameUz: "Ilmiy-ommabop", nameRu: "Научно-популярная", nameEn: "Popular Science", sortOrder: 7 } }),
    prisma.category.upsert({ where: { slug: "psychology" }, update: {}, create: { slug: "psychology", nameUz: "Psixologiya", nameRu: "Психология", nameEn: "Psychology", sortOrder: 8 } }),
    prisma.category.upsert({ where: { slug: "philosophy" }, update: {}, create: { slug: "philosophy", nameUz: "Falsafa", nameRu: "Философия", nameEn: "Philosophy", sortOrder: 9 } }),
    prisma.category.upsert({ where: { slug: "economy" }, update: {}, create: { slug: "economy", nameUz: "Iqtisodiyot va Moliya", nameRu: "Экономика и Финансы", nameEn: "Economy & Finance", sortOrder: 10 } }),
  ]);
  console.log(`✅ ${categories.length} categories seeded`);

  // ---- Authors ----
  const authors = await Promise.all([
    prisma.author.upsert({ where: { id: 1 }, update: {}, create: { nameUz: "Paulo Koelo", nameRu: "Пауло Коэльо", nameEn: "Paulo Coelho", bioUz: "Braziliyalik mashhur yozuvchi. Dunyo bo'ylab 200 million nusxadan ortiq kitob sotilgan.", bioRu: "Знаменитый бразильский писатель. Продано более 200 миллионов экземпляров книг.", isFeatured: true } }),
    prisma.author.upsert({ where: { id: 2 }, update: {}, create: { nameUz: "Alisher Navoiy", nameRu: "Алишер Навои", nameEn: "Alisher Navoi", bioUz: "O'zbek klassik adabiyotining buyuk namoyandasi.", bioRu: "Великий представитель классической узбекской литературы.", isFeatured: true } }),
    prisma.author.upsert({ where: { id: 3 }, update: {}, create: { nameUz: "Agatha Christie", nameRu: "Агата Кристи", nameEn: "Agatha Christie", bioUz: "Ingliz detektiv romani ustasi.", bioRu: "Мастер английского детективного романа." } }),
    prisma.author.upsert({ where: { id: 4 }, update: {}, create: { nameUz: "Erix Mariya Remark", nameRu: "Эрих Мария Ремарк", nameEn: "Erich Maria Remarque", bioUz: "Nemis yozuvchisi, urush va tinchlik mavzusidagi romanlari bilan tanilgan.", bioRu: "Немецкий писатель, известный романами о войне и мире." } }),
    prisma.author.upsert({ where: { id: 5 }, update: {}, create: { nameUz: "Franz Kafka", nameRu: "Франц Кафка", nameEn: "Franz Kafka", bioUz: "Nemis-chex yozuvchi, absurd adabiyotning asoschisi.", bioRu: "Немецко-чешский писатель, основоположник литературы абсурда." } }),
  ]);
  console.log(`✅ ${authors.length} authors seeded`);

  // ---- Admin User ----
  const adminHash = await bcrypt.hash("ZiyoAdmin2025!", 12);
  const admin = await prisma.user.upsert({
    where: { email: "admin@ziyochashmasi.uz" },
    update: {},
    create: {
      name: "Admin",
      email: "admin@ziyochashmasi.uz",
      passwordHash: adminHash,
      role: Role.ADMIN,
      phone: "+998931358100",
    },
  });
  console.log(`✅ Admin user: ${admin.email}`);

  // ---- Test User ----
  const userHash = await bcrypt.hash("test123", 12);
  const testUser = await prisma.user.upsert({
    where: { email: "user@test.uz" },
    update: {},
    create: {
      name: "Test Foydalanuvchi",
      email: "user@test.uz",
      passwordHash: userHash,
      role: Role.USER,
    },
  });
  console.log(`✅ Test user: ${testUser.email}`);

  // ---- Books ----
  const fictionCat = categories[0];
  const psychCat   = categories[7];

  const booksData = [
    { titleUz: "Alkimyogar", titleRu: "Алхимик", titleEn: "The Alchemist", slug: "alkimyogar", descUz: "Dunyo bo'ylab millionlab nusxada sotilgan eng mashhur asar.", descRu: "Самая продаваемая книга в мире.", price: 25000, pages: 224, year: 2022, categoryId: fictionCat.id, authorId: 1, isFeatured: true, stockCount: 50 },
    { titleUz: "Maktub", titleRu: "Письмо", titleEn: "Maktub", slug: "maktub", descUz: "Paulo Koelodan hayot haqidagi hikmatlı fikrlar.", descRu: "Мудрые мысли о жизни от Пауло Коэльо.", price: 42000, pages: 196, year: 2021, categoryId: fictionCat.id, authorId: 1, stockCount: 30 },
    { titleUz: "Uch og'ayni", titleRu: "Три товарища", titleEn: "Three Comrades", slug: "uch-ogayni", descUz: "Do'stlik va muhabbat haqidagi unutilmas roman.", descRu: "Незабываемый роман о дружбе и любви.", price: 50000, pages: 448, year: 2021, categoryId: fictionCat.id, authorId: 4, isFeatured: true, stockCount: 25 },
    { titleUz: "Ular o'nta edi", titleRu: "Их было десять", titleEn: "And Then There Were None", slug: "ular-onta-edi", descUz: "Agatha Kristining eng mashhur detektiv romani.", descRu: "Самый известный детектив Агаты Кристи.", price: 25000, pages: 284, year: 2023, categoryId: fictionCat.id, authorId: 3, stockCount: 40 },
    { titleUz: "Evrilish", titleRu: "Превращение", titleEn: "Metamorphosis", slug: "evrilish", descUz: "Kafka dunyosiga sayohat.", descRu: "Путешествие в мир Кафки.", price: 25000, pages: 144, year: 2020, categoryId: fictionCat.id, authorId: 5, isFeatured: true, stockCount: 35 },
    { titleUz: "Jazosiz tarbiya", titleRu: "Воспитание без наказания", titleEn: "Punishment-Free Parenting", slug: "jazosiz-tarbiya", descUz: "Bolalarni sevgi bilan tarbiyalash yo'llari.", descRu: "Воспитание детей с любовью.", price: 35000, pages: 256, year: 2023, categoryId: psychCat.id, stockCount: 20 },
    { titleUz: "Qarzga olingan umr", titleRu: "Жизнь в долг", titleEn: "Life on Credit", slug: "qarzga-olingan-umr", descUz: "Remark qalami bilan yozilgan hayajonli asar.", descRu: "Волнующее произведение Ремарка.", price: 32000, pages: 312, year: 2022, categoryId: fictionCat.id, authorId: 4, stockCount: 15 },
    { titleUz: "Andisha va g'urur", titleRu: "Гордость и предубеждение", titleEn: "Pride and Prejudice", slug: "andisha-va-gurur", descUz: "Jahon adabiyotining beqiyos durdonasi.", descRu: "Непревзойдённый шедевр мировой литературы.", price: 38000, pages: 432, year: 2021, categoryId: fictionCat.id, isFeatured: true, stockCount: 30 },
  ];

  for (const book of booksData) {
    await prisma.book.upsert({
      where: { slug: book.slug },
      update: {},
      create: { ...book, inStock: book.stockCount > 0 },
    });
  }
  console.log(`✅ ${booksData.length} books seeded`);

  // ---- News ----
  const newsData = [
    { slug: "yangi-kitoblar-2025", titleUz: "Ziyo Chashmasi kutubxonasi yangi kitoblar bilan to'ldirildi", titleRu: "Библиотека «Зиё Чашмаси» пополнилась новыми книгами", bodyUz: "2025-yil mart oyida kutubxonamiz 500 dan ortiq yangi kitob bilan boyitildi.", bodyRu: "В марте 2025 года наша библиотека пополнилась более чем 500 новыми книгами." },
    { slug: "bolalar-musobaqasi-2025", titleUz: "Bolalar uchun maxsus o'qish musobaqasi e'lon qilindi", titleRu: "Объявлен специальный конкурс чтения для детей", bodyUz: "Kutubxonamiz Kukdala tumani maktab o'quvchilari uchun 'Eng ko'p o'quvchi' musobaqasini e'lon qildi.", bodyRu: "Наша библиотека объявила конкурс «Самый читающий» для школьников." },
    { slug: "festival-2025", titleUz: "Kukdala tumanida kitob o'qish festivali bo'lib o'tdi", titleRu: "В Кукдалинском районе прошёл фестиваль чтения", bodyUz: "Yanvar oyida o'tkazilgan festival 200 dan ortiq ishtirokchilarni birlashtirdi.", bodyRu: "Январский фестиваль собрал более 200 участников." },
  ];

  for (const news of newsData) {
    await prisma.news.upsert({
      where: { slug: news.slug },
      update: {},
      create: news,
    });
  }
  console.log(`✅ ${newsData.length} news seeded`);

  console.log("\n🎉 Seed completed successfully!");
}

main()
  .catch((e) => { console.error("❌ Seed failed:", e); process.exit(1); })
  .finally(async () => { await prisma.$disconnect(); });
