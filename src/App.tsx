import { useState, useEffect } from "react";
import { 
  defaultProfile,
  defaultSkills,
  defaultRoadmap,
  defaultProjects,
  defaultInterviews,
  defaultCodingStats,
  defaultDashboardOverview,
  defaultCompanyPlans
} from "./initialData";
import { 
  StudentProfile, 
  SkillProgress, 
  RoadmapTask, 
  ProjectItem, 
  InterviewSession, 
  CompanyPrepPlan, 
  ResumeAnalysisResult, 
  DashboardOverview 
} from "./types";

// Import Modular Subcomponents
import Sidebar from "./components/Sidebar";
import Dashboard from "./components/Dashboard";
import Profile from "./components/Profile";
import Skills from "./components/Skills";
import Roadmap from "./components/Roadmap";
import Companies from "./components/Companies";
import CodingProjects from "./components/CodingProjects";
import ResumeAnalyzer from "./components/ResumeAnalyzer";
import MockInterview from "./components/MockInterview";
import MentorChat from "./components/MentorChat";
import Login from "./components/Login";
import LandingPage from "./components/LandingPage";
import { setupFirebase, signOut } from "./lib/firebase";
import { onAuthStateChanged, getAuth } from "firebase/auth";
import { doc, getDoc, setDoc, getFirestore } from "firebase/firestore";

import { Sparkles, Trophy } from "lucide-react";
import { motion, AnimatePresence } from "motion/react";

