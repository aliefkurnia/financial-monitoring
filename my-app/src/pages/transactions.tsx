import { useState, useEffect } from "react";
import { useRouter } from "next/router";
import { Transaction } from "../interfaces/InterfaceData";

const Transactions = () => {
  const router = useRouter();
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [newTransaction, setNewTransaction] = useState<Transaction>({
    _id: "",
    userId: "",
    type: "income",
    amount: 0,
    description: "",
    date: new Date(),
  });

  useEffect(() => {
    const fetchTransactions = async () => {
      const userId = "USER_ID"; // Ganti dengan user ID yang sesuai
      try {
        const response = await fetch(`/api/transaction?userId=${userId}`);
        const data = await response.json();
        setTransactions(data);
      } catch (error) {
        console.error("Error fetching transactions:", error);
      }
    };

    fetchTransactions();
  }, []);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setNewTransaction((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      const response = await fetch("/api/transaction", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(newTransaction),
      });

      if (response.ok) {
        const transaction = await response.json();
        setTransactions((prev) => [...prev, transaction]);
        setNewTransaction({
          _id: "",
          userId: "",
          type: "income",
          amount: 0,
          description: "",
          date: new Date(),
        });
      }
    } catch (error) {
      console.error("Error creating transaction:", error);
    }
  };

  const handleDelete = async (id: string) => {
    try {
      const response = await fetch("/api/transaction", {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ transactionId: id }),
      });

      if (response.ok) {
        setTransactions((prev) =>
          prev.filter((transaction) => transaction._id !== id)
        );
      }
    } catch (error) {
      console.error("Error deleting transaction:", error);
    }
  };

  const handleEdit = (transaction: Transaction) => {
    setNewTransaction(transaction);
  };

  return (
    <div>
      <h2 className="text-3xl font-bold mb-4">Manage Transactions</h2>

      <form onSubmit={handleSubmit} className="mb-4">
        <input
          type="text"
          name="description"
          placeholder="Description"
          value={newTransaction.description}
          onChange={handleChange}
          required
          className="border p-2 mr-2"
        />
        <input
          type="number"
          name="amount"
          placeholder="Amount"
          value={newTransaction.amount}
          onChange={handleChange}
          required
          className="border p-2 mr-2"
        />
        <select
          name="type"
          value={newTransaction.type}
          onChange={handleChange}
          className="border p-2 mr-2"
        >
          <option value="income">Income</option>
          <option value="expense">Expense</option>
        </select>
        <input
          type="date"
          name="date"
          value={
            newTransaction.date
              ? new Date(newTransaction.date).toISOString().split("T")[0]
              : ""
          }
          onChange={handleChange}
          required
          className="border p-2 mr-2"
        />
        <button type="submit" className="bg-blue-500 text-white p-2 rounded">
          Add Transaction
        </button>
      </form>

      <div className="transactions-list">
        <h3 className="text-xl font-semibold mb-4">Transactions</h3>
        <table className="table-auto w-full">
          <thead>
            <tr>
              <th className="border p-2">Type</th>
              <th className="border p-2">Amount</th>
              <th className="border p-2">Description</th>
              <th className="border p-2">Date</th>
              <th className="border p-2">Actions</th>
            </tr>
          </thead>
          <tbody>
            {transactions.map((transaction) => (
              <tr key={transaction._id}>
                <td className="border p-2">{transaction.type}</td>
                <td className="border p-2">{transaction.amount}</td>
                <td className="border p-2">{transaction.description}</td>
                <td className="border p-2">
                  {new Date(transaction.date).toLocaleDateString()}
                </td>
                <td className="border p-2">
                  <button
                    onClick={() => handleEdit(transaction)}
                    className="bg-yellow-500 text-white p-1 rounded mr-2"
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => handleDelete(transaction._id)}
                    className="bg-red-500 text-white p-1 rounded"
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default Transactions;
