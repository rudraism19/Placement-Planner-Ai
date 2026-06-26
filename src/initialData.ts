import {
  StudentProfile,
  SkillProgress,
  RoadmapTask,
  ProjectItem,
  InterviewSession,
  CodingStats,
  CompanyPrepPlan,
  DashboardOverview
} from './types';

export const defaultProfile: StudentProfile = {
  name: "Rudra Sen",
  email: "rudraism19@gmail.com",
  branch: "Computer Science & Engineering",
  graduationYear: 2027,
  cgpa: 8.7,
  targetRole: "Software Development Engineer (SDE)",
  targetCompanies: ["Google", "Amazon", "Microsoft", "TCS"],
  skills: ["C++", "Java", "Python", "React", "Node.js", "SQL", "DSA"],
  resumeText: "OBJECTIVE\nMotivated Computer Science student with a CGPA of 8.7 seeking SDE Internships.\n\nEDUCATION\nB.Tech in Computer Science & Engineering - Graduation: 2027\n\nPROJECTS\n1. E-Commerce Platform: Built with React, Node.js, Express, MongoDB. Features authentication, Stripe gateway, and cart management.\n2. Pathfinding Visualizer: Built with vanilla JS. Visualizes Dijkstra's and A* search algorithms dynamically.\n\nSKILLS\nLanguages: C++, Java, JavaScript, Python\nDeveloper Tools: Git, VS Code, Postman\nFrameworks: React, Node.js, TailwindCSS\nComputer Science: Data Structures & Algorithms, DBMS, OS",
  gitHubUrl: "https://github.com/rudrasen",
  linkedInUrl: "https://linkedin.com/in/rudrasen",
  leetCodeUser: "rudra_leetcode",
  hackerRankUser: "rudra_hr",
  codeforcesUser: "rudra_cf",
  codeChefUser: "rudra_cc",
  interests: ["Web Development", "Data Structures & Algorithms", "System Design"],
  languages: ["C++", "Python", "JavaScript"]
};

export const defaultSkills: SkillProgress[] = [
  // Technical
  {
    name: "Data Structures & Algorithms (DSA)",
    category: "Technical",
    currentLevel: 7,
    targetLevel: 9,
    lastPracticeDate: "2026-06-25",
    progressPercentage: 75,
    aiFeedback: "Strong in Arrays, Trees, and Dynamic Programming. Need to focus on Graph algorithms and segment trees."
  },
  {
    name: "React & Frontend Development",
    category: "Technical",
    currentLevel: 8,
    targetLevel: 9,
    lastPracticeDate: "2026-06-24",
    progressPercentage: 85,
    aiFeedback: "Excellent understanding of state management, custom hooks, and Vite. Needs work on server-side rendering and performance optimization."
  },
  {
    name: "Node.js & Backend Systems",
    category: "Technical",
    currentLevel: 6,
    targetLevel: 8,
    lastPracticeDate: "2026-06-22",
    progressPercentage: 65,
    aiFeedback: "Good grasp of Express routing and REST APIs. Try implementing robust middleware, error handlers, and scaling databases."
  },
  {
    name: "Database Management (SQL)",
    category: "Technical",
    currentLevel: 7,
    targetLevel: 8,
    lastPracticeDate: "2026-06-20",
    progressPercentage: 80,
    aiFeedback: "Fluent in joins, subqueries, and aggregations. Should practice writing query optimizations and complex indexes."
  },
  {
    name: "System Design",
    category: "Technical",
    currentLevel: 4,
    targetLevel: 7,
    lastPracticeDate: "2026-06-18",
    progressPercentage: 45,
    aiFeedback: "Understand basic client-server model and vertical vs horizontal scaling. Need to study microservices, load balancers, and caching strategies."
  },

  // Core CS Subjects
  {
    name: "Database Management Systems (DBMS)",
    category: "Core CS",
    currentLevel: 8,
    targetLevel: 9,
    lastPracticeDate: "2026-06-15",
    progressPercentage: 88,
    aiFeedback: "Great at normalization (1NF, 2NF, 3NF, BCNF) and ACID properties. Review transaction schedules and locking protocols."
  },
  {
    name: "Operating Systems (OS)",
    category: "Core CS",
    currentLevel: 6,
    targetLevel: 8,
    lastPracticeDate: "2026-06-12",
    progressPercentage: 70,
    aiFeedback: "Understands process sync, semaphores, and virtual memory. Study paging, segmentation, and CPU scheduling algorithms more deeply."
  },
  {
    name: "Computer Networks (CN)",
    category: "Core CS",
    currentLevel: 5,
    targetLevel: 8,
    lastPracticeDate: "2026-06-10",
    progressPercentage: 55,
    aiFeedback: "Familiar with TCP/IP model layers and DNS. Needs a review of congestion control algorithms, routing protocols, and HTTP/HTTPS headers."
  },

  // Soft Skills
  {
    name: "Technical Communication",
    category: "Soft Skills",
    currentLevel: 7,
    targetLevel: 9,
    lastPracticeDate: "2026-06-24",
    progressPercentage: 75,
    aiFeedback: "Clear and structured explanations when discussing system designs. Work on explaining complex algorithm steps using dry-run diagrams."
  },
  {
    name: "Mock Interview Performance",
    category: "Soft Skills",
    currentLevel: 6,
    targetLevel: 8,
    lastPracticeDate: "2026-06-23",
    progressPercentage: 70,
    aiFeedback: "Good confidence and technical clarity. Sometimes skips edge cases; remember to verify constraints with the interviewer before writing code."
  },
  {
    name: "Aptitude & Logical Reasoning",
    category: "Soft Skills",
    currentLevel: 8,
    targetLevel: 9,
    lastPracticeDate: "2026-06-21",
    progressPercentage: 85,
    aiFeedback: "Very fast in quantitative and probability modules. Practice speed-run tests for competitive multi-national placement rounds."
  }
];

