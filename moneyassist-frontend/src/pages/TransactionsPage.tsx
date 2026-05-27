import { useState, useRef } from 'react';
import AuthenticatedLayout from '../components/common/AuthenticatedLayout';
import { useTransactions } from '../hooks/useTransactions';
import { Transaction, Category } from '../types';
import { formatCurrency } from '../utils/formatters';
import chatService from '../services/chatService';

const defaultCategories: Category[] = [
  { id: 1, name: 'Konsumsi', type: 'expense', icon: '🍔' },
  { id: 2, name: 'Transportasi', type: 'expense', icon: '🚗' },
  { id: 3, name: 'Belanja', type: 'expense', icon: '🛒' },
  { id: 4, name: 'Utilitas', type: 'expense', icon: '🔌' },
  { id: 5, name: 'Gaji', type: 'income', icon: '💰' },
  { id: 6, name: 'Investasi', type: 'income', icon: '📈' },
  { id: 7, name: 'Hiburan', type: 'expense', icon: '🎮' },
  { id: 8, name: 'Lainnya', type: 'expense', icon: '📝' }
];

export default function TransactionsPage() {
  const { transactions, createTransaction, editTransaction, removeTransaction } = useTransactions();
  const [editingTransaction, setEditingTransaction] = useState<Transaction | null>(null);

  // Form State
  const [formData, setFormData] = useState({
    type: 'expense' as 'income' | 'expense',
    category_id: '1', // Defaults to 'Konsumsi'
    amount: '',
    description: '',
    transaction_date: new Date().toISOString().split('T')[0]
  });

  // Filter States
  const [filterType, setFilterType] = useState<'all' | 'income' | 'expense'>('all');
  const [filterCategory, setFilterCategory] = useState<string>('all');
  const [searchTerm, setSearchTerm] = useState('');

  // UI States
  const [isScanning, setIsScanning] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Handle Form Input Changes
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleTypeChange = (type: 'income' | 'expense') => {
    const defaultCat = defaultCategories.find(c => c.type === type);
    setFormData(prev => ({
      ...prev,
      type,
      category_id: defaultCat ? defaultCat.id.toString() : ''
    }));
  };

  // Trigger file upload for Receipt Scanning
  const handleTriggerUpload = () => {
    fileInputRef.current?.click();
  };

  // Process Receipt Image with AI API
  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setIsScanning(true);

    try {
      // Call AI receipt scanning service
      const result = await chatService.processReceipt(file);
      
      // Auto-fill form fields with OCR/AI result
      const aiData = result.data || result;
      setFormData({
        type: aiData.type || 'expense',
        category_id: aiData.category_id ? aiData.category_id.toString() : '1',
        amount: aiData.amount ? aiData.amount.toString() : '',
        description: aiData.description || 'Scan Struk Otomatis',
        transaction_date: aiData.transaction_date ? aiData.transaction_date.split('T')[0] : new Date().toISOString().split('T')[0]
      });
    } catch (error) {
      console.error('Receipt scan failed:', error);
      alert('Gagal memindai struk belanja dengan AI. Pastikan API Key di backend Anda sudah terkonfigurasi dengan benar.');
    } finally {
      setIsScanning(false);
    }
  };

  // Submit transaction form
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.amount || parseFloat(formData.amount) <= 0) {
      alert('Nominal harus lebih besar dari 0');
      return;
    }

    const payload = {
      type: formData.type,
      category_id: parseInt(formData.category_id),
      amount: parseFloat(formData.amount),
      description: formData.description || defaultCategories.find(c => c.id.toString() === formData.category_id)?.name || 'Transaksi',
      transaction_date: formData.transaction_date
    };

    try {
      if (editingTransaction) {
        await editTransaction(editingTransaction.id, payload);
        setEditingTransaction(null);
      } else {
        await createTransaction(payload as any);
      }
      
      // Reset form
      setFormData({
        type: 'expense',
        category_id: '1',
        amount: '',
        description: '',
        transaction_date: new Date().toISOString().split('T')[0]
      });
    } catch (error) {
      console.error('Failed to save transaction:', error);
    }
  };

  // Edit action
  const handleEditClick = (t: Transaction) => {
    setEditingTransaction(t);
    setFormData({
      type: t.type,
      category_id: t.category_id.toString(),
      amount: t.amount.toString(),
      description: t.description || '',
      transaction_date: t.transaction_date ? t.transaction_date.split('T')[0] : new Date().toISOString().split('T')[0]
    });
  };

  // Delete action
  const handleDeleteClick = async (id: number) => {
    if (window.confirm('Apakah Anda yakin ingin menghapus transaksi ini?')) {
      try {
        await removeTransaction(id);
        if (editingTransaction?.id === id) {
          setEditingTransaction(null);
        }
      } catch (error) {
        console.error('Failed to delete transaction:', error);
      }
    }
  };

  const cancelEdit = () => {
    setEditingTransaction(null);
    setFormData({
      type: 'expense',
      category_id: '1',
      amount: '',
      description: '',
      transaction_date: new Date().toISOString().split('T')[0]
    });
  };

  // Filtering transactions
  const filteredTransactions = transactions.filter(t => {
    const matchesType = filterType === 'all' || t.type === filterType;
    const matchesCategory = filterCategory === 'all' || t.category_id.toString() === filterCategory;
    const matchesSearch = 
      t.description?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      t.category?.name.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesType && matchesCategory && matchesSearch;
  });

  // Calculate totals
  const totalIncomeCount = transactions.filter(t => t.type === 'income').length;
  const totalExpenseCount = transactions.filter(t => t.type === 'expense').length;

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

  const activeCategories = defaultCategories.filter(c => c.type === formData.type);

  return (
    <AuthenticatedLayout pageTitle="Catat Transaksi">
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        
        {/* Left Column: Transaction Input Form */}
        <div className="lg:col-span-5 bg-slate-900/40 border border-slate-800/80 backdrop-blur-xl rounded-3xl p-6 space-y-6">
          <div>
            <h2 className="text-base font-bold text-white flex items-center gap-2">
              {editingTransaction ? (
                <>
                  <span className="w-1.5 h-4 bg-amber-500 rounded-full animate-pulse"></span>
                  Ubah Transaksi
                </>
              ) : (
                <>
                  <span className="w-1.5 h-4 bg-teal-500 rounded-full"></span>
                  Catat Transaksi Baru
                </>
              )}
            </h2>
            <p className="text-[10px] font-semibold text-slate-500 mt-1">Manual atau Scan Struk AI</p>
          </div>

          {/* AI Scan Receipt Card */}
          <div className="bg-slate-950/60 border border-dashed border-slate-800 rounded-2xl p-5 text-center flex flex-col items-center justify-center relative overflow-hidden group hover:border-teal-500/30 transition-all">
            <input
              type="file"
              ref={fileInputRef}
              onChange={handleFileChange}
              accept="image/*"
              className="hidden"
            />
            
            {isScanning ? (
              <div className="py-6 flex flex-col items-center justify-center gap-3">
                <div className="w-10 h-10 border-4 border-teal-500/25 border-t-teal-400 rounded-full animate-spin"></div>
                <p className="text-[11px] font-bold text-teal-400 animate-pulse">AI sedang menganalisis struk belanja Anda...</p>
              </div>
            ) : (
              <>
                <div className="w-9 h-9 bg-slate-900 border border-slate-800 rounded-xl flex items-center justify-center text-slate-400 mb-3 group-hover:text-teal-400 transition-colors">
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                  </svg>
                </div>
                <h3 className="text-xs font-bold text-white mb-1">Scan Foto Struk Cerdas AI</h3>
                <p className="text-[10px] text-slate-500 leading-normal max-w-xs mb-4">
                  Asisten akan membaca nominal, kategori & tanggal belanja Kakak secara instan.
                </p>
                <button
                  type="button"
                  onClick={handleTriggerUpload}
                  className="px-4 py-2 bg-indigo-600 hover:bg-indigo-500 text-white rounded-xl font-bold text-[10px] transition-all flex items-center gap-1.5 shadow-md shadow-indigo-600/10 active:scale-95"
                >
                  <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12" />
                  </svg>
                  Masukan Gambar Struk
                </button>
              </>
            )}
          </div>

          {/* Form Fields */}
          <form onSubmit={handleSubmit} className="space-y-4">
            
            {/* Transaction Type */}
            <div>
              <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-2">
                Tipe Transaksi
              </label>
              <div className="bg-slate-950 p-1 rounded-xl flex gap-1 border border-slate-850">
                <button
                  type="button"
                  onClick={() => handleTypeChange('expense')}
                  className={`flex-1 py-2 rounded-lg text-xs font-bold transition-all flex items-center justify-center gap-1.5 ${
                    formData.type === 'expense'
                      ? 'bg-rose-500/10 text-rose-455 border border-rose-500/20'
                      : 'text-slate-500 hover:text-slate-350'
                  }`}
                >
                  <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 13l-5 5m0 0l-5-5m5 5V6" />
                  </svg>
                  Pengeluaran
                </button>
                <button
                  type="button"
                  onClick={() => handleTypeChange('income')}
                  className={`flex-1 py-2 rounded-lg text-xs font-bold transition-all flex items-center justify-center gap-1.5 ${
                    formData.type === 'income'
                      ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20'
                      : 'text-slate-500 hover:text-slate-350'
                  }`}
                >
                  <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 11l5-5m0 0l5 5m-5-5v12" />
                  </svg>
                  Pemasukan
                </button>
              </div>
            </div>

            {/* Amount (Rupiah) */}
            <div>
              <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-2">
                Nominal (Rupiah)
              </label>
              <div className="relative">
                <span className="absolute left-4 top-2.5 text-slate-500 font-extrabold text-sm">Rp</span>
                <input
                  type="number"
                  name="amount"
                  value={formData.amount}
                  onChange={handleInputChange}
                  className="w-full pl-12 pr-4 py-2.5 bg-slate-950 border border-slate-850 rounded-xl focus:outline-none focus:border-teal-500 text-white placeholder-slate-650 text-sm font-semibold transition-all"
                  placeholder="50000"
                  required
                  min="0"
                />
              </div>
            </div>

            {/* Category selection */}
            <div>
              <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-2">
                Kategori
              </label>
              <select
                name="category_id"
                value={formData.category_id}
                onChange={handleInputChange}
                className="w-full px-4 py-2.5 bg-slate-950 border border-slate-850 rounded-xl focus:outline-none focus:border-teal-500 text-white text-xs font-semibold"
              >
                {activeCategories.map(category => (
                  <option key={category.id} value={category.id}>
                    {category.icon ? `${category.icon} ` : ''}{category.name}
                  </option>
                ))}
              </select>
            </div>

            {/* Description (Optional) */}
            <div>
              <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-2">
                Keterangan (Opsional)
              </label>
              <textarea
                name="description"
                value={formData.description}
                onChange={handleInputChange}
                className="w-full px-4 py-2.5 bg-slate-950 border border-slate-850 rounded-xl focus:outline-none focus:border-teal-500 text-white placeholder-slate-650 text-xs resize-none"
                rows={2}
                placeholder="Catatan kecil belanja..."
              />
            </div>

            {/* Date selection */}
            <div>
              <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-2">
                Tanggal
              </label>
              <input
                type="date"
                name="transaction_date"
                value={formData.transaction_date}
                onChange={handleInputChange}
                className="w-full px-4 py-2.5 bg-slate-950 border border-slate-850 rounded-xl focus:outline-none focus:border-teal-500 text-white text-xs font-semibold"
              />
            </div>

            {/* Actions Button */}
            <div className="flex gap-2.5 pt-4 border-t border-slate-850/50">
              {editingTransaction && (
                <button
                  type="button"
                  onClick={cancelEdit}
                  className="flex-1 py-3 bg-slate-800 hover:bg-slate-700/80 text-white rounded-xl font-bold transition-all text-xs"
                >
                  Batal
                </button>
              )}
              <button
                type="submit"
                className="flex-1 py-3 bg-gradient-to-r from-teal-500 to-cyan-500 text-white rounded-xl font-bold transition-all text-xs shadow-lg shadow-teal-500/10 text-center"
              >
                {editingTransaction ? 'Simpan Transaksi' : 'Simpan Transaksi'}
              </button>
            </div>

          </form>
        </div>

        {/* Right Column: Daily Transaction History List */}
        <div className="lg:col-span-7 bg-slate-900/40 border border-slate-800/80 backdrop-blur-xl rounded-3xl p-6 space-y-6">
          
          {/* Header Filters & Search */}
          <div className="flex flex-col sm:flex-row gap-4 items-center justify-between pb-6 border-b border-slate-850/60">
            <h2 className="text-base font-bold text-white self-start sm:self-center">Riwayat Transaksi Harian</h2>
            
            {/* Search input */}
            <div className="relative w-full sm:max-w-xs">
              <input
                type="text"
                placeholder="Cari transaksi..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-4 pr-10 py-2 bg-slate-950 border border-slate-850 rounded-xl focus:outline-none focus:border-teal-500 text-white text-xs placeholder-slate-600 transition-colors"
              />
              <span className="absolute right-3 top-2.5 text-slate-650">
                <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
              </span>
            </div>
          </div>

          {/* Quick Filter Chips */}
          <div className="flex flex-wrap items-center gap-2">
            <button
              onClick={() => setFilterType('all')}
              className={`px-4 py-2 rounded-xl text-xs font-bold transition-all ${
                filterType === 'all'
                  ? 'bg-slate-950 text-white border border-slate-800'
                  : 'text-slate-400 hover:text-slate-200 border border-transparent'
              }`}
            >
              Semua ({transactions.length})
            </button>
            <button
              onClick={() => setFilterType('income')}
              className={`px-4 py-2 rounded-xl text-xs font-bold transition-all border ${
                filterType === 'income'
                  ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/30'
                  : 'text-slate-450 hover:text-slate-300 border-transparent'
              }`}
            >
              Pemasukan ({totalIncomeCount})
            </button>
            <button
              onClick={() => setFilterType('expense')}
              className={`px-4 py-2 rounded-xl text-xs font-bold transition-all border ${
                filterType === 'expense'
                  ? 'bg-rose-500/10 text-rose-455 border-rose-500/30'
                  : 'text-slate-450 hover:text-slate-300 border-transparent'
              }`}
            >
              Pengeluaran ({totalExpenseCount})
            </button>

            {/* Category Dropdown filter */}
            <select
              value={filterCategory}
              onChange={(e) => setFilterCategory(e.target.value)}
              className="px-3 py-2 bg-slate-950 border border-slate-850 rounded-xl text-xs font-bold text-slate-350 focus:outline-none focus:border-teal-500 ml-auto"
            >
              <option value="all">Semua Kategori</option>
              {defaultCategories.map(cat => (
                <option key={cat.id} value={cat.id}>{cat.icon} {cat.name}</option>
              ))}
            </select>
          </div>

          {/* Transactions List Area */}
          {Object.keys(groupedTransactions).length > 0 ? (
            <div className="space-y-6">
              {Object.entries(groupedTransactions).map(([date, dateTransactions]) => (
                <div key={date} className="bg-slate-950/20 border border-slate-900/60 rounded-2xl p-4 md:p-5">
                  <h3 className="text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-4">{date}</h3>
                  <div className="divide-y divide-slate-850 space-y-3.5">
                    {dateTransactions.map((transaction) => {
                      const categoryObj = defaultCategories.find(c => c.id === transaction.category_id);
                      const catName = categoryObj?.name || 'Lainnya';
                      const catIcon = categoryObj?.icon || '📝';
                      
                      return (
                        <div
                          key={transaction.id}
                          className="flex items-center justify-between pt-3.5 first:pt-0 group/item"
                        >
                          <div className="flex items-center gap-3 flex-1 min-w-0">
                            <div className={`w-9 h-9 rounded-xl flex items-center justify-center text-base shrink-0 border ${
                              transaction.type === 'income' 
                                ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20' 
                                : 'bg-rose-500/10 text-rose-455 border-rose-500/20'
                            }`}>
                              {catIcon}
                            </div>
                            <div className="min-w-0">
                              <p className="text-xs sm:text-sm font-bold text-slate-150 truncate">
                                {transaction.description || catName}
                              </p>
                              <p className="text-[9px] font-semibold text-slate-500 mt-0.5">
                                Kategori: {catName}
                              </p>
                            </div>
                          </div>
                          
                          <div className="flex items-center gap-3.5 ml-4">
                            <span className={`text-xs sm:text-sm font-extrabold ${
                              transaction.type === 'income' ? 'text-emerald-450' : 'text-rose-455'
                            }`}>
                              {transaction.type === 'income' ? '+' : '-'}{formatCurrency(transaction.amount)}
                            </span>
                            
                            {/* Action Buttons */}
                            <div className="flex items-center gap-1 opacity-0 group-hover/item:opacity-100 transition-opacity">
                              <button
                                onClick={() => handleEditClick(transaction)}
                                className="p-1.5 bg-slate-900 hover:bg-teal-500/10 text-slate-400 hover:text-teal-400 rounded-lg transition-colors border border-slate-800"
                                title="Ubah"
                              >
                                <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                                </svg>
                              </button>
                              <button
                                onClick={() => handleDeleteClick(transaction.id)}
                                className="p-1.5 bg-slate-900 hover:bg-rose-500/10 text-slate-400 hover:text-rose-400 rounded-lg transition-colors border border-slate-800"
                                title="Hapus"
                              >
                                <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
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
            // Match empty screen from screenshot
            <div className="py-20 flex flex-col items-center justify-center text-center">
              <div className="w-16 h-16 bg-slate-900/40 border border-slate-850 rounded-full flex items-center justify-center text-slate-700 mb-4">
                {/* Bank / Temple outline icon */}
                <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                </svg>
              </div>
              <p className="text-xs font-semibold text-slate-400 leading-relaxed max-w-sm">
                Belum ada data transaksi tercatat.<br />
                Silakan input di form manual atau scan struk belanja.
              </p>
            </div>
          )}
        </div>

      </div>
    </AuthenticatedLayout>
  );
}
