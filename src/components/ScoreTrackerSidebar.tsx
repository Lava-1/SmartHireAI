import React from 'react';
import { EvaluationResult } from '../types';
import { BarChart3, TrendingUp, HeartPulse, Award } from 'lucide-react';

interface ScoreTrackerSidebarProps {
  evaluations: EvaluationResult[];
  currentQuestionIdx: number;
  totalQuestions: number;
  isOpen: boolean;
  onToggle: () => void;
}

export const ScoreTrackerSidebar: React.FC<ScoreTrackerSidebarProps> = ({
  evaluations,
  currentQuestionIdx,
  totalQuestions,
  isOpen,
  onToggle
}) => {
  const completedCount = evaluations.length;
  const avgScore = completedCount > 0
    ? (evaluations.reduce((acc, curr) => acc + curr.score, 0) / completedCount).toFixed(1)
    : '—';

  return (
    <>
      {/* Mobile Toggle Pill */}
      <button
        onClick={onToggle}
        className="lg:hidden fixed bottom-4 right-4 z-40 px-4 py-2.5 bg-slate-900 border border-slate-700 rounded-full text-slate-200 text-xs font-bold shadow-xl flex items-center gap-2"
      >
        <BarChart3 className="w-4 h-4 text-blue-400" /> Live Stats ({avgScore})
      </button>

      {/* Sidebar Panel */}
      <div className={`
        fixed lg:static top-0 right-0 z-50 h-full lg:h-auto w-80 lg:w-72 bg-slate-900/95 lg:bg-slate-900/60 border-l lg:border border-slate-800 lg:rounded-2xl p-5 backdrop-blur-md transition-transform duration-300 flex flex-col justify-between shadow-2xl lg:shadow-none
        ${isOpen ? 'translate-x-0' : 'translate-x-full lg:translate-x-0'}
      `}>
        <div>
          <div className="flex items-center justify-between pb-4 border-b border-slate-800 mb-4">
            <h3 className="text-sm font-bold text-slate-200 flex items-center gap-2">
              <BarChart3 className="w-4 h-4 text-blue-400" /> Live Score Tracker
            </h3>
            <button onClick={onToggle} className="lg:hidden text-slate-400 hover:text-white text-xs">✕</button>
          </div>

          {/* Prominent Running Average */}
          <div className="bg-gradient-to-br from-blue-500/10 to-emerald-500/10 border border-blue-500/20 rounded-xl p-4 text-center mb-6">
            <div className="text-[10px] uppercase font-mono tracking-wider text-slate-400 mb-1">Running Avg Score</div>
            <div className="text-3xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-emerald-400 flex items-center justify-center gap-2">
              <Award className="w-6 h-6 text-amber-400" />
              {avgScore} <span className="text-xs font-normal text-slate-400">/ 10</span>
            </div>
            <div className="text-[11px] text-slate-400 mt-2">
              Progress: {completedCount} of {totalQuestions} answered
            </div>
            {/* Progress Bar */}
            <div className="w-full bg-slate-800 rounded-full h-1.5 mt-2.5 overflow-hidden">
              <div 
                className="bg-gradient-to-r from-blue-500 to-emerald-500 h-full transition-all duration-500"
                style={{ width: `${(currentQuestionIdx / Math.max(1, totalQuestions)) * 100}%` }}
              />
            </div>
          </div>

          {/* Per-Question Bar Chart */}
          <div className="space-y-3 mb-6">
            <div className="text-xs font-semibold text-slate-300 uppercase tracking-wider flex items-center gap-1.5">
              <TrendingUp className="w-3.5 h-3.5 text-emerald-400" /> Question Score Chart
            </div>
            {evaluations.length === 0 ? (
              <div className="text-center py-6 border border-dashed border-slate-800 rounded-xl text-xs text-slate-500">
                Submit your first response to see real-time bar metrics.
              </div>
            ) : (
              evaluations.map((ev, i) => (
                <div key={ev.questionId || i} className="bg-slate-800/40 rounded-lg p-2.5 border border-slate-800/80">
                  <div className="flex justify-between items-center text-xs mb-1">
                    <span className="font-mono text-slate-400 font-bold">Q{i + 1}</span>
                    <span className={`font-bold font-mono ${
                      ev.score >= 8 ? 'text-emerald-400' : ev.score >= 6 ? 'text-blue-400' : 'text-amber-400'
                    }`}>
                      {ev.score}/10
                    </span>
                  </div>
                  <div className="w-full bg-slate-900 rounded-full h-2 overflow-hidden">
                    <div
                      className={`h-full rounded-full transition-all duration-700 ${
                        ev.score >= 8 ? 'bg-emerald-500' : ev.score >= 6 ? 'bg-blue-500' : 'bg-amber-500'
                      }`}
                      style={{ width: `${ev.score * 10}%` }}
                    />
                  </div>
                </div>
              ))
            )}
          </div>

          {/* Detected Emotion Timeline */}
          <div>
            <div className="text-xs font-semibold text-slate-300 uppercase tracking-wider flex items-center gap-1.5 mb-3">
              <HeartPulse className="w-3.5 h-3.5 text-rose-400" /> Biometrics Timeline
            </div>
            <div className="flex flex-wrap gap-1.5">
              {evaluations.length === 0 ? (
                <span className="text-[11px] text-slate-500 italic">No biometrics logged yet.</span>
              ) : (
                evaluations.map((ev, i) => (
                  <div key={i} className="inline-flex items-center gap-1 px-2 py-1 rounded bg-slate-800 border border-slate-700/60 text-[10px] text-slate-300">
                    <span className="font-mono text-blue-400">Q{i+1}:</span>
                    <span>{ev.detectedEmotions[0] || 'Calm'}</span>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>

        <div className="pt-4 border-t border-slate-800/80 text-[10px] text-slate-500 text-center font-mono">
          Simulated DeepFace + MediaPipe Mesh
        </div>
      </div>
    </>
  );
};
