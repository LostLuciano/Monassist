import React, { useState } from 'react';
import AuthenticatedLayout from '../components/common/AuthenticatedLayout';
import ProfileForm from '../components/profile/ProfileForm';
import SettingsForm from '../components/profile/SettingsForm';
import IPhoneShortcutCard from '../components/profile/IPhoneShortcutCard';

const ProfilePage: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'profile' | 'settings' | 'shortcuts'>('settings');

  return (
    <AuthenticatedLayout pageTitle="Pengaturan">
      <div className="space-y-6 md:space-y-8 max-w-4xl mx-auto">
        <div>
          <h1 className="text-2xl md:text-3xl font-extrabold text-white tracking-tight">
            Pengaturan Akun & Pintasan
          </h1>
          <p className="text-slate-400 text-xs md:text-sm mt-1">
            Kelola profil, integrasi Telegram, dan konfigurasi Pintasan iPhone.
          </p>
        </div>

        {/* Navigation Tabs */}
        <div className="bg-slate-900/60 border border-slate-800/80 backdrop-blur-xl rounded-2xl p-1.5 flex gap-1 max-w-md">
          <button
            onClick={() => setActiveTab('settings')}
            className={`flex-1 py-2.5 px-3 rounded-xl text-xs font-bold transition-all ${
              activeTab === 'settings'
                ? 'bg-gradient-to-r from-teal-500 to-cyan-500 text-white shadow-md shadow-teal-500/10'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            Setelan
          </button>
          <button
            onClick={() => setActiveTab('shortcuts')}
            className={`flex-1 py-2.5 px-3 rounded-xl text-xs font-bold transition-all ${
              activeTab === 'shortcuts'
                ? 'bg-gradient-to-r from-teal-500 to-cyan-500 text-white shadow-md shadow-teal-500/10'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            Pintasan iPhone
          </button>
          <button
            onClick={() => setActiveTab('profile')}
            className={`flex-1 py-2.5 px-3 rounded-xl text-xs font-bold transition-all ${
              activeTab === 'profile'
                ? 'bg-gradient-to-r from-teal-500 to-cyan-500 text-white shadow-md shadow-teal-500/10'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            Profil
          </button>
        </div>

        {/* Tab Content */}
        <div className="mt-6 animate-fadeIn">
          {activeTab === 'settings' && <SettingsForm />}
          {activeTab === 'shortcuts' && <IPhoneShortcutCard />}
          {activeTab === 'profile' && <ProfileForm />}
        </div>
      </div>
    </AuthenticatedLayout>
  );
};

export default ProfilePage;
