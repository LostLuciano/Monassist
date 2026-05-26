interface StatisticsCardProps {
  title: string;
  amount: number;
  type: 'income' | 'expense' | 'balance';
  icon?: string;
}

export default function StatisticsCard({ title, amount, type, icon }: StatisticsCardProps) {
  const getColorClass = () => {
    switch (type) {
      case 'income':
        return 'text-green-600';
      case 'expense':
        return 'text-red-600';
      case 'balance':
        return 'text-primary';
      default:
        return 'text-gray-900';
    }
  };

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: 'IDR',
      minimumFractionDigits: 0,
    }).format(value);
  };

  return (
    <div className="card hover:shadow-elevation-3 transition-shadow duration-200">
      <div className="flex items-center justify-between mb-2">
        <h3 className="text-sm font-medium text-gray-600">{title}</h3>
        {icon && <span className="text-2xl">{icon}</span>}
      </div>
      <p className={`text-2xl font-bold ${getColorClass()}`}>
        {formatCurrency(amount)}
      </p>
    </div>
  );
}
