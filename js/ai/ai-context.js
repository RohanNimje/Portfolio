/**
 * AI_CONTEXT — Rohan Nimje's Personal AI Knowledge Bank
 * -------------------------------------------------------
 * This file is the PRIVATE knowledge base for the AI Assistant.
 * It is NOT directly rendered into the main webpage DOM.
 * All media URLs, metrics, pitch strategies and personal data live here.
 */

window.AI_CONTEXT = {

  /* ── Personal Identity ──────────────────────────────────── */
  personal: {
    name: "Rohan Nimje",
    firstName: "Rohan",
    tagline: "Vision into Reality — LOGIC :: CODE :: AUTOMATION :: IMPACT",
    summary: "Hey! I'm an AI Systems Architect & Full-Stack Engineer who loves turning complex tech ideas into fast, real-world solutions. Right now, I'm pursuing my BCA in AI & Machine Learning (holding an 8.38 CGPA) while sharpening my full-stack skills with NxtWave's CCBP 4.0 program. I thrive on building things that run fast and smooth—whether that's low-latency cloud systems, smart AI agents, or clean full-stack apps. I bring solid problem-solving skills to the table (Global Rank 27 in DSA CodeVerse) and a strong work ethic backed by a 365-day unbroken coding streak. Big on clean code, rapid execution, and building tech that actually makes an impact!",
    location: "Maharashtra, India",
    profileImages: [
      "https://res.cloudinary.com/doyiqcna9/image/upload/v1783672197/rohan_nimje_profile_zkmb5q.jpg",
      "https://res.cloudinary.com/doyiqcna9/image/upload/v1783672140/rohan_qfsija.jpg"
    ]
  },

  /* ── Contact ────────────────────────────────────────────── */
  contact: {
    email: "rohannimje53@gmail.com",
    linkedin: "https://www.linkedin.com/in/rohannimje/",
    github: "https://github.com/RohanNimje"
  },

  /* ── Key Metrics / DSA ──────────────────────────────────── */
  metrics: [
    {
      label: "Execution Streak",
      value: "365 Days",
      description: "Unbroken daily execution on NxtWave Academy — pure coding consistency for a full year."
    },
    {
      label: "DSA Global Rank",
      value: "Rank 27",
      description: "Global Rank 27 in CodeVerse Bi-Weekly Contest #25 — proven algorithmic problem-solving using Python DSA."
    },
    {
      label: "CV Model Latency",
      value: "< 2s",
      description: "Sub-2-second Computer Vision inference on real-world image classification and validation tasks."
    },
    {
      label: "Cloud Sync Optimization",
      value: "35%",
      description: "Achieved 35% database sync latency reduction through query optimization and caching strategies."
    }
  ],

  /* ── Projects (with full media URLs & updated schemas) ─── */
  projects: [
    {
      id: 1,
      title: "Cosmolyze — AI-Powered Skincare Analyzer",
      shortTitle: "Cosmolyze",
      techStack: ["React", "Python", "Computer Vision AI", "Tailwind CSS", "Vercel"],
      description: "An AI-powered 'Pocket Dermatologist' built to help users make informed skincare choices by cutting through misleading marketing. Scans skin condition in real time to recommend exact active ingredients (Niacinamide, Salicylic Acid) based on barrier needs. Shortlisted as National Finalist for NxtWave's Idea2Impact Hackathon in Hyderabad.",
      isFeatured: true,
      productDemoUrl: "https://res.cloudinary.com/doyiqcna9/video/upload/v1783677832/Untitled_design_exdmtc.mp4",
      highlights: [
        "AI skin condition analyzer acting as a digital dermatologist",
        "Recommends targeted active ingredients based on skin barrier needs",
        "National Finalist @ Idea2Impact Offline Hackathon in Hyderabad",
        "Sub-2s response latency with interactive real-time visual insights"
      ]
    },
    {
      id: 2,
      title: "ScanZy Rewards — Gamified QR Loyalty & Retail Retention Platform",
      shortTitle: "ScanZy Rewards",
      techStack: ["Lovable.dev", "React", "Supabase", "Cursor IDE", "n8n", "Leonardo AI"],
      description: "A full-stack QR-based gamified loyalty platform designed to eliminate offline retail customer churn. Converts one-time shoppers into repeat buyers via physical QR cards given at checkout that unlock store-specific Spin & Win rewards when scanned at home.",
      isFeatured: true,
      // videoUrl: "https://res.cloudinary.com/doyiqcna9/video/upload/v1783673286/Ai_Daily_Coach_automation_qzojiw.mp4",
      videoUrlmvp: "https://res.cloudinary.com/doyiqcna9/video/upload/v1783673286/Ai_Daily_Coach_automation_qzojiw.mp4",
      productDemoUrl: "https://res.cloudinary.com/doyiqcna9/video/upload/v1783677832/Untitled_design_exdmtc.mp4",
      projectCertImgUrl: "https://res.cloudinary.com/doyiqcna9/image/upload/v1783666876/mvp_certification_k5sedb.png",
      highlights: [
        "QR-based gamified loyalty system for offline retail customer retention",
        "Moved from paper coupons to real-time digital QR mechanics",
        "Full-stack architecture: React + Supabase + Cursor IDE + n8n automation",
        "Incentivizes repeat footfall over local neighborhood competitors"
      ]
    },
    {
      id: 3,
      title: "Infrastructure Corruption Detector (Trinity X)",
      shortTitle: "Trinity X",
      techStack: ["Vision AI", "n8n Workflows", "Supabase", "Appsmith"],
      description: "An autonomous AI validation engine built to eliminate corruption in municipal infrastructure projects. Analyzes contractor Before & After photos automatically to detect fake repairs and visual anomalies. National Finalist at Innovators Hackathon 2026 (NMIET Pune & AIC T-Hub).",
      isFeatured: false,
      videoUrl: "https://res.cloudinary.com/doyiqcna9/video/upload/v1783772817/Infrastruture_Demo_Video_rvobvw.mp4",
      highlights: [
        "Live binary validation system built in 48 hours",
        "Before & After AI image comparison for public infrastructure fraud detection",
        "National Level Qualifier — Innovators Hackathon 2026 (NMIET & AIC T-Hub)",
        "Real-time infrastructure project status tracking & anomaly scoring"
      ]
    },
    {
      id: 4,
      title: "Sparky — Automated AI Life Coach & Student Productivity System",
      shortTitle: "Sparky AI Coach",
      techStack: ["OpenAI API (GPT-4o)", "n8n Workflows", "Google Sheets", "Notion API"],
      description: "An autonomous daily productivity coach that processes student habit goals via automated n8n trigger pipelines and dispatches tailored daily action steps and motivational guidance. Won State-Level Qualifier at OpenAI x NxtWave Buildathon.",
      isFeatured: false,
      videoUrl: "https://res.cloudinary.com/doyiqcna9/video/upload/v1783673286/Ai_Daily_Coach_automation_qzojiw.mp4",
      projectCertImgUrl: "https://res.cloudinary.com/doyiqcna9/image/upload/v1783667795/AI_Agent_Development_fnkuyw.png",
      highlights: [
        "Automated daily productivity coach powered by GPT-4o and n8n",
        "State-Level Qualifier — OpenAI x NxtWave Buildathon",
        "Pivoted through complex automation failures under immense time pressure",
        "Dynamic habit tracking and automated messaging integrations"
      ]
    },
    {
      id: 5,
      title: "Autonomous Business & Workflow Automation System",
      shortTitle: "Automation Engine",
      techStack: ["Make.com", "OpenAI API", "Google Sheets API", "LinkedIn API", "Telegram Bot API"],
      description: "Architected a zero-touch multi-step business workflow pipeline linking cloud databases, OpenAI text summarization & routing models, and automated multi-channel notification engines without manual intervention.",
      isFeatured: false,
      screenshotUrl: "https://res.cloudinary.com/doyiqcna9/image/upload/v1783673671/make_lpslhr.jpg",
      projectCertImgUrl: "https://res.cloudinary.com/doyiqcna9/image/upload/v1783667816/Make.com_certificate_bwrfyn.png",
      highlights: [
        "Fully autonomous multi-step workflow with no human intervention",
        "Make.com + OpenAI API integration for intelligent text routing",
        "Google Sheets data ingestion & multi-channel broadcast (LinkedIn & Telegram)",
        "Production-ready business process automation architecture"
      ]
    },
    {
      id: 6,
      title: "Smart Hackathon Finder Bot",
      shortTitle: "Hackathon Bot",
      techStack: ["Automation Anywhere A360", "DOMXPath", "RPA"],
      description: "An intelligent RPA bot utilizing Automation Anywhere A360 with dynamic DOMXPath scraping to extract and compile real-time hackathon data from Google's AI Overview.",
      isFeatured: false,
      videoUrl: "https://res.cloudinary.com/doyiqcna9/video/upload/v1783668274/Automation_Anywhere_Project_-_Hackathon_Finder_1_ez6s0w.mp4",
      projectCertImgUrl: "https://res.cloudinary.com/doyiqcna9/image/upload/v1783667845/Automation_Anywhere_complete_jowcjy.png",
      highlights: [
        "RPA bot with dynamic DOMXPath scraping",
        "Real-time hackathon data extraction from Google AI Overview",
        "Automation Anywhere A360 platform execution",
        "Intelligent data compilation and automated filtering"
      ]
    }
  ],

  /* ── Certifications (with MCP added) ──────────────────── */
  certifications: [
    {
      id: 1,
      name: "Model Context Protocol (MCP) & Agentic AI Tooling",
      issuer: "NxtWave",
      CertImgUrl: "https://res.cloudinary.com/doyiqcna9/image/upload/v1783667795/AI_Agent_Development_fnkuyw.png"
    },
    {
      id: 2,
      name: "Programming Foundations with Python",
      issuer: "NxtWave",
      CertImgUrl: "https://res.cloudinary.com/doyiqcna9/image/upload/v1783666765/Python_dtzvco.png"
    },
    {
      id: 3,
      name: "ScanZy Rewards MVP Architecture",
      issuer: "NxtWave",
      CertImgUrl: "https://res.cloudinary.com/doyiqcna9/image/upload/v1783666876/mvp_certification_k5sedb.png"
    },
    {
      id: 4,
      name: "Generative AI for All",
      issuer: "Microsoft × Physics Wallah",
      CertImgUrl: "https://res.cloudinary.com/doyiqcna9/image/upload/v1783666902/genrative_ai_shqice.png"
    },
    {
      id: 5,
      name: "Agentblazer Workshop",
      issuer: "Salesforce",
      CertImgUrl: "https://res.cloudinary.com/doyiqcna9/image/upload/v1783667496/Salesforce_nqv0z9.png"
    },
    {
      id: 6,
      name: "XPM 4.0 Fundamentals",
      issuer: "NxtWave",
      CertImgUrl: "https://res.cloudinary.com/doyiqcna9/image/upload/v1783667223/XPM_4.0_emxpxe.jpg"
    },
    {
      id: 7,
      name: "SQL & Relational Databases",
      issuer: "NxtWave",
      CertImgUrl: "https://res.cloudinary.com/doyiqcna9/image/upload/v1783667271/sql_nwfd8x.jpg"
    },
    {
      id: 8,
      name: "Advanced Frontend Development",
      issuer: "NxtWave",
      CertImgUrl: "https://res.cloudinary.com/doyiqcna9/image/upload/v1783667286/boostrap_flexbox_nimhpn.png"
    },
    {
      id: 9,
      name: "Frontend Foundations (HTML & CSS)",
      issuer: "NxtWave",
      CertImgUrl: "https://res.cloudinary.com/doyiqcna9/image/upload/v1783667306/html_css_amcncs.png"
    }
  ],

  /* ── Honors & Achievements (with Cosmolyze / IdeaImpact added) ── */
  honors: [
    {
      id: 1,
      title: "National Finalist",
      event: "Idea2Impact Offline Hackathon (Hyderabad)",
      description: "Shortlisted among thousands of student builders across India based on Cosmolyze's product architecture, AI skin analysis model, and vision.",
      CertImgUrl: "https://res.cloudinary.com/doyiqcna9/image/upload/v1786384987/Ideaimpact_Certificate_orka1w.jpg"
    },
    {
      id: 2,
      title: "National Level Qualifier",
      event: "Innovators Hackathon 2026 (NMIET & AIC T-Hub)",
      description: "Built 'Trinity X', a live AI binary validation system in 48 hours to eliminate public municipal infrastructure corruption.",
      CertImgUrl: "https://res.cloudinary.com/doyiqcna9/image/upload/v1783672981/innovator_hackthon_wrh0cm.jpg"
    },
    {
      id: 3,
      title: "State-Level Qualifier",
      event: "OpenAI × NxtWave Buildathon",
      description: "Developed 'Sparky', an AI Life Coach, pivoting through complex automation failures under immense time pressure using GPT-4o and n8n.",
      CertImgUrl: "https://res.cloudinary.com/doyiqcna9/image/upload/v1783672736/ZCWRN38D0K_kvrcoa.png"
    },
    {
      id: 4,
      title: "Global Rank 27",
      event: "DSA CodeVerse Bi-Weekly Contest #25",
      description: "Proved core logical thinking and algorithmic problem-solving capabilities using Python Data Structures & Algorithms.",
      CertImgUrl: "https://res.cloudinary.com/doyiqcna9/image/upload/v1783673057/DSA_wkno87.png"
    }
  ],

  /* ── Experience ─────────────────────────────────────────── */
  experience: [
    {
      id: 1,
      role: "Full-Stack Developer Trainee",
      company: "NxtWave",
      duration: "Sep 2024 – Present",
      location: "Maharashtra, India (Remote)",
      description: "Undergoing intensive software engineering training through NxtWave's CCBP 4.0 program. Focusing on full-stack architecture, AI agents, automation, and modern developer workflows."
    }
  ],

  /* ── Education ──────────────────────────────────────────── */
  education: [
    {
      id: 1,
      institution: "Shri Shivaji Science College (SGBAU)",
      degree: "Bachelor of Computer Application (BCA)",
      specialization: "Artificial Intelligence & Machine Learning",
      duration: "Sep 2024 – Sep 2027",
      grade: "8.38 CGPA",
      description: "Mastering core computer science fundamentals, Data Structures, and AI/ML principles while actively applying them in national-level hackathons and full-stack development."
    }
  ],

  /* ── Streak ─────────────────────────────────────────────── */
  streak: {
    days: 365,
    title: "365 Day NxtWave Academy Streak",
    description: "Unbroken daily execution on NxtWave. Pure dedication to daily logical execution and coding consistency."
  },

  /* ── Role-Specific Pitching Strategies ──────────────────── */
  rolePitches: {
    APM: {
      title: "Associate Product Manager / Product Engineer",
      pitch: "Rohan has demonstrated 0-to-1 product execution by building and launching the ScanZy Rewards platform for offline retailers — designing the entire user journey, QR-gamification mechanics, and backend automation. He thinks in terms of user problems and data-driven iteration, transitioning the product from paper coupons to digital QR mechanics for real-time customer tracking. His ability to rapidly prototype full-stack MVPs combining seamless UI with automated backend systems makes him a strong APM candidate who can actually build what he plans.",
      highlights: [
        "0-to-1 Product Execution: Launched ScanZy Rewards for offline retail gamification",
        "Data-Driven Iteration: Transitioned from paper coupons to digital QR mechanics",
        "Rapid Prototyping: End-to-end full-stack MVPs from concept to deployment",
        "User-Centric Design: Built for real-world customer retention outcomes"
      ]
    },
    SDE: {
      title: "Software Engineer / Full-Stack Developer",
      pitch: "Rohan brings proven full-stack competency across Python, React, SQL, MongoDB, Supabase, Node.js, and REST APIs — backed by a Global Rank 27 DSA performance and a 365-day unbroken coding streak. He has shipped real production systems: ScanZy (React + Supabase + n8n), Cosmolyze (React + Python AI), AI agents (MCP + Cursor IDE), and RPA bots (Automation Anywhere A360). His 35% database sync latency reduction and sub-2s CV model inference times show he optimizes for performance, not just functionality.",
      highlights: [
        "Global Rank 27 in DSA CodeVerse Bi-Weekly Contest #25",
        "Full-Stack: React, Python, SQL, MongoDB, Supabase, Node.js, REST APIs",
        "365-Day Unbroken Coding Streak on NxtWave Academy",
        "Performance-focused: 35% DB latency reduction, <2s CV inference"
      ]
    },
    AIArchitect: {
      title: "AI & Solutions Systems Architect",
      pitch: "Rohan architected production AI systems with real business impact: Cosmolyze (AI skin condition analyzer), a live fraud detection engine (Trinity X) built in 48 hours at a national hackathon, an autonomous AI Daily Coach using GPT-4o + n8n (State-Level Buildathon qualifier), and a complete AI Agent Ecosystem using custom MCP servers. He achieves sub-2s inference on computer vision models and has designed agentic workflows that run without human intervention. His approach prioritizes low-latency, fault-tolerant, autonomous system design.",
      highlights: [
        "Low-Latency AI Engineering: Sub-2s inference on computer vision models",
        "Agentic Automation: Custom MCP servers, Make.com, n8n workflows",
        "Fraud Prevention: 'Trinity X' live binary validation (national hackathon)",
        "Autonomous Workflows: Multi-step AI pipelines with zero human intervention"
      ]
    }
  },

  /* ── Skills Summary ─────────────────────────────────────── */
  skills: {
    languages: ["Python", "JavaScript", "SQL", "HTML", "CSS"],
    frameworks: ["React", "Node.js", "Tailwind CSS", "Express"],
    databases: ["MongoDB", "Supabase", "PostgreSQL"],
    aiTools: ["Cursor IDE", "MCP Servers", "n8n", "Make.com", "Automation Anywhere A360", "OpenAI API", "Gemini API", "GPT-4o", "LLMs"],
    platforms: ["Vercel", "Cloudinary", "Lovable", "Bolt", "GitHub"],
    concepts: ["Full-Stack Development", "AI Agent Design", "REST APIs", "RPA", "Computer Vision", "Cloud Architecture", "Agentic Workflows", "Business Logic Design"]
  }

};
