import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from 'recharts';

interface TrendChartProps {
  data: Array<{
    date: string;
    income: number;
    expense: number;
  }>;
}

export default function TrendChart({ data }: TrendChartProps) {
  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: 'IDR',
      minimumFractionDigits: 0,
    }).format(value);
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('id-ID', { month: 'short', day: 'numeric' });
  };

  return (
    <div className="card">
      <h2 className="text-xl font-bold mb-4">Spending Trend</h2>
      {data.length > 0 ? (
        <ResponsiveContainer width="100%" height={300}>
          <LineChart data={data}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis 
              dataKey="date" 
              tickFormatter={formatDate}
              style={{ fontSize: '12px' }}
            />
            <YAxis 
              tickFormatter={(value) => `Rp ${(value / 1000000).toFixed(1)}M`}
              style={{ fontSize: '12px' }}
            />
            <Tooltip 
              formatter={(value: number) => formatCurrency(value)}
              labelFormatter={formatDate}
            />
            <Legend />
            <Line 
              type="monotone" 
              dataKey="income" 
              stroke="#10B981" 
              strokeWidth={2}
              name="Income"
            />
            <Line 
              type="monotone" 
              dataKey="expense" 
              stroke="#EF4444" 
              strokeWidth={2}
              name="Expense"
            />
          </LineChart>
        </ResponsiveContainer>
      ) : (
        <div className="text-center py-8 text-gray-500">
          No trend data available
        </div>
      )}
    </div>
  );
}
