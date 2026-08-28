import React from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { PanelData, TutorialStep, UserState } from '../types';
import { Sparkles, Camera, HelpCircle, Palette, CheckCircle2 } from 'lucide-react';

interface ComicPanelProps {
  panel: PanelData;
  userState: UserState;
  onSetStep: (step: TutorialStep) => void;
}

export default function ComicPanel({ panel, userState, onSetStep }: ComicPanelProps) {
  // Render a custom watercolor SVG-style scene for each step
  const renderComicScene = () => {
    switch (panel.id) {
      case TutorialStep.MODEL_SELECTION:
        return (
          <div className="relative w-full h-full flex flex-col items-center justify-center bg-slate-50 overflow-hidden">
            {/* Soft bleeding watercolors */}
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-64 h-64 bg-amber-200/40 rounded-full blur-3xl mix-blend-multiply filter" />
            <div className="absolute -top-10 left-10 w-48 h-48 bg-blue-100/40 rounded-full blur-3xl mix-blend-multiply filter" />
            
            {/* SVG Illustration */}
            <svg viewBox="0 0 400 250" className="w-[85%] h-auto z-10 drop-shadow-sm filter" style={{ filter: 'url(#sketch-ink)' }}>
              {/* Device frame */}
              <rect x="130" y="20" width="140" height="210" rx="16" fill="#f8fafc" stroke="#64748b" strokeWidth="3" />
              <rect x="135" y="25" width="130" height="200" rx="12" fill="#ffffff" />
              
              {/* Screen components */}
              <rect x="145" y="45" width="110" height="32" rx="6" fill="#f1f5f9" stroke="#94a3b8" strokeWidth="1.5" strokeDasharray="3,3" />
              <text x="200" y="65" textAnchor="middle" fill="#475569" fontSize="10" fontWeight="bold" fontFamily="monospace">Choose your Model</text>
              
              {/* Selected Model indicator */}
              <g transform="translate(0, 10)">
                <rect x="150" y="80" width="100" height="24" rx="4" fill="#fef08a" stroke="#ca8a04" strokeWidth="1.5" />
                <text x="200" y="95" textAnchor="middle" fill="#854d0e" fontSize="9" fontWeight="bold">🍌 Thinking with 3 Pro</text>
              </g>
              
              {/* Checkbox */}
              <rect x="155" y="130" width="10" height="10" rx="2" fill="#ca8a04" stroke="#854d0e" strokeWidth="1.5" />
              <path d="M 157 135 L 159 137 L 163 133" stroke="#ffffff" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" fill="none" />
              <text x="171" y="138" fill="#334155" fontSize="8" fontFamily="monospace">Thinking with 3 Pro</text>

              {/* Hand painted active brush cursor tapping the main button */}
              <g transform="translate(140, 155)">
                <rect x="10" y="10" width="100" height="28" rx="6" fill={userState.modelSelected === 'Thinking with 3 Pro' && userState.thinkingEnabled ? '#eab308' : '#cbd5e1'} stroke="#854d0e" strokeWidth="2" />
                <text x="60" y="27" textAnchor="middle" fill="#1e293b" fontSize="10" fontWeight="bold">🍌 Create image</text>
              </g>

              {/* Painted tapping hand */}
              <path d="M 230,220 C 220,195 210,185 200,180 L 195,190 L 192,175 L 180,188 L 190,198 C 185,202 210,230 230,235 Z" fill="#ffedd5" stroke="#7c2d12" strokeWidth="1.5" />
              <circle cx="192" cy="175" r="5" fill="#ca8a04" opacity="0.3" className="animate-ping" />
            </svg>

            {/* Watercolor border masking */}
            <div className="absolute inset-0 border-[12px] border-[#FCFCFA] pointer-events-none" />
          </div>
        );

      case TutorialStep.ADD_SELFIE:
        return (
          <div className="relative w-full h-full flex flex-col items-center justify-center bg-[#FDFCFA] overflow-hidden">
            {/* Background bleed */}
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-72 h-72 bg-rose-100/40 rounded-full blur-3xl filter" />
            <div className="absolute bottom-4 right-10 w-40 h-40 bg-orange-100/50 rounded-full blur-2xl filter" />
            
            <svg viewBox="0 0 400 250" className="w-[85%] h-auto z-10" style={{ filter: 'url(#sketch-ink)' }}>
              {/* Polaroid Frame */}
              <g transform="translate(125, 20)">
                <rect x="0" y="0" width="150" height="185" fill="#ffffff" stroke="#cbd5e1" strokeWidth="2" rx="4" className="drop-shadow-sm" />
                {/* Photo Area */}
                <rect x="12" y="12" width="126" height="126" fill="#fee2e2" />
                
                {/* Simulated Selfie Subject (Watercolor look) */}
                {userState.selfieImage ? (
                  <image href={userState.selfieImage} x="12" y="12" width="126" height="126" preserveAspectRatio="xMidYMid slice" />
                ) : (
                  <g transform="translate(75, 75)">
                    {/* Face circle */}
                    <circle cx="0" cy="0" r="32" fill="#ffedd5" stroke="#c2410c" strokeWidth="1.5" />
                    {/* Cheerful hair */}
                    <path d="M -35 -10 Q -15 -45 35 -10 Q 40 10 32 25 Q -10 15 -32 20 Z" fill="#b45309" />
                    {/* Eyes & smile */}
                    <ellipse cx="-10" cy="-4" rx="2" ry="3" fill="#334155" />
                    <ellipse cx="10" cy="-4" rx="2" ry="3" fill="#334155" />
                    <path d="M -8 10 Q 0 18 8 10" stroke="#334155" strokeWidth="2" strokeLinecap="round" fill="none" />
                    {/* Rosy cheeks */}
                    <circle cx="-16" cy="6" r="5" fill="#fecdd3" opacity="0.8" />
                    <circle cx="16" cy="6" r="5" fill="#fecdd3" opacity="0.8" />
                    {/* Camera icon overlay prompt */}
                    <g transform="translate(-12, -45) scale(0.8)" fill="#ef4444">
                      <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z"/>
                    </g>
                  </g>
                )}
                
                {/* Title */}
                <text x="75" y="165" textAnchor="middle" fill="#1e293b" fontSize="10" fontWeight="bold" fontFamily="monospace">✨ Cheerful Me ✨</text>
              </g>

              {/* Little cute watercolor camera indicator */}
              <g transform="translate(260, 160)" className={userState.selfieImage ? "" : "animate-bounce"}>
                <circle cx="20" cy="20" r="24" fill="#f43f5e" stroke="#9f1239" strokeWidth="2" />
                <path d="M 12,15 L 28,15 L 28,27 L 12,27 Z" fill="none" stroke="#ffffff" strokeWidth="2" />
                <circle cx="20" cy="21" r="4" fill="none" stroke="#ffffff" strokeWidth="2" />
                <circle cx="25" cy="18" r="1.5" fill="#ffffff" />
              </g>
            </svg>

            <div className="absolute inset-0 border-[12px] border-[#FCFCFA] pointer-events-none" />
          </div>
        );

      case TutorialStep.CHOOSE_CONCEPT:
        return (
          <div className="relative w-full h-full flex flex-col items-center justify-center bg-[#FDFCFA] overflow-hidden">
            {/* Watercolor purple-indigo bleed */}
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-80 h-80 bg-indigo-100/40 rounded-full blur-3xl filter" />
            
            <svg viewBox="0 0 400 250" className="w-[85%] h-auto z-10" style={{ filter: 'url(#sketch-ink)' }}>
              {/* Person thinking */}
              <g transform="translate(60, 100)">
                <ellipse cx="40" cy="90" rx="30" ry="12" fill="#e2e8f0" stroke="#475569" strokeWidth="1.5" />
                <circle cx="40" cy="45" r="22" fill="#ffedd5" stroke="#9a3412" strokeWidth="1.5" />
                <path d="M 15,42 Q 30,55 40,48" stroke="#9a3412" strokeWidth="1.5" fill="none" />
                {/* Hand on chin */}
                <path d="M 38,62 Q 25,75 5,55" stroke="#9a3412" strokeWidth="1.5" fill="none" />
                {/* Eye shut thinking */}
                <path d="M 32,38 Q 36,35 40,38" stroke="#334155" strokeWidth="2" fill="none" />
                <text x="35" y="20" fill="#e11d48" fontSize="12">💭</text>
              </g>

              {/* Thought bubbles leading up */}
              <circle cx="150" cy="110" r="6" fill="#e0e7ff" stroke="#4338ca" strokeWidth="1" />
              <circle cx="180" cy="85" r="10" fill="#e0e7ff" stroke="#4338ca" strokeWidth="1" />

              {/* Option 1: Plushie */}
              <g transform="translate(190, 20)" className={`cursor-pointer transition-all ${userState.conceptSelected === 'plushie' ? 'scale-105' : 'opacity-70 hover:opacity-100'}`} onClick={() => onSetStep(TutorialStep.CHOOSE_CONCEPT)}>
                <rect x="0" y="0" width="85" height="55" rx="8" fill="#fdf2f8" stroke={userState.conceptSelected === 'plushie' ? '#db2777' : '#9d174d'} strokeWidth="2" />
                <text x="42" y="20" textAnchor="middle" fontSize="15">🧸</text>
                <text x="42" y="44" textAnchor="middle" fill="#9d174d" fontSize="9" fontWeight="bold" fontFamily="monospace">Plushie</text>
                {userState.conceptSelected === 'plushie' && <circle cx="75" cy="10" r="6" fill="#db2777" />}
              </g>

              {/* Option 2: Mohawk */}
              <g transform="translate(290, 80)" className={`cursor-pointer transition-all ${userState.conceptSelected === 'mohawk' ? 'scale-105' : 'opacity-70 hover:opacity-100'}`} onClick={() => onSetStep(TutorialStep.CHOOSE_CONCEPT)}>
                <rect x="0" y="0" width="85" height="55" rx="8" fill="#faf5ff" stroke={userState.conceptSelected === 'mohawk' ? '#7c3aed' : '#5b21b6'} strokeWidth="2" />
                <text x="42" y="20" textAnchor="middle" fontSize="15">🤘🦹</text>
                <text x="42" y="44" textAnchor="middle" fill="#5b21b6" fontSize="9" fontWeight="bold" fontFamily="monospace">Mohawk</text>
                {userState.conceptSelected === 'mohawk' && <circle cx="75" cy="10" r="6" fill="#7c3aed" />}
              </g>

              {/* Option 3: Figurine */}
              <g transform="translate(200, 150)" className={`cursor-pointer transition-all ${userState.conceptSelected === 'figurine' ? 'scale-105' : 'opacity-70 hover:opacity-100'}`} onClick={() => onSetStep(TutorialStep.CHOOSE_CONCEPT)}>
                <rect x="0" y="0" width="85" height="55" rx="8" fill="#eff6ff" stroke={userState.conceptSelected === 'figurine' ? '#2563eb' : '#1e40af'} strokeWidth="2" />
                <text x="42" y="20" textAnchor="middle" fontSize="15">🤖🦸</text>
                <text x="42" y="44" textAnchor="middle" fill="#1e40af" fontSize="9" fontWeight="bold" fontFamily="monospace">Figurine</text>
                {userState.conceptSelected === 'figurine' && <circle cx="75" cy="10" r="6" fill="#2563eb" />}
              </g>
            </svg>

            <div className="absolute inset-0 border-[12px] border-[#FCFCFA] pointer-events-none" />
          </div>
        );

      case TutorialStep.ADD_PROMPT:
        return (
          <div className="relative w-full h-full flex flex-col items-center justify-center bg-[#FDFCFA] overflow-hidden">
            {/* Bleeding background gradients */}
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-72 h-72 bg-teal-100/40 rounded-full blur-3xl filter" />
            
            <svg viewBox="0 0 400 250" className="w-[85%] h-auto z-10" style={{ filter: 'url(#sketch-ink)' }}>
              {/* Profile in center */}
              <g transform="translate(60, 80)">
                <circle cx="45" cy="45" r="36" fill="#e2e8f0" stroke="#334155" strokeWidth="2" />
                <circle cx="45" cy="40" r="18" fill="#fbcfe8" />
                {/* Hair */}
                <path d="M 28,35 C 38,15 58,15 62,35 Z" fill="#db2777" />
                <path d="M 25,65 Q 45,70 65,65 Q 60,80 30,80 Z" fill="#64748b" />
              </g>

              {/* Hand painted speech bubble */}
              <g transform="translate(150, 40)">
                {/* Speech bubble background with bleeding wash */}
                <path d="M 20,10 L 210,10 C 220,10 220,20 220,20 L 220,100 C 220,110 210,110 200,110 L 40,110 L 15,135 L 25,110 L 20,110 C 10,110 10,100 10,100 L 10,20 C 10,10 20,10 20,10 Z" fill="#ffffff" stroke="#0d9488" strokeWidth="2" />
                
                {/* Hand drawn style text */}
                <text x="30" y="40" fill="#0f766e" fontSize="11" fontWeight="bold" fontFamily="monospace">✏️ Prompt:</text>
                <text x="30" y="65" fill="#1e293b" fontSize="12" fontWeight="bold" fontFamily="sans-serif">
                  "Transform me into a
                </text>
                <text x="30" y="90" fill="#0d9488" fontSize="13" fontWeight="bold" fontFamily="sans-serif">
                  watercolor painting."
                </text>
              </g>
            </svg>

            <div className="absolute inset-0 border-[12px] border-[#FCFCFA] pointer-events-none" />
          </div>
        );

      case TutorialStep.EDIT_AND_FINALIZE:
        // Combine selections for final result
        const conceptEmoji = userState.conceptSelected === 'plushie' ? '🧸' : userState.conceptSelected === 'mohawk' ? '⚡' : userState.conceptSelected === 'figurine' ? '🤖' : '✨';
        return (
          <div className="relative w-full h-full flex flex-col items-center justify-center bg-[#FDFCFA] overflow-hidden">
            {/* Massive gold watercolor radiant background bleed */}
            <div className="absolute inset-0 bg-gradient-to-tr from-amber-100/40 via-sky-100/30 to-rose-200/40 opacity-70 blur-xl" />
            
            <svg viewBox="0 0 400 250" className="w-[85%] h-auto z-10" style={{ filter: 'url(#sketch-ink)' }}>
              {/* Beautiful, ornate picture frame with gold accents */}
              <g transform="translate(110, 15)">
                {/* Frame border */}
                <rect x="0" y="0" width="180" height="195" rx="10" fill="#d97706" stroke="#78350f" strokeWidth="3" className="drop-shadow-md" />
                {/* Gold inner trim */}
                <rect x="8" y="8" width="164" height="179" rx="6" fill="#fef08a" stroke="#ca8a04" strokeWidth="2" />
                {/* Mount board */}
                <rect x="15" y="15" width="150" height="165" rx="4" fill="#fafaf9" />
                
                {/* The final watercolor artwork (Visual Blend of choices) */}
                <g transform="translate(15, 15)">
                  {/* Background bleed wash */}
                  <rect x="0" y="0" width="150" height="165" fill="#f8fafc" />
                  <path d="M 10 10 Q 75 -20 140 10 Q 170 75 140 140 Q 75 170 10 140 Q -20 75 10 10 Z" fill="#bae6fd" opacity="0.6" />
                  <circle cx="110" cy="60" r="45" fill="#fed7aa" opacity="0.5" />
                  <circle cx="40" cy="110" r="35" fill="#fbcfe8" opacity="0.5" />
                  
                  {/* If user provided selfie, render structured sketch or selfie container */}
                  <g transform="translate(25, 20)">
                    {/* Character Face watercolor */}
                    <circle cx="50" cy="65" r="40" fill="#fed7aa" stroke="#78350f" strokeWidth="1.5" />
                    
                    {/* Apply concept styling overlays directly */}
                    {userState.conceptSelected === 'plushie' && (
                      <g>
                        {/* Teddy ears */}
                        <circle cx="15" cy="30" r="14" fill="#a16207" stroke="#78350f" strokeWidth="1.5" />
                        <circle cx="85" cy="30" r="14" fill="#a16207" stroke="#78350f" strokeWidth="1.5" />
                        <circle cx="15" cy="30" r="7" fill="#f43f5e" />
                        <circle cx="85" cy="30" r="7" fill="#f43f5e" />
                      </g>
                    )}

                    {userState.conceptSelected === 'mohawk' && (
                      <g transform="translate(50, 20)">
                        {/* Spiky fluorescent Mohawk */}
                        <path d="M -15,-5 L 0,-40 L 15,-5 L 25,-45 L 5,-12 L -5,-48 L -20,-12 Z" fill="#ec4899" stroke="#9d174d" strokeWidth="1.5" />
                      </g>
                    )}

                    {userState.conceptSelected === 'figurine' && (
                      <g>
                        {/* Cybernetic overlay visor */}
                        <rect x="22" y="50" width="56" height="14" rx="4" fill="#06b6d4" stroke="#0891b2" strokeWidth="1.5" opacity="0.9" />
                        <line x1="22" y1="57" x2="78" y2="57" stroke="#ffffff" strokeWidth="1.5" />
                      </g>
                    )}

                    {/* Cute smiling eyes & watercolor face */}
                    <ellipse cx="38" cy="62" rx="2" ry="3.5" fill="#1e293b" />
                    <ellipse cx="62" cy="62" rx="2" ry="3.5" fill="#1e293b" />
                    <path d="M 42,76 Q 50,84 58,76" stroke="#1e293b" strokeWidth="2.5" strokeLinecap="round" fill="none" />
                    
                    {/* Cute rosy watercolor spot */}
                    <circle cx="32" cy="71" r="5" fill="#fecdd3" opacity="0.8" />
                    <circle cx="68" cy="71" r="5" fill="#fecdd3" opacity="0.8" />
                  </g>
                </g>
              </g>

              {/* Artistic leaf watermark */}
              <text x="20" y="230" fill="#b45309" fontSize="12" fontFamily="monospace">🍌 Nano Banana Pro</text>
              <text x="350" y="230" fill="#0369a1" fontSize="12" fontFamily="monospace">№ 5</text>
            </svg>

            <div className="absolute inset-0 border-[12px] border-[#FCFCFA] pointer-events-none" />
          </div>
        );
    }
  };

  const getStepIcon = (id: TutorialStep) => {
    switch (id) {
      case TutorialStep.MODEL_SELECTION: return <Sparkles className="w-5 h-5 text-amber-600" />;
      case TutorialStep.ADD_SELFIE: return <Camera className="w-5 h-5 text-rose-600" />;
      case TutorialStep.CHOOSE_CONCEPT: return <HelpCircle className="w-5 h-5 text-indigo-600" />;
      case TutorialStep.ADD_PROMPT: return <Palette className="w-5 h-5 text-teal-600" />;
      case TutorialStep.EDIT_AND_FINALIZE: return <CheckCircle2 className="w-5 h-5 text-sky-600" />;
    }
  };

  return (
    <div className="flex flex-col h-full bg-[#FAF9F5] border-2 border-amber-900/15 rounded-3xl overflow-hidden shadow-xl" id="comic-panel-container">
      {/* Panel Top Label */}
      <div className="flex items-center justify-between px-6 py-4 bg-white border-b border-amber-900/10">
        <div className="flex items-center gap-3">
          <div className="p-2 rounded-xl bg-orange-50 border border-orange-100">
            {getStepIcon(panel.id)}
          </div>
          <div>
            <span className="text-[10px] uppercase tracking-wider font-bold text-amber-900/60 font-mono">Comic Panel Tutorial</span>
            <h2 className="font-sans font-bold text-slate-800 leading-tight text-base tracking-tight">{panel.title}</h2>
          </div>
        </div>
        <div className="flex items-center gap-1.5 px-3 py-1 bg-amber-50 rounded-full border border-amber-100 text-[10px] font-bold text-amber-800 font-mono">
          PANEL {panel.id + 1} / 5
        </div>
      </div>

      {/* Main Core Graphic */}
      <div className="flex-1 min-h-[260px] max-h-[380px] bg-slate-100 border-b border-amber-900/10 overflow-hidden relative">
        <AnimatePresence mode="wait">
          <motion.div
            key={panel.id}
            initial={{ opacity: 0, scale: 0.97 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 1.03 }}
            transition={{ duration: 0.4, ease: "easeOut" }}
            className="w-full h-full"
          >
            {renderComicScene()}
          </motion.div>
        </AnimatePresence>
      </div>

      {/* Narrative & Script Explanation */}
      <div className="p-6 bg-white flex-1 flex flex-col justify-between" id="comic-narrative-panel">
        <div>
          <span className="text-[10px] uppercase font-bold text-amber-700 tracking-wider font-mono">STORYBOARD COMPOSITION</span>
          <p className="mt-2 text-xs text-slate-500 leading-relaxed italic bg-emerald-50/50 p-3 rounded-xl border border-emerald-900/5 font-serif font-medium">
            "{panel.comicScript}"
          </p>
        </div>

        <div className="mt-4 pt-4 border-t border-amber-900/10">
          <span className="text-[10px] uppercase font-bold text-indigo-700 tracking-wider font-mono">TUTORIAL GUIDE</span>
          <p className="mt-1 text-sm font-semibold text-slate-700 leading-snug">
            {panel.description}
          </p>
          <div className="mt-2 flex items-center gap-2 text-xs text-indigo-600 bg-indigo-50/50 p-2.5 rounded-xl border border-indigo-100 font-medium">
            <span className="inline-block w-1.5 h-1.5 rounded-full bg-indigo-500 animate-pulse" />
            <span>Interactive sandbox tasks: <b>{panel.instruction}</b></span>
          </div>
        </div>
      </div>
    </div>
  );
}
