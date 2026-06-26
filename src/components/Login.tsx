import React, { useState, useEffect } from "react";
import { Sparkles, Zap, ArrowLeft, Loader2 } from "lucide-react";
import { motion } from "motion/react";
import { StudentProfile } from "../types";
import { defaultProfile } from "../initialData";
import { 
  setupFirebase, 
  signInWithPopup, 
  googleProvider 
} from "../lib/firebase";
import { doc, getDoc, setDoc, getFirestore } from "firebase/firestore";

interface LoginProps {
  onLoginSuccess: (token: string, profile: StudentProfile) => void;
  onBack?: () => void;
}

export default function Login({ onLoginSuccess, onBack }: LoginProps) {
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [firebaseReady, setFirebaseReady] = useState(false);

  // Initialize Firebase client on mount
  useEffect(() => {
    setupFirebase()
      .then(() => setFirebaseReady(true))
      .catch((err) => {
        console.error("Firebase setup failed in Login component:", err);
        setErrorMessage("Unable to connect to the authentication server. Please refresh.");
      });
  }, []);

  const handleProfileSync = async (uid: string, userEmail: string, displayName: string | null) => {
    const emailLower = userEmail.toLowerCase().trim();
    const db = getFirestore();
    const userRef = doc(db, "users", emailLower);
    
    let profileData: StudentProfile;
    try {
      const userDoc = await getDoc(userRef);
      if (userDoc.exists()) {
        profileData = userDoc.data() as StudentProfile;
      } else {
        // Create new profile based on default profile
        profileData = {
          ...defaultProfile,
          name: displayName || "Student User",
          email: emailLower,
        };
        await setDoc(userRef, profileData);
      }
      return profileData;
    } catch (err) {
      console.error("Error syncing profile with Firestore:", err);
      // Fallback to local profile object if firestore write/read fails (e.g. permission issues or network glitch)
      return {
        ...defaultProfile,
        name: displayName || "Student User",
        email: emailLower,
      };
    }
  };

  const handleGoogleSignIn = async () => {
    if (!firebaseReady) return;
    setIsLoading(true);
    setErrorMessage(null);

    try {
      const { auth } = await setupFirebase();
      const result = await signInWithPopup(auth, googleProvider);
      const user = result.user;
      
      if (user && user.email) {
        const syncedProfile = await handleProfileSync(user.uid, user.email, user.displayName);
        onLoginSuccess(user.uid, syncedProfile);
      } else {
        throw new Error("Could not retrieve email from Google Account.");
      }
    } catch (err: any) {
      console.error("Google Auth error:", err);
      if (err.code === "auth/popup-closed-by-user") {
        setErrorMessage("Sign-in popup closed before completion.");
      } else if (err.code === "auth/operation-not-allowed") {
        setErrorMessage("Google Sign-In is not enabled in your Firebase console. Please go to your Firebase Console under 'Build' -> 'Authentication' -> 'Sign-in method' and enable the Google provider.");
      } else {
        setErrorMessage(err.message || "Google Authentication failed.");
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#09090b] text-[#fafafa] flex flex-col justify-center items-center p-4 selection:bg-indigo-500/30 relative overflow-hidden">
      {/* Background Decorative Blobs */}
      <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-indigo-600/10 rounded-full blur-3xl -z-10 animate-pulse duration-[8000ms] pointer-events-none" />
      <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-purple-600/10 rounded-full blur-3xl -z-10 animate-pulse duration-[10000ms] pointer-events-none" />

      <div className="w-full max-w-sm space-y-8 relative z-10">
        {onBack && (
          <button 
            type="button"
            onClick={onBack}
            className="inline-flex items-center gap-1.5 text-xs font-semibold text-[#a1a1aa] hover:text-[#fafafa] transition-colors cursor-pointer group"
          >
            <ArrowLeft size={14} className="group-hover:-translate-x-0.5 transition-transform" />
            <span>Back to overview</span>
          </button>
        )}

        {/* Logo and Greeting */}
        <div className="text-center space-y-2">
          <motion.div 
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ duration: 0.5, ease: "easeOut" }}
            className="inline-flex p-3 bg-indigo-600 rounded-2xl text-white shadow-xl shadow-indigo-600/20 mb-3"
          >
            <Zap size={28} className="fill-current text-white animate-pulse" />
          </motion.div>
          
          <motion.h1 
            initial={{ y: -10, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.1, duration: 0.5 }}
            className="text-2xl font-sans font-bold tracking-tight text-[#fafafa]"
          >
            Placement<span className="text-indigo-400">Planner AI</span>
          </motion.h1>
          
          <motion.p 
            initial={{ y: -10, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.2, duration: 0.5 }}
            className="text-xs text-[#a1a1aa] font-sans max-w-xs mx-auto"
          >
            Sign in securely with your Google Account to manage and track your placement trajectory.
          </motion.p>
        </div>

        {/* Form Card */}
        <motion.div 
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.3, duration: 0.5 }}
          className="bg-[#18181b]/80 border border-[#27272a] rounded-2xl p-6 shadow-2xl space-y-6 backdrop-blur-md"
        >
          <div className="space-y-4">
            <div className="text-center space-y-1.5">
              <h2 className="text-xs font-semibold text-white uppercase tracking-wider font-sans">
                Secure Authentication
              </h2>
              <p className="text-xxs text-[#71717a] font-sans">
                We use official Google Sign-In to keep your student profile safe.
              </p>
            </div>

            {errorMessage && (
              <motion.div 
                initial={{ opacity: 0, y: -5 }}
                animate={{ opacity: 1, y: 0 }}
                className="bg-red-500/10 border border-red-500/20 text-red-400 rounded-xl p-3.5 text-xs font-sans text-center leading-relaxed"
              >
                {errorMessage}
              </motion.div>
            )}

            {/* Google Sign In Button */}
            <button
              type="button"
              onClick={handleGoogleSignIn}
              disabled={isLoading || !firebaseReady}
              className="w-full flex items-center justify-center gap-3 py-3 px-4 bg-white hover:bg-neutral-100 text-neutral-900 text-xs font-bold font-sans rounded-xl transition-all duration-200 shadow-lg cursor-pointer disabled:cursor-not-allowed disabled:opacity-50 hover:-translate-y-0.5 active:translate-y-0"
            >
              {isLoading ? (
                <Loader2 size={16} className="animate-spin text-neutral-900" />
              ) : (
                <svg className="w-4 h-4" viewBox="0 0 24 24">
                  <path
                    fill="#4285F4"
                    d="M23.745 12.27c0-.7-.06-1.4-.19-2.07H12v3.92h6.61c-.29 1.5-.14 3.03-.6 4.31l3.11 2.41c1.82-1.68 2.85-4.16 2.85-6.57z"
                  />
                  <path
                    fill="#34A853"
                    d="M12 24c3.24 0 5.97-1.08 7.96-2.93l-3.11-2.41c-.86.58-1.97.92-3.23.92-2.48 0-4.58-1.68-5.33-3.94l-3.22 2.49C4.65 21.09 8.04 24 12 24z"
                  />
                  <path
                    fill="#FBBC05"
                    d="M6.67 15.64c-.19-.58-.3-1.2-.3-1.84s.11-1.26.3-1.84L3.45 9.47C2.65 11.08 2.2 12.89 2.2 14.8s.45 3.72 1.25 5.33l3.22-2.49z"
                  />
                  <path
                    fill="#EA4335"
                    d="M12 4.75c1.77 0 3.35.61 4.6 1.8l3.45-3.45C17.96 1.08 15.24 0 12 0 8.04 0 4.65 2.91 3.45 6.52l3.22 2.49c.75-2.26 2.85-3.94 5.33-3.94z"
                  />
                </svg>
              )}
              <span>{isLoading ? "Signing in..." : "Continue with Google"}</span>
            </button>
          </div>

          <div className="pt-2 text-center">
            <span className="inline-flex items-center gap-1 text-[10px] text-[#71717a] font-sans">
              <Sparkles size={10} className="text-indigo-400" />
              Instant profile setup on first login
            </span>
          </div>
        </motion.div>

        {/* Footer info */}
        <p className="text-center text-xxs text-[#71717a] font-sans">
          Protected by Google Firebase Authentication.
        </p>
      </div>
    </div>
  );
}
