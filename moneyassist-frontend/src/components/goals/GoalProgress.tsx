import React, { useState } from 'react';
import { useDispatch } from 'react-redux';
import { AppDispatch } from '../../store/store';
import { updateGoalProgress } from '../../store/goalSlice';
import { SavingsGoal } from '../../types';
import { formatCurrency, formatDate } from '../../utils/formatters';

interface GoalProgressProps {
  goal: SavingsGoal;
  onEdit: (goal: SavingsGoal) => void;
  onDelete: (id: number) => void;
}

const GoalProgress: React.FC<GoalProgressProps> = ({ goal, onEdit, onDelete }) => {
  const dispatch = useDispatch<AppDispatch>();
  const [depositAmount, setDepositAmount] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleDeposit = async (e: React.FormEvent) => {
    e.preventDefault();
    const amount = parseFloat(depositAmount);
    if (isNaN(amount) || amount <= 0) return;

    setIsSubmitting(true);
    try {
      await dispatch(updateGoalProgress({ id: goal.id, amount })).unwrap();
      setDepositAmount('');
    } catch (err) {
      console.error('Failed to update goal progress:', err);
      alert('Gagal menambah tabungan.');
    } finally {
      setIsSubmitting(false);
    }
  };
  
  const progress = goal.target_amount > 0 ? (goal.current_amount / goal.target_amount) * 100 : 0;
  const remaining = Math.max(0, goal.target_amount - goal.current_amount);
  
  const calculateDaysLeft = () => {
    if (!goal.target_date) return 0;
    const diff = new Date(goal.target_date).getTime() - new Date().getTime();
    return Math.ceil(diff / (1000 * 60 * 60 * 24));
  };
  const daysLeft = calculateDaysLeft();

  const getStatusColor = () => {
    if (progress >= 100) return 'text-emerald-400';
    if (progress >= 75) return 'text-teal-400';
    if (progress >= 50) return 'text-cyan-400';
    if (progress >= 25) return 'text-amber-400';
    return 'text-rose-400';
  };

  const getProgressBarColor = () => {
    if (progress >= 100) return 'from-emerald-400 to-green-500';
    if (progress >= 75) return 'from-teal-400 to-emerald-400';
    if (progress >= 50) return 'from-cyan-400 to-teal-400';
    if (progress >= 25) return 'from-amber-400 to-orange-500';
    return 'from-rose-400 to-red-500';
  };

  const renderCategoryIcon = () => {
    switch (goal.category) {
      case 'savings':
        return (
          <svg className="w-5 h-5 text-teal-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
        );
      case 'investment':
        return (
          <svg className="w-5 h-5 text-emerald-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
          </svg>
        );
      case 'emergency':
        return (
          <svg className="w-5 h-5 text-amber-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
          </svg>
        );
      case 'vacation':
        return (
          <svg className="w-5 h-5 text-cyan-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3.055 11H5a2 2 0 012 2v1a2 2 0 002 2 2 2 0 012 2v2.945M8 3.935V5.5A2.5 2.5 0 0010.5 8h.5a2 2 0 012 2 2 2 0 104 0 2 2 0 012-2h1.064M15 20.488V18a2 2 0 012-2h3.064" />
          </svg>
        );
      case 'education':
        return (
          <svg className="w-5 h-5 text-indigo-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path d="M12 14l9-5-9-5-9 5 9 5z" />
            <path d="M12 14l6.16-3.422a12.083 12.083 0 01.665 6.479A11.952 11.952 0 0012 20.055a11.952 11.952 0 00-6.824-2.998 12.078 12.078 0 01.665-6.479L12 14z" />
          </svg>
        );
      default:
        return (
          <svg className="w-5 h-5 text-teal-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
        );
    }
  };

  return (
    <div className="bg-slate-900/60 border border-slate-800/80 backdrop-blur-xl rounded-2xl p-5 sm:p-6 hover:border-slate-700/60 transition-all flex flex-col justify-between">
      <div>
        <div className="flex justify-between items-start mb-4">
          <div className="flex items-center gap-3 min-w-0">
            <div className="w-10 h-10 bg-slate-950 rounded-xl flex items-center justify-center border border-slate-800 shrink-0">
              {renderCategoryIcon()}
            </div>
            <div className="min-w-0">
              <h3 className="text-sm sm:text-base font-bold text-white leading-tight truncate">{goal.name}</h3>
              <p className="text-[10px] font-semibold text-slate-400 capitalize mt-0.5">{goal.category || 'Target'}</p>
            </div>
          </div>
          
          {/* Actions */}
          <div className="flex gap-1 shrink-0 ml-2">
            <button
              onClick={() => onEdit(goal)}
              className="p-1.5 bg-slate-950 hover:bg-teal-500/10 text-slate-400 hover:text-teal-400 border border-slate-800 hover:border-teal-500/20 rounded-lg transition-colors"
              title="Ubah Target"
            >
              <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
              </svg>
            </button>
            <button
              onClick={() => onDelete(goal.id)}
              className="p-1.5 bg-slate-950 hover:bg-rose-500/10 text-slate-400 hover:text-rose-400 border border-slate-800 hover:border-rose-500/20 rounded-lg transition-colors"
              title="Hapus Target"
            >
              <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
              </svg>
            </button>
          </div>
        </div>

        {goal.description && (
          <p className="text-xs text-slate-400 mb-4 font-normal leading-relaxed line-clamp-2">{goal.description}</p>
        )}

        <div className="space-y-3">
          {/* Progress Text */}
          <div className="flex justify-between items-center text-xs font-semibold">
            <span className="text-slate-400">Kemajuan</span>
            <span className={`text-xs sm:text-sm font-extrabold ${getStatusColor()}`}>
              {progress.toFixed(1)}%
            </span>
          </div>

          {/* Progress Bar */}
          <div className="w-full bg-slate-950 rounded-full h-2 overflow-hidden border border-slate-900">
            <div
              className={`h-full bg-gradient-to-r ${getProgressBarColor()} transition-all duration-500 rounded-full`}
              style={{ width: `${Math.min(progress, 100)}%` }}
            />
          </div>

          {/* Amount Breakdowns */}
          <div className="grid grid-cols-2 gap-2.5">
            <div className="bg-slate-950/60 border border-slate-900 rounded-xl p-2.5">
              <p className="text-[9px] font-bold text-slate-500 uppercase tracking-wider mb-0.5">Terkumpul</p>
              <p className="text-xs sm:text-sm font-extrabold text-white truncate">
                {formatCurrency(goal.current_amount)}
              </p>
            </div>
            <div className="bg-slate-950/60 border border-slate-900 rounded-xl p-2.5">
              <p className="text-[9px] font-bold text-slate-500 uppercase tracking-wider mb-0.5">Sasaran</p>
              <p className="text-xs sm:text-sm font-extrabold text-slate-300 truncate">
                {formatCurrency(goal.target_amount)}
              </p>
            </div>
          </div>
        </div>
      </div>

      <div className="mt-4 pt-3 border-t border-slate-850 space-y-3">
        {/* Meta Details */}
        <div className="flex justify-between items-start text-xs gap-2">
          <div className="min-w-0">
            <p className="text-[10px] font-semibold text-slate-500 uppercase tracking-wider">Kekurangan</p>
            <p className="text-xs font-bold text-slate-300 mt-0.5 truncate">
              {formatCurrency(remaining)}
            </p>
          </div>
          <div className="text-right shrink-0">
            <p className="text-[10px] font-semibold text-slate-500 uppercase tracking-wider">Tenggat</p>
            <p className="text-xs font-bold text-slate-300 mt-0.5">
              {formatDate(goal.target_date)}
            </p>
            {daysLeft > 0 ? (
              <p className="text-[10px] font-bold text-teal-400 mt-0.5">
                {daysLeft} hari lagi
              </p>
            ) : (
              <p className="text-[10px] font-bold text-rose-400 mt-0.5">
                Terlewati
              </p>
            )}
          </div>
        </div>

        {/* Deposit/Tabung Form */}
        {progress < 100 && (
          <form onSubmit={handleDeposit} className="mt-3 pt-3 border-t border-slate-850 flex gap-2">
            <div className="relative flex-1">
              <input
                type="number"
                placeholder="Tambah tabungan (Rp)..."
                value={depositAmount}
                onChange={(e) => setDepositAmount(e.target.value)}
                className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-xl text-xs text-white placeholder-slate-500 focus:outline-none focus:border-teal-500 transition-colors font-medium"
                min="1"
                required
              />
              <span className="absolute right-3 top-2 text-[10px] font-extrabold text-slate-500 uppercase">
                IDR
              </span>
            </div>
            <button
              type="submit"
              disabled={isSubmitting}
              className="px-4 py-2 bg-gradient-to-r from-teal-500 to-cyan-500 hover:from-teal-400 hover:to-cyan-400 disabled:from-slate-800 disabled:to-slate-800 text-white rounded-xl text-xs font-bold transition-all shadow-md shadow-teal-500/10 shrink-0 flex items-center justify-center min-w-[70px]"
            >
              {isSubmitting ? 'Memproses...' : 'Tabung'}
            </button>
          </form>
        )}

        {/* Milestone Message */}
        {progress >= 100 && (
          <div className="bg-emerald-500/10 border border-emerald-500/20 rounded-xl p-2.5 text-center">
            <p className="text-xs text-emerald-400 font-bold">
              Target tabungan berhasil tercapai.
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default GoalProgress;
