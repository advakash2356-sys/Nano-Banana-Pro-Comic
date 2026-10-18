import { PanelData, TutorialStep, McpConnector, CandidateProfile, WishlistApplicant, ScrapedJob } from './types';

// Intellectual Property & Compliance Verification Required Disclaimer
export const COMPLIANCE_DISCLAIMER = "Disclaimer: All text, audio, video, and imagery in this were developed through a strategic orchestration of AI tools but remain entirely human-directed. The creative vision, engineering, and final output are the result of extensive hard work and represent the exclusive intellectual property of Akash Sync Agent.";

export const panelsData: PanelData[] = [
  {
    id: TutorialStep.MODEL_SELECTION,
    title: "1. Select thinking model",
    shortDesc: "Choose model and toggle thinking context",
    description: "First, click on the Gemini model picker. Ensure you select 'Thinking with 3 Pro' to enable advanced visual understanding and creation capabilities.",
    instruction: "Select 'Thinking with 3 Pro' inside the Gemini interface to begin.",
    comicScript: "A mobile interface on Gemini, rendered in a poetic watercolor-ink style with fine ink outlines and soft, bleeding washes. A hand painted with expressive brushwork taps a prominent button labeled '🍌 Create image'. Above the button it should say 'Choose your Model' then below there should be a checkbox that says 'Thinking with 3 Pro'. Muted greys and blues dominate the background. The button has a vivid yellow accent.",
    imageSeed: "model_select",
    accentColor: "from-amber-100 to-yellow-200"
  },
  {
    id: TutorialStep.ADD_SELFIE,
    title: "2. Add your selfie",
    shortDesc: "Provide custom image prompt",
    description: "Next, snap or upload a cheerful selfie. Gemini uses this as the reference image, preserving your features while building the artistic scene.",
    instruction: "Snap or upload a photo of yourself using the camera button.",
    comicScript: "A cheerful person is depicted adding their selfie from the phone’s camera. The user's face is drawn with soft outlines and warm pastel colors, while the phone and UI maintain the delicate water-ink aesthetic. Visible paper grain adds to the texture.",
    imageSeed: "selfie_add",
    accentColor: "from-rose-100 to-orange-100"
  },
  {
    id: TutorialStep.CHOOSE_CONCEPT,
    title: "3. Dream up options",
    shortDesc: "Think about style options",
    description: "Let your imagination run wild! Think of what you would like to become—a soft plushie, a cyberpunk figurine, or rocking an edgy mohawk hairstyle.",
    instruction: "Select one of the creative concepts to explore what you'll create.",
    comicScript: "The person thinks about what to create. In the background, different options are visualized to show what they’re thinking, including — them as a plushie, them with a mohawk hairstyle, and a figurine. These options are clearly rendered behind the person in the same style.",
    imageSeed: "creative_dream",
    accentColor: "from-purple-100 to-indigo-100"
  },
  {
    id: TutorialStep.ADD_PROMPT,
    title: "4. Add style prompt",
    shortDesc: "Apply a custom style filter",
    description: "Now express your wish! Tell Gemini exactly how to translate your dream using a natural prompt like 'Transform me into a watercolor painting'.",
    instruction: "Type or select a prompt to style your profile picture.",
    comicScript: "The person is shown adding a style prompt, with a speech bubble saying 'Transform me into a watercolor painting'. The text is integrated into the panel's watercolor-ink look, and the interaction feels natural.",
    imageSeed: "style_prompt",
    accentColor: "from-teal-100 to-emerald-100"
  },
  {
    id: TutorialStep.EDIT_AND_FINALIZE,
    title: "5. Generate & edit!",
    shortDesc: "Refine with simple chat instructions",
    description: "Your watercolor masterpiece is generated! You can easily edit or adjust by typing commands back and forth to refine the ink bleeds or background color.",
    instruction: "Experience the final generated watercolor artwork! Reset the guide to try other combinations.",
    comicScript: "The person is seen editing the image by simply typing into Gemini. The scene captures the ease of this interaction, with the final edited image, now in a watercolor style, appearing on the screen. The overall tone is friendly, instructional, and inspiring.",
    imageSeed: "artwork_final",
    accentColor: "from-sky-100 to-blue-200"
  }
];

