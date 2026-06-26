import React, { useState } from "react";
import { 
  BookOpen, 
  Sparkles, 
  CheckCircle, 
  Circle, 
  ExternalLink, 
  Clock, 
  Plus, 
  AlertCircle,
  TrendingUp,
  Calendar,
  Award,
  History,
  FolderGit2,
  ListFilter,
  Check,
  ChevronRight,
  ArrowUpRight,
  Sparkle,
  Bookmark,
  Shuffle,
  ShieldCheck,
  RotateCcw,
  BookMarked,
  Trash2,
  Briefcase,
  HelpCircle
} from "lucide-react";
import { motion, AnimatePresence } from "motion/react";
import { RoadmapTask, StudentProfile, SkillProgress } from "../types";

interface RoadmapProps {
  roadmap: RoadmapTask[];
  profile: StudentProfile;
  skills: SkillProgress[];
  onToggleComplete: (id: string) => void;
  onAddCustomTask: (task: RoadmapTask) => void;
  onSetRoadmap: (newRoadmap: RoadmapTask[]) => void;
}

export default function Roadmap({ 
  roadmap, 
  profile, 
  skills, 
  onToggleComplete, 
  onAddCustomTask, 
  onSetRoadmap 
}: RoadmapProps) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  
  // Custom manual task addition states
  const [isAdding, setIsAdding] = useState(false);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [phase, setPhase] = useState("Phase 1: Foundation");
  const [duration, setDuration] = useState("1 day");
  const [resource, setResource] = useState("");
  const [category, setCategory] = useState("General");
  const [timeframe, setTimeframe] = useState<'Daily' | 'Weekly' | 'Monthly'>("Daily");
  const [priority, setPriority] = useState<'High' | 'Medium' | 'Low'>("High");
  const [taskType, setTaskType] = useState<'Study' | 'Revision' | 'Project' | 'Certification'>("Study");
  const [associatedSkill, setAssociatedSkill] = useState("");

  // Sub-navigation tabs
  // 'timeline' (Phases), 'planner' (Daily/Weekly/Monthly), 'revisions' (Spaced Repetition), 'suggestions' (Projects/Certifications)
  const [activeSubTab, setActiveSubTab] = useState<'timeline' | 'planner' | 'revisions' | 'suggestions'>('planner');
  const [filterPriority, setFilterPriority] = useState<string>('All');

  const phases = [
    "Phase 1: Foundation",
    "Phase 2: Core Mastery",
    "Phase 3: Company Prep",
    "Phase 4: Final Polish"
  ];

  const handleAISync = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await fetch("/api/generate-roadmap", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ profile, skills })
      });

      if (!response.ok) {
        const errData = await response.json();
        throw new Error(errData.error || "Failed to reorganize roadmap with AI.");
      }

      const data = await response.json();
      if (data && data.tasks && Array.isArray(data.tasks)) {
        onSetRoadmap(data.tasks);
      } else {
        throw new Error("Invalid format returned from AI Roadmap API.");
      }
    } catch (err: any) {
      console.error(err);
      setError(err.message || "An unexpected error occurred during roadmap generation.");
    } finally {
      setLoading(false);
    }
  };

  const handleManualSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) return;

    const newTask: RoadmapTask = {
      id: `task_${Date.now()}`,
      phase,
      title: title.trim(),
      description: description.trim(),
      resource: resource.trim() || "Google search & self-study",
      duration: duration || "1 day",
      isCompleted: false,
      category: category.trim() || "General",
      timeframe,
      priority,
      type: taskType,
      isRevision: taskType === 'Revision',
      associatedSkill: associatedSkill || "General Preparation"
    };

    onAddCustomTask(newTask);
    
    // Reset form
    setTitle("");
    setDescription("");
    setResource("");
    setCategory("General");
    setAssociatedSkill("");
    setIsAdding(false);
  };

  const handleDeleteTask = (taskId: string) => {
    onSetRoadmap(roadmap.filter(t => t.id !== taskId));
  };

  // Schedule a dynamic revision session based on the student's lowest level skills
  const handleScheduleRevision = () => {
    if (skills.length === 0) return;
    
    // Sort to find lowest-level skills
    const lowSkills = [...skills].sort((a, b) => a.currentLevel - b.currentLevel);
    const targetSkill = lowSkills[0];

    const revisionTopics: Record<string, string[]> = {
      "Data Structures & Algorithms (DSA)": [
        "Revise Graph DFS/BFS & practice 2 standard topological sort questions.",
        "Active Recall: Time and Space complexities of common Sorting Algorithms.",
        "Review Dynamic Programming Memoization template and solve Knapsack variations."
      ],
      "React & Frontend Development": [
        "Revise React rendering lifecycles, virtual DOM reconciliation, and standard useCallback/useMemo usage.",
        "Practice building a custom throttle/debounce hook from scratch.",
        "Review key performance optimization strategies (lazy loading, code splitting)."
      ],
      "Node.js & Backend Systems": [
        "Revise Express global error handling and custom routing middleware.",
        "Active Recall: Event Loop phases, microtasks vs macrotasks, and cluster scaling.",
        "Review JWT authentication flow and standard cookie security configurations."
      ],
      "Database Management (SQL)": [
        "Revise SQL nested subqueries, self-joins, and transaction ACID properties.",
        "Analyze database index types (B-Trees vs Hash Index) and explain query bottlenecks.",
        "Write 3 queries utilizing window functions (ROW_NUMBER, DENSE_RANK, LEAD)."
      ],
      "System Design": [
        "Revise key microservice communication protocols (gRPC, WebSockets, REST, Webhooks).",
        "Active Recall: Consistence Hashing, CAP Theorem, and Cache Eviction policies (LRU/LFU).",
        "Draw a mental design for a distributed rate-limiter or chat room backplane."
      ],
      "Database Management Systems (DBMS)": [
        "Revise database Normalization forms (1NF up to BCNF) with concrete tables.",
        "Active Recall: Database concurrency locking protocols (2PL, shared vs exclusive locks).",
        "Review WAL (Write-Ahead Logging) protocols and recovery schedules."
      ],
      "Operating Systems (OS)": [
        "Revise critical section solutions, Semaphores vs Mutexes, and Producer-Consumer locks.",
        "Active Recall: CPU Scheduling metrics (Round Robin, SRTF) and memory page replacement.",
        "Review disk scheduling algorithms (SSTF, SCAN, LOOK) with mock tracks."
      ],
      "Computer Networks (CN)": [
        "Revise TCP 3-way handshake, congestion window flow, and flow control policies.",
        "Active Recall: OSI Layer protocols, DNS query routing, and HTTP headers.",
        "Explain key differences between HTTP/1.1, HTTP/2, and HTTP/3 multiplexing."
      ]
    };

    const defaultTopics = [
      `Review key formulas and core syntax of ${targetSkill.name}.`,
      `Implement 3 whiteboard code solutions covering standard queries in ${targetSkill.name}.`,
      `Explain the advanced architectural nuances of ${targetSkill.name} in a mock interview presentation.`
    ];

    const customTopicsList = revisionTopics[targetSkill.name] || defaultTopics;
    const randomTopic = customTopicsList[Math.floor(Math.random() * customTopicsList.length)];

    const newRevisionTask: RoadmapTask = {
      id: `revision_${Date.now()}`,
      phase: targetSkill.category === 'Core CS' ? "Phase 2: Core Mastery" : "Phase 1: Foundation",
      title: `Revision: ${targetSkill.name}`,
      description: randomTopic,
      resource: "GeeksforGeeks / Striver Quick Sheet / Career Docs",
      duration: "1 hour",
      isCompleted: false,
      category: "Revision",
      timeframe: "Daily",
      priority: "High",
      isRevision: true,
      type: "Revision",
      associatedSkill: targetSkill.name
    };

    onAddCustomTask(newRevisionTask);
    setActiveSubTab('revisions');
  };

  // Helper selectors and counts
  const completedCount = roadmap.filter(t => t.isCompleted).length;
  const totalCount = roadmap.length;
  const progressPercent = totalCount > 0 ? Math.round((completedCount / totalCount) * 100) : 0;

  // Filtered tasks based on tab and priority dropdown
  const getFilteredRoadmap = () => {
    let list = [...roadmap];
    
    // Apply Priority Filter
    if (filterPriority !== 'All') {
      list = list.filter(t => (t.priority || 'High') === filterPriority);
    }

    // Apply Active Tab filters
    if (activeSubTab === 'revisions') {
      return list.filter(t => t.type === 'Revision' || t.isRevision);
    }
    if (activeSubTab === 'suggestions') {
      return list.filter(t => t.type === 'Project' || t.type === 'Certification');
    }
    
    return list;
  };

  const filteredTasks = getFilteredRoadmap();

  // Highlight classes
  const getPriorityBadgeStyles = (p: 'High' | 'Medium' | 'Low' | string | undefined) => {
    const val = p || 'High';
    switch (val) {
      case 'High':
        return 'bg-red-500/10 border-red-500/20 text-red-400';
      case 'Medium':
        return 'bg-amber-500/10 border-amber-500/20 text-amber-400';
      case 'Low':
        return 'bg-emerald-500/10 border-emerald-500/20 text-emerald-400';
      default:
        return 'bg-neutral-800 border-neutral-700 text-neutral-400';
    }
  };

  const getTypeBadgeStyles = (type: string | undefined) => {
    const val = type || 'Study';
    switch (val) {
      case 'Revision':
        return 'bg-pink-500/10 border-pink-500/20 text-pink-400';
      case 'Project':
        return 'bg-orange-500/10 border-orange-500/20 text-orange-400';
      case 'Certification':
        return 'bg-cyan-500/10 border-cyan-500/20 text-cyan-400';
      case 'Study':
      default:
        return 'bg-indigo-500/10 border-indigo-500/20 text-indigo-400';
    }
  };

  return (
    <div className="space-y-6">
      
      {/* Header Panel */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl font-sans font-bold text-[#fafafa] tracking-tight flex items-center gap-2">
            <TrendingUp size={22} className="text-indigo-400" />
            <span>AI Adaptive Learning Roadmap</span>
          </h1>
          <p className="text-xs text-[#a1a1aa] font-sans mt-0.5">
            Generates personalized plans dynamically mapped to your skill levels, target companies, and preparation timeline.
          </p>
        </div>
        
        <div className="flex flex-wrap items-center gap-2">
          <button 
            onClick={handleScheduleRevision}
            className="px-3.5 py-2 bg-[#18181b] hover:bg-[#27272a] border border-[#27272a] rounded-xl text-xs font-sans font-semibold text-pink-400 flex items-center gap-1.5 transition-colors cursor-pointer"
            title="Schedules a revision session targeting your lowest skill areas"
          >
            <History size={14} />
            <span>Schedule Revision</span>
          </button>

          <button 
            onClick={() => setIsAdding(!isAdding)}
            className="px-3.5 py-2 bg-[#27272a] hover:bg-[#3f3f46] border border-[#3f3f46] rounded-xl text-xs font-sans font-semibold text-[#fafafa] flex items-center gap-1.5 transition-colors cursor-pointer"
          >
            <Plus size={14} />
            <span>Add Custom Goal</span>
          </button>
          
          <button 
            onClick={handleAISync}
            disabled={loading}
            className="px-4 py-2 bg-indigo-600 hover:bg-indigo-500 disabled:opacity-50 rounded-xl text-xs font-sans font-semibold text-white flex items-center gap-1.5 transition-all duration-200 shadow-lg shadow-indigo-600/10 cursor-pointer"
          >
            <Sparkles size={15} className={loading ? "animate-spin" : "animate-pulse"} />
            {loading ? "Re-prioritizing..." : "Re-Prioritize with AI"}
          </button>
        </div>
      </div>

      {/* Progress & Stat Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        
        {/* Progress Tracker Card */}
        <div className="bg-[#18181b] border border-[#27272a] rounded-2xl p-5 flex flex-col justify-between md:col-span-2 space-y-4">
          <div className="flex items-center justify-between gap-3">
            <div className="flex items-center gap-2.5">
              <div className="p-2.5 bg-indigo-600/10 border border-indigo-500/20 text-indigo-400 rounded-xl">
                <BookOpen size={18} />
              </div>
              <div>
                <h3 className="text-xs font-sans font-bold text-[#fafafa]">Roadmap Mastery Quotient</h3>
                <span className="text-[11px] text-[#a1a1aa] font-sans block">
                  Completed <span className="text-indigo-400 font-semibold">{completedCount}</span> out of {totalCount} total objectives.
                </span>
              </div>
            </div>
            <div className="text-xs font-mono font-bold text-[#fafafa] bg-[#27272a] px-2 py-1 rounded-lg">
              {progressPercent}% Done
            </div>
          </div>
          
          <div className="space-y-1.5">
            <div className="w-full bg-[#27272a] rounded-full h-2 overflow-hidden">
              <div 
                className="bg-indigo-500 h-full transition-all duration-500" 
                style={{ width: `${progressPercent}%` }}
              />
            </div>
            <div className="flex justify-between text-[10px] text-[#71717a] font-mono">
              <span>Foundation & Core</span>
              <span>Placement Polish</span>
            </div>
          </div>
        </div>

        {/* Dynamic Scheduler Context Card */}
        <div className="bg-[#18181b] border border-[#27272a] rounded-2xl p-4 flex flex-col justify-between space-y-3">
          <div className="flex items-start gap-2">
            <Sparkles className="text-indigo-400 shrink-0 mt-0.5" size={16} />
            <div className="space-y-0.5">
              <h4 className="text-xs font-sans font-bold text-indigo-300">Adaptive Re-balancing</h4>
              <p className="text-[10px] text-[#a1a1aa] leading-relaxed">
                Our AI re-prioritizes items, generates revision slots, and schedules matching projects based on your target companies (e.g. {profile.targetCompanies.join(", ")}).
              </p>
            </div>
          </div>
          <div className="border-t border-[#27272a] pt-2 mt-auto">
            <p className="text-[9px] text-[#71717a] font-mono uppercase tracking-wider">
              Target role: {profile.targetRole || "SDE"}
            </p>
          </div>
        </div>

      </div>

      {/* Error Output */}
      {error && (
        <div className="bg-orange-500/10 border border-orange-500/30 rounded-2xl p-4 flex gap-3 text-orange-400">
          <AlertCircle className="shrink-0 mt-0.5" size={18} />
          <div className="space-y-1">
            <h4 className="text-xs font-sans font-bold">API Sync Error</h4>
            <p className="text-xxs font-sans">{error}</p>
          </div>
        </div>
      )}

      {/* Adding Goal form */}
      <AnimatePresence>
        {isAdding && (
          <motion.div 
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            className="overflow-hidden"
          >
            <div className="bg-[#18181b] border border-[#27272a] rounded-2xl p-5 space-y-4">
              <div className="border-b border-[#27272a] pb-3">
                <h3 className="text-xs font-sans font-bold text-[#fafafa] flex items-center gap-1.5">
                  <Plus size={14} className="text-indigo-400" />
                  <span>Configure Personalized Adaptive Goal</span>
                </h3>
              </div>
              <form onSubmit={handleManualSubmit} className="grid grid-cols-1 md:grid-cols-3 gap-4">
                
                {/* Title */}
                <div className="space-y-1">
                  <label className="text-[10px] font-sans font-semibold text-[#a1a1aa] uppercase tracking-wider">Goal Title</label>
                  <input 
                    type="text" 
                    value={title} 
                    onChange={e => setTitle(e.target.value)}
                    placeholder="e.g. Master Graph Dijkstra's Algorithm" 
                    className="w-full bg-[#27272a] border border-[#3f3f46] focus:border-indigo-500 rounded-xl px-3 py-2 text-xs text-[#fafafa] outline-none transition-colors"
                    required
                  />
                </div>

                {/* Task Type */}
                <div className="space-y-1">
                  <label className="text-[10px] font-sans font-semibold text-[#a1a1aa] uppercase tracking-wider">Plan Category Type</label>
                  <select 
                    value={taskType} 
                    onChange={e => setTaskType(e.target.value as any)}
                    className="w-full bg-[#27272a] border border-[#3f3f46] focus:border-indigo-500 rounded-xl px-3 py-2 text-xs text-[#fafafa] outline-none transition-colors cursor-pointer"
                  >
                    <option value="Study">Study (Theoretical/DSA Practice)</option>
                    <option value="Revision">Revision (Forgetting Curve Recall)</option>
                    <option value="Project">Project (Portfolio Sprints)</option>
                    <option value="Certification">Certification (Creds & Badges)</option>
                  </select>
                </div>

                {/* Stage Phase */}
                <div className="space-y-1">
                  <label className="text-[10px] font-sans font-semibold text-[#a1a1aa] uppercase tracking-wider">Chronological Phase</label>
                  <select 
                    value={phase} 
                    onChange={e => setPhase(e.target.value)}
                    className="w-full bg-[#27272a] border border-[#3f3f46] focus:border-indigo-500 rounded-xl px-3 py-2 text-xs text-[#fafafa] outline-none transition-colors cursor-pointer"
                  >
                    {phases.map(p => <option key={p} value={p}>{p}</option>)}
                  </select>
                </div>

                {/* Timeframe */}
                <div className="space-y-1">
                  <label className="text-[10px] font-sans font-semibold text-[#a1a1aa] uppercase tracking-wider">Timeframe Plan</label>
                  <select 
                    value={timeframe} 
                    onChange={e => setTimeframe(e.target.value as any)}
                    className="w-full bg-[#27272a] border border-[#3f3f46] focus:border-indigo-500 rounded-xl px-3 py-2 text-xs text-[#fafafa] outline-none transition-colors cursor-pointer"
                  >
                    <option value="Daily">Daily Plan (Short-term)</option>
                    <option value="Weekly">Weekly Milestone (Medium-term)</option>
                    <option value="Monthly">Monthly Objective (Long-term)</option>
                  </select>
                </div>

                {/* Priority */}
                <div className="space-y-1">
                  <label className="text-[10px] font-sans font-semibold text-[#a1a1aa] uppercase tracking-wider">Adaptive Priority</label>
                  <select 
                    value={priority} 
                    onChange={e => setPriority(e.target.value as any)}
                    className="w-full bg-[#27272a] border border-[#3f3f46] focus:border-indigo-500 rounded-xl px-3 py-2 text-xs text-[#fafafa] outline-none transition-colors cursor-pointer"
                  >
                    <option value="High">High (Immediate Requirement)</option>
                    <option value="Medium">Medium (Balanced)</option>
                    <option value="Low">Low (Strategic Backlog)</option>
                  </select>
                </div>

                {/* Duration */}
                <div className="space-y-1">
                  <label className="text-[10px] font-sans font-semibold text-[#a1a1aa] uppercase tracking-wider">Duration Estimate</label>
                  <input 
                    type="text" 
                    value={duration} 
                    onChange={e => setDuration(e.target.value)}
                    placeholder="e.g. 1 day, 1 week, 4 hours" 
                    className="w-full bg-[#27272a] border border-[#3f3f46] focus:border-indigo-500 rounded-xl px-3 py-2 text-xs text-[#fafafa] outline-none transition-colors"
                  />
                </div>

                {/* Category Topic */}
                <div className="space-y-1">
                  <label className="text-[10px] font-sans font-semibold text-[#a1a1aa] uppercase tracking-wider">Topic Category</label>
                  <input 
                    type="text" 
                    value={category} 
                    onChange={e => setCategory(e.target.value)}
                    placeholder="e.g. Dynamic Programming, Virtual Memory" 
                    className="w-full bg-[#27272a] border border-[#3f3f46] focus:border-indigo-500 rounded-xl px-3 py-2 text-xs text-[#fafafa] outline-none transition-colors"
                  />
                </div>

                {/* Associated Skill */}
                <div className="space-y-1">
                  <label className="text-[10px] font-sans font-semibold text-[#a1a1aa] uppercase tracking-wider">Associated Skill Focus</label>
                  <select 
                    value={associatedSkill} 
                    onChange={e => setAssociatedSkill(e.target.value)}
                    className="w-full bg-[#27272a] border border-[#3f3f46] focus:border-indigo-500 rounded-xl px-3 py-2 text-xs text-[#fafafa] outline-none transition-colors cursor-pointer"
                  >
                    <option value="">-- General / Other --</option>
                    {skills.map(s => <option key={s.name} value={s.name}>{s.name}</option>)}
                  </select>
                </div>

                {/* Recommended Resource Link */}
                <div className="space-y-1">
                  <label className="text-[10px] font-sans font-semibold text-[#a1a1aa] uppercase tracking-wider">Resource Recommendation Link</label>
                  <input 
                    type="text" 
                    value={resource} 
                    onChange={e => setResource(e.target.value)}
                    placeholder="e.g. Striver's sheet, Leetcode 150" 
                    className="w-full bg-[#27272a] border border-[#3f3f46] focus:border-indigo-500 rounded-xl px-3 py-2 text-xs text-[#fafafa] outline-none transition-colors"
                  />
                </div>

                {/* Goal Description */}
                <div className="md:col-span-3 space-y-1">
                  <label className="text-[10px] font-sans font-semibold text-[#a1a1aa] uppercase tracking-wider">Goal Actionable Instructions</label>
                  <input 
                    type="text" 
                    value={description} 
                    onChange={e => setDescription(e.target.value)}
                    placeholder="Briefly describe what tasks to execute" 
                    className="w-full bg-[#27272a] border border-[#3f3f46] focus:border-indigo-500 rounded-xl px-3 py-2 text-xs text-[#fafafa] outline-none transition-colors"
                  />
                </div>

                <div className="md:col-span-3 flex justify-end gap-2 pt-2 border-t border-[#27272a]">
                  <button 
                    type="button" 
                    onClick={() => setIsAdding(false)}
                    className="px-4 py-2 text-[#71717a] hover:text-[#fafafa] text-xs font-semibold cursor-pointer"
                  >
                    Cancel
                  </button>
                  <button 
                    type="submit" 
                    className="px-4 py-2 bg-indigo-600 hover:bg-indigo-500 text-white rounded-xl text-xs font-semibold cursor-pointer"
                  >
                    Insert Goal
                  </button>
                </div>
              </form>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Loading overlay for AI syncing */}
      {loading && (
        <div className="bg-[#18181b]/60 border border-[#27272a] rounded-2xl p-12 text-center flex flex-col items-center justify-center space-y-4">
          <Sparkles size={40} className="text-indigo-400 animate-spin" />
          <div className="space-y-1">
            <h3 className="text-sm font-sans font-bold text-[#fafafa]">AI Placement Planner is designing your roadmap...</h3>
            <p className="text-xs text-[#71717a] font-sans max-w-md">
              Evaluating your current CGPA, strengths, OS/DBMS level, and preferred companies to compile an optimized daily and weekly priority sheet.
            </p>
          </div>
        </div>
      )}

      {/* Main Roadmap Views and Controls */}
      {!loading && (
        <div className="space-y-6">
          
          {/* Dashboard Sub Tabs / Controls */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-[#27272a] pb-3">
            
            {/* View selectors */}
            <div className="flex flex-wrap items-center gap-1">
              <button 
                onClick={() => setActiveSubTab('planner')}
                className={`px-3 py-1.5 rounded-xl text-xs font-sans font-medium transition-all cursor-pointer flex items-center gap-1.5 ${
                  activeSubTab === 'planner' 
                    ? 'bg-indigo-500/10 text-indigo-400 border border-indigo-500/20' 
                    : 'text-[#a1a1aa] hover:text-white border border-transparent'
                }`}
              >
                <Calendar size={14} />
                <span>Adaptive Study Planner (D/W/M)</span>
              </button>

              <button 
                onClick={() => setActiveSubTab('timeline')}
                className={`px-3 py-1.5 rounded-xl text-xs font-sans font-medium transition-all cursor-pointer flex items-center gap-1.5 ${
                  activeSubTab === 'timeline' 
                    ? 'bg-indigo-500/10 text-indigo-400 border border-indigo-500/20' 
                    : 'text-[#a1a1aa] hover:text-white border border-transparent'
                }`}
              >
                <TrendingUp size={14} />
                <span>Chrono Phase Timeline</span>
              </button>

              <button 
                onClick={() => setActiveSubTab('revisions')}
                className={`px-3 py-1.5 rounded-xl text-xs font-sans font-medium transition-all cursor-pointer flex items-center gap-1.5 ${
                  activeSubTab === 'revisions' 
                    ? 'bg-pink-500/10 text-pink-400 border border-pink-500/20' 
                    : 'text-[#a1a1aa] hover:text-white border border-transparent'
                }`}
              >
                <History size={14} />
                <span>Revision Sessions</span>
                {roadmap.filter(t => t.type === 'Revision' || t.isRevision).length > 0 && (
                  <span className="w-1.5 h-1.5 bg-pink-500 rounded-full animate-pulse" />
                )}
              </button>

              <button 
                onClick={() => setActiveSubTab('suggestions')}
                className={`px-3 py-1.5 rounded-xl text-xs font-sans font-medium transition-all cursor-pointer flex items-center gap-1.5 ${
                  activeSubTab === 'suggestions' 
                    ? 'bg-orange-500/10 text-orange-400 border border-orange-500/20' 
                    : 'text-[#a1a1aa] hover:text-white border border-transparent'
                }`}
              >
                <Award size={14} />
                <span>Projects & Certs</span>
                {roadmap.filter(t => t.type === 'Project' || t.type === 'Certification').length > 0 && (
                  <span className="bg-orange-500/20 text-orange-400 text-[9px] font-mono font-bold px-1.5 py-0.5 rounded-md">
                    {roadmap.filter(t => t.type === 'Project' || t.type === 'Certification').length}
                  </span>
                )}
              </button>
            </div>

            {/* Filter Priority Dropdown */}
            <div className="flex items-center gap-2">
              <span className="text-[10px] text-[#71717a] font-mono uppercase">Filter Priority:</span>
              <select 
                value={filterPriority}
                onChange={e => setFilterPriority(e.target.value)}
                className="bg-[#18181b] border border-[#27272a] rounded-xl px-2.5 py-1 text-xs text-[#a1a1aa] outline-none cursor-pointer hover:border-[#3f3f46] transition-colors"
              >
                <option value="All">All Priorities</option>
                <option value="High">🔴 High Priority</option>
                <option value="Medium">🟡 Medium Priority</option>
                <option value="Low">🟢 Low Priority</option>
              </select>
            </div>

          </div>

          {/* RENDERING VIEW 1: D/W/M PLANNER (Default, requested specifically) */}
          {activeSubTab === 'planner' && (
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              
              {/* Daily Column */}
              <div className="space-y-4">
                <div className="flex items-center justify-between bg-[#18181b] border border-[#27272a] rounded-2xl p-4">
                  <div className="flex items-center gap-2">
                    <div className="w-2.5 h-2.5 bg-violet-400 rounded-full animate-ping" />
                    <div>
                      <h3 className="text-xs font-sans font-bold text-[#fafafa]">Daily study plans</h3>
                      <p className="text-[9px] text-[#71717a] font-mono uppercase">Short-term focus today</p>
                    </div>
                  </div>
                  <span className="text-xs font-mono text-[#a1a1aa] bg-[#27272a] px-2 py-0.5 rounded">
                    {filteredTasks.filter(t => (t.timeframe || 'Daily') === 'Daily').length} active
                  </span>
                </div>

                <div className="space-y-3">
                  {filteredTasks.filter(t => (t.timeframe || 'Daily') === 'Daily').map(task => (
                    <RoadmapCard key={task.id} task={task} onToggleComplete={onToggleComplete} onDeleteTask={handleDeleteTask} getPriorityBadgeStyles={getPriorityBadgeStyles} getTypeBadgeStyles={getTypeBadgeStyles} />
                  ))}
                  {filteredTasks.filter(t => (t.timeframe || 'Daily') === 'Daily').length === 0 && (
                    <div className="text-center py-8 border border-dashed border-[#27272a] rounded-2xl">
                      <p className="text-xs text-[#71717a] font-sans italic">No immediate daily plans.</p>
                      <button onClick={() => { setIsAdding(true); setTimeframe('Daily'); }} className="text-[10px] text-indigo-400 font-sans font-semibold hover:underline mt-1.5">Add a Daily Goal</button>
                    </div>
                  )}
                </div>
              </div>

              {/* Weekly Column */}
              <div className="space-y-4">
                <div className="flex items-center justify-between bg-[#18181b] border border-[#27272a] rounded-2xl p-4">
                  <div className="flex items-center gap-2">
                    <div className="w-2.5 h-2.5 bg-indigo-400 rounded-full" />
                    <div>
                      <h3 className="text-xs font-sans font-bold text-[#fafafa]">Weekly Milestones</h3>
                      <p className="text-[9px] text-[#71717a] font-mono uppercase">Medium-term concepts</p>
                    </div>
                  </div>
                  <span className="text-xs font-mono text-[#a1a1aa] bg-[#27272a] px-2 py-0.5 rounded">
                    {filteredTasks.filter(t => t.timeframe === 'Weekly').length} active
                  </span>
                </div>

                <div className="space-y-3">
                  {filteredTasks.filter(t => t.timeframe === 'Weekly').map(task => (
                    <RoadmapCard key={task.id} task={task} onToggleComplete={onToggleComplete} onDeleteTask={handleDeleteTask} getPriorityBadgeStyles={getPriorityBadgeStyles} getTypeBadgeStyles={getTypeBadgeStyles} />
                  ))}
                  {filteredTasks.filter(t => t.timeframe === 'Weekly').length === 0 && (
                    <div className="text-center py-8 border border-dashed border-[#27272a] rounded-2xl">
                      <p className="text-xs text-[#71717a] font-sans italic">No weekly milestones set.</p>
                      <button onClick={() => { setIsAdding(true); setTimeframe('Weekly'); }} className="text-[10px] text-indigo-400 font-sans font-semibold hover:underline mt-1.5">Add a Weekly Milestone</button>
                    </div>
                  )}
                </div>
              </div>

              {/* Monthly Column */}
              <div className="space-y-4">
                <div className="flex items-center justify-between bg-[#18181b] border border-[#27272a] rounded-2xl p-4">
                  <div className="flex items-center gap-2">
                    <div className="w-2.5 h-2.5 bg-emerald-400 rounded-full" />
                    <div>
                      <h3 className="text-xs font-sans font-bold text-[#fafafa]">Monthly Objectives</h3>
                      <p className="text-[9px] text-[#71717a] font-mono uppercase">Long-term strategic roadmap</p>
                    </div>
                  </div>
                  <span className="text-xs font-mono text-[#a1a1aa] bg-[#27272a] px-2 py-0.5 rounded">
                    {filteredTasks.filter(t => t.timeframe === 'Monthly').length} active
                  </span>
                </div>

                <div className="space-y-3">
                  {filteredTasks.filter(t => t.timeframe === 'Monthly').map(task => (
                    <RoadmapCard key={task.id} task={task} onToggleComplete={onToggleComplete} onDeleteTask={handleDeleteTask} getPriorityBadgeStyles={getPriorityBadgeStyles} getTypeBadgeStyles={getTypeBadgeStyles} />
                  ))}
                  {filteredTasks.filter(t => t.timeframe === 'Monthly').length === 0 && (
                    <div className="text-center py-8 border border-dashed border-[#27272a] rounded-2xl">
                      <p className="text-xs text-[#71717a] font-sans italic">No monthly objectives set.</p>
                      <button onClick={() => { setIsAdding(true); setTimeframe('Monthly'); }} className="text-[10px] text-indigo-400 font-sans font-semibold hover:underline mt-1.5">Add a Monthly Goal</button>
                    </div>
                  )}
                </div>
              </div>

            </div>
          )}

          {/* RENDERING VIEW 2: CHRONO PHASE TIMELINE */}
          {activeSubTab === 'timeline' && (
            <div className="space-y-8">
              {phases.map((phaseName) => {
                const phaseTasks = filteredTasks.filter(t => t.phase === phaseName);
                
                return (
                  <div key={phaseName} className="space-y-3">
                    <div className="flex items-center gap-2">
                      <TrendingUp size={16} className="text-indigo-400" />
                      <h2 className="text-base font-sans font-bold text-[#fafafa] tracking-tight">
                        {phaseName}
                      </h2>
                      <span className="text-xxs font-mono text-[#71717a] bg-[#18181b] px-2 py-0.5 rounded border border-[#27272a]">
                        {phaseTasks.length} {phaseTasks.length === 1 ? "goal" : "goals"}
                      </span>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {phaseTasks.map((task) => (
                        <RoadmapCard key={task.id} task={task} onToggleComplete={onToggleComplete} onDeleteTask={handleDeleteTask} getPriorityBadgeStyles={getPriorityBadgeStyles} getTypeBadgeStyles={getTypeBadgeStyles} />
                      ))}

                      {phaseTasks.length === 0 && (
                        <div className="text-center py-6 border border-dashed border-[#27272a] rounded-2xl md:col-span-2">
                          <p className="text-xs text-[#71717a] font-sans italic">No goals active for this phase.</p>
                        </div>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          )}

          {/* RENDERING VIEW 3: ACTIVE REVISIONS & FORGETTING CURVE */}
          {activeSubTab === 'revisions' && (
            <div className="space-y-6">
              
              {/* Informative Spaced Repetition Card */}
              <div className="bg-[#18181b] border border-[#27272a] rounded-2xl p-5 flex flex-col md:flex-row items-center justify-between gap-6">
                <div className="flex items-center gap-3">
                  <div className="p-3 bg-pink-500/10 border border-pink-500/20 text-pink-400 rounded-2xl">
                    <History size={24} />
                  </div>
                  <div className="space-y-0.5">
                    <h3 className="text-xs font-sans font-bold text-[#fafafa]">🧠 Spaced Repetition Scheduler</h3>
                    <p className="text-[11px] text-[#a1a1aa] font-sans max-w-xl">
                      Revising complex topics 3 to 5 days after initial learning blocks is highly recommended to shift active retention to long-term memory. Click <strong className="text-pink-400">Schedule Revision</strong> to dynamically compile recall slots targeting your weakest subjects.
                    </p>
                  </div>
                </div>
                <button 
                  onClick={handleScheduleRevision}
                  className="px-4 py-2 bg-pink-600 hover:bg-pink-500 rounded-xl text-xs font-sans font-semibold text-white transition-colors cursor-pointer shrink-0"
                >
                  Schedule New recall slot
                </button>
              </div>

              {/* Revision tasks list */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {filteredTasks.map(task => (
                  <RoadmapCard key={task.id} task={task} onToggleComplete={onToggleComplete} onDeleteTask={handleDeleteTask} getPriorityBadgeStyles={getPriorityBadgeStyles} getTypeBadgeStyles={getTypeBadgeStyles} />
                ))}
                {filteredTasks.length === 0 && (
                  <div className="text-center py-12 border border-dashed border-[#27272a] rounded-2xl md:col-span-2">
                    <div className="max-w-xs mx-auto space-y-2">
                      <History className="text-[#71717a] mx-auto" size={30} />
                      <p className="text-xs text-[#a1a1aa] font-sans">No revision sessions scheduled currently.</p>
                      <p className="text-[10px] text-[#71717a]">Click 'Schedule Revision' above to automatically target a weak skill or DBMS/OS concept!</p>
                    </div>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* RENDERING VIEW 4: SUGGESTED PROJECTS & CERTIFICATIONS */}
          {activeSubTab === 'suggestions' && (
            <div className="space-y-6">
              
              {/* Informative Bento card */}
              <div className="bg-[#18181b] border border-indigo-500/10 rounded-2xl p-5 flex items-start gap-4">
                <div className="p-2.5 bg-indigo-500/10 border border-indigo-500/20 text-indigo-400 rounded-2xl shrink-0">
                  <Award size={20} />
                </div>
                <div className="space-y-1">
                  <h3 className="text-xs font-sans font-bold text-[#fafafa]">AI suggested Portfolio Projects & Certifications</h3>
                  <p className="text-[11px] text-[#a1a1aa] leading-relaxed">
                    Based on your profile, we have added targeted certification items and high-impact microservices project components to make your resume highly attractive to technical recruiters at premium tier companies like Google and Amazon.
                  </p>
                </div>
              </div>

              {/* Suggestions grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {filteredTasks.map(task => (
                  <RoadmapCard key={task.id} task={task} onToggleComplete={onToggleComplete} onDeleteTask={handleDeleteTask} getPriorityBadgeStyles={getPriorityBadgeStyles} getTypeBadgeStyles={getTypeBadgeStyles} />
                ))}
                {filteredTasks.length === 0 && (
                  <div className="text-center py-12 border border-dashed border-[#27272a] rounded-2xl md:col-span-2">
                    <div className="max-w-xs mx-auto space-y-2">
                      <FolderGit2 className="text-[#71717a] mx-auto" size={30} />
                      <p className="text-xs text-[#a1a1aa] font-sans">No suggestions in the active timeline.</p>
                      <p className="text-[10px] text-[#71717a]">Click 'Re-Prioritize with AI' to automatically evaluate your weaknesses and inject real AWS/SQL certifications and REST projects!</p>
                    </div>
                  </div>
                )}
              </div>
            </div>
          )}

        </div>
      )}

    </div>
  );
}

// Extract Subcomponent: Individual Roadmap Task Card
interface CardProps {
  key?: string;
  task: RoadmapTask;
  onToggleComplete: (id: string) => void;
  onDeleteTask: (id: string) => void;
  getPriorityBadgeStyles: (p: string | undefined) => string;
  getTypeBadgeStyles: (t: string | undefined) => string;
}

function RoadmapCard({ 
  task, 
  onToggleComplete, 
  onDeleteTask, 
  getPriorityBadgeStyles, 
  getTypeBadgeStyles 
}: CardProps) {
  return (
    <div 
      className={`bg-[#18181b] border ${
        task.isCompleted ? "border-[#27272a]/60 bg-[#18181b]/40 opacity-70" : "border-[#27272a] hover:border-[#3f3f46]"
      } rounded-2xl p-4 flex items-start gap-3.5 transition-all duration-200 relative group`}
    >
      <button 
        onClick={() => onToggleComplete(task.id)}
        className="mt-1 transition-colors focus:outline-none cursor-pointer"
        title={task.isCompleted ? "Mark Incomplete" : "Mark Completed"}
      >
        {task.isCompleted ? (
          <CheckCircle className="text-emerald-400 fill-emerald-500/10" size={18} />
        ) : (
          <Circle className="text-[#71717a] hover:text-indigo-400" size={18} />
        )}
      </button>

      <div className="flex-1 space-y-2 overflow-hidden">
        
        {/* Title & Timing info */}
        <div className="space-y-1">
          <div className="flex items-start justify-between gap-2">
            <h4 className={`text-xs font-sans font-bold leading-snug ${task.isCompleted ? "text-[#71717a] line-through" : "text-[#fafafa]"}`}>
              {task.title}
            </h4>
            
            {/* Delete button (only visible on hover to maintain design cleanliness) */}
            <button 
              onClick={() => onDeleteTask(task.id)}
              className="text-[#71717a] hover:text-red-400 opacity-0 group-hover:opacity-100 transition-opacity p-0.5 rounded cursor-pointer"
              title="Delete roadmap goal"
            >
              <Trash2 size={13} />
            </button>
          </div>

          <div className="flex flex-wrap gap-1.5 items-center">
            {/* Duration */}
            <span className="text-[9px] text-[#71717a] flex items-center gap-1 font-mono">
              <Clock size={10} className="text-indigo-400/80" />
              <span>{task.duration}</span>
            </span>

            {/* Stage indicator */}
            <span className="text-[8px] font-mono font-medium text-[#71717a] border border-[#27272a] px-1.5 py-0.2 rounded uppercase">
              {task.phase.split(': ')[1] || task.phase}
            </span>
          </div>
        </div>

        {/* Action description instructions */}
        <p className={`text-[11px] font-sans leading-relaxed ${task.isCompleted ? "text-[#71717a]" : "text-[#a1a1aa]"}`}>
          {task.description}
        </p>

        {/* Action badges row */}
        <div className="flex flex-wrap gap-1.5 pt-1">
          
          {/* Priority */}
          <span className={`text-[9px] font-mono px-2 py-0.5 rounded-md border font-semibold ${getPriorityBadgeStyles(task.priority)}`}>
            {task.priority || 'High'}
          </span>

          {/* Task Type Badge */}
          <span className={`text-[9px] font-mono px-2 py-0.5 rounded-md border font-semibold flex items-center gap-1 ${getTypeBadgeStyles(task.type)}`}>
            {task.type === 'Revision' && <History size={10} />}
            {task.type === 'Project' && <Briefcase size={10} />}
            {task.type === 'Certification' && <Award size={10} />}
            <span>{task.type || 'Study'}</span>
          </span>

          {/* Timeframe Badge */}
          <span className="text-[9px] font-mono bg-[#27272a] border border-[#3f3f46] text-[#a1a1aa] px-2 py-0.5 rounded-md">
            {task.timeframe || 'Daily'}
          </span>

          {/* Category */}
          <span className="text-[9px] font-mono text-[#a1a1aa] bg-[#27272a] px-1.5 py-0.5 rounded-md max-w-[120px] truncate" title={task.category}>
            #{task.category}
          </span>
        </div>

        {/* Associated skill feedback */}
        {task.associatedSkill && task.associatedSkill !== "General" && (
          <div className="flex items-center gap-1 text-[9px] text-indigo-400/80 font-mono">
            <span className="font-bold">Addresses:</span>
            <span className="truncate max-w-[180px]">{task.associatedSkill}</span>
          </div>
        )}

        {/* Recommended Resource external trigger */}
        <div className="flex items-center gap-1 text-[9px] font-mono text-[#71717a]">
          <span className="font-bold uppercase text-indigo-400/70">Resource:</span>
          {task.resource && (task.resource.startsWith("http") || task.resource.toLowerCase().includes(".com") || task.resource.toLowerCase().includes(".org")) ? (
            <a 
              href={task.resource.startsWith("http") ? task.resource : `https://${task.resource}`} 
              target="_blank" 
              rel="noopener noreferrer" 
              className="text-indigo-400 hover:underline inline-flex items-center gap-0.5 truncate max-w-[180px]"
            >
              <span>{task.resource.replace("https://", "").replace("http://", "").split("/")[0]}</span>
              <ArrowUpRight size={10} />
            </a>
          ) : (
            <span className="truncate max-w-[180px]" title={task.resource}>{task.resource || "Self-study"}</span>
          )}
        </div>

      </div>
    </div>
  );
}
