import { useState, useEffect } from "react";
import { Transaction } from "../interfaces/InterfaceData";

const WeeklySummary = () => {
  const [totalIncome, setTotalIncome] = useState(0);
  const [totalExpense, setTotalExpense] = useState(0);
  const [balance, setBalance] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [recentTransactions, setRecentTransactions] = useState<Transaction[]>(
    []
  );

  useEffect(() => {
    const fetchTransactions = async () => {
      try {
        const apiUrl = "/api/lastSummary"; // Mengakses API yang sudah dibuat

        const response = await fetch(apiUrl);
        if (!response.ok) {
          throw new Error("Gagal memuat data transaksi");
        }
        const data: Transaction[] = await response.json();

        const income = data
          .filter((transaction) => transaction.type === "income")
          .reduce((acc, curr) => acc + curr.amount, 0);
        const expense = data
          .filter((transaction) => transaction.type === "expense")
          .reduce((acc, curr) => acc + curr.amount, 0);
        const balance = income - expense;

        setTotalIncome(income);
        setTotalExpense(expense);
        setBalance(balance);
        setRecentTransactions(data);
      } catch (err) {
        setError(err instanceof Error ? err.message : "Terjadi kesalahan");
      } finally {
        setLoading(false);
      }
    };

    fetchTransactions();
  }, []);

  if (loading) return <p>Loading...</p>;
  if (error) return <p className="text-red-500">{error}</p>;

  return (
    <div className="bg-white p-6 rounded-lg shadow-md">
      <h2 className="text-2xl font-semibold mb-4">Ringkasan Mingguan</h2>
      {/* Menampilkan transaksi terakhir */}
      <h2 className="text-2xl font-semibold mb-4">5 Transaksi Terakhir</h2>
      <div className="space-y-4">
        {recentTransactions.map((transaction) => (
          <div
            key={transaction._id}
            className="bg-gray-100 p-4 rounded-lg shadow"
          >
            <h3 className="text-xl font-semibold">
              {transaction.type === "income" ? "Pendapatan" : "Pengeluaran"}
            </h3>
            <p className="text-lg">{transaction.description}</p>
            <p className="text-sm text-gray-500">
              {new Date(transaction.date).toLocaleDateString()}
            </p>
            <p
              className={`text-lg font-bold ${
                transaction.type === "income"
                  ? "text-green-700"
                  : "text-red-700"
              }`}
            >
              Rp {transaction.amount.toLocaleString()}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default WeeklySummary;
