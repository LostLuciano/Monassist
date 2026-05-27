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

  const getCategoryIcon = () => {
    switch (goal.category) {
      case 'savings':
        return '💰';
      case 'investment':
        return '📈';
      case 'emergency':
        return '🚨';
      case 'vacation':
        return '✈️';
      case 'education':
        return '🎓';
      default:
        return '🎯';
    }
  };

  return (
    <div className="bg-slate-900/40 border border-slate-800/80 backdrop-blur-xl rounded-2xl p-4 sm:p-6 hover:border-slate-700/60 transition-all flex flex-col justify-between">
      <div>
        <div className="flex justify-between items-start mb-4">
          <div className="flex items-center gap-2.5 min-w-0">
            <span className="text-xl w-9 h-9 sm:w-10 sm:h-10 bg-slate-950 rounded-xl flex items-center justify-center border border-slate-800/80 shrink-0">
              {getCategoryIcon()}
            </span>
            <div className="min-w-0">
              <h3 className="text-sm sm:text-base font-bold text-white leading-tight truncate">{goal.name}</h3>
              <p className="text-[10px] font-bold text-slate-500 capitalize mt-0.5">{goal.category || 'Target'}</p>
            </div>
          </div>
          
          {/* Actions */}
          <div className="flex gap-1 shrink-0 ml-2">
            <button
              onClick={() => onEdit(goal)}
              className="p-1.5 bg-slate-950 hover:bg-teal-500/10 text-slate-400 hover:text-teal-400 border border-slate-800/80 hover:border-teal-500/20 rounded-lg transition-colors"
              title="Ubah Target"
            >
              <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
              </svg>
            </button>
            <button
              onClick={() => onDelete(goal.id)}
              className="p-1.5 bg-slate-950 hover:bg-rose-500/10 text-slate-400 hover:text-rose-400 border border-slate-800/80 hover:border-rose-500/20 rounded-lg transition-colors"
              title="Hapus Target"
            >
              <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
              </svg>
            </button>
          </div>
        </div>

        {goal.description && (
          <p className="text-xs text-slate-400 mb-4 font-medium leading-relaxed line-clamp-2">{goal.description}</p>
        )}

        <div className="space-y-3">
          {/* Progress Text */}
          <div className="flex justify-between items-center text-xs font-semibold">
            <span className="text-slate-500">Kemajuan</span>
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
        <div className="flex justify-between items-start text-[11px] gap-2">
          <div className="min-w-0">
            <p className="text-[9px] font-semibold text-slate-500 uppercase tracking-wider">Kekurangan</p>
            <p className="text-xs font-bold text-slate-300 mt-0.5 truncate">
              {formatCurrency(remaining)}
            </p>
          </div>
          <div className="text-right shrink-0">
            <p className="text-[9px] font-semibold text-slate-500 uppercase tracking-wider">Tenggat</p>
            <p className="text-xs font-bold text-slate-300 mt-0.5">
              {formatDate(goal.target_date)}
            </p>
            {daysLeft > 0 ? (
              <p className="text-[9px] font-bold text-teal-400 mt-0.5">
                {daysLeft} hari lagi
              </p>
            ) : (
              <p className="text-[9px] font-bold text-rose-400 mt-0.5">
                Terlambat
              </p>
            )}
          </div>
        </div>

        {/* Deposit/Tabung Form */}
        {progress < 100 && (
          <form onSubmit={handleDeposit} className="mt-4 pt-3 border-t border-slate-850 flex gap-2">
            <div className="relative flex-1">
              <input
                type="number"
                placeholder="Tambah tabungan (Rp)..."
                value={depositAmount}
                onChange={(e) => setDepositAmount(e.target.value)}
                className="w-full px-3 py-2 bg-slate-950/80 border border-slate-800/80 rounded-xl text-xs text-white placeholder-slate-500 focus:outline-none focus:border-teal-500/50 transition-colors font-medium"
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
              className="px-4 py-2 bg-gradient-to-r from-teal-500 to-cyan-500 hover:from-teal-600 hover:to-cyan-600 disabled:from-slate-800 disabled:to-slate-800 text-white rounded-xl text-xs font-bold transition-all shadow-md shadow-teal-500/5 hover:shadow-teal-500/10 shrink-0 flex items-center justify-center min-w-[70px]"
            >
              {isSubmitting ? (
                <svg className="animate-spin h-3 w-3 text-white" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                </svg>
              ) : (
                'Tabung'
              )}
            </button>
          </form>
        )}

        {/* Milestone Message */}
        {progress >= 100 && (
          <div className="bg-emerald-500/10 border border-emerald-500/20 rounded-xl p-2">
            <p className="text-[10px] text-emerald-400 font-bold text-center">
              🎉 Target Tercapai! Selamat!
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default GoalProgress;
