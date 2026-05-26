import { useEffect, useState } from 'react';

export default function InstallPrompt() {
  const [installPrompt, setInstallPrompt] = useState<any>(null);
  const [showPrompt, setShowPrompt] = useState(false);

  useEffect(() => {
    const handler = (e: Event) => {
      e.preventDefault();
      setInstallPrompt(e);
      setShowPrompt(true);
    };

    window.addEventListener('beforeinstallprompt', handler);
    return () => window.removeEventListener('beforeinstallprompt', handler);
  }, []);

  const handleInstall = async () => {
    if (installPrompt) {
      installPrompt.prompt();
      const { outcome } = await installPrompt.userChoice;
      console.log(`User response: ${outcome}`);
      setInstallPrompt(null);
      setShowPrompt(false);
    }
  };

  if (!showPrompt) return null;

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-slate-950/40 backdrop-blur-sm animate-fade-in">
      <div className="bg-slate-900/75 border border-slate-800/80 backdrop-blur-xl p-6 rounded-2xl shadow-2xl max-w-sm w-full text-center text-white relative">
        {/* Glow Effects */}
        <div className="absolute -top-12 -left-12 w-24 h-24 bg-teal-500/20 rounded-full blur-2xl pointer-events-none" />
        <div className="absolute -bottom-12 -right-12 w-24 h-24 bg-cyan-500/20 rounded-full blur-2xl pointer-events-none" />

        {/* Brand/Icon */}
        <div className="mx-auto w-12 h-12 bg-gradient-to-br from-teal-400 to-cyan-500 rounded-xl flex items-center justify-center mb-4 shadow-lg shadow-teal-500/20">
          <span className="text-white font-extrabold text-xl">M</span>
        </div>

        <h3 className="font-extrabold text-xl bg-gradient-to-r from-white to-slate-200 bg-clip-text text-transparent mb-1">
          Install MoneyAssist
        </h3>
        <p className="text-slate-400 text-sm mb-6">
          Dapatkan akses instan dan aman ke pengelolaan keuangan cerdas Anda langsung dari layar utama.
        </p>
        
        <div className="flex gap-3">
          <button 
            onClick={handleInstall} 
            className="flex-1 bg-gradient-to-r from-teal-500 to-cyan-500 hover:from-teal-400 hover:to-cyan-400 text-white font-semibold py-3 px-4 rounded-xl transition-all duration-300 transform active:scale-95 text-sm shadow-lg shadow-teal-500/10"
          >
            Pasang Aplikasi
          </button>
          <button 
            onClick={() => setShowPrompt(false)} 
            className="flex-1 bg-slate-800/40 hover:bg-slate-800/80 border border-slate-700/60 text-slate-300 font-semibold py-3 px-4 rounded-xl transition-all text-sm"
          >
            Nanti Saja
          </button>
        </div>
      </div>
    </div>
  );
}
