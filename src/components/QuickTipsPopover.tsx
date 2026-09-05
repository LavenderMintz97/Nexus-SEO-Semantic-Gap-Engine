import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Lightbulb, 
  X, 
  Sparkles, 
  Target, 
  Network, 
  FileDown, 
  Check, 
  ChevronRight,
  Info
} from 'lucide-react';
import { cn } from '../lib/utils';

interface QuickTipsPopoverProps {
  onOpenGuide?: () => void;
}

interface TipItem {
  id: string;
  category: string;
  title: string;
  description: string;
  actionHint?: string;
  icon: React.ReactNode;
}

export function QuickTipsPopover({ onOpenGuide }: QuickTipsPopoverProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [activeTipIndex, setActiveTipIndex] = useState(0);
  const popoverRef = useRef<HTMLDivElement>(null);

  const tips: TipItem[] = [
    {
      id: 'entity',
      category: 'Knowledge Graph',
      title: 'Target "Absent" Entity Nodes',
      description: 'Google’s NLP ranks pages by entity salience rather than raw keyword repetition. In the Entity Graph tab, prioritize concepts tagged "Absent" into your primary H2/H3 headings.',
      actionHint: 'Check Entity Graph tab',
      icon: <Network size={13} className="text-[#C5FF4A]" />
    },
    {
      id: 'serp',
      category: 'AI Overview & SERP',
      title: 'Capture Position 0 Citations',
      description: 'Google AI Overviews favor concise empirical synthesis blocks. Place a direct 40–50 word declarative definition with empirical proof right below your H2 heading.',
      actionHint: 'View SERP Targets tab',
      icon: <Target size={13} className="text-[#C5FF4A]" />
    },
    {
      id: 'contrarian',
      category: 'Information Gain',
      title: 'Prioritize Non-Consensus Angles',
      description: 'Search engines de-index boilerplate consensus. Use the Semantic Map archetype filter to isolate "Contrarian Angle" gaps that provide genuinely novel points of view.',
      actionHint: 'Filter by Contrarian in Semantic Map',
      icon: <Sparkles size={13} className="text-[#C5FF4A]" />
    },
    {
      id: 'pdf',
      category: 'Executive Briefs',
      title: 'Export Vector Radar PDF',
      description: 'Click "Export Full PDF Report" in the sidebar to produce a publication-grade strategy dossier complete with the captured Resonance Radar canvas and competitor analysis.',
      actionHint: 'Sidebar > Export PDF',
      icon: <FileDown size={13} className="text-[#C5FF4A]" />
    }
  ];

  // Close on outside click or ESC
  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (popoverRef.current && !popoverRef.current.contains(e.target as Node)) {
        setIsOpen(false);
      }
    }
    function handleKeyDown(e: KeyboardEvent) {
      if (e.key === 'Escape') setIsOpen(false);
    }
    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
      document.addEventListener('keydown', handleKeyDown);
    }
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, [isOpen]);

  const activeTip = tips[activeTipIndex];

  return (
    <div className="relative inline-block" ref={popoverRef}>
      {/* Trigger Button in Nav */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className={cn(
          "text-[9px] font-mono border px-2.5 sm:px-3 py-1.5 flex items-center gap-1.5 uppercase transition-all cursor-pointer whitespace-nowrap",
          isOpen
            ? "bg-[#C5FF4A] text-black border-[#C5FF4A] font-bold"
            : "text-white/70 hover:text-white border-white/20 hover:border-[#C5FF4A]/50 bg-white/5 hover:bg-white/10"
        )}
        title="Quick Operational Tips"
        aria-expanded={isOpen}
      >
        <Lightbulb size={11} className={isOpen ? "text-black fill-black" : "text-[#C5FF4A]"} />
        <span className="hidden sm:inline font-mono">Quick Tips</span>
        <span className="w-1.5 h-1.5 rounded-full bg-[#C5FF4A] animate-pulse" />
      </button>

      {/* Floating Popover Card */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 6, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 4, scale: 0.98 }}
            transition={{ duration: 0.15 }}
            className="absolute right-0 top-full mt-2 w-[340px] sm:w-[420px] bg-[#0D0D0D] border border-white/20 shadow-2xl p-5 z-50 rounded-none text-left"
          >
            {/* Header */}
            <div className="flex items-center justify-between border-b border-white/10 pb-3 mb-4">
              <div className="flex items-center gap-2">
                <span className="p-1 bg-[#C5FF4A]/10 border border-[#C5FF4A]/30 text-[#C5FF4A]">
                  <Lightbulb size={12} />
                </span>
                <div>
                  <h4 className="text-xs font-mono uppercase tracking-widest text-[#C5FF4A] font-bold">
                    OPERATOR_QUICK_TIPS
                  </h4>
                  <p className="text-[10px] text-white/50 font-mono">Tactical Field Directives</p>
                </div>
              </div>
              <button
                onClick={() => setIsOpen(false)}
                className="p-1 text-white/40 hover:text-white hover:bg-white/10 transition-colors cursor-pointer"
              >
                <X size={14} />
              </button>
            </div>

            {/* Tip Category Tabs */}
            <div className="grid grid-cols-4 gap-1 mb-4 border-b border-white/10 pb-3">
              {tips.map((t, idx) => (
                <button
                  key={t.id}
                  onClick={() => setActiveTipIndex(idx)}
                  className={cn(
                    "px-2 py-1 text-[8px] font-mono uppercase tracking-tight flex flex-col items-center gap-1 transition-all border cursor-pointer",
                    activeTipIndex === idx
                      ? "bg-[#C5FF4A]/10 text-[#C5FF4A] border-[#C5FF4A]"
                      : "text-white/40 border-white/5 hover:text-white hover:border-white/20"
                  )}
                >
                  <div className="p-0.5">{t.icon}</div>
                  <span className="truncate w-full text-center">{t.category.split(' ')[0]}</span>
                </button>
              ))}
            </div>

            {/* Active Tip Content */}
            <div className="p-4 bg-zinc-950/80 border border-white/10 space-y-2 mb-4">
              <div className="flex items-center justify-between">
                <span className="text-[8px] uppercase tracking-widest font-mono text-[#C5FF4A] bg-[#C5FF4A]/10 px-2 py-0.5 border border-[#C5FF4A]/20">
                  {activeTip.category}
                </span>
                <span className="text-[8px] font-mono text-white/40">
                  TIP {activeTipIndex + 1} OF {tips.length}
                </span>
              </div>
              <h5 className="text-sm font-serif italic text-white pt-1">
                {activeTip.title}
              </h5>
              <p className="text-[11px] text-white/70 font-light leading-relaxed">
                {activeTip.description}
              </p>
              {activeTip.actionHint && (
                <div className="pt-2 flex items-center gap-1.5 text-[9px] font-mono text-white/40">
                  <ChevronRight size={10} className="text-[#C5FF4A]" />
                  <span className="italic">Action: {activeTip.actionHint}</span>
                </div>
              )}
            </div>

            {/* Navigation & Guide Footer */}
            <div className="flex items-center justify-between pt-1 text-[9px] font-mono">
              <div className="flex items-center gap-1">
                {tips.map((_, i) => (
                  <button
                    key={i}
                    onClick={() => setActiveTipIndex(i)}
                    className={cn(
                      "w-4 h-1 transition-all cursor-pointer",
                      activeTipIndex === i ? "bg-[#C5FF4A]" : "bg-white/20 hover:bg-white/40"
                    )}
                  />
                ))}
              </div>

              {onOpenGuide && (
                <button
                  onClick={() => {
                    setIsOpen(false);
                    onOpenGuide();
                  }}
                  className="text-white/60 hover:text-[#C5FF4A] transition-colors flex items-center gap-1 cursor-pointer"
                >
                  <span>Full Methodology Guide</span>
                  <ChevronRight size={10} />
                </button>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
