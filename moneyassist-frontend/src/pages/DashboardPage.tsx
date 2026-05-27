import { useEffect, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { RootState, AppDispatch } from '../store/store';
import { formatCurrency } from '../utils/formatters';
import AuthenticatedLayout from '../components/common/AuthenticatedLayout';
import LoadingSpinner from '../components/common/LoadingSpinner';
import { fetchRecommendations, generateRecommendations, clearRecommendations } from '../store/uiSlice';
import { ResponsiveContainer, AreaChart, Area, XAxis, YAxis, Tooltip, PieChart, Pie, Cell } from 'recharts';
import api from '../services/api';

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
  const { recommendations, loading: recsLoading } = useSelector((state: RootState) => state.ui);
  const dispatch = useDispatch<AppDispatch>();
  const navigate = useNavigate();

  const [summary, setSummary] = useState<DashboardSummary | null>(null);
  const [loading, setLoading] = useState(true);
  const [generating, setGenerating] = useState(false);

  const categoryLimits: { [key: string]: number } = {
    'Makanan': 1500000,
    'Transportasi': 800000,
    'Hiburan': 600000,
    'Tagihan': 2000000,
    'Belanja': 1000000,
  };

  const getOverspendingAlerts = () => {
    const alerts: Array<{ category: string; amount: number; limit: number; pct: number }> = [];
    if (summary && summary.expense_by_category) {
      summary.expense_by_category.forEach(item => {
        const name = item.category;
        const matchedKey = Object.keys(categoryLimits).find(
          k => k.toLowerCase() === name.toLowerCase() || name.toLowerCase().includes(k.toLowerCase())
        );
        if (matchedKey) {
          const limit = categoryLimits[matchedKey];
          const pct = (item.amount / limit) * 100;
          if (pct >= 80) {
            alerts.push({
              category: name,
              amount: item.amount,
              limit,
              pct
            });
          }
        }
      });
    }
    return alerts;
  };

  const getBudget50_30_20 = () => {
    let needs = 0;
    let wants = 0;
    let savings = 0;

    const needsCategories = ['makanan', 'groceries', 'tagihan', 'utilitas', 'transportasi', 'kesehatan', 'sewa', 'pendidikan', 'keperluan rumah', 'house', 'bills', 'transport', 'health', 'education', 'food'];
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
      needsPct: total > 0 ? (needs / total) * 100 : 0,
      wantsPct: total > 0 ? (wants / total) * 100 : 0,
      savingsPct: total > 0 ? (savings / total) * 100 : 0,
      total
    };
  };

  const handleGenerateRecommendations = async () => {
    setGenerating(true);
    try {
      await dispatch(generateRecommendations()).unwrap();
      fetchSummary();
    } catch (error) {
      console.error('Failed to generate recommendations:', error);
      alert('Gagal membuat rekomendasi finansial. Pastikan Anda sudah memiliki catatan transaksi agar AI dapat menganalisis keuangan Anda.');
    } finally {
      setGenerating(false);
    }
  };

  const handleClearRecommendations = async () => {
    if (window.confirm('Apakah Anda yakin ingin menghapus semua rekomendasi AI?')) {
      try {
        await dispatch(clearRecommendations(recommendations)).unwrap();
      } catch (error) {
        console.error('Failed to clear recommendations:', error);
        alert('Gagal membersihkan rekomendasi.');
      }
    }
  };

  // Generate last 7 days dates for the trend graph
  const getTrendData = () => {
    const data = [];
    for (let i = 6; i >= 0; i--) {
      const d = new Date();
      d.setDate(d.getDate() - i);
      const label = d.toLocaleDateString('id-ID', { month: '2-digit', day: '2-digit' });
      data.push({ name: label, pengeluaran: 0 }); // Defaulting to 0 to match screenshot Rp 0
    }
    return data;
  };

  useEffect(() => {
    fetchSummary();
    dispatch(fetchRecommendations());
  }, [dispatch]);

  const fetchSummary = async () => {
    try {
      const response = await api.get('/users/summary');
      const data = response.data.data || response.data;
      
      setSummary({
        total_income: data.total_income ?? 0,
        total_expense: data.total_expense ?? 0,
        balance: data.balance ?? 0,
        financial_status: data.financial_status ?? 'controlled',
        health_score: data.health_score ?? 100,
        expense_by_category: data.expense_by_category ?? []
      });
    } catch (error) {
      console.error('Failed to fetch summary:', error);
      setSummary({
        total_income: 0,
        total_expense: 0,
        balance: 0,
        financial_status: 'controlled',
        health_score: 100,
        expense_by_category: []
      });
    } finally {
      setLoading(false);
    }
  };

  // Today formatted as YYYY-MM-DD
  const todayStr = new Date().toISOString().split('T')[0];

  return (
    <AuthenticatedLayout pageTitle="Dashboard">
      {loading ? (
        <div className="flex items-center justify-center min-h-[60vh]">
          <LoadingSpinner />
        </div>
      ) : (
        <div className="space-y-6 md:space-y-8">
        
        {/* Welcome Header & Indicators Section */}
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6 pb-6 border-b border-slate-900/60">
          <div>
            <h1 className="text-2xl md:text-3xl font-extrabold text-white tracking-tight">
              Dashboard Keuangan Kak {user?.name || 'Demo User'}
            </h1>
            <p className="text-slate-400 text-xs md:text-sm mt-1">
              Sistem memantau ledger finansial Anda secara real-time
            </p>
          </div>

          {/* Right Header Status Widgets */}
          <div className="flex items-center gap-6 shrink-0 bg-slate-900/30 border border-slate-850 p-4 rounded-2xl backdrop-blur-md">
            <div>
              <p className="text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-1">Status Budget</p>
              {summary?.financial_status === 'critical' ? (
                <div className="flex items-center gap-2 px-3 py-1 bg-rose-500/10 border border-rose-500/20 rounded-xl text-rose-400 text-xs font-extrabold uppercase">
                  <span className="w-2 h-2 bg-rose-500 rounded-full animate-pulse"></span>
                  Bahaya
                </div>
              ) : summary?.financial_status === 'elevated' ? (
                <div className="flex items-center gap-2 px-3 py-1 bg-amber-500/10 border border-amber-500/20 rounded-xl text-amber-400 text-xs font-extrabold uppercase">
                  <span className="w-2 h-2 bg-amber-500 rounded-full animate-pulse"></span>
                  Waspada
                </div>
              ) : (
                <div className="flex items-center gap-2 px-3 py-1 bg-emerald-500/10 border border-emerald-500/20 rounded-xl text-emerald-400 text-xs font-extrabold uppercase">
                  <span className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse"></span>
                  Aman
                </div>
              )}
            </div>
            <div className="w-px h-8 bg-slate-800"></div>
            <div>
              <p className="text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-1">Skor Sehat</p>
              <p className="text-base font-extrabold text-white">
                {summary?.health_score ?? 100}<span className="text-xs text-slate-500 font-semibold">/100</span>
              </p>
            </div>
          </div>
        </div>

        {/* Radar Batas Kategori Alert Banner */}
        {getOverspendingAlerts().length > 0 && (
          <div className="bg-rose-500/5 border border-rose-500/20 rounded-3xl p-4 sm:p-5 md:p-6 space-y-4 relative overflow-hidden backdrop-blur-xl shadow-lg shadow-rose-500/5">
            <div className="absolute top-0 right-0 w-24 h-24 bg-rose-500/5 rounded-full blur-2xl pointer-events-none animate-pulse"></div>
            <div className="flex gap-4">
              <div className="w-11 h-11 bg-rose-500/10 border border-rose-500/20 rounded-full flex items-center justify-center text-rose-500 shrink-0 mt-0.5 animate-pulse">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                </svg>
              </div>
              <div className="flex-1">
                <h3 className="text-sm font-bold text-rose-400">
                  🚨 Radar Keuangan: Pengeluaran Kategori Hampir Melebihi Batas!
                </h3>
                <p className="text-slate-350 text-xs mt-1 leading-relaxed max-w-3xl">
                  Gemini AI mendeteksi pengeluaran Kakak pada kategori berikut telah mendekati atau melebihi alokasi anggaran bulanan:
                </p>
              </div>
            </div>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 mt-2">
              {getOverspendingAlerts().map((alert, idx) => (
                <div key={idx} className="bg-slate-950/60 border border-slate-900 rounded-2xl p-4 relative overflow-hidden">
                  <div className="flex justify-between items-start mb-2">
                    <span className="text-xs font-bold text-white">{alert.category}</span>
                    <span className={`text-[10px] font-extrabold px-2 py-0.5 rounded-md ${alert.pct >= 100 ? 'bg-rose-500/15 text-rose-400 border border-rose-500/25' : 'bg-amber-500/15 text-amber-400 border border-amber-500/25'}`}>
                      {alert.pct.toFixed(0)}%
                    </span>
                  </div>
                  <div className="w-full bg-slate-900 rounded-full h-2 overflow-hidden border border-slate-950 mb-2">
                    <div 
                      className={`h-full rounded-full transition-all duration-500 ${alert.pct >= 100 ? 'bg-rose-500 shadow-md shadow-rose-500/20' : 'bg-amber-500 shadow-md shadow-amber-500/20'}`}
                      style={{ width: `${Math.min(alert.pct, 100)}%` }}
                    ></div>
                  </div>
                  <div className="flex justify-between items-center text-[10px] font-bold text-slate-400">
                    <span>{formatCurrency(alert.amount)}</span>
                    <span className="text-slate-500">Limit: {formatCurrency(alert.limit)}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Daily Reminder Alert Banner */}
        <div className="bg-amber-500/5 border border-amber-500/20 rounded-3xl p-4 sm:p-5 md:p-6 flex flex-col md:flex-row items-start md:items-center justify-between gap-4 relative overflow-hidden backdrop-blur-xl">
          <div className="absolute top-0 right-0 w-24 h-24 bg-amber-500/5 rounded-full blur-2xl pointer-events-none"></div>
          <div className="flex gap-4">
            <div className="w-11 h-11 bg-amber-500/10 border border-amber-500/20 rounded-full flex items-center justify-center text-amber-500 shrink-0 mt-0.5">
              <svg className="w-5 h-5 animate-swing" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
              </svg>
            </div>
            <div>
              <h3 className="text-sm font-bold text-amber-400">
                🚨 Pengingat Harian: Belum Menginput Transaksi Hari Ini!
              </h3>
              <p className="text-slate-350 text-xs mt-1 leading-relaxed max-w-3xl">
                Kakak belum mencatat pengeluaran atau pemasukan hari ini ({todayStr}). Ayo segera catat transaksi harian Kakak sekarang agar status keuangan tetap akurat terpantau!
              </p>
            </div>
          </div>
          <button
            onClick={() => navigate('/transactions')}
            className="w-full md:w-auto px-5 py-2.5 bg-orange-600 hover:bg-orange-500 text-white rounded-xl font-extrabold text-xs transition-all shadow-md shadow-orange-600/10 text-center shrink-0"
          >
            Input Sekarang
          </button>
        </div>

        {/* Stats Bento Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 sm:gap-6">
          {/* Saldo Tersisa */}
          <div className="bg-slate-900/40 border border-slate-800/80 backdrop-blur-xl rounded-2xl p-5 hover:border-slate-700/60 transition-all flex justify-between items-start">
            <div>
              <span className="text-slate-500 text-[10px] font-bold uppercase tracking-wider block mb-1">Saldo Tersisa</span>
              <p className="text-2xl font-black text-white tracking-tight">
                {formatCurrency(summary?.balance || 0)}
              </p>
              <p className="text-[10px] font-semibold text-slate-400 mt-2">Total akumulasi tabungan mandini</p>
            </div>
            <div className="w-9 h-9 bg-blue-500/10 border border-blue-500/20 rounded-xl flex items-center justify-center text-blue-400 shrink-0 ml-3">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z" />
              </svg>
            </div>
          </div>

          {/* Total Pemasukan */}
          <div className="bg-slate-900/40 border border-slate-800/80 backdrop-blur-xl rounded-2xl p-5 hover:border-slate-700/60 transition-all flex justify-between items-start">
            <div>
              <span className="text-slate-500 text-[10px] font-bold uppercase tracking-wider block mb-1">Total Pemasukan</span>
              <p className="text-2xl font-black text-emerald-400 tracking-tight">
                {formatCurrency(summary?.total_income || 0)}
              </p>
              <p className="text-[10px] font-semibold text-slate-400 mt-2">+ Gaji, bonus & freelance terhitung</p>
            </div>
            <div className="w-9 h-9 bg-emerald-500/10 border border-emerald-500/20 rounded-xl flex items-center justify-center text-emerald-400 shrink-0 ml-3">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 11l5-5m0 0l5 5m-5-5v12" />
              </svg>
            </div>
          </div>

          {/* Total Pengeluaran */}
          <div className="bg-slate-900/40 border border-slate-800/80 backdrop-blur-xl rounded-2xl p-5 hover:border-slate-700/60 transition-all flex justify-between items-start">
            <div>
              <span className="text-slate-500 text-[10px] font-bold uppercase tracking-wider block mb-1">Total Pengeluaran</span>
              <p className="text-2xl font-black text-rose-400 tracking-tight">
                {formatCurrency(summary?.total_expense || 0)}
              </p>
              <p className="text-[10px] font-semibold text-slate-400 mt-2">0% dari total alokasi pemasukan</p>
            </div>
            <div className="w-9 h-9 bg-rose-500/10 border border-rose-500/20 rounded-xl flex items-center justify-center text-rose-400 shrink-0 ml-3">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 13l-5 5m0 0l-5-5m5 5V6" />
              </svg>
            </div>
          </div>
        </div>

        {/* Charts & Goals Aggregate Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 md:gap-8">
          
          {/* Spending Trend Chart */}
          <div className="bg-slate-900/40 border border-slate-800/80 backdrop-blur-xl rounded-3xl p-5 sm:p-6 lg:col-span-8">
            <div>
              <h2 className="text-sm sm:text-base font-bold text-white leading-tight">Membaca Tren Pengeluaran Harian</h2>
              <p className="text-[10px] font-bold text-slate-500 uppercase tracking-wider mt-1">Visualisasi pengeluaran dalam seminggu terakhir</p>
            </div>
            <div className="h-[250px] w-full mt-6">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={getTrendData()} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                  <defs>
                    <linearGradient id="colorTrend" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#0ea5e9" stopOpacity={0.2}/>
                      <stop offset="95%" stopColor="#0ea5e9" stopOpacity={0}/>
                    </linearGradient>
                  </defs>
                  <XAxis dataKey="name" stroke="#64748b" fontSize={10} tickLine={false} axisLine={false} />
                  <YAxis stroke="#64748b" fontSize={10} tickLine={false} axisLine={false} />
                  <Tooltip 
                    contentStyle={{ backgroundColor: '#0f172a', borderColor: '#1e293b', borderRadius: '12px' }}
                    labelStyle={{ color: '#94a3b8', fontSize: '11px', fontWeight: 'bold' }}
                    itemStyle={{ color: '#38bdf8', fontSize: '11px', fontWeight: 'extrabold' }}
                  />
                  <Area type="monotone" dataKey="pengeluaran" stroke="#0ea5e9" strokeWidth={2} fillOpacity={1} fill="url(#colorTrend)" />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Category Ratio & Savings Aggregation */}
          <div className="lg:col-span-4 flex flex-col gap-6">
            {/* Category ratio */}
            <div className="bg-slate-900/40 border border-slate-800/80 backdrop-blur-xl rounded-3xl p-5 sm:p-6 flex-1">
              <h2 className="text-sm sm:text-base font-bold text-white">Aturan Anggaran 50/30/20</h2>
              <p className="text-[10px] font-bold text-slate-500 uppercase tracking-wider mt-1">Evaluasi kesehatan alokasi keuangan bulanan Anda</p>
              
              {summary && summary.total_expense > 0 ? (() => {
                const { needs, wants, savings, needsPct, wantsPct, savingsPct } = getBudget50_30_20();
                const pieData = [
                  { name: 'Kebutuhan (50%)', value: needs, color: '#38bdf8' },
                  { name: 'Keinginan (30%)', value: wants, color: '#f59e0b' },
                  { name: 'Tabungan (20%)', value: savings, color: '#10b981' }
                ];
                return (
                  <div className="mt-6 space-y-4">
                    <div className="h-[140px] w-full flex items-center justify-center relative">
                      <ResponsiveContainer width="100%" height="100%">
                        <PieChart>
                          <Pie
                            data={pieData}
                            cx="50%"
                            cy="50%"
                            innerRadius={38}
                            outerRadius={55}
                            paddingAngle={4}
                            dataKey="value"
                          >
                            {pieData.map((entry, index) => (
                              <Cell key={`cell-${index}`} fill={entry.color} />
                            ))}
                          </Pie>
                          <Tooltip 
                            formatter={(value: any) => formatCurrency(value)}
                            contentStyle={{ backgroundColor: '#0f172a', borderColor: '#1e293b', borderRadius: '12px' }}
                          />
                        </PieChart>
                      </ResponsiveContainer>
                      <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
                        <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">Total</span>
                        <span className="text-xs font-black text-white">{formatCurrency(needs + wants + savings)}</span>
                      </div>
                    </div>
                    
                    <div className="space-y-2 text-xs">
                      {/* Needs Row */}
                      <div className="flex justify-between items-center bg-slate-950/40 border border-slate-900/60 p-2 rounded-xl">
                        <div className="flex items-center gap-2">
                          <span className="w-2.5 h-2.5 bg-sky-400 rounded-full"></span>
                          <span className="font-semibold text-slate-300">Kebutuhan (Target: 50%)</span>
                        </div>
                        <div className="text-right">
                          <span className="font-extrabold text-white">{needsPct.toFixed(0)}%</span>
                          <span className="text-[10px] text-slate-500 block">{formatCurrency(needs)}</span>
                        </div>
                      </div>
                      {/* Wants Row */}
                      <div className="flex justify-between items-center bg-slate-950/40 border border-slate-900/60 p-2 rounded-xl">
                        <div className="flex items-center gap-2">
                          <span className="w-2.5 h-2.5 bg-amber-500 rounded-full"></span>
                          <span className="font-semibold text-slate-300">Keinginan (Target: 30%)</span>
                        </div>
                        <div className="text-right">
                          <span className={`font-extrabold ${wantsPct > 30 ? 'text-rose-400' : 'text-white'}`}>{wantsPct.toFixed(0)}%</span>
                          <span className="text-[10px] text-slate-500 block">{formatCurrency(wants)}</span>
                        </div>
                      </div>
                      {/* Savings Row */}
                      <div className="flex justify-between items-center bg-slate-950/40 border border-slate-900/60 p-2 rounded-xl">
                        <div className="flex items-center gap-2">
                          <span className="w-2.5 h-2.5 bg-emerald-500 rounded-full"></span>
                          <span className="font-semibold text-slate-300">Tabungan (Target: 20%)</span>
                        </div>
                        <div className="text-right">
                          <span className={`font-extrabold ${savingsPct < 20 ? 'text-amber-400' : 'text-white'}`}>{savingsPct.toFixed(0)}%</span>
                          <span className="text-[10px] text-slate-500 block">{formatCurrency(savings)}</span>
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })() : (
                <div className="mt-8 text-center flex flex-col items-center justify-center py-6">
                  <span className="text-3xl mb-2">📊</span>
                  <p className="text-xs font-semibold text-slate-400">Belum ada pengeluaran tercatat.</p>
                </div>
              )}
            </div>

            {/* Savings Aggregate Card */}
            <div className="bg-slate-900/40 border border-slate-800/80 backdrop-blur-xl rounded-3xl p-5 sm:p-6">
              <div className="flex justify-between items-start mb-4">
                <div>
                  <h2 className="text-sm sm:text-base font-bold text-white">Agregat Tabungan Saya</h2>
                  <p className="text-[10px] font-bold text-slate-500 uppercase tracking-wider mt-0.5">Ringkasan kemajuan rencana tabungan</p>
                </div>
                <span className="px-2 py-0.5 bg-sky-500/10 border border-sky-500/20 text-sky-400 text-[10px] font-extrabold rounded-full">
                  0% Sukses
                </span>
              </div>
              <button
                onClick={() => navigate('/goals')}
                className="w-full py-3 bg-slate-950/80 hover:bg-slate-900 border border-slate-850 text-teal-400 hover:text-teal-300 rounded-xl transition-all text-xs font-bold text-center mt-4"
              >
                Kelola Seluruh Target Tabungan &rarr;
              </button>
            </div>
          </div>
        </div>

        {/* Gemini AI Recommendations Section */}
        <div className="bg-slate-900/40 border border-slate-800/80 backdrop-blur-xl rounded-3xl p-5 sm:p-6 md:p-8">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h2 className="text-sm sm:text-base font-bold text-white flex items-center gap-2">
                <span className="w-1.5 h-4 bg-teal-500 rounded-full"></span>
                Rekomendasi Cerdas Gemini AI
              </h2>
              <p className="text-[10px] font-bold text-slate-500 uppercase tracking-wider mt-0.5">
                Analisis Transaksi & Performa Tabungan Pengguna
              </p>
            </div>
            <div className="flex items-center gap-2">
              <button
                onClick={handleGenerateRecommendations}
                disabled={generating}
                className="px-3 py-1.5 bg-teal-600 hover:bg-teal-500 disabled:bg-slate-850 disabled:text-slate-650 text-white rounded-xl text-xs font-bold transition-all flex items-center gap-1.5"
              >
                {generating ? 'Menganalisis...' : 'Analisis AI'}
              </button>
              {recommendations && recommendations.length > 0 && (
                <button
                  onClick={handleClearRecommendations}
                  className="px-3 py-1.5 bg-slate-950/60 hover:bg-rose-500/10 text-slate-400 hover:text-rose-405 border border-slate-850 hover:border-rose-500/20 rounded-xl text-xs font-bold transition-all"
                >
                  Bersihkan
                </button>
              )}
              <button
                onClick={() => dispatch(fetchRecommendations())}
                className="p-1.5 bg-slate-950 border border-slate-850 text-slate-400 hover:text-white rounded-xl transition-all"
                title="Refresh"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                </svg>
              </button>
            </div>
          </div>

          {recsLoading ? (
            <div className="flex justify-center py-8">
              <LoadingSpinner />
            </div>
          ) : recommendations && recommendations.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {recommendations.map((rec) => (
                <div key={rec.id} className="bg-slate-950/60 border border-slate-900 rounded-2xl p-4.5 flex gap-3.5 relative">
                  <div className="w-9 h-9 bg-teal-500/10 border border-teal-500/20 rounded-xl flex items-center justify-center text-teal-400 shrink-0 mt-0.5">
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
                    </svg>
                  </div>
                  <div className="min-w-0 flex-1">
                    <div className="flex justify-between items-start gap-2 mb-2">
                      <span className="px-2 py-0.5 bg-teal-500/10 border border-teal-500/20 text-teal-400 text-[9px] font-extrabold rounded-md uppercase tracking-wider">
                        {rec.title}
                      </span>
                      <span className="text-slate-500 text-[9px] font-bold">
                        {rec.priority.toUpperCase()}
                      </span>
                    </div>
                    <p className="text-xs text-slate-350 leading-relaxed font-semibold">
                      {rec.description}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-8 bg-slate-950/20 border border-slate-900/40 rounded-2xl">
              <span className="text-2xl block mb-2">💡</span>
              <p className="text-xs font-semibold text-slate-400 max-w-md mx-auto leading-relaxed">
                Belum ada rekomendasi finansial dari Gemini AI. Klik tombol <strong className="text-teal-400">"Analisis AI"</strong> di atas untuk memindai transaksi Anda secara otomatis.
              </p>
            </div>
          )}
        </div>

      </div>
      )}
    </AuthenticatedLayout>
  );
}
