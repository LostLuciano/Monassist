import { PieChart, Pie, Cell, ResponsiveContainer, Legend, Tooltip } from 'recharts';

interface ExpenseChartProps {
  data: Array<{
    category: string;
    amount: number;
    percentage: number;
  }>;
}

const COLORS = ['#1E40AF', '#10B981', '#F97316', '#EF4444', '#8B5CF6', '#EC4899'];

export default function ExpenseChart({ data }: ExpenseChartProps) {
  const chartData = data.map((item) => ({
    name: item.category,
    value: item.amount,
    percentage: item.percentage,
  }));

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: 'IDR',
      minimumFractionDigits: 0,
    }).format(value);
  };

  return (
    <div className="card">
      <h2 className="text-xl font-bold mb-4">Expense by Category</h2>
      {data.length > 0 ? (
        <>
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie
                data={chartData}
                cx="50%"
                cy="50%"
                labelLine={false}
                label={({ name, percentage }) => `${name}: ${percentage}%`}
                outerRadius={80}
                fill="#8884d8"
                dataKey="value"
              >
                {chartData.map((_, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip formatter={(value: number) => formatCurrency(value)} />
              <Legend />
            </PieChart>
          </ResponsiveContainer>
          <div className="mt-4 space-y-2">
            {data.map((item, index) => (
              <div key={index} className="flex justify-between items-center">
                <div className="flex items-center">
                  <div
                    className="w-4 h-4 rounded-full mr-2"
                    style={{ backgroundColor: COLORS[index % COLORS.length] }}
                  ></div>
                  <span className="text-sm font-medium">{item.category}</span>
                </div>
                <span className="text-sm text-gray-600">
                  {formatCurrency(item.amount)} ({item.percentage}%)
                </span>
              </div>
            ))}
          </div>
        </>
      ) : (
        <div className="text-center py-8 text-gray-500">
          No expense data available
        </div>
      )}
    </div>
  );
}
