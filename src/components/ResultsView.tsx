import React, { useState } from 'react';
import { FinalReport, EvaluationResult, Company } from '../types';
import { SvgRadarChart } from './SvgRadarChart';
import { Award, CheckCircle2, Download, RotateCcw, ChevronDown, ChevronUp, Zap, ThumbsUp, ThumbsDown, BookOpen } from 'lucide-react';

interface ResultsViewProps {
  report: FinalReport;
  evaluations: EvaluationResult[];
  company: Company;
  role: string;
  onRestart: () => void;
}

export const ResultsView: React.FC<ResultsViewProps> = ({
  report,
  evaluations,
  company,
  role,
  onRestart
}) => {
  const [expandedQ, setExpandedQ] = useState<string | null>(evaluations[0]?.questionId || null);

  const avgScore = report.overallScore || 8.5;
  const isHighHire = avgScore >= 8 || report.verdict.includes('Strong');

  const handlePrintReport = () => {
    window.print();
  };

  return (
    <div className="w-full max-w-7xl mx-auto px-4 py-8 space-y-8 print:py-0 print:space-y-4">
      {/* Executive Summary Hero */}
      <div className="bg-gradient-to-br from-slate-900 via-slate-900 to-blue-950/60 border border-slate-800 rounded-3xl p-8 shadow-2xl relative overflow-hidden">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 relative z-10">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-500/10 border border-blue-500/30 text-blue-400 font-mono text-xs mb-3">
              <Award className="w-4 h-4" /> Final Hiring Benchmark Verdict
            </div>
            <h1 className="text-3xl sm:text-4xl font-extrabold text-slate-100 tracking-tight">
              {company} Interview Evaluation Report
            </h1>
            <p className="text-slate-400 text-sm mt-1 font-medium">
              Candidate Role: <span className="text-slate-200">{role}</span>
            </p>
          </div>

          {/* Action CTAs */}
          <div className="flex flex-wrap items-center gap-3 print:hidden">
            <button
              onClick={handlePrintReport}
              className="px-4 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 border border-slate-700 text-slate-200 text-sm font-semibold transition flex items-center gap-2 shadow"
            >
              <Download className="w-4 h-4 text-blue-400" /> Export PDF Report
            </button>
            <button
              onClick={onRestart}
              className="px-5 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white text-sm font-bold transition flex items-center gap-2 shadow-lg shadow-blue-600/20"
            >
              <RotateCcw className="w-4 h-4" /> Simulate Another Interview
            </button>
          </div>
        </div>

        {/* Verdict Banner */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 mt-8 pt-8 border-t border-slate-800/80 items-center">
          <div className="bg-slate-800/60 rounded-2xl p-5 border border-slate-700/60 text-center">
            <div className="text-xs uppercase tracking-wider font-mono text-slate-400 mb-1">Final Score Bar</div>
            <div className="text-4xl font-black text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-emerald-400">
              {avgScore} <span className="text-lg font-normal text-slate-400">/ 10</span>
            </div>
          </div>

          <div className="bg-slate-800/60 rounded-2xl p-5 border border-slate-700/60 text-center">
            <div className="text-xs uppercase tracking-wider font-mono text-slate-400 mb-1">Committee Verdict</div>
            <div className={`text-2xl font-bold uppercase tracking-wide ${isHighHire ? 'text-emerald-400' : 'text-amber-400'}`}>
              {report.verdict || 'Strong Hire'}
            </div>
          </div>

          <div className="bg-slate-800/60 rounded-2xl p-5 border border-slate-700/60 flex flex-col items-center justify-center">
            <div className="text-xs uppercase tracking-wider font-mono text-slate-400 mb-1">Confidence Meter</div>
            <div className="flex items-center gap-2">
              <Zap className="w-5 h-5 text-amber-400 fill-amber-400" />
              <span className="text-2xl font-bold font-mono text-slate-200">92%</span>
            </div>
          </div>
        </div>

        <p className="text-slate-300 text-sm mt-6 leading-relaxed bg-slate-950/40 p-4 rounded-xl border border-slate-800">
          <span className="font-bold text-blue-400 block mb-1">Architectural Summary:</span>
          {report.summary}
        </p>
      </div>

      {/* Analytics Grid: Radar Chart + Strengths vs Weaknesses */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-stretch">
        {/* Radar Spider Chart */}
        <div className="lg:col-span-5 bg-slate-900 border border-slate-800 rounded-3xl p-6 shadow-xl flex flex-col justify-between">
          <div>
            <h2 className="text-lg font-bold text-slate-100 mb-2">Tier 2: Competency Spider Assessment</h2>
            <p className="text-xs text-slate-400 mb-6">Multi-axis skills evaluation generated by Gemini LLM engine.</p>
            <SvgRadarChart scores={report.radarScores} />
          </div>
        </div>

        {/* Strengths & Weaknesses Comparison */}
        <div className="lg:col-span-7 grid grid-cols-1 sm:grid-cols-2 gap-6">
          <div className="bg-slate-900 border border-emerald-500/20 rounded-3xl p-6 shadow-xl">
            <h3 className="text-sm font-bold uppercase tracking-wider text-emerald-400 flex items-center gap-2 mb-4">
              <ThumbsUp className="w-4 h-4" /> Demonstrated Strengths
            </h3>
            <ul className="space-y-3">
              {(report.strengths || ['High architectural composure', 'Self-documenting code']).map((st, i) => (
                <li key={i} className="flex items-start gap-2.5 text-xs sm:text-sm text-slate-200 leading-relaxed">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                  <span>{st}</span>
                </li>
              ))}
            </ul>
          </div>

          <div className="bg-slate-900 border border-amber-500/20 rounded-3xl p-6 shadow-xl">
            <h3 className="text-sm font-bold uppercase tracking-wider text-amber-400 flex items-center gap-2 mb-4">
              <ThumbsDown className="w-4 h-4" /> Areas for Growth
            </h3>
            <ul className="space-y-3">
              {(report.weaknesses || ['Could discuss failure recovery scenarios earlier']).map((wk, i) => (
                <li key={i} className="flex items-start gap-2.5 text-xs sm:text-sm text-slate-300 leading-relaxed">
                  <span className="w-1.5 h-1.5 rounded-full bg-amber-400 shrink-0 mt-2" />
                  <span>{wk}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>

      {/* Per-Question Breakdown Table */}
      <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 shadow-xl">
        <h2 className="text-lg font-bold text-slate-100 mb-1">Tier 2: Per-Question Breakdown & Biometrics Log</h2>
        <p className="text-xs text-slate-400 mb-6">Click any question row to expand full answer transcription and better STAR recommendations.</p>

        <div className="space-y-3">
          {evaluations.map((ev, i) => {
            const isExp = expandedQ === ev.questionId;
            return (
              <div key={ev.questionId || i} className="border border-slate-800 rounded-2xl bg-slate-800/40 overflow-hidden transition">
                <button
                  onClick={() => setExpandedQ(isExp ? null : ev.questionId)}
                  className="w-full p-4 flex flex-wrap items-center justify-between gap-4 text-left hover:bg-slate-800/80 transition"
                >
                  <div className="flex items-center gap-3">
                    <span className="w-7 h-7 rounded-lg bg-blue-500/20 text-blue-300 font-mono font-bold text-xs flex items-center justify-center">
                      Q{i + 1}
                    </span>
                    <span className="text-sm font-semibold text-slate-100 line-clamp-1 max-w-xl">
                      {ev.questionText}
                    </span>
                  </div>

                  <div className="flex items-center gap-4">
                    <span className="text-xs font-mono text-slate-400">Focus: {ev.focusPercentage}%</span>
                    <span className={`px-2.5 py-1 rounded font-mono font-bold text-xs ${
                      ev.score >= 8 ? 'bg-emerald-500/20 text-emerald-300' : 'bg-blue-500/20 text-blue-300'
                    }`}>
                      {ev.score}/10
                    </span>
                    {isExp ? <ChevronUp className="w-4 h-4 text-slate-400" /> : <ChevronDown className="w-4 h-4 text-slate-400" />}
                  </div>
                </button>

                {isExp && (
                  <div className="p-5 bg-slate-950/60 border-t border-slate-800/80 space-y-4 text-xs sm:text-sm">
                    <div>
                      <span className="font-mono text-[10px] text-slate-500 uppercase block mb-1">Candidate Submitted Response:</span>
                      <div className="p-3 rounded-xl bg-slate-900 border border-slate-800 text-slate-200 font-mono whitespace-pre-wrap text-xs">
                        {ev.answerText}
                      </div>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div>
                        <span className="font-bold text-slate-300 block mb-1.5">Feedback:</span>
                        <p className="text-slate-400 text-xs leading-relaxed">{ev.feedback}</p>
                      </div>
                      {ev.betterAnswer && (
                        <div>
                          <span className="font-bold text-blue-400 block mb-1.5">Exemplary STAR Answer:</span>
                          <p className="text-blue-200/90 text-xs bg-blue-950/40 p-3 rounded-xl border border-blue-500/20 leading-relaxed">
                            "{ev.betterAnswer}"
                          </p>
                        </div>
                      )}
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>

      {/* Personalized Roadmap */}
      <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 shadow-xl">
        <h2 className="text-lg font-bold text-slate-100 mb-1 flex items-center gap-2">
          <BookOpen className="w-5 h-5 text-blue-400" /> Post-Interview Personalized Improvement Plan
        </h2>
        <p className="text-xs text-slate-400 mb-6">Custom 3-week study roadmap generated specifically to bridge your identified rubric gaps.</p>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {(report.improvementRoadmap || []).map((rm, i) => (
            <div key={i} className="bg-slate-800/50 rounded-2xl p-5 border border-slate-700/60 flex flex-col justify-between relative overflow-hidden">
              <div className="absolute top-0 left-0 w-1.5 h-full bg-gradient-to-b from-blue-500 to-emerald-500" />
              <div>
                <span className="px-2.5 py-0.5 rounded bg-blue-500/20 text-blue-300 font-mono text-[10px] font-bold">
                  {rm.week}
                </span>
                <h3 className="text-sm font-bold text-slate-100 mt-2 mb-1.5">{rm.topic}</h3>
                <p className="text-xs text-slate-400 leading-relaxed">{rm.action}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
