import { NextApiRequest, NextApiResponse } from "next";
import dbConnect from "../../lib/mongodb";
import Transaction from "../../models/TransactionModel";
import User from "../../models/UserModel";
import { Types } from "mongoose";
import { v4 as uuidv4 } from "uuid"; // Import uuid to generate a custom transactionId

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  await dbConnect();

  switch (req.method) {
    case "POST":
      const { userId, type, amount, description, date } = req.body;

      // Validate required fields
      if (!userId || !type || !amount || !description || !date) {
        return res.status(400).json({ message: "Semua field harus diisi" });
      }

      // Validate userId format
      if (!Types.ObjectId.isValid(userId)) {
        return res.status(400).json({ message: "Invalid User ID" });
      }

      // Validate amount
      if (isNaN(amount) || amount <= 0) {
        return res
          .status(400)
          .json({ message: "Amount must be a positive number" });
      }

      // Validate date format
      const parsedDate = new Date(date);
      if (isNaN(parsedDate.getTime())) {
        return res.status(400).json({ message: "Invalid date format" });
      }

      try {
        // Generate a unique transactionId
        const transactionId = uuidv4();

        // Create and save the new transaction
        const newTransaction = new Transaction({
          transactionId, // Add the custom transactionId
          userId: new Types.ObjectId(userId),
          type,
          amount,
          description,
          date: parsedDate,
        });

        await newTransaction.save();

        // Find the user and add the transaction to their record
        const user = await User.findById(userId);
        if (!user) {
          return res.status(404).json({ message: "User not found" });
        }

        user.transactions.push(newTransaction._id);
        await user.save();

        // Respond with the newly created transaction
        res.status(201).json(newTransaction);
      } catch (error) {
        console.error("Error creating transaction:", error);
        res
          .status(500)
          .json({ message: "Terjadi kesalahan saat menambahkan transaksi" });
      }
      break;

    case "GET":
      res.setHeader("Cache-Control", "no-store"); // Prevent caching

      const {
        userId: queryUserId,
        type: transactionType,
        lastSummary,
      } = req.query;

      // Validate userId format
      if (!queryUserId || !Types.ObjectId.isValid(queryUserId as string)) {
        return res.status(400).json({ message: "Invalid or missing userId" });
      }

      try {
        if (lastSummary === "true") {
          const lastTransactions = await Transaction.find({
            userId: queryUserId,
          })
            .sort({ createdAt: -1 })
            .limit(5);

          if (lastTransactions.length === 0) {
            return res.status(404).json({ message: "No transactions found" });
          }

          return res.status(200).json(lastTransactions);
        }

        interface Filter {
          userId: Types.ObjectId;
          type?: "income" | "expense";
        }

        const filter: Filter = {
          userId: new Types.ObjectId(queryUserId as string),
        };

        if (
          transactionType &&
          (transactionType === "income" || transactionType === "expense")
        ) {
          filter.type = transactionType;
        }

        const transactions = await Transaction.find(filter);

        if (transactions.length === 0) {
          return res.status(404).json({ message: "No transactions found" });
        }

        res.status(200).json(transactions);
      } catch (error) {
        console.error("Error fetching transactions:", error);
        res
          .status(500)
          .json({ message: "Terjadi kesalahan saat mengambil transaksi" });
      }
      break;

    case "DELETE":
      const { transactionId } = req.query;

      if (!transactionId || typeof transactionId === "undefined") {
        return res
          .status(400)
          .json({ message: "Invalid or missing transactionId" });
      }

      try {
        const transaction = await Transaction.findOneAndDelete({
          transactionId: transactionId,
        });

        const user = await User.findOne({ transactions: transaction._id });
        if (user) {
          user.transactions = user.transactions.filter(
            (t: Types.ObjectId) => !t.equals(transaction._id)
          );
          await user.save();
        }

        res.status(200).json({ message: "Transaction deleted successfully" });
      } catch (error) {
        console.error("Error deleting transaction:", error);
        res.status(500).json({ message: "Error deleting transaction" });
      }
      break;

    default:
      res.setHeader("Allow", ["POST", "GET", "DELETE"]);
      res.status(405).json({ message: `Method ${req.method} Not Allowed` });
      break;
  }
}
