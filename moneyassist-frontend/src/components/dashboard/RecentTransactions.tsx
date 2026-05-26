import { Link } from 'react-router-dom';
import { Transaction } from '../../types';

interface RecentTransactionsProps {
  transactions: Transaction[];
}

export default function RecentTransactions({ transactions }: RecentTransactionsProps) {
  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: 'IDR',
      minimumFractionDigits: 0,
    }).format(value);
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('id-ID', { 
      month: 'short', 
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  return (
    <div className="card">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-bold">Recent Transactions</h2>
        <Link to="/transactions" className="text-primary text-sm font-semibold hover:underline">
          View All
        </Link>
      </div>

      {transactions.length > 0 ? (
        <div className="space-y-3">
          {transactions.map((transaction) => (
            <div
              key={transaction.id}
              className="flex items-center justify-between p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors"
            >
              <div className="flex items-center space-x-3">
                <div className={`w-10 h-10 rounded-full flex items-center justify-center ${
                  transaction.type === 'income' ? 'bg-green-100' : 'bg-red-100'
                }`}>
                  <span className="text-lg">
                    {transaction.type === 'income' ? '💰' : '💸'}
                  </span>
                </div>
                <div>
                  <p className="font-medium text-gray-900">
                    {transaction.category?.name || 'Uncategorized'}
                  </p>
                  <p className="text-sm text-gray-500">
                    {transaction.description || 'No description'}
                  </p>
                  <p className="text-xs text-gray-400">
                    {formatDate(transaction.transaction_date)}
                  </p>
                </div>
              </div>
              <div className={`text-right ${
                transaction.type === 'income' ? 'text-green-600' : 'text-red-600'
              }`}>
                <p className="font-semibold">
                  {transaction.type === 'income' ? '+' : '-'}
                  {formatCurrency(transaction.amount)}
                </p>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="text-center py-8 text-gray-500">
          <p>No transactions yet</p>
          <Link to="/transactions" className="text-primary text-sm font-semibold hover:underline mt-2 inline-block">
            Add your first transaction
          </Link>
        </div>
      )}
    </div>
  );
}
