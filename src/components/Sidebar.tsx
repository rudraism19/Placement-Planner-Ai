import { 
  LayoutDashboard, 
  User, 
  TrendingUp, 
  BookOpen, 
  Briefcase, 
  Code2, 
  FileSearch, 
  MessageSquareCode, 
  Brain,
  Zap,
  Award,
  LogOut
} from "lucide-react";
import { motion } from "motion/react";

interface SidebarProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
  streak: number;
  level: number;
  xp: number;
  email: string;
  onLogout: () => void;
}

export default function Sidebar({ activeTab, setActiveTab, streak, level, xp, email, onLogout }: SidebarProps) {
  const menuItems = [
    { id: "dashboard", name: "Dashboard", icon: LayoutDashboard },
    { id: "profile", name: "Student Profile", icon: User },
    { id: "skills", name: "Skill Assessment", icon: TrendingUp },
    { id: "roadmap", name: "Adaptive Roadmap", icon: BookOpen },
    { id: "companies", name: "Target Companies", icon: Briefcase },
    { id: "coding-projects", name: "Coding & Projects", icon: Code2 },
    { id: "resume", name: "Resume Analyzer", icon: FileSearch },
    { id: "interview", name: "Mock Interview", icon: Brain },
    { id: "mentor", name: "AI Mentor Chat", icon: MessageSquareCode },
  ];

  return (
    <aside className="w-64 shrink-0 bg-[#09090b] border-r border-[#27272a] flex flex-col justify-between h-screen sticky top-0 p-4">
      {/* Brand Logo */}
      <div className="mb-6 px-2">
        <div className="flex items-center gap-2 mb-1">
          <div className="p-1.5 bg-indigo-600 rounded-lg text-white">
            <Zap size={20} className="fill-current text-white" />
          </div>
          <span className="font-sans font-bold text-lg text-[#fafafa] tracking-tight">
            Placement<span className="text-indigo-400">Planner AI</span>
          </span>
        </div>
        <span className="text-xs text-[#a1a1aa] font-sans block">
          Your Intelligent Career Companion
        </span>
      </div>

      {/* Gamification Panel (Sidebar Top) */}
      <div className="mb-4 bg-[#18181b] border border-[#27272a] rounded-xl p-3.5 flex flex-col gap-2">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-1.5 text-orange-400">
            <Zap size={16} className="fill-current" />
            <span className="text-xs font-semibold font-sans">STREAK</span>
          </div>
          <span className="text-sm font-mono font-bold text-[#fafafa]">{streak} Days</span>
        </div>

        <div className="h-px bg-[#27272a] my-1" />

        <div className="flex items-center justify-between">
          <div className="flex items-center gap-1.5 text-indigo-400">
            <Award size={16} />
            <span className="text-xs font-semibold font-sans">LEVEL {level}</span>
          </div>
          <span className="text-xs font-mono text-[#a1a1aa]">{xp} XP</span>
        </div>

        <div className="w-full bg-[#27272a] rounded-full h-1.5 overflow-hidden">
          <div 
            className="bg-indigo-500 h-full transition-all duration-500" 
            style={{ width: `${(xp % 500) / 5}%` }}
          />
        </div>
      </div>

      {/* Navigation Options */}
      <nav className="flex-1 overflow-y-auto py-2 space-y-1 scrollbar-thin scrollbar-thumb-[#27272a]">
        {menuItems.map((item) => {
          const IconComponent = item.icon;
          const isActive = activeTab === item.id;

          return (
            <button
              key={item.id}
              onClick={() => setActiveTab(item.id)}
              className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-sans transition-all duration-200 text-left relative ${
                isActive 
                  ? "text-white bg-[#18181b] border border-[#27272a]" 
                  : "text-[#a1a1aa] hover:text-[#fafafa] hover:bg-[#18181b]/50 border border-transparent"
              }`}
            >
              {isActive && (
                <motion.div
                  layoutId="active-nav-indicator"
                  className="absolute left-0 top-1/4 bottom-1/4 w-1 bg-indigo-500 rounded-r"
                  transition={{ type: "spring", stiffness: 300, damping: 30 }}
                />
              )}
              <IconComponent size={18} className={isActive ? "text-indigo-400" : "text-[#a1a1aa]"} />
              <span className="font-medium">{item.name}</span>
            </button>
          );
        })}
      </nav>

      {/* Sidebar Footer */}
      <div className="pt-4 border-t border-[#27272a] space-y-3">
        <div className="flex items-center justify-between px-2 text-[#71717a] text-xxs font-sans">
          <div className="truncate pr-2">
            <span className="block text-[#a1a1aa] font-semibold truncate">{email}</span>
            <span className="block text-[10px]">Active Session</span>
          </div>
          <button 
            onClick={onLogout}
            title="Sign Out"
            className="p-1.5 bg-[#18181b] hover:bg-[#27272a] hover:text-orange-400 border border-[#27272a] rounded-lg transition-colors cursor-pointer shrink-0"
          >
            <LogOut size={12} />
          </button>
        </div>
        <div className="text-[#71717a] text-xxs font-sans text-center">
          <span>Placement Planner AI v1.0</span>
        </div>
      </div>
    </aside>
  );
}
