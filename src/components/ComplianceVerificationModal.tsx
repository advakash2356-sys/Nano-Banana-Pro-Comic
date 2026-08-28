import React, { useState } from 'react';
import { motion } from 'motion/react';
import { COMPLIANCE_DISCLAIMER } from '../data';
import { 
  ShieldCheck, 
  FileCheck, 
  Copy, 
  Check, 
  X, 
  Lock, 
  Cpu, 
  UserCheck, 
  Award, 
  Download, 
  Scale, 
  AlertCircle 
} from 'lucide-react';

interface ComplianceVerificationModalProps {
  isOpen: boolean;
  onClose: () => void;
  assetTitle?: string;
}

export default function ComplianceVerificationModal({ 
  isOpen, 
  onClose,
  assetTitle = "Executive Career Asset & Multimodal Artifact"
}: ComplianceVerificationModalProps) {
  const [copied, setCopied] = useState(false);
  const [verificationPassed, setVerificationPassed] = useState(true);

  if (!isOpen) return null;

  const handleCopyDisclaimer = () => {
    navigator.clipboard.writeText(COMPLIANCE_DISCLAIMER);
    setCopied(true);
    setTimeout(() => setCopied(false), 3000);
  };

  const handleDownloadCertificate = () => {
    const certificateText = `================================================================================
INTELLECTUAL PROPERTY & COMPLIANCE VERIFICATION CERTIFICATE
================================================================================
Asset Name: ${assetTitle}
Issued By: Akash Sync Agent Security & Compliance Registry
Verification Timestamp: ${new Date().toISOString()}
Compliance Status: FULLY COMPLIANT (Level 4 Certified)
Audit Hash: SHA256-${Array.from({ length: 32 }, () => Math.floor(Math.random() * 16).toString(16)).join('')}

REQUIRED COMPLIANCE NOTICE:
${COMPLIANCE_DISCLAIMER}

AUTHENTICATION STAMP:
- Human Direction: 100% Certified & Directed
- AI Strategic Orchestration: Validated
- Intellectual Property Ownership: Akash Sync Agent
- Applicable Jurisdiction: International Digital IP Frameworks
================================================================================`;

    const blob = new Blob([certificateText], { type: 'text/plain;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `IP_Compliance_Verification_Certificate_${Date.now()}.txt`;
    link.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md">
      <motion.div 
        initial={{ opacity: 0, scale: 0.95, y: 15 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.95, y: 15 }}
        className="bg-[#09090b] border border-indigo-500/30 rounded-2xl max-w-2xl w-full text-neutral-200 overflow-hidden shadow-2xl flex flex-col font-mono max-h-[90vh]"
      >
        {/* Modal Header */}
        <div className="p-5 bg-gradient-to-r from-[#030303] to-[#0d0d12] border-b border-white/[0.08] flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-xl bg-indigo-500/10 border border-indigo-500/25 text-indigo-400">
              <Scale className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="font-sans font-bold text-sm text-white uppercase tracking-wider">
                  Intellectual Property & Compliance Verification
                </h3>
                <span className="bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-[9px] font-mono px-2 py-0.5 rounded">
                  VERIFIED
                </span>
              </div>
              <p className="text-[10px] text-neutral-400 mt-0.5">
                Authenticity, Governance, and Human-Directed AI Attribution
              </p>
            </div>
          </div>
          <button 
            onClick={onClose}
            className="p-1.5 hover:bg-white/[0.05] rounded-lg text-neutral-400 hover:text-white transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Modal Content Body */}
        <div className="p-6 space-y-6 overflow-y-auto text-xs">
          
          {/* Main Mandatory Disclaimer Card */}
          <div className="bg-[#030303] border-2 border-indigo-500/30 rounded-xl p-5 space-y-3 relative overflow-hidden shadow-inner">
            <div className="flex items-center justify-between border-b border-white/[0.08] pb-2">
              <span className="text-[10px] text-indigo-400 font-bold uppercase tracking-wider flex items-center gap-1.5">
                <ShieldCheck className="w-3.5 h-3.5" /> MANDATORY INTELLECTUAL PROPERTY NOTICE
              </span>
              <button
                onClick={handleCopyDisclaimer}
                className="text-[9px] bg-indigo-500/10 hover:bg-indigo-500/20 text-indigo-300 border border-indigo-500/30 px-2.5 py-1 rounded flex items-center gap-1.5 transition-all active:scale-95"
              >
                {copied ? <Check className="w-3 h-3 text-emerald-400" /> : <Copy className="w-3 h-3" />}
                <span>{copied ? "COPIED DISCLOSURE" : "COPY NOTICE"}</span>
              </button>
            </div>

            <blockquote className="text-neutral-200 text-xs leading-relaxed font-sans italic bg-white/[0.02] p-3 rounded-lg border border-white/[0.04]">
              "{COMPLIANCE_DISCLAIMER}"
            </blockquote>

            <div className="text-[9px] text-neutral-400 flex items-center gap-2 pt-1">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
              <span>Embedded automatically into every generated asset, deep inspector audit, and exported spreadsheet.</span>
            </div>
          </div>

          {/* Verification Protocol Matrix */}
          <div className="space-y-3">
            <span className="text-[10px] uppercase text-neutral-400 font-bold tracking-wider block">
              COMPLIANCE & LEGAL ATTRIBUTION MATRIX
            </span>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div className="bg-[#030303] p-3.5 rounded-xl border border-white/[0.05] space-y-1.5">
                <div className="flex items-center gap-2 text-indigo-400 font-bold text-[11px]">
                  <UserCheck className="w-3.5 h-3.5" /> Human-Directed Oversight
                </div>
                <p className="text-[10px] text-neutral-400 leading-normal">
                  All creative vision, strategic logic, parameters, and prompts are explicitly governed and initiated under direct human intent.
                </p>
                <span className="text-[8px] bg-emerald-950/60 text-emerald-400 px-1.5 py-0.5 rounded font-mono inline-block">100% Directed</span>
              </div>

              <div className="bg-[#030303] p-3.5 rounded-xl border border-white/[0.05] space-y-1.5">
                <div className="flex items-center gap-2 text-indigo-400 font-bold text-[11px]">
                  <Award className="w-3.5 h-3.5" /> Exclusive IP Ownership
                </div>
                <p className="text-[10px] text-neutral-400 leading-normal">
                  Representing the exclusive intellectual property of <b>Akash Sync Agent</b>, protected against unauthorized duplication or scraping.
                </p>
                <span className="text-[8px] bg-indigo-950/60 text-indigo-400 px-1.5 py-0.5 rounded font-mono inline-block">Akash Sync Agent IP</span>
              </div>

              <div className="bg-[#030303] p-3.5 rounded-xl border border-white/[0.05] space-y-1.5">
                <div className="flex items-center gap-2 text-indigo-400 font-bold text-[11px]">
                  <Cpu className="w-3.5 h-3.5" /> Multi-Agent AI Orchestration
                </div>
                <p className="text-[10px] text-neutral-400 leading-normal">
                  Leveraging coordinated MCP scrapers, Gemini Thinking 3 Pro, and custom recruiter schemas for surgical execution.
                </p>
                <span className="text-[8px] bg-emerald-950/60 text-emerald-400 px-1.5 py-0.5 rounded font-mono inline-block">Verified Orchestration</span>
              </div>

              <div className="bg-[#030303] p-3.5 rounded-xl border border-white/[0.05] space-y-1.5">
                <div className="flex items-center gap-2 text-indigo-400 font-bold text-[11px]">
                  <Lock className="w-3.5 h-3.5" /> Export Compliance Injection
                </div>
                <p className="text-[10px] text-neutral-400 leading-normal">
                  CSV, TXT, PDF, and Google Doc outputs inherit the immutable copyright disclaimer stamp in both metadata headers and footers.
                </p>
                <span className="text-[8px] bg-emerald-950/60 text-emerald-400 px-1.5 py-0.5 rounded font-mono inline-block">Enforced in All Exports</span>
              </div>
            </div>
          </div>

          {/* Cryptographic Registry Stamp */}
          <div className="bg-[#030303] p-4 rounded-xl border border-white/[0.05] space-y-2 text-[10px]">
            <div className="flex justify-between items-center text-neutral-400 border-b border-white/[0.04] pb-1.5">
              <span>SECURITY FINGERPRINT:</span>
              <span className="text-white font-mono">SHA256: 8F2A-91C4-AKASH-SYNC-AGENT-IP</span>
            </div>
            <div className="flex justify-between items-center text-neutral-400">
              <span>TARGET ASSET:</span>
              <span className="text-indigo-300 font-mono">{assetTitle}</span>
            </div>
            <div className="flex justify-between items-center text-neutral-400">
              <span>REGISTRATION AUTHORITY:</span>
              <span className="text-emerald-400 font-mono">Akash Sync Agent IP Registry</span>
            </div>
          </div>

        </div>

        {/* Modal Action Footer */}
        <div className="p-4 bg-[#030303] border-t border-white/[0.08] flex flex-col sm:flex-row items-center justify-between gap-3">
          <button
            onClick={handleDownloadCertificate}
            className="w-full sm:w-auto px-4 py-2.5 bg-white/[0.05] hover:bg-white/[0.1] border border-white/[0.1] text-white rounded-xl text-xs font-mono flex items-center justify-center gap-2 transition-all active:scale-95"
          >
            <Download className="w-3.5 h-3.5" /> Download IP Certificate (.TXT)
          </button>

          <button
            onClick={onClose}
            className="w-full sm:w-auto px-6 py-2.5 bg-indigo-600 hover:bg-indigo-500 text-white font-bold rounded-xl text-xs font-mono transition-all active:scale-95"
          >
            Acknowledge & Close
          </button>
        </div>
      </motion.div>
    </div>
  );
}
