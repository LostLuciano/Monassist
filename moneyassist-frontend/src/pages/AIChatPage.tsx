import React, { useState, useRef, useEffect } from 'react';
import { useSelector } from 'react-redux';
import { RootState } from '../store/store';
import AuthenticatedLayout from '../components/common/AuthenticatedLayout';
import chatService, { ChatMessage } from '../services/chatService';

const AIChatPage: React.FC = () => {
  const { user } = useSelector((state: RootState) => state.auth);
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [inputText, setInputText] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    loadChatHistory();
  }, []);

  useEffect(() => {
    scrollToBottom();
  }, [messages, isTyping]);

  const loadChatHistory = async () => {
    try {
      const history = await chatService.getHistory();
      if (history && history.length > 0) {
        setMessages(history);
      } else {
        // Welcome message if history is empty
        setMessages([
          {
            id: '1',
            message: `Halo, ${user?.name || 'User'}! Saya adalah Asisten AI Keuangan MoneyAssist. Saya dapat membantu menganalisis arus kas, memeriksa kondisi anggaran Anda, memberikan strategi tabungan, atau mendeteksi pengeluaran berlebih. Ada yang bisa saya bantu hari ini?`,
            sender: 'ai',
            timestamp: new Date().toISOString()
          }
        ]);
      }
    } catch (error) {
      console.error('Failed to load chat history:', error);
      // Fallback
      setMessages([
        {
          id: '1',
          message: `Halo, ${user?.name || 'User'}! Saya adalah Asisten AI Keuangan MoneyAssist. Ada yang bisa saya bantu hari ini?`,
          sender: 'ai',
          timestamp: new Date().toISOString()
        }
      ]);
    }
  };

  const handleSendMessage = async (text: string) => {
    if (!text.trim()) return;

    const userMsg: ChatMessage = {
      id: Date.now().toString(),
      message: text.trim(),
      sender: 'user',
      timestamp: new Date().toISOString()
    };

    setMessages(prev => [...prev, userMsg]);
    setInputText('');
    setIsTyping(true);

    try {
      const response = await chatService.sendMessage(text.trim());
      const aiMsg: ChatMessage = {
        id: (Date.now() + 1).toString(),
        message: response.message || 'Maaf, saya tidak dapat memproses permintaan Anda saat ini.',
        sender: 'ai',
        timestamp: new Date().toISOString()
      };
      setMessages(prev => [...prev, aiMsg]);
    } catch (error) {
      console.error('Failed to send message:', error);
      const aiMsg: ChatMessage = {
        id: (Date.now() + 1).toString(),
        message: 'Maaf, saya tidak dapat menghubungi server asisten keuangan AI saat ini. Silakan periksa koneksi internet Anda atau coba lagi beberapa saat lagi.',
        sender: 'ai',
        timestamp: new Date().toISOString()
      };
      setMessages(prev => [...prev, aiMsg]);
    } finally {
      setIsTyping(false);
    }
  };

  const handleQuickQuestion = (question: string) => {
    handleSendMessage(question);
  };

  const handleClearChat = async () => {
    if (window.confirm('Apakah Anda yakin ingin menghapus semua riwayat percakapan?')) {
      try {
        await chatService.clearHistory();
        setMessages([
          {
            id: '1',
            message: `Riwayat obrolan telah dibersihkan. Halo, ${user?.name || 'User'}! Ada yang bisa saya bantu sekarang?`,
            sender: 'ai',
            timestamp: new Date().toISOString()
          }
        ]);
      } catch (error) {
        console.error('Failed to clear history:', error);
      }
    }
  };

  const quickQuestions = [
    'Bagaimana kondisi keuangan saya?',
    'Tips berhemat minggu ini?',
    'Bagaimana cara menabung efektif?'
  ];

  return (
    <AuthenticatedLayout pageTitle="Asisten AI Chat">
      <div className="max-w-4xl mx-auto flex flex-col h-[calc(100vh-12rem)] md:h-[calc(100vh-14rem)] bg-slate-900/40 border border-slate-800/80 backdrop-blur-xl rounded-3xl overflow-hidden relative">
        
        {/* Chat Header */}
        <div className="bg-slate-950/60 border-b border-slate-850 px-6 py-4 flex items-center justify-between z-10 shrink-0">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-gradient-to-br from-teal-400 to-cyan-500 rounded-2xl flex items-center justify-center shadow-lg shadow-teal-500/25 border border-teal-400/20">
              <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
              </svg>
            </div>
            <div>
              <h2 className="text-sm font-bold text-white leading-tight">MoneyAssist AI Assistant</h2>
              <div className="flex items-center gap-1.5 mt-0.5">
                <span className="w-1.5 h-1.5 bg-emerald-500 rounded-full animate-pulse"></span>
                <p className="text-[10px] text-emerald-400 font-bold uppercase tracking-wider">Aktif & Siap Membantu</p>
              </div>
            </div>
          </div>
          
          <button 
            onClick={handleClearChat}
            className="text-xs font-semibold text-slate-400 hover:text-rose-400 px-3 py-1.5 bg-slate-950/60 border border-slate-850 hover:border-rose-500/20 rounded-xl transition-all"
            title="Hapus Percakapan"
          >
            Bersihkan
          </button>
        </div>

        {/* Message Panel */}
        <div className="flex-1 overflow-y-auto p-4 md:p-6 space-y-4">
          {messages.map((msg) => (
            <div
              key={msg.id}
              className={`flex gap-3 max-w-[85%] sm:max-w-[75%] ${
                msg.sender === 'user' ? 'ml-auto flex-row-reverse' : 'mr-auto'
              }`}
            >
              {/* Profile letter / logo */}
              <div className={`w-8 h-8 rounded-xl flex items-center justify-center text-xs font-bold shrink-0 border border-slate-850 shadow-sm ${
                msg.sender === 'user'
                  ? 'bg-slate-800 text-white'
                  : 'bg-gradient-to-br from-teal-500 to-cyan-500 text-white'
              }`}>
                {msg.sender === 'user' ? (user?.name?.charAt(0).toUpperCase() || 'U') : 'AI'}
              </div>

              {/* Bubble text */}
              <div className={`rounded-2xl p-3.5 text-xs md:text-sm font-medium leading-relaxed ${
                msg.sender === 'user'
                  ? 'bg-gradient-to-br from-teal-500/15 to-cyan-500/15 border border-teal-500/20 text-teal-300'
                  : 'bg-slate-950/80 border border-slate-850 text-slate-200'
              }`}>
                {msg.message.split('\n').map((line, idx) => (
                  <p key={idx} className={idx > 0 ? 'mt-1' : ''}>{line}</p>
                ))}
                <span className="block text-[9px] text-slate-500 text-right mt-1.5 font-semibold">
                  {new Date(msg.timestamp).toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' })}
                </span>
              </div>
            </div>
          ))}

          {isTyping && (
            <div className="flex gap-3 mr-auto max-w-[75%]">
              <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-teal-500 to-cyan-500 text-white flex items-center justify-center text-xs font-bold border border-slate-850">
                AI
              </div>
              <div className="bg-slate-950/80 border border-slate-850 rounded-2xl p-4 flex items-center gap-1">
                <span className="w-1.5 h-1.5 bg-slate-400 rounded-full animate-bounce" style={{ animationDelay: '0ms' }}></span>
                <span className="w-1.5 h-1.5 bg-slate-400 rounded-full animate-bounce" style={{ animationDelay: '150ms' }}></span>
                <span className="w-1.5 h-1.5 bg-slate-400 rounded-full animate-bounce" style={{ animationDelay: '300ms' }}></span>
              </div>
            </div>
          )}
          <div ref={messagesEndRef} />
        </div>

        {/* Quick Suggestion Chips */}
        {messages.length < 3 && (
          <div className="px-4 py-3 bg-slate-950/20 border-t border-slate-850/60 z-10 shrink-0 flex flex-wrap gap-2 items-center justify-center">
            {quickQuestions.map((q, idx) => (
              <button
                key={idx}
                onClick={() => handleQuickQuestion(q)}
                className="text-[11px] font-semibold text-slate-300 hover:text-white px-3 py-1.5 bg-slate-950/60 border border-slate-800 hover:border-teal-500/20 rounded-xl transition-all"
              >
                {q}
              </button>
            ))}
          </div>
        )}

        {/* Input Panel */}
        <div className="bg-slate-950/40 border-t border-slate-850 px-4 py-3 md:px-6 md:py-4 z-10 shrink-0">
          <form
            onSubmit={(e) => {
              e.preventDefault();
              handleSendMessage(inputText);
            }}
            className="flex gap-2.5 items-center"
          >
            <input
              type="text"
              value={inputText}
              onChange={(e) => setInputText(e.target.value)}
              placeholder="Tanyakan analisis keuangan Anda..."
              className="flex-1 px-4 py-3 bg-slate-950 border border-slate-800 rounded-2xl focus:outline-none focus:border-teal-500 text-white placeholder-slate-600 text-sm transition-colors"
            />
            <button
              type="submit"
              disabled={!inputText.trim()}
              className="p-3 bg-gradient-to-r from-teal-500 to-cyan-500 hover:from-teal-600 hover:to-cyan-600 disabled:opacity-40 disabled:pointer-events-none text-white rounded-2xl transition-all shadow-md shadow-teal-500/10 flex items-center justify-center shrink-0"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M14 5l7 7m0 0l-7 7m7-7H3" />
              </svg>
            </button>
          </form>
        </div>

      </div>
    </AuthenticatedLayout>
  );
};

export default AIChatPage;
