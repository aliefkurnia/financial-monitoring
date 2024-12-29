import mongoose from "mongoose";

const TransactionSchema = new mongoose.Schema(
  {
    transactionId: { type: String, required: true, unique: true },
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    type: { type: String, enum: ["income", "expense"], required: true },
    amount: { type: Number, required: true },
    description: { type: String, required: true },
    date: { type: Date, required: true },
  },
  { timestamps: true }
);

// Replace the default _id with transactionId
TransactionSchema.set("toObject", {
  transform: (doc, ret) => {
    ret.id = ret.transactionId; // Change _id to transactionId
    delete ret._id;
  },
});

const Transaction =
  mongoose.models.Transaction ||
  mongoose.model("Transaction", TransactionSchema);

export default Transaction;
