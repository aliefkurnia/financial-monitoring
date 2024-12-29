import { useEffect, useState } from "react";
import { Transaction } from "../interfaces/InterfaceData";

interface LastSummaryProps {
  transactions: Transaction[];
}

const LastSummary = ({ transactions }: LastSummaryProps) => {
  const [totalIncome, setTotalIncome] = useState(0);
  const [totalExpense, setTotalExpense] = useState(0);
  const [balance, setBalance] = useState(0);

  useEffect(() => {
    const currentMonth = new Date().getMonth();
    const currentYear = new Date().getFullYear();

    const monthlyTransactions = transactions.filter((transaction) => {
      const transactionDate = new Date(transaction.date);
      return (
        transactionDate.getMonth() === currentMonth &&
        transactionDate.getFullYear() === currentYear
      );
    });

    const income = monthlyTransactions
      .filter((transaction) => transaction.type === "income")
      .reduce((acc, curr) => acc + curr.amount, 0);

    const expense = monthlyTransactions
      .filter((transaction) => transaction.type === "expense")
      .reduce((acc, curr) => acc + curr.amount, 0);

    setTotalIncome(income);
    setTotalExpense(expense);
    setBalance(income - expense);
  }, [transactions]);

  return (
    <div className="bg-white shadow-md rounded-lg p-6 mb-8">
      <h2 className="text-2xl font-semibold mb-4">Monthly Summary</h2>
      <div className="flex space-x-6">
        <div className="flex-1">
          <div className="bg-gray-100 p-4 rounded-lg shadow">
            <h3 className="text-lg font-semibold">Total Income</h3>
            <p className="text-xl font-bold text-green-700">
              Rp {totalIncome.toLocaleString()}
            </p>
          </div>
        </div>
        <div className="flex-1">
          <div className="bg-gray-100 p-4 rounded-lg shadow">
            <h3 className="text-lg font-semibold">Total Expense</h3>
            <p className="text-xl font-bold text-red-700">
              Rp {totalExpense.toLocaleString()}
            </p>
          </div>
        </div>
        <div className="flex-1">
          <div className="bg-gray-100 p-4 rounded-lg shadow">
            <h3 className="text-lg font-semibold">Balance</h3>
            <p className="text-xl font-bold text-blue-700">
              Rp {balance.toLocaleString()}
            </p>
          </div>
        </div>
      </div>

      <h3 className="text-2xl font-semibold mb-4 mt-8">
        5 Recent Transactions
      </h3>
      <div className="flex space-x-4 overflow-x-auto pb-4">
        {transactions
          .slice(0, 5)
          .reverse()
          .map((transaction) => (
            <div
              key={transaction.transactionId}
              className={`${
                transaction.type === "income"
                  ? "bg-green-100 border-green-100"
                  : "bg-red-100 border-red-100"
              } bg-opacity-80 p-4 rounded-lg shadow flex-1 min-w-[300px] border-2`}
            >
              <h3 className="text-xl font-semibold">
                {transaction.type === "income" ? "Income" : "Expense"}
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

export default LastSummary;
