import React, { useState } from "react";
import { 
  TrendingUp, 
  Sparkles, 
  Award, 
  ChevronRight, 
  Plus, 
  BookOpen, 
  Terminal, 
  HelpCircle,
  Clock
} from "lucide-react";
import { motion } from "motion/react";
import { SkillProgress, SkillCategory } from "../types";

interface SkillsProps {
  skills: SkillProgress[];
  onUpdateSkill: (updatedSkill: SkillProgress) => void;
  onAddSkill: (newSkill: SkillProgress) => void;
}

export default function Skills({ skills, onUpdateSkill, onAddSkill }: SkillsProps) {
  const [activeCategory, setActiveCategory] = useState<SkillCategory | "All">("All");
  const [editingSkill, setEditingSkill] = useState<string | null>(null);
  
  // States for adding a custom skill
  const [isAdding, setIsAdding] = useState(false);
  const [newSkillName, setNewSkillName] = useState("");
  const [newSkillCategory, setNewSkillCategory] = useState<SkillCategory>("Technical");
  const [newSkillLevel, setNewSkillLevel] = useState(5);
  const [newSkillTarget, setNewSkillTarget] = useState(8);

  const categories: (SkillCategory | "All")[] = ["All", "Technical", "Core CS", "Soft Skills"];

  const filteredSkills = activeCategory === "All" 
    ? skills 
    : skills.filter(s => s.category === activeCategory);

  // Analyze skills to provide real-time strengths and weaknesses metrics
  const getSkillMetrics = () => {
    const sorted = [...skills].sort((a, b) => b.currentLevel - a.currentLevel);
    const strengths = sorted.slice(0, 3);
    const weaknesses = [...skills]
      .sort((a, b) => a.currentLevel - b.currentLevel)
      .slice(0, 3);

    // Calculate an estimated study timeline
    // Average gap multiplied by standard study density
    const totalGap = skills.reduce((acc, s) => acc + Math.max(0, s.targetLevel - s.currentLevel), 0);
    const estimatedHours = totalGap * 12; // Assume ~12 hours of practice per level gap
    const estimatedDays = Math.ceil(estimatedHours / 4); // Assume 4 hours of study per day

    return { strengths, weaknesses, estimatedHours, estimatedDays };
  };

  const { strengths, weaknesses, estimatedHours, estimatedDays } = getSkillMetrics();

  const handleLevelChange = (skillName: string, field: "currentLevel" | "targetLevel", val: number) => {
    const original = skills.find(s => s.name === skillName);
    if (!original) return;

    const updated = { ...original };
    updated[field] = val;
    
    // Recalculate progress percentage
    updated.progressPercentage = Math.round((updated.currentLevel / updated.targetLevel) * 100);
    if (updated.progressPercentage > 100) updated.progressPercentage = 100;

    onUpdateSkill(updated);
  };

  const handleAddSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newSkillName.trim()) return;

    const newSkill: SkillProgress = {
      name: newSkillName.trim(),
      category: newSkillCategory,
      currentLevel: newSkillLevel,
      targetLevel: newSkillTarget,
      lastPracticeDate: new Date().toISOString().split("T")[0],
      progressPercentage: Math.round((newSkillLevel / newSkillTarget) * 100),
      aiFeedback: "Custom skill track created. Complete coding challenges or mock interviews to populate AI feedback."
    };

    onAddSkill(newSkill);
    setNewSkillName("");
    setIsAdding(false);
  };

  return (
    <div className="space-y-6">
      
      {/* Header Banner */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl font-sans font-bold text-[#fafafa] tracking-tight">Placement Skill Assessment</h1>
          <p className="text-xs text-[#a1a1aa] font-sans mt-0.5">
            Track and calibrate your expertise levels. AI automatically identifies placement risks.
          </p>
        </div>
        <button 
          onClick={() => setIsAdding(true)}
          className="px-4 py-2 bg-indigo-600 hover:bg-indigo-500 rounded-xl text-xs font-sans font-semibold text-white flex items-center gap-1.5 transition-all duration-200"
        >
          <Plus size={15} />
          Add Custom Track
        </button>
      </div>

      {/* Grid: Strengths, Weaknesses & Estimated Time to Ready */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        
        {/* Core Strength Block */}
        <div className="bg-[#18181b] border border-[#27272a] rounded-2xl p-4 space-y-3">
          <div className="flex items-center gap-1.5 text-xs font-semibold text-emerald-400">
            <Award size={15} />
            <span>TOP PLACEMENT STRENGTHS</span>
          </div>
          <div className="space-y-2.5">
            {strengths.map(s => (
              <div key={s.name} className="flex justify-between items-center text-xs">
                <span className="text-[#a1a1aa] font-sans truncate pr-2 max-w-[180px]">{s.name}</span>
                <span className="font-mono text-emerald-400 font-semibold">{s.currentLevel}/10 Lvl</span>
              </div>
            ))}
          </div>
        </div>

        {/* Major Placement Gap / Weaknesses */}
        <div className="bg-[#18181b] border border-[#27272a] rounded-2xl p-4 space-y-3">
          <div className="flex items-center gap-1.5 text-xs font-semibold text-orange-400">
            <TrendingUp size={15} />
            <span>PLACEMENT RISK GAPS</span>
          </div>
          <div className="space-y-2.5">
            {weaknesses.map(s => (
              <div key={s.name} className="flex justify-between items-center text-xs">
                <span className="text-[#a1a1aa] font-sans truncate pr-2 max-w-[180px]">{s.name}</span>
                <span className="font-mono text-orange-400 font-semibold">{s.currentLevel}/10 Lvl</span>
              </div>
            ))}
          </div>
        </div>

        {/* AI Estimation Timeline */}
        <div className="bg-[#18181b] border border-[#27272a] rounded-2xl p-4 flex flex-col justify-between">
          <div className="flex items-center justify-between mb-2">
            <div className="flex items-center gap-1.5 text-xs font-semibold text-indigo-400">
              <Clock size={15} />
              <span>ESTIMATED TIME TO READY</span>
            </div>
            <span className="text-xxs font-mono bg-indigo-500/10 text-indigo-400 px-1.5 py-0.5 rounded uppercase">AI Calc</span>
          </div>

          <div className="my-1">
            <div className="text-3xl font-mono font-bold text-indigo-200">
              ~{estimatedDays} Days
            </div>
            <p className="text-xxs text-indigo-400 font-sans mt-1">
              Requires approximately <span className="font-bold">{estimatedHours} hours</span> of structured topic drills and revision cycles to satisfy dream company levels.
            </p>
          </div>
        </div>

      </div>

      {/* Category Tabs Filter */}
      <div className="flex flex-wrap gap-2 border-b border-[#27272a] pb-2">
        {categories.map(cat => (
          <button
            key={cat}
            onClick={() => setActiveCategory(cat)}
            className={`px-3 py-1.5 rounded-lg text-xs font-sans font-medium transition-all duration-200 ${
              activeCategory === cat 
                ? "bg-indigo-600/10 text-indigo-400 border border-indigo-500/20"
                : "text-[#a1a1aa] hover:text-[#fafafa] hover:bg-[#18181b]/40"
            }`}
          >
            {cat === "All" ? "All Subjects" : cat}
          </button>
        ))}
      </div>

      {/* Skill Add Modal / Form Overlay */}
      {isAdding && (
        <motion.div 
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-[#18181b] border border-[#27272a] rounded-2xl p-5 space-y-4"
        >
          <div className="flex items-center justify-between border-b border-[#27272a] pb-2.5">
            <h3 className="text-sm font-sans font-bold text-[#fafafa]">Create New Skill Track</h3>
            <button 
              onClick={() => setIsAdding(false)}
              className="text-[#71717a] hover:text-white text-xs font-sans"
            >
              Cancel
            </button>
          </div>
          <form onSubmit={handleAddSubmit} className="grid grid-cols-1 md:grid-cols-4 gap-4 items-end">
            <div className="md:col-span-2 space-y-1">
              <label className="text-xxs font-sans font-semibold text-[#a1a1aa] uppercase">Skill/Subject Name</label>
              <input 
                type="text" 
                value={newSkillName}
                onChange={(e) => setNewSkillName(e.target.value)}
                placeholder="e.g. Docker, Spring Boot, OOP"
                className="w-full bg-[#27272a] border border-[#3f3f46] rounded-xl px-3 py-2 text-xs text-white outline-none"
                required
              />
            </div>
            <div className="space-y-1">
              <label className="text-xxs font-sans font-semibold text-[#a1a1aa] uppercase">Category</label>
              <select
                value={newSkillCategory}
                onChange={(e) => setNewSkillCategory(e.target.value as SkillCategory)}
                className="w-full bg-[#27272a] border border-[#3f3f46] rounded-xl px-3 py-2 text-xs text-white outline-none"
              >
                <option value="Technical">Technical</option>
                <option value="Core CS">Core CS</option>
                <option value="Soft Skills">Soft Skills</option>
              </select>
            </div>
            <button 
              type="submit"
              className="px-4 py-2 bg-indigo-600 hover:bg-indigo-500 text-white rounded-xl text-xs font-sans font-semibold h-10 transition-colors"
            >
              Initialize Skill
            </button>
          </form>
        </motion.div>
      )}

      {/* Skills Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {filteredSkills.map((skill) => (
          <div 
            key={skill.name} 
            className="bg-[#18181b] border border-[#27272a] hover:border-[#3f3f46] rounded-2xl p-5 space-y-4 transition-all duration-200"
          >
            {/* Header row */}
            <div className="flex items-start justify-between gap-3">
              <div>
                <span className="text-[10px] font-mono font-semibold text-indigo-400 bg-indigo-500/10 px-2 py-0.5 rounded uppercase">
                  {skill.category}
                </span>
                <h3 className="text-sm font-sans font-bold text-[#fafafa] mt-1.5">{skill.name}</h3>
              </div>
              
              <button 
                onClick={() => setEditingSkill(editingSkill === skill.name ? null : skill.name)}
                className="text-xs text-[#71717a] hover:text-indigo-400 transition-colors"
              >
                {editingSkill === skill.name ? "Done" : "Tune Levels"}
              </button>
            </div>

            {/* Slider tuning controls */}
            {editingSkill === skill.name ? (
              <div className="bg-[#27272a]/30 border border-[#27272a] rounded-xl p-3 space-y-3">
                <div className="space-y-1">
                  <div className="flex justify-between text-xxs font-semibold text-[#a1a1aa] uppercase">
                    <span>Current Level</span>
                    <span className="text-indigo-400">{skill.currentLevel}/10</span>
                  </div>
                  <input 
                    type="range" 
                    min="1" 
                    max="10" 
                    value={skill.currentLevel}
                    onChange={(e) => handleLevelChange(skill.name, "currentLevel", parseInt(e.target.value))}
                    className="w-full accent-indigo-500"
                  />
                </div>
                <div className="space-y-1">
                  <div className="flex justify-between text-xxs font-semibold text-[#a1a1aa] uppercase">
                    <span>Target Placement Level</span>
                    <span className="text-indigo-400">{skill.targetLevel}/10</span>
                  </div>
                  <input 
                    type="range" 
                    min="1" 
                    max="10" 
                    value={skill.targetLevel}
                    onChange={(e) => handleLevelChange(skill.name, "targetLevel", parseInt(e.target.value))}
                    className="w-full accent-indigo-500"
                  />
                </div>
              </div>
            ) : (
              /* Standard progress visualization */
              <div className="space-y-2">
                <div className="flex items-center justify-between text-xs">
                  <div className="flex items-center gap-1 text-[#a1a1aa] font-sans">
                    <span>Lvl {skill.currentLevel}</span>
                    <ChevronRight size={12} className="text-[#27272a]" />
                    <span className="text-[#71717a] font-medium">Target {skill.targetLevel}</span>
                  </div>
                  <span className="font-mono font-bold text-[#a1a1aa]">{skill.progressPercentage}%</span>
                </div>
                <div className="w-full bg-[#27272a] rounded-full h-1.5 overflow-hidden">
                  <div 
                    className="bg-indigo-500 h-full transition-all duration-300"
                    style={{ width: `${skill.progressPercentage}%` }}
                  />
                </div>
              </div>
            )}

            {/* AI Advisor Comments */}
            <div className="bg-[#09090b]/50 border border-[#27272a] rounded-xl p-3 flex items-start gap-2.5">
              <Sparkles size={14} className="text-indigo-400 shrink-0 mt-0.5" />
              <div className="space-y-1">
                <span className="text-xxs font-sans font-bold text-[#a1a1aa] tracking-wider block">AI ADVISOR FEEDBACK</span>
                <p className="text-xxs text-[#a1a1aa] font-sans leading-relaxed">
                  {skill.aiFeedback}
                </p>
              </div>
            </div>

            <div className="flex items-center justify-between text-[10px] text-[#71717a] font-mono">
              <span>Last Practice: {skill.lastPracticeDate}</span>
              <span>Needs Review</span>
            </div>

          </div>
        ))}
      </div>
    </div>
  );
}
