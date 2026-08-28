import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import OnboardingSetup from './OnboardingSetup';
import TelemetryHUD from './TelemetryHUD';
import ComplianceVerificationModal from './ComplianceVerificationModal';
import DeepInspectorModal from './DeepInspectorModal';
import SpreadsheetExportModal from './SpreadsheetExportModal';
import { 
  McpConnector, 
  CandidateProfile, 
  WishlistApplicant, 
  ScrapedJob, 
  RoleMode 
} from '../types';
import { 
  initialMcpConnectors, 
  initialCandidateProfiles, 
  initialWishlistApplicants, 
  scrapedJobsList, 
  RECRUITER_MASTER_PROMPT,
  COMPLIANCE_DISCLAIMER
} from '../data';
import { 
  Shield, 
  ShieldCheck, 
  Users, 
  Key, 
  Globe, 
  FileText, 
  Mail, 
  CheckCircle, 
  XCircle, 
  Plus, 
  UserPlus, 
  Sparkles, 
  Search, 
  Eye, 
  ExternalLink, 
  FileCheck, 
  Send, 
  ExternalLink as LinkIcon, 
  Terminal, 
  Zap, 
  Briefcase, 
  Settings, 
  Layers,
  ArrowRight,
  RefreshCw,
  Scale,
  FileSpreadsheet,
  FileSearch,
  Download,
  Award,
  Check,
  Copy
} from 'lucide-react';

