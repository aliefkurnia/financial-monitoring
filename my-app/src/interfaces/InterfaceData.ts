export interface IUser {
  username: string;
  email: string;
  password: string;
  createdAt?: Date;
  updatedAt?: Date;
  transactions: Transaction[];
}

export interface Transaction {
  transactionId: string;
  userId: string;
  description: string;
  amount: number;
  type: "income" | "expense";
  date: string;
  createdAt?: string;
  updatedAt?: string;
}

export interface IncomeData {
  date: string;
  amount: number;
}

export interface ExpenseData {
  date: string;
  amount: number;
}
