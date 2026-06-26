# Placement Planner AI — Next-Generation Career Co-Pilot

Placement Planner AI is a comprehensive, gamified full-stack platform designed to help students and developers supercharge their placement preparation. By combining real-time artificial intelligence with structured progress tracking, users can analyze resumes, simulate interactive mock interviews, construct personalized data structures & algorithms (DSA) roadmaps, and chat with a 24/7 AI Career Mentor.

---

## 🚀 Key Features & Capabilities

- **Interactive Parallax Landing Page**: A visually compelling intro displaying dynamic 3D tilt previews, staggered entrance effects, and scroll-bound background transformations built with modern motion behaviors.
- **Official Google Sign-In**: Streamlined, secure authentication managed directly through Firebase Auth, ensuring isolated, persistent profiles with immediate setup.
- **Intelligent Resume Analyzer**: Instant ATS scoring, complete gap analysis, and tailored recommendations matching targeted high-tier roles.
- **Personalized Preparation Roadmaps**: Generates step-by-step checkpoints, essential levels, resource recommendations, and active skill targets for targeted technical fields.
- **Interactive Mock Interviews**: Simulate real-time behavioral and technical whiteboard rounds with an adaptive AI interviewer that evaluates response relevance and technical accuracy.
- **24/7 AI Career Mentor**: Direct access to an intelligent assistant optimized to answer complex questions, debug code fragments, and outline interview strategy.

---

## 🛠️ The Tech Stack

Placement Planner AI is engineered using high-performance, industry-standard modern frameworks:

- **Frontend Core**: [React 18](https://react.dev/) & [Vite](https://vite.dev/) with full [TypeScript](https://www.typescriptlang.org/) support for type safety.
- **Styling**: [Tailwind CSS](https://tailwindcss.com/) for fluid, responsive utility layouts.
- **Animations & Parallax**: [Motion](https://motion.dev/) (Framer Motion) utilizing high-frequency scroll trackers (`useScroll`, `useTransform`) for 3D page elevation.
- **Icons**: [Lucide React](https://lucide.dev/) for a consistent, minimal, high-contrast visual footprint.
- **Database & Persistence**: [Google Cloud Firestore](https://firebase.google.com/docs/firestore) managing permanent real-time data syncs.
- **Authentication**: [Firebase Auth](https://firebase.google.com/docs/auth) hosting authenticated client profiles via secure Google Sign-In credentials.
- **Artificial Intelligence**: Server-side proxy handling stateful telemetry via the modern `@google/genai` TypeScript SDK.

---

## 🔄 Platform Workflow

```
┌─────────────────────────┐
│  Parallax Landing Page  │
└────────────┬────────────┘
             ▼
┌─────────────────────────┐
│  Google Secure Sign-In  │◄────── Auth / User Session Persistence (Firebase)
└────────────┬────────────┘
             ▼
┌─────────────────────────┐
│   Profile Setup Board   ├─────── Choose Track, Tech Stack & Level
└────────────┬────────────┘
             ▼
┌────────────┴──────────────────────────────────────────────────────┐
│                      Central Student Dashboard                    │
└──────┬───────────────────┬───────────────────┬────────────────────┘
       ▼                   ▼                   ▼                    ▼
┌──────────────┐   ┌───────────────┐   ┌──────────────┐   ┌─────────────────┐
│  Resume ATS  │   │ Personalized  │   │ AI Technical │   │  24/7 AI Career │
│   Analyzer   │   │ DSA Roadmap   │   │  Mock Agent  │   │     Mentorship  │
└──────────────┘   └───────────────┘   └──────────────┘   └─────────────────┘
```

1. **Onboarding**: Users arrive at the immersive parallax landing page showcasing a live-preview dashboard mockup.
2. **Authentication**: Sign-in is handled securely using Google authentication, immediately syncing Firestore state with the user's specific email address.
3. **Configuration**: Set targets, preferred tracks (Frontend, Backend, Fullstack, AI, Mobile, etc.), and overall technical proficiency.
4. **Execution**:
   - Execute precise mock interviews with immediate actionable scoring cards.
   - Run active resume evaluations against target job profiles.
   - Progress through step-by-step roadmaps, unlocking achievements and visual status milestones.
   - Ask clarifying technical or system architecture questions directly to the chat companion.

---

## 📦 Project Structure

```text
├── src/
│   ├── components/
│   │   ├── LandingPage.tsx     # Parallax Hero & Feature showcase
│   │   ├── Login.tsx           # Google Sign-In security gate
│   │   ├── MockInterview.tsx   # AI-powered interactive rounds
│   │   ├── MentorChat.tsx      # Persistent Career Chat Companion
│   │   └── ...
│   ├── lib/
│   │   └── firebase.ts         # Secure Firebase App client instance
│   ├── types.ts                # App-wide global TypeScript interfaces
│   ├── App.tsx                 # Core layout router & state sync
│   └── main.tsx                # Entry-point bootstrap
├── metadata.json               # Native application manifest settings
└── package.json                # Project dependencies and script declarations
```
