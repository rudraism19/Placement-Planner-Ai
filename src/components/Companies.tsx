import { useState } from "react";
import { 
  Briefcase, 
  Sparkles, 
  ChevronRight, 
  CheckCircle, 
  HelpCircle, 
  FileText, 
  Cpu,
  TrendingUp,
  AlertCircle
} from "lucide-react";
import { motion } from "motion/react";
import { CompanyPrepPlan, StudentProfile, SkillProgress } from "../types";

interface CompaniesProps {
  companies: CompanyPrepPlan[];
  profile: StudentProfile;
  skills: SkillProgress[];
  onAddOrUpdatePlan: (plan: CompanyPrepPlan) => void;
}

export default function Companies({ companies, profile, skills, onAddOrUpdatePlan }: CompaniesProps) {
  const [selectedCompany, setSelectedCompany] = useState<string>(companies[0]?.company || "Google");
  const [customCompany, setCustomCompany] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const availableCompanies = [
    "Google", "Amazon", "Microsoft", "Adobe", "Atlassian", 
    "Oracle", "TCS", "Infosys", "Accenture", "Capgemini"
  ];

  const activePlan = companies.find(c => c.company.toLowerCase() === selectedCompany.toLowerCase()) || companies[0];

  const handleFetchCustomPrep = async (companyName: string) => {
    if (!companyName.trim()) return;
    setLoading(true);
    setError(null);
    try {
      const response = await fetch("/api/company-prep", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          company: companyName,
          profile,
          skills
        })
      });

      if (!response.ok) {
        const errData = await response.json();
        throw new Error(errData.error || "Failed to generate company preparation analysis.");
      }

      const data = await response.json();
      onAddOrUpdatePlan(data);
      setSelectedCompany(data.company);
      setCustomCompany("");
    } catch (err: any) {
      console.error(err);
      setError(err.message || "An unexpected error occurred during company analysis.");
    } finally {
      setLoading(false);
    }
  };

  // Helper to get color of readiness indicators
  const getReadinessColor = (score: number) => {
    if (score >= 85) return { bg: "bg-emerald-500/10", border: "border-emerald-500/20", text: "text-emerald-400" };
    if (score >= 70) return { bg: "bg-indigo-500/10", border: "border-indigo-500/20", text: "text-indigo-400" };
    return { bg: "bg-orange-500/10", border: "border-orange-500/20", text: "text-orange-400" };
  };

  const colors = activePlan ? getReadinessColor(activePlan.readinessScore) : { bg: "bg-neutral-800", border: "border-neutral-700", text: "text-white" };

  return (
    <div className="space-y-6">
      
      {/* Header banner */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl font-sans font-bold text-[#fafafa] tracking-tight">Target Company Prep plans</h1>
          <p className="text-xs text-[#a1a1aa] font-sans mt-0.5">
            Evaluate your preparedness and view tailored interview, question, and coding checklists.
          </p>
        </div>
      </div>

      {/* Selector & Generator Bar */}
      <div className="bg-[#18181b] border border-[#27272a] rounded-2xl p-5 space-y-4">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          
          {/* Quick select buttons */}
          <div className="flex flex-wrap gap-2">
            {companies.map(c => (
              <button
                key={c.company}
                onClick={() => {
                  setSelectedCompany(c.company);
                  setError(null);
                }}
                className={`px-3 py-1.5 rounded-lg text-xs font-sans font-semibold border transition-all duration-200 ${
                  selectedCompany.toLowerCase() === c.company.toLowerCase()
                    ? "bg-indigo-600/10 text-indigo-400 border-indigo-500/20"
                    : "bg-[#27272a] text-[#a1a1aa] border-[#3f3f46] hover:text-[#fafafa] hover:bg-[#27272a]/80"
                }`}
              >
                {c.company}
              </button>
            ))}
          </div>

          {/* Create custom plan box */}
          <div className="flex items-center gap-2">
            <select
              value={customCompany}
              onChange={(e) => setCustomCompany(e.target.value)}
              className="bg-[#27272a] border border-[#3f3f46] focus:border-indigo-500 rounded-xl px-3 py-2 text-xs text-white outline-none font-sans"
            >
              <option value="">Select Company...</option>
              {availableCompanies
                .filter(ac => !companies.some(c => c.company.toLowerCase() === ac.toLowerCase()))
                .map(ac => (
                  <option key={ac} value={ac}>{ac}</option>
                ))}
            </select>
            <button
              onClick={() => handleFetchCustomPrep(customCompany)}
              disabled={loading || !customCompany}
              className="px-4 py-2 bg-indigo-600 hover:bg-indigo-500 disabled:opacity-50 text-white text-xs font-sans font-semibold rounded-xl flex items-center gap-1.5 transition-all duration-200 shadow-lg shadow-indigo-600/10"
            >
              <Sparkles size={14} className={loading ? "animate-spin" : "animate-pulse"} />
              {loading ? "Analyzing..." : "Analyze with AI"}
            </button>
          </div>

        </div>

        {error && (
          <div className="bg-orange-500/10 border border-orange-500/30 rounded-xl p-3 flex gap-2 text-orange-400 text-xxs font-sans">
            <AlertCircle size={15} className="shrink-0 mt-0.5" />
            <span>{error}</span>
          </div>
        )}
      </div>

      {loading && (
        <div className="bg-[#18181b] border border-[#27272a] rounded-2xl p-12 text-center flex flex-col items-center justify-center space-y-4">
          <Sparkles size={40} className="text-indigo-400 animate-spin" />
          <div className="space-y-1">
            <h3 className="text-sm font-sans font-bold text-[#fafafa]">AI Recruiting Engine is benchmarking expectations...</h3>
            <p className="text-xs text-[#a1a1aa] font-sans max-w-md">
              Comparing your coding statistics, DSA proficiency, and B.Tech profile records with hiring trends to compute custom prep checklists.
            </p>
          </div>
        </div>
      )}

      {/* Main comparative profile content */}
      {!loading && activePlan && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          
          {/* Left Block - Readiness index & interview patterns */}
          <div className="space-y-6">
            
            {/* Readiness Index Gauge */}
            <div className={`bg-[#18181b] border ${colors.border} rounded-2xl p-5 space-y-4`}>
              <div className="flex items-center justify-between">
                <span className="text-xxs font-sans font-bold text-[#a1a1aa] uppercase tracking-wider">PREPARATION COMPATIBILITY</span>
                <span className="text-[10px] bg-indigo-500/10 text-indigo-400 px-2 py-0.5 rounded font-mono">Ready Index</span>
              </div>
              <div className="flex items-baseline gap-1 pt-1">
                <span className={`text-4xl font-mono font-black ${colors.text}`}>{activePlan.readinessScore}%</span>
                <span className="text-xs text-[#a1a1aa] font-sans">Matching score</span>
              </div>
              <div className="w-full bg-[#27272a] rounded-full h-2 overflow-hidden">
                <div className={`h-full bg-indigo-500 transition-all duration-500`} style={{ width: `${activePlan.readinessScore}%` }} />
              </div>
              <p className="text-xxs text-[#a1a1aa] font-sans leading-relaxed">
                Your readiness index is calculated dynamically by matching your current technical, academic (CGPA: {profile.cgpa}), and soft skill proficiencies against historical SDE hiring standards.
              </p>
            </div>

            {/* Selection Stages / Interview Pattern */}
            <div className="bg-[#18181b] border border-[#27272a] rounded-2xl p-5 space-y-4">
              <div className="flex items-center gap-1.5 text-xs font-semibold text-[#fafafa]">
                <Briefcase size={15} className="text-indigo-400" />
                <span>SELECTION STAGES</span>
              </div>
              <div className="space-y-4 pt-1">
                {activePlan.interviewPattern.map((stage, i) => (
                  <div key={i} className="flex gap-3 items-start">
                    <div className="w-5 h-5 rounded-full bg-indigo-600/10 border border-indigo-500/25 flex items-center justify-center text-[10px] font-mono font-bold text-indigo-400 shrink-0 mt-0.5">
                      {i + 1}
                    </div>
                    <div className="space-y-0.5">
                      <span className="text-xxs font-mono font-bold text-[#a1a1aa] block uppercase">Stage {i + 1}</span>
                      <p className="text-xxs text-[#a1a1aa] font-sans leading-normal">{stage}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

          </div>

          {/* Right Block - Skills, Questions, Resume suggestions */}
          <div className="lg:col-span-2 space-y-6">
            
            {/* Grid for Technical requirements & core topics */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              
              {/* Core Skill expectations */}
              <div className="bg-[#18181b] border border-[#27272a] rounded-2xl p-5 space-y-3">
                <div className="flex items-center gap-1.5 text-xs font-semibold text-[#fafafa]">
                  <TrendingUp size={15} className="text-indigo-400" />
                  <span>KEY SKILLS REQUIRED</span>
                </div>
                <div className="flex flex-wrap gap-1.5 pt-1">
                  {activePlan.requiredTechnicalSkills.map((sk) => (
                    <span key={sk} className="px-2.5 py-1 bg-[#27272a] border border-[#3f3f46] rounded-lg text-xxs font-sans text-[#a1a1aa]">
                      {sk}
                    </span>
                  ))}
                </div>
              </div>

              {/* Core CS Topics */}
              <div className="bg-[#18181b] border border-[#27272a] rounded-2xl p-5 space-y-3">
                <div className="flex items-center gap-1.5 text-xs font-semibold text-[#fafafa]">
                  <Cpu size={15} className="text-indigo-400" />
                  <span>CS THEORETICAL FOCUS</span>
                </div>
                <div className="flex flex-wrap gap-1.5 pt-1">
                  {activePlan.importantTopics.map((tp) => (
                    <span key={tp} className="px-2.5 py-1 bg-[#27272a] border border-[#3f3f46] rounded-lg text-xxs font-sans text-[#a1a1aa]">
                      {tp}
                    </span>
                  ))}
                </div>
              </div>

            </div>

            {/* Resume optimization advice */}
            <div className="bg-[#18181b] border border-[#27272a] rounded-2xl p-5 space-y-3">
              <div className="flex items-center gap-1.5 text-xs font-semibold text-[#fafafa]">
                <FileText size={15} className="text-indigo-400" />
                <span>RESUME OPTIMIZATION SUGGESTIONS</span>
              </div>
              <div className="bg-[#09090b]/50 border border-[#27272a] rounded-xl p-3 flex items-start gap-2 text-xxs text-[#a1a1aa] leading-relaxed font-sans">
                <Sparkles size={14} className="text-indigo-400 shrink-0 mt-0.5" />
                <span>{activePlan.resumeSuggestions}</span>
              </div>
            </div>

            {/* Top Interview Questions */}
            <div className="bg-[#18181b] border border-[#27272a] rounded-2xl p-5 space-y-3">
              <div className="flex items-center gap-1.5 text-xs font-semibold text-[#fafafa]">
                <HelpCircle size={15} className="text-indigo-400" />
                <span>PROMINENT INTERVIEW QUESTIONS</span>
              </div>
              <div className="space-y-3 pt-1">
                {activePlan.frequentlyAskedQuestions.map((q, idx) => (
                  <div key={idx} className="p-3 bg-[#27272a] border border-[#3f3f46] rounded-xl flex items-start gap-3">
                    <span className="text-xxs font-mono font-bold text-indigo-400 bg-indigo-500/10 px-1.5 py-0.5 rounded shrink-0">Q{idx+1}</span>
                    <p className="text-xxs text-[#a1a1aa] font-sans leading-relaxed">"{q}"</p>
                  </div>
                ))}
              </div>
            </div>

          </div>

        </div>
      )}

    </div>
  );
}
