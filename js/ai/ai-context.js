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

  /* ── Projects (with full media URLs) ───────────────────── */
  projects: [
    {
      id: 1,
      title: "ScanZy Rewards MVP / Product",
      shortTitle: "ScanZy",
      techStack: ["MongoDB", "Supabase", "n8n", "Lovable", "Bolt", "Vercel", "Leonardo AI"],
      description: "A QR-based gamified loyalty platform designed for offline retailers. Built to drive genuine customer retention and repeat business through interactive gamification, moving far beyond basic paper coupons.",
      isFeatured: true,
      videoUrl: "https://res.cloudinary.com/doyiqcna9/video/upload/v1783673286/Ai_Daily_Coach_automation_qzojiw.mp4",
      videoUrlmvp: "https://res.cloudinary.com/doyiqcna9/video/upload/v1783673286/Ai_Daily_Coach_automation_qzojiw.mp4",
      productDemoUrl: "https://res.cloudinary.com/doyiqcna9/video/upload/v1783677832/Untitled_design_exdmtc.mp4",
      projectCertImgUrl: "https://res.cloudinary.com/doyiqcna9/image/upload/v1783666876/mvp_certification_k5sedb.png",
      highlights: [
        "QR-based gamified loyalty system for offline retail",
        "Moved from paper coupons to real-time digital QR mechanics",
        "Full-stack MVP: MongoDB + Supabase + n8n automation",
        "Shipped end-to-end in a compressed timeline"
      ]
    },
    {
      id: 2,
      title: "AI Agent Ecosystem",
      shortTitle: "AI Agents",
      techStack: ["Cursor IDE", "Pipedream", "MCP Servers", "LLMs"],
      description: "Built prompt-driven AI workflows integrating LLMs with external data using Cursor IDE, Pipedream, and Model Context Protocol (MCP) servers.",
      isFeatured: false,
      videoUrl: "https://res.cloudinary.com/doyiqcna9/video/upload/v1783673286/Ai_Daily_Coach_automation_qzojiw.mp4",
      projectCertImgUrl: "https://res.cloudinary.com/doyiqcna9/image/upload/v1783667795/AI_Agent_Development_fnkuyw.png",
      highlights: [
        "Prompt-driven LLM workflows with external data integrations",
        "Custom MCP (Model Context Protocol) server design",
        "Pipedream automation pipelines",
        "Real-world agentic AI use cases"
      ]
    },
    {
      id: 3,
      title: "Infrastructure Corruption Detector (Trinity X)",
      shortTitle: "Trinity X",
      techStack: ["Advanced AI Models", "Automation Engine", "Database Integration"],
      description: "An autonomous AI validation engine that prevents infrastructure fraud through real-time 'Before & After' image analysis and instant status updates. Built for the Innovators Hackathon 2026.",
      isFeatured: false,
      videoUrl: "https://res.cloudinary.com/doyiqcna9/video/upload/v1783772817/Infrastruture_Demo_Video_rvobvw.mp4",
      highlights: [
        "Live binary validation system built in 48 hours",
        "Before & After AI image comparison for fraud detection",
        "National Level Qualifier — Innovators Hackathon 2026 (NMIET & AIC T-Hub)",
        "Real-time infrastructure project status tracking"
      ]
    },
    {
      id: 4,
      title: "Business Automation Engine",
      shortTitle: "Automation Engine",
      techStack: ["Make.com", "OpenAI API"],
      description: "Architected autonomous, multi-step business workflows linking external data and running entirely without human intervention using Make.com and OpenAI APIs.",
      isFeatured: false,
      screenshotUrl: "https://res.cloudinary.com/doyiqcna9/image/upload/v1783673671/make_lpslhr.jpg",
      projectCertImgUrl: "https://res.cloudinary.com/doyiqcna9/image/upload/v1783667816/Make.com_certificate_bwrfyn.png",
      highlights: [
        "Fully autonomous multi-step workflow with no human intervention",
        "Make.com + OpenAI API integration",
        "External data source linking and transformation",
        "Business process automation at scale"
      ]
    },
    {
      id: 5,
      title: "Smart Hackathon Finder Bot",
      shortTitle: "Hackathon Bot",
      techStack: ["Automation Anywhere A360", "DOMXPath"],
      description: "An intelligent RPA bot utilizing Automation Anywhere A360 with dynamic DOMXPath scraping to extract and compile real-time hackathon data from Google's AI Overview.",
      isFeatured: false,
      videoUrl: "https://res.cloudinary.com/doyiqcna9/video/upload/v1783668274/Automation_Anywhere_Project_-_Hackathon_Finder_1_ez6s0w.mp4",
      projectCertImgUrl: "https://res.cloudinary.com/doyiqcna9/image/upload/v1783667845/Automation_Anywhere_complete_jowcjy.png",
      highlights: [
        "RPA bot with dynamic DOMXPath scraping",
        "Real-time hackathon data extraction from Google AI Overview",
        "Automation Anywhere A360 platform",
        "Intelligent data compilation and filtering"
      ]
    },
    {
      id: 6,
      title: "Cosmolyze",
      shortTitle: "Cosmolyze",
      techStack: ["React", "Node.js", "Python", "Tailwind CSS", "Vercel"],
      description: "An advanced space data analysis and visualization engine designed to process complex astronomical datasets with sub-2s response latency and interactive real-time visual insights.",
      isFeatured: true,
      highlights: [
        "Sub-2s response latency on complex astronomical datasets",
        "Interactive real-time data visualization",
        "React + Node.js + Python full-stack architecture",
        "Deployed on Vercel with CDN optimization"
      ]
    }
  ],

  /* ── Certifications (with image URLs) ──────────────────── */
  certifications: [
    {
      id: 1,
      name: "Programming Foundations with Python",
      issuer: "NxtWave",
      CertImgUrl: "https://res.cloudinary.com/doyiqcna9/image/upload/v1783666765/Python_dtzvco.png"
    },
    {
      id: 2,
      name: "ScanZy Rewards MVP Architecture",
      issuer: "NxtWave",
      CertImgUrl: "https://res.cloudinary.com/doyiqcna9/image/upload/v1783666876/mvp_certification_k5sedb.png"
    },
    {
      id: 3,
      name: "Generative AI for All",
      issuer: "Microsoft × Physics Wallah",
      CertImgUrl: "https://res.cloudinary.com/doyiqcna9/image/upload/v1783666902/genrative_ai_shqice.png"
    },
    {
      id: 4,
      name: "Agentblazer Workshop",
      issuer: "Salesforce",
      CertImgUrl: "https://res.cloudinary.com/doyiqcna9/image/upload/v1783667496/Salesforce_nqv0z9.png"
    },
    {
      id: 5,
      name: "XPM 4.0 Fundamentals",
      issuer: "NxtWave",
      CertImgUrl: "https://res.cloudinary.com/doyiqcna9/image/upload/v1783667223/XPM_4.0_emxpxe.jpg"
    },
    {
      id: 6,
      name: "SQL & Relational Databases",
      issuer: "NxtWave",
      CertImgUrl: "https://res.cloudinary.com/doyiqcna9/image/upload/v1783667271/sql_nwfd8x.jpg"
    },
    {
      id: 7,
      name: "Advanced Frontend Development",
      issuer: "NxtWave",
      CertImgUrl: "https://res.cloudinary.com/doyiqcna9/image/upload/v1783667286/boostrap_flexbox_nimhpn.png"
    },
    {
      id: 8,
      name: "Frontend Foundations (HTML & CSS)",
      issuer: "NxtWave",
      CertImgUrl: "https://res.cloudinary.com/doyiqcna9/image/upload/v1783667306/html_css_amcncs.png"
    }
  ],

  /* ── Honors & Achievements (with image URLs) ────────────── */
  honors: [
    {
      id: 1,
      title: "National Level Qualifier",
      event: "Innovators Hackathon 2026 (NMIET & AIC T-Hub)",
      description: "Built 'Trinity X', a live AI binary validation system in 48 hours to eliminate infrastructure fraud.",
      CertImgUrl: "https://res.cloudinary.com/doyiqcna9/image/upload/v1783672981/innovator_hackthon_wrh0cm.jpg"
    },
    {
      id: 2,
      title: "State-Level Qualifier",
      event: "OpenAI × NxtWave Buildathon",
      description: "Developed 'Sparky', an AI Life Coach, pivoting through complex automation failures under immense time pressure using GPT-4o and n8n.",
      CertImgUrl: "https://res.cloudinary.com/doyiqcna9/image/upload/v1783672736/ZCWRN38D0K_kvrcoa.png"
    },
    {
      id: 3,
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
      pitch: "Rohan has demonstrated 0-to-1 product execution by building and launching the ScanZy Rewards MVP for offline retailers — designing the entire user journey, QR-gamification mechanics, and backend automation. He thinks in terms of user problems and data-driven iteration, transitioning the product from paper coupons to digital QR mechanics for real-time customer tracking. His ability to rapidly prototype full-stack MVPs combining seamless UI with automated backend systems makes him a strong APM candidate who can actually build what he plans.",
      highlights: [
        "0-to-1 Product Execution: Launched ScanZy Rewards MVP for offline retail gamification",
        "Data-Driven Iteration: Transitioned from paper coupons to digital QR mechanics",
        "Rapid Prototyping: End-to-end full-stack MVPs from concept to deployment",
        "User-Centric Design: Built for real-world customer retention outcomes"
      ]
    },
    SDE: {
      title: "Software Engineer / Full-Stack Developer",
      pitch: "Rohan brings proven full-stack competency across Python, SQL, MongoDB, Supabase, Node.js, and REST APIs — backed by a Global Rank 27 DSA performance and a 365-day unbroken coding streak. He has shipped real production systems: ScanZy (MongoDB + Supabase + n8n), AI agents (MCP + Pipedream + LLMs), and RPA bots (Automation Anywhere A360). His 35% database sync latency reduction and sub-2s CV model inference times show he optimizes for performance, not just functionality.",
      highlights: [
        "Global Rank 27 in DSA CodeVerse Bi-Weekly Contest #25",
        "Full-Stack: Python, SQL, MongoDB, Supabase, Node.js, REST APIs",
        "365-Day Unbroken Coding Streak on NxtWave Academy",
        "Performance-focused: 35% DB latency reduction, <2s CV inference"
      ]
    },
    AIArchitect: {
      title: "AI & Solutions Systems Architect",
      pitch: "Rohan architected production AI systems with real business impact: a live fraud detection engine (Trinity X) built in 48 hours at a national hackathon, an autonomous AI Daily Coach using GPT-4o + n8n (State-Level Buildathon qualifier), and a complete AI Agent Ecosystem using custom MCP servers and Pipedream. He achieves sub-2s inference on computer vision models and has designed agentic workflows that run without human intervention. His approach prioritizes low-latency, fault-tolerant, autonomous system design.",
      highlights: [
        "Low-Latency AI Engineering: Sub-2s inference on computer vision models",
        "Agentic Automation: Custom MCP servers, Pipedream, n8n workflows",
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
    aiTools: ["Cursor IDE", "Pipedream", "MCP Servers", "n8n", "Make.com", "Automation Anywhere A360", "OpenAI API", "Gemini API", "GPT-4o", "LLMs"],
    platforms: ["Vercel", "Cloudinary", "Lovable", "Bolt", "GitHub"],
    concepts: ["Full-Stack Development", "AI Agent Design", "REST APIs", "RPA", "Computer Vision", "Cloud Architecture", "Agentic Workflows"]
  }

};
