import { NextApiRequest, NextApiResponse } from "next";
import { ExpenseData } from "../../interfaces/InterfaceData";

export default function handler(req: NextApiRequest, res: NextApiResponse) {
  const dummyExpenseData: ExpenseData[] = [
    { date: "2024-12-01", amount: 1500 },
    { date: "2024-12-02", amount: 1600 },
    { date: "2024-12-03", amount: 1300 },
    { date: "2024-12-04", amount: 1400 },
    { date: "2024-12-05", amount: 1500 },
    { date: "2024-12-06", amount: 1700 },
    { date: "2024-12-07", amount: 1600 },
  ];

  res.status(200).json(dummyExpenseData);
}
