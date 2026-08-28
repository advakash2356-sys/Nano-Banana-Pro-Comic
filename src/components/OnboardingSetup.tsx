import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Sparkles, 
  ArrowRight, 
  CheckCircle, 
  Zap, 
  User, 
  Terminal, 
  Globe, 
  ShieldCheck, 
  Lock, 
  RefreshCw, 
  Key, 
  ChevronRight,
  Database,
  Check
} from 'lucide-react';

interface OnboardingSetupProps {
  onComplete: (email: string, targetJobUrl: string, mcpKeysApplied: boolean) => void;
  defaultEmail: string;
}

export default function OnboardingSetup({ onComplete, defaultEmail }: OnboardingSetupProps) {
  const [step, setStep] = useState<1 | 2 | 3 | 4>(1);
  
  // Setup data state
  const [selectedProfile, setSelectedProfile] = useState<'leah' | 'kai' | 'custom'>('leah');
  const [customEmail, setCustomEmail] = useState<string>('');
  const [targetJobUrl, setTargetJobUrl] = useState<string>('https://figma.com/careers/staff-designer');
  const [autoInjectSecrets, setAutoInjectSecrets] = useState<boolean>(true);
  
  // Background processing states
  const [progress, setProgress] = useState<number>(0);
  const [activeLogIndex, setActiveLogIndex] = useState<number>(0);
  const [logs, setLogs] = useState<string[]>([
    ' Initiating Firestore Zero-Trust Identity Guard rules...',
    '📥 Pulling chosen candidate baseline skills matrix...',
    '⚙️ Auto-injecting secure MCP Scraper endpoint credentials...',
    '🧠 Aligning master Recruiter rule-sets with Gemini 3 Pro caches...',
    ' Activating real-time Search Grounding trends...',
    ' Compiling perfect 99.2% ATS scoring layout weights...',
    ' Onboarding complete! Ready to enter dashboard.'
  ]);

  // Simulating 30-seconds / rapid automated setup agent work
  useEffect(() => {
    if (step === 3) {
      setProgress(0);
      setActiveLogIndex(0);
      const interval = setInterval(() => {
        setProgress(prev => {
          if (prev >= 100) {
            clearInterval(interval);
            setTimeout(() => {
              setStep(4);
            }, 800);
            return 100;
          }
          const nextVal = prev + Math.floor(Math.random() * 12) + 5;
          return Math.min(nextVal, 100);
        });
      }, 350);

      const logInterval = setInterval(() => {
        setActiveLogIndex(prev => {
          if (prev < logs.length - 1) {
            return prev + 1;
          }
          clearInterval(logInterval);
          return prev;
        });
      }, 500);

      return () => {
        clearInterval(interval);
        clearInterval(logInterval);
      };
    }
  }, [step]);

  // Handle final submission based on choices
  const handleFinalize = () => {
    let finalEmail = 'leah.design@gmail.com';
    if (selectedProfile === 'kai') {
      finalEmail = 'kai.explorer@gmail.com';
    } else if (selectedProfile === 'custom' && customEmail) {
      finalEmail = customEmail;
    } else if (selectedProfile === 'custom') {
      finalEmail = defaultEmail;
    }
    
    onComplete(finalEmail, targetJobUrl, autoInjectSecrets);
  };

  return (
    <div className="bg-[#09090b] border border-indigo-500/20 rounded-3xl overflow-hidden shadow-2xl p-6 md:p-8 relative max-w-2xl mx-auto w-full font-sans transition-all text-neutral-100" id="idiot-proof-wizard">
      
      {/* Background radial soft light flair */}
      <div className="absolute top-0 left-1/4 w-96 h-96 bg-indigo-500 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-indigo-500/5 rounded-full blur-3xl pointer-events-none" />
      
      {/* Header Wizard indicator */}
      <div className="flex items-center justify-between border-b border-white/5 pb-4 mb-6 relative z-10">
        <div className="flex items-center gap-1.5">
          <span className="w-2.5 h-2.5 bg-indigo-500 rounded-full animate-pulse" />
          <span className="text-[10px] font-mono font-bold uppercase tracking-wider text-white 500">
            RAPID SETUP WIZARD &bull; 30-SEC IDIOT-PROOF DESIGN
          </span>
        </div>
        {/* Modern high contrast dots */}
        <div className="flex items-center gap-2">
          {[1, 2, 3, 4].map(s => (
            <div 
              key={s} 
              className={`h-2 rounded-full transition-all duration-300 ${
                step === s 
                  ? 'w-6 bg-indigo-500' 
                  : step > s 
                    ? 'w-2 bg-emerald-500' 
                    : 'w-2 bg-slate-800'
              }`} 
            />
          ))}
        </div>
      </div>

      <AnimatePresence mode="wait">
        
        {/* SCREEN 1: Welcome + One Big Action */}
        {step === 1 && (
          <motion.div
            key="wizard-step-1"
            initial={{ opacity: 0, scale: 0.98 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.98 }}
            transition={{ duration: 0.3 }}
            className="text-center space-y-6 py-6"
          >
            {/* Pulsing Giant Icon in glowing circle */}
            <div className="mx-auto w-20 h-20 bg-indigo-500 border-2 border-indigo-500 rounded-full flex items-center justify-center shadow-lg relative">
              <Sparkles className="w-10 h-10 text-white 400 animate-pulse" />
              <div className="absolute -inset-1 rounded-full border border-indigo-500 animate-ping opacity-70 pointer-events-none" />
            </div>

            <div className="space-y-2">
              <h1 className="text-2xl md:text-3xl font-black text-white tracking-tight leading-none">
                Let's get you set up in <span className="text-white 400">30 seconds</span>
              </h1>
              <p className="text-xs text-neutral-400 max-w-md mx-auto leading-relaxed">
                Connect your professional details and unlock the elite Multi-Agent Career dashboard. We handle all backend database and API configuration in seconds.
              </p>
            </div>

            {/* High Contrast Direction Banner */}
            <div className="bg-[#030303] p-3.5 rounded-2xl border border-white/5 inline-flex items-center gap-3 max-w-sm mx-auto text-left">
              <span className="text-lg"></span>
              <span className="text-[10px] font-mono text-neutral-400 leading-relaxed uppercase">
                <b>THE 6-SECOND RULE APPROVED:</b> <br />
                Each screen has ZERO guessing. Click start to let agents configure your workspace automatically.
              </span>
            </div>

            {/* ONE BIG ACTION BUTTON */}
            <div className="pt-2">
              <button
                onClick={() => setStep(2)}
                className="group relative w-full max-w-sm mx-auto py-4 bg-gradient-to-r from-indigo-600 to-indigo-500 hover:from-indigo-500 hover:to-indigo-400 text-white font-black text-sm rounded-2xl transition-all shadow-xl hover:shadow-indigo-500 flex items-center justify-center gap-2 transform active:scale-98"
                id="onboarding-start-btn"
              >
                Start Instant Setup 
                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </button>
              <p className="text-[10px] text-neutral-400 font-serif italic mt-2.5">
                 Protected by Firebase Guard. We will handle the rest.
              </p>
            </div>
          </motion.div>
        )}

        {/* SCREEN 2: Connect / Input (the only real user work) */}
        {step === 2 && (
          <motion.div
            key="wizard-step-2"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            className="space-y-6"
          >
            <div className="text-center md:text-left">
              <span className="text-[9px] font-mono text-white 500 font-bold bg-indigo-500 px-2 py-0.5 rounded-full uppercase">
                STEP 2 OF 3: CONNECTIONS
              </span>
              <h2 className="text-xl font-bold text-white tracking-tight mt-1">
                Choose Identity & Target Job Spec
              </h2>
              <p className="text-xs text-neutral-400 mt-0.5">
                Select your candidate avatar and target listing. Agents will instantly pre-align your portfolio keys.
              </p>
            </div>

            {/* Clear indicated Visual Place for selection */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              
              {/* Profile Picker Badge Grid */}
              <div className="space-y-2">
                <label className="text-[9px] font-mono text-neutral-400 uppercase tracking-widest block font-bold">
                  1. CHOOSE YOUR IDENTITY:
                </label>
                <div className="grid grid-cols-2 gap-2">
                  <button
                    type="button"
                    onClick={() => setSelectedProfile('leah')}
                    className={`p-3 rounded-2xl border text-left transition-all flex flex-col justify-between h-[85px] relative overflow-hidden ${
                      selectedProfile === 'leah' 
                        ? 'bg-indigo-500 border-indigo-500 text-white' 
                        : 'bg-[#030303] border-white/5 text-neutral-400 hover:border-white/10'
                    }`}
                  >
                    <div className="flex justify-between items-start w-full">
                      <span className="text-lg"></span>
                      {selectedProfile === 'leah' && <span className="bg-indigo-500 text-white p-0.5 rounded-full"><Check className="w-2.5 h-2.5" /></span>}
                    </div>
                    <div>
                      <span className="text-[10px] font-black block leading-none">Leah Vance</span>
                      <span className="text-[8px] opacity-70 mt-0.5 block">Senior UX Designer</span>
                    </div>
                  </button>

                  <button
                    type="button"
                    onClick={() => setSelectedProfile('kai')}
                    className={`p-3 rounded-2xl border text-left transition-all flex flex-col justify-between h-[85px] relative overflow-hidden ${
                      selectedProfile === 'kai' 
                        ? 'bg-indigo-500 border-indigo-500 text-white' 
                        : 'bg-[#030303] border-white/5 text-neutral-400 hover:border-white/10'
                    }`}
                  >
                    <div className="flex justify-between items-start w-full">
                      <span className="text-lg"></span>
                      {selectedProfile === 'kai' && <span className="bg-indigo-500 text-neutral-400 p-0.5 rounded-full"><Check className="w-2.5 h-2.5" /></span>}
                    </div>
                    <div>
                      <span className="text-[10px] font-black block leading-none">Kai Rivers</span>
                      <span className="text-[8px] opacity-70 mt-0.5 block">Lead Full-Stack</span>
                    </div>
                  </button>
                </div>

                <div className="mt-1">
                  <button
                    type="button"
                    onClick={() => setSelectedProfile('custom')}
                    className={`w-full py-2 px-3 rounded-xl border text-xs text-left transition-all flex items-center justify-between ${
                      selectedProfile === 'custom'
                        ? 'bg-indigo-500 border-indigo-500 text-white font-bold'
                        : 'bg-[#030303] border-white/5 text-neutral-400 hover:border-white/10'
                    }`}
                  >
                    <span>👥 Log in as Custom Guest Profile</span>
                    <span className="text-[9px] font-mono opacity-80">Guest Mode</span>
                  </button>
                </div>

                {selectedProfile === 'custom' && (
                  <motion.div 
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: 'auto' }}
                    className="space-y-1 pt-1"
                  >
                    <input 
                      type="email"
                      value={customEmail}
                      onChange={(e) => setCustomEmail(e.target.value)}
                      placeholder="Enter guest email (e.g. guest@yahoo.com)"
                      className="w-full bg-[#030303] border border-white/10 rounded-xl px-2.5 py-2 text-[11px] text-white"
                    />
                  </motion.div>
                )}
              </div>

              {/* Target Job URL input field */}
              <div className="space-y-2 flex flex-col justify-between">
                <div>
                  <label className="text-[9px] font-mono text-neutral-400 uppercase tracking-widest block font-bold">
                    2. TARGET SPEC URL:
                  </label>
                  <div className="relative">
                    <input
                      type="text"
                      value={targetJobUrl}
                      onChange={(e) => setTargetJobUrl(e.target.value)}
                      placeholder="Paste LinkedIn or Careers page link..."
                      className="w-full bg-[#030303] border-2 border-white/10 focus:border-indigo-500 rounded-xl pl-8 pr-3 py-2.5 text-xs text-white outline-none transition-all"
                    />
                    <Globe className="w-3.5 h-3.5 text-neutral-400 absolute left-2.5 top-3.5" />
                  </div>
                  <span className="text-[9px] text-neutral-400 italic block mt-1">
                     Example link prefilled. Click inside to overwrite anytime.
                  </span>
                </div>

                {/* Auto Credentials Bind Toggle */}
                <div className="bg-[#030303] p-2.5 rounded-xl border border-white/5 flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Key className="w-4 h-4 text-white 500" />
                    <div>
                      <span className="text-[10px] font-bold text-white block">Auto-Hydrate Sandbox Keys</span>
                      <span className="text-[8px] text-neutral-400 block">Fills mock Gemini & Scraper secrets</span>
                    </div>
                  </div>
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input 
                      type="checkbox" 
                      className="sr-only peer" 
                      checked={autoInjectSecrets}
                      onChange={() => setAutoInjectSecrets(!autoInjectSecrets)}
                    />
                    <div className="w-8 h-4 bg-slate-800 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-slate-400 after:border-slate-300 after:border after:rounded-full after:h-3 after:w-3.5 after:transition-all peer-checked:bg-indigo-500 peer-checked:after:bg-[#030303]" />
                  </label>
                </div>
              </div>

            </div>

            {/* Step trigger with arrow */}
            <button
              onClick={() => setStep(3)}
              className="w-full py-3.5 bg-gradient-to-r from-indigo-600 to-indigo-400 hover:from-indigo-500 hover:to-indigo-500 text-neutral-400 font-black text-xs rounded-xl flex items-center justify-center gap-1.5 transition-all shadow-md active:scale-98"
            >
               Run Automated Setup Engine <ArrowRight className="w-4 h-4" />
            </button>
          </motion.div>
        )}

        {/* SCREEN 3: Interactive Progress Bar + Background Agent Logs */}
        {step === 3 && (
          <motion.div
            key="wizard-step-3"
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="space-y-6"
          >
            <div className="text-center">
              <span className="text-[9px] font-mono text-indigo-400 font-bold bg-indigo-500/10 px-2 py-0.5 rounded-full uppercase">
                STEP 3 OF 3: CORE DISPATCH
              </span>
              <h2 className="text-xl font-bold text-white mt-1">Configuring Your Ecosystem...</h2>
              <p className="text-xs text-neutral-400 mt-0.5">
                The agent is executing keys hydration and Firestore user schemas behind the scenes.
              </p>
            </div>

            {/* Graphical Progress Bar Indicator */}
            <div className="space-y-2">
              <div className="flex justify-between text-xs font-mono">
                <span className="text-white 500 font-black flex items-center gap-1">
                  <RefreshCw className="w-3.5 h-3.5 animate-spin" /> CONFIGURING RESOURCES
                </span>
                <span className="text-white font-bold">{progress}%</span>
              </div>
              <div className="h-3 bg-[#030303] rounded-full overflow-hidden border border-white/5 p-0.5">
                <motion.div 
                  className="h-full bg-gradient-to-r from-indigo-500 to-indigo-500 rounded-full"
                  initial={{ width: '0%' }}
                  animate={{ width: `${progress}%` }}
                  transition={{ ease: 'easeOut', duration: 0.1 }}
                />
              </div>
            </div>

            {/* Simulating Console background agent logger */}
            <div className="bg-[#030303] rounded-2xl border-2 border-white/5 p-4 relative font-mono text-[10px] space-y-1.5 h-[155px] overflow-hidden shadow-inner">
              <div className="absolute top-2 right-3 flex items-center gap-1 text-[8px] text-neutral-400 uppercase tracking-widest bg-[#030303] border border-white/5 px-2 py-0.5 rounded">
                <Terminal className="w-3 h-3 text-white 500 animate-pulse" /> Live Terminal
              </div>
              
              <div className="space-y-1 mt-2.5 overflow-hidden">
                {logs.slice(0, activeLogIndex + 1).map((log, lIdx) => {
                  const isCurrent = lIdx === activeLogIndex;
                  return (
                    <div 
                      key={lIdx} 
                      className={`flex items-start gap-1.5 transition-opacity duration-300 ${
                        isCurrent ? 'text-indigo-300 font-bold' : 'text-neutral-400 opacity-60'
                      }`}
                    >
                      <span className="text-neutral-400 font-bold">&raquo;</span>
                      <p className="truncate">{log}</p>
                    </div>
                  );
                })}
              </div>
            </div>
          </motion.div>
        )}

        {/* SCREEN 4: Confirmation screen */}
        {step === 4 && (
          <motion.div
            key="wizard-step-4"
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center space-y-6 py-6"
          >
            {/* Pulsing giant Checkmark */}
            <div className="mx-auto w-20 h-20 bg-emerald-500/10 border-2 border-emerald-500/40 rounded-full flex items-center justify-center shadow-lg relative">
              <motion.div
                initial={{ scale: 0.5, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ type: 'spring', stiffness: 200, damping: 10 }}
              >
                <CheckCircle className="w-11 h-11 text-emerald-400" />
              </motion.div>
              <div className="absolute -inset-1 rounded-full border border-emerald-400/20 animate-ping opacity-30 pointer-events-none" />
            </div>

            <div className="space-y-2">
              <h2 className="text-2xl font-bold text-white tracking-tight leading-none">
                Ecosystem Linked Successfully!
              </h2>
              <p className="text-xs text-neutral-400 max-w-sm mx-auto leading-relaxed">
                Your credentials are auto-synced. MCP nodes are active and the legendary 20-Year recruiter model holds coordinates for your target job spec.
              </p>
            </div>

            {/* Details Box */}
            <div className="bg-[#030303] p-4 rounded-2xl border border-white/5 space-y-2 text-left max-w-md mx-auto">
              <div className="flex justify-between items-center text-[10px] font-mono border-b border-white/5 pb-2">
                <span className="text-neutral-400">FIRESTORE SUITE BIND</span>
                <span className="text-emerald-400 font-bold flex items-center gap-1">
                  <ShieldCheck className="w-3.5 h-3.5" /> SECURE CONFIGURED
                </span>
              </div>
              <div className="grid grid-cols-2 gap-y-1.5 text-[10px] font-mono pt-1 text-neutral-400">
                <span>Active Profile:</span>
                <span className="text-right text-white font-bold">{selectedProfile === 'leah' ? 'Leah Vance (UX)' : selectedProfile === 'kai' ? 'Kai Rivers (Full-Stack)' : 'Custom Guest'}</span>
                <span>Active Spec:</span>
                <span className="text-right text-white 400 font-bold truncate max-w-[130px] inline-block self-end">{targetJobUrl.replace('https://', '')}</span>
                <span>Swarm Status:</span>
                <span className="text-right text-emerald-400 font-bold">5 Connectors Ready</span>
              </div>
            </div>

            {/* LAUNCH BUTTON */}
            <button
              onClick={handleFinalize}
              className="w-full max-w-sm mx-auto py-4 bg-gradient-to-r from-emerald-600 to-emerald-500 hover:from-emerald-500 hover:to-emerald-400 text-white shadow-emerald-500/20 font-black text-sm rounded-2xl transition-all shadow-xl hover:shadow-emerald-500/10 flex items-center justify-center gap-1 transform active:scale-98"
            >
              Enter Executive Dashboard <ChevronRight className="w-4 h-4 ml-1" />
            </button>
          </motion.div>
        )}

      </AnimatePresence>

    </div>
  );
}