export const defaultRoadmap: RoadmapTask[] = [
  // Phase 1
  {
    id: "r1",
    phase: "Phase 1: Foundation",
    title: "Master Array & String Manipulations",
    description: "Practice two-pointer, sliding window, and hashing techniques. Solve 15 high-frequency placement questions.",
    resource: "LeetCode Top Interview 150 - Arrays section",
    duration: "4 days",
    isCompleted: true,
    category: "Data Structures",
    timeframe: "Weekly",
    priority: "High",
    isRevision: false,
    type: "Study",
    associatedSkill: "Data Structures & Algorithms (DSA)"
  },
  {
    id: "r2",
    phase: "Phase 1: Foundation",
    title: "SQL Joins and Aggregations",
    description: "Understand left/right/inner joins, GROUP BY, and HAVING. Solve SQL 50 study challenges.",
    resource: "LeetCode SQL 50 Study Plan",
    duration: "2 days",
    isCompleted: true,
    category: "Database",
    timeframe: "Daily",
    priority: "High",
    isRevision: false,
    type: "Study",
    associatedSkill: "Database Management (SQL)"
  },

  // Phase 2
  {
    id: "r3",
    phase: "Phase 2: Core Mastery",
    title: "Operating Systems CPU Scheduling",
    description: "Revise FCFS, SJF, Round Robin, and Priority Scheduling. Solve analytical problems on gantt charts and turnaround times.",
    resource: "GeeksforGeeks OS Lectures & Gate Smasher Series",
    duration: "3 days",
    isCompleted: false,
    category: "Operating Systems",
    timeframe: "Daily",
    priority: "Medium",
    isRevision: false,
    type: "Study",
    associatedSkill: "Operating Systems (OS)"
  },
  {
    id: "r4",
    phase: "Phase 2: Core Mastery",
    title: "Dynamic Programming Foundations",
    description: "Understand recursion to memoization, and tabulation. Learn 0/1 Knapsack, LCS, and Longest Increasing Subsequence.",
    resource: "Striver's DP Series - YouTube",
    duration: "6 days",
    isCompleted: false,
    category: "Algorithms",
    timeframe: "Weekly",
    priority: "High",
    isRevision: false,
    type: "Study",
    associatedSkill: "Data Structures & Algorithms (DSA)"
  },

  // Phase 3
  {
    id: "r5",
    phase: "Phase 3: Company Prep",
    title: "Mock Interview - Amazon Specific",
    description: "Simulate a live Coding + Leadership Principles interview. Focus on customer obsession and ownership principles.",
    resource: "Placement Planner AI Mock Panel",
    duration: "1 day",
    isCompleted: false,
    category: "Interviews",
    timeframe: "Daily",
    priority: "High",
    isRevision: true,
    type: "Revision",
    associatedSkill: "Mock Interview Performance"
  },
  {
    id: "r6",
    phase: "Phase 3: Company Prep",
    title: "System Design: TinyURL System Architecture",
    description: "Practice high-level and low-level system designs for a URL shortener with rate-limiting, database sharding, and caching.",
    resource: "ByteByteGo YouTube channel",
    duration: "3 days",
    isCompleted: false,
    category: "System Design",
    timeframe: "Weekly",
    priority: "High",
    isRevision: false,
    type: "Project",
    associatedSkill: "System Design"
  },

  // Phase 4
  {
    id: "r7",
    phase: "Phase 4: Final Polish",
    title: "Resume Keyword Optimization",
    description: "Run resume analyzer against target roles and embed key terms such as Distributed Systems, REST APIs, and Big-O Analysis.",
    resource: "Resume Analyzer Tab",
    duration: "1 day",
    isCompleted: false,
    category: "Resume",
    timeframe: "Daily",
    priority: "Low",
    isRevision: false,
    type: "Study",
    associatedSkill: "Technical Communication"
  }
];

