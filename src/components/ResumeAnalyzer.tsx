import React, { useState } from "react";
import { 
  FileSearch, 
  Sparkles, 
  CheckCircle, 
  AlertCircle, 
  TrendingUp, 
  Copy, 
  ArrowRight,
  ShieldCheck,
  FileText
} from "lucide-react";
import { motion } from "motion/react";
import { StudentProfile, ResumeAnalysisResult } from "../types";

interface ResumeAnalyzerProps {
  profile: StudentProfile;
  onUpdateResumeText: (text: string) => void;
  savedAnalysis?: ResumeAnalysisResult;
  onSaveAnalysis: (analysis: ResumeAnalysisResult) => void;
}

export default function ResumeAnalyzer({ 
  profile, 
  onUpdateResumeText, 
  savedAnalysis, 
  onSaveAnalysis 
}: ResumeAnalyzerProps) {
  const [resumeInput, setResumeInput] = useState(profile.resumeText || "");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [copiedIndex, setCopiedIndex] = useState<number | null>(null);

  const handleRunAnalysis = async () => {
    if (!resumeInput.trim()) {
      setError("Please paste your resume plaintext or fill in the profile resume text first.");
      return;
    }
    
    setLoading(true);
    setError(null);
    onUpdateResumeText(resumeInput);

    try {
      const response = await fetch("/api/analyze-resume", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          resumeText: resumeInput,
          targetRole: profile.targetRole,
          targetCompanies: profile.targetCompanies
        })
      });

      if (!response.ok) {
        const errData = await response.json();
        throw new Error(errData.error || "Failed to perform AI Resume review.");
      }

      const data = await response.json();
      onSaveAnalysis(data);
    } catch (err: any) {
      console.error(err);
      setError(err.message || "An unexpected error occurred during resume audit.");
    } finally {
      setLoading(false);
    }
  };

  const handleCopyText = (text: string, idx: number) => {
    navigator.clipboard.writeText(text);
    setCopiedIndex(idx);
    setTimeout(() => setCopiedIndex(null), 2000);
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (evt) => {
      const text = evt.target?.result as string;
      if (text) {
        setResumeInput(text);
        onUpdateResumeText(text);
      }
    };
    reader.readAsText(file);
  };

  // Helper score background color
  const getScoreBg = (score: number) => {
    if (score >= 85) return "text-emerald-400 bg-emerald-500/10 border-emerald-500/20";
    if (score >= 70) return "text-indigo-400 bg-indigo-500/10 border-indigo-500/20";
    return "text-orange-400 bg-orange-500/10 border-orange-500/20";
  };

  return (
    <div className="space-y-6">
      
      {/* Top Title Banner */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl font-sans font-bold text-[#fafafa] tracking-tight">AI Resume Audit & ATS Review</h1>
          <p className="text-xs text-[#a1a1aa] font-sans mt-0.5">
            Evaluate formatting density, grammatical structures, missing SDE keywords, and quantifiable achievements.
          </p>
        </div>
      </div>

      {/* Analyzer Main Grid split */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* Left Side: Plaintext Inputs (5 cols) */}
        <div className="lg:col-span-5 space-y-4">
          <div className="bg-[#18181b] border border-[#27272a] rounded-2xl p-5 space-y-4">
            <div className="flex items-center justify-between border-b border-[#27272a] pb-3">
              <h2 className="text-xs font-sans font-bold text-[#fafafa] uppercase tracking-wider">Paste Plaintext CV</h2>
              
              {/* Optional Local File Reader */}
              <label className="text-[10px] text-indigo-400 hover:text-indigo-300 font-semibold cursor-pointer">
                <span>Upload TXT file</span>
                <input 
                  type="file" 
                  accept=".txt,.md" 
                  onChange={handleFileUpload} 
                  className="hidden" 
                />
              </label>
            </div>

            <p className="text-xxs text-[#71717a] font-sans leading-normal">
              Copy-paste the complete text representation of your resume (education, projects, frameworks, social links) to execute the audit checks.
            </p>

            <textarea 
              rows={12}
              value={resumeInput}
              onChange={(e) => setResumeInput(e.target.value)}
              placeholder="PASTE RESUME CONTENT HERE...&#10;&#10;e.g.&#10;OBJECTIVE: Dedicated SDE Candidate...&#10;EDUCATION: B.Tech Computer Science...&#10;PROJECTS: Scaled task queues..."
              className="w-full bg-[#27272a] border border-[#3f3f46] focus:border-indigo-500 rounded-xl px-3 py-2 text-xxs font-mono text-[#fafafa] outline-none resize-none"
            />

            {error && (
              <div className="bg-orange-500/10 border border-orange-500/20 text-orange-400 rounded-xl p-3 flex gap-2.5 text-xxs font-sans leading-normal">
                <AlertCircle size={15} className="shrink-0 mt-0.5" />
                <span>{error}</span>
              </div>
            )}

            <button
              onClick={handleRunAnalysis}
              disabled={loading}
              className="w-full py-2.5 bg-indigo-600 hover:bg-indigo-500 disabled:opacity-50 text-white text-xs font-sans font-semibold rounded-xl flex items-center justify-center gap-1.5 shadow-lg shadow-indigo-600/10 transition-colors"
            >
              <Sparkles size={15} className={loading ? "animate-spin" : "animate-pulse"} />
              {loading ? "Evaluating ATS matrices..." : "Run AI Resume Audit"}
            </button>
          </div>
        </div>

        {/* Right Side: ATS audit results (7 cols) */}
        <div className="lg:col-span-7 space-y-6">
          
          {loading && (
            <div className="bg-[#18181b] border border-[#27272a] rounded-2xl p-12 text-center flex flex-col items-center justify-center space-y-4">
              <Sparkles size={40} className="text-indigo-400 animate-spin" />
              <div className="space-y-1">
                <h3 className="text-sm font-sans font-bold text-[#fafafa]">AI ATS Evaluator is reading your data...</h3>
                <p className="text-xs text-[#71717a] font-sans max-w-sm mx-auto">
                  Parsing grammar syntax, verifying keyword occurrences, and generating highly tailored X-Y-Z SDE project metrics.
                </p>
              </div>
            </div>
          )}

          {!loading && !savedAnalysis && (
            <div className="bg-[#18181b] border border-[#27272a] rounded-2xl p-12 text-center flex flex-col items-center justify-center space-y-4">
              <FileSearch size={40} className="text-[#71717a]" />
              <div className="space-y-1">
                <h3 className="text-sm font-sans font-bold text-[#fafafa]">Ready to execute resume audit</h3>
                <p className="text-xs text-[#71717a] font-sans max-w-sm mx-auto">
                  Submit your plain-text data on the left to receive scores, strengths list, critical keywords, and quantifiable project metrics.
                </p>
              </div>
            </div>
          )}

          {!loading && savedAnalysis && (
            <div className="space-y-6">
              
              {/* Score grids */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                
                {/* ATS Index */}
                <div className={`border rounded-2xl p-4 text-center ${getScoreBg(savedAnalysis.atsCompatibilityScore)}`}>
                  <span className="text-xxs font-sans font-semibold text-[#a1a1aa] uppercase tracking-wide">ATS Compatibility</span>
                  <div className="text-2xl font-mono font-black mt-1.5">{savedAnalysis.atsCompatibilityScore}%</div>
                </div>

                {/* Formatting */}
                <div className={`border rounded-2xl p-4 text-center ${getScoreBg(savedAnalysis.formattingScore)}`}>
                  <span className="text-xxs font-sans font-semibold text-[#a1a1aa] uppercase tracking-wide">Formatting density</span>
                  <div className="text-2xl font-mono font-black mt-1.5">{savedAnalysis.formattingScore}%</div>
                </div>

                {/* Grammar */}
                <div className={`border rounded-2xl p-4 text-center ${getScoreBg(savedAnalysis.grammarScore)}`}>
                  <span className="text-xxs font-sans font-semibold text-[#a1a1aa] uppercase tracking-wide">Grammar syntax</span>
                  <div className="text-2xl font-mono font-black mt-1.5">{savedAnalysis.grammarScore}%</div>
                </div>

                {/* Keywords density */}
                <div className={`border rounded-2xl p-4 text-center ${getScoreBg(savedAnalysis.keywordsScore)}`}>
                  <span className="text-xxs font-sans font-semibold text-[#a1a1aa] uppercase tracking-wide">Keyword Density</span>
                  <div className="text-2xl font-mono font-black mt-1.5">{savedAnalysis.keywordsScore}%</div>
                </div>

              </div>

              {/* Strengths and Weaknesses lists */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                
                {/* Strengths card */}
                <div className="bg-[#18181b] border border-[#27272a] rounded-2xl p-4 space-y-3">
                  <div className="flex items-center gap-1 text-xxs font-bold text-emerald-400 uppercase">
                    <ShieldCheck size={14} />
                    <span>Resume Strengths</span>
                  </div>
                  <div className="space-y-2">
                    {savedAnalysis.strengths.map((st, i) => (
                      <div key={i} className="text-xxs text-[#a1a1aa] font-sans leading-relaxed flex items-start gap-1.5">
                        <span className="text-emerald-500 font-semibold">•</span>
                        <span>{st}</span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Weaknesses card */}
                <div className="bg-[#18181b] border border-[#27272a] rounded-2xl p-4 space-y-3">
                  <div className="flex items-center gap-1 text-xxs font-bold text-orange-400 uppercase">
                    <AlertCircle size={14} />
                    <span>Areas to Improve</span>
                  </div>
                  <div className="space-y-2">
                    {savedAnalysis.weaknesses.map((wk, i) => (
                      <div key={i} className="text-xxs text-[#a1a1aa] font-sans leading-relaxed flex items-start gap-1.5">
                        <span className="text-orange-500 font-semibold">•</span>
                        <span>{wk}</span>
                      </div>
                    ))}
                  </div>
                </div>

              </div>

              {/* Missing keywords list */}
              <div className="bg-[#18181b] border border-[#27272a] rounded-2xl p-5 space-y-3">
                <div className="flex items-center gap-1.5 text-xs font-semibold text-[#fafafa]">
                  <TrendingUp size={15} className="text-indigo-400" />
                  <span>HIGH IMPACT MISSING KEYWORDS</span>
                </div>
                <div className="flex flex-wrap gap-1.5 pt-1">
                  {savedAnalysis.missingKeywords.map((kw, i) => (
                    <span key={i} className="px-2 py-0.5 bg-[#27272a] border border-[#3f3f46] text-[10px] font-mono rounded text-[#a1a1aa]">
                      {kw}
                    </span>
                  ))}
                  {savedAnalysis.missingKeywords.length === 0 && (
                    <span className="text-xs text-[#71717a] font-sans italic">All high impact keywords found! Beautiful!</span>
                  )}
                </div>
              </div>

              {/* Quantifiable XYZ Improved Bullet Points */}
              <div className="bg-[#18181b] border border-[#27272a] rounded-2xl p-5 space-y-3">
                <div className="flex items-center gap-1.5 text-xs font-semibold text-[#fafafa]">
                  <Sparkles size={15} className="text-indigo-400" />
                  <span>SDE GOOGLE XYZ REWRITES</span>
                </div>
                <p className="text-[10px] text-[#71717a] font-sans leading-normal">
                  Recruiters love Google's XYZ metric strategy. Replace weak description items in your resume with these quantifiable rewrites:
                </p>
                <div className="space-y-3 pt-1">
                  {savedAnalysis.improvedBulletPoints.map((bp, i) => (
                    <div key={i} className="p-3 bg-[#27272a] border border-[#3f3f46] rounded-xl flex items-start justify-between gap-3">
                      <p className="text-xxs text-[#a1a1aa] font-sans leading-relaxed">"{bp}"</p>
                      <button 
                        onClick={() => handleCopyText(bp, i)}
                        className="text-[#71717a] hover:text-indigo-400 shrink-0 p-1 bg-[#18181b] hover:bg-[#27272a] rounded transition-colors cursor-pointer"
                      >
                        {copiedIndex === i ? (
                          <span className="text-[10px] text-emerald-400 font-mono">Copied!</span>
                        ) : (
                          <Copy size={12} />
                        )}
                      </button>
                    </div>
                  ))}
                </div>
              </div>

              {/* Measurable presentation improvements */}
              <div className="bg-[#18181b] border border-[#27272a] rounded-2xl p-5 space-y-3">
                <div className="flex items-center gap-1.5 text-xs font-semibold text-[#fafafa]">
                  <FileText size={15} className="text-indigo-400" />
                  <span>ACTIONABLE FORMATTING POLISH ITEMS</span>
                </div>
                <div className="space-y-2">
                  {savedAnalysis.measurableSuggestions.map((sug, i) => (
                    <div key={i} className="flex gap-2.5 items-start text-xxs text-[#a1a1aa] leading-normal">
                      <div className="w-4 h-4 rounded-full bg-[#27272a] border border-[#3f3f46] text-[#71717a] font-mono text-[9px] flex items-center justify-center shrink-0 mt-0.5">{i+1}</div>
                      <span>{sug}</span>
                    </div>
                  ))}
                </div>
              </div>

            </div>
          )}

        </div>

      </div>

    </div>
  );
}
