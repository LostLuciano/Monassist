import React, { useState, useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { addGoal, updateGoal } from '../../store/goalSlice';
import { SavingsGoal } from '../../types';
import { AppDispatch } from '../../store/store';

interface GoalFormProps {
  goal?: SavingsGoal;
  onClose: () => void;
}

const GoalForm: React.FC<GoalFormProps> = ({ goal, onClose }) => {
  const dispatch = useDispatch<AppDispatch>();
  const [formData, setFormData] = useState({
    name: '',
    target_amount: '',
    current_amount: '',
    target_date: '',
    category: 'savings',
    description: '',
    priority: 'medium' as 'low' | 'medium' | 'high'
  });

  useEffect(() => {
    if (goal) {
      setFormData({
        name: goal.name,
        target_amount: goal.target_amount.toString(),
        current_amount: goal.current_amount.toString(),
        target_date: goal.target_date ? goal.target_date.split('T')[0] : '',
        category: goal.category || 'savings',
        description: goal.description || '',
        priority: goal.priority || 'medium'
      });
    }
  }, [goal]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    const goalData = {
      name: formData.name,
      target_amount: parseFloat(formData.target_amount) || 0,
      current_amount: parseFloat(formData.current_amount) || 0,
      target_date: formData.target_date,
      category: formData.category,
      description: formData.description,
      priority: formData.priority,
      status: (goal ? goal.status : 'active') as 'active' | 'completed' | 'abandoned'
    };

    try {
      if (goal) {
        await dispatch(updateGoal({ id: goal.id, ...goalData })).unwrap();
      } else {
        await dispatch(addGoal(goalData as any)).unwrap();
      }
      onClose();
    } catch (error) {
      console.error('Failed to save goal:', error);
    }
  };

  return (
    <div className="fixed inset-0 bg-slate-950/85 backdrop-blur-md flex items-center justify-center z-50 p-4">
      <div className="bg-slate-900 border border-slate-800/80 rounded-3xl shadow-2xl max-w-md w-full max-h-[85vh] sm:max-h-[90vh] overflow-y-auto">
        <div className="p-5 sm:p-7 md:p-8">
          <div className="flex justify-between items-center mb-5">
            <h2 className="text-lg font-bold text-white">
              {goal ? 'Edit Target Tabungan' : 'Buat Target Baru'}
            </h2>
            <button
              onClick={onClose}
              className="text-slate-400 hover:text-white transition-colors p-1.5 bg-slate-800/50 hover:bg-slate-800 rounded-lg"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1.5">
                Nama Target
              </label>
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleChange}
                required
                placeholder="misal: Tabungan Laptop Baru"
                className="w-full px-4 py-2.5 bg-slate-950 border border-slate-800 rounded-xl focus:outline-none focus:border-teal-500 text-white placeholder-slate-650 text-sm transition-colors"
              />
            </div>

            <div className="grid grid-cols-2 gap-3.5">
              <div>
                <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1.5">
                  Kategori
                </label>
                <select
                  name="category"
                  value={formData.category}
                  onChange={handleChange}
                  className="w-full px-3 py-2.5 bg-slate-950 border border-slate-800 rounded-xl focus:outline-none focus:border-teal-500 text-white text-xs transition-colors"
                >
                  <option value="savings">Tabungan</option>
                  <option value="investment">Investasi</option>
                  <option value="emergency">Dana Darurat</option>
                  <option value="vacation">Liburan</option>
                  <option value="education">Pendidikan</option>
                  <option value="other">Lainnya</option>
                </select>
              </div>

              <div>
                <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1.5">
                  Prioritas
                </label>
                <select
                  name="priority"
                  value={formData.priority}
                  onChange={handleChange}
                  className="w-full px-3 py-2.5 bg-slate-950 border border-slate-800 rounded-xl focus:outline-none focus:border-teal-500 text-white text-xs transition-colors"
                >
                  <option value="low">Rendah</option>
                  <option value="medium">Sedang</option>
                  <option value="high">Tinggi</option>
                </select>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3.5">
              <div>
                <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1.5">
                  Target Jumlah (Rp)
                </label>
                <input
                  type="number"
                  name="target_amount"
                  value={formData.target_amount}
                  onChange={handleChange}
                  required
                  min="0"
                  placeholder="0"
                  className="w-full px-4 py-2.5 bg-slate-950 border border-slate-800 rounded-xl focus:outline-none focus:border-teal-500 text-white placeholder-slate-650 text-sm transition-colors"
                />
              </div>

              <div>
                <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1.5">
                  Saldo Saat Ini (Rp)
                </label>
                <input
                  type="number"
                  name="current_amount"
                  value={formData.current_amount}
                  onChange={handleChange}
                  required
                  min="0"
                  placeholder="0"
                  className="w-full px-4 py-2.5 bg-slate-950 border border-slate-800 rounded-xl focus:outline-none focus:border-teal-500 text-white placeholder-slate-650 text-sm transition-colors"
                />
              </div>
            </div>

            <div>
              <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1.5">
                Tenggat Waktu
              </label>
              <input
                type="date"
                name="target_date"
                value={formData.target_date}
                onChange={handleChange}
                required
                className="w-full px-4 py-2.5 bg-slate-950 border border-slate-800 rounded-xl focus:outline-none focus:border-teal-500 text-white text-sm transition-colors"
              />
            </div>

            <div>
              <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1.5">
                Deskripsi (Opsional)
              </label>
              <textarea
                name="description"
                value={formData.description}
                onChange={handleChange}
                rows={3}
                placeholder="Catatan tambahan mengenai target ini..."
                className="w-full px-4 py-2.5 bg-slate-950 border border-slate-800 rounded-xl focus:outline-none focus:border-teal-500 text-white placeholder-slate-650 text-xs transition-colors resize-none"
              />
            </div>

            <div className="flex gap-3 pt-4 border-t border-slate-850">
              <button
                type="button"
                onClick={onClose}
                className="flex-1 py-3 bg-slate-800 hover:bg-slate-700/80 text-white rounded-xl font-semibold transition-colors text-sm"
              >
                Batal
              </button>
              <button
                type="submit"
                className="flex-1 py-3 bg-gradient-to-r from-teal-500 to-cyan-500 text-white rounded-xl font-bold transition-all text-sm shadow-lg shadow-teal-500/10"
              >
                {goal ? 'Simpan' : 'Buat Target'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default GoalForm;
