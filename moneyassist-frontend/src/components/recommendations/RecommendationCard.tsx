import React, { useState } from 'react';
import { Recommendation } from '../../types';

interface RecommendationCardProps {
  recommendation: Recommendation;
}

const RecommendationCard: React.FC<RecommendationCardProps> = ({ recommendation }) => {
  const [isDismissed, setIsDismissed] = useState(false);

  if (isDismissed) return null;

  const getPriorityColor = () => {
    switch (recommendation.priority) {
      case 'high':
        return 'bg-rose-500/10 border-rose-500/20 text-rose-400';
      case 'medium':
        return 'bg-amber-500/10 border-amber-500/20 text-amber-400';
      default:
        return 'bg-emerald-500/10 border-emerald-500/20 text-emerald-400';
    }
  };

  const getIcon = () => {
    switch (recommendation.type) {
      case 'saving':
      case 'savings':
        return '💰';
      case 'investment':
        return '📈';
      default:
        return '💡';
    }
  };

  return (
    <div className="bg-slate-900/40 border border-slate-800/80 backdrop-blur-xl rounded-2xl p-5 hover:border-slate-700/60 transition-all relative">
      <div className="flex gap-4">
        <div className="flex-shrink-0 w-11 h-11 bg-slate-950 rounded-xl flex items-center justify-center text-xl border border-slate-850">
          {getIcon()}
        </div>

        <div className="flex-1 min-w-0">
          <div className="flex items-start justify-between gap-3 mb-2">
            <div>
              <div className="flex items-center flex-wrap gap-2">
                <h3 className="text-sm font-bold text-white leading-tight">{recommendation.title}</h3>
                <span className={`px-2 py-0.5 border rounded-full text-[9px] font-bold uppercase tracking-wider ${getPriorityColor()}`}>
                  {recommendation.priority}
                </span>
              </div>
              <p className="text-[10px] font-bold text-slate-500 uppercase tracking-wider mt-1">{recommendation.type}</p>
            </div>
            
            <button
              onClick={() => setIsDismissed(true)}
              className="text-slate-500 hover:text-white transition-colors p-1 bg-slate-950 border border-slate-850 rounded-lg"
              title="Abaikan"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>

          <p className="text-xs text-slate-300 leading-relaxed mb-3">
            {recommendation.description}
          </p>

          <div className="flex items-center justify-between text-[10px] text-slate-500 font-semibold">
            <span>
              {recommendation.created_at ? new Date(recommendation.created_at).toLocaleDateString('id-ID', {
                month: 'short',
                day: 'numeric',
                year: 'numeric'
              }) : 'Baru saja'}
            </span>

            {recommendation.action_url && (
              <a 
                href={recommendation.action_url}
                className="text-teal-400 hover:text-teal-300 font-bold transition-colors"
              >
                Lihat Detail &rarr;
              </a>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default RecommendationCard;