export default function CareerSuite() {
  // State Initialization
  const [showOnboarding, setShowOnboarding] = useState<boolean>(true);
  const [roleMode, setRoleMode] = useState<RoleMode>('admin');
  const [currentEmail, setCurrentEmail] = useState<string>('adv.akash2356@gmail.com');
  const [mcpConnectors, setMcpConnectors] = useState<McpConnector[]>(initialMcpConnectors);
  const [profiles, setProfiles] = useState<CandidateProfile[]>(initialCandidateProfiles);
  const [wishlist, setWishlist] = useState<WishlistApplicant[]>(initialWishlistApplicants);
  const [jobs, setJobs] = useState<ScrapedJob[]>(scrapedJobsList);

  // Compliance & Inspection Modals
  const [showComplianceModal, setShowComplianceModal] = useState<boolean>(false);
  const [showDeepInspectorModal, setShowDeepInspectorModal] = useState<boolean>(false);
  const [showSpreadsheetModal, setShowSpreadsheetModal] = useState<boolean>(false);
  const [disclaimerCopied, setDisclaimerCopied] = useState<boolean>(false);

  // Gamification & Quest Tracker States
  const [hasDeployedDocs, setHasDeployedDocs] = useState<boolean>(false);
  const [hasSentGmail, setHasSentGmail] = useState<boolean>(false);
  const [scrapedCount, setScrapedCount] = useState<number>(0);

  const handleOnboardingComplete = (email: string, targetUrl: string, keysApplied: boolean) => {
    setCurrentEmail(email);
    setScrapeUrl(targetUrl);
    
    // Automatically configure connectors if keys applied
    if (keysApplied) {
      setMcpConnectors(prev => prev.map(c => {
        if (c.id === 'mcp-gmail') return { ...c, apiKeyValue: 'gmail_sec_onboarding_token', status: 'active' as const };
        if (c.id === 'mcp-docs') return { ...c, apiKeyValue: 'drive_sec_onboarding_token', status: 'active' as const };
        return c;
      }));
    }

    // Try to match target URL with jobs
    const matchingJob = jobs.find(j => targetUrl.toLowerCase().includes(j.company.toLowerCase()) || j.url === targetUrl);
    if (matchingJob) {
      setSelectedJobId(matchingJob.id);
    } else {
      // Add a custom job based on targetUrl
      const customJob: ScrapedJob = {
        id: `job-onboarding-${Date.now()}`,
        title: 'Staff Interface Specialist',
        company: targetUrl.includes('figma') ? 'Figma' : targetUrl.includes('netflix') ? 'Netflix' : 'Target Corporate',
        location: 'Remote (Global)',
        url: targetUrl,
        responsibilities: [
          'Coordinate beautiful system design, margins alignment, and interactive typography layouts.',
          'Optimize web routes and server pipelines for extreme high availability runtime uptime.'
        ],
        preferredKeywords: ['Design Systems', 'Interactive Prototypes', 'Responsive Layout', 'React & Next.js'],
        rawText: `Custom target spec extracted for ${targetUrl}. Ready for ATS compiler layout adjustments.`
      };
      setJobs(prev => [customJob, ...prev]);
      setSelectedJobId(customJob.id);
    }

    setShowOnboarding(false);
  };

  // Active Workspace selections
  const [selectedProfileId, setSelectedProfileId] = useState<string>('candidate-leah');
  const [selectedJobId, setSelectedJobId] = useState<string>('job-1');
  const [showPromptPreview, setShowPromptPreview] = useState<boolean>(false);

  // Scraper playground state
  const [scrapeUrl, setScrapeUrl] = useState<string>('https://netflix.careers/senior-interface-architect');
  const [scrapeProgress, setScrapeProgress] = useState<string[]>([]);
  const [isScraping, setIsScraping] = useState<boolean>(false);

  // Generator engine state
  const [isGenerating, setIsGenerating] = useState<boolean>(false);
  const [genStep, setGenStep] = useState<number>(0);
  const [generatedResume, setGeneratedResume] = useState<string | null>(null);
  const [generatedCoverLetter, setGeneratedCoverLetter] = useState<string | null>(null);
  const [generatedEmail, setGeneratedEmail] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<'resume' | 'cover' | 'email'>('resume');

  // New wishlist addition form state
  const [newWishName, setNewWishName] = useState<string>('');
  const [newWishEmail, setNewWishEmail] = useState<string>('');
  const [newWishReason, setNewWishReason] = useState<string>('');
  const [newWishRole, setNewWishRole] = useState<string>('Frontend Specialist Access');
  const [wishlistMessage, setWishlistMessage] = useState<string>('');

  // Add new user directly through Admin interface state
  const [newUserName, setNewUserName] = useState<string>('');
  const [newUserEmail, setNewUserEmail] = useState<string>('');
  const [newUserTitle, setNewUserTitle] = useState<string>('Senior Product Manager');

  // Simulated Google Docs / Gmail deployment states
  const [docsDeploying, setDocsDeploying] = useState<boolean>(false);
  const [gmailSending, setGmailSending] = useState<boolean>(false);
  const [actionMessage, setActionMessage] = useState<{ type: 'success' | 'infoDefault'; msg: string } | null>(null);

  // Auto handle role authentication switching simulates Firestore credentials checks
  useEffect(() => {
    if (currentEmail === 'adv.akash2356@gmail.com') {
      setRoleMode('admin');
    } else if (profiles.some(p => p.email === currentEmail)) {
      setRoleMode('candidate');
      const activeProf = profiles.find(p => p.email === currentEmail);
      if (activeProf) {
        setSelectedProfileId(activeProf.id);
      }
    } else {
      setRoleMode('visitor');
    }
    // Reset generation results on switcher to maintain role bounds
    setGeneratedResume(null);
    setGeneratedCoverLetter(null);
    setGeneratedEmail(null);
  }, [currentEmail, profiles]);

  // Handle Admin Approvals
  const updateWishStatus = (id: string, nextStatus: 'approved' | 'rejected') => {
    setWishlist(prev => prev.map(item => {
      if (item.id === id) {
        return { ...item, status: nextStatus };
      }
      return item;
    }));

    // If approved, create a corresponding candidate profile for them immediately! See the brilliance!
    const target = wishlist.find(w => w.id === id);
    if (target && nextStatus === 'approved') {
      const alreadyProfile = profiles.some(p => p.email === target.email);
      if (!alreadyProfile) {
        const newProfile: CandidateProfile = {
          id: `candidate-${Date.now()}`,
          name: target.name,
          email: target.email,
          avatar: '🎓',
          title: target.roleRequested.split(' ')[0] + ' Engineer',
          experience: [
            {
              role: target.roleRequested,
              company: 'Vanguard Startup',
              duration: '2024 - 2026',
              bulletPoints: [
                'Successfully established visual frameworks optimized under critical timelines.',
                'Organized cloud delivery channels increasing platform capacity score and uptime metrics.'
              ]
            }
          ],
          skills: ['Cloud Architectures', 'Core Interfaces', 'React Framework', 'Security Policies'],
          education: 'Self-Taught Industry Scholar'
        };
        setProfiles(prev => [...prev, newProfile]);
      }
    }
  };

  // Handle addition of standard wishlist user
  const handleApplyWishlist = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newWishName || !newWishEmail || !newWishReason) return;

    const applicant: WishlistApplicant = {
      id: `wish-${Date.now()}`,
      name: newWishName,
      email: newWishEmail,
      reason: newWishReason,
      roleRequested: newWishRole,
      appliedAt: new Date().toISOString().replace('T', ' ').substring(0, 16),
      status: 'pending'
    };

    setWishlist(prev => [applicant, ...prev]);
    setWishNameStateEmpty();
    setWishlistMessage(' Application logged successfully! Current Administrator Akash has been notified for security authorization review.');
    setTimeout(() => setWishlistMessage(''), 8000);
  };

  const setWishNameStateEmpty = () => {
    setNewWishName('');
    setNewWishEmail('');
    setNewWishReason('');
  };

  // Admin Direct User Adding Action
  const handleAdminAddUser = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newUserName || !newUserEmail) return;

    const newlyCreated: CandidateProfile = {
      id: `candidate-${Date.now()}`,
      name: newUserName,
      email: newUserEmail,
      avatar: '👑',
      title: newUserTitle,
      experience: [
        {
          role: newUserTitle,
          company: 'Prestige Systems Corp',
          duration: '2022 - present',
          bulletPoints: [
            'Drove core feature specifications following executive strategy guidelines.',
            'Collaborated with global stakeholders to craft technical blueprints.'
          ]
        }
      ],
      skills: ['Strategic Roadmap', 'System Layouts', 'Cross-functional Coordination'],
      education: 'Direct Admin Accredited Placement'
    };

    setProfiles(prev => [...prev, newlyCreated]);
    setNewUserName('');
    setNewUserEmail('');
    
    setActionMessage({
      type: 'success',
      msg: `👑 User '${newlyCreated.name}' added to systems credentials directory directly as an active Candidate.`
    });
    setTimeout(() => setActionMessage(null), 5000);
  };

  // Scraper Playground trigger simulation
  const handleTriggerScrape = () => {
    if (!scrapeUrl.trim()) return;
    setIsScraping(true);
    setScrapeProgress([]);

    const steps = [
      ` [MCP Search] Dispatching Google Search Grounding to evaluate market trends for URL: ${scrapeUrl}`,
      '⚡ [MCP Scraper] Bypassing anti-bot checks utilizing persistent TLS handshakes...',
      '📖 [MCP Scraper] Ingesting HTML source parsing metadata, extracting Job Body text...',
      '🛠️ [MCP Gemini] Contextualizing raw layout: Identified Core Title as "Senior Product Architect" at Netflix',
      ' [MCP Scraper] Successfully parsed: 1) Key responsibilities, 2) Targeted ATS keyword alignment schema.'
    ];

    steps.forEach((stepMessage, index) => {
      setTimeout(() => {
        setScrapeProgress(prev => [...prev, stepMessage]);
        if (index === steps.length - 1) {
          setIsScraping(false);
          // Insert mock scraped job listing into list!
          const parsedJob: ScrapedJob = {
            id: `job-custom-${Date.now()}`,
            title: 'Senior Interface Architect',
            company: 'Netflix',
            location: 'Los Gatos, CA (Remote)',
            url: scrapeUrl,
            responsibilities: [
              'Architect responsive stream rendering player interfaces using lightweight CSS & high fidelity typography components.',
              'Collaborate directly with product design systems teams to bundle reusable tokens and micro-interaction prototypes.',
              'Build robust and extremely secure client routers compatible with high availability distributed web proxies.'
            ],
            preferredKeywords: ['Typography Pairing', 'Interactive Prototypes', 'Responsive Layout', 'Design Systems', 'React & Next.js', 'Tailwind Styling'],
            rawText: 'Netflix streaming core needs interface leads. Core skills includes advanced typography pairing, detailed system layout creations, and prototype design specs. Real-time rendering pipelines must be safe and optimized.'
          };

          setJobs(prev => [parsedJob, ...prev]);
          setSelectedJobId(parsedJob.id);
          setScrapedCount(prev => prev + 1);
        }
      }, (index + 1) * 1200);
    });
  };

  // Main generator call (ATS-Proof AI engine with exact custom master prompt rules)
  const runAtsGenerator = () => {
    setIsGenerating(true);
    setGenStep(0);

    const activeProfile = profiles.find(p => p.id === selectedProfileId) || profiles[0];
    const activeJob = jobs.find(j => j.id === selectedJobId) || jobs[0];

    const generateInterval = setInterval(() => {
      setGenStep(prev => {
        if (prev >= 4) {
          clearInterval(generateInterval);
          setIsGenerating(false);

          // Content generation matching BOTH original profile and job description
          // Bolding matches for the HR 6-second rule!
          const keywordsMatchedBold = activeJob.preferredKeywords.map(k => `**${k}**`).join(', ');
          
          let experienceSectionHTML = ``;
          activeProfile.experience.forEach(exp => {
            experienceSectionHTML += `
---
### ${exp.role} 
**${exp.company}** | *${exp.duration}*

${exp.bulletPoints.map(bp => {
  // Bold keywords inside original bullet points for surgical keyword alignment!
  let alignedText = bp;
  activeJob.preferredKeywords.forEach(kw => {
    const rx = new RegExp(kw, 'gi');
    alignedText = alignedText.replace(rx, `**$&**`);
  });
  return `- Accomplished high impact delivery: ${alignedText} — using modern standard frameworks.`;
}).join('\n')}`;
          });

          const complianceFooterMarkdown = `\n\n---\n### Intellectual Property & Compliance Verification\n${COMPLIANCE_DISCLAIMER}`;
          const complianceFooterPlain = `\n\n================================================================================\nINTELLECTUAL PROPERTY & COMPLIANCE VERIFICATION:\n${COMPLIANCE_DISCLAIMER}\n================================================================================`;

          const resOutput = `# ${activeProfile.name}
**${activeProfile.title}** | ${activeProfile.email} | Secured Candidate ID: RES-${activeProfile.id.substring(10, 14).toUpperCase()}

## EXECUTIVE PROFILE (Tailored)
Highly dedicated, results-oriented expert with an validated record of excellence. Ingested raw qualifications and aligned them targeted toward **${activeJob.company}** as a perfect match for **${activeJob.title}**. This document is optimized for passing standard semantic ATS screens and designed to satisfy the **Recruiter 6-Second Scanning Rule** by emphasizing core toolsets: ${keywordsMatchedBold}.

## MASTER SKILLSET DIRECTORY (ATS Optimized)
${activeProfile.skills.map(s => {
  const isMatch = activeJob.preferredKeywords.some(kw => kw.toLowerCase() === s.toLowerCase());
  return isMatch ? `* **${s}** [Exact Matched]` : `* ${s}`;
}).join('\n')}

## ARCHITECTURAL WORK EXPERIENCE
${experienceSectionHTML}

## ACADEMIC CREDENTIALS
- ${activeProfile.education}${complianceFooterMarkdown}
`;

          const letterOutput = `Dear Recruitment Team at ${activeJob.company},

I was delighted to analyze the recent operational roadmaps regarding your team's focus on **${activeJob.title}** via standard live grounding tools. Having spent several years developing targeted solutions around **${activeProfile.skills.slice(0,3).join(' and ')}**, I am writing to express my intense excitement. 

My baseline experience at **${activeProfile.experience[0]?.company || 'tech companies'}** mapping directly onto high usability designs aligns tightly with your technical mandate. Specifically, your requirement for ${activeJob.responsibilities[0].toLowerCase().replace(/\./g, '')} is a direct reflection of my daily objectives of the past several cycles. I am accustomed to addressing complex, ambiguous challenges with absolute focus, clear communication, and architectural logic.

Enclosed is my structured resume, customized surgically to your keyword requirements without sacrificing my authentic human voice. I would welcome the opportunity to connect and describe how my credentials can add immediate asset value to ${activeJob.company}.

Sincerely,
${activeProfile.name}
${activeProfile.email}${complianceFooterPlain}
`;

          const emailOutput = `Subject: Tailored Application Call: ${activeProfile.name} - ${activeJob.title}

Hi Team,

I recently utilized my Nano Banana Pro Career Assistant tool to analyze your open role for ${activeJob.title} (${activeJob.url}). 

Given my background as a ${activeProfile.title} with specific experience in ${activeProfile.skills.slice(0, 2).join(', ')}, I am highly confident this represents a premier partnership. 

I have attached my tailored ATS-proof resume and surgical cover letter inside our secure Google Doc MCP network at your convenience. I would love to schedule a brief 10-minute sync.

Warmly,
${activeProfile.name}
${activeProfile.email}${complianceFooterPlain}`;

          setGeneratedResume(resOutput);
          setGeneratedCoverLetter(letterOutput);
          setGeneratedEmail(emailOutput);
          return 4;
        }
        return prev + 1;
      });
    }, 1500);
  };

  const handleDownloadAssetBundle = () => {
    if (!generatedResume) return;
    const bundleText = `================================================================================
AKASH SYNC AGENT — EXECUTIVE CAREER ASSET PACKAGE
================================================================================
Generated for: ${currentActiveProfile.name} (${currentActiveProfile.email})
Target Company: ${currentActiveJob.company}
Target Role: ${currentActiveJob.title}
Created On: ${new Date().toLocaleString()}

================================================================================
1. TAILORED ATS RESUME
================================================================================
${generatedResume}

================================================================================
2. SURGICAL COVER LETTER
================================================================================
${generatedCoverLetter}

================================================================================
3. DIRECT PITCH EMAIL
================================================================================
${generatedEmail}

================================================================================
MANDATORY INTELLECTUAL PROPERTY & COMPLIANCE VERIFICATION:
${COMPLIANCE_DISCLAIMER}
================================================================================`;

    const blob = new Blob([bundleText], { type: 'text/plain;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `Career_Asset_Package_${currentActiveProfile.name.replace(/\s+/g, '_')}_${Date.now()}.txt`;
    link.click();
    URL.revokeObjectURL(url);
  };

  const currentActiveProfile = profiles.find(p => p.id === selectedProfileId) || profiles[0];
  const currentActiveJob = jobs.find(j => j.id === selectedJobId) || jobs[0];

  // MCP Integrations Simulation Handlers
  const handleDeployToDocs = () => {
    setDocsDeploying(true);
    setActionMessage(null);
    setTimeout(() => {
      setDocsDeploying(false);
      setHasDeployedDocs(true);
      setActionMessage({
        type: 'success',
        msg: `📂 [MCP Google Docs] Created new tailored document: 'Tailored_Resume_${currentActiveProfile.name.replace(/\s+/g, '_')}_${currentActiveJob.company}.gdoc' inside your secure Google Drive network!`
      });
    }, 2500);
  };

  const handleSendViaGmail = () => {
    setGmailSending(true);
    setActionMessage(null);
    setTimeout(() => {
      setGmailSending(false);
      setHasSentGmail(true);
      setActionMessage({
        type: 'success',
        msg: `📨 [MCP Gmail] Dispatched surgical email package to careers@${currentActiveJob.company.toLowerCase()}.com with customized credentials automatically attached.`
      });
    }, 2500);
  };

  if (showOnboarding) {
    return (
      <div className="bg-[#030303] p-6 md:p-8 rounded-3xl border border-indigo-500/20 shadow-2xl flex items-center justify-center min-h-[550px]" id="career-onboarding-container">
        <OnboardingSetup 
          defaultEmail={currentEmail}
          onComplete={handleOnboardingComplete}
        />
      </div>
    );
  }

  return (
    <div className="bg-[#030303] text-neutral-200 rounded-2xl border border-white/[0.08] overflow-hidden shadow-2xl flex flex-col font-sans" id="mcp-career-interface">

      {/* Visual Workspace Bar Banner */}
      <div className="bg-[#09090b] px-6 py-4 flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-indigo-500/20 shadow-[inset_0_-1px_0_rgba(255,255,255,0.05)]">
        <div>
          <h2 className="text-sm font-sans font-bold flex items-center gap-2 tracking-tight text-white uppercase">
            <span className="w-1.5 h-1.5 rounded-full bg-indigo-500 shadow-[0_0_8px_rgba(99,102,241,0.8)] animate-pulse" />
            Nano Banana Pro: Career Telemetry Suite
          </h2>
          <p className="text-[10px] text-neutral-500 font-mono tracking-widest mt-1 uppercase">
            Secure Pipeline • Firebase Ops Mode
          </p>
        </div>

        {/* Secure Authenticator Bar inside UI */}
        <div className="flex flex-wrap items-center gap-2">
          {/* IP & Compliance Verification Hub Button */}
          <button
            onClick={() => setShowComplianceModal(true)}
            className="px-3 py-1.5 bg-indigo-500/10 hover:bg-indigo-500/20 border border-indigo-500/30 text-indigo-300 font-medium text-[10px] rounded-lg flex items-center gap-1.5 transition-all active:scale-95 shadow font-mono uppercase"
            title="Intellectual Property & Compliance Verification"
          >
            <Scale className="w-3 h-3 text-indigo-400" /> IP Verification
          </button>

          {/* Deep Inspector Audit Trigger */}
          <button
            onClick={() => setShowDeepInspectorModal(true)}
            className="px-3 py-1.5 bg-white/[0.05] hover:bg-white/[0.1] border border-white/[0.1] text-neutral-300 font-medium text-[10px] rounded-lg flex items-center gap-1.5 transition-all active:scale-95 shadow font-mono uppercase"
            title="Deep Inspector Audit Deck"
          >
            <FileSearch className="w-3 h-3 text-emerald-400" /> Deep Inspector
          </button>

          {/* Spreadsheet Export Trigger */}
          <button
            onClick={() => setShowSpreadsheetModal(true)}
            className="px-3 py-1.5 bg-emerald-500/10 hover:bg-emerald-500/20 border border-emerald-500/30 text-emerald-300 font-medium text-[10px] rounded-lg flex items-center gap-1.5 transition-all active:scale-95 shadow font-mono uppercase"
            title="Export Spreadsheet Matrix (.CSV)"
          >
            <FileSpreadsheet className="w-3 h-3 text-emerald-400" /> Export Matrix
          </button>

          <button
            onClick={() => setShowOnboarding(true)}
            className="px-3 py-1.5 bg-white/[0.05] hover:bg-white/[0.1] border border-white/[0.1] text-white font-medium text-[10px] rounded-lg flex items-center gap-1.5 transition-all active:scale-95 shadow font-mono uppercase"
            title="Restart Setup Wizard"
          >
            <RefreshCw className="w-3 h-3" /> Re-Init
          </button>

          <div className="bg-[#030303] px-3 py-1.5 rounded-lg border border-white/[0.1] flex items-center gap-3">
            <div className="relative">
              {roleMode === 'admin' ? (
                <ShieldCheck className="w-4 h-4 text-indigo-400" />
              ) : (
                <Shield className="w-4 h-4 text-neutral-500" />
              )}
            </div>
            <div className="text-left">
              <span className="text-[8px] font-mono text-neutral-500 block tracking-widest font-bold">IDENTITY PROTOCOL</span>
              <select 
                value={currentEmail} 
                onChange={(e) => setCurrentEmail(e.target.value)}
                className="bg-transparent text-xs text-white font-mono font-bold mt-0.5 border-none p-0 outline-none cursor-pointer focus:ring-0 max-w-[190px]"
              >
                <option value="adv.akash2356@gmail.com" className="bg-[#030303] text-neutral-100 text-xs text-left">adv.akash2356@gmail.com (ADMIN)</option>
                <option value="leah.design@gmail.com" className="bg-[#030303] text-neutral-400 text-xs text-left">leah.design@gmail.com (User - Leah)</option>
                <option value="kai.explorer@gmail.com" className="bg-[#030303] text-neutral-400 text-xs text-left">kai.explorer@gmail.com (User - Kai)</option>
                <option value="anon.unapproved@gmail.com" className="bg-[#030303] text-neutral-400 text-xs text-left">applicant@visitor.com (Guest)</option>
              </select>
            </div>
          </div>
        </div>
      </div>

      {/* Role State Alert Banner */}
      <div className="bg-[#030303] text-orange-400 text-xs px-6 py-2 border-b border-white/5 flex items-center justify-between font-mono">
        <span className="flex items-center gap-2">
          <span className="inline-block w-2-h-2 bg-green-500 rounded-full animate-ping" />
          <span><b>ACTIVE USER ROLE:</b> {roleMode.toUpperCase()}</span>
          {roleMode === 'admin' && <span className="bg-emerald-950 text-emerald-300 font-bold px-2 py-0.5 rounded text-[10px]">CORE OWNER AUTHORIZED</span>}
        </span>
        <span className="text-neutral-400 font-bold text-[10px]">SSL PROTECTED COMPLIANT</span>
      </div>

      {/* Dynamic Gaming HUD & Sequence Tracker */}
      <div className="p-6 bg-[#09090b] border-b border-white/[0.05]">
        <TelemetryHUD
          currentEmail={currentEmail}
          selectedProfileId={selectedProfileId}
          selectedJobId={selectedJobId}
          isScraping={isScraping}
          isGenerating={isGenerating}
          hasGenerated={!!generatedResume}
          hasDeployedDocs={hasDeployedDocs}
          hasSentGmail={hasSentGmail}
          scrapedCount={scrapedCount}
        />
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-12 gap-0">
        
        {/* LEFT COMPILER NAVIGATION COLUMN (4-cols) */}
        <div className="xl:col-span-4 bg-[#030303] border-r border-white/5 p-6 space-y-6">
          
          {/* Section: Configured MCP Swarm State */}
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold font-mono tracking-widest text-white 500 uppercase">MCP CONNECTOR SWARM</span>
              <span className="text-[10px] bg-slate-800 text-neutral-400 px-1.5 py-0.5 rounded-md font-mono">5 CONNECTED</span>
            </div>
            
            <div className="space-y-2">
              {mcpConnectors.map(conn => (
                <div key={conn.id} className="bg-[#09090b] border border-white/5 hover:border-white/10 p-3 rounded-xl transition-all">
                  <div className="flex items-start justify-between">
                    <div>
                      <span className="text-xs font-bold text-white block">{conn.name}</span>
                      <span className="text-[9px] text-neutral-400 block mt-0.5">{conn.description}</span>
                    </div>
                    <span className={`text-[9px] font-mono font-bold px-1.5 py-0.5 rounded ${
                      conn.status === 'active' 
                        ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/10' 
                        : 'bg-red-500/10 text-red-400 border border-red-500/10'
                    }`}>
                      {conn.status.toUpperCase()}
                    </span>
                  </div>
                  
                  {/* Secret Key Input Configuration Simulation */}
                  <div className="mt-2.5 flex items-center gap-2 bg-[#030303] p-1.5 rounded-lg border border-white/5">
                    <Key className="w-3.5 h-3.5 text-neutral-400" />
                    <input 
                      type="password"
                      value={conn.apiKeyValue}
                      placeholder={`Paste ${conn.requiredKey}...`}
                      onChange={(e) => {
                        const val = e.target.value;
                        setMcpConnectors(prev => prev.map(c => {
                          if (c.id === conn.id) {
                            return { ...c, apiKeyValue: val, status: val.trim() ? 'active' : 'inactive' };
                          }
                          return c;
                        }));
                      }}
                      className="bg-transparent text-[10px] font-mono border-none outline-none flex-1 text-neutral-400 focus:ring-0 p-0"
                    />
                    {conn.apiKeyValue ? (
                      <span className="text-[8px] font-mono text-emerald-400 font-bold">CONFIGURED</span>
                    ) : (
                      <span className="text-[8px] font-mono text-white 400 font-bold">REQUIRED</span>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Section: Quick Whitelist Submission Form (For Visitors / Anonymous) */}
          {roleMode === 'visitor' && (
            <div className="bg-[#030303] border border-white/5 p-4 rounded-xl space-y-3">
              <span className="text-xs font-bold font-mono tracking-widest text-white 500 block uppercase"> APPLY ON WISHLIST</span>
              <p className="text-[10px] text-neutral-400 leading-relaxed font-serif italic">
                Your email "<b>{currentEmail}</b>" is currently unapproved on the Firestore authorization register. Submit an application below for Admin review.
              </p>
              
              <form onSubmit={handleApplyWishlist} className="space-y-2.5">
                <div>
                  <label className="text-[9px] font-mono uppercase text-neutral-400 block">Name</label>
                  <input 
                    type="text" 
                    value={newWishName}
                    onChange={(e) => setNewWishName(e.target.value)}
                    required
                    placeholder="E.g. Rohan Dev" 
                    className="w-full bg-[#030303] border border-white/10 rounded-lg px-2.5 py-1.5 text-xs text-white"
                  />
                </div>
                <div>
                  <label className="text-[9px] font-mono uppercase text-neutral-400 block">Wishlist Request Details</label>
                  <textarea 
                    value={newWishReason}
                    onChange={(e) => setNewWishReason(e.target.value)}
                    required
                    rows={2}
                    placeholder="Why do you need personalized ATS analysis?" 
                    className="w-full bg-[#030303] border border-white/10 rounded-lg px-2.5 py-1.5 text-xs text-white resize-none"
                  />
                </div>
                <div>
                  <label className="text-[9px] font-mono uppercase text-neutral-400 block">Target Role Category</label>
                  <select
                    value={newWishRole}
                    onChange={(e) => setNewWishRole(e.target.value)}
                    className="w-full bg-[#030303] border border-white/10 rounded-lg px-2.5 py-1.5 text-xs text-white"
                  >
                    <option value="Frontend Specialist Access">Frontend Specialist Access</option>
                    <option value="Executive PM Suite">Executive PM Suite</option>
                    <option value="Full Access Premium">Full Access Premium</option>
                  </select>
                </div>
                <button
                  type="submit"
                  className="w-full py-2 bg-indigo-500 hover:bg-indigo-500 text-white font-bold rounded-lg text-xs transition-all active:scale-95 flex items-center justify-center gap-1.5"
                >
                  <UserPlus className="w-3.5 h-3.5" /> Submit to Wishlist
                </button>
              </form>

              {wishlistMessage && (
                <div className="bg-indigo-500 border border-indigo-500 text-[10px] text-indigo-300 p-2.5 rounded-lg leading-relaxed font-mono">
                  {wishlistMessage}
                </div>
              )}
            </div>
          )}

        </div>

        {/* RIGHT WORKPLACE CONTENT GRID (8-cols) */}
        <div className="xl:col-span-8 p-6 flex flex-col justify-between space-y-6">
          
          {/* SCREEN: ADMINISTRATOR COMMAND DECK (If Role is Admin) */}
          {roleMode === 'admin' && (
            <div className="space-y-6">
              
              {/* Header Box */}
              <div className="flex flex-col md:flex-row md:items-center justify-between p-4 bg-[#030303] border border-white/5 rounded-2xl gap-4">
                <div className="flex items-center gap-3">
                  <div className="p-2.5 bg-emerald-500/10 text-emerald-400 border border-emerald-500/10 rounded-xl">
                    <ShieldCheck className="w-6 h-6" />
                  </div>
                  <div>
                    <h3 className="font-sans font-bold text-white text-base leading-tight">Admin Gate: Akash's Ground Control</h3>
                    <span className="text-[10px] font-mono text-neutral-400 block mt-0.5">ADMIN EMAIL: <b>{currentEmail}</b> &bull; FIRESTORE LIVE RULESETS ACTIVE</span>
                  </div>
                </div>

                <div className="text-right">
                  <span className="text-[10px] font-mono text-neutral-400 block">TOTAL DIRECT USERS:</span>
                  <span className="text-xl font-black text-white">{profiles.length} Active Profiles</span>
                </div>
              </div>

              {/* Action Alert Message */}
              {actionMessage && (
                <div className="bg-emerald-500/10 border border-emerald-500/20 p-3 rounded-xl flex items-center gap-2 text-xs text-emerald-300 font-mono">
                  <CheckCircle className="w-4 h-4" />
                  <span>{actionMessage.msg}</span>
                </div>
              )}

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                
                {/* Wishlist management card */}
                <div className="bg-[#030303] border border-white/5 rounded-2xl p-5 space-y-3">
                  <div className="flex items-center justify-between pb-2 border-b border-white/5">
                    <span className="text-xs font-bold font-mono text-white 500 tracking-wider">WISHLIST ENTRANCE PIPELINE</span>
                    <span className="text-[9px] bg-[#030303] text-neutral-400 px-2 py-0.5 rounded font-mono">
                      {wishlist.filter(w=>w.status==='pending').length} PENDING
                    </span>
                  </div>

                  <div className="space-y-3 max-h-[290px] overflow-y-auto pr-1">
                    {wishlist.length === 0 ? (
                      <div className="text-center py-8 text-neutral-400 italic text-xs">
                        No applications on the wishlist queue.
                      </div>
                    ) : (
                      wishlist.map(item => (
                        <div key={item.id} className="bg-[#030303] p-3.5 rounded-xl border border-white/5 space-y-2">
                          <div className="flex items-start justify-between gap-2">
                            <div>
                              <strong className="text-white text-xs block">{item.name}</strong>
                              <span className="text-[9px] text-neutral-400 font-mono">{item.email}</span>
                            </div>
                            <span className={`text-[8px] font-mono uppercase font-bold px-1.5 py-0.5 rounded ${
                              item.status === 'approved' ? 'bg-emerald-950 text-emerald-300' :
                              item.status === 'rejected' ? 'bg-red-950 text-red-300' : 'bg-indigo-500 text-white 300'
                            }`}>
                              {item.status}
                            </span>
                          </div>

                          <p className="text-[10px] text-neutral-400 italic font-serif leading-relaxed">
                            "{item.reason}"
                          </p>

                          <div className="flex items-center justify-between text-[9px] text-neutral-400 pt-1">
                            <span>Requested: <b className="text-white 500">{item.roleRequested}</b></span>
                            <span>{item.appliedAt}</span>
                          </div>

                          {item.status === 'pending' && (
                            <div className="flex gap-1.5 pt-1">
                              <button
                                onClick={() => updateWishStatus(item.id, 'approved')}
                                className="flex-1 py-1.5 bg-emerald-600 hover:bg-emerald-500 text-white font-bold rounded-md text-[10px] font-sans flex items-center justify-center gap-1 transition-all"
                              >
                                <CheckCircle className="w-3 h-3" /> Approve Access
                              </button>
                              <button
                                onClick={() => updateWishStatus(item.id, 'rejected')}
                                className="flex-1 py-1.5 bg-red-950 hover:bg-red-900 border border-red-500/20 text-red-100 font-bold rounded-md text-[10px] font-sans flex items-center justify-center gap-1 transition-all"
                              >
                                <XCircle className="w-3 h-3" /> Decline
                              </button>
                            </div>
                          )}
                        </div>
                      ))
                    )}
                  </div>
                </div>

                {/* Direct User Addition Portal */}
                <div className="bg-[#030303] border border-white/5 rounded-2xl p-5 space-y-4">
                  <div className="pb-2 border-b border-white/5 flex items-center justify-between">
                    <span className="text-xs font-bold font-mono text-white 500 tracking-wider">DIRECT CREDENTIALED PROVISIONING</span>
                    <span className="text-[9px] bg-[#030303] text-neutral-400 px-2 py-0.5 rounded font-mono">BYPASS GATEWAY</span>
                  </div>

                  <form onSubmit={handleAdminAddUser} className="space-y-3">
                    <div>
                      <label className="text-[9px] font-mono text-neutral-400 uppercase block tracking-wider">Full Username</label>
                      <input 
                        type="text" 
                        value={newUserName} 
                        onChange={(e)=>setNewUserName(e.target.value)}
                        required
                        placeholder="E.g. Sarah Conners"
                        className="w-full bg-[#030303] border border-white/10 rounded-xl px-3 py-2 text-xs text-white"
                      />
                    </div>
                    <div>
                      <label className="text-[9px] font-mono text-neutral-400 uppercase block tracking-wider">Authorized Gmail ID</label>
                      <input 
                        type="email" 
                        value={newUserEmail} 
                        onChange={(e)=>setNewUserEmail(e.target.value)}
                        required
                        placeholder="sarah.conners@gmail.com"
                        className="w-full bg-[#030303] border border-white/10 rounded-xl px-3 py-2 text-xs text-white"
                      />
                    </div>
                    <div>
                      <label className="text-[9px] font-mono text-neutral-400 uppercase block tracking-wider">Corporate Title</label>
                      <input 
                        type="text" 
                        value={newUserTitle} 
                        onChange={(e)=>setNewUserTitle(e.target.value)}
                        required
                        placeholder="E.g. Principal Architect"
                        className="w-full bg-[#030303] border border-white/10 rounded-xl px-3 py-2 text-xs text-white"
                      />
                    </div>
                    <button
                      type="submit"
                      className="w-full py-2.5 bg-emerald-600 hover:bg-emerald-500 text-white font-bold rounded-xl text-xs flex items-center justify-center gap-2 transition-all active:scale-95"
                    >
                      <Plus className="w-4 h-4" /> Deploy Active Candidate Row
                    </button>
                  </form>
                </div>

              </div>

            </div>
          )}

          {/* WORKSPACE PREAMBLE FOR ACTIVE CANDIDATE ACTIONS */}
          <div className="space-y-6">
            
            {/* Header: Select Profile and Job parameters */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              
              {/* Profile Picker */}
              <div className="bg-[#030303] border-2 border-indigo-500 rounded-2xl p-4 space-y-2 text-left shadow-lg">
                <div className="flex items-center gap-1.5 pb-1 border-b border-white/5">
                  <span className="w-5 h-5 rounded-full bg-indigo-500 text-neutral-400 font-mono font-black flex items-center justify-center text-[10px]">①</span>
                  <label className="text-[10px] font-mono text-white uppercase tracking-wider block font-bold">Inject Base Candidate Profile</label>
                </div>
                <div className="flex gap-2">
                  <select
                    value={selectedProfileId}
                    onChange={(e) => setSelectedProfileId(e.target.value)}
                    className="flex-1 bg-[#030303] border border-white/10 rounded-xl px-3 py-2.5 text-xs text-white font-bold"
                  >
                    {profiles.map(p => (
                      <option key={p.id} value={p.id}>{p.name} ({p.title})</option>
                    ))}
                  </select>
                </div>
                <div className="pt-2 bg-[#030303] p-2.5 rounded-xl border border-white/5 text-[10px] leading-relaxed text-neutral-400">
                  ⚡ Base skills: 
                  <span className="text-neutral-400 font-medium font-mono"> {(profiles.find(p=>p.id===selectedProfileId)?.skills || []).join(', ')}</span>
                </div>
              </div>

              {/* Job target selector or dynamic scraper endpoint */}
              <div className="bg-[#030303] border-2 border-indigo-500 rounded-2xl p-4 space-y-2 text-left shadow-lg">
                <div className="flex items-center gap-1.5 pb-1 border-b border-white/5">
                  <span className="w-5 h-5 rounded-full bg-indigo-500 text-neutral-400 font-mono font-black flex items-center justify-center text-[10px]">②</span>
                  <label className="text-[10px] font-mono text-white uppercase tracking-wider block font-bold">Specify Target Job Spec</label>
                </div>
                <select
                  value={selectedJobId}
                  onChange={(e) => setSelectedJobId(e.target.value)}
                  className="w-full bg-[#030303] border border-white/10 rounded-xl px-3 py-2.5 text-xs text-white font-bold"
                >
                  {jobs.map(j => (
                    <option key={j.id} value={j.id}>{j.company} — {j.title}</option>
                  ))}
                </select>
                <div className="pt-2 bg-[#030303] p-2.5 rounded-xl border border-white/5 text-[10px] leading-relaxed text-neutral-400 flex items-center justify-between">
                  <span>URL: <span className="text-white 500 truncate inline-block max-w-[120px] align-bottom">{jobs.find(j=>j.id===selectedJobId)?.url}</span></span>
                  <span className="bg-indigo-950 text-indigo-300 font-bold px-1.5 py-0.5 rounded text-[8px] font-mono uppercase">
                    {jobs.find(j=>j.id===selectedJobId)?.preferredKeywords.length} MATCH TOOLS
                  </span>
                </div>
              </div>

            </div>

            {/* Sandbox: Live URL Web Scraper Arena */}
            <div className="bg-[#030303] border-2 border-indigo-500/10 rounded-2xl p-5 space-y-3 shadow-lg">
              <div className="flex items-center justify-between pb-1 border-b border-white/5">
                <span className="text-xs font-black font-mono text-white 400 tracking-wider flex items-center gap-2">
                  <span className="w-5 h-5 rounded-full bg-indigo-500 text-neutral-400 font-mono font-black flex items-center justify-center text-[10px]">②-B</span>
                  <span>LIVE WEBSITE SCRAPER PLAYOUT &gt;&gt;</span>
                </span>
                <span className="text-[9px] bg-[#030303] text-neutral-400 px-2 py-0.5 rounded font-mono">MCP SCRAPE NODE</span>
              </div>

              <div className="flex flex-col md:flex-row gap-3">
                <input 
                  type="text" 
                  value={scrapeUrl}
                  onChange={(e) => setScrapeUrl(e.target.value)}
                  placeholder="Paste LinkedIn, indeed or corporate careers webpage..."
                  className="flex-1 bg-[#030303] border border-white/10 rounded-xl px-3.5 py-2.5 text-xs text-white"
                />
                <button
                  onClick={handleTriggerScrape}
                  disabled={isScraping}
                  className={`px-4 py-2.5 rounded-xl font-bold text-xs flex items-center justify-center gap-2 transition-all active:scale-95 whitespace-nowrap ${
                    isScraping 
                      ? 'bg-slate-800 text-neutral-400 cursor-not-allowed' 
                      : 'bg-indigo-500 hover:bg-indigo-400 text-white'
                  }`}
                >
                  <Globe className="w-3.5 h-3.5 animate-spin" style={{ animationDuration: isScraping ? '2s' : '0s' }} /> {isScraping ? "Scraping..." : "Scrape Site via MCP (+350 XP)"}
                </button>
              </div>

              {/* Scrape CLI terminal simulation logger */}
              {(isScraping || scrapeProgress.length > 0) && (
                <div className="bg-[#030303] p-3.5 rounded-xl border border-white/10 font-mono text-[9px] text-neutral-400 space-y-1.5 max-h-[140px] overflow-y-auto">
                  <div className="flex items-center gap-2 text-[10px] text-white 500 border-b border-white/5 pb-1 mb-1">
                    <Terminal className="w-3 h-3" />
                    <span>MCP SCRAPE CONSOLE OUTPUT</span>
                  </div>
                  {scrapeProgress.map((prog, idx) => (
                    <div key={idx} className="flex items-start gap-1">
                      <span className="text-neutral-400">&bull;</span>
                      <p>{prog}</p>
                    </div>
                  ))}
                  {isScraping && (
                    <div className="text-white 400 animate-pulse">Running scraper modules...</div>
                  )}
                </div>
              )}
            </div>

            {/* Live Industry Trend Widget via Google Search */}
            <div className="bg-[#030303] border-2 border-emerald-500/10 rounded-2xl p-5 space-y-3 shadow-lg">
              <div className="flex items-center justify-between pb-1 border-b border-white/5">
                <span className="text-xs font-black font-mono text-emerald-400 tracking-wider flex items-center gap-2">
                  <span className="w-5 h-5 rounded-full bg-emerald-500 text-neutral-400 font-mono font-black flex items-center justify-center text-[10px]"></span>
                  <span>LIVE INDUSTRY TRENDS (MCP SEARCH)</span>
                </span>
                <span className="text-[9px] bg-[#030303] text-emerald-400 px-2 py-0.5 rounded font-mono border border-emerald-500/20">AUTO-SYNC: ON</span>
              </div>
              <div className="space-y-2">
                <div className="bg-[#030303] p-3 rounded-xl border border-white/5 hover:border-emerald-500/30 transition-all cursor-default">
                  <div className="flex items-center gap-2 mb-1">
                    <span className="text-[8px] px-1.5 py-0.5 rounded bg-emerald-500/20 text-emerald-400 font-bold font-mono">TRENDING</span>
                    <span className="text-[10px] text-neutral-400 font-mono">2 mins ago</span>
                  </div>
                  <h4 className="text-xs font-bold text-neutral-400">Tech Giants Shift Focus to "Agentic Workflows" Over Raw Prompting</h4>
                  <p className="text-[10px] text-neutral-400 mt-1 line-clamp-2">Recent data from top tech recruitment boards suggests a 45% spike in job postings demanding experience with MCP connectors and multi-agent system orchestration.</p>
                </div>
                <div className="bg-[#030303] p-3 rounded-xl border border-white/5 hover:border-emerald-500/30 transition-all cursor-default">
                  <div className="flex items-center gap-2 mb-1">
                    <span className="text-[8px] px-1.5 py-0.5 rounded bg-blue-500/20 text-blue-400 font-bold font-mono">MARKET DATA</span>
                    <span className="text-[10px] text-neutral-400 font-mono">15 mins ago</span>
                  </div>
                  <h4 className="text-xs font-bold text-neutral-400">ATS Engines Filtering Out Over-Formatted Resumes</h4>
                  <p className="text-[10px] text-neutral-400 mt-1 line-clamp-2">A new study from Google Search API integrations reveals that clean, single-column semantic resumes get parsed with 98% accuracy, while multi-column designs fail at a 60% rate.</p>
                </div>
              </div>
            </div>

            {/* AI ATS Generator Control Station */}
            <div className="bg-[#030303] border-2 border-indigo-500/25 rounded-2xl p-5 space-y-4 shadow-xl">
              
              <div className="flex items-center justify-between pb-2 border-b border-white/5">
                <span className="text-xs font-black font-mono text-indigo-400 tracking-wider flex items-center gap-2">
                  <span className="w-5 h-5 rounded-full bg-indigo-500 text-neutral-400 font-mono font-black flex items-center justify-center text-[10px]">③</span>
                  <span>ATS RECRUITMENT WRITER PIPELINE</span>
                </span>
                <button 
                  onClick={() => setShowPromptPreview(!showPromptPreview)}
                  className="text-[9px] font-mono text-neutral-400 hover:text-indigo-300 transition-all flex items-center gap-1 bg-[#030303] px-2 py-1 rounded"
                >
                  <Eye className="w-3 h-3" /> {showPromptPreview ? "Hide Master Prompt" : "Inspect Master Prompt"}
                </button>
              </div>

              {/* Master Recruiter prompt visualization */}
              <AnimatePresence>
                {showPromptPreview && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: 'auto' }}
                    exit={{ opacity: 0, height: 0 }}
                    className="overflow-hidden bg-[#030303] rounded-xl border border-white/5 p-4 space-y-2 text-left font-mono"
                  >
                    <span className="text-[10px] font-mono text-white 500 font-bold block">🚨 RECRUITER MASTER PROMPT (ATS SPECIFICATIONS)</span>
                    <pre className="text-[9px] text-neutral-400 whitespace-pre-wrap leading-relaxed max-h-[220px] overflow-y-auto pr-1">
                      {RECRUITER_MASTER_PROMPT}
                    </pre>
                    <div className="pt-2 text-[8px] text-neutral-400 italic">
                      &bull; Injected model constraints ensure 20-year experience benchmark, Star XYZ active formats, and human-style text with no typical AI markers.
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>

              <div className="flex flex-col md:flex-row items-center justify-between gap-4 pt-1 bg-[#030303] p-4 rounded-xl border border-white/5">
                <div className="text-left">
                  <span className="text-[10px] text-neutral-400 font-mono uppercase tracking-wider block">CHOSEN COGNITIVE AI SUITE</span>
                  <span className="text-sm font-bold text-white flex items-center gap-1.5 mt-0.5">
                    <Zap className="w-4 h-4 text-white 400 animate-pulse" /> Thinking with 3 Pro (Delicate Reasoning Model)
                  </span>
                </div>

                <button
                  onClick={runAtsGenerator}
                  disabled={isGenerating}
                  className="w-full md:w-auto px-6 py-3 bg-gradient-to-r from-indigo-600 to-indigo-500 hover:from-indigo-500 hover:to-indigo-400 text-white font-bold rounded-xl text-xs font-mono shadow-md active:scale-95 transition-all flex items-center justify-center gap-2 ring-2 ring-indigo-500/25"
                >
                  <Sparkles className="w-3.5 h-3.5 text-yellow-300 animate-spin" style={{ animationDuration: '4s' }} /> RUN COMPILER ENGINE (+500 XP)
                </button>
              </div>

              {/* Engine progress loader */}
              {isGenerating && (
                <div className="bg-[#030303] p-4 rounded-xl border border-indigo-500/20 text-left space-y-3 font-mono">
                  <div className="flex justify-between items-center text-xs">
                    <span className="text-indigo-400 font-bold">🛠️ ATS RECRUITER AI ENGINE PROCESSING:</span>
                    <span className="text-neutral-400 bg-[#030303] px-1.5 py-0.5 rounded">{Math.round((genStep + 1) * 25)}%</span>
                  </div>
                  
                  {/* Progress Line */}
                  <div className="h-1.5 bg-slate-800 rounded-full overflow-hidden">
                    <motion.div 
                      className="h-full bg-indigo-500"
                      initial={{ width: '0%' }}
                      animate={{ width: `${(genStep + 1) * 25}%` }}
                      transition={{ duration: 0.8 }}
                    />
                  </div>

                  <div className="text-[9px] text-neutral-400 space-y-1">
                    <p className={genStep >= 0 ? "text-neutral-400" : ""}>✓ Step 1: Mapping Candidate baseline profile into structured JSON...</p>
                    <p className={genStep >= 1 ? "text-neutral-400" : "text-neutral-400"}>&raquo; Step 2: Extracting scraped target keywords from {currentActiveJob.company} spec...</p>
                    <p className={genStep >= 2 ? "text-neutral-400" : "text-neutral-400"}>&raquo; Step 3: Injecting 20-Year Recruiter Master Prompt rules & XYZ templates...</p>
                    <p className={genStep >= 3 ? "text-neutral-400" : "text-neutral-400"}>&raquo; Step 4: Formatting bespoke high impact bullet points and drafting emails...</p>
                  </div>
                </div>
              )}

            </div>

            {/* Generated results rendering */}
            {(generatedResume || generatedCoverLetter || generatedEmail) && (
              <div className="bg-[#030303] rounded-2xl border-2 border-indigo-500/10 overflow-hidden space-y-3">
                
                {/* Generation Notification */}
                {actionMessage && (
                  <div className="bg-emerald-500/10 border-b border-emerald-500/20 p-3 flex items-center gap-2 text-xs text-emerald-300 font-mono">
                    <CheckCircle className="w-4 h-4" />
                    <span>{actionMessage.msg}</span>
                  </div>
                )}

                {/* Tabs switcher header */}
                <div className="flex bg-[#030303] border-b border-white/5 font-mono text-xs">
                  <button
                    onClick={() => setActiveTab('resume')}
                    className={`flex-1 py-3 px-2 font-bold transition-all border-b-2 ${
                      activeTab === 'resume' ? 'text-indigo-400 border-indigo-500 bg-[#030303]' : 'text-neutral-400 border-transparent hover:text-neutral-400'
                    }`}
                  >
                    📄 tailored_resume.md
                  </button>
                  <button
                    onClick={() => setActiveTab('cover')}
                    className={`flex-1 py-3 px-2 font-bold transition-all border-b-2 ${
                      activeTab === 'cover' ? 'text-indigo-400 border-indigo-500 bg-[#030303]' : 'text-neutral-400 border-transparent hover:text-neutral-400'
                    }`}
                  >
                    ✍️ cover_letter.md
                  </button>
                  <button
                    onClick={() => setActiveTab('email')}
                    className={`flex-1 py-3 px-2 font-bold transition-all border-b-2 ${
                      activeTab === 'email' ? 'text-indigo-400 border-indigo-500 bg-[#030303]' : 'text-neutral-400 border-transparent hover:text-neutral-400'
                    }`}
                  >
                    📧 raw_pitch_email.txt
                  </button>
                </div>

                {/* Output text workspace panel */}
                <div className="p-5 text-left text-xs text-neutral-400 leading-relaxed font-mono max-h-[350px] overflow-y-auto">
                  
                  {activeTab === 'resume' && (
                    <div className="space-y-4">
                      <div className="flex items-center justify-between bg-[#030303] px-3 py-1.5 rounded border border-white/5 text-[9px] text-white 500">
                        <span> <b>6-SECOND HR CHECK:</b> Critical tool matches highlighted in gold!</span>
                        <span>ATS SCORE: 99.2%</span>
                      </div>
                      
                      {/* Interactive visualizer mapping matched highlight terms */}
                      <div className="whitespace-pre-wrap font-mono text-xs bg-[#030303] p-4 rounded-xl border border-white/5 shadow-inner">
                        {/* Render simple highlight syntax replacing simulated asterisks */}
                        {generatedResume?.split('\n').map((line, idx) => {
                          if (line.startsWith('# ')) {
                            return <h1 key={idx} className="text-lg font-bold text-white border-b border-indigo-500/25 pb-1 mt-3">{line.replace('# ', '')}</h1>;
                          }
                          if (line.startsWith('## ')) {
                            return <h2 key={idx} className="text-sm font-bold text-indigo-400 mt-4 mb-2">{line.replace('## ', '')}</h2>;
                          }
                          if (line.startsWith('### ')) {
                            return <h3 key={idx} className="text-xs font-bold text-emerald-400 mt-2">{line.replace('### ', '')}</h3>;
                          }
                          
                          // Convert markdown bolding into highlighted spans
                          let segments = line.split('**');
                          if (segments.length > 1) {
                            return (
                              <p key={idx} className="py-0.5">
                                {segments.map((seg, sIdx) => {
                                  // Every odd index was inside asterisks **
                                  if (sIdx % 2 === 1) {
                                    return <span key={sIdx} className="bg-indigo-500 text-white 300 font-bold px-1 py-0.5 rounded border border-indigo-500">{seg}</span>;
                                  }
                                  return seg;
                                })}
                              </p>
                            );
                          }

                          return <p key={idx} className="py-0.5">{line}</p>;
                        })}
                      </div>
                    </div>
                  )}

                  {activeTab === 'cover' && (
                    <div className="space-y-3 bg-[#030303] p-4 rounded-xl border border-white/5 whitespace-pre-wrap font-mono text-xs text-neutral-400">
                      {generatedCoverLetter}
                    </div>
                  )}

                  {activeTab === 'email' && (
                    <div className="space-y-3 bg-[#030303] p-4 rounded-xl border border-white/5 whitespace-pre-wrap font-mono text-xs text-neutral-400">
                      {generatedEmail}
                    </div>
                  )}

                  {/* Prominent Mandatory Compliance Disclaimer Display */}
                  <div className="mt-4 bg-[#030303] border-2 border-indigo-500/30 rounded-xl p-4 space-y-2 shadow-lg">
                    <div className="flex items-center justify-between border-b border-white/[0.06] pb-2">
                      <span className="text-[10px] text-indigo-400 font-bold uppercase tracking-wider flex items-center gap-1.5 font-mono">
                        <Scale className="w-3.5 h-3.5" /> Intellectual Property & Compliance Verification
                      </span>
                      <div className="flex items-center gap-2">
                        <span className="text-[8px] bg-emerald-950 text-emerald-300 font-mono px-2 py-0.5 rounded font-bold border border-emerald-500/20">
                          HUMAN-DIRECTED AI ORCHESTRATION
                        </span>
                        <button
                          onClick={() => {
                            navigator.clipboard.writeText(COMPLIANCE_DISCLAIMER);
                            setDisclaimerCopied(true);
                            setTimeout(() => setDisclaimerCopied(false), 3000);
                          }}
                          className="text-[9px] bg-white/[0.05] hover:bg-white/[0.1] text-neutral-300 px-2 py-0.5 rounded border border-white/[0.1] flex items-center gap-1 font-mono transition-all"
                        >
                          {disclaimerCopied ? <Check className="w-2.5 h-2.5 text-emerald-400" /> : <Copy className="w-2.5 h-2.5" />}
                          <span>{disclaimerCopied ? "COPIED" : "COPY"}</span>
                        </button>
                      </div>
                    </div>

                    <blockquote className="text-neutral-300 font-sans italic text-xs leading-relaxed bg-white/[0.02] p-3 rounded-lg border border-white/[0.04]">
                      "{COMPLIANCE_DISCLAIMER}"
                    </blockquote>
                  </div>

                </div>

                {/* Bottom deploy actions row utilizing MCP connectors */}
                <div className="flex flex-col md:flex-row gap-2.5 p-4 bg-[#09090b] border-t border-white/5 items-center justify-between">
                  <div className="flex items-center gap-1.5 text-xs text-neutral-400 font-mono">
                    <span className="w-5 h-5 rounded-full bg-indigo-500 text-neutral-400 flex items-center justify-center text-[10px] font-black">④</span>
                    <span>DEPLOY VERIFIED ASSETS:</span>
                  </div>
                  
                  <div className="flex flex-wrap items-center gap-2 w-full md:w-auto justify-end">
                    <button
                      onClick={handleDownloadAssetBundle}
                      className="px-3.5 py-2.5 bg-white/[0.05] hover:bg-white/[0.1] border border-white/[0.1] text-white font-mono rounded-xl text-xs flex items-center justify-center gap-1.5 transition-all shadow active:scale-95"
                      title="Download full candidate bundle with compliance stamp"
                    >
                      <Download className="w-3.5 h-3.5 text-indigo-400" />
                      <span>Download Package (.TXT)</span>
                    </button>

                    <button
                      onClick={handleDeployToDocs}
                      disabled={docsDeploying}
                      className={`px-3.5 py-2.5 rounded-xl font-bold text-xs flex items-center justify-center gap-1.5 transition-all shadow active:scale-95 font-mono ${
                        docsDeploying 
                          ? 'bg-slate-800 text-neutral-400 cursor-not-allowed' 
                          : 'bg-white text-slate-900 hover:bg-slate-200'
                      }`}
                    >
                      <FileText className="w-3.5 h-3.5 fill-blue-500/10 stroke-blue-600" />
                      {docsDeploying ? "Deploying..." : "📁 Google Docs"}
                    </button>

                    <button
                      onClick={handleSendViaGmail}
                      disabled={gmailSending}
                      className={`px-3.5 py-2.5 bg-gradient-to-r from-indigo-600 to-indigo-500 hover:from-indigo-500 hover:to-indigo-400 text-white font-bold rounded-xl text-xs flex items-center justify-center gap-1.5 transition-all shadow active:scale-95 font-mono ${
                        gmailSending 
                          ? 'bg-indigo-950 text-indigo-300 cursor-not-allowed' 
                          : ''
                      }`}
                    >
                      <Mail className="w-3.5 h-3.5" />
                      {gmailSending ? "Drafting..." : "📨 Dispatch Gmail"}
                    </button>
                  </div>

                </div>

              </div>
            )}

          </div>

        </div>

      </div>

      {/* Compliance & Audit Modals */}
      <ComplianceVerificationModal
        isOpen={showComplianceModal}
        onClose={() => setShowComplianceModal(false)}
        assetTitle={`Tailored Career Suite Asset (${currentActiveProfile.name})`}
      />

      <DeepInspectorModal
        isOpen={showDeepInspectorModal}
        onClose={() => setShowDeepInspectorModal(false)}
        candidateName={currentActiveProfile.name}
        targetJob={currentActiveJob.title}
        targetCompany={currentActiveJob.company}
      />

      <SpreadsheetExportModal
        isOpen={showSpreadsheetModal}
        onClose={() => setShowSpreadsheetModal(false)}
        profiles={profiles}
        wishlist={wishlist}
        jobs={jobs}
      />

    </div>
  );
}
