import React, { useState } from 'react';
import { Company, Difficulty, InterviewRound, QuestionCategory, InterviewSession } from '../types';
import { COMPANY_PROFILES } from '../data/companies';
import { Upload, FileText, Sparkles, Clock, Layers, ShieldCheck, History, ArrowRight, CheckCircle2 } from 'lucide-react';

interface SetupViewProps {
  onStart: (config: {
    role: string;
    company: Company;
    resumeText: string;
    difficulty: Difficulty;
    rounds: InterviewRound[];
    categories: QuestionCategory[];
    questionTimerSec: number;
  }) => void;
  pastSessions: InterviewSession[];
  onOpenHistory: () => void;
  isLoading: boolean;
}

const SAMPLE_RESUME = `Alex Rivera — Senior Full Stack & AI Engineer
Experience:
- Senior Software Engineer at TechCorp (2022-Present): Led backend architecture handling 40M daily API calls. Migrated monolith to microservices using Node.js, Express, and Redis sharding, reducing latency by 35%.
- Full Stack Engineer at InnovateAI (2020-2022): Built real-time collaboration canvas using React, TypeScript, and WebSockets. Integrated OpenAI & Gemini APIs for automatic document summarization.
Skills: TypeScript, Python, React, Next.js, Express, FastAPI, PostgreSQL, Redis, Docker, AWS, System Design, DSA, LLM Fine-tuning.
Education: B.S. Computer Science, UC Berkeley (3.9 GPA).`;

const PRESET_ROLES = [
  'Senior Full Stack Engineer',
  'Backend Systems Architect',
  'Frontend UI/UX Engineer',
  'AI & LLM Applications Engineer',
  'Cloud DevOps Engineer',
  'Technical Product Manager'
];