export const defaultProjects: ProjectItem[] = [
  {
    id: "p1",
    title: "Interactive Pathfinding Visualizer",
    techStack: ["React", "HTML5 Canvas", "Tailwind CSS", "Algorithms"],
    description: "A graphical application visualizing Dijkstra's, A*, and Breadth-First search algorithms on custom grids with real-time walls and speed control. Generates maze obstacles dynamically.",
    gitHubUrl: "https://github.com/rudrasen/pathfinder-visualizer",
    liveDemoUrl: "https://rudrasen-pathfinder.vercel.app",
    completionStatus: "Completed",
    aiReview: "Excellent visual impact for an SDE portfolio. The project demonstrates an excellent grasp of algorithm theory, state management, and grid animations. To improve resume impact: measure rendering latency and mention memory optimization steps taken when handling custom speed increments (e.g., using requestAnimationFrame instead of setInterval)."
  },
  {
    id: "p2",
    title: "Distributed Chat Room Service",
    techStack: ["Node.js", "Express", "WebSockets", "Redis", "Docker"],
    description: "A highly-scalable chat server supporting multiple chatrooms, user presence detection, message buffering, and persistence in Redis. Horizontally scaled using Docker.",
    gitHubUrl: "https://github.com/rudrasen/scaled-chat-service",
    liveDemoUrl: "",
    completionStatus: "In Progress",
    aiReview: "High technical weight. The technology stack is very attractive to premium companies (Amazon, Uber, Microsoft). Complete the horizontal scaling tests and document the maximum throughput (e.g. 'Successfully benchmarked 5000 concurrent socket connections with Redis Pub/Sub backplane'). This will turn it into a top-tier project!"
  }
];

export const defaultInterviews: InterviewSession[] = [
  {
    id: "i1",
    date: "2026-06-23",
    type: "Technical",
    role: "SDE Intern",
    company: "Amazon",
    score: 74,
    questions: [
      {
        id: "q1",
        question: "Describe how you would find the lowest common ancestor of two nodes in a binary tree.",
        userAnswer: "I would use recursion. If root is null, return null. If root matches either node, return root. Recursively search left and right. If both search calls return non-null, the root is the LCA. Else, return whichever was non-null.",
        aiFeedback: "Perfect algorithm choice and reasoning. The time complexity is O(N) where N is the number of nodes, and space complexity is O(H) for call stack. You explained it clearly.",
        score: 9
      },
      {
        id: "q2",
        question: "Explain what index sharding is in database systems and when you should use it.",
        userAnswer: "Sharding is splitting data into different database tables or databases to share load. You use it when your database is too large and slowing down. I am not completely sure how indices specifically shard.",
        aiFeedback: "Correct concept of database sharding. However, your answer missed how index sharding operates (e.g., global indexes vs local sharded indexes). You should mention how query routing is affected and the tradeoff between latency and update overhead.",
        score: 5
      }
    ],
    generalFeedback: "Overall solid performance! Great response to the DSA problem, but database systems and core CS theory could be brushed up. Remember to explicitly state your assumptions and state the time and space complexity at the very beginning."
  }
];

export const defaultCodingStats: CodingStats = {
  easySolved: 84,
  mediumSolved: 142,
  hardSolved: 28,
  streak: 18,
  contestRating: 1654,
  topicsPerformance: [
    { topic: "Arrays & Strings", percentage: 88 },
    { topic: "Dynamic Programming", percentage: 55 },
    { topic: "Trees & Graphs", percentage: 70 },
    { topic: "Recursion & Backtracking", percentage: 78 },
    { topic: "SQL Querying", percentage: 82 }
  ],
  languagesUsed: [
    { language: "C++", percentage: 65 },
    { language: "Java", percentage: 20 },
    { language: "JavaScript", percentage: 15 }
  ]
};

