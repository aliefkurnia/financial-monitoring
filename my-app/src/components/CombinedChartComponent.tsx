import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";

interface CombinedChartProps {
  incomeData: { date: string; amount: number }[];
  expenseData: { date: string; amount: number }[];
}

const CombinedChart = ({ incomeData, expenseData }: CombinedChartProps) => {
  const combinedData = incomeData.map((income, index) => ({
    date: income.date,
    income: income.amount,
    expense: expenseData[index]?.amount || 0,
  }));

  return (
    <ResponsiveContainer width="100%" height={400}>
      <LineChart data={combinedData}>
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis dataKey="date" />
        <YAxis />
        <Tooltip />
        <Legend />
        <Line type="monotone" dataKey="income" stroke="green" />
        <Line type="monotone" dataKey="expense" stroke="red" />
      </LineChart>
    </ResponsiveContainer>
  );
};

export default CombinedChart;
