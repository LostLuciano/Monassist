import { SavingsGoal } from '../../types';
import GoalProgress from './GoalProgress';

interface GoalsListProps {
  goals: SavingsGoal[];
  onEdit: (goal: SavingsGoal) => void;
  onDelete: (id: number) => void;
}

export default function GoalsList({ goals, onEdit, onDelete }: GoalsListProps) {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      {goals.length > 0 ? (
        goals.map((goal) => (
          <GoalProgress
            key={goal.id}
            goal={goal}
            onEdit={onEdit}
            onDelete={onDelete}
          />
        ))
      ) : (
        <div className="col-span-full py-12 flex flex-col items-center justify-center text-center">
          <div className="w-14 h-14 mb-4 bg-slate-950/80 rounded-2xl border border-slate-800 flex items-center justify-center text-teal-400">
            <svg className="w-7 h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
          <h3 className="text-base font-bold text-white mb-1">
            Belum Ada Target Tabungan
          </h3>
          <p className="text-slate-400 text-xs max-w-xs leading-relaxed">
            Rencanakan target tabungan dan masa depan finansial Anda sekarang.
          </p>
        </div>
      )}
    </div>
  );
}