export const SetupView: React.FC<SetupViewProps> = ({
  onStart,
  pastSessions,
  onOpenHistory,
  isLoading
}) => {
  const [role, setRole] = useState('Senior Full Stack Engineer');
  const [company, setCompany] = useState<Company>('Google');
  const [resumeText, setResumeText] = useState(SAMPLE_RESUME);
  const [difficulty, setDifficulty] = useState<Difficulty>('Medium');
  const [selectedRounds, setSelectedRounds] = useState<InterviewRound[]>([
    'Behavioral',
    'Technical Deep-Dive',
    'Live Coding'
  ]);
  const [selectedCategories, setSelectedCategories] = useState<QuestionCategory[]>([
    'System Design',
    'DSA',
    'Behavioral'
  ]);
  const [questionTimer, setQuestionTimer] = useState<number>(300); // 5 mins
  const [activeTab, setActiveTab] = useState<'upload' | 'paste'>('paste');

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      const text = event.target?.result as string;
      if (text) {
        setResumeText(text);
        setActiveTab('paste');
      }
    };
    reader.readAsText(file);
  };

  const toggleRound = (r: InterviewRound) => {
    if (selectedRounds.includes(r)) {
      if (selectedRounds.length > 1) {
        setSelectedRounds(selectedRounds.filter(item => item !== r));
      }
    } else {
      setSelectedRounds([...selectedRounds, r]);
    }
  };

  const toggleCategory = (cat: QuestionCategory) => {
    if (selectedCategories.includes(cat)) {
      if (selectedCategories.length > 1) {
        setSelectedCategories(selectedCategories.filter(c => c !== cat));
      }
    } else {
      setSelectedCategories([...selectedCategories, cat]);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!role.trim() || !resumeText.trim()) return;
    onStart({
      role,
      company,
      resumeText,
      difficulty,
      rounds: selectedRounds,
      categories: selectedCategories,
      questionTimerSec: questionTimer
    });
  };

  return (
    <div className="w-full max-w-6xl mx-auto px-4 py-8">
      {/* Hero Header */}
      <div className="text-center mb-10">
        <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-blue-500/10 border border-blue-500/20 text-blue-400 text-xs font-mono mb-4">
          <Sparkles className="w-3.5 h-3.5" /> Next-Gen AI Virtual Interview Simulator
        </div>
        <h1 className="text-4xl sm:text-5xl font-bold tracking-tight text-slate-100 mb-3">
          Ace Your Next Tech Interview with <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-emerald-400">SmartHire AI</span>
        </h1>
        <p className="text-slate-400 max-w-2xl mx-auto text-base">
          Experience real-time biometrics, emotion tracking, adaptive resume questioning, and instant Big-O code evaluation benchmarked against elite company rubrics.
        </p>

        {pastSessions.length > 0 && (
          <div className="mt-6 flex justify-center">
            <button
              onClick={onOpenHistory}
              className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-slate-800 hover:bg-slate-700 border border-slate-700 text-slate-200 text-sm font-medium transition-all shadow-sm hover:shadow"
            >
              <History className="w-4 h-4 text-blue-400" />
              View Past Interviews ({pastSessions.length})
            </button>
          </div>
        )}
      </div>

      <form onSubmit={handleSubmit} className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Left Column: Role & Company & Setup */}
        <div className="lg:col-span-7 space-y-6">
          {/* Step 1: Target Role */}
          <div className="bg-slate-900/80 border border-slate-800 rounded-2xl p-6 backdrop-blur-sm shadow-xl">
            <h2 className="text-lg font-semibold text-slate-200 mb-4 flex items-center gap-2">
              <span className="flex items-center justify-center w-6 h-6 rounded-full bg-blue-500/20 text-blue-400 text-xs font-mono">1</span>
              Target Role & Specialization
            </h2>
            <input
              type="text"
              value={role}
              onChange={(e) => setRole(e.target.value)}
              placeholder="e.g. Senior Full Stack Engineer"
              required
              className="w-full px-4 py-3 rounded-xl bg-slate-800/80 border border-slate-700 text-slate-100 placeholder-slate-500 focus:outline-none focus:border-blue-500 text-sm mb-3 font-medium transition"
            />
            <div className="flex flex-wrap gap-2">
              {PRESET_ROLES.map(pr => (
                <button
                  key={pr}
                  type="button"
                  onClick={() => setRole(pr)}
                  className={`px-3 py-1 rounded-lg text-xs font-medium border transition ${
                    role === pr
                      ? 'bg-blue-500/20 border-blue-500/50 text-blue-300'
                      : 'bg-slate-800/50 border-slate-700/60 text-slate-400 hover:bg-slate-800 hover:text-slate-200'
                  }`}
                >
                  {pr}
                </button>
              ))}
            </div>
          </div>

          {/* Step 2: Company Profile Rubric */}
          <div className="bg-slate-900/80 border border-slate-800 rounded-2xl p-6 backdrop-blur-sm shadow-xl">
            <h2 className="text-lg font-semibold text-slate-200 mb-4 flex items-center gap-2">
              <span className="flex items-center justify-center w-6 h-6 rounded-full bg-blue-500/20 text-blue-400 text-xs font-mono">2</span>
              Company Benchmark & Rubric
            </h2>
            <div className="grid grid-cols-3 sm:grid-cols-3 gap-3">
              {Object.keys(COMPANY_PROFILES).map(cKey => {
                const prof = COMPANY_PROFILES[cKey];
                const isSelected = company === prof.name;
                return (
                  <button
                    key={cKey}
                    type="button"
                    onClick={() => setCompany(prof.name)}
                    className={`p-3 rounded-xl border text-left flex flex-col justify-between transition relative overflow-hidden ${
                      isSelected
                        ? 'bg-blue-500/10 border-blue-500 shadow-md shadow-blue-500/5'
                        : 'bg-slate-800/40 border-slate-700/60 hover:bg-slate-800/80 hover:border-slate-600'
                    }`}
                  >
                    <div className="flex items-center justify-between mb-2">
                      <img src={prof.logoUrl} alt={prof.name} className="w-6 h-6 object-contain" />
                      {isSelected && <CheckCircle2 className="w-4 h-4 text-blue-400" />}
                    </div>
                    <div>
                      <div className="text-sm font-bold text-slate-200">{prof.name}</div>
                      <div className="text-[10px] text-slate-400 line-clamp-1 mt-0.5">{prof.tagline}</div>
                    </div>
                  </button>
                );
              })}
            </div>
            {COMPANY_PROFILES[company] && (
              <div className="mt-4 p-3 rounded-xl bg-slate-800/60 border border-slate-700/60 text-xs text-slate-300">
                <span className="font-semibold text-blue-400">Rubric Philosophy:</span> {COMPANY_PROFILES[company].philosophy}
              </div>
            )}
          </div>

          {/* Step 3: Resume Input */}
          <div className="bg-slate-900/80 border border-slate-800 rounded-2xl p-6 backdrop-blur-sm shadow-xl">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-semibold text-slate-200 flex items-center gap-2">
                <span className="flex items-center justify-center w-6 h-6 rounded-full bg-blue-500/20 text-blue-400 text-xs font-mono">3</span>
                Candidate Resume (Adaptive Base)
              </h2>
              <div className="flex bg-slate-800 rounded-lg p-1 border border-slate-700 text-xs">
                <button
                  type="button"
                  onClick={() => setActiveTab('paste')}
                  className={`px-3 py-1 rounded transition ${activeTab === 'paste' ? 'bg-blue-600 text-white font-medium' : 'text-slate-400'}`}
                >
                  Text / Paste
                </button>
                <button
                  type="button"
                  onClick={() => setActiveTab('upload')}
                  className={`px-3 py-1 rounded transition ${activeTab === 'upload' ? 'bg-blue-600 text-white font-medium' : 'text-slate-400'}`}
                >
                  Upload File
                </button>
              </div>
            </div>

            {activeTab === 'paste' ? (
              <div>
                <textarea
                  value={resumeText}
                  onChange={(e) => setResumeText(e.target.value)}
                  rows={6}
                  placeholder="Paste your resume or CV text here..."
                  className="w-full px-4 py-3 rounded-xl bg-slate-800/80 border border-slate-700 text-slate-200 placeholder-slate-500 focus:outline-none focus:border-blue-500 text-xs font-mono transition"
                />
                <div className="flex justify-between items-center mt-2">
                  <span className="text-[11px] text-slate-400">{resumeText.length} chars</span>
                  <button
                    type="button"
                    onClick={() => setResumeText(SAMPLE_RESUME)}
                    className="text-xs text-blue-400 hover:underline flex items-center gap-1 font-medium"
                  >
                    <FileText className="w-3.5 h-3.5" /> Load Sample Resume
                  </button>
                </div>
              </div>
            ) : (
              <div className="border-2 border-dashed border-slate-700 hover:border-blue-500/50 rounded-xl p-8 text-center bg-slate-800/30 transition">
                <Upload className="w-10 h-10 text-slate-400 mx-auto mb-3" />
                <p className="text-sm font-medium text-slate-200 mb-1">Drag & Drop Resume PDF or TXT</p>
                <p className="text-xs text-slate-400 mb-4">Or select a plain text / markdown resume file</p>
                <label className="inline-flex items-center px-4 py-2 rounded-lg bg-blue-600 hover:bg-blue-500 text-white text-xs font-semibold cursor-pointer transition shadow">
                  Browse Files
                  <input type="file" accept=".txt,.md,.json,.pdf" onChange={handleFileUpload} className="hidden" />
                </label>
              </div>
            )}
          </div>
        </div>

        {/* Right Column: Simulation Parameters (Difficulty, Rounds, Timer) */}
        <div className="lg:col-span-5 space-y-6">
          {/* Tier 2: Difficulty Level */}
          <div className="bg-slate-900/80 border border-slate-800 rounded-2xl p-6 backdrop-blur-sm shadow-xl">
            <h3 className="text-sm font-semibold text-slate-300 uppercase tracking-wider mb-4 flex items-center gap-2">
              <ShieldCheck className="w-4 h-4 text-blue-400" /> Tier 2: Difficulty Bar
            </h3>
            <div className="grid grid-cols-3 gap-3">
              {(['Easy', 'Medium', 'Hard'] as Difficulty[]).map(d => (
                <button
                  key={d}
                  type="button"
                  onClick={() => setDifficulty(d)}
                  className={`py-2.5 px-3 rounded-xl border text-xs font-bold text-center transition ${
                    difficulty === d
                      ? d === 'Easy' ? 'bg-emerald-500/20 border-emerald-500 text-emerald-300'
                        : d === 'Medium' ? 'bg-blue-500/20 border-blue-500 text-blue-300'
                        : 'bg-rose-500/20 border-rose-500 text-rose-300'
                      : 'bg-slate-800/40 border-slate-700 text-slate-400 hover:bg-slate-800'
                  }`}
                >
                  {d}
                </button>
              ))}
            </div>
          </div>

          {/* Tier 2: Multi-Round Structure */}
          <div className="bg-slate-900/80 border border-slate-800 rounded-2xl p-6 backdrop-blur-sm shadow-xl">
            <h3 className="text-sm font-semibold text-slate-300 uppercase tracking-wider mb-4 flex items-center gap-2">
              <Layers className="w-4 h-4 text-emerald-400" /> Tier 2: Multi-Round Flow
            </h3>
            <div className="space-y-2.5">
              {(['Behavioral', 'Technical Deep-Dive', 'Live Coding'] as InterviewRound[]).map(rnd => {
                const checked = selectedRounds.includes(rnd);
                return (
                  <label
                    key={rnd}
                    className={`flex items-center justify-between p-3 rounded-xl border cursor-pointer transition ${
                      checked ? 'bg-slate-800/90 border-blue-500/50 text-slate-200' : 'bg-slate-800/30 border-slate-800 text-slate-400'
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <input
                        type="checkbox"
                        checked={checked}
                        onChange={() => toggleRound(rnd)}
                        className="rounded border-slate-700 bg-slate-900 text-blue-600 focus:ring-0 w-4 h-4"
                      />
                      <span className="text-xs font-semibold">{rnd}</span>
                    </div>
                    <span className="text-[10px] font-mono text-slate-500">
                      {rnd === 'Behavioral' ? 'STAR / Resume' : rnd === 'Technical Deep-Dive' ? 'System Design' : 'Monaco / Big-O'}
                    </span>
                  </label>
                );
              })}
            </div>
          </div>

          {/* Tier 3: Category Tags */}
          <div className="bg-slate-900/80 border border-slate-800 rounded-2xl p-6 backdrop-blur-sm shadow-xl">
            <h3 className="text-sm font-semibold text-slate-300 uppercase tracking-wider mb-3">
              Tier 3: Category Tags
            </h3>
            <div className="flex flex-wrap gap-1.5">
              {(['DSA', 'System Design', 'Behavioral', 'Leadership', 'Project-based', 'Troubleshooting'] as QuestionCategory[]).map(cat => {
                const active = selectedCategories.includes(cat);
                return (
                  <button
                    key={cat}
                    type="button"
                    onClick={() => toggleCategory(cat)}
                    className={`px-2.5 py-1 rounded-lg text-xs font-medium border transition ${
                      active
                        ? 'bg-blue-600/20 border-blue-500 text-blue-300'
                        : 'bg-slate-800/40 border-slate-700/80 text-slate-400 hover:bg-slate-800'
                    }`}
                  >
                    {cat}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Tier 1: Per-Question Timer */}
          <div className="bg-slate-900/80 border border-slate-800 rounded-2xl p-6 backdrop-blur-sm shadow-xl">
            <h3 className="text-sm font-semibold text-slate-300 uppercase tracking-wider mb-3 flex items-center gap-2">
              <Clock className="w-4 h-4 text-amber-400" /> Tier 1: Per-Question Countdown
            </h3>
            <div className="grid grid-cols-3 gap-2">
              {[
                { label: '2 Mins', sec: 120 },
                { label: '5 Mins', sec: 300 },
                { label: 'Unlimited', sec: 9999 }
              ].map(item => (
                <button
                  key={item.label}
                  type="button"
                  onClick={() => setQuestionTimer(item.sec)}
                  className={`py-2 px-2 rounded-lg border text-xs font-medium transition ${
                    questionTimer === item.sec
                      ? 'bg-amber-500/20 border-amber-500 text-amber-300 font-bold'
                      : 'bg-slate-800/40 border-slate-700 text-slate-400 hover:bg-slate-800'
                  }`}
                >
                  {item.label}
                </button>
              ))}
            </div>
          </div>

          {/* Submit CTA */}
          <button
            type="submit"
            disabled={isLoading || selectedRounds.length === 0}
            className="w-full py-4 px-6 rounded-2xl bg-gradient-to-r from-blue-600 to-emerald-600 hover:from-blue-500 hover:to-emerald-500 disabled:opacity-50 disabled:cursor-not-allowed text-white font-bold text-base shadow-lg shadow-blue-500/20 transition-all flex items-center justify-center gap-2 transform hover:-translate-y-0.5 active:translate-y-0"
          >
            {isLoading ? (
              <span className="flex items-center gap-2">
                <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                Generating Company Questions...
              </span>
            ) : (
              <>
                Start AI Virtual Interview <ArrowRight className="w-5 h-5" />
              </>
            )}
          </button>
        </div>
      </form>
    </div>
  );
};
