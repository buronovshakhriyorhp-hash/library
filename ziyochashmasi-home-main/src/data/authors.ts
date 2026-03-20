import type { Author } from "@/types";

export const authorsData: Author[] = [
  {
    id: 1,
    name: "O'zbek Adabiyoti",
    nameRu: "Узбекская Литература",
    bio: "O'zbek klassik va zamonaviy adabiyoti",
    bioRu: "Классическая и современная узбекская литература",
  },
  {
    id: 2,
    name: "Paulo Koelo",
    nameRu: "Пауло Коэльо",
    bio: "Braziliyalik mashhur yozuvchi. Dunyo bo'ylab 200 million nusxadan ortiq kitob sotilgan.",
    bioRu: "Знаменитый бразильский писатель. Продано более 200 миллионов экземпляров книг по всему миру.",
  },
  {
    id: 3,
    name: "Psixologiya",
    nameRu: "Психология",
    bio: "Psixologiya va shaxsiy rivojlanish sohasidagi asarlar",
    bioRu: "Работы в области психологии и личностного развития",
  },
  {
    id: 4,
    name: "Franz Kafka",
    nameRu: "Франц Кафка",
    bio: "Nemis-chex yozuvchi, absurd adabiyotning asoschisi.",
    bioRu: "Немецко-чешский писатель, основоположник литературы абсурда.",
  },
  {
    id: 5,
    name: "Jane Austen",
    nameRu: "Джейн Остин",
    bio: "Ingliz roman yozuvchisi, XIX asr eng muhim adiblaridan biri.",
    bioRu: "Английская романистка, один из важнейших авторов XIX века.",
  },
  {
    id: 6,
    name: "Agatha Christie",
    nameRu: "Агата Кристи",
    bio: "Ingliz detektiv romani ustasi. Hercule Poirot yaratuvchisi.",
    bioRu: "Мастер английского детективного романа. Создательница Эркюля Пуаро.",
  },
  {
    id: 7,
    name: "Erix Mariya Remark",
    nameRu: "Эрих Мария Ремарк",
    bio: "Nemis yozuvchisi, urush va tinchlik mavzusidagi romanlari bilan tanilgan.",
    bioRu: "Немецкий писатель, известный романами о войне и мире.",
  },
  {
    id: 8,
    name: "Stefan Svayg",
    nameRu: "Стефан Цвейг",
    bio: "Avstriyalik yozuvchi, psixologik qissalari bilan mashhur.",
    bioRu: "Австрийский писатель, известный психологическими повестями.",
  },
];

export const getAuthorById = (id: number) =>
  authorsData.find((a) => a.id === id);
