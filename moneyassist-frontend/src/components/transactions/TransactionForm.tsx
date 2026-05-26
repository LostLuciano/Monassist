import React, { useState } from 'react';
import { Transaction, Category } from '../../types';

interface TransactionFormProps {
  transaction?: Transaction;
  categories: Category[];
  onSubmit: (data: Partial<Transaction>) => void;
  onCancel: () => void;
}

export default function TransactionForm({ transaction, categories, onSubmit, onCancel }: TransactionFormProps) {
  const [formData, setFormData] = useState({
    type: transaction?.type || 'expense' as 'income' | 'expense',
    category_id: transaction?.category_id || '',
    amount: transaction?.amount || '',
    description: transaction?.description || '',
    transaction_date: transaction?.transaction_date ? transaction.transaction_date.split('T')[0] : new Date().toISOString().split('T')[0],
  });

  const [errors, setErrors] = useState<Record<string, string>>({});

  const filteredCategories = categories.filter(cat => cat.type === formData.type);

  const validate = () => {
    const newErrors: Record<string, string> = {};

    if (!formData.category_id) {
      newErrors.category_id = 'Kategori wajib dipilih';
    }
    if (!formData.amount || Number(formData.amount) <= 0) {
      newErrors.amount = 'Jumlah harus lebih besar dari 0';
    }
    if (!formData.transaction_date) {
      newErrors.transaction_date = 'Tanggal wajib diisi';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (validate()) {
      onSubmit({
        ...formData,
        category_id: Number(formData.category_id),
        amount: Number(formData.amount),
      });
    }
  };

  const handleTypeChange = (type: 'income' | 'expense') => {
    setFormData({
      ...formData,
      type,
      category_id: '', // Reset category when type changes
    });
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-5">
      {/* Type Selection Toggles */}
      <div>
        <label className="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">
          Tipe Transaksi
        </label>
        <div className="bg-slate-950 p-1 rounded-xl flex gap-1 border border-slate-850">
          <button
            type="button"
            onClick={() => handleTypeChange('expense')}
            className={`flex-1 py-2.5 rounded-lg text-xs font-bold transition-all ${
              formData.type === 'expense'
                ? 'bg-rose-500/10 text-rose-400 border border-rose-500/20'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            Pengeluaran
          </button>
          <button
            type="button"
            onClick={() => handleTypeChange('income')}
            className={`flex-1 py-2.5 rounded-lg text-xs font-bold transition-all ${
              formData.type === 'income'
                ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            Pemasukan
          </button>
        </div>
      </div>

      {/* Category */}
      <div>
        <label className="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">
          Kategori *
        </label>
        <select
          value={formData.category_id}
          onChange={(e) => setFormData({ ...formData, category_id: e.target.value })}
          className="w-full px-4 py-3 bg-slate-950 border border-slate-850 rounded-xl focus:outline-none focus:border-teal-500 text-white text-sm"
        >
          <option value="" className="text-slate-600">Pilih Kategori</option>
          {filteredCategories.map((category) => (
            <option key={category.id} value={category.id}>
              {category.icon ? `${category.icon} ` : ''}{category.name}
            </option>
          ))}
        </select>
        {errors.category_id && (
          <p className="text-rose-500 text-xs mt-1.5 font-semibold">{errors.category_id}</p>
        )}
      </div>

      {/* Amount */}
      <div>
        <label className="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">
          Jumlah Uang *
        </label>
        <div className="relative">
          <span className="absolute left-4 top-3 text-slate-500 font-extrabold text-sm">Rp</span>
          <input
            type="number"
            value={formData.amount}
            onChange={(e) => setFormData({ ...formData, amount: e.target.value })}
            className="w-full pl-12 pr-4 py-3 bg-slate-950 border border-slate-850 rounded-xl focus:outline-none focus:border-teal-500 text-white placeholder-slate-600 text-sm transition-all"
            placeholder="0"
            min="0"
          />
        </div>
        {errors.amount && (
          <p className="text-rose-500 text-xs mt-1.5 font-semibold">{errors.amount}</p>
        )}
      </div>

      {/* Description */}
      <div>
        <label className="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">
          Keterangan (Opsional)
        </label>
        <textarea
          value={formData.description}
          onChange={(e) => setFormData({ ...formData, description: e.target.value })}
          className="w-full px-4 py-3 bg-slate-950 border border-slate-850 rounded-xl focus:outline-none focus:border-teal-500 text-white placeholder-slate-600 text-sm resize-none"
          rows={3}
          placeholder="Tulis deskripsi singkat..."
        />
      </div>

      {/* Date */}
      <div>
        <label className="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">
          Tanggal *
        </label>
        <input
          type="date"
          value={formData.transaction_date}
          onChange={(e) => setFormData({ ...formData, transaction_date: e.target.value })}
          className="w-full px-4 py-3 bg-slate-950 border border-slate-850 rounded-xl focus:outline-none focus:border-teal-500 text-white text-sm"
          max={new Date().toISOString().split('T')[0]}
        />
        {errors.transaction_date && (
          <p className="text-rose-500 text-xs mt-1.5 font-semibold">{errors.transaction_date}</p>
        )}
      </div>

      {/* Buttons */}
      <div className="flex gap-3 pt-4 border-t border-slate-850">
        <button
          type="button"
          onClick={onCancel}
          className="flex-1 py-3 bg-slate-850 hover:bg-slate-800 text-white rounded-xl font-semibold transition-colors text-sm"
        >
          Batal
        </button>
        <button
          type="submit"
          className="flex-1 py-3 bg-gradient-to-r from-teal-500 to-cyan-500 text-white rounded-xl font-bold transition-all text-sm shadow-lg shadow-teal-500/10"
        >
          {transaction ? 'Simpan' : 'Tambah'}
        </button>
      </div>
    </form>
  );
}
