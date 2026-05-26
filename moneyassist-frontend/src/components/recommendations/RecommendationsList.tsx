import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchRecommendations } from '../../store/uiSlice';
import { RootState, AppDispatch } from '../../store/store';
import RecommendationCard from './RecommendationCard';
import LoadingSpinner from '../common/LoadingSpinner';
import { Recommendation } from '../../types';

const RecommendationsList: React.FC = () => {
  const dispatch = useDispatch<AppDispatch>();
  const { recommendations, loading } = useSelector((state: RootState) => state.ui);

  useEffect(() => {
    dispatch(fetchRecommendations());
  }, [dispatch]);

  if (loading) {
    return (
      <div className="flex justify-center items-center py-12">
        <LoadingSpinner />
      </div>
    );
  }

  if (!recommendations || recommendations.length === 0) {
    return (
      <div className="bg-slate-900/40 border border-slate-800/80 backdrop-blur-xl rounded-3xl p-8 text-center">
        <div className="w-16 h-16 bg-slate-950 rounded-2xl flex items-center justify-center mx-auto mb-4 border border-slate-800">
          <svg className="w-8 h-8 text-slate-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
          </svg>
        </div>
        <h3 className="text-base font-bold text-white mb-2">Belum Ada Rekomendasi</h3>
        <p className="text-slate-400 text-xs max-w-xs mx-auto">
          Mulai catat transaksi harian Anda untuk menerima rekomendasi finansial berbasis AI yang dipersonalisasi.
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-base font-bold text-white flex items-center gap-2">
            <span className="w-1.5 h-4 bg-teal-500 rounded-full"></span>
            Rekomendasi Asisten AI
          </h2>
          <p className="text-slate-500 text-[11px] font-bold uppercase mt-0.5">Analisis kondisi finansial Anda</p>
        </div>
        <button
          onClick={() => dispatch(fetchRecommendations())}
          className="px-3 py-1.5 bg-slate-950 hover:bg-slate-900 border border-slate-850 text-teal-400 rounded-xl transition-all flex items-center gap-1.5 text-xs font-semibold"
        >
          <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
          </svg>
          Perbarui
        </button>
      </div>

      <div className="grid grid-cols-1 gap-4">
        {recommendations.map((recommendation: Recommendation) => (
          <RecommendationCard
            key={recommendation.id}
            recommendation={recommendation}
          />
        ))}
      </div>
    </div>
  );
};

export default RecommendationsList;
