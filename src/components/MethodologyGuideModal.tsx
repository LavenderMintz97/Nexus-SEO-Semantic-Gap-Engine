import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  X, 
  BookOpen, 
  Sparkles, 
  Compass, 
  Target, 
  Swords, 
  TrendingUp, 
  CheckCircle2, 
  AlertCircle,
  ArrowRight
} from 'lucide-react';
import { cn } from '../lib/utils';

interface MethodologyGuideModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const MethodologyGuideModal: React.FC<MethodologyGuideModalProps> = ({
  isOpen,
  onClose
}) => {
  const [activeGuideTab, setActiveGuideTab] = useState<'concept' | 'metrics' | 'workflow' | 'competitor' | 'semanticGaps'>('concept');

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 md:p-10 bg-black/80 backdrop-blur-md overflow-y-auto">
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 20 }}
          transition={{ duration: 0.25, ease: 'easeOut' }}
          className="relative w-full max-w-4xl max-h-[90vh] flex flex-col bg-[#0A0A0A] border border-[#F5F5F0]/20 shadow-2xl overflow-hidden"
          onClick={(e) => e.stopPropagation()}
        >
          {/* Header */}
          <div className="p-6 md:p-8 border-b border-[#F5F5F0]/10 flex justify-between items-center shrink-0">
            <div className="flex items-center gap-3">
              <div className="w-3.5 h-3.5 bg-[#C5FF4A] rounded-full" />
              <div>
                <span className="text-[10px] uppercase tracking-[0.3em] font-mono text-[#C5FF4A] block">
                  SYSTEM_METHODOLOGY_DOC // V.04
                </span>
                <h2 className="text-2xl md:text-3xl font-serif italic text-white">
                  Operator's Guide to Semantic Resonance
                </h2>
              </div>
            </div>
            <button
              onClick={onClose}
              className="p-2 border border-[#F5F5F0]/10 hover:border-[#C5FF4A] hover:text-[#C5FF4A] transition-all text-[#F5F5F0]/60 cursor-pointer"
            >
              <X size={18} />
            </button>
          </div>

          {/* Guide Sub-navigation Tabs */}
          <div className="border-b border-[#F5F5F0]/10 px-6 md:px-8 flex gap-4 md:gap-8 overflow-x-auto no-scrollbar shrink-0">
            {[
              { id: 'concept', label: '1. Core Doctrine' },
              { id: 'metrics', label: '2. Metric Decoder' },
              { id: 'workflow', label: '3. Step-by-Step Playbook' },
              { id: 'competitor', label: '4. Competitor Gap Checks' },
              { id: 'semanticGaps', label: '5. Entity, SERP & PDF Directives' }
            ].map(t => (
              <button
                key={t.id}
                onClick={() => setActiveGuideTab(t.id as any)}
                className={cn(
                  "py-4 text-[10px] uppercase tracking-widest font-mono font-bold transition-all border-b-2 whitespace-nowrap cursor-pointer",
                  activeGuideTab === t.id
                    ? "text-[#C5FF4A] border-[#C5FF4A]"
                    : "opacity-40 border-transparent hover:opacity-100"
                )}
              >
                {t.label}
              </button>
            ))}
          </div>

          {/* Guide Body Content */}
          <div className="p-6 md:p-10 overflow-y-auto space-y-8 flex-1 custom-scrollbar text-left font-sans">
            {activeGuideTab === 'concept' && (
              <div className="space-y-6">
                <div className="border-l-2 border-[#C5FF4A] pl-4 py-1">
                  <div className="text-[9px] uppercase font-mono tracking-widest text-[#C5FF4A] mb-1 font-bold">
                    THE PARADIGM SHIFT
                  </div>
                  <h3 className="text-xl md:text-2xl font-serif italic">
                    Why Traditional "Skyscraper" SEO Is Being Demolished
                  </h3>
                </div>

                <p className="text-sm opacity-70 leading-relaxed font-light">
                  For over a decade, traditional SEO tools advised creators to take the top 10 search results, aggregate all their headings, and write a longer, wordier version. Search engines have evolved. Under Google's <strong>Helpful Content System</strong> and the foundational <strong>Information Gain Patent (US Patent 10,698,958 B2)</strong>, algorithmic rankers penalize documents that merely repeat what the user has already read.
                </p>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-2">
                  <div className="p-5 border border-rose-500/20 bg-rose-500/5 space-y-2">
                    <div className="flex items-center gap-2 text-rose-400 text-xs font-mono font-bold uppercase">
                      <AlertCircle size={14} />
                      <span>The Old Way: Saturated Red Ocean</span>
                    </div>
                    <p className="text-xs opacity-60 leading-relaxed">
                      Writing for raw keyword density. Answering the exact same basic FAQ questions everyone else answers. Result: High saturation, zero Information Gain, and eventual ranking collapse during core updates.
                    </p>
                  </div>

                  <div className="p-5 border border-[#C5FF4A]/30 bg-[#C5FF4A]/5 space-y-2">
                    <div className="flex items-center gap-2 text-[#C5FF4A] text-xs font-mono font-bold uppercase">
                      <Sparkles size={14} />
                      <span>The Nexus Way: Semantic Resonance</span>
                    </div>
                    <p className="text-xs opacity-75 leading-relaxed">
                      Discovering <strong>latent semantic entities</strong> that are critically relevant to the searcher's underlying goal, but which top-ranking rivals completely overlook. Result: Maximum Information Gain and defensible domain authority.
                    </p>
                  </div>
                </div>

                <div className="p-6 border border-[#F5F5F0]/10 bg-zinc-950/40 space-y-3">
                  <h4 className="text-sm font-bold uppercase tracking-widest font-mono text-white">
                    What is a "Semantic Gap"?
                  </h4>
                  <p className="text-xs opacity-70 leading-relaxed font-light">
                    A semantic gap is the statistical divergence between what users actually need to solve their query (high relevance) and what current SERP competitors have written (low coverage). NexusSEO's AI engine computes vector distances across the knowledge graph to expose these uncontested opportunity pockets.
                  </p>
                </div>
              </div>
            )}

            {activeGuideTab === 'metrics' && (
              <div className="space-y-6">
                <div className="border-l-2 border-[#C5FF4A] pl-4 py-1">
                  <div className="text-[9px] uppercase font-mono tracking-widest text-[#C5FF4A] mb-1 font-bold">
                    SYSTEM DICTIONARY
                  </div>
                  <h3 className="text-xl md:text-2xl font-serif italic">
                    Deconstructing the Resonance Telemetry
                  </h3>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="p-5 border border-[#F5F5F0]/10 bg-zinc-950/30 space-y-2">
                    <div className="text-[10px] font-mono uppercase text-[#C5FF4A] font-bold">
                      Gain Density (0–100%)
                    </div>
                    <p className="text-xs opacity-65 leading-relaxed font-light">
                      The overall novelty index of your proposed content. A score &gt;75% signifies that the synthesized topic offers substantial net-new informational value that will trigger positive Information Gain signals.
                    </p>
                  </div>

                  <div className="p-5 border border-[#F5F5F0]/10 bg-zinc-950/30 space-y-2">
                    <div className="text-[10px] font-mono uppercase text-[#C5FF4A] font-bold">
                      Resonance Potential / Opportunity (0–100%)
                    </div>
                    <p className="text-xs opacity-65 leading-relaxed font-light">
                      Calculated as the ratio of semantic relevance against competitor silence. Concepts scoring 80%+ should become foundational H2 sections or dedicated deep-dive guides.
                    </p>
                  </div>

                  <div className="p-5 border border-[#F5F5F0]/10 bg-zinc-950/30 space-y-2">
                    <div className="text-[10px] font-mono uppercase text-[#C5FF4A] font-bold">
                      Saturation (Competitor Coverage %)
                    </div>
                    <p className="text-xs opacity-65 leading-relaxed font-light">
                      How extensively the top 10 results already discuss this concept. When saturation is above 75%, do not dwell on it—mention it briefly or frame it through a contrarian angle.
                    </p>
                  </div>

                  <div className="p-5 border border-[#F5F5F0]/10 bg-zinc-950/30 space-y-2">
                    <div className="text-[10px] font-mono uppercase text-[#C5FF4A] font-bold">
                      Intent Archetype
                    </div>
                    <p className="text-xs opacity-65 leading-relaxed font-light">
                      Classifies the psychological driver: <em>Informational</em> (deep learning), <em>Transactional</em> (decision/execution), <em>Commercial</em> (solution evaluation), or <em>Navigational</em>.
                    </p>
                  </div>
                </div>

                <div className="p-5 border border-[#C5FF4A]/20 bg-[#C5FF4A]/5">
                  <span className="text-[9px] uppercase tracking-widest font-mono text-[#C5FF4A] block mb-1 font-bold">
                    TACTICAL DIRECTIVES
                  </span>
                  <p className="text-xs opacity-80 leading-relaxed">
                    Clicking on any node inside the Strategic Gaps list or Radar chart reveals a tailored <strong>Tactical Directive</strong>. These are prescriptive editorial recipes—specifying whether to insert empirical benchmark tables, contrarian frameworks, or code-level implementations.
                  </p>
                </div>
              </div>
            )}

            {activeGuideTab === 'workflow' && (
              <div className="space-y-6">
                <div className="border-l-2 border-[#C5FF4A] pl-4 py-1">
                  <div className="text-[9px] uppercase font-mono tracking-widest text-[#C5FF4A] mb-1 font-bold">
                    OPERATIONAL PLAYBOOK
                  </div>
                  <h3 className="text-xl md:text-2xl font-serif italic">
                    The 5-Phase Execution Workflow
                  </h3>
                </div>

                <div className="space-y-4">
                  {[
                    {
                      step: '01',
                      title: 'Synthesize Seed Keyword & Context',
                      desc: 'Enter your primary target keyword on the landing view. If you have an existing blog post or draft, paste it into Environmental Context so the engine measures gaps specific to your current baseline.'
                    },
                    {
                      step: '02',
                      title: 'Examine the Semantic Map & Opportunity Radar',
                      desc: 'Inspect the Strategic Gaps list and Radar. Focus on nodes where the Opportunity Score is highest. Click individual nodes to inspect their Tactical Directives.'
                    },
                    {
                      step: '03',
                      title: 'Audit Rival Blind Spots in Competitor Gap Tab',
                      desc: 'Benchmark your target against a key competitor (e.g. ahrefs.com or a direct rival). Discover where their coverage falls flat and capture their uncontested whitespace.'
                    },
                    {
                      step: '04',
                      title: 'Export the Narrative Blueprint',
                      desc: 'Switch to Narrative Blueprint to view the recommended H1 and H2/H3 structured architecture. Export as JSON or TEXT to pass directly to your editorial team.'
                    },
                    {
                      step: '05',
                      title: 'Track Gain Velocity on the Historical Sparkline',
                      desc: 'Re-audit your keyword after updating your content. The Historical Sparkline in the sidebar tracks how your Information Gain potential increases over successive revisions.'
                    }
                  ].map((s, idx) => (
                    <div key={idx} className="flex gap-4 p-4 border border-[#F5F5F0]/10 bg-zinc-950/20">
                      <div className="text-xl font-mono font-bold text-[#C5FF4A] shrink-0">
                        {s.step}
                      </div>
                      <div className="space-y-1">
                        <h4 className="text-sm font-bold uppercase tracking-wider text-white">
                          {s.title}
                        </h4>
                        <p className="text-xs opacity-60 leading-relaxed font-light">
                          {s.desc}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {activeGuideTab === 'competitor' && (
              <div className="space-y-6">
                <div className="border-l-2 border-[#C5FF4A] pl-4 py-1">
                  <div className="text-[9px] uppercase font-mono tracking-widest text-[#C5FF4A] mb-1 font-bold">
                    COMPETITIVE WARFARE
                  </div>
                  <h3 className="text-xl md:text-2xl font-serif italic">
                    How Competitor Gap Checking Works
                  </h3>
                </div>

                <p className="text-sm opacity-70 leading-relaxed font-light">
                  Rather than copying what high-ranking competitors do, the Competitor Gap Checker dissects their content to find where they got lazy, superficial, or omitted vital adjacent concepts.
                </p>

                <div className="space-y-4 pt-2">
                  <div className="p-5 border border-[#F5F5F0]/10 bg-zinc-950/30 space-y-2">
                    <div className="text-xs font-mono uppercase text-[#C5FF4A] font-bold">
                      1. Identifying Their Saturated Moat
                    </div>
                    <p className="text-xs opacity-65 leading-relaxed font-light">
                      The tool flags the areas where the competitor is already deeply entrenched. Competing head-on on these exact sub-points is high effort and low return.
                    </p>
                  </div>

                  <div className="p-5 border border-[#F5F5F0]/10 bg-zinc-950/30 space-y-2">
                    <div className="text-xs font-mono uppercase text-[#C5FF4A] font-bold">
                      2. Exploiting Their Blind Spots
                    </div>
                    <p className="text-xs opacity-65 leading-relaxed font-light">
                      Shows subtopics where the rival has &lt;35% coverage while user interest is &gt;70%. By giving these points prominence in your article, search engine crawlers perceive your document as mathematically superior in topical completeness.
                    </p>
                  </div>

                  <div className="p-5 border border-[#F5F5F0]/10 bg-zinc-950/30 space-y-2">
                    <div className="text-xs font-mono uppercase text-[#C5FF4A] font-bold">
                      3. Uncontested Whitespace
                    </div>
                    <p className="text-xs opacity-65 leading-relaxed font-light">
                      Topics that the competitor completely failed to mention. Answering these queries gives you exclusive ownership of secondary search intents.
                    </p>
                  </div>
                </div>
              </div>
            )}

            {activeGuideTab === 'semanticGaps' && (
              <div className="space-y-6">
                <div className="border-l-2 border-[#C5FF4A] pl-4 py-1">
                  <div className="text-[9px] uppercase font-mono tracking-widest text-[#C5FF4A] mb-1 font-bold">
                    NEXT-GEN OPTIMIZATION
                  </div>
                  <h3 className="text-xl md:text-2xl font-serif italic">
                    Entity Knowledge Graphs, SERP Targets & PDF Reports
                  </h3>
                </div>

                <p className="text-sm opacity-70 leading-relaxed font-light">
                  Modern search systems evaluate semantic completeness using Named Entity Recognition (NER) and Knowledge Graph salience rather than raw keyword density.
                </p>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-2">
                  <div className="p-5 border border-[#F5F5F0]/10 bg-zinc-950/40 space-y-2">
                    <div className="text-xs font-mono uppercase text-[#C5FF4A] font-bold">
                      Entity Salience & Wikidata Nodes
                    </div>
                    <p className="text-xs opacity-65 leading-relaxed font-light">
                      Google's NLP maps relationships between canonical entities. The Entity Graph tab isolates the exact nodes (patents, algorithms, standard definitions) that rival articles overlook. Incorporating these into H2/H3 headings elevates overall topical authority.
                    </p>
                  </div>

                  <div className="p-5 border border-[#F5F5F0]/10 bg-zinc-950/40 space-y-2">
                    <div className="text-xs font-mono uppercase text-[#C5FF4A] font-bold">
                      AI Overview & Snippet Directives
                    </div>
                    <p className="text-xs opacity-65 leading-relaxed font-light">
                      The SERP Targets tab provides exact architectural directives (e.g. 42-word concise definitions, comparative markdown tables, numbered step sequences) formatted specifically to trigger Position 0 and AI Overview citations.
                    </p>
                  </div>

                  <div className="p-5 border border-[#F5F5F0]/10 bg-zinc-950/40 space-y-2 md:col-span-2">
                    <div className="text-xs font-mono uppercase text-[#C5FF4A] font-bold">
                      Professional PDF Executive Export
                    </div>
                    <p className="text-xs opacity-65 leading-relaxed font-light">
                      Click the "EXPORT FULL PDF REPORT" button to produce a multi-page, publication-grade strategy document. The PDF bundles your custom Resonance Radar snapshot, Information Gain score, Competitor Gap matrix, Entity Knowledge Graph nodes, and the complete H1/H2 editorial blueprint ready for executive review.
                    </p>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Footer CTA */}
          <div className="p-6 border-t border-[#F5F5F0]/10 bg-zinc-950/80 flex flex-col sm:flex-row justify-between items-center gap-4 shrink-0">
            <div className="text-[9px] font-mono opacity-40 uppercase tracking-widest">
              NEXUS_SEO // KNOWLEDGE GRAPH COGNITION
            </div>
            <button
              onClick={onClose}
              className="px-6 py-2.5 bg-[#C5FF4A] text-black font-bold text-xs uppercase tracking-widest hover:brightness-110 transition-all cursor-pointer"
            >
              Close Guide & Continue
            </button>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};
