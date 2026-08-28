import React, { useState, useEffect, useRef } from 'react';
import Confetti from 'react-confetti';
import gsap from 'gsap';
import { useGSAP } from '@gsap/react';
import { motion, AnimatePresence } from 'motion/react';
import { UserState, TutorialStep } from './types';
import { panelsData } from './data';
import ComicPanel from './components/ComicPanel';
import InteractiveSandbox from './components/InteractiveSandbox';
import CareerSuite from './components/CareerSuite';
import WatercolorEffect, { SplatterDecor } from './components/WatercolorEffect';
import { Info, HelpCircle, CornerDownRight, ArrowRight, BookOpen, Compass, RotateCcw, Layout, Briefcase, FileText, Volume2, VolumeX, Printer, Award, PenSquare, Keyboard, X } from 'lucide-react';

gsap.registerPlugin(useGSAP);

export default function App() {
  const [activeAppMode, setActiveAppMode] = useState<'career' | 'comic'>('career');
  const [userState, setUserState] = useState<UserState>({
    modelSelected: 'Gemini 2.5 Flash',
    thinkingEnabled: false,
    selfieImage: null,
    conceptSelected: null,
    promptText: '',
    currentStep: TutorialStep.MODEL_SELECTION,
  });

  const [ambientAudioEnabled, setAmbientAudioEnabled] = useState(false);
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const progressRailRef = useRef<HTMLDivElement>(null);
  
  const [showKeyboardShortcuts, setShowKeyboardShortcuts] = useState(true);
  const [showNotesPanel, setShowNotesPanel] = useState(false);
  const [notesText, setNotesText] = useState('');
  
  const [showAchievement, setShowAchievement] = useState(false);

  useEffect(() => {
    if (!audioRef.current) {
      audioRef.current = new Audio('https://assets.mixkit.co/active_storage/sfx/2568/2568-preview.mp3');
      audioRef.current.volume = 0.3;
    }

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.ctrlKey && e.key === 'm') setActiveAppMode(prev => prev === 'career' ? 'comic' : 'career');
      if (e.ctrlKey && e.key === 'n') setShowNotesPanel(prev => !prev);
      if (e.key === 'ArrowRight') {
        setUserState(prev => prev.currentStep < 4 ? { ...prev, currentStep: prev.currentStep + 1 } : prev);
        triggerSound();
      }
      if (e.key === 'ArrowLeft') {
        setUserState(prev => prev.currentStep > 0 ? { ...prev, currentStep: prev.currentStep - 1 } : prev);
        triggerSound();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  const triggerSound = () => {
    if (ambientAudioEnabled && audioRef.current) {
        audioRef.current.currentTime = 0;
        audioRef.current.play().catch(() => {});
    }
  }

  useGSAP(() => {
    if (activeAppMode === 'comic' && progressRailRef.current) {
      const upcomingElems = document.querySelectorAll('.upcoming-step-pulse');
      if (upcomingElems.length > 0) {
        gsap.to(upcomingElems, {
          scale: 1.05,
          yoyo: true,
          repeat: -1,
          duration: 0.8,
          ease: "sine.inOut"
        });
      }
    }
  }, [userState.currentStep, activeAppMode]);

  const handleUpdateState = (updater: Partial<UserState> | ((prev: UserState) => UserState)) => {
    if (typeof updater === 'function') {
      setUserState(prev => updater(prev));
    } else {
      setUserState(prev => ({ ...prev, ...updater }));
    }
  };

  const currentPanel = panelsData.find(p => p.id === userState.currentStep) || panelsData[0];

  const handleSetStep = (step: TutorialStep) => {
    setUserState(prev => ({ ...prev, currentStep: step }));
    triggerSound();
  };

  const isComicComplete = userState.currentStep === TutorialStep.EDIT_AND_FINALIZE;

  return (
    <div className={`min-h-screen relative py-8 px-4 sm:px-6 lg:px-8 overflow-x-hidden selection:bg-indigo-500/30 ${activeAppMode === 'career' ? 'bg-[#000000] text-neutral-200' : 'bg-[#F7F5EE] text-slate-800'}`}>
      <style dangerouslySetInnerHTML={{__html: `
        @media print {
          body { background: white !important; padding: 0 !important; margin: 0 !important; }
          #comic-panel-container { 
             border: 6px solid #fcd34d !important;
             border-radius: 12px;
             box-shadow: none !important;
             break-inside: avoid;
             margin: 20px auto !important;
             page-break-after: always;
          }
          #workspace-mode-selector, #app-header-container, #progress-rail-container, #app-footer-guide, #comic-narrative-panel, #interactive-sandbox-container {
             display: none !important;
          }
          #comic-panel-container::after {
             content: " Designed in Nano Banana Pro";
             position: absolute;
             bottom: -25px;
             right: 0;
             font-family: monospace;
             font-size: 10px;
             color: #92400e;
             font-weight: bold;
          }
        }
      `}} />

      {isComicComplete && activeAppMode === 'comic' && (
        <Confetti
          width={window.innerWidth}
          height={window.innerHeight}
          recycle={false}
          numberOfPieces={400}
          gravity={0.15}
          style={{ zIndex: 90 }}
        />
      )}

      {/* Achievement Modal */}
      <AnimatePresence>
        {showAchievement && (
          <motion.div 
            initial={{ opacity: 0 }} 
            animate={{ opacity: 1 }} 
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[100] flex items-center justify-center bg-slate-950/60 backdrop-blur-sm p-4 print:hidden"
          >
            <motion.div 
              initial={{ scale: 0.9, y: 20 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.9, y: 20 }}
              className="bg-white p-8 rounded-3xl max-w-md w-full border-4 border-amber-200 relative overflow-hidden shadow-2xl"
            >
              <button onClick={() => setShowAchievement(false)} className="absolute top-4 right-4 p-2 bg-slate-100 rounded-full text-slate-500 hover:text-slate-800"><X className="w-4 h-4" /></button>
              
              <div className="text-center space-y-4">
                <div className="w-20 h-20 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mx-auto mb-4 border-4 border-emerald-200">
                  <Award className="w-10 h-10" />
                </div>
                <h2 className="text-2xl font-black font-sans text-slate-800">Creative Maestro</h2>
                <div className="text-slate-500 text-sm font-serif italic leading-relaxed">
                  You have successfully orchestrated a flawless, multi-step artistic workflow using Gemini Thinking technology.
                </div>
                
                <div className="bg-slate-50 p-4 rounded-xl border border-slate-100 text-left space-y-2 mt-6">
                  <div className="font-mono text-[10px] text-slate-400 font-bold tracking-wider">ACHIEVEMENT METADATA</div>
                  <div className="flex justify-between items-center text-xs">
                    <span className="text-slate-600">Model Selected:</span>
                    <span className="font-bold">{userState.modelSelected}</span>
                  </div>
                  <div className="flex justify-between items-center text-xs">
                    <span className="text-slate-600">Theme Mastered:</span>
                    <span className="font-bold">{userState.conceptSelected || 'Aesthetic Wildcard'}</span>
                  </div>
                </div>

                <button onClick={() => setShowAchievement(false)} className="w-full mt-6 bg-amber-500 hover:bg-amber-400 transition-colors text-amber-950 py-3 rounded-xl font-bold font-mono text-sm">
                  Close & Continue
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Collapsible Keyboard Shortcuts */}
      <div className="fixed bottom-4 left-4 z-40 print:hidden hidden sm:block">
        <motion.div 
          className={`bg-slate-900 text-slate-300 text-[10px] font-mono rounded-xl border border-white/10 shadow-xl overflow-hidden transition-all ${showKeyboardShortcuts ? 'w-60' : 'w-10 h-10'}`}
        >
          {showKeyboardShortcuts ? (
            <div className="p-3">
              <div className="flex items-center justify-between border-b border-white/10 pb-2 mb-2">
                <span className="font-bold text-amber-400 flex items-center gap-1.5"><Keyboard className="w-3.5 h-3.5" /> SYSTEM HOTKEYS</span>
                <button onClick={() => setShowKeyboardShortcuts(false)} className="text-slate-500 hover:text-slate-300"><X className="w-3.5 h-3.5" /></button>
              </div>
              <ul className="space-y-2 opacity-90 mt-2">
                <li className="flex justify-between items-center"><span>Switch App Mode</span><span className="bg-slate-800 px-1.5 py-0.5 rounded text-white font-bold tracking-wider text-[9px]">CTRL+M</span></li>
                <li className="flex justify-between items-center"><span>Toggle Note Pad</span><span className="bg-slate-800 px-1.5 py-0.5 rounded text-white font-bold tracking-wider text-[9px]">CTRL+N</span></li>
                <li className="flex justify-between items-center"><span>Next Step Mode</span><span className="bg-slate-800 px-1.5 py-0.5 rounded text-white font-bold tracking-wider text-[9px]">→ KEY</span></li>
                <li className="flex justify-between items-center"><span>Prev Step Mode</span><span className="bg-slate-800 px-1.5 py-0.5 rounded text-white font-bold tracking-wider text-[9px]">← KEY</span></li>
              </ul>
            </div>
          ) : (
            <button onClick={() => setShowKeyboardShortcuts(true)} className="w-full h-full flex items-center justify-center text-slate-400 hover:text-amber-400 bg-slate-950" title="Keyboard Shortcuts">
              <Keyboard className="w-4 h-4" />
            </button>
          )}
        </motion.div>
      </div>

      {/* Quick Notes FAB */}
      <div className="fixed bottom-4 right-4 z-40 print:hidden">
        {showNotesPanel ? (
          <motion.div 
            initial={{ opacity: 0, y: 20, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            className="bg-amber-50 w-72 h-80 rounded-2xl shadow-xl border border-amber-900/10 flex flex-col overflow-hidden"
          >
            <div className="bg-amber-200/50 p-3 flex justify-between items-center border-b border-amber-900/10">
              <div className="flex items-center gap-1.5 text-xs font-bold text-amber-950 font-mono">
                <PenSquare className="w-3.5 h-3.5" /> QUICK NOTES
              </div>
              <button onClick={() => setShowNotesPanel(false)} className="p-1 hover:bg-amber-300/30 rounded transition-colors text-amber-900">
                <X className="w-4 h-4" />
              </button>
            </div>
            <textarea 
              value={notesText}
              onChange={(e) => setNotesText(e.target.value)}
              placeholder="Jot down prompt ideas, specific aesthetic styles, or technical notes. These persist as you navigate..."
              className="flex-1 w-full bg-transparent p-4 outline-none resize-none font-serif text-sm text-slate-700 placeholder:text-amber-900/30"
            />
          </motion.div>
        ) : (
          <button 
            onClick={() => setShowNotesPanel(true)}
            className="w-12 h-12 bg-amber-500 hover:bg-amber-400 text-slate-950 rounded-full flex items-center justify-center shadow-lg hover:shadow-xl transition-all hover:-translate-y-1"
            title="Open Quick Notes"
          >
            <PenSquare className="w-5 h-5" />
          </button>
        )}
      </div>

      {/* SVG Watercolor and Ink Bleed Definitions */}
      <WatercolorEffect />
      
      {/* Visual background bleeding splatters */}
      <SplatterDecor />

      {/* Main Container */}
      <div className="max-w-7xl mx-auto space-y-8 relative z-10">
        
        {/* Workspace Switcher Header Panel */}
        <div className="flex justify-center mb-4" id="workspace-mode-selector">
          <div className={`p-1.5 rounded-2xl border flex flex-wrap items-center justify-center gap-2 shadow-sm font-sans ${activeAppMode === 'career' ? 'bg-[#09090b]/80 border-white/[0.05]' : 'bg-white/80 border-amber-900/10'}`}>
            <button
              onClick={() => { setActiveAppMode('career'); triggerSound(); }}
              className={`px-5 py-2.5 rounded-xl font-bold text-xs flex items-center gap-2 transition-all ${
                activeAppMode === 'career' 
                  ? 'bg-neutral-800 text-white shadow-md scale-102 border border-white/[0.1]' 
                  : 'text-slate-500 hover:text-slate-800 hover:bg-amber-50/50'
              }`}
            >
              <Briefcase className="w-4 h-4" />  AI Career Suite & MCP
            </button>
            <button
              onClick={() => { setActiveAppMode('comic'); triggerSound(); }}
              className={`px-5 py-2.5 rounded-xl font-bold text-xs flex items-center gap-2 transition-all ${
                activeAppMode === 'comic' 
                  ? 'bg-amber-500 text-slate-950 shadow-md scale-102' 
                  : 'text-neutral-500 hover:text-white hover:bg-white/[0.05]'
              }`}
            >
              <Layout className="w-4 h-4" /> 🎨 Poetic Comic Storyboard
            </button>
            
            <div className={`h-6 w-px mx-1 hidden sm:block ${activeAppMode === 'career' ? 'bg-white/[0.1]' : 'bg-amber-900/10'}`} />
            
            <div className="flex items-center gap-1.5">
              <button
                onClick={() => { setAmbientAudioEnabled(!ambientAudioEnabled); triggerSound(); }}
                className={`p-2.5 rounded-xl transition-all font-mono text-[9px] font-bold flex items-center gap-1 border ${
                  activeAppMode === 'career'
                    ? ambientAudioEnabled ? 'bg-indigo-500/20 border-indigo-500/30 text-indigo-400' : 'bg-[#030303] border-white/[0.1] text-neutral-500 hover:text-neutral-300'
                    : ambientAudioEnabled ? 'bg-indigo-100/50 border-indigo-200 text-indigo-700' : 'bg-slate-50 border-slate-200 text-slate-400 hover:text-slate-600'
                }`}
                title="Toggle Ambient Sound"
              >
                {ambientAudioEnabled ? <Volume2 className="w-3.5 h-3.5" /> : <VolumeX className="w-3.5 h-3.5" />}
              </button>
              
              {activeAppMode === 'comic' && (
                <button
                  onClick={() => window.print()}
                  className="p-2.5 rounded-xl border border-amber-200/50 bg-amber-50/80 text-amber-700 hover:bg-amber-100 transition-all font-mono text-[9px] font-bold flex items-center gap-1 print:hidden"
                  title="Export to Aesthetic PDF"
                >
                  <Printer className="w-3.5 h-3.5" />
                  <span className="hidden sm:inline">EXPORT PDF</span>
                </button>
              )}
            </div>
          </div>
        </div>
        
        {/* Header Header */}
        <header className="text-center space-y-4 max-w-3xl mx-auto" id="app-header-container">
          <div className={`inline-flex items-center gap-2 px-3 py-1 border rounded-full text-xs font-bold font-mono tracking-tight transition-all ${
            activeAppMode === 'career' 
              ? 'bg-indigo-500/10 border-indigo-500/20 text-indigo-400' 
              : 'bg-amber-100 hover:bg-amber-200/80 border-amber-950/10 text-amber-900/80'
          }`}>
            <span>{activeAppMode === 'career' ? '● SYS.ACTIVE: TELEMETRY OPS' : ' Active: Comic Storyboard Guide'}</span>
          </div>
          
          <h1 className={`text-3xl sm:text-4xl lg:text-5xl font-black tracking-tight leading-none ${activeAppMode === 'career' ? 'font-mono text-white tracking-widest' : 'font-sans text-slate-900'} flex flex-wrap justify-center items-center gap-x-3 gap-y-2`}>
            {activeAppMode === 'career' ? (
              <>NBP<span className="text-indigo-500">//</span>OPS_CENTER</>
            ) : (
              <>Workspace of <span className="text-amber-600 bg-amber-100/50 px-2 py-0.5 rounded-2xl border border-amber-900/10 font-black italic">Nano Banana Pro 🍌</span></>
            )}
          </h1>
          
          <p className={`text-sm font-medium leading-relaxed max-w-2xl mx-auto ${
            activeAppMode === 'career' 
              ? 'text-neutral-500 font-mono tracking-wide' 
              : 'text-slate-500 font-serif italic'
          }`}>
            {activeAppMode === 'career' 
              ? 'Candidate Identity Matrix & ATS Exploitation Node. Utilizing targeted grounding and multi-agent payload delivery.'
              : 'A playful, poetic comic strip tutorial on how to use Gemini’s "Thinking with 3 Pro" model to transform your selfie into beautiful, hand-drawn watercolor-ink illustration work.'}
          </p>
        </header>

        {activeAppMode === 'career' ? (
          /* WORKSPACE MAIN PAGE: CAREER AND MCP PLATFORM */
          <motion.div
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <CareerSuite />
          </motion.div>
        ) : (
          /* WORKSPACE SECONDARY PAGE: THE COMIC STUDY */
          <motion.div
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="space-y-8"
          >
            {/* Global Progress Track Rail */}
            <div ref={progressRailRef} className="bg-white/80 backdrop-blur border-2 border-amber-900/10 p-3 rounded-2xl max-w-4xl mx-auto flex flex-col md:flex-row items-center justify-between gap-4 shadow-sm relative z-50 print:hidden" id="progress-rail-container">
              <div className="flex items-center gap-2 text-xs font-bold text-amber-950/70 font-mono">
                <BookOpen className="w-4 h-4 text-amber-700" />
                <span>TUTORIAL TIMELINE:</span>
              </div>
              <div className="flex-1 flex items-center justify-between gap-1 w-full max-w-xl">
                {panelsData.map((panel, idx) => {
                  const isActive = userState.currentStep === panel.id;
                  const isCompleted = userState.currentStep > panel.id;
                  const isNext = panel.id === userState.currentStep + 1;
                  return (
                    <button
                      key={panel.id}
                      onClick={() => handleSetStep(panel.id)}
                      className={`flex-1 flex flex-col items-stretch group relative ${isNext ? 'upcoming-step-pulse z-20' : 'z-10'}`}
                    >
                      <div className={`h-2.5 rounded-full transition-all duration-300 relative ${
                        isActive 
                          ? 'bg-amber-500 ring-4 ring-amber-100 z-10' 
                          : isCompleted 
                            ? 'bg-emerald-500' 
                            : isNext ? 'bg-amber-300 ring-2 ring-amber-200 cursor-pointer' : 'bg-slate-200 hover:bg-slate-300'
                      }`} />
                      <span className={`text-[9px] font-bold text-center mt-1 font-mono truncate transition-all ${
                        isActive 
                          ? 'text-amber-800 scale-105' 
                          : isCompleted 
                            ? 'text-emerald-700' 
                            : isNext ? 'text-amber-600' : 'text-slate-400 group-hover:text-slate-600'
                      }`}>
                        P{idx + 1}: {panel.shortDesc.split(' ')[0]}
                      </span>

                      {/* Explicit Tooltip on hover */}
                      <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 w-48 p-2.5 bg-slate-900 text-white text-[10px] rounded-lg opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 pointer-events-none z-[60] shadow-xl border border-white/10">
                        <div className="font-bold font-sans text-amber-400 mb-0.5">{panel.title}</div>
                        <div className="font-mono text-slate-300 leading-relaxed">{panel.shortDesc}</div>
                        <div className="absolute top-full left-1/2 -translate-x-1/2 border-4 border-transparent border-t-slate-900" />
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>
            
            {/* Share Achievement Prompt (only when complete) */}
            <div className="w-full max-w-4xl mx-auto flex justify-end print:hidden -mt-5">
              <AnimatePresence>
                {isComicComplete && (
                  <motion.button
                    initial={{ opacity: 0, scale: 0.8, y: -10 }}
                    animate={{ opacity: 1, scale: 1, y: 0 }}
                    onClick={() => setShowAchievement(true)}
                    className="flex items-center gap-2 bg-emerald-600 hover:bg-emerald-500 text-white px-4 py-2 rounded-xl text-xs font-bold font-mono shadow-lg transition-all relative z-50 hover:-translate-y-1 hover:shadow-emerald-500/30"
                  >
                     <Award className="w-4 h-4" /> Unlocked: Creative Maestro (View Card)
                  </motion.button>
                )}
              </AnimatePresence>
            </div>

            {/* Dual Column Layout: Comic Panel (Left) vs Simulator Playfield (Right) */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-stretch pt-2">
              
              {/* LEFT: Comic Storyboard Viewer (7-cols) */}
              <section className="lg:col-span-7 flex flex-col h-full" aria-label="Comic Tutorial Panel">
                <ComicPanel 
                  panel={currentPanel} 
                  userState={userState}
                  onSetStep={handleSetStep}
                />
              </section>

              {/* RIGHT: Gemini Smartphone Playfield (5-cols) */}
              <section className="lg:col-span-5 flex flex-col h-full" aria-label="Interactive Sandbox" id="interactive-sandbox-container">
                <InteractiveSandbox 
                  userState={userState}
                  onChangeState={handleUpdateState}
                />
              </section>

            </div>
          </motion.div>
        )}

        {/* Informational Guidance Section / User Guide details */}
        <footer className={`max-w-4xl mx-auto p-6 border rounded-2xl space-y-4 shadow-sm print:hidden ${
          activeAppMode === 'career' ? 'bg-[#09090b] border-white/[0.05]' : 'bg-white/60 border-amber-900/10'
        }`} id="app-footer-guide">
          <div className={`flex items-center gap-2 font-bold font-mono text-xs ${activeAppMode === 'career' ? 'text-indigo-400' : 'text-amber-950'}`}>
            <Info className={`w-4 h-4 font-bold ${activeAppMode === 'career' ? 'text-indigo-500' : 'text-amber-700'}`} />
            <span>HOW TO COMPLETE THIS WORKSPACE:</span>
          </div>
          <div className={`grid grid-cols-1 md:grid-cols-2 gap-4 text-xs font-medium leading-relaxed ${activeAppMode === 'career' ? 'font-mono text-neutral-400' : 'font-serif text-slate-600'}`}>
            <div className={`space-y-1.5 p-3.5 rounded-xl border transition-all cursor-default ${
              activeAppMode === 'career' ? 'bg-[#030303] border-white/[0.05] hover:border-indigo-500/20' : 'bg-amber-50/40 border-amber-900/5 hover:border-amber-900/20'
            }`}>
              <strong className={`font-sans font-bold block mb-1 ${activeAppMode === 'career' ? 'text-white' : 'text-slate-800'}`}> SYS: Career Telemetry Module</strong>
              Operate as Global Admin to approve identity injection, trigger targeted node scrapers, bind secure credentials, and compile 99% accuracy ATS matrix schemas.
            </div>
            <div className={`space-y-1.5 p-3.5 rounded-xl border transition-all cursor-default ${
              activeAppMode === 'career' ? 'bg-[#030303] border-white/[0.05] hover:border-indigo-500/20' : 'bg-indigo-50/30 border-indigo-900/5 hover:border-indigo-900/20'
            }`}>
              <strong className={`font-sans font-bold block mb-1 ${activeAppMode === 'career' ? 'text-white' : 'text-slate-800'}`}>🎨 SYS: Legacy Comic Mode</strong>
              Secondary artistic rendering loop. Walk through localized watercolor comic grids depicting precise UI/UX interaction vectors.
            </div>
          </div>
          <div className={`pt-2 text-center text-[10px] font-bold font-mono ${activeAppMode === 'career' ? 'text-neutral-600' : 'text-slate-400'}`}>
            &copy; {new Date().getFullYear()} NBP SYSTEM KERNEL &bull; SECURE MULTI-AGENT ORCHESTRATION ENGINES
          </div>
        </footer>

      </div>
    </div>
  );
}


