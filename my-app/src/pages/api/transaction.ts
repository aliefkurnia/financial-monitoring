import { NextApiRequest, NextApiResponse } from "next";
import dbConnect from "../../lib/mongodb";
import Transaction from "../../models/TransactionModel";
import { Types } from "mongoose";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  await dbConnect();

  switch (req.method) {
    case "GET":
      const userId = req.query.userId as string;

      if (!userId) {
        return res.status(400).json({ message: "User ID harus disertakan" });
      }

      try {
        const transactions = await Transaction.find({
          userId: new Types.ObjectId(userId),
        });
        res.status(200).json(transactions);
      } catch (error) {
        console.error(error);
        res
          .status(500)
          .json({ message: "Terjadi kesalahan saat mengambil data transaksi" });
      }
      break;

    case "POST":
      const { userId: postUserId, type, amount, description, date } = req.body;

      if (!postUserId || !type || !amount || !description || !date) {
        return res.status(400).json({ message: "Semua field harus diisi" });
      }

      try {
        const newTransaction = new Transaction({
          userId: new Types.ObjectId(postUserId),
          type,
          amount,
          description,
          date: new Date(date),
        });

        await newTransaction.save();
        res.status(201).json(newTransaction);
      } catch (error) {
        console.error(error);
        res
          .status(500)
          .json({ message: "Terjadi kesalahan saat menambahkan transaksi" });
      }
      break;

    case "DELETE":
      const { transactionId } = req.body;

      if (!transactionId) {
        return res
          .status(400)
          .json({ message: "Transaction ID harus disertakan" });
      }

      try {
        const deletedTransaction = await Transaction.findByIdAndDelete(
          transactionId
        );

        if (!deletedTransaction) {
          return res.status(404).json({ message: "Transaksi tidak ditemukan" });
        }

        res.status(200).json({ message: "Transaksi berhasil dihapus" });
      } catch (error) {
        console.error(error);
        res
          .status(500)
          .json({ message: "Terjadi kesalahan saat menghapus transaksi" });
      }
      break;

    default:
      res.setHeader("Allow", ["GET", "POST", "DELETE"]);
      res.status(405).json({ message: `Metode ${req.method} tidak diizinkan` });
      break;
  }
}
