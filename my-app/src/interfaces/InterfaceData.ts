export interface IUser {
  username: string;
  email: string;
  password: string;
  createdAt?: Date;
  updatedAt?: Date;
  transactions: Transaction[];
}

export interface Transaction {
  _id: string;
  userId: string;
  type: "income" | "expense";
  amount: number;
  description: string;
  date: Date;
}

export interface IncomeData {
  date: string;
  amount: number;
}

export interface ExpenseData {
  date: string;
  amount: number;
}
