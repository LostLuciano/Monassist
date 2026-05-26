import React, { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

interface Message {
  id: string;
  text: string;
  sender: 'user' | 'ai';
  timestamp: Date;
}

const AIChat: React.FC = () => {
  const navigate = useNavigate();
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      text: 'Halo! Saya adalah asisten keuangan AI Anda. Saya dapat membantu memeriksa apakah keuangan Anda sehat, boros, atau dalam bahaya. Silakan masuk terlebih dahulu agar saya dapat menganalisis pemasukan, pengeluaran, dan target tabungan Anda secara lengkap.',
      sender: 'ai',
      timestamp: new Date()
    }
  ]);
  const [inputText, setInputText] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const quickQuestions = [
    'Bagaimana kondisi finansial saya saat ini?',
    'Bagaimana cara membuat target tabungan?',
    'Di kategori mana saya paling boros?',
    'Tips mengelola anggaran bulanan?'
  ];

  const handleSendMessage = (text: string) => {
    if (!text.trim()) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      text: text.trim(),
      sender: 'user',
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMessage]);
    setInputText('');
    setIsTyping(true);

    // Simulate AI response
    setTimeout(() => {
      const aiResponse = getAIResponse(text.toLowerCase());
      const aiMessage: Message = {
        id: (Date.now() + 1).toString(),
        text: aiResponse,
        sender: 'ai',
        timestamp: new Date()
      };
      setMessages(prev => [...prev, aiMessage]);
      setIsTyping(false);
    }, 1200);
  };

  const getAIResponse = (userText: string): string => {
    if (userText.includes('kondisi') || userText.includes('keuangan') || userText.includes('finansial') || userText.includes('sehat')) {
      return 'Untuk memberikan analisis kesehatan finansial yang akurat, saya membutuhkan akses ke data transaksi Anda. Silakan Login atau Daftar terlebih dahulu agar saya dapat menganalisis rasio pemasukan vs pengeluaran Anda.';
    }
    if (userText.includes('tabungan') || userText.includes('target') || userText.includes('buat')) {
      return 'Bagus sekali! Membuat target tabungan adalah langkah awal yang cerdas. Setelah Anda Login, saya dapat membantu membuat rekomendasi nominal tabungan realistis berdasarkan kebiasaan Anda.';
    }
    if (userText.includes('boros') || userText.includes('kategori') || userText.includes('pengeluaran')) {
      return 'Saya bisa mengidentifikasi pengeluaran yang tidak perlu. Masuk ke akun Anda untuk melihat diagram breakdown pengeluaran per kategori secara visual dan mendapatkan taktik berhemat.';
    }
    if (userText.includes('tips') || userText.includes('kelola') || userText.includes('anggaran')) {
      return 'Saya dapat membantu mengelola keuangan dengan fitur: pelacakan transaksi otomatis, perencanaan anggaran bulanan, target tabungan, dan peringatan batas belanja. Silakan Login untuk menikmati fitur lengkap ini!';
    }
    return 'Pertanyaan yang bagus! Untuk memberikan saran finansial yang personal dan terarah, silakan masuk ke akun MoneyAssist Anda. Saya akan menganalisis data keuangan Anda secara aman.';
  };

  const handleQuickQuestion = (question: string) => {
    handleSendMessage(question);
  };

  return (
    <div className="flex flex-col h-[500px] bg-slate-900/40 border border-slate-800/80 backdrop-blur-xl rounded-2xl overflow-hidden shadow-2xl">
      {/* Chat Header */}
      <div className="bg-slate-950/40 px-6 py-4 border-b border-slate-800/60">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-gradient-to-br from-teal-400 to-cyan-500 rounded-full flex items-center justify-center shadow-lg shadow-teal-500/20">
            <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
            </svg>
          </div>
          <div>
            <h2 className="text-sm font-bold text-white leading-tight">AI Financial Assistant</h2>
            <p className="text-xs text-teal-400 font-medium">Interactive Demo</p>
          </div>
        </div>
      </div>

      {/* Messages Container */}
      <div className="flex-1 overflow-y-auto px-5 py-5 space-y-4">
        {messages.map((message) => (
          <div
            key={message.id}
            className={`flex ${message.sender === 'user' ? 'justify-end' : 'justify-start'}`}
          >
            <div
              className={`max-w-[85%] rounded-2xl px-4 py-3 text-sm leading-relaxed ${
                message.sender === 'user'
                  ? 'bg-gradient-to-r from-teal-500 to-cyan-500 text-white shadow-lg shadow-teal-500/10'
                  : 'bg-slate-900/60 border border-slate-800/60 text-slate-200'
              }`}
            >
              <p>{message.text}</p>
              <p
                className={`text-[10px] mt-1.5 text-right ${
                  message.sender === 'user' ? 'text-teal-100/70' : 'text-slate-500'
                }`}
              >
                {message.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
              </p>
            </div>
          </div>
        ))}

        {isTyping && (
          <div className="flex justify-start">
            <div className="bg-slate-900/60 border border-slate-800/60 rounded-2xl px-4 py-3">
              <div className="flex gap-1.5 items-center h-4">
                <div className="w-1.5 h-1.5 bg-teal-400 rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
                <div className="w-1.5 h-1.5 bg-teal-400 rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
                <div className="w-1.5 h-1.5 bg-teal-400 rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
              </div>
            </div>
          </div>
        )}

        <div ref={messagesEndRef} />
      </div>

      {/* Quick Questions */}
      {messages.length <= 2 && (
        <div className="px-5 py-3.5 bg-slate-950/20 border-t border-slate-800/60">
          <p className="text-xs text-slate-400 mb-2.5 font-semibold uppercase tracking-wider">Pertanyaan Populer:</p>
          <div className="flex flex-col gap-1.5">
            {quickQuestions.map((question, index) => (
              <button
                key={index}
                onClick={() => handleQuickQuestion(question)}
                className="text-left px-3.5 py-2 bg-slate-900/40 hover:bg-teal-500/5 border border-slate-800/60 hover:border-teal-500/30 rounded-xl text-xs text-slate-300 hover:text-teal-400 transition-all duration-200"
              >
                {question}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Input Area */}
      <div className="bg-slate-950/40 px-5 py-4 border-t border-slate-800/60 space-y-3">
        <div className="flex gap-2">
          <input
            type="text"
            value={inputText}
            onChange={(e) => setInputText(e.target.value)}
            onKeyPress={(e) => e.key === 'Enter' && handleSendMessage(inputText)}
            placeholder="Ketik pertanyaan finansial Anda..."
            className="flex-1 bg-slate-950/60 border border-slate-800 rounded-xl px-4 py-2.5 text-xs text-white placeholder-slate-500 focus:outline-none focus:ring-1 focus:ring-teal-500 focus:border-teal-500 transition-all"
          />
          <button
            onClick={() => handleSendMessage(inputText)}
            disabled={!inputText.trim()}
            className="px-4 py-2.5 bg-gradient-to-r from-teal-500 to-cyan-500 hover:from-teal-400 hover:to-cyan-400 text-white rounded-xl disabled:opacity-40 disabled:cursor-not-allowed transition-all shadow-lg shadow-teal-500/10 flex items-center justify-center"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
            </svg>
          </button>
        </div>

        {/* CTA Buttons */}
        <div className="flex gap-2.5 pt-1">
          <button
            onClick={() => navigate('/login')}
            className="flex-1 py-2.5 bg-gradient-to-r from-teal-500 to-cyan-500 hover:from-teal-400 hover:to-cyan-400 text-white text-xs font-semibold rounded-xl shadow-lg transition-all duration-300 transform active:scale-95"
          >
            Masuk ke Dashboard
          </button>
          <button
            onClick={() => navigate('/register')}
            className="flex-1 py-2.5 bg-slate-800/40 hover:bg-slate-800/80 border border-slate-700/60 text-slate-300 text-xs font-semibold rounded-xl transition-all"
          >
            Daftar Gratis
          </button>
        </div>
      </div>
    </div>
  );
};

export default AIChat;
