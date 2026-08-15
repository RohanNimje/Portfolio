/**
 * AI_CONTEXT — Rohan Nimje's Master AI Knowledge Base & Executive Brain
 * ---------------------------------------------------------------------
 * Private knowledge engine for the Portfolio AI Chatbot / Agent.
 * Clean, plain-text structure without markdown symbols.
 */

window.AI_CONTEXT = {

  /* ── 1. CORE IDENTITY & SYSTEM PROMPT INSTRUCTIONS ──────────────────── */
  agentPersona: {
    name: "Rohan's AI Assistant",
    targetCandidate: "Rohan Nimje",
    primaryRole: "AI Systems Architect & Automation Specialist",
    secondaryRoles: ["Agentic AI Engineer", "AI Product Builder", "Systems Integrator"],

    responseGuidelines: [
      "CRITICAL: Never output long, dense paragraphs. Always keep answers scannable and direct.",
      "CRITICAL: Do not use markdown asterisk symbols (like **) in responses. Write clean, natural plain text.",
      "Direct Answer First: Start with a crisp 1-2 sentence executive verdict, then list clear points.",
      "Technical Credibility: Position Rohan's code-first pipeline expertise (RAG, Python, Supabase, n8n, MCP, REST APIs) as real enterprise engineering.",
      "Foundations Matter: If asked about Python, SQL, JavaScript, HTML/CSS, or Global Rank 27 DSA, explain that this is his algorithmic foundation for building robust systems.",
      "Authenticity & Honesty: Never claim unrealistic latency numbers. Highlight real wins: Domain-Specific RAG, Zero-Hallucination Prompting, Database Triggers, and 35% Cloud Sync Latency Reduction.",
      "Call-to-Action: Offer direct project demos, GitHub links, or connection via LinkedIn and Email."
    ]
  },

  /* ── 2. PERSONAL IDENTITY ───────────────────────────────────────────── */
  personal: {
    fullName: "Rohan Nimje",
    preferredName: "Rohan",
    tagline: "ARCHITECTING AUTONOMOUS AI WORKFLOWS & HIGH-IMPACT 0-TO-1 MVPs",
    location: "Maharashtra, India (Open to Global Remote / Relocation)",
    summary: "AI Systems Architect and Systems Builder specializing in zero-touch process automation, code-first agentic AI pipelines (n8n, MCP, LLM APIs), and scalable cloud architectures (Supabase/PostgreSQL). Proven track record of shipping production MVPs in under 2 weeks with national hackathon recognitions.",
    profileImages: [
      "https://res.cloudinary.com/doyiqcna9/image/upload/v1783672140/rohan_qfsija.jpg"
    ]
  },

  /* ── 3. CONTACT & PLATFORMS ─────────────────────────────────────────── */
  contact: {
    email: "rohannimje53@gmail.com",
    linkedin: "https://www.linkedin.com/in/rohannimje/",
    github: "https://github.com/RohanNimje",
    portfolioUrl: "https://rohannimje.vercel.app"
  },

  /* ── 4. KEY ENGINEERING METRICS (HERO PILLS) ─────────────────────────── */
  metrics: [
    {
      metric: "365+ Days",
      label: "BUILDER STREAK",
      detail: "Unbroken daily systems engineering, practical lab execution, and algorithmic problem-solving."
    },
    {
      metric: "< 2 Weeks",
      label: "0-TO-1 SHIPPING",
      detail: "Concept-to-production deployment speed leveraging Cursor IDE, component libraries, and AI-accelerated dev."
    },
    {
      metric: "National",
      label: "HACKATHON FINALIST",
      detail: "Top national standing at NxtWave Idea2Impact (Hyderabad) and Innovators Hackathon 2026 (NMIET & AIC T-Hub)."
    },
    {
      metric: "35%",
      label: "LATENCY REDUCED",
      detail: "Cross-platform cloud database synchronization latency reduction via Supabase & query optimization."
    }
  ],

  /* ── 5. DETAILED PROJECTS & ARCHITECTURE ────────────────────────────── */
  projects: [
    {
      id: 1,
      name: "ScanZy Rewards",
      fullTitle: "ScanZy Rewards — Gamified QR Loyalty & Retail Retention Platform",
      category: "Full-Stack 0-to-1 MVP & Workflow Automation",
      techStack: ["React", "Supabase (PostgreSQL)", "n8n", "Cursor IDE", "Lovable", "Vercel", "REST APIs"],
      isFeatured: true,
      videoUrlMvp: "https://res.cloudinary.com/doyiqcna9/video/upload/f_auto,q_auto:good,vc_auto/v1786780323/scanzy_mvp_record_ygaiin.mp4",
      productDemoUrl: "https://res.cloudinary.com/doyiqcna9/video/upload/f_auto,q_auto:good,vc_auto/v1783677832/Untitled_design_exdmtc.mp4",
      projectCertImgUrl: "https://res.cloudinary.com/doyiqcna9/image/upload/v1783666876/mvp_certification_k5sedb.png",
      problem: "Offline retail stores suffer from one-time shopper churn and lack digital retention tools.",
      architectureHighlights: [
        "Multi-Tier Cloud DB: Designed Supabase & MongoDB schemas, cutting cross-platform sync latency by 35% and securing transactional integrity.",
        "Autonomous Workflows: Automated 100% of merchant background operations and loyalty distribution using n8n and REST Webhooks.",
        "High-Velocity Deployment: Architected and shipped production-ready micro-frontend from scratch in under 14 days."
      ]
    },
    {
      id: 2,
      name: "Cosmolyze",
      fullTitle: "Cosmolyze — AI Skin Analysis & Active Ingredient Recommender",
      category: "Code-First RAG & Computer Vision Pipeline",
      techStack: ["Python", "Computer Vision AI", "Code-First RAG", "React", "Tailwind CSS", "Vercel"],
      isFeatured: false,
      productDemoUrl: "https://res.cloudinary.com/doyiqcna9/video/upload/f_auto,q_auto:good,vc_auto/v1786779857/cosmolyze_record_jnkdx4.mkv",
      projectCertImgUrl: "https://res.cloudinary.com/doyiqcna9/image/upload/v1786384987/Ideaimpact_Certificate_orka1w.jpg",
      problem: "Consumers face choice paralysis and deceptive marketing when selecting active skincare chemicals.",
      architectureHighlights: [
        "Code-First RAG Pipeline: Developed a Python-based Retrieval-Augmented Generation pipeline mapping user skin conditions directly to an indexed active-ingredient knowledge base (Niacinamide, Salicylic Acid).",
        "Zero-Hallucination Logic: Implemented strict system prompts and context injection guardrails to prevent AI hallucination and provide accurate recommendations.",
        "National Recognition: Shortlisted as National Finalist at NxtWave Idea2Impact Hackathon (Hyderabad) among 1,000+ national teams."
      ]
    },
    {
      id: 3,
      name: "Trinity X",
      fullTitle: "Trinity X — Autonomous Infrastructure Corruption Detector",
      category: "GovTech / Multi-Modal AI Inspection Engine",
      techStack: ["OpenAI Vision API", "Python", "Supabase", "n8n Workflows", "Appsmith"],
      isFeatured: false,
      videoUrl: "https://res.cloudinary.com/doyiqcna9/video/upload/f_auto,q_auto:good,vc_auto/v1783772817/Infrastruture_Demo_Video_rvobvw.mp4",
      projectCertImgUrl: "https://res.cloudinary.com/doyiqcna9/image/upload/v1783672981/innovator_hackthon_wrh0cm.jpg",
      problem: "Public municipal infrastructure projects face massive fund leaks through fake contractor repair claims.",
      architectureHighlights: [
        "Multi-Modal Verification: Engineered an autonomous AI verification pipeline comparing Before & After contractor photos against municipal guidelines.",
        "Database Triggers & Scoring: Built automated anomaly detection logic and database triggers in Supabase to flag fraudulent repairs without human bias.",
        "48-Hour Sprint: Built in a live 48-hour hackathon; National Qualifier at Innovators Hackathon 2026 (NMIET & AIC T-Hub)."
      ]
    },
    {
      id: 4,
      name: "Sparky",
      fullTitle: "Sparky — Autonomous AI Life Coach & Productivity Agent",
      category: "Agentic AI & Dynamic Contextual Workflows",
      techStack: ["GPT-4o", "n8n Pipelines", "Notion API", "Supabase", "Google Sheets API"],
      isFeatured: false,
      videoUrl: "https://res.cloudinary.com/doyiqcna9/video/upload/f_auto,q_auto:good,vc_auto/v1783673286/Ai_Daily_Coach_automation_qzojiw.mp4",
      projectCertImgUrl: "https://res.cloudinary.com/doyiqcna9/image/upload/v1783667795/AI_Agent_Development_fnkuyw.png",
      problem: "Students struggle with daily goal consistency and lack contextual, dynamic accountability.",
      architectureHighlights: [
        "Dynamic Contextual RAG: Ingests daily habits from Notion/Supabase, injects context into GPT-4o, and dispatches personalized action steps daily.",
        "Zero-Touch Automation: Multi-step n8n webhook pipelines with automated error handling and fallback logic.",
        "Hackathon Winner: State-Level Qualifier at OpenAI x NxtWave Buildathon."
      ]
    },
    {
      id: 5,
      name: "Smart Hackathon Finder Bot",
      fullTitle: "Smart Hackathon Finder Bot (Intelligent RPA)",
      category: "Enterprise RPA & Web Scraping",
      techStack: ["Automation Anywhere A360", "DOMXPath", "RPA Algorithms"],
      isFeatured: false,
      videoUrl: "https://res.cloudinary.com/doyiqcna9/video/upload/f_auto,q_auto:good,vc_auto/v1783668274/Automation_Anywhere_Project_-_Hackathon_Finder_1_ez6s0w.mp4",
      projectCertImgUrl: "https://res.cloudinary.com/doyiqcna9/image/upload/v1783667845/Automation_Anywhere_complete_jowcjy.png",
      problem: "Developers waste 30+ minutes daily manually tracking hackathon registrations across platforms.",
      architectureHighlights: [
        "DOMXPath Scraping: Automated live data extraction from Google AI Overviews using Automation Anywhere A360.",
        "Efficiency Gain: Cut manual search and data compilation latency from 30 minutes to under 60 seconds."
      ]
    },
    {
      id: 6,
      name: "Autonomous Business Workflow Engine",
      fullTitle: "Autonomous Multi-Channel Business Workflow System",
      category: "Process Automation & API Orchestration",
      techStack: ["Make.com", "OpenAI API", "Telegram Bot API", "Google Sheets API", "LinkedIn API"],
      isFeatured: false,
      screenshotUrl: "https://res.cloudinary.com/doyiqcna9/image/upload/v1783673671/make_lpslhr.jpg",
      projectCertImgUrl: "https://res.cloudinary.com/doyiqcna9/image/upload/v1783667816/Make.com_certificate_bwrfyn.png",
      problem: "Manual customer onboarding and multi-channel business broadcasting create operational bottlenecks.",
      architectureHighlights: [
        "Zero-Touch Pipeline: Multi-step automation linking Google Sheets data ingestion with OpenAI text intelligence and automated broadcast engines."
      ]
    }
  ],

  /* ── 6. TECHNICAL SKILLS & DOMAIN MASTERY ────────────────────────────── */
  skills: {
    aiAndAgentic: [
      "Agentic AI Architectures",
      "Model Context Protocol (MCP)",
      "RAG Pipelines (Retrieval-Augmented Generation)",
      "n8n Workflow Automation",
      "LLM API Orchestration (GPT-4o, Gemini, Claude)",
      "Prompt Engineering & Context Caching",
      "Automation Anywhere (RPA)",
      "Cursor IDE (AI-Accelerated Engineering)"
    ],
    architectureAndDatabases: [
      "Supabase (PostgreSQL)",
      "MongoDB",
      "REST API Design & Webhooks",
      "Database Triggers & Security Rules",
      "Cloud Data Synchronization",
      "Vercel Deployment",
      "Micro-frontends Architecture"
    ],
    languagesAndFoundations: [
      "Python (Data Structures & Backend Logic)",
      "JavaScript (JS)",
      "SQL & Relational Schema Design",
      "React",
      "Node.js",
      "HTML5 / CSS3 (Advanced Flexbox, Responsive UI)"
    ],
    coreCompetencies: [
      "AI Systems Architecture",
      "0-to-1 Rapid MVP Building",
      "Zero-Touch Process Automation",
      "Algorithmic Logic & Optimization",
      "Token & API Cost Engineering"
    ]
  },

  /* ── 7. EDUCATION & INSTITUTIONAL CREDENTIALS ───────────────────────── */
  education: [
    {
      institution: "Shri Shivaji Science College (SGBAU)",
      degree: "Bachelor of Computer Application (BCA)",
      specialization: "Artificial Intelligence & Machine Learning",
      duration: "Sep 2024 – Sep 2027",
      grade: "8.38 CGPA",
      focus: "Computer Science Foundations, Discrete Logic, Data Structures, Machine Learning Algorithms."
    },
    {
      institution: "NxtWave Academy",
      degree: "CCBP 4.0 Intensive Academy Program",
      specialization: "Software Systems Architecture & Autonomous AI Engineering",
      duration: "Sep 2024 – Present",
      focus: "Full-stack system architecture, engineering autonomous AI workflows (n8n, MCP), and RAG pipelines through intensive execution labs."
    }
  ],

  /* ── 8. HONORS, AWARDS & HACKATHONS ─────────────────────────────────── */
  honors: [
    {
      title: "National Finalist",
      event: "Idea2Impact Offline Hackathon (Hyderabad)",
      standing: "Top 0.5% Nationally (Out of 1,000+ teams)",
      detail: "Recognized for Cosmolyze's domain-specific RAG architecture and computer vision skincare analysis.",
      CertImgUrl: "https://res.cloudinary.com/doyiqcna9/image/upload/v1786384987/Ideaimpact_Certificate_orka1w.jpg"
    },
    {
      title: "National Level Qualifier",
      event: "Innovators Hackathon 2026 (NMIET Pune & AIC T-Hub)",
      standing: "Top Hackathon Finalist",
      detail: "Engineered 'Trinity X' in a 48-hour live sprint to detect public infrastructure fraud using AI vision.",
      CertImgUrl: "https://res.cloudinary.com/doyiqcna9/image/upload/v1783672981/innovator_hackthon_wrh0cm.jpg"
    },
    {
      title: "State-Level Qualifier & Winner",
      event: "OpenAI x NxtWave Buildathon",
      standing: "State Top Entry",
      detail: "Developed 'Sparky' using GPT-4o and n8n workflows under extreme time constraints.",
      CertImgUrl: "https://res.cloudinary.com/doyiqcna9/image/upload/v1783672736/ZCWRN38D0K_kvrcoa.png"
    },
    {
      title: "Global Rank 27",
      event: "DSA CodeVerse Bi-Weekly Contest #25",
      standing: "Top 27 Globally",
      detail: "Proven algorithmic mastery and speed problem-solving using Python Data Structures & Algorithms.",
      CertImgUrl: "https://res.cloudinary.com/doyiqcna9/image/upload/v1783673057/DSA_wkno87.png"
    }
  ],

  /* ── 9. CERTIFICATIONS REGISTRY ──────────────────────────────────────── */
  certifications: [
    { name: "Model Context Protocol (MCP) & Agentic AI Tooling", issuer: "NxtWave", CertImgUrl: "https://res.cloudinary.com/doyiqcna9/image/upload/v1783667795/AI_Agent_Development_fnkuyw.png" },
    { name: "Programming Foundations with Python", issuer: "NxtWave", CertImgUrl: "https://res.cloudinary.com/doyiqcna9/image/upload/v1783666765/Python_dtzvco.png" },
    { name: "ScanZy Rewards MVP Architecture", issuer: "NxtWave", CertImgUrl: "https://res.cloudinary.com/doyiqcna9/image/upload/v1783666876/mvp_certification_k5sedb.png" },
    { name: "Generative AI for All", issuer: "Microsoft x PhysicsWallah", CertImgUrl: "https://res.cloudinary.com/doyiqcna9/image/upload/v1783666902/genrative_ai_shqice.png" },
    { name: "Agentblazer Workshop — Autonomous Agent Infrastructure", issuer: "Salesforce / AWS", CertImgUrl: "https://res.cloudinary.com/doyiqcna9/image/upload/v1783667496/Salesforce_nqv0z9.png" },
    { name: "XPM 4.0 Fundamentals", issuer: "NxtWave", CertImgUrl: "https://res.cloudinary.com/doyiqcna9/image/upload/v1783667223/XPM_4.0_emxpxe.jpg" },
    { name: "SQL & Relational Databases", issuer: "NxtWave", CertImgUrl: "https://res.cloudinary.com/doyiqcna9/image/upload/v1783667271/sql_nwfd8x.jpg" },
    { name: "Advanced Frontend (Flexbox & Bootstrap)", issuer: "NxtWave", CertImgUrl: "https://res.cloudinary.com/doyiqcna9/image/upload/v1783667286/boostrap_flexbox_nimhpn.png" },
    { name: "Frontend Foundations (HTML & CSS)", issuer: "NxtWave", CertImgUrl: "https://res.cloudinary.com/doyiqcna9/image/upload/v1783667306/html_css_amcncs.png" }
  ],

  /* ── 10. ROLE-SPECIFIC PITCH PLAYBOOK (AI CHATBOT ENGINE) ───────────── */
  pitchPlaybook: {
    aiSystemsArchitect: {
      roleTarget: "AI Solutions Architect / AI Automation Engineer / Systems Integrator",
      corePitch: "Rohan bridges core algorithmic computer science with autonomous AI architecture. He does not just call APIs; he engineers resilient, zero-touch business pipelines using Python, Supabase, n8n, MCP servers, and Domain-Specific RAG.",
      keyStrengths: [
        "Agentic AI & MCP: Configures custom Model Context Protocol servers to link LLMs with private DBs and external APIs.",
        "Code-First RAG: Built knowledge base retrieval systems in Cosmolyze and Sparky to eliminate LLM hallucinations.",
        "Proven Performance: 35% database sync optimization and 100% automated background data workflows in ScanZy Rewards."
      ]
    },
    aiProductEngineer: {
      roleTarget: "0-to-1 AI Product Engineer / Full-Stack Builder",
      corePitch: "Rohan operates as a high-velocity Product Engineer who ships full-stack, AI-integrated MVPs in under 14 days from concept to deployment.",
      keyStrengths: [
        "Full-Stack Foundations: High fluency in Python, JavaScript, React, SQL, Supabase, and responsive web design.",
        "Real MVPs Shipped: ScanZy Rewards (Gamified QR Loyalty), Cosmolyze (AI Skincare), and Trinity X (GovTech AI).",
        "Problem-Solver Mindset: Global Rank 27 in DSA CodeVerse with an unbroken 365+ day builder execution streak."
      ]
    }
  }

};

if (typeof window !== "undefined") {
  window.AI_CONTEXT = window.AI_CONTEXT;
}
if (typeof module !== "undefined" && module.exports) {
  module.exports = window.AI_CONTEXT;
}