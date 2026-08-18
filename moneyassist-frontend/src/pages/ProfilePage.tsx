import React, { useState } from 'react';
import AuthenticatedLayout from '../components/common/AuthenticatedLayout';
import ProfileForm from '../components/profile/ProfileForm';
import SettingsForm from '../components/profile/SettingsForm';
import IPhoneShortcutCard from '../components/profile/IPhoneShortcutCard';

const ProfilePage: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'profile' | 'settings' | 'shortcuts'>('settings');
  const tabs = [
    { id: 'settings', label: 'Telegram' },
    { id: 'shortcuts', label: 'Pintasan' },
    { id: 'profile', label: 'Profil' }
  ] as const;

  return (
    <AuthenticatedLayout pageTitle="Akun">
      <div className="space-y-4 md:space-y-8 max-w-4xl mx-auto">
        <div className="hidden md:block">
          <h1 className="text-xl md:text-3xl font-extrabold text-white tracking-tight">
            Akun
          </h1>
          <p className="text-slate-400 text-xs md:text-sm mt-1 leading-relaxed">
            Hubungkan Telegram, pasang pintasan iPhone, dan kelola profil.
          </p>
        </div>

        <div className="bg-slate-900/70 border border-slate-800/80 backdrop-blur-xl rounded-2xl p-1 flex gap-1 w-full md:max-w-md">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex-1 min-h-10 px-3 rounded-xl text-xs font-bold transition-all ${
                activeTab === tab.id
                  ? 'bg-teal-500 text-slate-950 shadow-md shadow-teal-500/10'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        <div className="animate-fadeIn">
          {activeTab === 'settings' && <SettingsForm onGoToShortcuts={() => setActiveTab('shortcuts')} />}
          {activeTab === 'shortcuts' && <IPhoneShortcutCard onGoToSettings={() => setActiveTab('settings')} />}
          {activeTab === 'profile' && <ProfileForm />}
        </div>
      </div>
    </AuthenticatedLayout>
  );
};

export default ProfilePage;
