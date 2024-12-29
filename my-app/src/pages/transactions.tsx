import { useState, useEffect } from "react";
import { Transaction } from "../interfaces/InterfaceData";
import Layout from "../components/LayoutComponent";
import AddTransactionForm from "../components/AddTransactionForm";

const Transactions = () => {
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const userId = sessionStorage.getItem("userId");
    if (!userId) {
      setError("User ID is not available in sessionStorage");
      return;
    }

    const fetchTransactions = async () => {
      try {
        const response = await fetch(`/api/transaction?userId=${userId}`);
        const data = await response.json();

        if (Array.isArray(data)) {
          setTransactions(data);
        } else {
        }
      } catch (error: any) {
        setError("Error fetching transactions: " + error.message);
      }
    };

    fetchTransactions();
  }, []);

  const handleDelete = async (transactionId: string) => {
    const confirmDelete = window.confirm(
      "Are you sure you want to delete this transaction?"
    );
    if (!confirmDelete) return;

    try {
      const response = await fetch(
        `/api/transaction?transactionId=${transactionId}`,
        {
          method: "DELETE",
          headers: {
            "Content-Type": "application/json",
          },
        }
      );

      if (response.ok) {
        setTransactions((prev) =>
          prev.filter(
            (transaction) => transaction.transactionId !== transactionId
          )
        );
      } else {
        setError("Failed to delete the transaction");
      }
    } catch (error: any) {
      setError("Error deleting transaction: " + error.message);
    }
  };

  const handleAddTransaction = async (transaction: {
    description: string;
    amount: number;
    type: "income" | "expense";
    date: string;
  }) => {
    const userId = sessionStorage.getItem("userId") || "";
    const newTransaction = { ...transaction, userId };

    try {
      const response = await fetch("/api/transaction", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(newTransaction),
      });

      if (response.ok) {
        const createdTransaction = await response.json();
        setTransactions((prev) => [...prev, createdTransaction]);
      } else {
        setError(
          "Failed to add transaction: " + (await response.json()).message
        );
      }
    } catch (error: any) {
      setError("Error creating transaction: " + error.message);
    }
  };

  const formatAmount = (amount: number) => {
    return new Intl.NumberFormat("id-ID", {
      style: "currency",
      currency: "IDR",
    }).format(amount);
  };

  return (
    <Layout>
      <div>
        <h2 className="text-3xl font-bold mb-4">Manage Transactions</h2>

        {error && <div className="text-red-500 mb-4">{error}</div>}

        <AddTransactionForm onAddTransaction={handleAddTransaction} />

        <div className="transactions-list mt-6">
          <h3 className="text-xl font-semibold mb-4">Transactions</h3>
          <table className="table-auto w-full border-collapse">
            <thead>
              <tr className="bg-gray-100">
                <th className="border p-2">Type</th>
                <th className="border p-2">Amount</th>
                <th className="border p-2">Description</th>
                <th className="border p-2">Date</th>
                <th className="border p-2">Actions</th>
              </tr>
            </thead>
            <tbody>
              {transactions.map((transaction) => (
                <tr
                  key={transaction.transactionId}
                  className={
                    transaction.type === "income"
                      ? "bg-green-100"
                      : "bg-red-100"
                  }
                >
                  <td className="border p-2">{transaction.type}</td>
                  <td className="border p-2">
                    {formatAmount(transaction.amount)}
                  </td>
                  <td className="border p-2">{transaction.description}</td>
                  <td className="border p-2">
                    {new Date(transaction.date).toLocaleDateString()}
                  </td>
                  <td className="border p-2">
                    <button
                      onClick={() => handleDelete(transaction.transactionId)}
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
    </Layout>
  );
};

export default Transactions;
