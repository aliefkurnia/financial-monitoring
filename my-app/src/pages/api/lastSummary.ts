// my-app/src/pages/api/lastSummary.ts

import type { NextApiRequest, NextApiResponse } from "next";
import { Transaction } from "../../interfaces/InterfaceData";

// Contoh data transaksi
const transactions: Transaction[] = [
  {
    _id: "1",
    userId: "user1",
    type: "income",
    amount: 100000,
    description: "Gaji Bulanan",
    date: new Date("2024-12-21T10:00:00Z"), // Menggunakan objek Date
  },
  {
    _id: "2",
    userId: "user2",
    type: "expense",
    amount: 50000,
    description: "Pembelian Barang",
    date: new Date("2024-12-20T15:00:00Z"), // Menggunakan objek Date
  },
  {
    _id: "3",
    userId: "user3",
    type: "income",
    amount: 200000,
    description: "Bonus Tahunan",
    date: new Date("2024-12-18T08:00:00Z"), // Menggunakan objek Date
  },
  {
    _id: "4",
    userId: "user4",
    type: "expense",
    amount: 70000,
    description: "Tagihan Listrik",
    date: new Date("2024-12-15T12:00:00Z"), // Menggunakan objek Date
  },
  {
    _id: "5",
    userId: "user5",
    type: "expense",
    amount: 150000,
    description: "Makan di restoran",
    date: new Date("2024-12-10T20:00:00Z"), // Menggunakan objek Date
  },
  {
    _id: "6",
    userId: "user6",
    type: "income",
    amount: 120000,
    description: "Freelance Project",
    date: new Date("2024-12-05T18:00:00Z"), // Menggunakan objek Date
  },
];

export default function handler(req: NextApiRequest, res: NextApiResponse) {
  // Mengambil 5 transaksi terakhir dan mengurutkannya berdasarkan tanggal
  const lastSummary = transactions
    .sort((a, b) => b.date.getTime() - a.date.getTime()) // Menggunakan .getTime() untuk perbandingan
    .slice(0, 5);

  // Mengirimkan respons
  res.status(200).json(lastSummary);
}
