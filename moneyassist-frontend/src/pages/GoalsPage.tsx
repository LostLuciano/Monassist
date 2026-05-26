import React, { useState } from 'react';
import AuthenticatedLayout from '../components/common/AuthenticatedLayout';
import GoalsList from '../components/goals/GoalsList';
import GoalForm from '../components/goals/GoalForm';
import { useGoals } from '../hooks/useGoals';
import { SavingsGoal } from '../types';
import { formatCurrency } from '../utils/formatters';

const GoalsPage: React.FC = () => {
  const [showForm, setShowForm] = useState(false);
  const [editingGoal, setEditingGoal] = useState<SavingsGoal | undefined>(undefined);
  const { goals, removeGoal, getOverallProgress, getTotalTargetAmount, getTotalCurrentAmount } = useGoals();

  const handleEdit = (goal: SavingsGoal) => {
    setEditingGoal(goal);
    setShowForm(true);
  };

  const handleDelete = async (id: number) => {
    if (window.confirm('Apakah Anda yakin ingin menghapus target tabungan ini?')) {
      try {
        await removeGoal(id);
      } catch (error) {
        console.error('Failed to delete goal:', error);
      }
    }
  };

  const handleCloseForm = () => {
    setShowForm(false);
    setEditingGoal(undefined);
  };

  return (
    <AuthenticatedLayout pageTitle="Target Tabungan">
      <div className="space-y-6 md:space-y-8">
        
        {/* Header Section */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h1 className="text-2xl md:text-3xl font-extrabold text-white tracking-tight">
              Target Tabungan
            </h1>
            <p className="text-slate-400 text-xs md:text-sm mt-1">
              Rencanakan dan pantau perkembangan target keuangan masa depan Anda.
            </p>
          </div>
          <button
            onClick={() => {
              setEditingGoal(undefined);
              setShowForm(true);
            }}
            className="px-5 py-3 bg-gradient-to-r from-teal-500 to-cyan-500 hover:from-teal-600 hover:to-cyan-600 text-white rounded-xl transition-all font-bold text-sm shadow-lg shadow-teal-500/10 flex items-center gap-2 self-start w-full sm:w-auto justify-center"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
            </svg>
            Tambah Target
          </button>
        </div>

        {/* Overall Progress Bento Card */}
        <div className="bg-slate-900/40 border border-slate-800/80 backdrop-blur-xl rounded-3xl p-4 sm:p-6 md:p-8">
          <h2 className="text-sm md:text-base font-bold text-white mb-4 md:mb-6 flex items-center gap-2">
            <span className="w-1.5 h-4 bg-teal-500 rounded-full"></span>
            Total Kemajuan Seluruh Target
          </h2>
          
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 md:gap-6 mb-6">
            <div className="bg-slate-950/60 border border-slate-900 rounded-2xl p-4">
              <p className="text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-1">Total Sasaran</p>
              <p className="text-lg md:text-xl font-extrabold text-slate-300">
                {formatCurrency(getTotalTargetAmount())}
              </p>
            </div>
            <div className="bg-slate-950/60 border border-slate-900 rounded-2xl p-4">
              <p className="text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-1">Total Tabungan</p>
              <p className="text-lg md:text-xl font-extrabold text-teal-400">
                {formatCurrency(getTotalCurrentAmount())}
              </p>
            </div>
            <div className="bg-slate-950/60 border border-slate-900 rounded-2xl p-4">
              <p className="text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-1">Persentase Rata-rata</p>
              <p className="text-lg md:text-xl font-extrabold text-cyan-400">
                {getOverallProgress().toFixed(1)}%
              </p>
            </div>
          </div>

          <div className="space-y-2">
            <div className="w-full bg-slate-950 rounded-full h-3 border border-slate-900 overflow-hidden">
              <div
                className="bg-gradient-to-r from-teal-400 to-cyan-400 h-3 rounded-full transition-all duration-500 shadow-lg shadow-teal-500/10"
                style={{ width: `${Math.min(getOverallProgress(), 100)}%` }}
              />
            </div>
          </div>
        </div>

        {/* Goals List Widget */}
        <div className="bg-slate-900/40 border border-slate-800/80 backdrop-blur-xl rounded-3xl p-4 sm:p-6 md:p-8">
          <GoalsList 
            goals={goals}
            onEdit={handleEdit}
            onDelete={handleDelete}
          />
        </div>

        {/* Modal Goal Form */}
        {showForm && (
          <GoalForm goal={editingGoal} onClose={handleCloseForm} />
        )}

      </div>
    </AuthenticatedLayout>
  );
};

export default GoalsPage;
