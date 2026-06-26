import React, { useState, useRef, useEffect } from "react";
import { 
  MessageSquareCode, 
  Send, 
  Sparkles, 
  User, 
  Brain, 
  BookOpen, 
  GraduationCap,
  Briefcase
} from "lucide-react";
import { motion } from "motion/react";
import { StudentProfile, SkillProgress } from "../types";

interface MentorChatProps {
  profile: StudentProfile;
  skills: SkillProgress[];
}

interface ChatMessage {
  id: string;
  sender: "user" | "bot";
  text: string;
  timestamp: string;
}

export default function MentorChat({ profile, skills }: MentorChatProps) {
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: "m0",
      sender: "bot",
      text: "Hello! I am your AI Career Mentor. I have complete access to your skills progress, academic CGPA, active projects, and target company profiles. Ask me any specific preparation questions like 'What should I study today?', 'Am I ready for Amazon?', or request code walkthroughs!",
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    }
  ]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Auto-scroll to bottom of chat
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, loading]);

  const handleSendMessage = async (textToSend: string) => {
    if (!textToSend.trim()) return;

    const userMsg: ChatMessage = {
      id: `u_${Date.now()}`,
      sender: "user",
      text: textToSend.trim(),
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };

    setMessages(prev => [...prev, userMsg]);
    setInput("");
    setLoading(true);

    try {
      const response = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          message: textToSend.trim(),
          history: messages.slice(-10), // Send last 10 messages for conversational memory
          profile,
          skills
        })
      });

      if (!response.ok) {
        throw new Error("Failed to communicate with AI Mentor.");
      }

      const data = await response.json();
      
      const botMsg: ChatMessage = {
        id: `b_${Date.now()}`,
        sender: "bot",
        text: data.text || "I was unable to process that. Please try rephrasing your question.",
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      };

      setMessages(prev => [...prev, botMsg]);
    } catch (err: any) {
      console.error(err);
      const botMsg: ChatMessage = {
        id: `b_${Date.now()}`,
        sender: "bot",
        text: "I am having trouble reaching my neural network. Please make sure your GEMINI_API_KEY is configured in Settings > Secrets. In the meantime, feel free to review your tracked skills and adaptive roadmap phase goals!",
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      };
      setMessages(prev => [...prev, botMsg]);
    } finally {
      setLoading(false);
    }
  };

  const handleFormSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    handleSendMessage(input);
  };

  const suggestionPills = [
    { text: "What should I study today?", icon: BookOpen },
    { text: `Am I ready for ${profile.targetCompanies[0] || 'Amazon'}?`, icon: Briefcase },
    { text: "Which project should I build next?", icon: MessageSquareCode },
    { text: "How can I improve my resume?", icon: GraduationCap }
  ];

  return (
    <div className="h-[calc(100vh-140px)] flex flex-col justify-between bg-[#18181b] border border-[#27272a] rounded-2xl overflow-hidden">
      
      {/* Top chat header */}
      <div className="bg-[#18181b] border-b border-[#27272a] px-5 py-4 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-indigo-600/10 border border-indigo-500/20 text-indigo-400 rounded-xl">
            <MessageSquareCode size={20} />
          </div>
          <div>
            <h2 className="text-sm font-sans font-bold text-[#fafafa] tracking-tight">AI SDE Placement Mentor</h2>
            <div className="flex items-center gap-1.5 mt-0.5">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
              <span className="text-[10px] font-mono text-[#71717a] uppercase">Context Synchronized</span>
            </div>
          </div>
        </div>
      </div>

      {/* Messages Thread list */}
      <div className="flex-1 overflow-y-auto p-5 space-y-4 scrollbar-thin scrollbar-thumb-neutral-800">
        {messages.map((msg) => (
          <div 
            key={msg.id} 
            className={`flex gap-3 max-w-2xl ${msg.sender === "user" ? "ml-auto flex-row-reverse" : "mr-auto"}`}
          >
            {/* Avatar */}
            <div className={`w-8 h-8 rounded-xl flex items-center justify-center shrink-0 border ${
              msg.sender === "user" 
                ? "bg-indigo-600/10 border-indigo-500/20 text-indigo-400" 
                : "bg-[#27272a] border-[#3f3f46] text-[#a1a1aa]"
            }`}>
              {msg.sender === "user" ? <User size={15} /> : <Brain size={15} />}
            </div>

            {/* Bubble */}
            <div className={`space-y-1 rounded-2xl px-4 py-2.5 text-xs font-sans leading-relaxed ${
              msg.sender === "user" 
                ? "bg-indigo-600 text-white" 
                : "bg-[#27272a] text-[#fafafa] border border-[#3f3f46]"
            }`}>
              <div className="whitespace-pre-wrap select-text">
                {msg.text}
              </div>
              <span className="block text-[9px] text-right opacity-60 font-mono mt-1">
                {msg.timestamp}
              </span>
            </div>
          </div>
        ))}

        {loading && (
          <div className="flex gap-3 mr-auto">
            <div className="w-8 h-8 rounded-xl flex items-center justify-center bg-[#27272a] border border-[#3f3f46] text-[#a1a1aa]">
              <Brain size={15} className="animate-pulse text-indigo-400" />
            </div>
            <div className="bg-[#27272a] text-[#a1a1aa] border border-[#3f3f46] rounded-2xl px-4 py-3 text-xs font-sans flex items-center gap-2">
              <Sparkles size={14} className="animate-spin text-indigo-400" />
              <span>Consulting profile data and calculating suggestions...</span>
            </div>
          </div>
        )}

        <div ref={messagesEndRef} />
      </div>

      {/* Suggestion pills footer bar */}
      <div className="px-5 py-2 border-t border-[#27272a]/50 flex flex-wrap gap-2 bg-[#18181b]/60">
        {suggestionPills.map((pill, idx) => {
          const Icon = pill.icon;
          return (
            <button
              key={idx}
              onClick={() => handleSendMessage(pill.text)}
              disabled={loading}
              className="px-2.5 py-1.5 bg-[#27272a] hover:bg-[#27272a]/80 border border-[#3f3f46] rounded-xl text-xxs font-sans font-semibold text-[#a1a1aa] hover:text-[#fafafa] flex items-center gap-1.5 transition-all duration-200 cursor-pointer"
            >
              <Icon size={12} className="text-indigo-400" />
              <span>{pill.text}</span>
            </button>
          );
        })}
      </div>

      {/* Input Chat bar form */}
      <div className="bg-[#18181b] border-t border-[#27272a] p-4">
        <form onSubmit={handleFormSubmit} className="flex gap-2">
          <input
            type="text"
            value={input}
            onChange={e => setInput(e.target.value)}
            disabled={loading}
            placeholder="Ask your career AI anything..."
            className="flex-1 bg-[#27272a] border border-[#3f3f46] focus:border-indigo-500 rounded-xl px-4 py-2.5 text-xs text-white outline-none font-sans"
          />
          <button
            type="submit"
            disabled={loading || !input.trim()}
            className="px-4 py-2.5 bg-indigo-600 hover:bg-indigo-500 disabled:opacity-50 text-white rounded-xl text-xs font-sans font-bold flex items-center justify-center transition-colors shadow-lg shadow-indigo-600/10"
          >
            <Send size={15} />
          </button>
        </form>
      </div>

    </div>
  );
}