// MCP Hub Configuration
const defaultMcpConnectors: McpConnector[] = [
  {
    id: 'mcp-scraper',
    name: 'MCP Universal Web Scraper',
    category: 'Scraper',
    description: 'Bypasses standard site blocks to harvest accurate raw markdown job specifications from LinkedIn, Indeed, and corporate careers listing pages.',
    status: 'inactive',
    requiredKey: 'SCRAPER_ENDPOINT_TOKEN',
    apiKeyValue: ''
  },
  {
    id: 'mcp-gmail',
    name: 'MCP Secure Gmail Client',
    category: 'Gmail',
    description: 'Drafts, schedules, and sends ultra-customized surgical cover letters directly via SMTP/OAuth. Respects strict daily delivery caps to avoid spam tags.',
    status: 'inactive',
    requiredKey: 'GMAIL_OAUTH_REFRESH_TOKEN',
    apiKeyValue: ''
  },
  {
    id: 'mcp-docs',
    name: 'MCP Google Docs Generator',
    category: 'Docs',
    description: 'Deploys customized resumes directly into clean Google Workspace documents with perfect layout margins, exportable in one-click to PDF format.',
    status: 'inactive',
    requiredKey: 'GOOGLE_DRIVE_FOLDER_ID',
    apiKeyValue: ''
  },
  {
    id: 'mcp-gemini',
    name: 'MCP Gemini 3 Pro Agent Engine',
    category: 'Gemini',
    description: 'Enables high-context deep thinking model loops using the server-side API to construct human-crafted prose, completely removing AI watermarks.',
    status: 'inactive',
    requiredKey: 'GEMINI_API_KEY',
    apiKeyValue: ''
  },
  {
    id: 'mcp-search',
    name: 'MCP Google Search Grounding',
    category: 'Search',
    description: 'Queries active web trends to supply live company cultural values, recent leadership quotes, and product language for hyper-specific optimization.',
    status: 'inactive',
    requiredKey: 'GOOGLE_CUSTOM_SEARCH_ID',
    apiKeyValue: ''
  }
];

// Keys are never committed: they come from the user's browser (localStorage),
// or from VITE_GEMINI_API_KEY at build time for the Gemini connector.
export const MCP_KEYS_STORAGE = 'mcpConnectorKeys';
export function loadMcpConnectors(): McpConnector[] {
  let saved: Record<string, string> = {};
  try { saved = JSON.parse(localStorage.getItem(MCP_KEYS_STORAGE) || '{}'); } catch { saved = {}; }
  const envGemini = (import.meta as any).env?.VITE_GEMINI_API_KEY || '';
  return defaultMcpConnectors.map(c => {
    const key = saved[c.id] || (c.id === 'mcp-gemini' ? envGemini : '');
    return { ...c, apiKeyValue: key, status: key.trim() ? 'active' : 'inactive' } as McpConnector;
  });
}
export const initialMcpConnectors: McpConnector[] = loadMcpConnectors();

// Master recruiter prompt with 20 years experience blueprint
export const RECRUITER_MASTER_PROMPT = `You are a legendary executive recruiter with over 20 years of experience placing high-impact leaders and individual contributors into Tier-1 tech giants and innovative startups. 

Your objective is to ingest the candidate's core baseline resume, analyze a harvested job specification, and produce a fully customized ATS-proof resume and a surgical, charismatic cover letter.

Adhere to these absolute standards:
1. ATS-Proof Architecture: Map directly to standard parsed semantic categories. Use natural keyword integration so standard parsing engines score it at 99%+ alignment. Never use decorative side columns, nested tables, rating progress bars, or complex custom icons which trip up parser indexes.
2. The Human Touch Constraint: Eliminate repetitive corporate buzzword patterns. Remove common AI markers like "pioneered the future of", "leveraged robust tools to", or "tapestry of experiences". Structure bullet points with the Star/X-Y-Z formula: "Accomplished [X] as measured by [Y], by doing [Z]" written in a crisp, conversational, active human tone.
3. The Six-Second Rule: HR specialists scan names and bullet points in seconds. Place paramount value elements in clear view. Dynamically bold the exactly-matching technical tools in the work history where they correspond directly to the Scraped Job Description.
4. Cover Letter Surgical Injection: The cover letter are never boilerplate. Draft a highly specific, warm, hook-driven, 3-paragraph letter targeting the precise hiring representative or company cultural shift. It must sound like an ambitious professional who analyzed the company's recent roadmap and holds exact matching wisdom.`;

