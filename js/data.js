const portfolioData = {
  personalInfo: {
    name: "Rohan Nimje",

    tagline: "ARCHITECTING AUTONOMOUS AI WORKFLOWS & HIGH-IMPACT MVPs.",

    summary:
      "AI Systems Architect & Technical Product Lead specializing in Agentic AI, n8n automation pipelines, LLM orchestration, and rapid 0-to-1 product deployment.",

    profileImages: [
      "/public/profile.png"
    ]
  },

  // Executive Guidelines for Portfolio AI Chatbot / Agent
  aiAgentInstructions: {
    primaryIdentity: "AI Systems Architect, AI Automation Lead, and Technical Product Manager (TPM)",
    coreValueProposition: "Rohan bridges core computer science logic with modern AI execution. He leverages Python, DSA, n8n, Supabase, Cursor IDE, and LLM APIs to architect end-to-end autonomous AI pipelines and 0-to-1 MVPs at 10x velocity.",
    preferredRoles: [
      "AI Solutions Architect",
      "AI Automation Engineer",
      "Associate Product Manager (APM)",
      "Technical Product Manager (TPM)",
      "Systems Integrator"
    ],
    behavioralRules: [
      "Position Rohan primarily as an AI Systems Architect, Automation Lead, and Product Builder.",
      "If asked about Python, SQL, or DSA (Rank 27), highlight them as his rock-solid algorithmic problem-solving foundation that empowers him to design robust, bug-free AI systems and workflow logic.",
      "Highlight cost-efficiency in LLM API usage, workflow security, error handling, and business impact.",
      "Adapt the tone dynamically based on whether the recruiter is looking for a TPM, AI Architect, or Automation Lead."
    ]
  },

  // Role-Targeted Capabilities for AI Chatbot Pitching
  roleCapabilities: {
    solutionsArchitect: {
      title: "AI Solutions & Systems Architect",
      highlights: [
        "Agentic Workflow Orchestration: Architected zero-touch multi-step automation engines using n8n, Make.com, and LLM APIs (GPT-4o, Gemini).",
        "Model Context Protocol (MCP): Custom setup of MCP servers connecting LLMs with external tools, APIs, and databases via Cursor IDE.",
        "Low-Latency Infrastructure: Designed sub-2s computer vision and image validation pipelines with built-in fallback triggers."
      ]
    },
    technicalProductManager: {
      title: "Technical Product Manager / APM",
      highlights: [
        "0-to-1 Rapid Execution: Concept-to-live-deployment in under 14 days leveraging AI-assisted tools and component libraries.",
        "Retention & Gamification: Built ScanZy Rewards to eliminate offline retail customer churn via automated dynamic QR cards.",
        "System Security & Logic: Focuses on robust API rate limiting, prompt optimization, and seamless user onboarding journeys."
      ]
    },
    softwareEngineeringFoundations: {
      title: "Core Algorithmic & Systems Engineering Foundations",
      highlights: [
        "Core Algorithmic Competency: Global Rank 27 in DSA CodeVerse Bi-Weekly Contest #25 using Python Data Structures & Algorithms.",
        "Full-Stack & Database Mastery: Certified expertise in Python, SQL, Relational Databases, React, Supabase, Node.js, and REST APIs.",
        "365-Day Consistency: Unbroken daily execution and lab practice streak on NxtWave Academy."
      ]
    }
  },

  metrics: [
    { label: "Execution Streak", value: "365 Days", description: "Unbroken daily system execution and AI labs on NxtWave Academy" },
    { label: "DSA Global Rank", value: "Rank 27", description: "CodeVerse Bi-Weekly Contest #25 (Algorithmic Logic)" },
    { label: "CV Model Latency", value: "< 2s", description: "Sub-2-second Computer Vision & LLM inference time" },
    { label: "Build Velocity", value: "< 2 Weeks", description: "0-to-1 production MVP shipping speed" }
  ],

  projects: [
    {
      id: 1,
      title: "ScanZy Rewards — Gamified QR Loyalty & Retail Retention Platform",
      techStack: ["Lovable.dev", "React", "Supabase", "Cursor IDE", "n8n", "Leonardo AI"],
      description: "A full-stack QR-based gamified loyalty platform designed to eliminate offline retail customer churn. Converts one-time shoppers into repeat buyers via physical QR cards given at checkout that unlock store-specific Spin & Win rewards when scanned at home.",
      laptopVideoUrl: "https://res.cloudinary.com/doyiqcna9/video/upload/v1783673286/Ai_Daily_Coach_automation_qzojiw.mp4",
      mobileVideoUrl: "https://res.cloudinary.com/doyiqcna9/video/upload/v1783677832/Untitled_design_exdmtc.mp4",
      projectCertImgUrl: "https://res.cloudinary.com/doyiqcna9/image/upload/v1783666876/mvp_certification_k5sedb.png",
      isFeatured: true
    },
    {
      id: 2,
      title: "Cosmolyze — AI-Powered Skincare Analyzer",
      techStack: ["React", "Python", "Computer Vision AI", "Tailwind CSS", "Vercel"],
      description: "An AI-powered 'Pocket Dermatologist' built to help users make informed skincare choices by cutting through misleading marketing. Scans skin condition in real time to recommend exact active ingredients (Niacinamide, Salicylic Acid) based on barrier needs. Shortlisted as National Finalist for NxtWave's Idea2Impact Hackathon in Hyderabad.",
      productDemoUrl: "https://res.cloudinary.com/doyiqcna9/video/upload/v1783677832/Untitled_design_exdmtc.mp4",
      projectCertImgUrl: "https://res.cloudinary.com/doyiqcna9/image/upload/v1786384987/Ideaimpact_Certificate_orka1w.jpg",
      isFeatured: false
    },
    {
      id: 3,
      title: "Infrastructure Corruption Detector (Trinity X)",
      techStack: ["Vision AI", "n8n Workflows", "Supabase", "Appsmith"],
      description: "An autonomous AI validation engine built to eliminate corruption in municipal infrastructure projects. Analyzes contractor Before & After photos automatically to detect fake repairs and visual anomalies. National Finalist at Innovators Hackathon 2026 (NMIET Pune & AIC T-Hub).",
      videoUrl: "https://res.cloudinary.com/doyiqcna9/video/upload/v1783772817/Infrastruture_Demo_Video_rvobvw.mp4"
    },
    {
      id: 4,
      title: "Sparky — Automated AI Life Coach & Student Productivity System",
      techStack: ["OpenAI API (GPT-4o)", "n8n Workflows", "Google Sheets", "Notion API"],
      description: "An autonomous daily productivity coach that processes student habit goals via automated n8n trigger pipelines and dispatches tailored daily action steps and motivational guidance. Won State-Level Qualifier at OpenAI x NxtWave Buildathon.",
      videoUrl: "https://res.cloudinary.com/doyiqcna9/video/upload/v1783673286/Ai_Daily_Coach_automation_qzojiw.mp4",
      projectCertImgUrl: "https://res.cloudinary.com/doyiqcna9/image/upload/v1783667795/AI_Agent_Development_fnkuyw.png"
    },
    {
      id: 5,
      title: "Autonomous Business & Workflow Automation System",
      techStack: ["Make.com", "OpenAI API", "Google Sheets API", "LinkedIn API", "Telegram Bot API"],
      description: "Architected a zero-touch multi-step business workflow pipeline linking cloud databases, OpenAI text summarization & routing models, and automated multi-channel notification engines without manual intervention.",
      screenshoturl: "https://res.cloudinary.com/doyiqcna9/image/upload/v1783673671/make_lpslhr.jpg",
      projectCertImgUrl: "https://res.cloudinary.com/doyiqcna9/image/upload/v1783667816/Make.com_certificate_bwrfyn.png"
    },
    {
      id: 6,
      title: "Smart Hackathon Finder Bot",
      techStack: ["Automation Anywhere A360", "DOMXPath", "RPA"],
      description: "An intelligent RPA bot utilizing Automation Anywhere A360 with dynamic DOMXPath scraping to extract and compile real-time hackathon data from Google's AI Overview.",
      videoUrl: "https://res.cloudinary.com/doyiqcna9/video/upload/v1783668274/Automation_Anywhere_Project_-_Hackathon_Finder_1_ez6s0w.mp4",
      projectCertImgUrl: "https://res.cloudinary.com/doyiqcna9/image/upload/v1783667845/Automation_Anywhere_complete_jowcjy.png"
    }
  ],

  experience: [
    {
      id: 1,
      role: "AI & Systems Engineering Scholar",
      company: "NxtWave Academy",
      duration: "Sep 2024 - Present",
      location: "Maharashtra, India - Remote",
      description: "Undergoing intensive software and systems engineering training through NxtWave's CCBP 4.0 program. Focusing on autonomous AI agent architecture, full-stack design, automation pipelines, and modern developer workflows."
    }
  ],

  certifications: [
    { id: 1, name: "Model Context Protocol (MCP) & Agentic AI Tooling", issuer: "NxtWave", CertImgUrl: "https://res.cloudinary.com/doyiqcna9/image/upload/v1783667795/AI_Agent_Development_fnkuyw.png" },
    { id: 2, name: "Programming Foundations with Python", issuer: "NxtWave", CertImgUrl: "https://res.cloudinary.com/doyiqcna9/image/upload/v1783666765/Python_dtzvco.png" },
    { id: 3, name: "ScanZy Rewards MVP Architecture", issuer: "NxtWave", CertImgUrl: "https://res.cloudinary.com/doyiqcna9/image/upload/v1783666876/mvp_certification_k5sedb.png" },
    { id: 4, name: "Generative AI for All", issuer: "Microsoft x PW", CertImgUrl: "https://res.cloudinary.com/doyiqcna9/image/upload/v1783666902/genrative_ai_shqice.png" },
    { id: 5, name: "Agentblazer Workshop", issuer: "AWS / Salesforce", CertImgUrl: "https://res.cloudinary.com/doyiqcna9/image/upload/v1783667496/Salesforce_nqv0z9.png" },
    { id: 6, name: "XPM 4.0 Fundamentals", issuer: "NxtWave", CertImgUrl: "https://res.cloudinary.com/doyiqcna9/image/upload/v1783667223/XPM_4.0_emxpxe.jpg" },
    { id: 7, name: "SQL & Relational Databases", issuer: "NxtWave", CertImgUrl: "https://res.cloudinary.com/doyiqcna9/image/upload/v1783667271/sql_nwfd8x.jpg" },
    { id: 8, name: "Advanced Frontend Development", issuer: "NxtWave", CertImgUrl: "https://res.cloudinary.com/doyiqcna9/image/upload/v1783667286/boostrap_flexbox_nimhpn.png" },
    { id: 9, name: "Frontend Foundations", issuer: "NxtWave", CertImgUrl: "https://res.cloudinary.com/doyiqcna9/image/upload/v1783667306/html_css_amcncs.png" }
  ],

  honors: [
    {
      id: 1,
      CertImgUrl: "https://res.cloudinary.com/doyiqcna9/image/upload/v1786384987/Ideaimpact_Certificate_orka1w.jpg",
      title: "National Finalist",
      event: "Idea2Impact Offline Hackathon (Hyderabad)",
      description: "Shortlisted among thousands of student builders across India based on Cosmolyze's product architecture, AI skin analysis model, and vision."
    },
    {
      id: 2,
      CertImgUrl: "https://res.cloudinary.com/doyiqcna9/image/upload/v1783672981/innovator_hackthon_wrh0cm.jpg",
      title: "National Level Qualifier",
      event: "Innovators Hackathon 2026 (NMIET & AIC T-Hub)",
      description: "Built 'Trinity X', a live AI binary validation system in 48 hours to eliminate public municipal infrastructure corruption."
    },
    {
      id: 3,
      CertImgUrl: "https://res.cloudinary.com/doyiqcna9/image/upload/v1783672736/ZCWRN38D0K_kvrcoa.png",
      title: "State-Level Qualifier",
      event: "OpenAI x NxtWave Buildathon",
      description: "Developed 'Sparky', an AI Life Coach, pivoting through complex automation failures under immense time pressure using GPT-4o and n8n."
    },
    {
      id: 4,
      CertImgUrl: "https://res.cloudinary.com/doyiqcna9/image/upload/v1783673057/DSA_wkno87.png",
      title: "Global Rank 27",
      event: "DSA CodeVerse Bi-Weekly Contest #25",
      description: "Proved core logical thinking and algorithmic problem-solving capabilities using Python Data Structures & Algorithms."
    }
  ],

  streak: {
    days: "365",
    title: "Days Systems Builder Execution Streak",
    description: "Unbroken daily execution on NxtWave Academy. Pure dedication to daily logical execution and systems consistency."
  },

  education: [
    {
      id: 1,
      institution: "Shri Shivaji Science College (SGBAU)",
      degree: "Bachelor of Computer Application (BCA)",
      specialization: "Artificial Intelligence & Machine Learning",
      duration: "Sep 2024 - Sep 2027",
      grade: "8.38 CGPA",
      description: "Mastering core computer science fundamentals, Data Structures, and AI/ML principles while actively applying them in national-level hackathons and full-stack development."
    }
  ],

  contact: {
    email: "rohannimje53@gmail.com",
    linkedin: "https://www.linkedin.com/in/rohannimje/",
    github: "https://github.com/RohanNimje"
  }
};

if (typeof window !== "undefined") {
  window.portfolioData = portfolioData;
}
if (typeof module !== "undefined" && module.exports) {
  module.exports = portfolioData;
}