export const defaultDashboardOverview: DashboardOverview = {
  placementReadinessScore: 71,
  studyStreak: 18,
  completedTasksCount: 2,
  totalTasksCount: 7,
  xpPoints: 2450,
  level: 12,
  weeklyProgress: [
    { day: "Mon", studyHours: 3.5, solvedCount: 3 },
    { day: "Tue", studyHours: 4.0, solvedCount: 4 },
    { day: "Wed", studyHours: 5.2, solvedCount: 6 },
    { day: "Thu", studyHours: 2.8, solvedCount: 2 },
    { day: "Fri", studyHours: 4.5, solvedCount: 5 },
    { day: "Sat", studyHours: 6.0, solvedCount: 8 },
    { day: "Sun", studyHours: 4.2, solvedCount: 4 }
  ]
};

export const defaultCompanyPlans: CompanyPrepPlan[] = [
  {
    company: "Google",
    readinessScore: 58,
    requiredTechnicalSkills: ["Advanced DSA", "Graph Algorithms", "System Design", "C++ / Java", "Concurrency"],
    interviewPattern: [
      "Online Assessment (2 coding challenges in 90 mins)",
      "Technical Phone Screen (1 round - DSA & Complexity analysis)",
      "Onsite Loops (3-4 Coding rounds + 1 'Googleyness' behavioral round)"
    ],
    frequentlyAskedQuestions: [
      "Find the length of the longest subarray with at most K distinct values.",
      "Given a binary tree, return its path sum in maximum branch nodes.",
      "Design an autocomplete service or a shared document editor backend.",
      "Explain the differences between processes, threads, and how context switching impacts CPU registers."
    ],
    resumeSuggestions: "Focus on deep algorithmic optimization. Specify the exact time/space complexities of systems you built. Highlight open source contributions and highly-rated competitive programming profiles.",
    importantTopics: ["Graph Traversals (DFS/BFS)", "Segment Trees", "Shortest Paths (Dijkstra/Bellman-Ford)", "Recursion & Backtracking", "Memory management & Garbage collection"]
  },
  {
    company: "Amazon",
    readinessScore: 74,
    requiredTechnicalSkills: ["Data Structures & Algorithms", "System Design", "OOP Principles", "Java / C++", "AWS Core Concepts"],
    interviewPattern: [
      "Online Assessment (Debugging questions + Coding task + Work Simulation)",
      "Technical Interview (2 rounds - DSA, Object Oriented Design, System Design)",
      "Bar Raiser Interview (Focus on core technical competency and deep dive into Amazon Leadership Principles)"
    ],
    frequentlyAskedQuestions: [
      "Design an LRU Cache with O(1) set and get times.",
      "Find the boundary traversal of a binary tree.",
      "Implement a product recommendation database schema using SQL and graph database.",
      "Describe a time when you had to make a quick decision under a deadline without full information (Leadership Principle: Bias for Action)."
    ],
    resumeSuggestions: "Write about measurable achievements (e.g., 'reduced API response times by 35%'). Map project descriptions to leadership skills. Detail backend performance benchmarks and robust system designs.",
    importantTopics: ["Trees & Graphs", "Dynamic Programming", "Object Oriented Analysis and Design", "Scalability (Load balancing, Caching)", "Amazon Leadership Principles"]
  },
  {
    company: "TCS",
    readinessScore: 92,
    requiredTechnicalSkills: ["Java / Python / C", "Logical Reasoning & Aptitude", "Basic DSA", "SQL Foundations", "Software Engineering Concepts"],
    interviewPattern: [
      "National Qualifier Test (NQT) - Aptitude, Reasoning, Verbal, and Basic Coding",
      "Technical Round - basic programming, OOPs, database queries, and final semester projects",
      "Managerial & HR Interview - project walkthroughs, location preferences, and standard HR questions"
    ],
    frequentlyAskedQuestions: [
      "Write a program to reverse a string without using built-in methods.",
      "What is the difference between Method Overloading and Method Overriding?",
      "Write a SQL query to find the second highest salary from an Employee table.",
      "What are ACID properties in database systems?"
    ],
    resumeSuggestions: "Emphasize core academic performance (CGPA above 8.0 is a plus). List completed certifications and solid foundational group projects. Highlight teamwork experience and soft-skill activities.",
    importantTopics: ["Foundational OOP", "Common Data Structures (Arrays, Strings, Stacks)", "Basic SQL queries (CRUD, Joins)", "Software Development Life Cycle (SDLC) models"]
  }
];
