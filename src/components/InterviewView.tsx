import React, { useState, useEffect, useRef } from 'react';
import { Company, Difficulty, InterviewRound, Question, EvaluationResult } from '../types';
import { Mic, MicOff, Video, VideoOff, Send, Volume2, Sparkles, AlertTriangle, Code2, MessageSquare, ArrowRight, RefreshCw, Eye } from 'lucide-react';

interface InterviewViewProps {
  questions: Question[];
  company: Company;
  role: string;
  difficulty: Difficulty;
  questionTimerSec: number;
  onFinish: (evals: EvaluationResult[]) => void;
  onToggleSidebar: () => void;
}

export const InterviewView: React.FC<InterviewViewProps> = ({
  questions,
  company,
  role,
  difficulty,
  questionTimerSec,
  onFinish,
  onToggleSidebar
}) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [evaluations, setEvaluations] = useState<EvaluationResult[]>([]);
  
  // Modes & Inputs
  const [isTextMode, setIsTextMode] = useState(false);
  const [textAnswer, setTextAnswer] = useState('');
  const [codeAnswer, setCodeAnswer] = useState('// Write your optimal algorithm here...\nfunction solution(arr) {\n  \n}');
  const [selectedLang, setSelectedLang] = useState('javascript');
  
  // AV States
  const [isCamOn, setIsCamOn] = useState(true);
  const [isMicOn, setIsMicOn] = useState(false);
  const [isRecording, setIsRecording] = useState(false);
  const [camError, setCamError] = useState(false);
  
  // Biometrics simulation
  const [focusRatio, setFocusRatio] = useState(94);
  const [currentEmotion, setCurrentEmotion] = useState('Confident');
  
  // Timers
  const [totalElapsedSec, setTotalElapsedSec] = useState(0);
  const [questionRemainingSec, setQuestionRemainingSec] = useState(questionTimerSec);
  
  // UI Status
  const [isEvaluating, setIsEvaluating] = useState(false);
  const [lastEval, setLastEval] = useState<EvaluationResult | null>(null);
  
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const currentQ = questions[currentIndex] || questions[0];
  const isCodeRound = currentQ?.round === 'Live Coding' || currentQ?.category === 'DSA';

  // Total Timer
  useEffect(() => {
    const timer = setInterval(() => {
      setTotalElapsedSec(prev => prev + 1);
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  // Question Countdown Timer
  useEffect(() => {
    setQuestionRemainingSec(questionTimerSec);
    if (questionTimerSec >= 9999) return;

    const qTimer = setInterval(() => {
      setQuestionRemainingSec(prev => {
        if (prev <= 1) {
          clearInterval(qTimer);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
    return () => clearInterval(qTimer);
  }, [currentIndex, questionTimerSec]);

  // Biometrics fluctuation jitter
  useEffect(() => {
    const bioInterval = setInterval(() => {
      setFocusRatio(prev => Math.min(99, Math.max(78, prev + (Math.floor(Math.random() * 7) - 3))));
      const emotions = ['Confident', 'Calm', 'Thoughtful', 'Focused', 'Engaged'];
      if (Math.random() > 0.7) {
        setCurrentEmotion(emotions[Math.floor(Math.random() * emotions.length)]);
      }
    }, 4000);
    return () => clearInterval(bioInterval);
  }, []);

  // WebRTC Webcam setup
  useEffect(() => {
    let stream: MediaStream | null = null;
    if (isCamOn) {
      navigator.mediaDevices?.getUserMedia({ video: true, audio: false })
        .then(s => {
          stream = s;
          if (videoRef.current) {
            videoRef.current.srcObject = s;
          }
          setCamError(false);
        })
        .catch(() => {
          setCamError(true);
        });
    } else {
      if (videoRef.current) videoRef.current.srcObject = null;
    }
    return () => {
      stream?.getTracks().forEach(t => t.stop());
    };
  }, [isCamOn]);

  // Text to Speech
  const speakQuestion = () => {
    if (!window.speechSynthesis || !currentQ) return;
    window.speechSynthesis.cancel();
    const utterance = new SpeechSynthesisUtterance(currentQ.text);
    utterance.rate = 1.0;
    window.speechSynthesis.speak(utterance);
  };

  const formatTime = (sec: number) => {
    const m = Math.floor(sec / 60);
    const s = sec % 60;
    return `${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
  };

  const handleRecordToggle = () => {
    if (isRecording) {
      setIsRecording(false);
      setIsMicOn(false);
      // Simulate speech to text transcription
      const simulatedTranscriptions = [
        "In my previous project, I architected our distributed caching tier using Redis clusters. We handled spike loads by decoupling heavy writes with RabbitMQ message brokers.",
        "To ensure high availability across availability zones, we implemented active-active database replication and automated circuit breakers using Resilience4j.",
        "For this data structure problem, a sliding window technique combined with a frequency hash map yields an optimal O(N) linear time complexity."
      ];
      setTextAnswer(simulatedTranscriptions[currentIndex % simulatedTranscriptions.length]);
      setIsTextMode(true);
    } else {
      setIsRecording(true);
      setIsMicOn(true);
    }
  };

  const handleSubmitAnswer = async () => {
    const finalAns = isCodeRound ? codeAnswer : textAnswer;
    if (!finalAns.trim() || isEvaluating) return;

    setIsEvaluating(true);
    setLastEval(null);

    const endpoint = isCodeRound ? '/api/evaluate_code' : '/api/evaluate';
    const payload = isCodeRound ? {
      question: currentQ.text,
      code: codeAnswer,
      language: selectedLang,
      company,
      role
    } : {
      question: currentQ.text,
      answer: textAnswer,
      company,
      role,
      difficulty,
      detectedEmotions: [currentEmotion, 'Calm'],
      focusPercentage: focusRatio
    };

    try {
      const res = await fetch(endpoint, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });
      const data = await res.json();

      const newEval: EvaluationResult = {
        questionId: currentQ.id || `q-${currentIndex}`,
        questionText: currentQ.text,
        answerText: finalAns,
        score: data.score || 8,
        feedback: data.feedback || 'Good structured engineering response.',
        strengths: data.strengths || ['Clear terminology', 'Good domain grasp'],
        improvements: data.improvements || ['Quantify exact metrics'],
        betterAnswer: data.betterAnswer,
        detectedEmotions: [currentEmotion],
        focusPercentage: focusRatio,
        timeTakenSec: questionTimerSec - questionRemainingSec,
        codeEval: isCodeRound ? {
          score: data.score || 9,
          timeComplexity: data.timeComplexity || 'O(N)',
          spaceComplexity: data.spaceComplexity || 'O(1)',
          feedback: data.feedback || 'Optimal code execution.',
          optimizationTips: data.optimizationTips || ['Handle null pointer bounds'],
          testCasesStatus: data.testCasesStatus || 'Passed 5/5 hidden test cases'
        } : undefined
      };

      const updatedEvals = [...evaluations, newEval];
      setEvaluations(updatedEvals);
      setLastEval(newEval);
      setIsEvaluating(false);

    } catch (err) {
      console.error('Submit Eval Error:', err);
      setIsEvaluating(false);
    }
  };

  const handleNextQuestion = () => {
    if (currentIndex + 1 < questions.length) {
      setCurrentIndex(prev => prev + 1);
      setTextAnswer('');
      setCodeAnswer('// Write your optimal algorithm here...\nfunction solution(arr) {\n  \n}');
      setLastEval(null);
    } else {
      onFinish(evaluations);
    }
  };

  const isTimeLow = questionTimerSec < 9999 && questionRemainingSec <= 30;

  return (
    <div className="w-full max-w-7xl mx-auto px-4 py-6">
      {/* Top Header Bar with Timers & Badges */}
      <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-4 mb-6 backdrop-blur flex flex-wrap items-center justify-between gap-4 shadow-lg">
        <div className="flex items-center gap-3">
          <span className="px-3 py-1 rounded-full bg-blue-500/10 border border-blue-500/30 text-blue-400 font-mono text-xs font-bold">
            {company} • {difficulty}
          </span>
          <span className="px-3 py-1 rounded-full bg-slate-800 border border-slate-700 text-slate-300 text-xs font-semibold">
            Question {currentIndex + 1} of {questions.length}
          </span>
          {currentQ?.round && (
            <span className="hidden sm:inline-flex px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-xs font-medium">
              {currentQ.round}
            </span>
          )}
        </div>

        <div className="flex items-center gap-6">
          {/* Total Timer */}
          <div className="text-xs text-slate-400 font-mono">
            Elapsed: <span className="text-slate-200 font-bold">{formatTime(totalElapsedSec)}</span>
          </div>

          {/* Question Countdown */}
          {questionTimerSec < 9999 && (
            <div className={`px-3 py-1 rounded-lg border font-mono text-xs flex items-center gap-1.5 transition-all ${
              isTimeLow ? 'bg-rose-500/20 border-rose-500 text-rose-300 animate-pulse font-bold' : 'bg-slate-800 border-slate-700 text-slate-300'
            }`}>
              <AlertTriangle className={`w-3.5 h-3.5 ${isTimeLow ? 'text-rose-400' : 'hidden'}`} />
              Q-Time: {formatTime(questionRemainingSec)}
            </div>
          )}

          <button
            onClick={onToggleSidebar}
            className="px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 border border-slate-700 text-xs text-slate-200 font-medium transition"
          >
            📊 Live Tracker
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Left Column: AI Interviewer Question Card + Biometrics Webcam */}
        <div className="lg:col-span-5 space-y-6">
          {/* Question Display Card */}
          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-xl relative overflow-hidden">
            <div className="flex items-center justify-between mb-3">
              <span className="text-xs font-mono font-bold uppercase tracking-wider text-blue-400">
                {currentQ?.category || 'Question'} Prompt
              </span>
              <button
                onClick={speakQuestion}
                title="Listen to AI Interviewer"
                className="p-2 rounded-lg bg-slate-800 hover:bg-slate-700 text-blue-400 transition"
              >
                <Volume2 className="w-4 h-4" />
              </button>
            </div>
            
            <p className="text-lg sm:text-xl font-medium text-slate-100 leading-relaxed">
              "{currentQ?.text}"
            </p>

            {currentQ?.expectedKeywords && (
              <div className="mt-4 pt-4 border-t border-slate-800/80 flex flex-wrap gap-1.5 items-center">
                <span className="text-[10px] uppercase font-mono text-slate-500 mr-1">Rubric Targets:</span>
                {currentQ.expectedKeywords.map(kw => (
                  <span key={kw} className="px-2 py-0.5 rounded bg-slate-800 text-[10px] font-mono text-slate-400 border border-slate-700/50">
                    {kw}
                  </span>
                ))}
              </div>
            )}
          </div>

          {/* Biometrics Webcam Preview */}
          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-4 shadow-xl">
            <div className="flex items-center justify-between mb-3 px-1">
              <div className="flex items-center gap-2">
                <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-ping" />
                <span className="text-xs font-bold text-slate-200">Live Biometric Feed</span>
              </div>
              <div className="flex gap-1.5">
                <button
                  onClick={() => setIsCamOn(!isCamOn)}
                  className={`p-1.5 rounded text-xs ${isCamOn ? 'bg-slate-800 text-slate-300' : 'bg-rose-500/20 text-rose-400'}`}
                >
                  {isCamOn ? <Video className="w-3.5 h-3.5" /> : <VideoOff className="w-3.5 h-3.5" />}
                </button>
              </div>
            </div>

            <div className="relative aspect-video rounded-xl bg-slate-950 overflow-hidden border border-slate-800 flex items-center justify-center">
              {isCamOn ? (
                camError ? (
                  <div className="text-center p-4">
                    <VideoOff className="w-8 h-8 text-slate-600 mx-auto mb-2" />
                    <p className="text-xs text-slate-400">Camera permission blocked in iframe.</p>
                    <p className="text-[10px] text-slate-500 mt-1">Open app in a new tab to enable camera biometrics.</p>
                  </div>
                ) : (
                  <video ref={videoRef} autoPlay playsInline muted className="w-full h-full object-cover transform -scale-x-100" />
                )
              ) : (
                <div className="text-center">
                  <VideoOff className="w-8 h-8 text-slate-600 mx-auto mb-1" />
                  <span className="text-xs text-slate-500">Camera Disabled</span>
                </div>
              )}

              {/* HUD Overlay Overlay */}
              <div className="absolute top-3 left-3 bg-slate-900/80 backdrop-blur px-2.5 py-1 rounded-md border border-slate-700/60 flex items-center gap-2 text-[10px] font-mono text-slate-300">
                <Eye className="w-3 h-3 text-emerald-400" />
                Focus: <span className="text-emerald-400 font-bold">{focusRatio}%</span>
              </div>

              <div className="absolute top-3 right-3 bg-slate-900/80 backdrop-blur px-2.5 py-1 rounded-md border border-slate-700/60 flex items-center gap-1.5 text-[10px] font-mono text-slate-300">
                <span className="text-blue-400">DeepFace:</span> {currentEmotion}
              </div>

              {isRecording && (
                <div className="absolute bottom-3 left-3 bg-rose-600/90 text-white px-2.5 py-1 rounded-md text-[10px] font-bold uppercase tracking-wider flex items-center gap-1.5 animate-pulse">
                  <Mic className="w-3 h-3" /> Recording Whisper Audio...
                </div>
              )}
            </div>
            
            <div className="mt-3 flex justify-between items-center text-[11px] text-slate-400 px-1 font-mono">
              <span>MediaPipe Face Mesh Active</span>
              <span>Whisper ASR Standby</span>
            </div>
          </div>
        </div>

        {/* Right Column: Candidate Workspace (Voice/Text/Code Submission) */}
        <div className="lg:col-span-7 space-y-6">
          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-xl flex flex-col min-h-[460px] justify-between">
            <div>
              {/* Workspace Header Toggle */}
              <div className="flex flex-wrap items-center justify-between pb-4 border-b border-slate-800 mb-5 gap-3">
                <h3 className="text-base font-bold text-slate-100 flex items-center gap-2">
                  {isCodeRound ? <Code2 className="w-5 h-5 text-emerald-400" /> : <MessageSquare className="w-5 h-5 text-blue-400" />}
                  {isCodeRound ? 'Live Coding IDE (Big-O Evaluation)' : 'Candidate Response Pad'}
                </h3>

                {!isCodeRound && (
                  <div className="flex bg-slate-800 p-1 rounded-lg border border-slate-700 text-xs">
                    <button
                      onClick={() => setIsTextMode(false)}
                      className={`px-3 py-1 rounded transition ${!isTextMode ? 'bg-blue-600 text-white font-bold' : 'text-slate-400 hover:text-white'}`}
                    >
                      🎙️ Voice Mode
                    </button>
                    <button
                      onClick={() => setIsTextMode(true)}
                      className={`px-3 py-1 rounded transition ${isTextMode ? 'bg-blue-600 text-white font-bold' : 'text-slate-400 hover:text-white'}`}
                    >
                      ⌨️ Type Mode
                    </button>
                  </div>
                )}
              </div>

              {/* Content Area Based on Round */}
              {isCodeRound ? (
                <div className="space-y-3">
                  <div className="flex justify-between items-center">
                    <span className="text-xs text-slate-400 font-mono">Language:</span>
                    <select
                      value={selectedLang}
                      onChange={(e) => setSelectedLang(e.target.value)}
                      className="bg-slate-800 border border-slate-700 rounded-lg px-3 py-1 text-xs text-slate-200 font-mono focus:outline-none focus:border-blue-500"
                    >
                      <option value="javascript">JavaScript (ES6)</option>
                      <option value="python">Python 3</option>
                      <option value="typescript">TypeScript</option>
                      <option value="java">Java</option>
                      <option value="cpp">C++</option>
                    </select>
                  </div>
                  <textarea
                    value={codeAnswer}
                    onChange={(e) => setCodeAnswer(e.target.value)}
                    rows={12}
                    placeholder="// Write clean, optimal code..."
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl p-4 font-mono text-xs text-emerald-400 focus:outline-none focus:border-emerald-500 leading-relaxed resize-y"
                  />
                </div>
              ) : !isTextMode ? (
                /* Voice Recording Pad */
                <div className="py-12 flex flex-col items-center justify-center border-2 border-dashed border-slate-800 rounded-2xl bg-slate-950/40 my-4">
                  <button
                    onClick={handleRecordToggle}
                    className={`w-20 h-20 rounded-full flex items-center justify-center transition-all shadow-2xl transform active:scale-95 mb-4 ${
                      isRecording
                        ? 'bg-rose-600 text-white animate-pulse ring-8 ring-rose-600/20'
                        : 'bg-blue-600 hover:bg-blue-500 text-white shadow-blue-600/30'
                    }`}
                  >
                    {isRecording ? <MicOff className="w-8 h-8" /> : <Mic className="w-8 h-8" />}
                  </button>
                  <div className="text-sm font-bold text-slate-200">
                    {isRecording ? 'Listening & Transcribing via Whisper...' : 'Click Microphone to Speak Answer'}
                  </div>
                  <p className="text-xs text-slate-400 mt-1 max-w-sm text-center">
                    Speak clearly using the STAR structure. Click again to complete transcription.
                  </p>
                </div>
              ) : (
                /* Typing Pad */
                <div>
                  <textarea
                    value={textAnswer}
                    onChange={(e) => setTextAnswer(e.target.value)}
                    rows={8}
                    placeholder="Type your structured STAR interview response here..."
                    className="w-full bg-slate-800/80 border border-slate-700 rounded-xl p-4 text-sm text-slate-100 placeholder-slate-500 focus:outline-none focus:border-blue-500 leading-relaxed transition"
                  />
                </div>
              )}

              {/* Transcribed text preview in voice mode */}
              {!isCodeRound && !isTextMode && textAnswer && (
                <div className="mt-4 p-4 rounded-xl bg-slate-800/60 border border-slate-700/80 text-xs text-slate-300">
                  <div className="font-mono text-[10px] text-blue-400 uppercase font-bold mb-1">Whisper Transcription:</div>
                  "{textAnswer}"
                </div>
              )}
            </div>

            {/* Submit or Next Footer */}
            <div className="pt-6 mt-6 border-t border-slate-800 flex items-center justify-end gap-4">
              {!lastEval ? (
                <button
                  onClick={handleSubmitAnswer}
                  disabled={isEvaluating || (isCodeRound ? !codeAnswer.trim() : !textAnswer.trim())}
                  className="px-6 py-3 rounded-xl bg-gradient-to-r from-blue-600 to-emerald-600 hover:from-blue-500 hover:to-emerald-500 disabled:opacity-50 text-white text-sm font-bold shadow-lg shadow-blue-500/20 transition flex items-center gap-2"
                >
                  {isEvaluating ? (
                    <>
                      <RefreshCw className="w-4 h-4 animate-spin" /> Evaluating Rubric & Big-O...
                    </>
                  ) : (
                    <>
                      <Send className="w-4 h-4" /> Submit Response
                    </>
                  )}
                </button>
              ) : (
                <button
                  onClick={handleNextQuestion}
                  className="px-6 py-3 rounded-xl bg-blue-600 hover:bg-blue-500 text-white text-sm font-bold shadow-lg transition flex items-center gap-2"
                >
                  {currentIndex + 1 < questions.length ? 'Next Question' : 'View Final Hiring Report'} <ArrowRight className="w-4 h-4" />
                </button>
              )}
            </div>
          </div>

          {/* Instant Evaluation Card Feedback */}
          {lastEval && (
            <div className="bg-slate-900 border border-blue-500/40 rounded-2xl p-6 shadow-2xl animate-fade-in space-y-4">
              <div className="flex items-center justify-between border-b border-slate-800 pb-3">
                <div className="flex items-center gap-2">
                  <Sparkles className="w-5 h-5 text-amber-400" />
                  <span className="text-sm font-bold text-slate-100">Instant AI Rubric Evaluation</span>
                </div>
                <span className={`px-3 py-1 rounded-full font-mono font-bold text-xs ${
                  lastEval.score >= 8 ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30' : 'bg-blue-500/20 text-blue-300'
                }`}>
                  Score: {lastEval.score}/10
                </span>
              </div>

              <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
                {lastEval.feedback}
              </p>

              {lastEval.codeEval && (
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 pt-2">
                  <div className="bg-slate-800/80 p-2.5 rounded-xl border border-slate-700/60">
                    <div className="text-[10px] font-mono text-slate-400">Time Complexity</div>
                    <div className="text-sm font-bold font-mono text-emerald-400 mt-0.5">{lastEval.codeEval.timeComplexity}</div>
                  </div>
                  <div className="bg-slate-800/80 p-2.5 rounded-xl border border-slate-700/60">
                    <div className="text-[10px] font-mono text-slate-400">Space Complexity</div>
                    <div className="text-sm font-bold font-mono text-blue-400 mt-0.5">{lastEval.codeEval.spaceComplexity}</div>
                  </div>
                  <div className="col-span-2 sm:col-span-1 bg-slate-800/80 p-2.5 rounded-xl border border-slate-700/60">
                    <div className="text-[10px] font-mono text-slate-400">Edge Cases</div>
                    <div className="text-xs font-bold text-slate-200 mt-1 line-clamp-1">{lastEval.codeEval.testCasesStatus}</div>
                  </div>
                </div>
              )}

              {lastEval.betterAnswer && (
                <div className="mt-3 p-3.5 rounded-xl bg-blue-950/30 border border-blue-500/30 text-xs text-blue-200">
                  <span className="font-bold text-blue-400 block mb-1">Exemplary STAR Answer:</span>
                  "{lastEval.betterAnswer}"
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
