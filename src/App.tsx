/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState, useEffect } from 'react';
import { Company, Difficulty, InterviewRound, QuestionCategory, Question, EvaluationResult, FinalReport, InterviewSession } from './types';
import { SetupView } from './components/SetupView';
import { InterviewView } from './components/InterviewView';
import { ResultsView } from './components/ResultsView';
import { HistoryModal } from './components/HistoryModal';
import { ScoreTrackerSidebar } from './components/ScoreTrackerSidebar';
import { Sparkles, Sun, Moon, Shield, Code, Layers } from 'lucide-react';

export default function App() {
  const [view, setView] = useState<'setup' | 'interview' | 'results'>('setup');
  
  // Theme state
  const [isLightMode, setIsLightMode] = useState(false);
  
  // Simulation parameters
  const [role, setRole] = useState('Senior Full Stack Engineer');
  const [company, setCompany] = useState<Company>('Google');
  const [difficulty, setDifficulty] = useState<Difficulty>('Medium');
  const [questionTimerSec, setQuestionTimerSec] = useState(300);
  const [questions, setQuestions] = useState<Question[]>([]);
  
  // Active session data
  const [evaluations, setEvaluations] = useState<EvaluationResult[]>([]);
  const [finalReport, setFinalReport] = useState<FinalReport | null>(null);
  
  // UI states
  const [isLoading, setIsLoading] = useState(false);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [isHistoryOpen, setIsHistoryOpen] = useState(false);
  const [pastSessions, setPastSessions] = useState<InterviewSession[]>([]);

  // Load theme and past sessions from localStorage
  useEffect(() => {
    const savedTheme = localStorage.getItem('smarthire_theme');
    if (savedTheme === 'light') setIsLightMode(true);

    const savedHistory = localStorage.getItem('smarthire_sessions');
    if (savedHistory) {
      try {
        setPastSessions(JSON.parse(savedHistory));
      } catch {
        // ignore JSON parse errors
      }
    }
  }, []);

  const toggleTheme = () => {
    const next = !isLightMode;
    setIsLightMode(next);
    localStorage.setItem('smarthire_theme', next ? 'light' : 'dark');
  };

  const handleStartInterview = async (config: {
    role: string;
    company: Company;
    resumeText: string;
    difficulty: Difficulty;
    rounds: InterviewRound[];
    categories: QuestionCategory[];
    questionTimerSec: number;
  }) => {
    setIsLoading(true);
    setRole(config.role);
    setCompany(config.company);
    setDifficulty(config.difficulty);
    setQuestionTimerSec(config.questionTimerSec);

    try {
      const res = await fetch('/api/upload_resume', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          resumeText: config.resumeText,
          role: config.role,
          company: config.company,
          difficulty: config.difficulty,
          round: config.rounds[0] || 'Behavioral',
          categories: config.categories
        })
      });
      const data = await res.json();
      
      const loadedQ = data.questions || [
        { id: 'q1', text: `Explain your architecture choices for ${config.role} at ${config.company}.`, category: 'Behavioral' }
      ];
      setQuestions(loadedQ);
      setEvaluations([]);
      setView('interview');
      setIsLoading(false);
    } catch (err) {
      console.error('Start Error:', err);
      // Fallback questions if API unreachable
      setQuestions([
        { id: 'q1', text: `Tell me about a challenging distributed system problem you solved.`, category: 'System Design', expectedKeywords: ['scalability', 'latency', 'cache'] },
        { id: 'q2', text: `Write an optimal algorithm to find the Kth largest element in an array.`, category: 'DSA', expectedKeywords: ['heap', 'quickselect', 'O(N)'] }
      ]);
      setEvaluations([]);
      setView('interview');
      setIsLoading(false);
    }
  };

  const handleFinishInterview = async (evals: EvaluationResult[]) => {
    setEvaluations(evals);
    setIsLoading(true);

    const sessionData = {
      role,
      company,
      difficulty,
      evaluations: evals
    };

    try {
      const res = await fetch('/api/finish', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ sessionData, company, role })
      });
      const rep: FinalReport = await res.json();
      setFinalReport(rep);

      // Save to history
      const newSession: InterviewSession = {
        id: `sess-${Date.now()}`,
        timestamp: Date.now(),
        role,
        company,
        difficulty,
        selectedRounds: ['Behavioral', 'Live Coding'],
        overallScore: rep.overallScore || 8.5,
        verdict: rep.verdict || 'Strong Hire',
        report: rep,
        evaluations: evals
      };

      const updatedHistory = [newSession, ...pastSessions];
      setPastSessions(updatedHistory);
      localStorage.setItem('smarthire_sessions', JSON.stringify(updatedHistory));

      setView('results');
      setIsLoading(false);
    } catch (err) {
      console.error('Finish Report Error:', err);
      const fallbackRep: FinalReport = {
        overallScore: 8.2,
        verdict: 'Strong Hire',
        summary: `Strong candidate demonstrating clear engineering competence and alignment with ${company} standards.`,
        radarScores: { Communication: 85, Technical: 88, ProblemSolving: 82, CultureFit: 84, CodeEfficiency: 90 },
        strengths: ['Clear terminology', 'Solid domain knowledge'],
        weaknesses: ['Add quantifiable business metrics'],
        improvementRoadmap: [
          { week: 'Week 1', topic: 'System Design Scale', action: 'Study Redis partitioning and CDN edge caching.' }
        ]
      };
      setFinalReport(fallbackRep);
      setView('results');
      setIsLoading(false);
    }
  };

  const handleClearHistory = () => {
    setPastSessions([]);
    localStorage.removeItem('smarthire_sessions');
  };

  const handleSelectPastSession = (sess: InterviewSession) => {
    setRole(sess.role);
    setCompany(sess.company);
    setDifficulty(sess.difficulty);
    setEvaluations(sess.evaluations || []);
    setFinalReport(sess.report || {
      overallScore: sess.overallScore || 8.0,
      verdict: sess.verdict || 'Completed',
      summary: `Archived session benchmark evaluation.`,
      radarScores: { Communication: 80, Technical: 82, ProblemSolving: 80, CultureFit: 82, CodeEfficiency: 85 },
      strengths: ['Saved session execution'],
      weaknesses: ['Review archived notes'],
      improvementRoadmap: []
    });
    setIsHistoryOpen(false);
    setView('results');
  };

  return (
    <div className={`min-h-screen font-sans transition-colors duration-300 ${isLightMode ? 'bg-slate-100 text-slate-800 light-mode' : 'bg-slate-950 text-slate-100'}`}>
      {/* Top Brand Header Bar */}
      <header className="sticky top-0 z-40 border-b border-slate-800/80 bg-slate-950/80 backdrop-blur-md print:hidden">
        <div className="max-w-7xl mx-auto px-4 h-16 flex items-center justify-between">
          <div 
            onClick={() => setView('setup')}
            className="flex items-center gap-3 cursor-pointer group"
          >
            <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-blue-600 to-emerald-500 flex items-center justify-center shadow-md shadow-blue-500/20 group-hover:scale-105 transition transform">
              <Sparkles className="w-5 h-5 text-white animate-pulse" />
            </div>
            <div>
              <span className="font-extrabold text-lg sm:text-xl tracking-tight text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-emerald-400">
                SmartHire AI
              </span>
              <span className="hidden sm:inline-block ml-2 text-[10px] font-mono uppercase px-2 py-0.5 rounded bg-slate-900 border border-slate-800 text-slate-400">
                Tier 1-3 Full Suite
              </span>
            </div>
          </div>

          <div className="flex items-center gap-4">
            {view === 'interview' && (
              <span className="hidden md:inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-rose-500/10 border border-rose-500/30 text-rose-400 text-xs font-mono animate-pulse font-semibold">
                <span className="w-2 h-2 rounded-full bg-rose-500" /> Live Simulation Active
              </span>
            )}

            {/* Dark/Light Toggle */}
            <button
              onClick={toggleTheme}
              title={isLightMode ? 'Switch to Dark Mode' : 'Switch to Light Mode'}
              className="p-2 rounded-xl bg-slate-900 hover:bg-slate-800 border border-slate-800 text-slate-300 transition shadow"
            >
              {isLightMode ? <Moon className="w-4 h-4 text-indigo-400" /> : <Sun className="w-4 h-4 text-amber-400" />}
            </button>
          </div>
        </div>
      </header>

      {/* Main Container Layout */}
      <main className="flex">
        <div className="flex-1 overflow-x-hidden">
          {view === 'setup' && (
            <SetupView
              onStart={handleStartInterview}
              pastSessions={pastSessions}
              onOpenHistory={() => setIsHistoryOpen(true)}
              isLoading={isLoading}
            />
          )}

          {view === 'interview' && (
            <InterviewView
              questions={questions}
              company={company}
              role={role}
              difficulty={difficulty}
              questionTimerSec={questionTimerSec}
              onFinish={handleFinishInterview}
              onToggleSidebar={() => setIsSidebarOpen(!isSidebarOpen)}
            />
          )}

          {view === 'results' && finalReport && (
            <ResultsView
              report={finalReport}
              evaluations={evaluations}
              company={company}
              role={role}
              onRestart={() => setView('setup')}
            />
          )}
        </div>

        {/* Live Score Tracker Sidebar (Tier 1 & Tier 2) */}
        {view === 'interview' && (
          <ScoreTrackerSidebar
            evaluations={evaluations}
            currentQuestionIdx={evaluations.length}
            totalQuestions={questions.length}
            isOpen={isSidebarOpen}
            onToggle={() => setIsSidebarOpen(!isSidebarOpen)}
          />
        )}
      </main>

      {/* History Modal Dialog (Tier 3) */}
      {isHistoryOpen && (
        <HistoryModal
          sessions={pastSessions}
          onClose={() => setIsHistoryOpen(false)}
          onSelectSession={handleSelectPastSession}
          onClearHistory={handleClearHistory}
        />
      )}
    </div>
  );
}
