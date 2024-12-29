import { useState } from "react";
import { Transaction } from "../interfaces/InterfaceData";

interface AddTransactionFormProps {
  onAddTransaction: (transaction: Transaction) => void;
}

const AddTransactionForm: React.FC<AddTransactionFormProps> = ({
  onAddTransaction,
}) => {
  const [description, setDescription] = useState("");
  const [amount, setAmount] = useState<number>(0);
  const [type, setType] = useState<"income" | "expense">("income");
  const [date, setDate] = useState<string>(
    new Date().toISOString().split("T")[0]
  );

  const formatAmount = (value: string) => {
    const numericValue = value.replace(/\D/g, ""); // Remove non-numeric characters
    const formattedValue = parseInt(numericValue).toLocaleString("id-ID"); // Format as IDR
    return formattedValue;
  };

  const handleAmountChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const rawValue = e.target.value.replace(/\D/g, ""); // Remove non-numeric characters
    const formattedValue = formatAmount(rawValue);
    setAmount(parseInt(rawValue));
    e.target.value = formattedValue;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const userId = sessionStorage.getItem("userId");

    if (!userId) {
      console.error("User ID is not available in sessionStorage");
      return;
    }

    const transactionId = `${userId}-${Date.now()}`;

    const newTransaction: Transaction = {
      transactionId,
      userId,
      description,
      amount,
      type,
      date,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    onAddTransaction(newTransaction);

    setDescription("");
    setAmount(0);
    setType("income");
    setDate(new Date().toISOString().split("T")[0]);
  };

  return (
    <form onSubmit={handleSubmit} className="flex gap-6 items-center">
      <div className="mb-4 flex-1">
        <label htmlFor="description" className="block text-sm font-medium">
          Description
        </label>
        <input
          id="description"
          type="text"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          className="border p-2 w-full"
          required
        />
      </div>

      <div className="mb-4 flex-1">
        <label htmlFor="amount" className="block text-sm font-medium">
          Amount
        </label>
        <input
          id="amount"
          type="text"
          value={formatAmount(amount.toString())}
          onChange={handleAmountChange}
          className="border p-2 w-full"
          required
          placeholder="0"
        />
      </div>

      <div className="mb-4 flex-1">
        <label className="block text-sm font-medium">Type</label>
        <div className="flex gap-6">
          <div>
            <input
              type="radio"
              id="income"
              name="type"
              value="income"
              checked={type === "income"}
              onChange={() => setType("income")}
              className="mr-2"
            />
            <label htmlFor="income">Income</label>
          </div>
          <div>
            <input
              type="radio"
              id="expense"
              name="type"
              value="expense"
              checked={type === "expense"}
              onChange={() => setType("expense")}
              className="mr-2"
            />
            <label htmlFor="expense">Expense</label>
          </div>
        </div>
      </div>

      <div className="mb-4 flex-1">
        <label htmlFor="date" className="block text-sm font-medium">
          Date
        </label>
        <input
          id="date"
          type="date"
          value={date}
          onChange={(e) => setDate(e.target.value)}
          className="border p-2 w-full"
        />
      </div>

      <button
        type="submit"
        className="bg-blue-600 hover:bg-blue-700 text-white p-3 rounded-lg  w-[200px] "
      >
        Add
      </button>
    </form>
  );
};

export default AddTransactionForm;
