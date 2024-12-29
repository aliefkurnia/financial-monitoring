import {
  BarChart,
  Bar,
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

// Helper function to format date to "YYYY-MM"
const formatDateToMonth = (date: string) => {
  const d = new Date(date);
  return `${d.getFullYear()}-${(d.getMonth() + 1).toString().padStart(2, "0")}`;
};

// Function to aggregate data by month
const aggregateDataByMonth = (data: { date: string; amount: number }[]) => {
  const aggregatedData: { [key: string]: number } = {};

  data.forEach(({ date, amount }) => {
    const month = formatDateToMonth(date);
    if (!aggregatedData[month]) {
      aggregatedData[month] = 0;
    }
    aggregatedData[month] += amount;
  });

  return aggregatedData;
};

// Generate all months of the last 12 months
const generateLast12Months = () => {
  const months: string[] = [];
  const currentDate = new Date();

  for (let i = 11; i >= 0; i--) {
    const date = new Date(currentDate);
    date.setMonth(date.getMonth() - i);
    months.push(formatDateToMonth(date.toISOString()));
  }

  return months;
};

const CombinedChart = ({ incomeData, expenseData }: CombinedChartProps) => {
  if (incomeData.length === 0 && expenseData.length === 0) {
    return <p>No data available to display the chart.</p>;
  }
  // Aggregate the income and expense data by month
  const aggregatedIncomeData = aggregateDataByMonth(incomeData);
  const aggregatedExpenseData = aggregateDataByMonth(expenseData);

  // Generate a list of months for the last 12 months
  const last12Months = generateLast12Months();

  // Combine the data into a single array for chart plotting
  const combinedData = last12Months.map((month) => ({
    date: month,
    income: aggregatedIncomeData[month] || 0,
    expense: aggregatedExpenseData[month] || 0,
  }));

  // Sort the data by date
  combinedData.sort((a, b) => (a.date > b.date ? 1 : -1));

  return (
    <ResponsiveContainer width="100%" height={400}>
      <BarChart data={combinedData}>
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis dataKey="date" />
        <YAxis />
        <Tooltip />
        <Legend />
        <Bar dataKey="income" fill="darkblue" />
        <Bar dataKey="expense" fill="red" />
      </BarChart>
    </ResponsiveContainer>
  );
};

export default CombinedChart;