// Candidate baseline profile registers
export const initialCandidateProfiles: CandidateProfile[] = [
  {
    id: 'candidate-leah',
    name: 'Leah Vance',
    email: 'leah.design@gmail.com',
    avatar: '👩‍💻',
    title: 'Senior UX & Product Designer',
    experience: [
      {
        role: 'Lead UX Designer',
        company: 'CanvaCraft',
        duration: '2023 - Present',
        bulletPoints: [
          'Redesigned the complex multi-asset onboarding workflow, improving successful project publishing rates by 42% in under six months.',
          'Formulated a comprehensive localized design token system adopted across four cross-functional global dev teams, eliminating 30% of design-to-code technical debt.',
          'Mentored three junior designers while collaborating directly with engineering directors to prototype rapid interactive Figma templates.'
        ]
      },
      {
        role: 'Product Visual Designer',
        company: 'Studio Pixelate',
        duration: '2021 - 2023',
        bulletPoints: [
          'Designed high-fidelity mockups and interaction patterns that raised checkout flow conversion by 18% during key seasonal cycles.',
          'Established detailed user research protocols, conducting 40+ user interviews to inform the new visual design direction.'
        ]
      }
    ],
    skills: ['Figma Design', 'UX Research', 'Design Systems', 'Micro-interactions', 'HTML/Tailwind CSS', 'Typography Pairing', 'Interactive Prototypes'],
    education: 'BFA in Communication Design — RISD'
  },
  {
    id: 'candidate-kai',
    name: 'Kai Rivers',
    email: 'kai.explorer@gmail.com',
    avatar: '🧗‍♂️',
    title: 'Senior Full-Stack Engineer',
    experience: [
      {
        role: 'Senior Staff Developer',
        company: 'Vortex Cloud Inc.',
        duration: '2022 - Present',
        bulletPoints: [
          'Implemented modular server-side caching using Redis cluster pools, reducing average endpoint latencies by 310ms.',
          'Led migration of an outdated legacy monolithic monolith to a clean, fast distributed Next.js and Go server network.',
          'Developed robust secure API routers handling 2.5 Million daily checkouts with zero downtime and strict validation guardrails.'
        ]
      },
      {
        role: 'Systems Engineer',
        company: 'Datasync Solutions',
        duration: '2019 - 2022',
        bulletPoints: [
          'Engineered automatic schema validation utilities using TypeScript and PostgreSQL, lowering live database exceptions by 88%.',
          'Accelerated local Docker CI testing times by 45% using optimized layer hashing rules.'
        ]
      }
    ],
    skills: ['React & Next.js', 'TypeScript', 'Node.js/Express', 'PostgreSQL', 'Redis Clusters', 'Go Language', 'Docker Containers', 'Tailwind Styling'],
    education: 'BS in Computer Science — Georgia Tech'
  }
];

// Wishlist applicant records for administration simulations
export const initialWishlistApplicants: WishlistApplicant[] = [
  {
    id: 'wish-1',
    name: 'Rohan Sharma',
    email: 'rohan.dev@gmail.com',
    reason: 'I am a junior frontend engineer looking to translate my raw portfolio projects into direct recruiter-ready ATS resumes.',
    roleRequested: 'Frontend Specialist Access',
    appliedAt: '2026-06-10 14:32',
    status: 'pending'
  },
  {
    id: 'wish-2',
    name: 'Sienna Ross',
    email: 'sienna.pm@yahoo.com',
    reason: 'I need to find a Product Manager job at Stripe. I want to sync my Gmail account to auto-generate and submit surgical responses.',
    roleRequested: 'Executive PM Suite',
    appliedAt: '2026-06-11 01:15',
    status: 'approved'
  },
  {
    id: 'wish-3',
    name: 'Alex Mercer',
    email: 'alex.code@outlook.com',
    reason: 'Trying to bypass the endless LinkedIn application filters. Your scraping and Docs MCP connector sounds like the perfect system.',
    roleRequested: 'Full Access Premium',
    appliedAt: '2026-06-11 02:40',
    status: 'rejected'
  }
];

// Scraped job specifications list
export const scrapedJobsList: ScrapedJob[] = [
  {
    id: 'job-1',
    title: 'Staff Product designer (Aesthetic Focus)',
    company: 'Figma',
    location: 'San Francisco, CA (Hybrid)',
    url: 'https://figma.com/careers/staff-designer',
    responsibilities: [
      'Spearhead next-gen layout & prototyping features focusing on gorgeous typography, responsive page layouts, and fine margin controls.',
      'Refine the design system token schema across mobile & desktop applications, integrating seamless real-time handoff points for developers.',
      'Analyze design feedback, and construct interactive graphic environments that look beautiful, minimal, and highly professional.'
    ],
    preferredKeywords: ['Design Systems', 'Figma Design', 'Typography Pairing', 'Interactive Prototypes', 'Responsive Layout', 'UX Research'],
    rawText: 'Figma is hiring a Staff Product Designer. The candidate will work closely with engineering to build gorgeous visual design experiences, typography pairing components, and robust, clean design tokens. Required: Figma experience, design layout research, and a track record of beautiful graphic creations.'
  },
  {
    id: 'job-2',
    title: 'Senior Core API Engineer',
    company: 'Stripe',
    location: 'Austin, TX (Remote)',
    url: 'https://stripe.com/jobs/api-engineer',
    responsibilities: [
      'Design, program, and secure high-availability webhook pipelines handling financial ledger entries across regional clusters.',
      'Optimize database queries using PostgreSQL schemas and high-speed in-memory caches to secure safe sub-50ms API request resolutions.',
      'Document clean integration software specifications for millions of e-commerce developer consumers globally.'
    ],
    preferredKeywords: ['PostgreSQL', 'TypeScript', 'Node.js/Express', 'Redis Clusters', 'Database Query Optimization', 'API design'],
    rawText: 'Stripe seeks Senior API Developers. You will write robust, mission-critical typescript services, handle database query index caching, and optimize PostgreSQL databases. Experience with Redis clusters, server-side frameworks, and highly secure REST endpoints is crucial.'
  }
];
