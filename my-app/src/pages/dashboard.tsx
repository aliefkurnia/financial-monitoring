import { useState, useEffect } from "react";
import Layout from "../components/LayoutComponent";
import LastSummary from "../components/LastSummaryComponent";
import CombinedChart from "../components/CombinedChartComponent";
import SavingsPrediction from "../components/SavingsPredictionComponent";
import AddTransactionForm from "../components/AddTransactionForm";
import { Transaction } from "../interfaces/InterfaceData";

const Dashboard = () => {
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [totalIncome, setTotalIncome] = useState(0);
  const [totalExpense, setTotalExpense] = useState(0);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const savings = 500;

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const userId = sessionStorage.getItem("userId");

        if (!userId) {
          setError("User ID is missing in session storage");
          return;
        }

        const response = await fetch(`/api/transaction?userId=${userId}`);

        if (!response.ok) {
          await response.text();
          return;
        }

        const data: Transaction[] = await response.json();
        setTransactions(data);

        if (data.length > 0) {
          const income = data
            .filter((transaction) => transaction.type === "income")
            .reduce((acc, curr) => acc + curr.amount, 0);
          const expense = data
            .filter((transaction) => transaction.type === "expense")
            .reduce((acc, curr) => acc + curr.amount, 0);
          setTotalIncome(income);
          setTotalExpense(expense);
        }
      } catch (error) {
        console.error("Error fetching data:", error);
        setError("Gagal memuat data transaksi! Coba lagi nanti.");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  // Handle Add Transaction
  const handleAddTransaction = async (
    newTransaction: Omit<Transaction, "userId" | "transactionId">
  ) => {
    const userId = sessionStorage.getItem("userId");

    if (!userId) {
      console.error("User ID is missing in session storage");
      return;
    }

    const transactionWithUserId: Omit<Transaction, "transactionId"> = {
      ...newTransaction,
      userId, // Add userId to the transaction
    };

    try {
      const response = await fetch("/api/transaction", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(transactionWithUserId),
      });

      if (!response.ok) {
        throw new Error("Gagal menambahkan transaksi");
      }

      const addedTransaction: Transaction = await response.json();

      // Add the new transaction to the state
      setTransactions((prevTransactions) => {
        const updatedTransactions = [...prevTransactions, addedTransaction];
        return updatedTransactions;
      });

      // Recalculate total income and expense
      setTotalIncome(
        (prevIncome) =>
          prevIncome +
          (addedTransaction.type === "income" ? addedTransaction.amount : 0)
      );
      setTotalExpense(
        (prevExpense) =>
          prevExpense +
          (addedTransaction.type === "expense" ? addedTransaction.amount : 0)
      );

      console.log("Transaction successfully added:", addedTransaction);
    } catch (error) {
      console.error("Error adding transaction:", error);
      setError("Terjadi kesalahan saat menambahkan transaksi");
    }
  };

  if (loading) {
    return <p>Loading...</p>;
  }

  return (
    <Layout>
      {error && <p className="text-red-500">{error}</p>}

      {transactions.length === 0 ? (
        <>
          <p className="text-lg text-gray-600 mb-4">
            No transactions found. Please add a transaction below:
          </p>
          <div className="bg-white shadow-md rounded-lg p-6 mb-8">
            <AddTransactionForm onAddTransaction={handleAddTransaction} />
          </div>
        </>
      ) : (
        <>
          <div className="bg-white shadow-md rounded-lg p-6 mb-8">
            <h3 className="text-2xl font-semibold mb-4">
              Grafik Pemasukan dan Pengeluaran
            </h3>
            <CombinedChart
              incomeData={transactions.filter((t) => t.type === "income")}
              expenseData={transactions.filter((t) => t.type === "expense")}
            />
          </div>

          <div className="mb-8">
            <LastSummary transactions={transactions} />
          </div>

          <div className="bg-white shadow-md rounded-lg p-6 mb-8">
            <AddTransactionForm onAddTransaction={handleAddTransaction} />
          </div>

          <div className="bg-white shadow-md rounded-lg p-6 mb-8">
            <h3 className="text-2xl font-semibold mb-4">Prediksi Tabungan</h3>
            <SavingsPrediction savings={savings} />
          </div>
        </>
      )}
    </Layout>
  );
};

export default Dashboard;
