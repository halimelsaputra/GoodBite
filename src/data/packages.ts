// Import images
import rotiBakarImage from "@/img/Roti-bakar.jpg";
import kopiKananganImage from "@/img/Kopi-kenangan.jpg";
import pizzaHutImage from "@/img/Pizza-hut.jpg";
import jcoImage from "@/img/J.co.jpg";
import kfcImage from "@/img/KfC.jpg";
import rotiO from "@/img/Roti-O.jpg";
import chatime from "@/img/Chatime.jpg";
import hokben from "@/img/Hokben.jpg";
import geprek from "@/img/Geprek-bensu.jpg";
export interface Package {
  id: string;
  storeName: string;
  location: string;
  category: string;
  price: number;
  originalValue: number;
  available: number;
  pickupTime: string;
  description: string;
  image: string;
}

export const packages: Package[] = [
  {
    id: "1",
    storeName: "Roti Bakar 88",
    location: "Peuniti",
    category: "Bakery",
    price: 15000,
    originalValue: 45000,
    available: 5,
    pickupTime: "18:00 - 20:00",
    description: "Paket kejutan berisi roti bakar, kue-kue segar, dan pastry pilihan dari oven kami hari ini",
    image: rotiBakarImage
  },
  {
    id: "2",
    storeName: "Kopi Kenangan",
    location: "Batoh",
    category: "Minuman",
    price: 20000,
    originalValue: 50000,
    available: 3,
    pickupTime: "19:00 - 21:00",
    description: "Paket minuman spesial berisi kopi dan minuman pilihan lainnya",
    image: kopiKananganImage
  },
  {
    id: "3",
    storeName: "Geprek Bensu",
    location: "Lhambhuk",
    category: "Restoran",
    price: 25000,
    originalValue: 65000,
    available: 8,
    pickupTime: "20:00 - 21:30",
    description: "Paket makan malam surprise dengan ayam geprek dan lauk pelengkap",
    image: geprek
  },
  {
    id: "4",
    storeName: "J.Co Donuts",
    location: "Darussalam",
    category: "Bakery",
    price: 30000,
    originalValue: 80000,
    available: 4,
    pickupTime: "21:00 - 22:00",
    description: "Paket donat segar berbagai varian rasa pilihan hari ini",
    image: jcoImage
  },
  {
    id: "5",
    storeName: "Pizza Hut",
    location: "Peuniti",
    category: "Restoran",
    price: 35000,
    originalValue: 100000,
    available: 2,
    pickupTime: "20:30 - 22:00",
    description: "Paket pizza dan side dish spesial dari menu hari ini",
    image: pizzaHutImage
  },
  {
    id: "6",
    storeName: "Roti'O",
    location: "Batoh",
    category: "Bakery",
    price: 18000,
    originalValue: 50000,
    available: 6,
    pickupTime: "19:30 - 21:00",
    description: "Paket roti O spesial berbagai varian rasa pilihan",
    image: rotiO
  },
  {
    id: "7",
    storeName: "Chatime",
    location: "Lhambhuk",
    category: "Minuman",
    price: 22000,
    originalValue: 55000,
    available: 7,
    pickupTime: "18:30 - 20:30",
    description: "Paket minuman bubble tea pilihan berbagai rasa",
    image: chatime
  },
  {
    id: "8",
    storeName: "Hokben",
    location: "Darussalam",
    category: "Restoran",
    price: 28000,
    originalValue: 70000,
    available: 5,
    pickupTime: "19:00 - 20:30",
    description: "Paket bento spesial dengan lauk lengkap pilihan chef",
    image: hokben
  }
];
