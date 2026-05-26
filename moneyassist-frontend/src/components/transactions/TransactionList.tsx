import { useState } from 'react';
import { Transaction } from '../../types';

interface TransactionListProps {
  transactions: Transaction[];
  onEdit: (transaction: Transaction) => void;
  onDelete: (id: number) => void;
}

export default function TransactionList({ transactions, onEdit, onDelete }: TransactionListProps) {
  const [filter, setFilter] = useState<'all' | 'income' | 'expense'>('all');
  const [searchTerm, setSearchTerm] = useState('');

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: 'IDR',
      minimumFractionDigits: 0,
    }).format(value);
  };

  const getCategoryIcon = (categoryName: string, type: 'income' | 'expense') => {
    const name = categoryName?.toLowerCase() || '';
    if (name.includes('makan') || name.includes('food')) return '🍔';
    if (name.includes('trans') || name.includes('gojek') || name.includes('grab')) return '🚗';
    if (name.includes('belanja') || name.includes('shop')) return '🛒';
    if (name.includes('util') || name.includes('listrik') || name.includes('air')) return '🔌';
    if (name.includes('gaji') || name.includes('salary')) return '💰';
    if (name.includes('invest')) return '📈';
    if (name.includes('hiburan') || name.includes('game')) return '🎮';
    return type === 'income' ? '💰' : '💸';
  };

  const filteredTransactions = transactions.filter((transaction) => {
    const matchesFilter = filter === 'all' || transaction.type === filter;
    const matchesSearch = 
      transaction.description?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      transaction.category?.name.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesFilter && matchesSearch;
  });

  // Group by date
  const groupedTransactions = filteredTransactions.reduce((groups, transaction) => {
    const date = new Date(transaction.transaction_date).toLocaleDateString('id-ID', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
    if (!groups[date]) {
      groups[date] = [];
    }
    groups[date].push(transaction);
    return groups;
  }, {} as Record<string, Transaction[]>);

  return (
    <div className="space-y-6">
      {/* Filters Header Container */}
      <div className="flex flex-col sm:flex-row gap-4 items-center justify-between pb-6 border-b border-slate-800/60">
        <div className="relative w-full sm:max-w-xs">
          <input
            type="text"
            placeholder="Cari transaksi..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-4 pr-10 py-2.5 bg-slate-950 border border-slate-850 rounded-xl focus:outline-none focus:border-teal-500 text-white text-xs placeholder-slate-600 transition-colors"
          />
          <span className="absolute right-3.5 top-3 text-slate-600">
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
          </span>
        </div>

        <div className="bg-slate-950 p-1 rounded-xl flex gap-1 border border-slate-850 w-full sm:w-auto">
          <button
            onClick={() => setFilter('all')}
            className={`flex-1 sm:flex-initial px-4 py-2 rounded-lg text-xs font-bold transition-all ${
              filter === 'all'
                ? 'bg-gradient-to-r from-teal-500 to-cyan-500 text-white shadow-lg shadow-teal-500/10'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            Semua
          </button>
          <button
            onClick={() => setFilter('income')}
            className={`flex-1 sm:flex-initial px-4 py-2 rounded-lg text-xs font-bold transition-all ${
              filter === 'income'
                ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            Pemasukan
          </button>
          <button
            onClick={() => setFilter('expense')}
            className={`flex-1 sm:flex-initial px-4 py-2 rounded-lg text-xs font-bold transition-all ${
              filter === 'expense'
                ? 'bg-rose-500/10 text-rose-400 border border-rose-500/20'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            Pengeluaran
          </button>
        </div>
      </div>

      {/* Transaction List */}
      {Object.keys(groupedTransactions).length > 0 ? (
        <div className="space-y-6">
          {Object.entries(groupedTransactions).map(([date, dateTransactions]) => (
            <div key={date} className="bg-slate-950/20 border border-slate-900 rounded-2xl p-4 md:p-6">
              <h3 className="text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-4">{date}</h3>
              <div className="divide-y divide-slate-850 space-y-4">
                {dateTransactions.map((transaction) => {
                  const categoryName = transaction.category?.name || 'Lainnya';
                  return (
                    <div
                      key={transaction.id}
                      className="flex items-center justify-between pt-4 first:pt-0 group/item"
                    >
                      <div className="flex items-center gap-3.5 flex-1 min-w-0">
                        <div className={`w-10 h-10 rounded-xl flex items-center justify-center text-lg shrink-0 border ${
                          transaction.type === 'income' 
                            ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20' 
                            : 'bg-rose-500/10 text-rose-400 border-rose-500/20'
                        }`}>
                          {getCategoryIcon(categoryName, transaction.type)}
                        </div>
                        <div className="min-w-0">
                          <p className="text-xs sm:text-sm font-bold text-slate-100 truncate">
                            {transaction.description || categoryName}
                          </p>
                          <p className="text-[10px] font-semibold text-slate-500 mt-0.5">
                            Kategori: {categoryName}
                          </p>
                        </div>
                      </div>
                      
                      <div className="flex items-center gap-4 ml-4">
                        <span className={`text-xs sm:text-sm font-extrabold ${
                          transaction.type === 'income' ? 'text-emerald-400' : 'text-rose-400'
                        }`}>
                          {transaction.type === 'income' ? '+' : '-'}{formatCurrency(transaction.amount)}
                        </span>
                        
                        {/* Edit/Delete Actions */}
                        <div className="flex items-center gap-1 opacity-0 group-hover/item:opacity-100 transition-opacity">
                          <button
                            onClick={() => onEdit(transaction)}
                            className="p-1.5 bg-slate-900 hover:bg-teal-500/10 text-slate-400 hover:text-teal-400 rounded-lg transition-colors border border-slate-800"
                            title="Ubah"
                          >
                            <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                            </svg>
                          </button>
                          <button
                            onClick={() => onDelete(transaction.id)}
                            className="p-1.5 bg-slate-900 hover:bg-rose-500/10 text-slate-400 hover:text-rose-400 rounded-lg transition-colors border border-slate-800"
                            title="Hapus"
                          >
                            <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                            </svg>
                          </button>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="py-12 flex flex-col items-center justify-center text-center">
          <div className="text-4xl mb-4 p-4 bg-slate-950/80 rounded-2xl border border-slate-800">💸</div>
          <h3 className="text-lg font-bold text-white mb-1">
            Belum Ada Transaksi
          </h3>
          <p className="text-slate-400 text-sm max-w-xs">
            Mulai mencatat arus kas pengeluaran atau pemasukan untuk melacak kondisi finansial Anda.
          </p>
        </div>
      )}
    </div>
  );
}
