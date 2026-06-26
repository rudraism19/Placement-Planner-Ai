import { useState } from "react";
import { 
  Brain, 
  Sparkles, 
  Play, 
  CheckCircle, 
  AlertCircle, 
  ArrowRight, 
  Award, 
  BookOpen, 
  RotateCcw,
  Plus
} from "lucide-react";
import { motion } from "motion/react";
import { StudentProfile, InterviewSession, InterviewQuestion } from "../types";

interface MockInterviewProps {
  profile: StudentProfile;
  interviewsHistory: InterviewSession[];
  onAddInterviewSession: (session: InterviewSession) => void;
}

export default function MockInterview({ profile, interviewsHistory, onAddInterviewSession }: MockInterviewProps) {
  const [activeTab, setActiveTab] = useState<"start" | "active" | "history">("start");
  
  // Configuration states
  const [type, setType] = useState<"Technical" | "HR">("Technical");
  const [role, setRole] = useState(profile.targetRole || "Software Development Engineer (SDE)");
  const [company, setCompany] = useState(profile.targetCompanies[0] || "Google");

  // Active Simulation states
  const [currentQuestion, setCurrentQuestion] = useState("");
  const [userAnswer, setUserAnswer] = useState("");
  const [loading, setLoading] = useState(false);
  const [askedQuestions, setAskedQuestions] = useState<string[]>([]);
  const [completedQuestions, setCompletedQuestions] = useState<InterviewQuestion[]>([]);
  
  // Evaluation overlay states
  const [currentEvaluation, setCurrentEvaluation] = useState<{
    score: number;
    aiFeedback: string;
    sampleGoodAnswer: string;
  } | null>(null);

  const startNewSession = async () => {
    setActiveTab("active");
    setLoading(true);
    setCurrentEvaluation(null);
    setAskedQuestions([]);
    setCompletedQuestions([]);
    setUserAnswer("");

    try {
      const response = await fetch("/api/mock-interview", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          type,
          role,
          company,
          previousQuestions: []
        })
      });

      if (!response.ok) throw new Error("Failed to fetch initial interview question.");
      const data = await response.json();
      setCurrentQuestion(data.question);
      setAskedQuestions([data.question]);
    } catch (err) {
      console.error(err);
      setCurrentQuestion("What is the difference between an Abstract Class and an Interface, and when would you use each in a modular system design?");
      setAskedQuestions(["What is the difference between an Abstract Class and an Interface, and when would you use each in a modular system design?"]);
    } finally {
      setLoading(false);
    }
  };

  const submitAnswer = async () => {
    if (!userAnswer.trim()) return;
    setLoading(true);

    try {
      const response = await fetch("/api/mock-interview", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          type,
          role,
          company,
          previousQuestions: askedQuestions,
          userAnswer
        })
      });

      if (!response.ok) throw new Error("Failed to evaluate your answer.");
      const data = await response.json(); // returns score, aiFeedback, sampleGoodAnswer
      
      setCurrentEvaluation({
        score: data.score,
        aiFeedback: data.aiFeedback,
        sampleGoodAnswer: data.sampleGoodAnswer
      });

      const evaluatedQuestion: InterviewQuestion = {
        id: `q_${Date.now()}`,
        question: currentQuestion,
        userAnswer: userAnswer.trim(),
        aiFeedback: data.aiFeedback,
        score: data.score
      };

      setCompletedQuestions([...completedQuestions, evaluatedQuestion]);
    } catch (err) {
      console.error(err);
      // Fallback local evaluation
      const fallbackEval = {
        score: 7,
        aiFeedback: "Good response outline, but could be structurally enhanced with concrete examples. State the time complexity or behavioral principles clearly to secure top marks.",
        sampleGoodAnswer: "A premium answer explicitly provides structural definitions, outlines exact tradeoffs, and cites real-world usage patterns."
      };
      setCurrentEvaluation(fallbackEval);

      const evaluatedQuestion: InterviewQuestion = {
        id: `q_${Date.now()}`,
        question: currentQuestion,
        userAnswer: userAnswer.trim(),
        aiFeedback: fallbackEval.aiFeedback,
        score: fallbackEval.score
      };

      setCompletedQuestions([...completedQuestions, evaluatedQuestion]);
    } finally {
      setLoading(false);
    }
  };

  const nextQuestion = async () => {
    setLoading(true);
    setCurrentEvaluation(null);
    setUserAnswer("");

    try {
      const response = await fetch("/api/mock-interview", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          type,
          role,
          company,
          previousQuestions: askedQuestions
        })
      });

      if (!response.ok) throw new Error("Failed to fetch next interview question.");
      const data = await response.json();
      setCurrentQuestion(data.question);
      setAskedQuestions([...askedQuestions, data.question]);
    } catch (err) {
      console.error(err);
      const fallback = type === "Technical" 
        ? "Explain the MVC (Model-View-Controller) architecture, and how it keeps code modular."
        : "Describe a scenario where you faced a major conflict in a programming team project and how you resolved it.";
      setCurrentQuestion(fallback);
      setAskedQuestions([...askedQuestions, fallback]);
    } finally {
      setLoading(false);
    }
  };

  const finishSession = () => {
    if (completedQuestions.length === 0) {
      setActiveTab("start");
      return;
    }

    const totalScore = completedQuestions.reduce((sum, q) => sum + q.score, 0);
    const averagePercentage = Math.round(((totalScore) / (completedQuestions.length * 10)) * 100);

    const newSession: InterviewSession = {
      id: `session_${Date.now()}`,
      date: new Date().toISOString().split("T")[0],
      type,
      role,
      company,
      score: averagePercentage,
      questions: completedQuestions,
      generalFeedback: `Completed ${completedQuestions.length} interview questions. Overall communication was clear. Areas for improvement include deeper theoretical elaboration on database and systems topics.`
    };

    onAddInterviewSession(newSession);
    setActiveTab("history");
    setCurrentEvaluation(null);
    setAskedQuestions([]);
    setCompletedQuestions([]);
  };

  return (
    <div className="space-y-6">
      
      {/* Header Banner */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl font-sans font-bold text-[#fafafa] tracking-tight">AI Mock Interview Board</h1>
          <p className="text-xs text-[#a1a1aa] font-sans mt-0.5">
            Conduct virtual SDE technical coding rounds or HR leadership sessions with instant scoring feedback.
          </p>
        </div>

        <div className="flex gap-2">
          <button 
            onClick={() => setActiveTab("start")}
            className={`px-3 py-1.5 rounded-lg text-xs font-sans font-semibold transition-colors ${activeTab === "start" ? "bg-indigo-600/10 text-indigo-400 border border-indigo-500/20" : "text-[#a1a1aa] hover:text-white"}`}
          >
            New Session
          </button>
          <button 
            onClick={() => setActiveTab("history")}
            className={`px-3 py-1.5 rounded-lg text-xs font-sans font-semibold transition-colors ${activeTab === "history" ? "bg-indigo-600/10 text-indigo-400 border border-indigo-500/20" : "text-[#a1a1aa] hover:text-white"}`}
          >
            Past Transcripts ({interviewsHistory.length})
          </button>
        </div>
      </div>

      {/* Start Config screen */}
      {activeTab === "start" && (
        <div className="max-w-xl mx-auto bg-[#18181b] border border-[#27272a] rounded-2xl p-6 space-y-6">
          <div className="text-center space-y-2">
            <div className="p-3 bg-indigo-600/10 border border-indigo-500/20 text-indigo-400 rounded-full w-12 h-12 flex items-center justify-center mx-auto mb-2">
              <Brain size={24} />
            </div>
            <h2 className="text-base font-sans font-bold text-[#fafafa]">Configure Interview Simulation</h2>
            <p className="text-xs text-[#a1a1aa] font-sans max-w-sm mx-auto">
              Choose your parameters. The career AI will act as a hiring manager from your selected company.
            </p>
          </div>

          <div className="space-y-4">
            {/* Type selector */}
            <div className="space-y-1.5">
              <label className="text-xxs font-sans font-semibold text-[#a1a1aa] uppercase block">Interview Format</label>
              <div className="grid grid-cols-2 gap-3">
                <button
                  type="button"
                  onClick={() => setType("Technical")}
                  className={`py-3 px-4 rounded-xl text-xs font-sans font-semibold border text-center transition-all duration-200 ${type === "Technical" ? "bg-indigo-600/15 border-indigo-500/40 text-indigo-300" : "bg-[#27272a] border-[#3f3f46] text-[#a1a1aa] hover:text-white"}`}
                >
                  Technical (DSA & Core CS)
                </button>
                <button
                  type="button"
                  onClick={() => setType("HR")}
                  className={`py-3 px-4 rounded-xl text-xs font-sans font-semibold border text-center transition-all duration-200 ${type === "HR" ? "bg-indigo-600/15 border-indigo-500/40 text-indigo-300" : "bg-[#27272a] border-[#3f3f46] text-[#a1a1aa] hover:text-white"}`}
                >
                  Behavioral & HR (Leadership)
                </button>
              </div>
            </div>

            {/* Role input */}
            <div className="space-y-1">
              <label className="text-xxs font-sans font-semibold text-[#a1a1aa] uppercase">Target Job Role</label>
              <input 
                type="text" 
                value={role}
                onChange={e => setRole(e.target.value)}
                className="w-full bg-[#27272a] border border-[#3f3f46] focus:border-indigo-500 rounded-xl px-3 py-2 text-xs text-white outline-none"
                required
              />
            </div>

            {/* Company selection */}
            <div className="space-y-1">
              <label className="text-xxs font-sans font-semibold text-[#a1a1aa] uppercase">Target Company Focus</label>
              <select 
                value={company}
                onChange={e => setCompany(e.target.value)}
                className="w-full bg-[#27272a] border border-[#3f3f46] focus:border-indigo-500 rounded-xl px-3 py-2 text-xs text-white outline-none"
              >
                {profile.targetCompanies.map(c => <option key={c} value={c}>{c}</option>)}
                <option value="Google">Google</option>
                <option value="Amazon">Amazon</option>
                <option value="Microsoft">Microsoft</option>
                <option value="TCS">TCS</option>
              </select>
            </div>

            <button 
              onClick={startNewSession}
              className="w-full py-2.5 bg-indigo-600 hover:bg-indigo-500 text-white rounded-xl text-xs font-sans font-bold flex items-center justify-center gap-1.5 transition-all duration-200 shadow-lg shadow-indigo-600/10"
            >
              <Play size={14} className="fill-current text-white" />
              Launch SDE Mock Interview
            </button>
          </div>
        </div>
      )}

      {/* Active Simulation Screen */}
      {activeTab === "active" && (
        <div className="max-w-2xl mx-auto space-y-6">
          
          {/* Main Question Display */}
          <div className="bg-[#18181b] border border-[#27272a] rounded-2xl p-6 space-y-4">
            <div className="flex items-center justify-between text-xxs font-mono text-[#a1a1aa] uppercase">
              <span>{type} ROUND ({company})</span>
              <span>Question {askedQuestions.length}</span>
            </div>

            {loading && !currentQuestion ? (
              <div className="py-6 text-center text-[#71717a] space-y-2">
                <Sparkles size={24} className="text-indigo-400 animate-spin mx-auto" />
                <p className="text-xs font-sans">Interview panel is analyzing your resume to generate a question...</p>
              </div>
            ) : (
              <h2 className="text-sm font-sans font-bold text-[#fafafa] leading-relaxed">
                "{currentQuestion}"
              </h2>
            )}
          </div>

          {/* Answer formulation */}
          {!currentEvaluation && (
            <div className="bg-[#18181b] border border-[#27272a] rounded-2xl p-6 space-y-4">
              <div className="space-y-1">
                <label className="text-xxs font-sans font-semibold text-[#a1a1aa] uppercase">Draft Your Answer</label>
                <textarea 
                  rows={6}
                  value={userAnswer}
                  onChange={e => setUserAnswer(e.target.value)}
                  placeholder="Type your response here. Try to explain your design, complexity, or situational logic. Be specific..."
                  className="w-full bg-[#27272a] border border-[#3f3f46] focus:border-indigo-500 rounded-xl px-3 py-2 text-xs text-[#fafafa] outline-none resize-none leading-relaxed"
                  disabled={loading}
                />
              </div>

              <div className="flex items-center justify-between">
                <button 
                  onClick={finishSession}
                  className="text-xs text-[#a1a1aa] hover:text-white font-sans font-semibold"
                >
                  Quit Interview
                </button>

                <button 
                  onClick={submitAnswer}
                  disabled={loading || !userAnswer.trim()}
                  className="px-5 py-2 bg-indigo-600 hover:bg-indigo-500 disabled:opacity-50 text-white rounded-xl text-xs font-sans font-semibold flex items-center gap-1.5 transition-colors"
                >
                  <Sparkles size={14} className={loading ? "animate-spin" : "animate-pulse"} />
                  {loading ? "Evaluating..." : "Submit Answer to AI"}
                </button>
              </div>
            </div>
          )}

          {/* Feedback & Evaluations */}
          {currentEvaluation && (
            <motion.div 
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="space-y-6 animate-fade-in"
            >
              
              {/* Score and Core Review */}
              <div className="grid grid-cols-1 md:grid-cols-4 gap-6 items-stretch">
                
                {/* Visual Score index */}
                <div className="bg-[#18181b] border border-[#27272a] rounded-2xl p-5 flex flex-col items-center justify-center text-center">
                  <span className="text-xxs font-sans font-bold text-[#a1a1aa] uppercase">Question Score</span>
                  <div className="text-4xl font-mono font-black text-indigo-400 mt-2">{currentEvaluation.score}/10</div>
                  <span className="text-xxs text-[#71717a] font-sans mt-2">Overall standard rating</span>
                </div>

                {/* AI Review text */}
                <div className="bg-[#18181b] border border-[#27272a] rounded-2xl p-5 md:col-span-3 space-y-2 flex flex-col justify-between">
                  <div className="space-y-1">
                    <span className="text-xxs font-bold text-indigo-400 uppercase tracking-wide">AI Panel Evaluator Comments</span>
                    <p className="text-xxs text-[#a1a1aa] font-sans leading-relaxed">{currentEvaluation.aiFeedback}</p>
                  </div>
                </div>

              </div>

              {/* Sample Outstanding Answer */}
              <div className="bg-[#18181b] border border-[#27272a] rounded-2xl p-5 space-y-2">
                <div className="flex items-center gap-1.5 text-xs font-semibold text-[#fafafa]">
                  <Sparkles size={14} className="text-indigo-400 animate-pulse" />
                  <span>IDEAL SAMPLE ANSWER</span>
                </div>
                <p className="text-xxs text-[#a1a1aa] leading-relaxed font-sans bg-[#09090b]/50 p-3 rounded-xl border border-[#27272a] italic">
                  "{currentEvaluation.sampleGoodAnswer}"
                </p>
              </div>

              {/* Action buttons */}
              <div className="flex justify-between items-center bg-[#18181b] border border-[#27272a] rounded-2xl p-4">
                <button 
                  onClick={finishSession}
                  className="text-xs text-[#a1a1aa] hover:text-white font-sans font-semibold"
                >
                  End & Save Transcript
                </button>

                <button 
                  onClick={nextQuestion}
                  disabled={loading}
                  className="px-4 py-2 bg-indigo-600 hover:bg-indigo-500 text-white rounded-xl text-xs font-sans font-semibold flex items-center gap-1.5 transition-colors"
                >
                  Next Question <ArrowRight size={14} />
                </button>
              </div>

            </motion.div>
          )}

        </div>
      )}

      {/* History tab */}
      {activeTab === "history" && (
        <div className="space-y-6">
          {interviewsHistory.map((sess) => (
            <div 
              key={sess.id}
              className="bg-[#18181b] border border-[#27272a] rounded-2xl p-5 space-y-4"
            >
              {/* Header block */}
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-3 border-b border-[#27272a] pb-3">
                <div>
                  <div className="flex items-center gap-2">
                    <span className="text-xxs font-mono font-semibold bg-indigo-500/10 text-indigo-400 px-2 py-0.5 rounded uppercase">
                      {sess.type} Round
                    </span>
                    <span className="text-xs text-[#a1a1aa] font-sans">{sess.date}</span>
                  </div>
                  <h3 className="text-sm font-sans font-bold text-[#fafafa] mt-1.5">
                    {sess.role} SDE Simulation for {sess.company}
                  </h3>
                </div>

                <div className="flex items-baseline gap-1 bg-indigo-600/10 border border-indigo-500/20 px-3 py-1 rounded-xl">
                  <span className="text-xs text-[#a1a1aa] font-sans">Avg Score:</span>
                  <span className="text-sm font-mono font-bold text-indigo-400">{sess.score}%</span>
                </div>
              </div>

              {/* Questions list */}
              <div className="space-y-4">
                {sess.questions.map((q, idx) => (
                  <div key={idx} className="space-y-2 p-3 bg-[#27272a] border border-[#3f3f46] rounded-xl">
                    <div className="flex justify-between items-start gap-4">
                      <div className="flex items-start gap-2.5">
                        <span className="text-[10px] font-mono font-bold text-indigo-400 bg-indigo-500/10 px-1.5 py-0.5 rounded shrink-0">Q{idx+1}</span>
                        <h4 className="text-xxs font-sans font-bold text-[#fafafa]">"{q.question}"</h4>
                      </div>
                      <span className="text-xxs font-mono font-semibold text-indigo-400 bg-indigo-500/10 px-1.5 rounded shrink-0">Score: {q.score}/10</span>
                    </div>

                    <div className="text-xxs text-[#a1a1aa] font-sans leading-relaxed pl-7">
                      <b className="text-[#71717a] text-[10px] uppercase block mb-0.5">Your Response:</b>
                      <span className="italic">"{q.userAnswer}"</span>
                    </div>

                    <div className="text-xxs text-[#a1a1aa] font-sans leading-relaxed pl-7 border-t border-[#3f3f46]/60 pt-2 flex items-start gap-1.5">
                      <Sparkles size={12} className="text-indigo-400 mt-0.5 shrink-0" />
                      <div>
                        <b className="text-indigo-400 text-[10px] uppercase block mb-0.5">AI Evaluator Review:</b>
                        <span>{q.aiFeedback}</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              {/* General Feedback summary */}
              <div className="p-3.5 bg-[#09090b]/50 border border-[#27272a] rounded-xl text-xxs text-[#a1a1aa] font-sans leading-relaxed">
                <span className="font-bold text-[#fafafa] uppercase block mb-1">GENERAL PANEL ADVICE</span>
                {sess.generalFeedback}
              </div>

            </div>
          ))}

          {interviewsHistory.length === 0 && (
            <div className="text-center py-12 border border-dashed border-[#27272a] rounded-2xl max-w-xl mx-auto">
              <Brain size={40} className="text-[#71717a] mx-auto mb-3" />
              <p className="text-xs text-[#71717a] font-sans italic">No mock interview sessions completed yet. Start a session above!</p>
            </div>
          )}
        </div>
      )}

    </div>
  );
}