export default function App() {
  const [activeTab, setActiveTab] = useState<string>("dashboard");
  const [levelUpMessage, setLevelUpMessage] = useState<string | null>(null);
  const [apiKeyAvailable, setApiKeyAvailable] = useState<boolean>(true);

  // ----------------- AUTHENTICATION STATES & HANDLERS -----------------
  const [authToken, setAuthToken] = useState<string | null>(() => {
    return localStorage.getItem("pp_auth_token");
  });
  const [authLoading, setAuthLoading] = useState<boolean>(true);
  const [showAuthForm, setShowAuthForm] = useState<boolean>(false);

  // Sync auth state with Firebase
  useEffect(() => {
    let unsubscribe: () => void = () => {};

    setupFirebase()
      .then(() => {
        const auth = getAuth();
        unsubscribe = onAuthStateChanged(auth, async (user) => {
          if (user && user.email) {
            setAuthToken(user.uid);
            localStorage.setItem("pp_auth_token", user.uid);
            
            // Load user profile from firestore
            try {
              const db = getFirestore();
              const userRef = doc(db, "users", user.email.toLowerCase().trim());
              const userDoc = await getDoc(userRef);
              if (userDoc.exists()) {
                const fetchedProfile = userDoc.data() as StudentProfile;
                setProfile(fetchedProfile);
              } else {
                // Create profile if not exists
                const newProfile = {
                  ...defaultProfile,
                  name: user.displayName || "Student User",
                  email: user.email.toLowerCase().trim()
                };
                await setDoc(userRef, newProfile);
                setProfile(newProfile);
              }
            } catch (err) {
              console.error("Firestore sync failed on auth change:", err);
            }
          } else {
            setAuthToken(null);
            localStorage.removeItem("pp_auth_token");
          }
          setAuthLoading(false);
        });
      })
      .catch((err) => {
        console.error("Firebase setup failed inside App.tsx:", err);
        setAuthLoading(false);
      });

    return () => unsubscribe();
  }, []);

  const handleLoginSuccess = (token: string, fetchedProfile: StudentProfile) => {
    localStorage.setItem("pp_auth_token", token);
    setProfile(fetchedProfile);
    setAuthToken(token);
  };

  const handleLogout = async () => {
    try {
      const auth = getAuth();
      await signOut(auth);
    } catch (err) {
      console.error("Firebase sign out failed:", err);
    }
    localStorage.removeItem("pp_auth_token");
    setAuthToken(null);
    setShowAuthForm(false);
    setProfile(defaultProfile);
  };

  const handleSaveProfile = async (updatedProfile: StudentProfile) => {
    setProfile(updatedProfile);
    if (authToken && updatedProfile.email) {
      try {
        const db = getFirestore();
        const emailLower = updatedProfile.email.toLowerCase().trim();
        await setDoc(doc(db, "users", emailLower), updatedProfile);
        console.log("Successfully saved profile to Firestore!");
      } catch (err) {
        console.error("Failed to save profile to Firestore:", err);
      }
    }
  };

  useEffect(() => {
    fetch("/api/health")
      .then(res => res.json())
      .then(data => {
        if (data && typeof data.apiKeyAvailable === "boolean") {
          setApiKeyAvailable(data.apiKeyAvailable);
        }
      })
      .catch(err => {
        console.error("Health check failed", err);
      });
  }, []);

  // ----------------- DURABLE PERSISTENT STATES -----------------
  const [profile, setProfile] = useState<StudentProfile>(() => {
    const saved = localStorage.getItem("pp_profile");
    return saved ? JSON.parse(saved) : defaultProfile;
  });

  const [skills, setSkills] = useState<SkillProgress[]>(() => {
    const saved = localStorage.getItem("pp_skills");
    return saved ? JSON.parse(saved) : defaultSkills;
  });

  const [roadmap, setRoadmap] = useState<RoadmapTask[]>(() => {
    const saved = localStorage.getItem("pp_roadmap");
    return saved ? JSON.parse(saved) : defaultRoadmap;
  });

  const [projects, setProjects] = useState<ProjectItem[]>(() => {
    const saved = localStorage.getItem("pp_projects");
    return saved ? JSON.parse(saved) : defaultProjects;
  });

  const [interviews, setInterviews] = useState<InterviewSession[]>(() => {
    const saved = localStorage.getItem("pp_interviews");
    return saved ? JSON.parse(saved) : defaultInterviews;
  });

  const [companies, setCompanies] = useState<CompanyPrepPlan[]>(() => {
    const saved = localStorage.getItem("pp_companies");
    return saved ? JSON.parse(saved) : defaultCompanyPlans;
  });

  const [resumeAnalysis, setResumeAnalysis] = useState<ResumeAnalysisResult | undefined>(() => {
    const saved = localStorage.getItem("pp_resume_analysis");
    return saved ? JSON.parse(saved) : undefined;
  });

  const [challengeCompleted, setChallengeCompleted] = useState<boolean>(() => {
    return localStorage.getItem("pp_challenge_completed") === "true";
  });

  const [overview, setOverview] = useState<DashboardOverview>(() => {
    const saved = localStorage.getItem("pp_overview");
    if (saved) return JSON.parse(saved);
    return {
      ...defaultDashboardOverview,
      totalTasksCount: defaultRoadmap.length,
      completedTasksCount: defaultRoadmap.filter(t => t.isCompleted).length
    };
  });

  // ----------------- EFFECT SYNCHRONIZATIONS -----------------
  useEffect(() => {
    localStorage.setItem("pp_profile", JSON.stringify(profile));
  }, [profile]);

  useEffect(() => {
    localStorage.setItem("pp_skills", JSON.stringify(skills));
  }, [skills]);

  useEffect(() => {
    localStorage.setItem("pp_roadmap", JSON.stringify(roadmap));
    // Keep total/completed tasks in overview in sync
    setOverview(prev => ({
      ...prev,
      totalTasksCount: roadmap.length,
      completedTasksCount: roadmap.filter(t => t.isCompleted).length
    }));
  }, [roadmap]);

  useEffect(() => {
    localStorage.setItem("pp_projects", JSON.stringify(projects));
  }, [projects]);

  useEffect(() => {
    localStorage.setItem("pp_interviews", JSON.stringify(interviews));
  }, [interviews]);

  useEffect(() => {
    localStorage.setItem("pp_companies", JSON.stringify(companies));
  }, [companies]);

  useEffect(() => {
    if (resumeAnalysis) {
      localStorage.setItem("pp_resume_analysis", JSON.stringify(resumeAnalysis));
    }
  }, [resumeAnalysis]);

  useEffect(() => {
    localStorage.setItem("pp_overview", JSON.stringify(overview));
  }, [overview]);

  useEffect(() => {
    localStorage.setItem("pp_challenge_completed", challengeCompleted ? "true" : "false");
  }, [challengeCompleted]);

  // ----------------- GAMIFICATION & STATE HANDLERS -----------------
  
  // Award XP and handle level up boundaries (500 XP per level)
  const awardXP = (amount: number, reason: string) => {
    setOverview(prev => {
      const newXp = prev.xpPoints + amount;
      const targetLevel = Math.floor(newXp / 500) + 1;
      
      if (targetLevel > prev.level) {
        setLevelUpMessage(`Congratulations! You leveled up to Level ${targetLevel}! Reason: ${reason}`);
        setTimeout(() => setLevelUpMessage(null), 5000);
      }

      return {
        ...prev,
        xpPoints: newXp,
        level: targetLevel
      };
    });
  };

  const handleCompleteTask = (taskId: string) => {
    setRoadmap(prev => prev.map(task => {
      if (task.id === taskId) {
        if (!task.isCompleted) {
          awardXP(100, `Completed Goal: ${task.title}`);
        }
        return { ...task, isCompleted: true };
      }
      return task;
    }));
  };

  const handleToggleCompleteRoadmap = (taskId: string) => {
    setRoadmap(prev => prev.map(task => {
      if (task.id === taskId) {
        const nextState = !task.isCompleted;
        if (nextState) {
          awardXP(100, `Completed Goal: ${task.title}`);
        } else {
          // Subtract XP if toggled back
          setOverview(o => ({ ...o, xpPoints: Math.max(0, o.xpPoints - 100) }));
        }
        return { ...task, isCompleted: nextState };
      }
      return task;
    }));
  };

  const handleCompleteChallenge = () => {
    if (!challengeCompleted) {
      setChallengeCompleted(true);
      awardXP(50, "Completed Daily Challenge!");
    }
  };

  const handleUpdateSkill = (updated: SkillProgress) => {
    setSkills(prev => prev.map(s => s.name === updated.name ? updated : s));
  };

  const handleAddSkill = (newSkill: SkillProgress) => {
    setSkills(prev => [...prev, newSkill]);
    awardXP(75, `Started Skill Track: ${newSkill.name}`);
  };

  const handleAddCustomRoadmapTask = (task: RoadmapTask) => {
    setRoadmap(prev => [...prev, task]);
    awardXP(50, `Configured Goal: ${task.title}`);
  };

  const handleAddProject = (proj: ProjectItem) => {
    setProjects(prev => [...prev, proj]);
    awardXP(150, `Published Portfolio Project: ${proj.title}`);
  };

  const handleDeleteProject = (projId: string) => {
    setProjects(prev => prev.filter(p => p.id !== projId));
  };

  const handleUpdateProjectReview = (id: string, review: string) => {
    setProjects(prev => prev.map(p => p.id === id ? { ...p, aiReview: review } : p));
    awardXP(100, "Received AI Project Review Audit");
  };

  const handleAddInterviewSession = (session: InterviewSession) => {
    setInterviews(prev => [session, ...prev]);
    awardXP(200, `Finished ${session.type} Mock Interview with ${session.company}`);
  };

  // ----------------- SUBCOMPONENT ROUTING -----------------
  const renderActiveTab = () => {
    switch (activeTab) {
      case "dashboard":
        return (
          <Dashboard 
            overview={overview}
            profile={profile}
            skills={skills}
            roadmap={roadmap}
            companies={companies}
            onCompleteTask={handleCompleteTask}
            onCompleteChallenge={handleCompleteChallenge}
            challengeCompleted={challengeCompleted}
            setActiveTab={setActiveTab}
          />
        );
      case "profile":
        return (
          <Profile 
            profile={profile}
            onSaveProfile={handleSaveProfile}
          />
        );
      case "skills":
        return (
          <Skills 
            skills={skills}
            onUpdateSkill={handleUpdateSkill}
            onAddSkill={handleAddSkill}
          />
        );
      case "roadmap":
        return (
          <Roadmap 
            roadmap={roadmap}
            profile={profile}
            skills={skills}
            onToggleComplete={handleToggleCompleteRoadmap}
            onAddCustomTask={handleAddCustomRoadmapTask}
            onSetRoadmap={setRoadmap}
          />
        );
      case "companies":
        return (
          <Companies 
            companies={companies}
            profile={profile}
            skills={skills}
            onAddOrUpdatePlan={(plan) => setCompanies(prev => {
              const exists = prev.some(c => c.company.toLowerCase() === plan.company.toLowerCase());
              if (exists) {
                return prev.map(c => c.company.toLowerCase() === plan.company.toLowerCase() ? plan : c);
              }
              return [...prev, plan];
            })}
          />
        );
      case "coding-projects":
        return (
          <CodingProjects 
            codingStats={defaultCodingStats}
            projects={projects}
            onAddProject={handleAddProject}
            onDeleteProject={handleDeleteProject}
            onUpdateProjectReview={handleUpdateProjectReview}
          />
        );
      case "resume":
        return (
          <ResumeAnalyzer 
            profile={profile}
            onUpdateResumeText={(txt) => setProfile(p => ({ ...p, resumeText: txt }))}
            savedAnalysis={resumeAnalysis}
            onSaveAnalysis={(res) => {
              setResumeAnalysis(res);
              awardXP(150, "Received AI Resume ATS Review");
            }}
          />
        );
      case "interview":
        return (
          <MockInterview 
            profile={profile}
            interviewsHistory={interviews}
            onAddInterviewSession={handleAddInterviewSession}
          />
        );
      case "mentor":
        return (
          <MentorChat 
            profile={profile}
            skills={skills}
          />
        );
      default:
        return <div className="text-white text-xs font-sans">Coming Soon!</div>;
    }
  };

  if (authLoading) {
    return (
      <div className="min-h-screen bg-[#09090b] flex flex-col justify-center items-center text-[#fafafa] font-sans">
        <div className="flex flex-col items-center gap-3">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-500" />
          <p className="text-xs text-[#a1a1aa] animate-pulse">Synchronizing secure session credentials...</p>
        </div>
      </div>
    );
  }

  if (!authToken) {
    if (showAuthForm) {
      return <Login onLoginSuccess={handleLoginSuccess} onBack={() => setShowAuthForm(false)} />;
    }
    return <LandingPage onGetStarted={() => setShowAuthForm(true)} />;
  }

  return (
    <div className="flex bg-[#09090b] text-neutral-100 min-h-screen">
      
      {/* Dynamic Level-up Notification Panel */}
      <AnimatePresence>
        {levelUpMessage && (
          <motion.div 
            initial={{ opacity: 0, y: -50 }}
            animate={{ opacity: 1, y: 16 }}
            exit={{ opacity: 0, y: -50 }}
            className="fixed top-4 left-1/2 transform -translate-x-1/2 z-50 bg-gradient-to-r from-indigo-600 to-indigo-800 border border-indigo-500 rounded-2xl px-6 py-3.5 shadow-2xl flex items-center gap-3"
          >
            <Trophy className="text-yellow-400 fill-yellow-400/20 shrink-0" size={20} />
            <div>
              <h4 className="text-xs font-sans font-bold text-white tracking-tight">Level Up!</h4>
              <p className="text-[10px] text-indigo-200 font-sans mt-0.5">{levelUpMessage}</p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Navigation Sidebar */}
      <Sidebar 
        activeTab={activeTab} 
        setActiveTab={setActiveTab}
        streak={overview.studyStreak}
        level={overview.level}
        xp={overview.xpPoints}
        email={profile.email}
        onLogout={handleLogout}
      />

      {/* Main Viewport Content */}
      <main className="flex-1 p-8 overflow-y-auto h-screen scrollbar-thin scrollbar-thumb-neutral-800">
        <div className="max-w-5xl mx-auto">
          {!apiKeyAvailable && (
            <motion.div 
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-amber-500/10 border border-amber-500/20 rounded-2xl p-4 mb-6 flex items-center justify-between gap-4 text-xs font-sans text-amber-300"
            >
              <div className="flex items-center gap-3">
                <div className="p-2 bg-amber-500/10 border border-amber-500/20 rounded-xl text-amber-400 shrink-0">
                  <Sparkles size={16} className="animate-pulse" />
                </div>
                <div>
                  <h4 className="font-bold text-[#fafafa] tracking-tight">AI Simulation & Offline Fallback Mode Active</h4>
                  <p className="text-[11px] text-amber-200/85 mt-0.5 leading-relaxed">
                    To unlock live, real-time Gemini LLM reasoning customized dynamically to any prompt, configure your <strong>GEMINI_API_KEY</strong> in <strong>Settings &gt; Secrets</strong>. In the meantime, enjoy 100% interactive mock-AI simulations of all features!
                  </p>
                </div>
              </div>
            </motion.div>
          )}
          {renderActiveTab()}
        </div>
      </main>

    </div>
  );
}
