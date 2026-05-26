import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { updateUserProfile } from '../../store/authSlice';
import { RootState, AppDispatch } from '../../store/store';

const ProfileForm: React.FC = () => {
  const dispatch = useDispatch<AppDispatch>();
  const { user } = useSelector((state: RootState) => state.auth);
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    currency: 'USD',
    language: 'en'
  });
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  useEffect(() => {
    if (user) {
      setFormData({
        name: user.name || '',
        email: user.email || '',
        phone: user.phone || '',
        currency: user.currency || 'USD',
        language: user.language || 'en'
      });
    }
  }, [user]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setMessage(null);

    try {
      await dispatch(updateUserProfile(formData)).unwrap();
      setMessage({ type: 'success', text: 'Profil Anda berhasil diperbarui!' });
      setIsEditing(false);
    } catch (error: any) {
      setMessage({ type: 'error', text: error || 'Gagal memperbarui profil' });
    }
  };

  return (
    <div className="bg-slate-900/40 border border-slate-800/80 backdrop-blur-xl rounded-3xl p-6 md:p-8">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-lg font-bold text-white flex items-center gap-2">
          <span className="w-1.5 h-4 bg-teal-500 rounded-full"></span>
          Informasi Profil
        </h2>
        {!isEditing && (
          <button
            onClick={() => setIsEditing(true)}
            className="px-4 py-2 bg-slate-850 hover:bg-slate-800 text-teal-400 border border-slate-800/80 hover:border-teal-500/20 rounded-xl transition-all flex items-center gap-2 text-xs font-semibold"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
            </svg>
            Ubah Profil
          </button>
        )}
      </div>

      {message && (
        <div className={`mb-6 p-4 rounded-xl text-xs font-semibold border ${
          message.type === 'success' 
            ? 'bg-teal-500/10 border-teal-500/20 text-teal-400' 
            : 'bg-rose-500/10 border-rose-500/20 text-rose-400'
        }`}>
          {message.text}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">
              Nama Lengkap
            </label>
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleChange}
              disabled={!isEditing}
              required
              className="w-full px-4 py-3 bg-slate-950 border border-slate-850 rounded-xl focus:outline-none focus:border-teal-500 text-white disabled:opacity-50 disabled:cursor-not-allowed text-sm transition-all"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">
              Alamat Email
            </label>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              disabled={!isEditing}
              required
              className="w-full px-4 py-3 bg-slate-950 border border-slate-850 rounded-xl focus:outline-none focus:border-teal-500 text-white disabled:opacity-50 disabled:cursor-not-allowed text-sm transition-all"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">
              Nomor Telepon
            </label>
            <input
              type="tel"
              name="phone"
              value={formData.phone}
              onChange={handleChange}
              disabled={!isEditing}
              placeholder="08123456789"
              className="w-full px-4 py-3 bg-slate-950 border border-slate-850 rounded-xl focus:outline-none focus:border-teal-500 text-white disabled:opacity-50 disabled:cursor-not-allowed text-sm transition-all"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">
              Mata Uang
            </label>
            <select
              name="currency"
              value={formData.currency}
              onChange={handleChange}
              disabled={!isEditing}
              className="w-full px-4 py-3 bg-slate-950 border border-slate-850 rounded-xl focus:outline-none focus:border-teal-500 text-white disabled:opacity-50 disabled:cursor-not-allowed text-sm transition-all"
            >
              <option value="USD">USD - US Dollar</option>
              <option value="EUR">EUR - Euro</option>
              <option value="GBP">GBP - British Pound</option>
              <option value="IDR">IDR - Indonesian Rupiah</option>
              <option value="SGD">SGD - Singapore Dollar</option>
              <option value="MYR">MYR - Malaysian Ringgit</option>
            </select>
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">
              Bahasa
            </label>
            <select
              name="language"
              value={formData.language}
              onChange={handleChange}
              disabled={!isEditing}
              className="w-full px-4 py-3 bg-slate-950 border border-slate-850 rounded-xl focus:outline-none focus:border-teal-500 text-white disabled:opacity-50 disabled:cursor-not-allowed text-sm transition-all"
            >
              <option value="en">English</option>
              <option value="id">Bahasa Indonesia</option>
              <option value="es">Español</option>
              <option value="fr">Français</option>
            </select>
          </div>
        </div>

        {isEditing && (
          <div className="flex gap-3 pt-4">
            <button
              type="button"
              onClick={() => {
                setIsEditing(false);
                setMessage(null);
                if (user) {
                  setFormData({
                    name: user.name || '',
                    email: user.email || '',
                    phone: user.phone || '',
                    currency: user.currency || 'USD',
                    language: user.language || 'en'
                  });
                }
              }}
              className="flex-1 py-3 bg-slate-800 hover:bg-slate-700/80 text-white rounded-xl font-semibold transition-colors text-sm"
            >
              Batal
            </button>
            <button
              type="submit"
              className="flex-1 py-3 bg-gradient-to-r from-teal-500 to-cyan-500 text-white rounded-xl font-bold transition-all text-sm shadow-lg shadow-teal-500/10"
            >
              Simpan Perubahan
            </button>
          </div>
        )}
      </form>
    </div>
  );
};

export default ProfileForm;
