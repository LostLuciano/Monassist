import React, { useState } from 'react';
import AuthenticatedLayout from '../components/common/AuthenticatedLayout';
import ProfileForm from '../components/profile/ProfileForm';
import SettingsForm from '../components/profile/SettingsForm';

const ProfilePage: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'profile' | 'settings'>('profile');

  return (
    <AuthenticatedLayout pageTitle="Pengaturan">
      <div className="space-y-8">
        <div>
          <h1 className="text-2xl md:text-3xl font-extrabold text-white tracking-tight">
            Pengaturan Akun
          </h1>
          <p className="text-slate-400 text-xs md:text-sm mt-1">
            Kelola profil Anda dan atur preferensi pengingat/notifikasi.
          </p>
        </div>

        {/* Tabs */}
        <div className="bg-slate-900/40 border border-slate-800/80 backdrop-blur-xl rounded-2xl p-1.5 flex gap-1 max-w-xs">
          <button
            onClick={() => setActiveTab('profile')}
            className={`flex-1 py-2.5 px-4 rounded-xl text-xs font-bold transition-all ${
              activeTab === 'profile'
                ? 'bg-gradient-to-r from-teal-500 to-cyan-500 text-white shadow-lg shadow-teal-500/10'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            Profil
          </button>
          <button
            onClick={() => setActiveTab('settings')}
            className={`flex-1 py-2.5 px-4 rounded-xl text-xs font-bold transition-all ${
              activeTab === 'settings'
                ? 'bg-gradient-to-r from-teal-500 to-cyan-500 text-white shadow-lg shadow-teal-500/10'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            Setelan
          </button>
        </div>

        {/* Tab Content */}
        <div className="mt-6">
          {activeTab === 'profile' && <ProfileForm />}
          {activeTab === 'settings' && <SettingsForm />}
        </div>
      </div>
    </AuthenticatedLayout>
  );
};

export default ProfilePage;
