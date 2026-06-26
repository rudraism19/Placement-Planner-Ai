import React, { useState } from "react";
import { 
  User, 
  GraduationCap, 
  Briefcase, 
  Github, 
  Linkedin, 
  Code2, 
  Save, 
  Plus, 
  X,
  Sparkles
} from "lucide-react";
import { StudentProfile } from "../types";

interface ProfileProps {
  profile: StudentProfile;
  onSaveProfile: (updatedProfile: StudentProfile) => void;
}

export default function Profile({ profile, onSaveProfile }: ProfileProps) {
  const [edited, setEdited] = useState<StudentProfile>({ 
    ...profile,
    interests: profile.interests || [],
    languages: profile.languages || []
  });
  const [newCompany, setNewCompany] = useState("");
  const [newSkill, setNewSkill] = useState("");
  const [newInterest, setNewInterest] = useState("");
  const [newLanguage, setNewLanguage] = useState("");
  const [saveSuccess, setSaveSuccess] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSaveProfile(edited);
    setSaveSuccess(true);
    setTimeout(() => setSaveSuccess(false), 3000);
  };

  const addCompany = () => {
    if (newCompany.trim() && !edited.targetCompanies.includes(newCompany.trim())) {
      setEdited({
        ...edited,
        targetCompanies: [...edited.targetCompanies, newCompany.trim()]
      });
      setNewCompany("");
    }
  };

  const removeCompany = (company: string) => {
    setEdited({
      ...edited,
      targetCompanies: edited.targetCompanies.filter(c => c !== company)
    });
  };

  const addSkill = () => {
    if (newSkill.trim() && !edited.skills.includes(newSkill.trim())) {
      setEdited({
        ...edited,
        skills: [...edited.skills, newSkill.trim()]
      });
      setNewSkill("");
    }
  };

  const removeSkill = (skill: string) => {
    setEdited({
      ...edited,
      skills: edited.skills.filter(s => s !== skill)
    });
  };

  const addInterest = () => {
    const currentInterests = edited.interests || [];
    if (newInterest.trim() && !currentInterests.includes(newInterest.trim())) {
      setEdited({
        ...edited,
        interests: [...currentInterests, newInterest.trim()]
      });
      setNewInterest("");
    }
  };

  const removeInterest = (interest: string) => {
    const currentInterests = edited.interests || [];
    setEdited({
      ...edited,
      interests: currentInterests.filter(i => i !== interest)
    });
  };

  const addLanguage = () => {
    const currentLanguages = edited.languages || [];
    if (newLanguage.trim() && !currentLanguages.includes(newLanguage.trim())) {
      setEdited({
        ...edited,
        languages: [...currentLanguages, newLanguage.trim()]
      });
      setNewLanguage("");
    }
  };

  const removeLanguage = (language: string) => {
    const currentLanguages = edited.languages || [];
    setEdited({
      ...edited,
      languages: currentLanguages.filter(l => l !== language)
    });
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl font-sans font-bold text-[#fafafa] tracking-tight">Student Profile</h1>
          <p className="text-xs text-[#a1a1aa] font-sans mt-0.5">
            Manage your academic criteria, preferred roles, dream companies, and platform profiles.
          </p>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Left Columns - Form Details */}
        <div className="lg:col-span-2 space-y-6">
          
          {/* Card: Academic and Basic Info */}
          <div className="bg-[#18181b] border border-[#27272a] rounded-2xl p-6 space-y-4">
            <div className="flex items-center gap-2 border-b border-[#27272a] pb-3">
              <GraduationCap className="text-indigo-400" size={18} />
              <h2 className="text-sm font-sans font-bold text-[#fafafa]">Academic & Basic Information</h2>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-1">
                <label className="text-xxs font-sans font-semibold text-[#a1a1aa] uppercase">Full Name</label>
                <input 
                  type="text" 
                  value={edited.name}
                  onChange={(e) => setEdited({ ...edited, name: e.target.value })}
                  className="w-full bg-[#27272a] border border-[#3f3f46] focus:border-indigo-500 rounded-xl px-3 py-2 text-xs text-[#fafafa] outline-none font-sans transition-colors"
                  required
                />
              </div>

              <div className="space-y-1">
                <label className="text-xxs font-sans font-semibold text-[#a1a1aa] uppercase">Email Address</label>
                <input 
                  type="email" 
                  value={edited.email}
                  onChange={(e) => setEdited({ ...edited, email: e.target.value })}
                  className="w-full bg-[#27272a] border border-[#3f3f46] focus:border-indigo-500 rounded-xl px-3 py-2 text-xs text-[#fafafa] outline-none font-sans transition-colors"
                  required
                />
              </div>

              <div className="space-y-1">
                <label className="text-xxs font-sans font-semibold text-[#a1a1aa] uppercase">Academic Branch / Major</label>
                <input 
                  type="text" 
                  value={edited.branch}
                  onChange={(e) => setEdited({ ...edited, branch: e.target.value })}
                  className="w-full bg-[#27272a] border border-[#3f3f46] focus:border-indigo-500 rounded-xl px-3 py-2 text-xs text-[#fafafa] outline-none font-sans transition-colors"
                  required
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="text-xxs font-sans font-semibold text-[#a1a1aa] uppercase">CGPA / GPA</label>
                  <input 
                    type="number" 
                    step="0.01"
                    min="0"
                    max="10"
                    value={edited.cgpa}
                    onChange={(e) => setEdited({ ...edited, cgpa: parseFloat(e.target.value) || 0 })}
                    className="w-full bg-[#27272a] border border-[#3f3f46] focus:border-indigo-500 rounded-xl px-3 py-2 text-xs text-[#fafafa] outline-none font-mono transition-colors"
                    required
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-xxs font-sans font-semibold text-[#a1a1aa] uppercase">Graduation Year</label>
                  <input 
                    type="number" 
                    value={edited.graduationYear}
                    onChange={(e) => setEdited({ ...edited, graduationYear: parseInt(e.target.value) || 2026 })}
                    className="w-full bg-[#27272a] border border-[#3f3f46] focus:border-indigo-500 rounded-xl px-3 py-2 text-xs text-[#fafafa] outline-none font-mono transition-colors"
                    required
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Card: Career Goals */}
          <div className="bg-[#18181b] border border-[#27272a] rounded-2xl p-6 space-y-4">
            <div className="flex items-center gap-2 border-b border-[#27272a] pb-3">
              <Briefcase className="text-indigo-400" size={18} />
              <h2 className="text-sm font-sans font-bold text-[#fafafa]">Career Goals & Companies</h2>
            </div>

            <div className="space-y-4">
              <div className="space-y-1">
                <label className="text-xxs font-sans font-semibold text-[#a1a1aa] uppercase">Preferred Job Role</label>
                <input 
                  type="text" 
                  value={edited.targetRole}
                  onChange={(e) => setEdited({ ...edited, targetRole: e.target.value })}
                  placeholder="e.g. Frontend Engineer, SDE Intern"
                  className="w-full bg-[#27272a] border border-[#3f3f46] focus:border-indigo-500 rounded-xl px-3 py-2 text-xs text-[#fafafa] outline-none font-sans transition-colors"
                  required
                />
              </div>

              {/* Dream Companies Tagging */}
              <div className="space-y-2">
                <label className="text-xxs font-sans font-semibold text-[#a1a1aa] uppercase block">Dream Target Companies</label>
                <div className="flex items-center gap-2">
                  <input 
                    type="text" 
                    value={newCompany}
                    onChange={(e) => setNewCompany(e.target.value)}
                    placeholder="e.g. Adobe, Microsoft"
                    className="flex-1 bg-[#27272a] border border-[#3f3f46] focus:border-indigo-500 rounded-xl px-3 py-2 text-xs text-[#fafafa] outline-none font-sans transition-colors"
                  />
                  <button 
                    type="button"
                    onClick={addCompany}
                    className="px-3 py-2 bg-indigo-600/10 hover:bg-indigo-600/20 text-indigo-400 border border-indigo-500/20 rounded-xl text-xs font-semibold transition-all duration-200"
                  >
                    Add
                  </button>
                </div>
                <div className="flex flex-wrap gap-2 pt-1">
                  {edited.targetCompanies.map((company) => (
                    <span 
                      key={company} 
                      className="inline-flex items-center gap-1.5 px-2.5 py-1 bg-[#27272a] border border-[#3f3f46] rounded-lg text-xs font-sans text-[#a1a1aa]"
                    >
                      {company}
                      <button 
                        type="button" 
                        onClick={() => removeCompany(company)}
                        className="text-[#71717a] hover:text-orange-400 transition-colors"
                      >
                        <X size={12} />
                      </button>
                    </span>
                  ))}
                  {edited.targetCompanies.length === 0 && (
                    <span className="text-xs text-[#71717a] font-sans italic">No target companies specified yet.</span>
                  )}
                </div>
              </div>

              {/* Tech Skill Keywords tagging */}
              <div className="space-y-2">
                <label className="text-xxs font-sans font-semibold text-[#a1a1aa] uppercase block">My Technical Skill Keywords</label>
                <div className="flex items-center gap-2">
                  <input 
                    type="text" 
                    value={newSkill}
                    onChange={(e) => setNewSkill(e.target.value)}
                    placeholder="e.g. Docker, TypeScript"
                    className="flex-1 bg-[#27272a] border border-[#3f3f46] focus:border-indigo-500 rounded-xl px-3 py-2 text-xs text-[#fafafa] outline-none font-sans transition-colors"
                  />
                  <button 
                    type="button"
                    onClick={addSkill}
                    className="px-3 py-2 bg-indigo-600/10 hover:bg-indigo-600/20 text-indigo-400 border border-indigo-500/20 rounded-xl text-xs font-semibold transition-all duration-200"
                  >
                    Add
                  </button>
                </div>
                <div className="flex flex-wrap gap-2 pt-1">
                  {edited.skills.map((skill) => (
                    <span 
                      key={skill} 
                      className="inline-flex items-center gap-1.5 px-2.5 py-1 bg-[#27272a] border border-[#3f3f46] rounded-lg text-xs font-sans text-[#a1a1aa]"
                    >
                      {skill}
                      <button 
                        type="button" 
                        onClick={() => removeSkill(skill)}
                        className="text-[#71717a] hover:text-orange-400 transition-colors"
                      >
                        <X size={12} />
                      </button>
                    </span>
                  ))}
                  {edited.skills.length === 0 && (
                    <span className="text-xs text-[#71717a] font-sans italic">No custom skill keywords set yet.</span>
                  )}
                </div>
              </div>

              {/* Fields of Interest / Domain tagging */}
              <div className="space-y-2">
                <label className="text-xxs font-sans font-semibold text-[#a1a1aa] uppercase block">Fields of Interest / Domain</label>
                <div className="flex items-center gap-2">
                  <input 
                    type="text" 
                    value={newInterest}
                    onChange={(e) => setNewInterest(e.target.value)}
                    placeholder="e.g. Web Development, Machine Learning, Cloud Computing"
                    className="flex-1 bg-[#27272a] border border-[#3f3f46] focus:border-indigo-500 rounded-xl px-3 py-2 text-xs text-[#fafafa] outline-none font-sans transition-colors"
                  />
                  <button 
                    type="button"
                    onClick={addInterest}
                    className="px-3 py-2 bg-indigo-600/10 hover:bg-indigo-600/20 text-indigo-400 border border-indigo-500/20 rounded-xl text-xs font-semibold transition-all duration-200"
                  >
                    Add
                  </button>
                </div>
                <div className="flex flex-wrap gap-2 pt-1">
                  {(edited.interests || []).map((interest) => (
                    <span 
                      key={interest} 
                      className="inline-flex items-center gap-1.5 px-2.5 py-1 bg-[#27272a] border border-[#3f3f46] rounded-lg text-xs font-sans text-[#a1a1aa]"
                    >
                      {interest}
                      <button 
                        type="button" 
                        onClick={() => removeInterest(interest)}
                        className="text-[#71717a] hover:text-orange-400 transition-colors"
                      >
                        <X size={12} />
                      </button>
                    </span>
                  ))}
                  {(edited.interests || []).length === 0 && (
                    <span className="text-xs text-[#71717a] font-sans italic">No fields of interest specified yet.</span>
                  )}
                </div>
              </div>

              {/* Preferred Programming Languages tagging */}
              <div className="space-y-2">
                <label className="text-xxs font-sans font-semibold text-[#a1a1aa] uppercase block">Programming Languages of Choice</label>
                <div className="flex items-center gap-2">
                  <input 
                    type="text" 
                    value={newLanguage}
                    onChange={(e) => setNewLanguage(e.target.value)}
                    placeholder="e.g. C++, Java, Rust, TypeScript, Go"
                    className="flex-1 bg-[#27272a] border border-[#3f3f46] focus:border-indigo-500 rounded-xl px-3 py-2 text-xs text-[#fafafa] outline-none font-sans transition-colors"
                  />
                  <button 
                    type="button"
                    onClick={addLanguage}
                    className="px-3 py-2 bg-indigo-600/10 hover:bg-indigo-600/20 text-indigo-400 border border-indigo-500/20 rounded-xl text-xs font-semibold transition-all duration-200"
                  >
                    Add
                  </button>
                </div>
                <div className="flex flex-wrap gap-2 pt-1">
                  {(edited.languages || []).map((lang) => (
                    <span 
                      key={lang} 
                      className="inline-flex items-center gap-1.5 px-2.5 py-1 bg-[#27272a] border border-[#3f3f46] rounded-lg text-xs font-sans text-[#a1a1aa]"
                    >
                      {lang}
                      <button 
                        type="button" 
                        onClick={() => removeLanguage(lang)}
                        className="text-[#71717a] hover:text-orange-400 transition-colors"
                      >
                        <X size={12} />
                      </button>
                    </span>
                  ))}
                  {(edited.languages || []).length === 0 && (
                    <span className="text-xs text-[#71717a] font-sans italic">No programming languages added yet.</span>
                  )}
                </div>
              </div>

            </div>
          </div>

          {/* Card: Paste Raw Resume Text */}
          <div className="bg-[#18181b] border border-[#27272a] rounded-2xl p-6 space-y-4">
            <div className="flex items-center gap-2 border-b border-[#27272a] pb-3">
              <Sparkles className="text-indigo-400" size={18} />
              <h2 className="text-sm font-sans font-bold text-[#fafafa]">Resume Plaintext Data</h2>
            </div>
            <p className="text-xxs text-[#71717a] font-sans">
              Provide your plain-text resume description here. This content is analyzed by the AI Resume compatibility layer to benchmark matching indices.
            </p>
            <div className="space-y-1">
              <textarea 
                rows={8}
                value={edited.resumeText}
                onChange={(e) => setEdited({ ...edited, resumeText: e.target.value })}
                className="w-full bg-[#27272a] border border-[#3f3f46] focus:border-indigo-500 rounded-xl px-3 py-2 text-xs text-[#fafafa] outline-none font-mono transition-colors resize-y"
                placeholder="Paste the text from your resume here..."
              />
            </div>
          </div>

        </div>

        {/* Right Column - Integrations / Links */}
        <div className="space-y-6">
          
          <div className="bg-[#18181b] border border-[#27272a] rounded-2xl p-6 space-y-4">
            <div className="flex items-center gap-2 border-b border-[#27272a] pb-3">
              <Code2 className="text-indigo-400" size={18} />
              <h2 className="text-sm font-sans font-bold text-[#fafafa]">Platform Integrations</h2>
            </div>
            <p className="text-xs text-[#a1a1aa] font-sans">
              Configure URLs to sync solved ratios, repository weightages, and profile scores automatically.
            </p>

            <div className="space-y-3 pt-2">
              <div className="space-y-1">
                <div className="flex items-center gap-1.5 text-[#a1a1aa] mb-1">
                  <Github size={15} />
                  <span className="text-xxs font-semibold font-sans uppercase">GitHub URL</span>
                </div>
                <input 
                  type="url" 
                  value={edited.gitHubUrl}
                  onChange={(e) => setEdited({ ...edited, gitHubUrl: e.target.value })}
                  className="w-full bg-[#27272a] border border-[#3f3f46] rounded-xl px-3 py-1.5 text-xs text-[#fafafa] outline-none font-mono"
                  placeholder="https://github.com/your-username"
                />
              </div>

              <div className="space-y-1">
                <div className="flex items-center gap-1.5 text-[#a1a1aa] mb-1">
                  <Linkedin size={15} />
                  <span className="text-xxs font-semibold font-sans uppercase">LinkedIn URL</span>
                </div>
                <input 
                  type="url" 
                  value={edited.linkedInUrl}
                  onChange={(e) => setEdited({ ...edited, linkedInUrl: e.target.value })}
                  className="w-full bg-[#27272a] border border-[#3f3f46] rounded-xl px-3 py-1.5 text-xs text-[#fafafa] outline-none font-mono"
                  placeholder="https://linkedin.com/in/your-username"
                />
              </div>

              <div className="h-px bg-[#27272a] my-4" />

              <h3 className="text-xxs font-sans font-bold text-[#a1a1aa] uppercase tracking-wider">Competitive Programming Handles</h3>

              <div className="space-y-1">
                <label className="text-xxs font-sans font-semibold text-[#71717a] uppercase">LeetCode Username</label>
                <input 
                  type="text" 
                  value={edited.leetCodeUser}
                  onChange={(e) => setEdited({ ...edited, leetCodeUser: e.target.value })}
                  className="w-full bg-[#27272a] border border-[#3f3f46] rounded-xl px-3 py-1.5 text-xs text-[#fafafa] outline-none font-mono"
                  placeholder="e.g. rudra_lc"
                />
              </div>

              <div className="space-y-1">
                <label className="text-xxs font-sans font-semibold text-[#71717a] uppercase">HackerRank Username</label>
                <input 
                  type="text" 
                  value={edited.hackerRankUser}
                  onChange={(e) => setEdited({ ...edited, hackerRankUser: e.target.value })}
                  className="w-full bg-[#27272a] border border-[#3f3f46] rounded-xl px-3 py-1.5 text-xs text-[#fafafa] outline-none font-mono"
                  placeholder="e.g. rudra_hr"
                />
              </div>

              <div className="space-y-1">
                <label className="text-xxs font-sans font-semibold text-[#71717a] uppercase">Codeforces Username</label>
                <input 
                  type="text" 
                  value={edited.codeforcesUser}
                  onChange={(e) => setEdited({ ...edited, codeforcesUser: e.target.value })}
                  className="w-full bg-[#27272a] border border-[#3f3f46] rounded-xl px-3 py-1.5 text-xs text-[#fafafa] outline-none font-mono"
                  placeholder="e.g. rudra_cf"
                />
              </div>

              <div className="space-y-1">
                <label className="text-xxs font-sans font-semibold text-[#71717a] uppercase">CodeChef Username</label>
                <input 
                  type="text" 
                  value={edited.codeChefUser}
                  onChange={(e) => setEdited({ ...edited, codeChefUser: e.target.value })}
                  className="w-full bg-[#27272a] border border-[#3f3f46] rounded-xl px-3 py-1.5 text-xs text-[#fafafa] outline-none font-mono"
                  placeholder="e.g. rudra_cc"
                />
              </div>
            </div>
          </div>

          <div className="space-y-3">
            {saveSuccess && (
              <div className="text-center py-2 bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-xs font-semibold rounded-xl">
                Profile Saved Successfully!
              </div>
            )}
            
            <button 
              type="submit"
              className="w-full py-2.5 bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-semibold font-sans rounded-xl transition-all duration-200 flex items-center justify-center gap-1.5 shadow-lg shadow-indigo-600/10"
            >
              <Save size={16} />
              Save Profile Data
            </button>
          </div>

        </div>

      </form>
    </div>
  );
}
