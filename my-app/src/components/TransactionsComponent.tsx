// src/components/Transactions.tsx
import { useState, useEffect } from "react";
import { Transaction } from "../interfaces/InterfaceData";

const Transactions = () => {
  const [transactions, setTransactions] = useState<Transaction[]>([]);

  useEffect(() => {
    const fetchTransactions = async () => {
      const res = await fetch("/api/transactions");
      const data: Transaction[] = await res.json();
      setTransactions(data);
    };
    fetchTransactions();
  }, []);

  return (
    <div>
      <h1>Transactions</h1>
      <ul>
        {transactions.map((transaction) => (
          <li key={transaction._id}>
            {transaction.type} - {transaction.amount} -{" "}
            {transaction.description}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default Transactions;
