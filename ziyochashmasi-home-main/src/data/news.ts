import type { NewsItem } from "@/types";

export const newsData: NewsItem[] = [
  {
    id: 1,
    date: "26.03.2025",
    title: "Ziyo Chashmasi kutubxonasi yangi kitoblar bilan to'ldirildi",
    titleRu: "Библиотека «Зиё Чашмаси» пополнилась новыми книгами",
    titleEn: "Ziyo Chashmasi library replenished with new books",
    body: "2025-yil mart oyida kutubxonamiz 500 dan ortiq yangi kitob bilan boyitildi. Badiiy adabiyot, ilmiy-ommabop va biznes yo'nalishidagi asarlar mavjud.",
    bodyRu: "В марте 2025 года наша библиотека пополнилась более чем 500 новыми книгами по художественной литературе, науке и бизнесу.",
    bodyEn: "In March 2025, our library was enriched with over 500 new books in fiction, popular science, and business.",
    image: undefined,
  },
  {
    id: 2,
    date: "19.02.2025",
    title: "Bolalar uchun maxsus o'qish musobaqasi e'lon qilindi",
    titleRu: "Объявлен специальный конкурс чтения для детей",
    titleEn: "Special reading competition announced for children",
    body: "Kutubxonamiz Kukdala tumani maktab o'quvchilari uchun 'Eng ko'p o'quvchi' musobaqasini e'lon qildi. G'oliblar qimmatli sovg'alar bilan taqdirlanadi.",
    bodyRu: "Наша библиотека объявила конкурс «Самый читающий» для школьников Кукдалинского района. Победители получат ценные призы.",
    bodyEn: "Our library announced the 'Most Reading' competition for school students of Kukdala district. Winners will receive valuable prizes.",
    image: undefined,
  },
  {
    id: 3,
    date: "23.01.2025",
    title: "Kukdala tumanida kitob o'qish festivali bo'lib o'tdi",
    titleRu: "В Кукдалинском районе прошёл фестиваль чтения",
    titleEn: "Book reading festival took place in Kukdala district",
    body: "Yanvar oyida o'tkazilgan festival 200 dan ortiq ishtirokchilarni birlashtirdi. Mualliflar bilan uchrashuvlar, kitob yarmarkalari va master-klasslar bo'lib o'tdi.",
    bodyRu: "Январский фестиваль собрал более 200 участников. Прошли встречи с авторами, книжные ярмарки и мастер-классы.",
    bodyEn: "The January festival brought together over 200 participants with author meetings, book fairs, and masterclasses.",
    image: undefined,
  },
  {
    id: 4,
    date: "08.12.2024",
    title: "Yangi yil kitob sovg'alari aksiyasi boshlandi",
    titleRu: "Началась акция «Новогодние книжные подарки»",
    titleEn: "New Year book gifts promotion has started",
    body: "Yangi yil bayramiga bag'ishlab, 2 ta kitob sotib olgan har bir mijozga 3-tasini 50% chegirma bilan taqdim qilamiz.",
    bodyRu: "К Новому году каждый покупатель, приобретающий 2 книги, получает третью со скидкой 50%.",
    bodyEn: "For New Year, every customer buying 2 books gets the 3rd at 50% discount.",
    image: undefined,
  },
];

export const getNewsById = (id: number): NewsItem | undefined =>
  newsData.find((n) => n.id === id);
