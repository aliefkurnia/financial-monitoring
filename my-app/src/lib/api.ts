export const fetchTransactions = async () => {
  const response = await fetch("/api/transactions");
  if (!response.ok) throw new Error("Failed to fetch transactions");
  return response.json();
};

export const fetchIncome = async () => {
  const response = await fetch("/api/income");
  if (!response.ok) throw new Error("Failed to fetch income data");
  return response.json();
};

export const fetchExpenses = async () => {
  const response = await fetch("/api/expenses");
  if (!response.ok) throw new Error("Failed to fetch expenses data");
  return response.json();
};

export const fetchSavingsPrediction = async () => {
  const response = await fetch("/api/savings");
  if (!response.ok) throw new Error("Failed to fetch savings prediction");
  return response.json();
};
