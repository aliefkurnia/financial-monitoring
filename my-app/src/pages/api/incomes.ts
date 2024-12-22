import { NextApiRequest, NextApiResponse } from "next";
import { IncomeData } from "../../interfaces/InterfaceData"; // Mengimpor interface

export default function handler(req: NextApiRequest, res: NextApiResponse) {
  const dummyIncomeData: IncomeData[] = [
    { date: "2024-12-01", amount: 2000 },
    { date: "2024-12-02", amount: 2200 },
    { date: "2024-12-03", amount: 2500 },
    { date: "2024-12-04", amount: 1800 },
    { date: "2024-12-05", amount: 2100 },
    { date: "2024-12-06", amount: 2300 },
    { date: "2024-12-07", amount: 2400 },
  ];

  res.status(200).json(dummyIncomeData);
}
