import React, { useState, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { UserState, TutorialStep } from '../types';
import { Sparkles, Camera, Image, Send, ArrowRight, RotateCcw, Check, Plus, Sliders } from 'lucide-react';

interface InteractiveSandboxProps {
  userState: UserState;
  onChangeState: (updater: Partial<UserState> | ((prev: UserState) => UserState)) => void;
}

// Built-in watercolor portrait presets for Step 2
const AVATAR_PRESETS = [
  { id: 'techie', name: 'Leah (Designer)', emoji: '👩‍💻', avatarUrl: 'https://picsum.photos/seed/techie/300/300' },
  { id: 'adventurer', name: 'Kai (Explorer)', emoji: '🧗‍♂️', avatarUrl: 'https://picsum.photos/seed/explorer/300/300' },
  { id: 'student', name: 'Zoe (Creative)', emoji: '🎨', avatarUrl: 'https://picsum.photos/seed/artist/300/300' },
];

export default function InteractiveSandbox({ userState, onChangeState }: InteractiveSandboxProps) {
  const [modelDropdownOpen, setModelDropdownOpen] = useState(false);
  const [customPromptInput, setCustomPromptInput] = useState('');
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleSelectModel = (modelName: string) => {
    onChangeState({
      modelSelected: modelName,
      thinkingEnabled: modelName === 'Thinking with 3 Pro'
    });
    setModelDropdownOpen(false);
  };

  const handleUploadClick = () => {
    fileInputRef.current?.click();
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        onChangeState({ selfieImage: event.target?.result as string });
      };
      reader.readAsDataURL(file);
    }
  };

  const selectPresetAvatar = (url: string) => {
    onChangeState({ selfieImage: url });
  };

  const selectConcept = (concept: 'plushie' | 'mohawk' | 'figurine') => {
    onChangeState({ conceptSelected: concept });
  };

  const advanceStep = () => {
    if (userState.currentStep < TutorialStep.EDIT_AND_FINALIZE) {
      onChangeState({ currentStep: userState.currentStep + 1 });
    }
  };

  const prevStep = () => {
    if (userState.currentStep > TutorialStep.MODEL_SELECTION) {
      onChangeState({ currentStep: userState.currentStep - 1 });
    }
  };

  const resetAll = () => {
    onChangeState({
      modelSelected: 'Gemini 2.5 Flash',
      thinkingEnabled: false,
      selfieImage: null,
      conceptSelected: null,
      promptText: '',
      currentStep: TutorialStep.MODEL_SELECTION,
    });
    setCustomPromptInput('');
  };

  const getConceptDescription = (concept: typeof userState.conceptSelected) => {
    switch (concept) {
      case 'plushie': return "Transforming with cuddly plush features, stitched button details, and soft canvas fabric.";
      case 'mohawk': return "Injecting punk-rock styling with an electric-colored mohawk hairstyle and dramatic highlights.";
      case 'figurine': return "Molding onto a sleek cyberpunk collectible stand with light-up neon visor highlights.";
      default: return "";
    }
  };

  return (
    <div className="flex flex-col h-full bg-[#FCFAF5] border-2 border-amber-900/15 rounded-3xl overflow-hidden shadow-xl" id="interactive-phone-sandbox">
      {/* Phone Header */}
      <div className="px-6 py-3.5 bg-gradient-to-r from-slate-900 to-slate-800 text-white flex items-center justify-between border-b-4 border-amber-500">
        <div className="flex items-center gap-2">
          <div className="w-2.5 h-2.5 bg-red-400 rounded-full animate-pulse" />
          <span className="font-mono text-xs tracking-wider text-slate-300 font-bold">GEMINI MOBILE PLAYGROUND</span>
        </div>
        <button 
          onClick={resetAll} 
          className="flex items-center gap-1 text-[10px] bg-slate-700/60 hover:bg-red-900/40 border border-slate-600 px-2 py-1 rounded-md transition-all font-mono font-bold"
        >
          <RotateCcw className="w-3 h-3" /> RESET ALL
        </button>
      </div>

      {/* Main Simulated Phone Screen */}
      <div className="flex-1 bg-slate-950 p-4 font-sans text-slate-100 flex flex-col justify-between relative overflow-hidden h-full">
        {/* Subtle grid pattern */}
        <div className="absolute inset-0 bg-[radial-gradient(#334155_1px,transparent_1px)] [background-size:16px_16px] opacity-10 pointer-events-none" />

        {/* Top App Header inside Device */}
        <div className="flex items-center justify-between pb-3 border-b border-white/5 relative z-10">
          <div className="flex items-center gap-2">
            <div className="w-6 h-6 rounded-full bg-amber-400 flex items-center justify-center text-[10px]">🍌</div>
            <span className="font-mono text-xs font-bold tracking-tight text-white">Nano Banana Pro Simulator</span>
          </div>
          <span className="text-[9px] font-mono bg-white/10 px-2 py-0.5 rounded text-amber-400 font-bold">v3.0.PRO</span>
        </div>

        {/* Dynamic Step View inside Simulated Client */}
        <div className="flex-1 my-4 flex flex-col justify-center select-none relative z-10" id="phone-display-viewport">
          <AnimatePresence mode="wait">
            
            {/* STEP 1: Model Selection */}
            {userState.currentStep === TutorialStep.MODEL_SELECTION && (
              <motion.div 
                key="step1"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: -20, x: -20 }}
                className="space-y-4"
              >
                <div className="bg-white/5 p-4 rounded-2xl border border-white/10 space-y-3">
                  <span className="text-[10px] text-amber-400 font-bold font-mono tracking-wider block">CHOOSE MODEL INPUT</span>
                  
                  {/* Custom Model Selector Trigger */}
                  <div className="relative">
                    <button 
                      onClick={() => setModelDropdownOpen(!modelDropdownOpen)}
                      className="w-full flex items-center justify-between bg-slate-900 border border-white/10 rounded-xl px-4 py-3 text-sm text-left hover:border-amber-400 transition-all font-mono"
                    >
                      <span className="flex items-center gap-2">
                        <Sparkles className="w-4 h-4 text-amber-400 animate-pulse" />
                        <b>{userState.modelSelected}</b>
                      </span>
                      <span className="text-xs text-slate-400">▼</span>
                    </button>

                    {/* Custom Dropdown Content */}
                    {modelDropdownOpen && (
                      <div className="absolute left-0 right-0 mt-1.5 bg-slate-900 border border-white/15 rounded-xl overflow-hidden shadow-2xl z-20 font-mono text-xs">
                        {['Gemini 2.5 Flash', 'Gemini 2.5 Pro', 'Thinking with 3 Pro'].map((model) => (
                          <button
                            key={model}
                            onClick={() => handleSelectModel(model)}
                            className="w-full text-left px-4 py-3 hover:bg-slate-800 flex items-center justify-between text-slate-300 transition-all"
                          >
                            <span>{model}</span>
                            {userState.modelSelected === model && (
                              <Check className="w-3.5 h-3.5 text-amber-400" />
                            )}
                          </button>
                        ))}
                      </div>
                    )}
                  </div>

                  {/* Thinking Checkbox Row */}
                  <div className="flex items-center justify-between p-3.5 bg-slate-900/60 rounded-xl border border-white/5">
                    <span className="text-xs font-mono text-slate-300">Enable Deep Reasoning?</span>
                    <label className="flex items-center gap-2.5 cursor-pointer">
                      <input 
                        type="checkbox" 
                        checked={userState.thinkingEnabled} 
                        onChange={(e) => onChangeState({ 
                          thinkingEnabled: e.target.checked,
                          modelSelected: e.target.checked ? 'Thinking with 3 Pro' : 'Gemini 2.5 Flash'
                        })}
                        className="sr-only peer"
                      />
                      <div className="relative w-9 h-5 bg-slate-800 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full rtl:peer-checked:after:-translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:start-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-amber-500" />
                    </label>
                  </div>
                  <p className="text-[10px] text-slate-400 font-serif leading-relaxed italic">
                    Note: "Thinking with 3 Pro" model unlocks delicate ink washes and high-context art rendering.
                  </p>
                </div>

                {/* Confirm Action Button */}
                <button
                  onClick={advanceStep}
                  disabled={userState.modelSelected !== 'Thinking with 3 Pro'}
                  className={`w-full py-3.5 rounded-2xl font-bold flex items-center justify-center gap-2 tracking-wide font-sans text-sm transition-all shadow-md ${
                    userState.modelSelected === 'Thinking with 3 Pro' && userState.thinkingEnabled
                      ? 'bg-amber-400 text-slate-950 hover:bg-amber-300 active:scale-95 animate-ping-once' 
                      : 'bg-slate-800 text-slate-500 cursor-not-allowed'
                  }`}
                >
                  🍌 CREATE IMAGE <ArrowRight className="w-4 h-4" />
                </button>
              </motion.div>
            )}

            {/* STEP 2: Add Selfie */}
            {userState.currentStep === TutorialStep.ADD_SELFIE && (
              <motion.div 
                key="step2"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: -20, x: -20 }}
                className="space-y-4"
              >
                <div className="bg-white/5 p-4 rounded-2xl border border-white/10 space-y-3">
                  <span className="text-[10px] text-rose-400 font-bold font-mono tracking-wider block">PROVIDE TARGET IMAGE</span>
                  
                  {/* Select a pre-drawn portrait or camera upload */}
                  <div className="grid grid-cols-3 gap-2">
                    {AVATAR_PRESETS.map((preset) => (
                      <button
                        key={preset.id}
                        onClick={() => selectPresetAvatar(preset.avatarUrl)}
                        className={`p-2 rounded-xl flex flex-col items-center gap-1 border-2 text-center transition-all ${
                          userState.selfieImage === preset.avatarUrl 
                            ? 'bg-rose-500/10 border-rose-500' 
                            : 'bg-slate-900 border-white/5 hover:border-slate-700'
                        }`}
                      >
                        <span className="text-xl">{preset.emoji}</span>
                        <span className="text-[9px] font-bold text-slate-300 pointer-events-none truncate w-full">{preset.name}</span>
                      </button>
                    ))}
                  </div>

                  {/* Manual file upload */}
                  <div className="flex items-center gap-3">
                    <button
                      onClick={handleUploadClick}
                      className="flex-1 py-2.5 bg-slate-900 hover:bg-slate-800 border border-white/10 rounded-xl flex items-center justify-center gap-2 text-xs font-mono font-bold"
                    >
                      <Camera className="w-4 h-4 text-rose-400" />
                      Snap / Upload Selfie
                    </button>
                    <input 
                      type="file" 
                      ref={fileInputRef} 
                      onChange={handleFileChange} 
                      className="hidden" 
                      accept="image/*"
                    />
                  </div>

                  {/* Display active selection thumbnail */}
                  <div className="h-28 rounded-xl bg-slate-900 border border-white/10 overflow-hidden flex items-center justify-center relative">
                    {userState.selfieImage ? (
                      <>
                        <img 
                          src={userState.selfieImage} 
                          alt="Selfie selected" 
                          className="w-full h-full object-cover"
                          referrerPolicy="no-referrer"
                        />
                        <div className="absolute top-2 right-2 bg-rose-500 text-white rounded-full p-1 shadow">
                          <Check className="w-3 h-3" />
                        </div>
                      </>
                    ) : (
                      <div className="text-center text-slate-500 p-4">
                        <Image className="w-8 h-8 mx-auto stroke-1 mb-1 text-rose-400/40" />
                        <span className="text-[10px] font-mono">No photo chosen yet</span>
                      </div>
                    )}
                  </div>
                </div>

                {/* Primary Action Buttons */}
                <div className="flex gap-2">
                  <button onClick={prevStep} className="px-3.5 py-3 bg-slate-950 border border-white/10 text-slate-300 rounded-2xl hover:bg-slate-900 active:scale-95 transition-all">
                    Back
                  </button>
                  <button
                    onClick={advanceStep}
                    disabled={!userState.selfieImage}
                    className={`flex-1 py-3 bg-rose-500 font-bold rounded-2xl flex items-center justify-center gap-2 text-sm transition-all shadow-md ${
                      userState.selfieImage 
                        ? 'text-white hover:bg-rose-400 active:scale-95' 
                        : 'bg-slate-800 text-slate-500 cursor-not-allowed'
                    }`}
                  >
                    Confirm Photo <ArrowRight className="w-4 h-4" />
                  </button>
                </div>
              </motion.div>
            )}

            {/* STEP 3: Choose Concept style */}
            {userState.currentStep === TutorialStep.CHOOSE_CONCEPT && (
              <motion.div 
                key="step3"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: -20, x: -20 }}
                className="space-y-4"
              >
                <div className="bg-white/5 p-4 rounded-2xl border border-white/10 space-y-3">
                  <span className="text-[10px] text-indigo-400 font-bold font-mono tracking-wider block">SELECT CREATIVE DIRECTION</span>
                  
                  <div className="space-y-2">
                    {[
                      { id: 'plushie', label: '🧸 Transform into a Cute Plushie', desc: 'Warm knitted textures & detailed seams.' },
                      { id: 'mohawk', label: '🦹 Rock an Edgy Punk Mohawk', desc: 'Dazzling high-contrast styling with bright hues.' },
                      { id: 'figurine', label: '🦸 Become a Sleek Figurine Model', desc: 'Glossy toy pedestal, neon HUD elements.' },
                    ].map((opt) => (
                      <button
                        key={opt.id}
                        onClick={() => selectConcept(opt.id as any)}
                        className={`w-full p-2.5 rounded-xl border-2 text-left flex items-start gap-3 transition-all ${
                          userState.conceptSelected === opt.id 
                            ? 'bg-indigo-500/10 border-indigo-500' 
                            : 'bg-slate-900 border-white/5 hover:border-slate-800'
                        }`}
                      >
                        <div className={`w-4 h-4 rounded-full border-2 flex items-center justify-center mt-0.5 ${
                          userState.conceptSelected === opt.id ? 'border-indigo-400' : 'border-slate-600'
                        }`}>
                          {userState.conceptSelected === opt.id && <div className="w-2 h-2 rounded-full bg-indigo-400" />}
                        </div>
                        <div>
                          <div className="text-xs font-bold text-white leading-tight">{opt.label}</div>
                          <div className="text-[10px] text-slate-400 leading-normal mt-0.5">{opt.desc}</div>
                        </div>
                      </button>
                    ))}
                  </div>
                </div>

                {/* Primary Navigation Buttons */}
                <div className="flex gap-2">
                  <button onClick={prevStep} className="px-3.5 py-3 bg-slate-950 border border-white/10 text-slate-300 rounded-2xl hover:bg-slate-900 active:scale-95 transition-all">
                    Back
                  </button>
                  <button
                    onClick={advanceStep}
                    disabled={!userState.conceptSelected}
                    className={`flex-1 py-3 bg-indigo-600 font-bold rounded-2xl flex items-center justify-center gap-2 text-sm transition-all shadow-md ${
                      userState.conceptSelected 
                        ? 'text-white hover:bg-indigo-505 active:scale-95' 
                        : 'bg-slate-800 text-slate-500 cursor-not-allowed'
                    }`}
                  >
                    Set Creative Mode <ArrowRight className="w-4 h-4" />
                  </button>
                </div>
              </motion.div>
            )}

            {/* STEP 4: Add Style Prompt */}
            {userState.currentStep === TutorialStep.ADD_PROMPT && (
              <motion.div 
                key="step4"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: -20, x: -20 }}
                className="space-y-4"
              >
                <div className="bg-white/5 p-4 rounded-2xl border border-white/10 space-y-4">
                  <span className="text-[10px] text-teal-400 font-bold font-mono tracking-wider block">STYLE INJECTION CHAT</span>
                  
                  {/* Preset prompt selection */}
                  <div>
                    <span className="text-[10px] font-mono text-slate-400 block mb-1">Click preset below to type instantly:</span>
                    <button
                      onClick={() => {
                        setCustomPromptInput('Transform me into a watercolor painting.');
                        onChangeState({ promptText: 'Transform me into a watercolor painting.' });
                      }}
                      className="w-full text-left p-3.5 bg-slate-900 hover:bg-slate-800 border border-teal-500/30 rounded-xl text-xs font-mono text-slate-200 transition-all flex items-center justify-between"
                    >
                      <span>💬 "Transform me into a watercolor painting"</span>
                      <Plus className="w-3 h-3 text-teal-400" />
                    </button>
                  </div>

                  {/* Input bar */}
                  <div className="space-y-1">
                    <span className="text-[10px] font-mono text-slate-400 block">Or customize style instruction:</span>
                    <div className="flex gap-2">
                      <input
                        type="text"
                        value={customPromptInput}
                        onChange={(e) => {
                          setCustomPromptInput(e.target.value);
                          onChangeState({ promptText: e.target.value });
                        }}
                        placeholder="e.g. detailed watercolor bleeding inks..."
                        className="flex-1 bg-slate-900 border border-white/10 rounded-xl px-3.5 py-2.5 text-xs focus:border-teal-500 outline-none font-mono text-white"
                      />
                    </div>
                  </div>
                </div>

                {/* Confirm prompt action button */}
                <div className="flex gap-2">
                  <button onClick={prevStep} className="px-3.5 py-3 bg-slate-950 border border-white/10 text-slate-300 rounded-2xl hover:bg-slate-900 active:scale-95 transition-all">
                    Back
                  </button>
                  <button
                    onClick={advanceStep}
                    disabled={!userState.promptText.trim()}
                    className={`flex-1 py-3 bg-teal-600 font-bold rounded-2xl flex items-center justify-center gap-2 text-sm transition-all shadow-md ${
                      userState.promptText.trim() 
                        ? 'text-white hover:bg-teal-500 active:scale-95' 
                        : 'bg-slate-800 text-slate-500 cursor-not-allowed'
                    }`}
                  >
                    Inject Style Prompt <Send className="w-3.5 h-3.5" />
                  </button>
                </div>
              </motion.div>
            )}

            {/* STEP 5: Final Render results */}
            {userState.currentStep === TutorialStep.EDIT_AND_FINALIZE && (
              <motion.div 
                key="step5"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: -20, x: -20 }}
                className="space-y-4"
              >
                <div className="bg-white/5 p-4 rounded-2xl border border-white/10 space-y-3 relative overflow-hidden">
                  <span className="text-[10px] text-sky-400 font-bold font-mono tracking-wider block">FINAL COMPOSITED COMIC OUTPUT</span>
                  
                  {/* Synthesis Recipe summary card */}
                  <div className="bg-slate-900/40 p-3 rounded-xl border border-white/5 text-[10px] space-y-1.5 font-mono">
                    <div className="flex justify-between"><span className="text-slate-400">MODEL APPLIED:</span><span className="text-amber-400 font-bold">✨ Thinking 3 Pro</span></div>
                    <div className="flex justify-between"><span className="text-slate-400">CREATIVE THEME:</span><span className="text-indigo-400 font-bold">🧸 {userState.conceptSelected?.toUpperCase()}</span></div>
                    <div className="flex justify-between truncate"><span className="text-slate-400">INJECTED PROMPT:</span><span className="text-teal-400 font-bold">"{userState.promptText}"</span></div>
                  </div>

                  {/* Output descriptive preview text block simulated as Gemini Chat text */}
                  <p className="text-[11px] text-slate-300 leading-relaxed bg-slate-900/60 p-3.5 rounded-xl border border-slate-800">
                    ✨ <b>Gemini Assistant:</b> "I have processed your face features with the <b>Thinking with 3 Pro</b> model. Your selfie is now stylized using your instruction and blended into a handcrafted watercolor <b>{userState.conceptSelected}</b> concept!"
                  </p>
                </div>

                <div className="flex gap-2">
                  <button onClick={resetAll} className="flex-1 py-3 bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold rounded-2xl flex items-center justify-center gap-2 text-xs transition-all shadow-md active:scale-95">
                    <RotateCcw className="w-4 h-4" /> Reset Tutorial
                  </button>
                </div>
              </motion.div>
            )}

          </AnimatePresence>
        </div>

        {/* Device Bottom Control Indicator */}
        <div className="flex justify-center items-center py-2">
          {/* Navigation Dot indicators mapping to the steps */}
          <div className="flex items-center gap-2">
            {[0, 1, 2, 3, 4].map((stepIdx) => (
              <button
                key={stepIdx}
                onClick={() => onChangeState({ currentStep: stepIdx })}
                className={`w-2.5 h-2.5 rounded-full transition-all duration-300 ${
                  userState.currentStep === stepIdx 
                    ? 'bg-amber-400 scale-125 shadow-lg shadow-amber-400/50' 
                    : 'bg-slate-700 hover:bg-slate-500'
                }`}
                title={`Panel ${stepIdx + 1}`}
              />
            ))}
          </div>
        </div>

      </div>
    </div>
  );
}
