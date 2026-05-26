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
          <div className="text-4xl mb-4 p-4 bg-slate-950/80 rounded-2xl border border-slate-800">🎯</div>
          <h3 className="text-lg font-bold text-white mb-1">
            Belum Ada Target Tabungan
          </h3>
          <p className="text-slate-400 text-sm max-w-xs">
            Mulailah merencanakan masa depan keuangan Anda dengan membuat target tabungan pertama.
          </p>
        </div>
      )}
    </div>
  );
}
