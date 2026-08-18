import { useEffect, useState, useMemo } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { RootState, AppDispatch } from '../store/store';
import { formatCurrency } from '../utils/formatters';
import AuthenticatedLayout from '../components/common/AuthenticatedLayout';
import LoadingSpinner from '../components/common/LoadingSpinner';
import { fetchRecommendations } from '../store/uiSlice';
import { ResponsiveContainer, AreaChart, Area, XAxis, YAxis, Tooltip } from 'recharts';
import api from '../services/api';
import { getCategoryIcon } from '../utils/categoryIcons';

interface DashboardSummary {
  total_income: number;
  total_expense: number;
  balance: number;
  financial_status: 'controlled' | 'elevated' | 'critical';
  health_score: number;
  expense_by_category: Array<{
    category: string;
    amount: number;
    percentage: number;
  }>;
}

export default function DashboardPage() {
  const { user } = useSelector((state: RootState) => state.auth);
  const { recommendations } = useSelector((state: RootState) => state.ui);
  const dispatch = useDispatch<AppDispatch>();
  const navigate = useNavigate();

  const [summary, setSummary] = useState<DashboardSummary | null>(null);
  const [loading, setLoading] = useState(true);
  const [showBalance, setShowBalance] = useState(true);
  const [timeframe, setTimeframe] = useState<'daily' | 'weekly' | 'monthly' | 'yearly'>('daily');
  const [transactions, setTransactions] = useState<any[]>([]);
  const [showChartDetail, setShowChartDetail] = useState(false);

  // Dynamic Greeting based on real local time
  const greeting = useMemo(() => {
    const hour = new Date().getHours();
    if (hour >= 4 && hour < 11) return 'Selamat pagi';
    if (hour >= 11 && hour < 15) return 'Selamat siang';
    if (hour >= 15 && hour < 18) return 'Selamat sore';
    return 'Selamat malam';
  }, []);

  const fetchSummary = async () => {
    try {
      const res = await api.get('/users/summary');
      if (res.data?.success) {
        setSummary(res.data.data);
      }
    } catch (err) {
      console.error('Failed to load summary:', err);
    }
  };

  const fetchTransactions = async () => {
    try {
      const res = await api.get('/transactions?limit=20');
      if (res.data?.success) {
        setTransactions(res.data.data || []);
      }
    } catch (err) {
      console.error('Failed to load transactions:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSummary();
    fetchTransactions();
    dispatch(fetchRecommendations());
  }, [dispatch]);

  // Compute 50/30/20 Budget Stats
  const budgetRatio = useMemo(() => {
    let needs = 0;
    let wants = 0;
    let savings = 0;

    const needsCategories = ['makanan', 'konsumsi', 'groceries', 'tagihan', 'utilitas', 'transportasi', 'kesehatan', 'sewa', 'pendidikan', 'keperluan rumah', 'house', 'bills', 'transport', 'health', 'education', 'food'];
    const wantsCategories = ['hiburan', 'belanja', 'jalan-jalan', 'hobi', 'liburan', 'shopping', 'entertainment', 'travel', 'hobby', 'lifestyle', 'dining out', 'restoran'];

    if (summary && summary.expense_by_category) {
      summary.expense_by_category.forEach(item => {
        const catName = item.category.toLowerCase().trim();
        if (needsCategories.some(n => catName.includes(n))) {
          needs += item.amount;
        } else if (wantsCategories.some(w => catName.includes(w))) {
          wants += item.amount;
        } else {
          if (catName.includes('invest') || catName.includes('tabung') || catName.includes('darurat') || catName.includes('saving')) {
            savings += item.amount;
          } else {
            needs += item.amount;
          }
        }
      });
    }

    const totalExp = summary?.total_expense || 0;
    const totalInc = summary?.total_income || 0;
    const surplus = Math.max(0, totalInc - totalExp);
    savings += surplus;

    const total = needs + wants + savings;
    return {
      needs,
      wants,
      savings,
      needsPct: total > 0 ? Math.round((needs / total) * 100) : 0,
      wantsPct: total > 0 ? Math.round((wants / total) * 100) : 0,
      savingsPct: total > 0 ? Math.round((savings / total) * 100) : 0,
      total
    };
  }, [summary]);

  // Financial Health Score Status
  const healthStatus = useMemo(() => {
    const score = summary?.health_score || 80;
    if (score >= 80) {
      return {
        label: 'AMAN',
        color: 'text-emerald-400',
        bg: 'bg-emerald-500/10',
        border: 'border-emerald-500/30',
        ringColor: '#10b981',
        message: 'Kamu berada di jalur keuangan yang sangat baik.'
      };
    }
    if (score >= 50) {
      return {
        label: 'WASPADA',
        color: 'text-amber-400',
        bg: 'bg-amber-500/10',
        border: 'border-amber-500/30',
        ringColor: '#f59e0b',
        message: 'Pengeluaran mendekati ambang batas pemasukan bulanan.'
      };
    }
    return {
      label: 'KRITIS',
      color: 'text-rose-400',
      bg: 'bg-rose-500/10',
      border: 'border-rose-500/30',
      ringColor: '#f43f5e',
      message: 'Pengeluaran melampaui total pemasukan bulanan.'
    };
  }, [summary]);

  // Key AI Insight computation
  const topAIInsight = useMemo(() => {
    if (recommendations && recommendations.length > 0) {
      return recommendations[0].description;
    }

    if (summary && summary.expense_by_category && summary.expense_by_category.length > 0) {
      const top = summary.expense_by_category[0];
      return `Pengeluaran kategori ${top.category} mendominasi ${top.percentage}% dari total pengeluaran Anda bulan ini.`;
    }

    return 'Belum ada data pengeluaran yang cukup. Catat transaksi harian Anda agar AI dapat memberikan rekomendasi finansial akurat.';
  }, [recommendations, summary]);

  // Expense percentage calculation
  const expensePercentage = useMemo(() => {
    const inc = summary?.total_income || 0;
    const exp = summary?.total_expense || 0;
    if (inc === 0) return exp > 0 ? '100' : '0';
    return ((exp / inc) * 100).toFixed(1);
  }, [summary]);

  // Dynamic trend data for chart
  const trendData = useMemo(() => {
    if (!transactions || transactions.length === 0) {
      const defaultData = [];
      for (let i = 6; i >= 0; i--) {
        const d = new Date();
        d.setDate(d.getDate() - i);
        const label = d.toLocaleDateString('id-ID', { month: '2-digit', day: '2-digit' });
        defaultData.push({ name: label, pengeluaran: 0, pemasukan: 0 });
      }
      return defaultData;
    }

    const data = [];
    if (timeframe === 'daily') {
      for (let i = 6; i >= 0; i--) {
        const d = new Date();
        d.setDate(d.getDate() - i);
        const dateStr = d.toISOString().split('T')[0];
        let dailyExpense = 0;
        let dailyIncome = 0;
        transactions.forEach(t => {
          const tDate = t.transaction_date ? t.transaction_date.split('T')[0] : (t.date ? t.date.split('T')[0] : '');
          if (tDate === dateStr) {
            if (t.type === 'expense') dailyExpense += parseFloat(t.amount);
            else if (t.type === 'income') dailyIncome += parseFloat(t.amount);
          }
        });
        const label = d.toLocaleDateString('id-ID', { month: '2-digit', day: '2-digit' });
        data.push({ name: label, pengeluaran: dailyExpense, pemasukan: dailyIncome });
      }
    } else if (timeframe === 'monthly') {
      const monthNames = ['Jan', 'Feb', 'Mar', 'Apr', 'Mei', 'Jun', 'Jul', 'Agu', 'Sep', 'Okt', 'Nov', 'Des'];
      for (let i = 5; i >= 0; i--) {
        const d = new Date();
        d.setMonth(d.getMonth() - i);
        data.push({ name: monthNames[d.getMonth()], pengeluaran: 0, pemasukan: 0 });
      }
    } else {
      for (let i = 3; i >= 0; i--) {
        data.push({ name: `M-${4 - i}`, pengeluaran: 0, pemasukan: 0 });
      }
    }
    return data;
  }, [transactions, timeframe]);

  if (loading) {
    return (
      <AuthenticatedLayout pageTitle="Dashboard">
        <div className="flex items-center justify-center min-h-[60vh]">
          <LoadingSpinner />
        </div>
      </AuthenticatedLayout>
    );
  }

  return (
    <AuthenticatedLayout pageTitle="Dashboard">
      <div className="max-w-4xl mx-auto space-y-6 pb-12">
        
        {/* ========================================================= */}
        {/* 1. CLEAN HEADER (Greeting, User Name, Subtitle) */}
        {/* ========================================================= */}
        <div className="flex items-start justify-between">
          <div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
              {greeting}, <span className="text-slate-100">{user?.name || 'User'}</span>
            </h1>
            <p className="text-xs sm:text-sm text-slate-400 font-medium mt-1">
              Kelola keuanganmu dengan lebih cerdas.
            </p>
          </div>
          
          <button
            onClick={() => navigate('/profile')}
            className="w-10 h-10 rounded-2xl bg-slate-900/80 border border-slate-800 text-slate-400 hover:text-white flex items-center justify-center transition-colors"
            title="Notifikasi & Pengaturan"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
            </svg>
          </button>
        </div>

        {/* ========================================================= */}
        {/* 2. RINGKASAN DALAM SATU CARD (Unified Balance Card) */}
        {/* ========================================================= */}
        <div className="bg-slate-900/70 border border-slate-800/90 backdrop-blur-2xl rounded-3xl p-6 sm:p-8 shadow-xl space-y-6">
          
          {/* Top Row: Card Title & Visibility Toggle */}
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">
              Ringkasan Keuangan
            </span>
            <button
              onClick={() => setShowBalance(!showBalance)}
              className="p-1.5 rounded-lg text-slate-400 hover:text-slate-200 hover:bg-slate-800 transition-colors"
              title={showBalance ? 'Sembunyikan Saldo' : 'Tampilkan Saldo'}
            >
              {showBalance ? (
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                </svg>
              ) : (
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l18 18" />
                </svg>
              )}
            </button>
          </div>

          {/* Middle: Main Balance Focal Point */}
          <div>
            <span className="text-xs text-slate-400 font-medium">Total Saldo</span>
            <div className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight mt-1">
              {showBalance ? formatCurrency(summary?.balance || 0) : '••••••••••••'}
            </div>
          </div>

          {/* Bottom Row: Income & Expense Split */}
          <div className="pt-5 border-t border-slate-800/80 grid grid-cols-2 gap-4">
            
            {/* Pengeluaran */}
            <div>
              <span className="text-xs text-slate-400 font-medium block">Pengeluaran</span>
              <div className="text-base sm:text-lg font-bold text-rose-400 flex items-center gap-1 mt-0.5">
                <span>{showBalance ? formatCurrency(summary?.total_expense || 0) : '••••••'}</span>
                <svg className="w-4 h-4 text-rose-400 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M19 14l-7 7m0 0l-7-7m7 7V3" />
                </svg>
              </div>
              <span className="text-[11px] text-slate-500 font-medium mt-0.5 block">
                {expensePercentage}% dari pemasukan
              </span>
            </div>

            {/* Pemasukan */}
            <div>
              <span className="text-xs text-slate-400 font-medium block">Pemasukan</span>
              <div className="text-base sm:text-lg font-bold text-emerald-400 flex items-center gap-1 mt-0.5">
                <span>{showBalance ? formatCurrency(summary?.total_income || 0) : '••••••'}</span>
                <svg className="w-4 h-4 text-emerald-400 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 10l7-7m0 0l7 7m-7-7v18" />
                </svg>
              </div>
              <span className="text-[11px] text-slate-500 font-medium mt-0.5 block">
                Bulan ini
              </span>
            </div>

          </div>

        </div>

        {/* ========================================================= */}
        {/* 3. AKSI CEPAT (Quick Action Cards) */}
        {/* ========================================================= */}
        <div className="space-y-3">
          <h2 className="text-sm font-bold text-slate-300">Aksi Cepat</h2>
          <div className="grid grid-cols-2 gap-4">
            
            {/* Action 1: Catat Transaksi */}
            <button
              onClick={() => navigate('/transactions')}
              className="bg-slate-900/60 hover:bg-slate-850/80 border border-slate-800/80 hover:border-teal-500/30 rounded-2xl p-5 flex flex-col items-center justify-center text-center transition-all group shadow-sm"
            >
              <div className="w-11 h-11 rounded-2xl bg-slate-800/80 group-hover:bg-teal-500/20 group-hover:text-teal-400 text-slate-300 flex items-center justify-center transition-all mb-3">
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M12 4v16m8-8H4" />
                </svg>
              </div>
              <span className="text-sm font-bold text-white group-hover:text-teal-300 transition-colors">
                Catat Transaksi
              </span>
            </button>

            {/* Action 2: Tanya AI */}
            <button
              onClick={() => navigate('/ai-chat')}
              className="bg-slate-900/60 hover:bg-slate-850/80 border border-slate-800/80 hover:border-cyan-500/30 rounded-2xl p-5 flex flex-col items-center justify-center text-center transition-all group shadow-sm"
            >
              <div className="w-11 h-11 rounded-2xl bg-slate-800/80 group-hover:bg-cyan-500/20 group-hover:text-cyan-400 text-slate-300 flex items-center justify-center transition-all mb-3">
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z" />
                </svg>
              </div>
              <span className="text-sm font-bold text-white group-hover:text-cyan-300 transition-colors">
                Tanya AI
              </span>
              <span className="text-[10px] text-slate-400 font-medium mt-0.5">
                Asisten Keuangan
              </span>
            </button>

          </div>
        </div>

        {/* ========================================================= */}
        {/* 4. AKTIVITAS TERBARU (Clean Transaction List) */}
        {/* ========================================================= */}
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <h2 className="text-sm font-bold text-slate-300">Aktivitas Terbaru</h2>
            <button
              onClick={() => navigate('/transactions')}
              className="text-xs font-bold text-teal-400 hover:text-teal-300 transition-colors"
            >
              Lihat Semua
            </button>
          </div>

          <div className="bg-slate-900/60 border border-slate-800/80 rounded-2xl p-2 divide-y divide-slate-800/60">
            {transactions.slice(0, 4).length > 0 ? (
              transactions.slice(0, 4).map((tx) => {
                const isIncome = tx.type === 'income';
                const catName = tx.category?.name || 'Lainnya';
                const dateFormatted = tx.transaction_date 
                  ? new Date(tx.transaction_date).toLocaleDateString('id-ID', { day: 'numeric', month: 'short' })
                  : 'Hari ini';

                return (
                  <div 
                    key={tx.id}
                    onClick={() => navigate('/transactions')}
                    className="p-3.5 flex items-center justify-between hover:bg-slate-800/40 rounded-xl cursor-pointer transition-colors"
                  >
                    <div className="flex items-center gap-3.5">
                      <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${
                        isIncome ? 'bg-emerald-500/10 text-emerald-400' : 'bg-slate-800 text-slate-300'
                      }`}>
                        {getCategoryIcon(catName, 'w-5 h-5')}
                      </div>
                      <div>
                        <div className="text-sm font-bold text-white">{catName}</div>
                        <div className="text-xs text-slate-400 capitalize">
                          {tx.description ? tx.description.split('\n')[0] : (isIncome ? 'Pemasukan' : 'Pengeluaran')}
                        </div>
                      </div>
                    </div>

                    <div className="text-right">
                      <div className={`text-sm font-bold ${isIncome ? 'text-emerald-400' : 'text-rose-400'}`}>
                        {isIncome ? '+' : '-'}{formatCurrency(parseFloat(tx.amount))}
                      </div>
                      <div className="text-[11px] text-slate-500 font-medium mt-0.5">
                        {dateFormatted}
                      </div>
                    </div>
                  </div>
                );
              })
            ) : (
              <div className="text-center py-8 text-xs text-slate-500 space-y-2">
                <p>Belum ada aktivitas transaksi.</p>
                <button
                  onClick={() => navigate('/transactions')}
                  className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-teal-400 rounded-xl font-bold text-xs transition-colors"
                >
                  Catat Transaksi Pertama
                </button>
              </div>
            )}
          </div>
        </div>

        {/* ========================================================= */}
        {/* 5. BUDGET BULAN INI (Circular Progress Ring & Condition) */}
        {/* ========================================================= */}
        <div className="space-y-3">
          <h2 className="text-sm font-bold text-slate-300">Budget Bulan Ini</h2>
          
          <div className="bg-slate-900/60 border border-slate-800/80 rounded-2xl p-6 flex flex-col sm:flex-row items-center gap-6">
            
            {/* SVG Circular Progress Ring */}
            <div className="relative w-24 h-24 shrink-0 flex items-center justify-center">
              <svg className="w-full h-full transform -rotate-90" viewBox="0 0 36 36">
                <path
                  className="text-slate-800"
                  strokeWidth="3.5"
                  stroke="currentColor"
                  fill="none"
                  d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                />
                <path
                  strokeDasharray={`${summary?.health_score || 80}, 100`}
                  stroke={healthStatus.ringColor}
                  strokeWidth="3.5"
                  strokeLinecap="round"
                  fill="none"
                  d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                />
              </svg>
              <div className="absolute flex flex-col items-center justify-center text-center">
                <span className="text-lg font-black text-white">
                  {summary?.health_score || 80}%
                </span>
              </div>
            </div>

            {/* Health Condition Details */}
            <div className="flex-1 text-center sm:text-left space-y-1">
              <div className="text-xs text-slate-400 font-medium">Kondisi</div>
              <div className={`text-base font-extrabold tracking-wide ${healthStatus.color}`}>
                {healthStatus.label}
              </div>
              <p className="text-xs text-slate-300 leading-relaxed pt-1">
                {healthStatus.message}
              </p>
            </div>

          </div>
        </div>

        {/* ========================================================= */}
        {/* 6. INSIGHT AI (Subtle Minimalist Card) */}
        {/* ========================================================= */}
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <h2 className="text-sm font-bold text-slate-300">Insight AI</h2>
            <button
              onClick={() => dispatch(fetchRecommendations())}
              className="p-1 text-slate-400 hover:text-slate-200 transition-colors"
              title="Perbarui Insight"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
              </svg>
            </button>
          </div>

          <div className="bg-slate-900/60 border border-slate-800/80 rounded-2xl p-5 space-y-4">
            <div className="flex items-center gap-2.5">
              <div className="w-7 h-7 rounded-lg bg-teal-500/10 text-teal-400 flex items-center justify-center">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z" />
                </svg>
              </div>
              <span className="text-xs font-bold text-slate-300">Insight dari MoneyAssist AI</span>
            </div>

            <p className="text-xs sm:text-sm text-slate-300 leading-relaxed font-normal">
              {topAIInsight}
            </p>

            <button
              onClick={() => navigate('/ai-chat')}
              className="flex items-center justify-between w-full pt-3 border-t border-slate-800/60 text-xs font-bold text-slate-300 hover:text-teal-400 transition-colors group"
            >
              <span>Lihat Insight Lainnya</span>
              <svg className="w-4 h-4 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </button>
          </div>
        </div>

        {/* ========================================================= */}
        {/* 7. EXPANDABLE VISUAL CHARTS (Tren Keuangan) */}
        {/* ========================================================= */}
        <div className="pt-2">
          <button
            onClick={() => setShowChartDetail(!showChartDetail)}
            className="w-full py-3 bg-slate-900/40 hover:bg-slate-850/60 border border-slate-800/60 rounded-xl text-xs font-bold text-slate-400 hover:text-slate-200 flex items-center justify-center gap-2 transition-all"
          >
            <span>{showChartDetail ? 'Sembunyikan Grafik Tren' : 'Tampilkan Grafik Tren & Rasio 50/30/20'}</span>
            <svg className={`w-4 h-4 transform transition-transform ${showChartDetail ? 'rotate-180' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
            </svg>
          </button>

          {showChartDetail && (
            <div className="mt-4 space-y-6 animate-fadeIn">
              
              {/* Trend Chart */}
              <div className="bg-slate-900/60 border border-slate-800/80 rounded-2xl p-5 space-y-4">
                <div className="flex items-center justify-between">
                  <h3 className="text-xs font-bold text-slate-300 uppercase tracking-wider">Tren Keuangan</h3>
                  <div className="flex gap-1 bg-slate-950 p-1 rounded-xl border border-slate-850">
                    {(['daily', 'monthly'] as const).map((t) => (
                      <button
                        key={t}
                        onClick={() => setTimeframe(t)}
                        className={`px-3 py-1 text-xs font-bold rounded-lg transition-all ${
                          timeframe === t ? 'bg-teal-500 text-white' : 'text-slate-400 hover:text-white'
                        }`}
                      >
                        {t === 'daily' ? 'Harian' : 'Bulanan'}
                      </button>
                    ))}
                  </div>
                </div>

                <div className="h-56 w-full">
                  <ResponsiveContainer width="100%" height="100%">
                    <AreaChart data={trendData}>
                      <defs>
                        <linearGradient id="colorExpense" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="5%" stopColor="#f43f5e" stopOpacity={0.3} />
                          <stop offset="95%" stopColor="#f43f5e" stopOpacity={0} />
                        </linearGradient>
                        <linearGradient id="colorIncome" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="5%" stopColor="#10b981" stopOpacity={0.3} />
                          <stop offset="95%" stopColor="#10b981" stopOpacity={0} />
                        </linearGradient>
                      </defs>
                      <XAxis dataKey="name" stroke="#64748b" fontSize={11} tickLine={false} />
                      <YAxis stroke="#64748b" fontSize={11} tickLine={false} tickFormatter={(v) => `Rp${(v / 1000).toFixed(0)}k`} />
                      <Tooltip
                        contentStyle={{ backgroundColor: '#0f172a', borderColor: '#334155', borderRadius: '12px', fontSize: '12px' }}
                        formatter={(val: any) => formatCurrency(Number(val))}
                      />
                      <Area type="monotone" dataKey="pengeluaran" stroke="#f43f5e" strokeWidth={2} fillOpacity={1} fill="url(#colorExpense)" />
                      <Area type="monotone" dataKey="pemasukan" stroke="#10b981" strokeWidth={2} fillOpacity={1} fill="url(#colorIncome)" />
                    </AreaChart>
                  </ResponsiveContainer>
                </div>
              </div>

              {/* 50/30/20 Visualizer */}
              <div className="bg-slate-900/60 border border-slate-800/80 rounded-2xl p-5 space-y-4">
                <h3 className="text-xs font-bold text-slate-300 uppercase tracking-wider">Rasio Anggaran 50/30/20</h3>
                <div className="w-full bg-slate-950 rounded-full h-3 overflow-hidden flex">
                  <div className="bg-teal-500 h-full" style={{ width: `${budgetRatio.needsPct}%` }} title="Kebutuhan" />
                  <div className="bg-cyan-400 h-full" style={{ width: `${budgetRatio.wantsPct}%` }} title="Keinginan" />
                  <div className="bg-emerald-400 h-full" style={{ width: `${budgetRatio.savingsPct}%` }} title="Tabungan" />
                </div>
                <div className="grid grid-cols-3 gap-2 text-xs">
                  <div className="p-2.5 bg-slate-950/60 rounded-xl border border-slate-800">
                    <span className="text-[10px] text-teal-400 font-bold block">Kebutuhan (50%)</span>
                    <span className="font-bold text-white">{budgetRatio.needsPct}%</span>
                  </div>
                  <div className="p-2.5 bg-slate-950/60 rounded-xl border border-slate-800">
                    <span className="text-[10px] text-cyan-400 font-bold block">Keinginan (30%)</span>
                    <span className="font-bold text-white">{budgetRatio.wantsPct}%</span>
                  </div>
                  <div className="p-2.5 bg-slate-950/60 rounded-xl border border-slate-800">
                    <span className="text-[10px] text-emerald-400 font-bold block">Tabungan (20%)</span>
                    <span className="font-bold text-white">{budgetRatio.savingsPct}%</span>
                  </div>
                </div>
              </div>

            </div>
          )}
        </div>

      </div>
    </AuthenticatedLayout>
  );
}
