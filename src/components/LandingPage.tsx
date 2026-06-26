import React from "react";
import { motion, useScroll, useTransform } from "motion/react";
import { 
  Zap, 
  ArrowRight, 
  Brain, 
  FileText, 
  Sparkles, 
  Trophy, 
  CheckCircle, 
  Code2, 
  MessageSquare,
  Shield,
  Star,
  LineChart
} from "lucide-react";

interface LandingPageProps {
  onGetStarted: () => void;
}

export default function LandingPage({ onGetStarted }: LandingPageProps) {
  const { scrollY } = useScroll();

  // Parallax shifts for background ambient glows
  const bgY1 = useTransform(scrollY, [0, 1200], [0, -120]);
  const bgY2 = useTransform(scrollY, [0, 1500], [0, 180]);
  const bgY3 = useTransform(scrollY, [0, 1800], [0, -150]);

  // Parallax subtle lag/speed for the main hero text blocks
  const heroTextY = useTransform(scrollY, [0, 600], [0, -50]);

  // Interactive 3D tilt and elevation parallax for the fake dashboard app preview
  const previewY = useTransform(scrollY, [0, 1000], [0, -90]);
  const previewRotateX = useTransform(scrollY, [0, 1000], [0, 6]);
  const previewScale = useTransform(scrollY, [0, 800], [1, 1.03]);

  const features = [
    {
      icon: Brain,
      title: "Interactive Mock Interviews",
      description: "Practice real-time behavioral and technical interviews with an AI interviewer who adapts to your resume and field.",
      color: "from-blue-500/20 to-indigo-500/20",
      iconColor: "text-blue-400"
    },
    {
      icon: FileText,
      title: "AI Resume Analyzer",
      description: "Upload or paste your resume to get instant ATS scores, gap analysis, and tailored recommendations matching target roles.",
      color: "from-purple-500/20 to-pink-500/20",
      iconColor: "text-purple-400"
    },
    {
      icon: Zap,
      title: "Personalized Roadmap",
      description: "Generates high-fidelity structured preparation roadmaps complete with levels, checkpoints, and resource links.",
      color: "from-orange-500/20 to-red-500/20",
      iconColor: "text-orange-400"
    },
    {
      icon: MessageSquare,
      title: "24/7 AI Career Mentor",
      description: "A continuous chat companion optimized to answer technical queries, solve DSA hurdles, and outline strategies.",
      color: "from-emerald-500/20 to-teal-500/20",
      iconColor: "text-emerald-400"
    }
  ];

  const steps = [
    {
      num: "01",
      title: "Create Profile",
      desc: "Sign up and feed in your skills, preferred tech stack, targets, and resume details."
    },
    {
      num: "02",
      title: "Analyze & Build",
      desc: "Generate your tailored, step-by-step career track and analyze current resume gaps."
    },
    {
      num: "03",
      title: "Interview & Refine",
      desc: "Simulate live interactive whiteboard rounds and refine conversational and DSA skills."
    },
    {
      num: "04",
      title: "Land The Offer",
      desc: "Track consistency with daily streaks, earn XP, level up, and apply confidently."
    }
  ];

  return (
    <div className="min-h-screen bg-[#09090b] text-[#fafafa] selection:bg-indigo-500/30 overflow-x-hidden font-sans">
      {/* Background gradients with Parallax translation */}
      <motion.div 
        style={{ y: bgY1 }}
        className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-7xl h-[600px] bg-gradient-to-b from-indigo-900/10 via-purple-900/5 to-transparent blur-[120px] -z-10 pointer-events-none" 
      />
      <motion.div 
        style={{ y: bgY2 }}
        className="absolute top-1/3 right-10 w-96 h-96 bg-indigo-600/5 rounded-full blur-3xl -z-10 pointer-events-none" 
      />
      <motion.div 
        style={{ y: bgY3 }}
        className="absolute bottom-1/4 left-10 w-96 h-96 bg-purple-600/5 rounded-full blur-3xl -z-10 pointer-events-none" 
      />

      {/* Header / Navbar */}
      <header className="sticky top-0 z-50 backdrop-blur-md bg-[#09090b]/80 border-b border-[#1c1c1f] px-6 py-4 transition-all">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="p-2 bg-indigo-600 rounded-xl text-white shadow-lg shadow-indigo-600/20">
              <Zap size={18} className="fill-current text-white animate-pulse" />
            </div>
            <span className="font-sans font-bold text-base tracking-tight">
              Placement<span className="text-indigo-400">Planner AI</span>
            </span>
          </div>

          <div className="flex items-center gap-4">
            <button 
              onClick={onGetStarted}
              className="text-xs font-semibold text-[#a1a1aa] hover:text-[#fafafa] transition-colors cursor-pointer"
            >
              Sign In
            </button>
            <button 
              onClick={onGetStarted}
              className="px-4 py-2 bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-bold rounded-xl transition-all duration-200 flex items-center gap-1.5 shadow-lg shadow-indigo-600/15 cursor-pointer"
            >
              <span>Get Started</span>
              <ArrowRight size={14} />
            </button>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="px-6 pt-20 pb-16 md:pt-32 md:pb-24 max-w-5xl mx-auto text-center space-y-8 [perspective:1200px]">
        {/* Parallax Hero text container */}
        <motion.div style={{ y: heroTextY }} className="space-y-8">
          <motion.div
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="inline-flex items-center gap-2 px-3.5 py-1.5 bg-indigo-500/10 border border-indigo-500/20 rounded-full text-indigo-300 text-[11px] font-medium tracking-wide"
          >
            <Sparkles size={12} className="text-indigo-400" />
            <span>Next-Generation Career Co-Pilot</span>
          </motion.div>

          <div className="space-y-4">
            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1, duration: 0.6 }}
              className="text-4xl md:text-6xl font-bold tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-[#ffffff] via-[#f4f4f5] to-[#a1a1aa] leading-tight"
            >
              Supercharge Your <br />
              <span className="bg-clip-text text-transparent bg-gradient-to-r from-indigo-400 via-purple-400 to-pink-400">
                Placement Trajectory
              </span>
            </motion.h1>

            <motion.p
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2, duration: 0.6 }}
              className="text-sm md:text-base text-[#a1a1aa] max-w-2xl mx-auto leading-relaxed font-sans"
            >
              Placement Planner AI gamifies your tech prep. Leverage intelligent ATS resume auditing, personalized DSA & field roadmaps, live interactive mock interviews, and 24/7 mentoring.
            </motion.p>
          </div>

          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3, duration: 0.5 }}
            className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-4"
          >
            <button
              onClick={onGetStarted}
              className="w-full sm:w-auto px-8 py-4 bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-bold rounded-xl transition-all duration-200 flex items-center justify-center gap-2 shadow-xl shadow-indigo-600/20 cursor-pointer hover:-translate-y-0.5 active:translate-y-0"
            >
              <span>Launch Dashboard Now</span>
              <ArrowRight size={15} />
            </button>
            <a
              href="#features"
              className="w-full sm:w-auto px-8 py-4 bg-[#18181b]/50 hover:bg-[#18181b] text-xs font-bold rounded-xl border border-[#27272a] hover:border-[#3f3f46] text-[#a1a1aa] hover:text-[#fafafa] transition-all duration-200 text-center"
            >
              Explore Platform Features
            </a>
          </motion.div>
        </motion.div>

        {/* Dashboard Preview / Glass Card with 3D Parallax effect */}
        <motion.div
          style={{ 
            y: previewY, 
            rotateX: previewRotateX, 
            scale: previewScale,
            transformStyle: "preserve-3d"
          }}
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4, duration: 0.8, type: "spring" }}
          className="relative pt-12"
        >
          <div className="absolute inset-0 bg-indigo-500/5 rounded-3xl blur-xl -z-10" />
          <div className="bg-[#18181b]/80 border border-[#27272a] rounded-2xl p-2 md:p-3.5 shadow-2xl backdrop-blur-xl">
            <div className="bg-[#09090b] rounded-xl border border-[#27272a]/40 overflow-hidden shadow-inner aspect-[16/9] flex flex-col">
              {/* Fake Chrome window controls */}
              <div className="bg-[#18181b] px-4 py-2.5 flex items-center gap-2 border-b border-[#27272a]">
                <div className="w-2.5 h-2.5 rounded-full bg-red-500/80" />
                <div className="w-2.5 h-2.5 rounded-full bg-yellow-500/80" />
                <div className="w-2.5 h-2.5 rounded-full bg-green-500/80" />
                <div className="bg-[#09090b] text-[10px] text-[#71717a] font-mono px-4 py-0.5 rounded-md mx-auto w-1/3 truncate">
                  placement-planner-ai.com/dashboard
                </div>
              </div>
              {/* Fake preview app content */}
              <div className="flex-1 p-4 md:p-6 text-left space-y-4 md:space-y-6 overflow-hidden select-none">
                <div className="flex items-center justify-between">
                  <div className="space-y-1">
                    <div className="h-4 w-32 bg-[#27272a] rounded animate-pulse" />
                    <div className="h-2.5 w-48 bg-[#18181b] rounded animate-pulse" />
                  </div>
                  <div className="flex gap-2">
                    <div className="h-6 w-16 bg-indigo-500/10 border border-indigo-500/20 rounded" />
                    <div className="h-6 w-16 bg-[#18181b] border border-[#27272a] rounded" />
                  </div>
                </div>

                <div className="grid grid-cols-3 gap-3 md:gap-4">
                  <div className="bg-[#18181b] border border-[#27272a] p-3 rounded-xl space-y-2">
                    <div className="h-3 w-16 bg-[#27272a] rounded" />
                    <div className="h-6 w-24 bg-gradient-to-r from-indigo-500 to-purple-500 rounded" />
                    <div className="h-2 w-10 bg-[#27272a] rounded" />
                  </div>
                  <div className="bg-[#18181b] border border-[#27272a] p-3 rounded-xl space-y-2">
                    <div className="h-3 w-16 bg-[#27272a] rounded" />
                    <div className="h-6 w-24 bg-gradient-to-r from-emerald-500 to-teal-500 rounded" />
                    <div className="h-2 w-10 bg-[#27272a] rounded" />
                  </div>
                  <div className="bg-[#18181b] border border-[#27272a] p-3 rounded-xl space-y-2">
                    <div className="h-3 w-16 bg-[#27272a] rounded" />
                    <div className="h-6 w-20 bg-gradient-to-r from-orange-500 to-red-500 rounded" />
                    <div className="h-2 w-10 bg-[#27272a] rounded" />
                  </div>
                </div>

                <div className="grid grid-cols-5 gap-4">
                  <div className="col-span-3 bg-[#18181b] border border-[#27272a] p-4 rounded-xl space-y-2.5 h-36">
                    <div className="h-4 w-1/3 bg-[#27272a] rounded" />
                    <div className="space-y-2 pt-2">
                      <div className="h-2 w-full bg-[#27272a]/60 rounded" />
                      <div className="h-2 w-5/6 bg-[#27272a]/60 rounded" />
                      <div className="h-2 w-4/6 bg-[#27272a]/60 rounded" />
                    </div>
                  </div>
                  <div className="col-span-2 bg-[#18181b] border border-[#27272a] p-4 rounded-xl space-y-2.5 h-36 flex flex-col justify-between">
                    <div>
                      <div className="h-4 w-1/2 bg-[#27272a] rounded" />
                      <div className="h-2 w-3/4 bg-[#27272a]/60 rounded mt-2" />
                    </div>
                    <div className="h-8 w-full bg-indigo-600 rounded-lg" />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </motion.div>
      </section>

      {/* Stats Section */}
      <section className="bg-[#18181b]/30 border-y border-[#1c1c1f] py-12 px-6">
        <div className="max-w-5xl mx-auto grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
          <div className="space-y-1">
            <p className="text-3xl font-extrabold text-white">94%</p>
            <p className="text-xxs text-[#a1a1aa] uppercase tracking-wider font-semibold">ATS Selection Rate</p>
          </div>
          <div className="space-y-1">
            <p className="text-3xl font-extrabold text-indigo-400">10k+</p>
            <p className="text-xxs text-[#a1a1aa] uppercase tracking-wider font-semibold">Mock Questions</p>
          </div>
          <div className="space-y-1">
            <p className="text-3xl font-extrabold text-purple-400">2.5x</p>
            <p className="text-xxs text-[#a1a1aa] uppercase tracking-wider font-semibold">Average Prep Speed</p>
          </div>
          <div className="space-y-1">
            <p className="text-3xl font-extrabold text-orange-400">Zero</p>
            <p className="text-xxs text-[#a1a1aa] uppercase tracking-wider font-semibold">Subscription Cost</p>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="max-w-5xl mx-auto px-6 py-24 space-y-16">
        <div className="text-center space-y-3">
          <h2 className="text-2xl md:text-3xl font-bold tracking-tight text-white">
            Designed for Peak Preparation
          </h2>
          <p className="text-xs text-[#a1a1aa] max-w-md mx-auto">
            Everything you need to master codings rounds, portfolio design, and technical system rounds.
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-6">
          {features.map((feature, idx) => {
            const IconComponent = feature.icon;
            return (
              <motion.div
                key={idx}
                whileHover={{ y: -4 }}
                transition={{ duration: 0.2 }}
                className="bg-[#18181b] border border-[#27272a] rounded-2xl p-6 shadow-xl relative overflow-hidden group flex flex-col justify-between"
              >
                <div className={`absolute top-0 right-0 w-24 h-24 bg-gradient-to-br ${feature.color} blur-2xl opacity-40 rounded-full group-hover:scale-125 transition-all duration-300`} />
                <div className="space-y-4">
                  <div className={`p-3 bg-[#09090b] rounded-xl inline-block border border-[#27272a] ${feature.iconColor}`}>
                    <IconComponent size={20} />
                  </div>
                  <div className="space-y-1.5">
                    <h3 className="text-sm font-bold text-white font-sans">{feature.title}</h3>
                    <p className="text-xs text-[#a1a1aa] leading-relaxed font-sans">{feature.description}</p>
                  </div>
                </div>
                <div className="pt-4 flex items-center gap-1.5 text-xxs text-indigo-400 font-semibold uppercase tracking-wider opacity-0 group-hover:opacity-100 transition-opacity">
                  <span>Simulate round</span>
                  <ArrowRight size={10} />
                </div>
              </motion.div>
            );
          })}
        </div>
      </section>

      {/* How it Works / Workflow */}
      <section className="bg-[#18181b]/20 border-t border-[#1c1c1f] py-24 px-6">
        <div className="max-w-5xl mx-auto space-y-16">
          <div className="text-center space-y-3">
            <h2 className="text-2xl md:text-3xl font-bold tracking-tight text-white">
              The Journey to Your Dream Offer
            </h2>
            <p className="text-xs text-[#a1a1aa] max-w-sm mx-auto">
              A structured roadmap crafted by expert AI pipelines to optimize technical competence.
            </p>
          </div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {steps.map((step, idx) => (
              <div 
                key={idx}
                className="bg-[#18181b] border border-[#27272a]/60 rounded-xl p-5 relative overflow-hidden space-y-3"
              >
                <span className="text-3xl font-black text-[#27272a] block select-none">
                  {step.num}
                </span>
                <div className="space-y-1">
                  <h4 className="text-xs font-bold text-white font-sans">{step.title}</h4>
                  <p className="text-[11px] text-[#a1a1aa] leading-relaxed font-sans">{step.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials or Gamified stats banner */}
      <section className="max-w-4xl mx-auto px-6 py-24 text-center space-y-8 relative">
        <div className="absolute inset-0 bg-indigo-600/5 blur-3xl rounded-full -z-10 pointer-events-none" />
        <div className="max-w-xl mx-auto space-y-4">
          <div className="flex justify-center gap-1 text-yellow-500">
            <Star size={14} className="fill-current" />
            <Star size={14} className="fill-current" />
            <Star size={14} className="fill-current" />
            <Star size={14} className="fill-current" />
            <Star size={14} className="fill-current" />
          </div>
          <p className="text-sm md:text-base italic text-white leading-relaxed font-sans">
            "With the AI Interview simulator, I was able to iron out my nervousness for systemic design questions. The roadmap felt specifically customized for me, unlike any generic blog post."
          </p>
          <div className="space-y-0.5">
            <p className="text-xs font-bold text-indigo-400">Rudra Sen</p>
            <p className="text-[10px] text-[#71717a]">CSE Undergrad • SDE Target</p>
          </div>
        </div>
      </section>

      {/* CTA Footer */}
      <section className="bg-gradient-to-b from-[#18181b]/40 to-[#09090b] border-t border-[#1c1c1f] py-20 px-6 text-center">
        <div className="max-w-3xl mx-auto space-y-6">
          <h2 className="text-2xl md:text-3xl font-bold tracking-tight text-white">
            Take Control of Your Career Path
          </h2>
          <p className="text-xs text-[#a1a1aa] max-w-md mx-auto leading-relaxed">
            Ready to structure your daily consistency and target key companies like Google, Amazon, Microsoft, and more? No API Keys or setup required.
          </p>
          <div className="pt-2">
            <button
              onClick={onGetStarted}
              className="px-8 py-3.5 bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-bold rounded-xl transition-all duration-200 inline-flex items-center gap-2 shadow-lg shadow-indigo-600/20 cursor-pointer"
            >
              <span>Initialize Placement Planner</span>
              <ArrowRight size={14} />
            </button>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-[#1c1c1f] bg-[#09090b] py-8 px-6 text-center text-[#71717a] text-xxs font-sans space-y-1">
        <p>© {new Date().getFullYear()} Placement Planner AI. All rights reserved.</p>
        <p>Built with Google Cloud Firestore & Firebase Auth security.</p>
      </footer>
    </div>
  );
}
