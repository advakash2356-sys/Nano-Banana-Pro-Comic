import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Network,
  Activity,
  Cpu,
  CheckCircle2,
  Lock,
  Unlock,
  Radio,
  Braces,
  Database,
  Terminal,
  ArrowRight
} from 'lucide-react';

interface TelemetryHUDProps {
  currentEmail: string;
  selectedProfileId: string;
  selectedJobId: string;
  isScraping: boolean;
  isGenerating: boolean;
  hasGenerated: boolean;
  hasDeployedDocs: boolean;
  hasSentGmail: boolean;
  scrapedCount: number;
}

export default function TelemetryHUD({
  currentEmail,
  selectedProfileId,
  selectedJobId,
  isScraping,
  hasGenerated,
  hasDeployedDocs,
  hasSentGmail,
  scrapedCount
}: TelemetryHUDProps) {
  const [dataYield, setDataYield] = useState<number>(12);
  const [clearanceLevel, setClearanceLevel] = useState<number>(1);
  const [logMessage, setLogMessage] = useState<string | null>(null);
  const [activeModules, setActiveModules] = useState<string[]>([]);
  const [animatedYield, setAnimatedYield] = useState<number>(12);

  const yieldThreshold = 100;
  const currentProgressPercent = Math.min((animatedYield / yieldThreshold) * 100, 100);

  const triggerYieldGain = (amount: number, reason: string) => {
    setLogMessage(`SYS.UPDATE: +${amount}Tb Yield [${reason}]`);
    setDataYield(prev => {
      const nextYield = prev + amount;
      if (nextYield >= yieldThreshold) {
        setClearanceLevel(l => l + 1);
        return nextYield - yieldThreshold;
      }
      return nextYield;
    });
    setTimeout(() => {
      setLogMessage(null);
    }, 4000);
  };

  useEffect(() => {
    const delta = dataYield - animatedYield;
    if (delta !== 0) {
      const step = delta > 0 ? 1 : -1;
      const timer = setTimeout(() => {
        setAnimatedYield(prev => {
          if (step > 0) return Math.min(prev + step, dataYield);
          else return Math.max(prev + step, dataYield);
        });
      }, 50);
      return () => clearTimeout(timer);
    }
  }, [dataYield, animatedYield]);

  useEffect(() => {
    if (selectedProfileId) triggerYieldGain(15, "Profile Injection OK");
  }, [selectedProfileId]);

  useEffect(() => {
    if (scrapedCount > 0) {
      triggerYieldGain(25, "Node Scraping Complete");
      unlockModule("HARVEST_NODE");
    }
  }, [scrapedCount]);

  useEffect(() => {
    if (hasGenerated) {
      triggerYieldGain(40, "ATS Syntax Compiled");
      unlockModule("COMPILE_NODE");
    }
  }, [hasGenerated]);

  useEffect(() => {
    if (hasDeployedDocs) {
      triggerYieldGain(10, "Drive Sync Established");
      unlockModule("SYNC_NODE");
    }
  }, [hasDeployedDocs]);

  useEffect(() => {
    if (hasSentGmail) {
      triggerYieldGain(20, "SMTP Payload Deployed");
      unlockModule("SMTP_NODE");
    }
  }, [hasSentGmail]);

  useEffect(() => {
    if (currentEmail === "adv.akash2356@gmail.com") {
      triggerYieldGain(30, "Root Authorization Verified");
      unlockModule("ROOT_ACCESS");
    }
  }, [currentEmail]);

  const unlockModule = (id: string) => {
    setActiveModules(prev => {
      if (prev.includes(id)) return prev;
      return [...prev, id];
    });
  };

  const getClearanceName = (lvl: number) => {
    if (lvl === 1) return "L1 Operator";
    if (lvl === 2) return "L2 Analyst";
    if (lvl === 3) return "L3 Architect";
    return "Root Overlord";
  };

  const stepSequence = [
    {
      id: 'A',
      title: 'PROFILE_INJECT',
      status: selectedProfileId ? 'OK' : 'PENDING'
    },
    {
      id: 'B',
      title: 'MCP_SCRAPE',
      status: scrapedCount > 0 ? 'OK' : 'PENDING'
    },
    {
      id: 'C',
      title: 'AI_COMPILE',
      status: hasGenerated ? 'OK' : 'PENDING'
    },
    {
      id: 'D',
      title: 'PAYLOAD_SYNC',
      status: (hasDeployedDocs || hasSentGmail) ? 'OK' : 'PENDING'
    }
  ];

  return (
    <div className="bg-[#09090b] rounded-xl border border-white/[0.08] p-5 space-y-5 font-mono text-xs text-neutral-400 relative overflow-hidden">
      
      <AnimatePresence>
        {logMessage && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            className="absolute top-0 right-4 px-3 py-1.5 bg-indigo-500/10 border-b border-x border-indigo-500/20 text-indigo-400 font-bold rounded-b text-[10px] flex items-center gap-2"
          >
            <Radio className="w-3 h-3 animate-pulse" />
            {logMessage}
          </motion.div>
        )}
      </AnimatePresence>

      <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6 border-b border-white/[0.05] pb-4">
        
        <div className="flex items-center gap-4">
          <div className="w-10 h-10 border border-white/[0.1] bg-white/[0.02] flex items-center justify-center text-white font-sans font-medium text-lg">
            {clearanceLevel}
          </div>
          <div>
            <div className="flex items-center gap-2 text-white font-sans font-medium text-sm">
              {getClearanceName(clearanceLevel)}
              <span className="w-1.5 h-1.5 bg-indigo-500 rounded-full animate-pulse" />
            </div>
            <div className="text-[10px] text-neutral-500 mt-1 uppercase tracking-wider">
              {Math.round(animatedYield)} / {yieldThreshold} Tb Yield
            </div>
          </div>
        </div>

        <div className="flex-1 max-w-xs w-full">
          <div className="flex justify-between items-center text-[10px] mb-1.5">
            <span>YIELD CAPACITY</span>
            <span className="text-white">{Math.round(currentProgressPercent)}%</span>
          </div>
          <div className="h-1 bg-white/[0.05] overflow-hidden">
            <motion.div 
              className="h-full bg-indigo-500"
              style={{ width: `${currentProgressPercent}%` }}
              layoutId="yield-bar"
            />
          </div>
        </div>

        <div className="flex items-center gap-4 bg-white/[0.02] border border-white/[0.05] p-2 rounded">
          <div>
            <div className="text-[9px] uppercase tracking-wider text-neutral-500">Nodes Scraped</div>
            <div className="text-white font-medium mt-0.5">{scrapedCount}</div>
          </div>
          <div className="w-px h-6 bg-white/[0.05]" />
          <div>
            <div className="text-[9px] uppercase tracking-wider text-neutral-500">Matrices Sync</div>
            <div className="text-white font-medium mt-0.5">{hasGenerated ? 1 : 0}</div>
          </div>
        </div>
      </div>

      <div className="space-y-3">
        <div className="text-[10px] uppercase tracking-widest text-neutral-500 mb-2 flex items-center gap-2">
          <Activity className="w-3 h-3 text-indigo-500" /> Pipeline Status
        </div>
        
        <div className="grid grid-cols-1 sm:grid-cols-4 gap-px bg-white/[0.05]">
          {stepSequence.map((step, idx) => (
            <div key={step.id} className="bg-[#09090b] p-3 flex flex-col justify-between h-20">
              <div className="flex justify-between items-start">
                <span className="text-[10px] text-neutral-600">0{idx + 1}</span>
                {step.status === 'OK' ? (
                  <CheckCircle2 className="w-3.5 h-3.5 text-indigo-500" />
                ) : (
                  <span className="w-1.5 h-1.5 rounded-full bg-neutral-700" />
                )}
              </div>
              <div>
                <div className={`text-xs font-sans font-medium ${step.status === 'OK' ? 'text-white' : 'text-neutral-500'}`}>
                  {step.title}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="pt-2 flex flex-wrap gap-2">
        {["ROOT_ACCESS", "HARVEST_NODE", "COMPILE_NODE", "SYNC_NODE", "SMTP_NODE"].map(mod => {
          const isActive = activeModules.includes(mod);
          return (
            <div key={mod} className={`px-2 py-1 border text-[9px] flex items-center gap-1.5 transition-colors ${isActive ? 'border-indigo-500/30 text-indigo-400 bg-indigo-500/5' : 'border-white/[0.05] text-neutral-600'}`}>
              {isActive ? <Unlock className="w-2.5 h-2.5" /> : <Lock className="w-2.5 h-2.5" />}
              {mod}
            </div>
          );
        })}
      </div>

    </div>
  );
}
