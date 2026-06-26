import { 
  CheckCircle, 
  Circle, 
  Clock, 
  ArrowRight, 
  Sparkles, 
  Calendar, 
  Trophy, 
  Award, 
  BookOpen, 
  Briefcase 
} from "lucide-react";
import { motion } from "motion/react";
import { DashboardOverview, StudentProfile, SkillProgress, RoadmapTask, CompanyPrepPlan } from "../types";

interface DashboardProps {
  overview: DashboardOverview;
  profile: StudentProfile;
  skills: SkillProgress[];
  roadmap: RoadmapTask[];
  companies: CompanyPrepPlan[];
  onCompleteTask: (taskId: string) => void;
  onCompleteChallenge: () => void;
  challengeCompleted: boolean;
  setActiveTab: (tab: string) => void;
}

export default function Dashboard({
  overview,
  profile,
  skills,
  roadmap,
  companies,
  onCompleteTask,
  onCompleteChallenge,
  challengeCompleted,
  setActiveTab
}: DashboardProps) {
  
  // Dynamic AI Recommendation generator based on current skill state
  const getAIRecommendations = () => {
    const recommendations = [];
    const lowSkills = [...skills].sort((a, b) => a.currentLevel - b.currentLevel).slice(0, 2);
    
    if (lowSkills.length > 0) {
      recommendations.push({
        type: "Weakness Drill",
        title: `Boost ${lowSkills[0].name}`,
        description: `Your level is currently ${lowSkills[0].currentLevel}/10. Practice high-frequency interview questions to elevate it.`,
        urgency: "High",
        action: "skills"
      });
    }

    const uncompletedTask = roadmap.find(t => !t.isCompleted);
    if (uncompletedTask) {
      recommendations.push({
        type: "Next Step",
        title: uncompletedTask.title,
        description: uncompletedTask.description,
        urgency: "Medium",
        action: "roadmap"
      });
    } else {
      recommendations.push({
        type: "Resume Check",
        title: "Optimize ATS compatibility",
        description: "Analyze your resume with our AI parser and embed missing company keywords.",
        urgency: "Medium",
        action: "resume"
      });
    }

    return recommendations;
  };

  const recommendations = getAIRecommendations();
  const pendingTasks = roadmap.filter(t => !t.isCompleted).slice(0, 3);

  // Get color based on readiness score
  const getScoreColor = (score: number) => {
    if (score >= 80) return "text-emerald-400 stroke-emerald-500";
    if (score >= 60) return "text-indigo-400 stroke-indigo-500";
    return "text-orange-400 stroke-orange-500";
  };

  // Find max value in weekly study hours for scaling SVG chart
  const maxStudyHours = Math.max(...overview.weeklyProgress.map(p => p.studyHours), 1);

  return (
    <div className="space-y-6">
      {/* Top Welcome Panel */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-[#18181b] border border-[#27272a] rounded-2xl p-6">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <h1 className="text-2xl font-sans font-bold text-[#fafafa] tracking-tight">
              Welcome back, {profile.name}!
            </h1>
            <Sparkles size={18} className="text-indigo-400 animate-pulse" />
          </div>
          <p className="text-sm text-[#a1a1aa] font-sans">
            Ready to crush your placements? You are preparing for <span className="text-indigo-400 font-semibold">{profile.targetRole}</span>.
          </p>
        </div>
        <div className="flex items-center gap-3">
          <button 
            onClick={() => setActiveTab("profile")}
            className="px-4 py-2 bg-[#27272a] hover:bg-[#3f3f46] border border-[#3f3f46] rounded-xl text-xs font-sans font-semibold text-[#fafafa] transition-all duration-200"
          >
            Edit Profile
          </button>
          <button 
            onClick={() => setActiveTab("mentor")}
            className="px-4 py-2 bg-indigo-600 hover:bg-indigo-500 rounded-xl text-xs font-sans font-semibold text-white shadow-lg shadow-indigo-600/10 transition-all duration-200"
          >
            Consult AI Mentor
          </button>
        </div>
      </div>

      {/* Main Grid: Left 2 columns, Right 1 column */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Placement Readiness Card */}
        <div className="bg-[#18181b] border border-[#27272a] rounded-2xl p-6 flex flex-col items-center justify-center text-center relative overflow-hidden">
          <div className="absolute top-4 left-4 flex items-center gap-1.5 text-xs text-[#a1a1aa] font-sans">
            <Award size={15} className="text-indigo-400" />
            <span>READINESS</span>
          </div>

          <div className="relative w-36 h-36 flex items-center justify-center mt-4">
            {/* Circular Gauge */}
            <svg className="w-full h-full transform -rotate-90" viewBox="0 0 100 100">
              <circle 
                cx="50" 
                cy="50" 
                r="40" 
                className="stroke-[#27272a]" 
                strokeWidth="8" 
                fill="transparent" 
              />
              <motion.circle 
                cx="50" 
                cy="50" 
                r="40" 
                className={getScoreColor(overview.placementReadinessScore).split(" ")[1]} 
                strokeWidth="8" 
                fill="transparent" 
                strokeDasharray="251.2"
                initial={{ strokeDashoffset: 251.2 }}
                animate={{ strokeDashoffset: 251.2 - (251.2 * overview.placementReadinessScore) / 100 }}
                transition={{ duration: 1.2, ease: "easeOut" }}
                strokeLinecap="round"
              />
            </svg>
            <div className="absolute flex flex-col items-center">
              <span className={`text-4xl font-mono font-bold ${getScoreColor(overview.placementReadinessScore).split(" ")[0]}`}>
                {overview.placementReadinessScore}%
              </span>
              <span className="text-xxs text-[#71717a] tracking-wider uppercase">Score</span>
            </div>
          </div>

          <div className="mt-4">
            <h3 className="text-sm font-sans font-semibold text-[#fafafa]">Average Readiness</h3>
            <p className="text-xs text-[#a1a1aa] font-sans mt-1 px-4">
              Your overall placement index across technical abilities, core theory, and interview skills.
            </p>
          </div>
        </div>

        {/* Weekly Performance Timeline */}
        <div className="bg-[#18181b] border border-[#27272a] rounded-2xl p-6 lg:col-span-2">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-1.5 text-xs text-[#a1a1aa] font-sans">
              <Calendar size={15} className="text-indigo-400" />
              <span>WEEKLY STUDY TIMELINE</span>
            </div>
            <span className="text-xs font-sans text-[#71717a]">Last 7 Days</span>
          </div>

          {/* Custom SVG Bar Chart */}
          <div className="h-32 flex items-end justify-between gap-2 pt-2">
            {overview.weeklyProgress.map((dayData, i) => {
              const barHeightPercent = (dayData.studyHours / maxStudyHours) * 100;
              return (
                <div key={dayData.day} className="flex-1 flex flex-col items-center group cursor-pointer">
                  {/* Tooltip on Hover */}
                  <div className="opacity-0 group-hover:opacity-100 absolute bg-[#18181b] border border-[#27272a] text-xxs font-mono text-[#fafafa] px-2 py-1 rounded mb-16 transition-all duration-200 pointer-events-none z-10">
                    {dayData.studyHours}h • {dayData.solvedCount} Qs
                  </div>
                  
                  <div className="w-full bg-[#27272a] rounded-t-md overflow-hidden relative" style={{ height: "100px" }}>
                    <motion.div 
                      className="absolute bottom-0 left-0 right-0 bg-indigo-500 group-hover:bg-indigo-400 rounded-t-md transition-all duration-200"
                      initial={{ height: 0 }}
                      animate={{ height: `${barHeightPercent}%` }}
                      transition={{ delay: i * 0.05, duration: 0.8 }}
                    />
                  </div>
                  <span className="text-xxs font-mono text-[#71717a] mt-2">{dayData.day}</span>
                </div>
              );
            })}
          </div>

          <div className="flex items-center justify-between mt-4 border-t border-[#27272a] pt-3">
            <div className="flex gap-4">
              <div>
                <span className="text-xxs text-[#71717a] uppercase block">Total Hours</span>
                <span className="text-sm font-mono font-bold text-[#fafafa]">
                  {overview.weeklyProgress.reduce((sum, d) => sum + d.studyHours, 0).toFixed(1)} hrs
                </span>
              </div>
              <div>
                <span className="text-xxs text-[#71717a] uppercase block">Leetcode Solved</span>
                <span className="text-sm font-mono font-bold text-[#fafafa]">
                  +{overview.weeklyProgress.reduce((sum, d) => sum + d.solvedCount, 0)} Qs
                </span>
              </div>
            </div>
            <button 
              onClick={() => setActiveTab("coding-projects")}
              className="text-xs font-semibold text-indigo-400 hover:text-indigo-300 flex items-center gap-1 transition-all duration-200"
            >
              Analyze consistency <ArrowRight size={14} />
            </button>
          </div>
        </div>

      </div>

      {/* Second Row: 3 columns */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">

        {/* Dynamic Daily Challenge (Gamification) */}
        <div className="bg-[#18181b] border border-[#27272a] rounded-2xl p-6 flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-1.5 text-xs text-orange-400 font-sans">
                <Trophy size={15} />
                <span>DAILY CHALLENGE</span>
              </div>
              <span className="text-xs font-mono font-semibold text-indigo-400">+50 XP</span>
            </div>

            <h3 className="text-base font-sans font-bold text-[#fafafa]">
              Solve a Medium Graph DFS Problem
            </h3>
            <p className="text-xs text-[#a1a1aa] font-sans mt-2">
              Deepen your recursion and back-tracking skills by practicing DFS traversal. Solved questions on cycles count twice!
            </p>
          </div>

          <div className="mt-6">
            {challengeCompleted ? (
              <div className="w-full py-2.5 bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-xs font-semibold font-sans rounded-xl flex items-center justify-center gap-1.5">
                <CheckCircle size={15} />
                Challenge Completed!
              </div>
            ) : (
              <button 
                onClick={onCompleteChallenge}
                className="w-full py-2.5 bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-semibold font-sans rounded-xl transition-all duration-200 flex items-center justify-center gap-1.5 shadow-lg shadow-indigo-600/10"
              >
                Claim Completed (+50 XP)
              </button>
            )}
          </div>
        </div>

        {/* Up Next: Adaptive Roadmap */}
        <div className="bg-[#18181b] border border-[#27272a] rounded-2xl p-6 flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-1.5 text-xs text-[#a1a1aa] font-sans">
                <BookOpen size={15} className="text-indigo-400" />
                <span>UP NEXT IN ROADMAP</span>
              </div>
              <span className="text-xxs font-mono text-[#71717a]">
                {overview.completedTasksCount}/{overview.totalTasksCount} Done
              </span>
            </div>

            <div className="space-y-3 mt-2">
              {pendingTasks.length > 0 ? (
                pendingTasks.map((task) => (
                  <div key={task.id} className="group flex items-start gap-2.5 p-2 hover:bg-[#27272a]/40 border border-transparent hover:border-[#27272a] rounded-xl transition-all duration-200">
                    <button 
                      onClick={() => onCompleteTask(task.id)}
                      className="text-[#71717a] hover:text-indigo-400 transition-colors mt-0.5"
                    >
                      <Circle size={16} />
                    </button>
                    <div>
                      <h4 className="text-xs font-sans font-semibold text-[#a1a1aa] group-hover:text-[#fafafa] transition-colors">
                        {task.title}
                      </h4>
                      <div className="flex items-center gap-1.5 mt-0.5">
                        <Clock size={10} className="text-[#71717a]" />
                        <span className="text-xxs font-mono text-[#71717a]">{task.duration}</span>
                        <span className="text-xxs bg-[#27272a] text-[#a1a1aa] px-1.5 rounded uppercase font-sans tracking-wide">
                          {task.category}
                        </span>
                      </div>
                    </div>
                  </div>
                ))
              ) : (
                <p className="text-xs text-[#71717a] font-sans py-4 text-center">
                  All roadmap tasks completed! Great job!
                </p>
              )}
            </div>
          </div>

          <button 
            onClick={() => setActiveTab("roadmap")}
            className="w-full text-center py-2 border border-[#27272a] hover:bg-[#27272a]/50 text-xs text-[#a1a1aa] font-sans font-medium rounded-xl mt-4 transition-all duration-200"
          >
            Open Roadmap
          </button>
        </div>

        {/* Target Companies Readiness */}
        <div className="bg-[#18181b] border border-[#27272a] rounded-2xl p-6 flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-1.5 text-xs text-[#a1a1aa] font-sans">
                <Briefcase size={15} className="text-indigo-400" />
                <span>COMPANY PREPARATION</span>
              </div>
              <span className="text-xs text-[#71717a] font-sans">Readiness</span>
            </div>

            <div className="space-y-4">
              {companies.map((plan) => (
                <div key={plan.company} className="space-y-1">
                  <div className="flex items-center justify-between text-xs">
                    <span className="font-sans font-bold text-[#a1a1aa]">{plan.company}</span>
                    <span className={`font-mono font-bold ${getScoreColor(plan.readinessScore).split(" ")[0]}`}>
                      {plan.readinessScore}%
                    </span>
                  </div>
                  <div className="w-full bg-[#27272a] rounded-full h-1.5 overflow-hidden">
                    <div 
                      className={`h-full transition-all duration-500 ${
                        plan.readinessScore >= 85 ? "bg-emerald-500" : plan.readinessScore >= 70 ? "bg-indigo-500" : "bg-orange-500"
                      }`}
                      style={{ width: `${plan.readinessScore}%` }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>

          <button 
            onClick={() => setActiveTab("companies")}
            className="w-full text-center py-2 border border-[#27272a] hover:bg-[#27272a]/50 text-xs text-[#a1a1aa] font-sans font-medium rounded-xl mt-4 transition-all duration-200"
          >
            Analyze company criteria
          </button>
        </div>

      </div>

      {/* Third Row: Dynamic AI Recommendations Box */}
      <div className="bg-[#18181b] border border-[#27272a] rounded-2xl p-6">
        <div className="flex items-center gap-2 mb-4">
          <Sparkles size={18} className="text-indigo-400" />
          <h2 className="text-base font-sans font-bold text-[#fafafa] tracking-tight">
            AI-Generated Insights & Career Guidance
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {recommendations.map((rec, i) => (
            <div 
              key={i} 
              onClick={() => setActiveTab(rec.action)}
              className="bg-[#27272a]/30 border border-[#27272a] hover:border-[#3f3f46] rounded-xl p-4 cursor-pointer hover:bg-[#27272a]/50 transition-all duration-200 flex flex-col justify-between group"
            >
              <div>
                <div className="flex items-center justify-between mb-2">
                  <span className="text-xxs font-semibold bg-indigo-500/10 text-indigo-400 px-2 py-0.5 rounded uppercase">
                    {rec.type}
                  </span>
                  <span className={`text-xxs font-mono font-semibold ${rec.urgency === "High" ? "text-orange-400" : "text-[#71717a]"}`}>
                    Priority: {rec.urgency}
                  </span>
                </div>
                <h3 className="text-sm font-sans font-semibold text-[#fafafa] group-hover:text-white">
                  {rec.title}
                </h3>
                <p className="text-xs text-[#a1a1aa] font-sans mt-1">
                  {rec.description}
                </p>
              </div>

              <div className="flex items-center justify-end gap-1 text-xxs font-semibold text-indigo-400 hover:text-indigo-300 mt-4">
                <span>Configure details</span>
                <ArrowRight size={10} />
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
