import { useState, useEffect } from "react";
import Layout from "../components/LayoutComponent";
import LastSummary from "../components/LastSummaryComponent";
import CombinedChart from "../components/CombinedChartComponent";
import SavingsPrediction from "../components/SavingsPredictionComponent";
import { IncomeData, ExpenseData } from "../interfaces/InterfaceData";

const Dashboard = () => {
  const [incomeData, setIncomeData] = useState<IncomeData[]>([]);
  const [expenseData, setExpenseData] = useState<ExpenseData[]>([]);
  const savings = 500;

  useEffect(() => {
    const fetchIncomeData = async () => {
      try {
        const response = await fetch("/api/incomes");
        const data = await response.json();
        setIncomeData(data);
      } catch (error) {
        console.error("Error fetching income data:", error);
      }
    };

    const fetchExpenseData = async () => {
      try {
        const response = await fetch("/api/expenses");
        const data = await response.json();
        setExpenseData(data);
      } catch (error) {
        console.error("Error fetching expense data:", error);
      }
    };

    fetchIncomeData();
    fetchExpenseData();
  }, []);

  return (
    <Layout>
      <div className="bg-white shadow-md rounded-lg p-6 mb-8">
        <h3 className="text-2xl font-semibold mb-4">
          Grafik Pemasukan dan Pengeluaran
        </h3>
        <CombinedChart incomeData={incomeData} expenseData={expenseData} />
      </div>

      <div className="mb-8">
        <LastSummary />
      </div>

      <div className="bg-white shadow-md rounded-lg p-6 mb-8">
        <h3 className="text-2xl font-semibold mb-4">Prediksi Tabungan</h3>
        <SavingsPrediction savings={savings} />
      </div>
    </Layout>
  );
};

export default Dashboard;
