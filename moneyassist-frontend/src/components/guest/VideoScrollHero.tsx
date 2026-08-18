import React, { useEffect, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

const VideoScrollHero: React.FC = () => {
  const navigate = useNavigate();
  const containerRef = useRef<HTMLDivElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const progressBarRef = useRef<HTMLDivElement>(null);

  // Floating story overlays refs
  const step1Ref = useRef<HTMLDivElement>(null);
  const step2Ref = useRef<HTMLDivElement>(null);
  const step3Ref = useRef<HTMLDivElement>(null);
  const step4Ref = useRef<HTMLDivElement>(null);

  const [scrollProgress, setScrollProgress] = useState(0);
  const [videoReady, setVideoReady] = useState(false);

  // Target timestamp determined by scroll progress
  const targetTimeRef = useRef<number>(0);
  const isUserScrollingRef = useRef<boolean>(false);

  useEffect(() => {
    const video = videoRef.current;
    const container = containerRef.current;
    if (!video || !container) return;

    let tl: gsap.core.Timeline | null = null;
    let animFrameId: number | null = null;
    let scrollTimeout: ReturnType<typeof setTimeout> | null = null;

    // Ensure audio track is strictly disabled and muted
    video.muted = true;
    video.defaultMuted = true;
    video.playsInline = true;

    // =========================================================================
    // HIGH-PERFORMANCE VELOCITY PLAYBACK ENGINE
    // Plays video smoothly in forward motion and lerps backwards without stalling
    // =========================================================================
    const smoothPlaybackEngine = () => {
      if (video && video.readyState >= 2 && video.duration) {
        const target = targetTimeRef.current;
        const current = video.currentTime;
        const diff = target - current;

        // Forward scrolling: Use natural video playback with dynamic playbackRate
        if (diff > 0.04) {
          if (diff > 1.2) {
            // Large jump: Smooth fast-forward seek
            video.currentTime = current + diff * 0.28;
          } else {
            // Fine-grained scrolling: dynamically adjust speed to match scroll velocity
            const rate = Math.min(3.5, Math.max(0.6, 1.0 + diff * 3.0));
            video.playbackRate = rate;
            if (video.paused) {
              video.play().catch(() => {});
            }
          }
        } 
        // Backward scrolling: Smooth reverse seek interpolation
        else if (diff < -0.04) {
          if (!video.paused) {
            video.pause();
          }
          video.currentTime = current + diff * 0.25;
        } 
        // Stationary: Pause naturally
        else {
          if (!video.paused && !isUserScrollingRef.current) {
            video.pause();
          }
        }
      }

      animFrameId = requestAnimationFrame(smoothPlaybackEngine);
    };

    const setupTimeline = () => {
      const duration = video.duration || 5;

      tl = gsap.timeline({
        scrollTrigger: {
          trigger: container,
          start: 'top top',
          end: '+=450%',
          pin: true,
          scrub: 1.2, // 1.2s smooth physics inertia
          anticipatePin: 1,
          onUpdate: (self) => {
            const p = self.progress;
            setScrollProgress(Math.round(p * 100));

            // Set the target time for our continuous playback engine
            targetTimeRef.current = p * duration;

            isUserScrollingRef.current = true;
            if (scrollTimeout) clearTimeout(scrollTimeout);
            scrollTimeout = setTimeout(() => {
              isUserScrollingRef.current = false;
            }, 120);
          }
        }
      });

      // Progress bar
      if (progressBarRef.current) {
        tl.to(progressBarRef.current, {
          width: '100%',
          ease: 'none',
          duration: 1
        }, 0);
      }

      // --- PHASE 1: Hero Pitch (0% - 20%) ---
      tl.to(step1Ref.current, {
        opacity: 0,
        y: -50,
        scale: 0.94,
        filter: 'blur(6px)',
        duration: 0.18,
        ease: 'power2.inOut'
      }, 0.05);

      // --- PHASE 2: OCR & Screenshot Logger (20% - 50%) ---
      tl.fromTo(step2Ref.current,
        { opacity: 0, y: 70, scale: 0.9, filter: 'blur(8px)' },
        { opacity: 1, y: 0, scale: 1, filter: 'blur(0px)', duration: 0.18, ease: 'power3.out' },
        0.22
      );
      tl.to(step2Ref.current, {
        opacity: 0,
        y: -40,
        scale: 0.94,
        filter: 'blur(6px)',
        duration: 0.15,
        ease: 'power2.in'
      }, 0.44);

      // --- PHASE 3: 50/30/20 Smart Budgeting & Health Score (50% - 78%) ---
      tl.fromTo(step3Ref.current,
        { opacity: 0, y: 70, scale: 0.9, filter: 'blur(8px)' },
        { opacity: 1, y: 0, scale: 1, filter: 'blur(0px)', duration: 0.18, ease: 'power3.out' },
        0.52
      );
      tl.to(step3Ref.current, {
        opacity: 0,
        y: -40,
        scale: 0.94,
        filter: 'blur(6px)',
        duration: 0.15,
        ease: 'power2.in'
      }, 0.74);

      // --- PHASE 4: Final Call to Action (78% - 100%) ---
      tl.fromTo(step4Ref.current,
        { opacity: 0, y: 70, scale: 0.9, filter: 'blur(8px)' },
        { opacity: 1, y: 0, scale: 1, filter: 'blur(0px)', duration: 0.2, ease: 'power3.out' },
        0.80
      );

      // Start engine loop
      animFrameId = requestAnimationFrame(smoothPlaybackEngine);
    };

    if (video.readyState >= 2) {
      setVideoReady(true);
      setupTimeline();
    } else {
      video.onloadeddata = () => {
        setVideoReady(true);
        setupTimeline();
      };
      video.oncanplay = () => {
        setVideoReady(true);
      };
    }

    return () => {
      if (animFrameId) cancelAnimationFrame(animFrameId);
      if (scrollTimeout) clearTimeout(scrollTimeout);
      if (tl) tl.kill();
      ScrollTrigger.getAll().forEach(t => t.kill());
    };
  }, []);

  return (
    <div ref={containerRef} className="relative w-full h-screen bg-slate-950 overflow-hidden select-none">
      
      {/* Dynamic Ambient Background Glows */}
      <div className="absolute top-1/4 left-1/4 w-[600px] h-[600px] bg-teal-500/15 rounded-full blur-[160px] pointer-events-none z-0 animate-pulse" style={{ animationDuration: '6s' }} />
      <div className="absolute bottom-1/4 right-1/4 w-[600px] h-[600px] bg-cyan-500/15 rounded-full blur-[160px] pointer-events-none z-0 animate-pulse" style={{ animationDuration: '8s' }} />

      {/* GPU Accelerated Native Video Viewport */}
      <div className="absolute inset-0 flex items-center justify-center z-0 overflow-hidden">
        <video
          ref={videoRef}
          src="/videos/hero-scroll.mp4"
          playsInline
          muted
          loop
          preload="auto"
          className="w-full h-full object-cover filter brightness-95 contrast-105"
          style={{
            willChange: 'transform',
            transform: 'translate3d(0, 0, 0)',
            backfaceVisibility: 'hidden'
          }}
        />
        {/* Layered Cinematic Vignettes for Seamless Blending */}
        <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/20 to-slate-950/70 pointer-events-none" />
        <div className="absolute inset-0 bg-gradient-to-r from-slate-950/80 via-transparent to-slate-950/80 pointer-events-none" />
      </div>

      {/* Loading Skeleton Indicator */}
      {!videoReady && (
        <div className="absolute inset-0 flex flex-col items-center justify-center bg-slate-950 z-30 space-y-4">
          <div className="w-12 h-12 border-4 border-teal-500/20 border-t-teal-400 rounded-full animate-spin" />
          <p className="text-sm font-semibold text-slate-400">Menyiapkan Tampilan Video...</p>
        </div>
      )}

      {/* ============================================================ */}
      {/* FLOATING GLASS STORYTELLING OVERLAYS */}
      {/* ============================================================ */}

      {/* STEP 1: Main Hero Pitch */}
      <div 
        ref={step1Ref} 
        className="absolute inset-0 flex flex-col items-center justify-center text-center px-6 z-10 pointer-events-auto"
        style={{ willChange: 'transform, opacity, filter' }}
      >
        <div className="inline-flex items-center gap-2 px-4 py-2 bg-slate-900/80 border border-teal-500/30 backdrop-blur-2xl rounded-full text-xs font-extrabold uppercase tracking-widest text-teal-400 shadow-2xl shadow-teal-500/10 mb-6">
          <span className="w-2 h-2 rounded-full bg-teal-400 animate-ping"></span>
          Next-Gen AI Finance
        </div>

        <h1 className="text-4xl sm:text-6xl md:text-7xl font-black tracking-tight text-white max-w-4xl leading-[1.12] mb-6 drop-shadow-2xl">
          Kuasai Masa Depan <br />
          <span className="bg-gradient-to-r from-teal-400 via-cyan-400 to-sky-300 bg-clip-text text-transparent">
            Finansial Anda
          </span>
        </h1>

        <p className="text-slate-300 text-base sm:text-xl max-w-2xl leading-relaxed mb-8 drop-shadow font-medium">
          Catat transaksi instan lewat Telegram & Back-Tap iPhone, analisis otomatis dengan Gemini AI, dan pantau rasio tabungan secara real-time.
        </p>

        <div className="flex flex-col sm:flex-row items-center gap-4">
          <button
            onClick={() => navigate('/register')}
            className="px-8 py-4 bg-gradient-to-r from-teal-500 to-cyan-500 hover:from-teal-400 hover:to-cyan-400 text-white rounded-2xl shadow-2xl shadow-teal-500/30 font-bold text-sm sm:text-base transition-all transform hover:scale-105 active:scale-95"
          >
            Mulai Secara Gratis
          </button>
          <button
            onClick={() => {
              const el = document.getElementById('ai-chat');
              if (el) el.scrollIntoView({ behavior: 'smooth' });
            }}
            className="px-8 py-4 bg-slate-900/80 hover:bg-slate-800/90 border border-slate-700/80 backdrop-blur-2xl text-slate-200 rounded-2xl font-bold text-sm sm:text-base transition-all transform hover:scale-105 active:scale-95"
          >
            Coba Demo AI Chat
          </button>
        </div>

        {/* Bouncing Scroll Cue */}
        <div className="absolute bottom-12 flex flex-col items-center gap-2 text-xs font-bold text-slate-400 animate-bounce tracking-wide">
          <span>Gulir ke Bawah untuk Memulai</span>
          <svg className="w-5 h-5 text-teal-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M19 14l-7 7m0 0l-7-7m7 7V3" />
          </svg>
        </div>
      </div>

      {/* STEP 2: Instant Telegram & OCR Auto Logger */}
      <div 
        ref={step2Ref} 
        className="absolute inset-0 flex items-center justify-start max-w-6xl mx-auto px-6 z-10 opacity-0 pointer-events-auto"
        style={{ willChange: 'transform, opacity, filter' }}
      >
        <div className="max-w-xl bg-slate-950/80 border border-slate-800/90 backdrop-blur-3xl p-8 sm:p-10 rounded-3xl shadow-2xl shadow-cyan-950/60 space-y-6">
          <div className="flex items-center gap-3.5">
            <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-cyan-500 to-teal-400 flex items-center justify-center text-slate-950 shadow-xl shadow-cyan-500/25">
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.2} d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.2} d="M15 13a3 3 0 11-6 0 3 3 0 016 0z" />
              </svg>
            </div>
            <div>
              <span className="text-xs uppercase tracking-widest font-black text-cyan-400">Pintasan Cepat iPhone & Telegram</span>
              <h2 className="text-2xl sm:text-3xl font-black text-white">Catat Transaksi Sekejap</h2>
            </div>
          </div>

          <p className="text-slate-300 text-sm sm:text-base leading-relaxed font-normal">
            Cukup <strong className="text-cyan-300 font-semibold">Double Tap belakang iPhone</strong> setelah bertransaksi di m-Banking atau QRIS. Tangkapan layar otomatis diproses oleh Gemini Flash Vision tanpa perlu input manual.
          </p>

          <div className="grid grid-cols-2 gap-3 pt-1">
            <div className="p-3.5 bg-slate-900/70 border border-slate-800/90 rounded-2xl">
              <div className="text-[11px] text-slate-400 font-medium">Klasifikasi AI</div>
              <div className="text-sm font-extrabold text-emerald-400 mt-0.5">📈 Pemasukan & 📉 Pengeluaran</div>
            </div>
            <div className="p-3.5 bg-slate-900/70 border border-slate-800/90 rounded-2xl">
              <div className="text-[11px] text-slate-400 font-medium">Kompatibilitas Bank</div>
              <div className="text-sm font-extrabold text-teal-400 mt-0.5">BCA, Mandiri, BRI, QRIS & e-Wallet</div>
            </div>
          </div>
        </div>
      </div>

      {/* STEP 3: Smart 50/30/20 & Cashflow Analytics */}
      <div 
        ref={step3Ref} 
        className="absolute inset-0 flex items-center justify-end max-w-6xl mx-auto px-6 z-10 opacity-0 pointer-events-auto"
        style={{ willChange: 'transform, opacity, filter' }}
      >
        <div className="max-w-xl bg-slate-950/80 border border-slate-800/90 backdrop-blur-3xl p-8 sm:p-10 rounded-3xl shadow-2xl shadow-teal-950/60 space-y-6">
          <div className="flex items-center gap-3.5">
            <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-emerald-500 to-teal-400 flex items-center justify-center text-slate-950 shadow-xl shadow-emerald-500/25">
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.2} d="M11 3.055A9.001 9.001 0 1020.945 13H11V3.055z" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.2} d="M20.488 9H15V3.512A9.025 9.025 0 0120.488 9z" />
              </svg>
            </div>
            <div>
              <span className="text-xs uppercase tracking-widest font-black text-emerald-400">Budgeting Visualizer</span>
              <h2 className="text-2xl sm:text-3xl font-black text-white">Alokasi Cerdas 50/30/20</h2>
            </div>
          </div>

          <p className="text-slate-300 text-sm sm:text-base leading-relaxed font-normal">
            Bagi arus kas bulanan Anda secara proporsional: <span className="text-teal-300 font-semibold">50% Kebutuhan</span>, <span className="text-cyan-300 font-semibold">30% Keinginan</span>, dan <span className="text-emerald-300 font-semibold">20% Tabungan/Investasi</span> untuk stabilitas finansial jangka panjang.
          </p>

          <div className="space-y-3 pt-1">
            <div className="flex justify-between items-center text-xs font-bold text-slate-300">
              <span>Status Kesehatan Finansial</span>
              <span className="text-emerald-400 bg-emerald-500/10 px-3 py-1 rounded-full border border-emerald-500/30">Optimal & Terkendali</span>
            </div>
            <div className="w-full bg-slate-900 rounded-full h-3 overflow-hidden flex shadow-inner">
              <div className="bg-teal-500 h-full transition-all" style={{ width: '50%' }} title="Kebutuhan (50%)" />
              <div className="bg-cyan-400 h-full transition-all" style={{ width: '30%' }} title="Keinginan (30%)" />
              <div className="bg-emerald-400 h-full transition-all" style={{ width: '20%' }} title="Tabungan (20%)" />
            </div>
          </div>
        </div>
      </div>

      {/* STEP 4: Final Conversion Pitch */}
      <div 
        ref={step4Ref} 
        className="absolute inset-0 flex flex-col items-center justify-center text-center px-6 z-10 opacity-0 pointer-events-auto"
        style={{ willChange: 'transform, opacity, filter' }}
      >
        <div className="max-w-3xl bg-slate-950/85 border border-slate-800/90 backdrop-blur-3xl p-10 sm:p-14 rounded-3xl shadow-2xl shadow-teal-500/15 space-y-6">
          <div className="inline-block px-4 py-1.5 bg-gradient-to-r from-teal-500/20 to-cyan-500/20 border border-teal-500/30 rounded-full text-xs font-black uppercase tracking-widest text-teal-300">
            Mulai Bebas Finansial
          </div>

          <h2 className="text-3xl sm:text-5xl font-black text-white leading-tight">
            Wujudkan Tabungan Impian Bersama MoneyAssist
          </h2>

          <p className="text-slate-300 text-sm sm:text-base max-w-xl mx-auto leading-relaxed">
            Tidak ada lagi spreadsheet rumit atau bon belanja yang tercecer. Mulai kelola arus kas Anda secara cerdas sekarang juga.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-4">
            <button
              onClick={() => navigate('/register')}
              className="w-full sm:w-auto px-10 py-4 bg-gradient-to-r from-teal-500 to-cyan-500 hover:from-teal-400 hover:to-cyan-400 text-white rounded-2xl shadow-2xl shadow-teal-500/30 font-extrabold text-base transition-all transform hover:scale-105 active:scale-95"
            >
              Daftar Sekarang - Gratis
            </button>
            <button
              onClick={() => navigate('/login')}
              className="w-full sm:w-auto px-8 py-4 bg-slate-900/90 hover:bg-slate-800 border border-slate-700/80 text-slate-200 rounded-2xl font-bold text-sm transition-all transform hover:scale-105 active:scale-95"
            >
              Masuk ke Akun
            </button>
          </div>
        </div>
      </div>

      {/* ============================================================ */}
      {/* FLOATING BOTTOM HUD & PROGRESS */}
      {/* ============================================================ */}
      <div className="absolute bottom-6 left-6 right-6 flex items-center justify-between z-20 pointer-events-auto">
        
        {/* Playback Mode Badge */}
        <div className="flex items-center gap-2 px-4 py-2 bg-slate-900/90 border border-slate-800/80 backdrop-blur-2xl rounded-full text-xs font-bold text-slate-300 shadow-xl">
          <span className="w-2 h-2 rounded-full bg-teal-400 animate-pulse"></span>
          <span>Scroll-Driven Cinema</span>
        </div>

        {/* Scroll Progress Bar Indicator */}
        <div className="flex items-center gap-3">
          <div className="text-[11px] font-mono font-bold text-slate-400 hidden sm:block">
            {scrollProgress}%
          </div>
          <div className="w-28 sm:w-40 h-2 bg-slate-900/90 border border-slate-800/80 rounded-full overflow-hidden backdrop-blur-2xl">
            <div 
              ref={progressBarRef} 
              className="h-full bg-gradient-to-r from-teal-400 to-cyan-400 rounded-full shadow-lg shadow-teal-500/50"
              style={{ width: `${scrollProgress}%` }}
            />
          </div>
        </div>

      </div>

    </div>
  );
};

export default VideoScrollHero;
