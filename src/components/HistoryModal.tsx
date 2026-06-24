import React from 'react';
import { InterviewSession } from '../types';
import { History, Trash2, Award, Calendar, ArrowRight, X } from 'lucide-react';

interface HistoryModalProps {
  sessions: InterviewSession[];
  onClose: () => void;
  onSelectSession: (s: InterviewSession) => void;
  onClearHistory: () => void;
}

export const HistoryModal: React.FC<HistoryModalProps> = ({
  sessions,
  onClose,
  onSelectSession,
  onClearHistory
}) => {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/80 backdrop-blur-sm p-4 animate-fade-in">
      <div className="bg-slate-900 border border-slate-800 rounded-3xl max-w-3xl w-full max-h-[85vh] flex flex-col shadow-2xl overflow-hidden">
        {/* Header */}
        <div className="p-6 border-b border-slate-800 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-xl bg-blue-500/20 text-blue-400">
              <History className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-lg font-bold text-slate-100">Tier 3: Past Interview Sessions Log</h2>
              <p className="text-xs text-slate-400">Archived biometrics and rubric evaluation reports stored in localStorage.</p>
            </div>
          </div>
          <button onClick={onClose} className="p-2 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* List */}
        <div className="p-6 overflow-y-auto flex-1 space-y-3">
          {sessions.length === 0 ? (
            <div className="text-center py-16 text-slate-500 text-sm font-medium">
              No saved interview sessions found in browser archive. Complete a session to store it here.
            </div>
          ) : (
            sessions.map((sess) => {
              const dateStr = new Date(sess.timestamp).toLocaleDateString(undefined, {
                month: 'short', day: 'numeric', year: 'numeric', hour: '2-digit', minute: '2-digit'
              });
              const score = sess.report?.overallScore ?? sess.overallScore ?? '—';
              const verdict = sess.report?.verdict ?? sess.verdict ?? 'Completed';

              return (
                <div
                  key={sess.id}
                  className="p-4 rounded-2xl bg-slate-800/50 hover:bg-slate-800 border border-slate-700/60 transition flex flex-col sm:flex-row sm:items-center justify-between gap-4"
                >
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <span className="font-bold text-sm text-slate-100">{sess.company}</span>
                      <span className="text-xs text-slate-400">• {sess.role}</span>
                      <span className="px-2 py-0.5 rounded bg-slate-900 border border-slate-700 font-mono text-[10px] text-blue-400">
                        {sess.difficulty}
                      </span>
                    </div>
                    <div className="text-[11px] text-slate-400 flex items-center gap-1.5 font-mono">
                      <Calendar className="w-3 h-3 text-slate-500" /> {dateStr}
                    </div>
                  </div>

                  <div className="flex items-center justify-between sm:justify-end gap-4 border-t sm:border-0 pt-3 sm:pt-0 border-slate-700/60">
                    <div className="text-right">
                      <div className="text-[10px] uppercase font-mono text-slate-400">Score Bar</div>
                      <div className="text-base font-bold font-mono text-emerald-400 flex items-center gap-1">
                        <Award className="w-3.5 h-3.5 text-amber-400" /> {score}/10
                      </div>
                    </div>

                    <button
                      onClick={() => onSelectSession(sess)}
                      className="px-4 py-2 rounded-xl bg-blue-600 hover:bg-blue-500 text-white text-xs font-bold transition shadow flex items-center gap-1.5"
                    >
                      View Report <ArrowRight className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              );
            })
          )}
        </div>

        {/* Footer */}
        {sessions.length > 0 && (
          <div className="p-4 bg-slate-950/60 border-t border-slate-800 flex justify-between items-center px-6">
            <span className="text-xs text-slate-500 font-mono">{sessions.length} archived sessions</span>
            <button
              onClick={onClearHistory}
              className="text-xs text-rose-400 hover:text-rose-300 flex items-center gap-1 font-semibold hover:underline"
            >
              <Trash2 className="w-3.5 h-3.5" /> Clear All History
            </button>
          </div>
        )}
      </div>
    </div>
  );
};
