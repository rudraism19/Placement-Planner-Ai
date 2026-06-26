import React, { useState } from "react";
import { 
  Code2, 
  Sparkles, 
  Github, 
  ExternalLink, 
  Plus, 
  Trash2, 
  CheckCircle, 
  Circle,
  HelpCircle,
  TrendingUp,
  Award
} from "lucide-react";
import { motion } from "motion/react";
import { CodingStats, ProjectItem } from "../types";

interface CodingProjectsProps {
  codingStats: CodingStats;
  projects: ProjectItem[];
  onAddProject: (proj: ProjectItem) => void;
  onDeleteProject: (id: string) => void;
  onUpdateProjectReview: (id: string, review: string) => void;
}

export default function CodingProjects({ 
  codingStats, 
  projects, 
  onAddProject, 
  onDeleteProject, 
  onUpdateProjectReview 
}: CodingProjectsProps) {
  const [reviewLoadingId, setReviewLoadingId] = useState<string | null>(null);
  const [isAddingProject, setIsAddingProject] = useState(false);
  
  // New Project Form State
  const [title, setTitle] = useState("");
  const [techInput, setTechInput] = useState("");
  const [description, setDescription] = useState("");
  const [gitHubUrl, setGitHubUrl] = useState("");
  const [liveDemoUrl, setLiveDemoUrl] = useState("");
  const [status, setStatus] = useState<"In Progress" | "Completed">("Completed");

  const totalQuestions = codingStats.easySolved + codingStats.mediumSolved + codingStats.hardSolved;

  const handleRunAIReview = async (project: ProjectItem) => {
    setReviewLoadingId(project.id);
    try {
      // Call general /api/chat with specialized project-review prompt
      const prompt = `Review this computer science student project for an SDE resume:
Project Title: "${project.title}"
Technology Stack: [${project.techStack.join(", ")}]
Project Description: "${project.description}"
Completion Status: "${project.completionStatus}"

Please provide a highly critical and constructive AI project review of exactly 3 bullet points:
1. Tech Stack Evaluation (Any missing libraries or tools to make it look professional).
2. Bullet-point Rephrase (Rewrite their description into a high-impact, metrics-driven bullet point using the X-Y-Z formula: 'Accomplished [X] as measured by [Y], by doing [Z]').
3. Performance Enhancement (Suggest a database sharding, caching, or frontend optimization practice to increase overall difficulty).`;

      const response = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message: prompt })
      });

      if (!response.ok) throw new Error("Failed to consult AI.");
      const data = await response.json();
      
      onUpdateProjectReview(project.id, data.text || "Failed to generate review. Please try again.");
    } catch (err) {
      console.error(err);
      onUpdateProjectReview(project.id, "Error consulting AI placement evaluator. Check your API key or network connection.");
    } finally {
      setReviewLoadingId(null);
    }
  };

  const handleAddProjectSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim() || !description.trim()) return;

    const stack = techInput.split(",").map(s => s.trim()).filter(Boolean);

    const newProj: ProjectItem = {
      id: `proj_${Date.now()}`,
      title: title.trim(),
      techStack: stack.length > 0 ? stack : ["General"],
      description: description.trim(),
      gitHubUrl: gitHubUrl.trim(),
      liveDemoUrl: liveDemoUrl.trim(),
      completionStatus: status,
    };

    onAddProject(newProj);
    
    // reset
    setTitle("");
    setTechInput("");
    setDescription("");
    setGitHubUrl("");
    setLiveDemoUrl("");
    setIsAddingProject(false);
  };

  return (
    <div className="space-y-6">
      
      {/* Top Headers */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl font-sans font-bold text-[#fafafa] tracking-tight">Coding Stats & Project Tracker</h1>
          <p className="text-xs text-[#a1a1aa] font-sans mt-0.5">
            Monitor competitive programming statistics alongside your engineering project portfolio.
          </p>
        </div>
      </div>

      {/* Main Grid: Coding (Left 1 col) , Projects (Right 2 cols) */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Left Column: Coding Statistics Dashboard */}
        <div className="space-y-6">
          
          {/* Solved Distribution Card */}
          <div className="bg-[#18181b] border border-[#27272a] rounded-2xl p-5 space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-xxs font-sans font-bold text-[#a1a1aa] uppercase tracking-wider">QUESTIONS SOLVED</span>
              <span className="text-xs font-mono font-bold text-indigo-400">{totalQuestions} Total</span>
            </div>

            <div className="space-y-3.5">
              {/* Easy */}
              <div className="space-y-1">
                <div className="flex justify-between text-xxs font-semibold">
                  <span className="text-[#a1a1aa]">Easy level</span>
                  <span className="text-emerald-400 font-mono">{codingStats.easySolved} solved</span>
                </div>
                <div className="w-full bg-[#27272a] rounded-full h-1.5 overflow-hidden">
                  <div className="bg-emerald-500 h-full" style={{ width: `${(codingStats.easySolved / 300) * 100}%` }} />
                </div>
              </div>

              {/* Medium */}
              <div className="space-y-1">
                <div className="flex justify-between text-xxs font-semibold">
                  <span className="text-[#a1a1aa]">Medium level (Core Placement Standard)</span>
                  <span className="text-indigo-400 font-mono">{codingStats.mediumSolved} solved</span>
                </div>
                <div className="w-full bg-[#27272a] rounded-full h-1.5 overflow-hidden">
                  <div className="bg-indigo-500 h-full" style={{ width: `${(codingStats.mediumSolved / 300) * 100}%` }} />
                </div>
              </div>

              {/* Hard */}
              <div className="space-y-1">
                <div className="flex justify-between text-xxs font-semibold">
                  <span className="text-[#a1a1aa]">Hard level</span>
                  <span className="text-orange-400 font-mono">{codingStats.hardSolved} solved</span>
                </div>
                <div className="w-full bg-[#27272a] rounded-full h-1.5 overflow-hidden">
                  <div className="bg-orange-500 h-full" style={{ width: `${(codingStats.hardSolved / 100) * 100}%` }} />
                </div>
              </div>
            </div>

            <div className="h-px bg-[#27272a] my-2" />

            <div className="flex justify-between text-xxs text-[#71717a] font-sans">
              <span>Coding Streak: <b className="text-orange-400">{codingStats.streak} days</b></span>
              <span>Contest Rating: <b className="text-indigo-400 font-mono">{codingStats.contestRating}</b></span>
            </div>
          </div>

          {/* Topics Performance Breakdown */}
          <div className="bg-[#18181b] border border-[#27272a] rounded-2xl p-5 space-y-4">
            <div className="flex items-center gap-1.5 text-xs font-semibold text-[#fafafa]">
              <TrendingUp size={15} className="text-indigo-400" />
              <span>TOPIC-WISE METRICS</span>
            </div>

            <div className="space-y-3.5">
              {codingStats.topicsPerformance.map(tp => (
                <div key={tp.topic} className="space-y-1">
                  <div className="flex justify-between text-xxs font-sans text-[#a1a1aa]">
                    <span>{tp.topic}</span>
                    <span className="font-mono text-indigo-400">{tp.percentage}%</span>
                  </div>
                  <div className="w-full bg-[#27272a] rounded-full h-1 overflow-hidden">
                    <div className="bg-indigo-500 h-full" style={{ width: `${tp.percentage}%` }} />
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Languages Breakdown */}
          <div className="bg-[#18181b] border border-[#27272a] rounded-2xl p-5 space-y-3">
            <div className="flex items-center gap-1.5 text-xs font-semibold text-[#fafafa]">
              <Code2 size={15} className="text-indigo-400" />
              <span>LANGUAGES UTILIZED</span>
            </div>
            <div className="flex flex-wrap gap-2 pt-1">
              {codingStats.languagesUsed.map(lang => (
                <span key={lang.language} className="inline-flex items-center gap-1.5 px-2.5 py-1 bg-[#27272a] border border-[#3f3f46] rounded-lg text-xxs font-mono text-[#a1a1aa]">
                  <span className="w-1.5 h-1.5 rounded-full bg-indigo-500" />
                  {lang.language} ({lang.percentage}%)
                </span>
              ))}
            </div>
          </div>

        </div>

        {/* Right Column: Projects Portfolio and AI Reviewer */}
        <div className="lg:col-span-2 space-y-6">
          
          <div className="flex items-center justify-between border-b border-[#27272a] pb-3">
            <h2 className="text-sm font-sans font-bold text-[#fafafa]">Project Portfolio ({projects.length})</h2>
            <button
              onClick={() => setIsAddingProject(!isAddingProject)}
              className="text-xs text-indigo-400 hover:text-indigo-300 font-sans flex items-center gap-1 font-semibold"
            >
              <Plus size={14} /> Add Project
            </button>
          </div>

          {/* New Project Form */}
          {isAddingProject && (
            <motion.div 
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-[#18181b] border border-[#27272a] rounded-2xl p-5 space-y-4"
            >
              <h3 className="text-xs font-sans font-bold text-[#fafafa] uppercase tracking-wider">Configure Portfolio Project</h3>
              <form onSubmit={handleAddProjectSubmit} className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-1">
                    <label className="text-xxs font-sans font-semibold text-[#a1a1aa] uppercase">Project Title</label>
                    <input 
                      type="text" 
                      value={title} 
                      onChange={e => setTitle(e.target.value)}
                      placeholder="e.g. Distributed Task Queue" 
                      className="w-full bg-[#27272a] border border-[#3f3f46] rounded-xl px-3 py-2 text-xs text-white outline-none"
                      required
                    />
                  </div>
                  <div className="space-y-1">
                    <label className="text-xxs font-sans font-semibold text-[#a1a1aa] uppercase">Technology Stack (Comma separated)</label>
                    <input 
                      type="text" 
                      value={techInput} 
                      onChange={e => setTechInput(e.target.value)}
                      placeholder="e.g. React, Docker, Redis" 
                      className="w-full bg-[#27272a] border border-[#3f3f46] rounded-xl px-3 py-2 text-xs text-white outline-none"
                      required
                    />
                  </div>
                  <div className="space-y-1">
                    <label className="text-xxs font-sans font-semibold text-[#a1a1aa] uppercase">GitHub Repository Link</label>
                    <input 
                      type="url" 
                      value={gitHubUrl} 
                      onChange={e => setGitHubUrl(e.target.value)}
                      placeholder="https://github.com/your/repo" 
                      className="w-full bg-[#27272a] border border-[#3f3f46] rounded-xl px-3 py-2 text-xs text-white outline-none"
                    />
                  </div>
                  <div className="space-y-1">
                    <label className="text-xxs font-sans font-semibold text-[#a1a1aa] uppercase">Live Demo Link</label>
                    <input 
                      type="url" 
                      value={liveDemoUrl} 
                      onChange={e => setLiveDemoUrl(e.target.value)}
                      placeholder="https://my-demo.vercel.app" 
                      className="w-full bg-[#27272a] border border-[#3f3f46] rounded-xl px-3 py-2 text-xs text-white outline-none"
                    />
                  </div>
                </div>

                <div className="space-y-1">
                  <label className="text-xxs font-sans font-semibold text-[#a1a1aa] uppercase">Project Description</label>
                  <textarea 
                    rows={4}
                    value={description} 
                    onChange={e => setDescription(e.target.value)}
                    placeholder="Describe core functionalities, performance benchmarks, or database schemas used..." 
                    className="w-full bg-[#27272a] border border-[#3f3f46] rounded-xl px-3 py-2 text-xs text-white outline-none"
                    required
                  />
                </div>

                <div className="flex items-center justify-between border-t border-[#27272a] pt-3">
                  <div className="flex items-center gap-4 text-xs font-sans">
                    <span className="text-[#a1a1aa] font-semibold uppercase text-xxs">Status:</span>
                    <label className="flex items-center gap-1.5 text-[#a1a1aa]">
                      <input 
                        type="radio" 
                        name="status" 
                        checked={status === "Completed"} 
                        onChange={() => setStatus("Completed")} 
                        className="accent-indigo-500" 
                      /> Completed
                    </label>
                    <label className="flex items-center gap-1.5 text-[#a1a1aa]">
                      <input 
                        type="radio" 
                        name="status" 
                        checked={status === "In Progress"} 
                        onChange={() => setStatus("In Progress")} 
                        className="accent-indigo-500" 
                      /> In Progress
                    </label>
                  </div>
                  <div className="flex gap-2">
                    <button 
                      type="button" 
                      onClick={() => setIsAddingProject(false)} 
                      className="px-4 py-2 text-xs text-[#a1a1aa] hover:text-white"
                    >Cancel</button>
                    <button 
                      type="submit" 
                      className="px-4 py-2 bg-indigo-600 hover:bg-indigo-500 text-white rounded-xl text-xs font-sans font-semibold"
                    >Publish Project</button>
                  </div>
                </div>
              </form>
            </motion.div>
          )}

          {/* Projects List */}
          <div className="space-y-6">
            {projects.map((proj) => (
              <div 
                key={proj.id} 
                className="bg-[#18181b] border border-[#27272a] rounded-2xl p-5 space-y-4"
              >
                {/* Title line */}
                <div className="flex justify-between items-start gap-4">
                  <div>
                    <h3 className="text-sm font-sans font-bold text-[#fafafa]">{proj.title}</h3>
                    <div className="flex flex-wrap gap-1.5 mt-1.5">
                      {proj.techStack.map((tech) => (
                        <span key={tech} className="px-2 py-0.5 bg-[#27272a] border border-[#3f3f46] text-[10px] font-mono rounded-md text-[#a1a1aa]">
                          {tech}
                        </span>
                      ))}
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    {proj.gitHubUrl && (
                      <a 
                        href={proj.gitHubUrl} 
                        target="_blank" 
                        referrerPolicy="no-referrer"
                        className="p-1.5 bg-[#27272a] hover:bg-[#3f3f46] border border-[#3f3f46] rounded-lg text-[#a1a1aa] hover:text-white transition-all duration-200"
                      >
                        <Github size={14} />
                      </a>
                    )}
                    {proj.liveDemoUrl && (
                      <a 
                        href={proj.liveDemoUrl} 
                        target="_blank" 
                        referrerPolicy="no-referrer"
                        className="p-1.5 bg-[#27272a] hover:bg-[#3f3f46] border border-[#3f3f46] rounded-lg text-[#a1a1aa] hover:text-white transition-all duration-200"
                      >
                        <ExternalLink size={14} />
                      </a>
                    )}
                    <button 
                      onClick={() => onDeleteProject(proj.id)}
                      className="p-1.5 bg-[#27272a] hover:bg-[#3f3f46] border border-transparent hover:border-orange-500/20 rounded-lg text-[#71717a] hover:text-orange-400 transition-all duration-200 animate-pulse-once"
                    >
                      <Trash2 size={14} />
                    </button>
                  </div>
                </div>

                {/* Description */}
                <p className="text-xs text-[#a1a1aa] font-sans leading-relaxed">
                  {proj.description}
                </p>

                {/* AI Reviewer Display */}
                {proj.aiReview ? (
                  <div className="bg-[#09090b]/50 border border-[#27272a] rounded-xl p-4 space-y-2">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-1.5 text-xs font-semibold text-indigo-400">
                        <Sparkles size={14} className="animate-pulse" />
                        <span>AI PROJECT PORTFOLIO REVIEW</span>
                      </div>
                      <button 
                        onClick={() => handleRunAIReview(proj)}
                        disabled={reviewLoadingId === proj.id}
                        className="text-[10px] text-[#71717a] hover:text-indigo-400"
                      >
                        {reviewLoadingId === proj.id ? "Regenerating..." : "Regenerate Review"}
                      </button>
                    </div>
                    <div className="text-xxs text-[#a1a1aa] font-sans leading-relaxed whitespace-pre-wrap">
                      {proj.aiReview}
                    </div>
                  </div>
                ) : (
                  <button
                    onClick={() => handleRunAIReview(proj)}
                    disabled={reviewLoadingId === proj.id}
                    className="w-full py-2 bg-indigo-600/10 hover:bg-indigo-600/20 border border-indigo-500/20 rounded-xl text-xxs font-sans font-bold text-indigo-400 flex items-center justify-center gap-1.5 transition-colors"
                  >
                    <Sparkles size={12} className={reviewLoadingId === proj.id ? "animate-spin" : "animate-pulse"} />
                    {reviewLoadingId === proj.id ? "Reviewing project specs..." : "Request AI Resume Impact Review"}
                  </button>
                )}

                {/* Status line */}
                <div className="flex items-center justify-between text-[10px] text-[#71717a] font-mono">
                  <span className="flex items-center gap-1">
                    {proj.completionStatus === "Completed" ? (
                      <CheckCircle size={12} className="text-emerald-500" />
                    ) : (
                      <Circle size={12} className="text-indigo-400 animate-pulse" />
                    )}
                    Status: {proj.completionStatus}
                  </span>
                  <span>Portfolio verified</span>
                </div>

              </div>
            ))}

            {projects.length === 0 && (
              <div className="text-center py-12 border border-dashed border-[#27272a] rounded-2xl">
                <p className="text-xs text-[#71717a] font-sans italic">Your portfolio is currently empty. Add projects using the button above.</p>
              </div>
            )}
          </div>

        </div>

      </div>

    </div>
  );
}
