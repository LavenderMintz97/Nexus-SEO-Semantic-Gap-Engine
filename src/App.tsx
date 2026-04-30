import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Search, 
  Zap, 
  Target, 
  Layers, 
  ChevronRight, 
  ArrowRight, 
  Loader2, 
  Layout, 
  FileText, 
  BarChart3,
  Lightbulb,
  CheckCircle2,
  AlertCircle,
  Sparkles
} from 'lucide-react';
import { 
  Radar, 
  RadarChart, 
  PolarGrid, 
  PolarAngleAxis, 
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  Cell,
  ScatterChart,
  Scatter,
  ZAxis,
  LabelList
} from 'recharts';
import { cn } from './lib/utils';
import { analyzeSEO } from './services/geminiService';
import { SEOAnalysis, AppState } from './types';

// --- Components ---

const ResonanceVisual = ({ score }: { score: number }) => (
  <div className="relative w-full h-[120px] border-b border-[#F5F5F0]/10 mb-12 overflow-hidden">
    <svg className="absolute inset-0 w-full h-full" preserveAspectRatio="none">
      <motion.path 
        d={`M 0 60 Q ${250} ${60 - (score * 0.5)} 500 60 T 1000 60`}
        fill="none" 
        stroke="#C5FF4A" 
        strokeWidth="1" 
        opacity="0.4"
        initial={{ pathLength: 0 }}
        animate={{ pathLength: 1 }}
        transition={{ duration: 2, ease: "easeInOut" }}
      />
      <motion.path 
        d={`M 0 60 Q ${300} ${60 + (score * 0.3)} 600 60 T 1200 60`}
        fill="none" 
        stroke="#F5F5F0" 
        strokeWidth="0.5" 
        opacity="0.1"
      />
      <circle cx="50%" cy="60" r="4" fill="#C5FF4A" className="animate-pulse" />
    </svg>
    <div className="absolute top-2 left-0 text-[8px] uppercase tracking-[0.4em] opacity-30 font-mono">Resonance Waveform _V.01</div>
    <div className="absolute bottom-2 right-0 text-[8px] uppercase tracking-[0.4em] opacity-30 font-mono">Gain Density: {score}%</div>
  </div>
);

const Button = ({ 
  children, 
  className, 
  variant = 'primary', 
  ...props 
}: React.ButtonHTMLAttributes<HTMLButtonElement> & { variant?: 'primary' | 'secondary' | 'outline' }) => {
  const variants = {
    primary: 'bg-[#C5FF4A] text-black hover:brightness-110 border-none px-8 py-3 font-bold text-xs uppercase tracking-widest',
    secondary: 'bg-zinc-900 text-[#F5F5F0] hover:bg-zinc-800 border-none px-8 py-3 font-bold text-xs uppercase tracking-widest',
    outline: 'bg-transparent text-[#C5FF4A] border border-[#C5FF4A] hover:bg-[#C5FF4A]/10 px-8 py-3 font-bold text-xs uppercase tracking-widest'
  };

  return (
    <button 
      className={cn(
        'transition-all duration-300 flex items-center justify-center gap-2 cursor-pointer disabled:opacity-30 disabled:cursor-not-allowed',
        variants[variant],
        className
      )}
      {...props}
    >
      {children}
    </button>
  );
};

const Card = ({ children, className }: { children: React.ReactNode; className?: string }) => (
  <div className={cn('bg-[#0A0A0A] border border-[#F5F5F0]/10 rounded-none overflow-hidden', className)}>
    {children}
  </div>
);

const Badge = ({ children, className }: { children: React.ReactNode; className?: string }) => (
  <span className={cn('px-3 py-1 rounded-none text-[9px] font-bold uppercase tracking-[0.2em] bg-transparent border border-[#F5F5F0]/20 text-[#F5F5F0]/60', className)}>
    {children}
  </span>
);

// --- Main App ---

export default function App() {
  const [state, setState] = useState<AppState>('landing');
  const [activeTab, setActiveTab] = useState<'map' | 'landscape' | 'blueprint'>('map');
  const [selectedGapIndex, setSelectedGapIndex] = useState<number | null>(null);
  const [keyword, setKeyword] = useState('');
  const [context, setContext] = useState('');
  const [analysis, setAnalysis] = useState<SEOAnalysis | null>(null);
  const [savedAnalyses, setSavedAnalyses] = useState<SEOAnalysis[]>([]);
  const [compareIds, setCompareIds] = useState<string[]>([]);
  const [error, setError] = useState<string | null>(null);

  // Load history on mount
  useEffect(() => {
    const saved = localStorage.getItem('nexus_seo_history');
    if (saved) {
      try {
        setSavedAnalyses(JSON.parse(saved));
      } catch (e) {
        console.error("Failed to parse history", e);
      }
    }
  }, []);

  // Save history on change
  useEffect(() => {
    localStorage.setItem('nexus_seo_history', JSON.stringify(savedAnalyses));
  }, [savedAnalyses]);

  const handleAnalyze = async (manualKeyword?: string | React.MouseEvent | React.KeyboardEvent) => {
    const targetKeyword = typeof manualKeyword === 'string' ? manualKeyword : keyword;
    if (!targetKeyword || typeof targetKeyword !== 'string' || !targetKeyword.trim()) return;
    
    setKeyword(targetKeyword); // Sync for related keyword clicks
    setState('analyzing');
    setError(null);
    try {
      const result = await analyzeSEO(targetKeyword, context);
      const enrichedResult: SEOAnalysis = {
        ...result,
        id: crypto.randomUUID(),
        timestamp: Date.now()
      };
      setAnalysis(enrichedResult);
      setSavedAnalyses(prev => [enrichedResult, ...prev]);
      setState('results');
      setActiveTab('map');
      setSelectedGapIndex(null);
    } catch (err) {
      console.error(err);
      setError('Failed to synthesize resonance. Please verify connectivity.');
      setState('landing');
    }
  };

  const exportReport = (format: 'json' | 'text') => {
    if (!analysis) return;
    let content = "";
    if (format === 'json') {
      content = JSON.stringify(analysis, null, 2);
    } else {
      content = `NEXUS SEO REPORT: ${analysis.keyword}\n`;
      content += `TIMESTAMP: ${new Date(analysis.timestamp).toLocaleString()}\n`;
      content += `GAIN POTENTIAL: ${analysis.informationGainPotential}%\n\n`;
      content += `STRATEGY: ${analysis.differentiatorStrategy}\n\n`;
      content += `SEMANTIC GAPS:\n`;
      analysis.semanticGaps.forEach(g => {
        content += `- ${g.concept} (${g.opportunityScore}%): ${g.description}\n`;
      });
    }

    const blob = new Blob([content], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `nexus_report_${analysis.id.substring(0,8)}.${format === 'json' ? 'json' : 'txt'}`;
    a.click();
  };

  const deleteAnalysis = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    setSavedAnalyses(prev => prev.filter(a => a.id !== id));
  };

  const toggleCompare = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    setCompareIds(prev => {
      if (prev.includes(id)) return prev.filter(i => i !== id);
      if (prev.length >= 2) return [prev[1], id];
      return [...prev, id];
    });
  };

  const renderComparison = () => {
    const a = savedAnalyses.find(x => x.id === compareIds[0]);
    const b = savedAnalyses.find(x => x.id === compareIds[1]);
    if (!a || !b) return null;

    const gainDiff = b.informationGainPotential - a.informationGainPotential;

    return (
      <div className="grid grid-cols-2 gap-8 divide-x divide-[#F5F5F0]/10">
        {[a, b].map((item, idx) => {
          const other = idx === 0 ? b : a;
          const isWinnerGain = item.informationGainPotential > other.informationGainPotential;
          const isTieGain = item.informationGainPotential === other.informationGainPotential;

          return (
            <div key={idx} className="space-y-6 px-4">
               <div className="flex justify-between items-center">
                 <div className="text-[10px] uppercase tracking-widest opacity-40 font-mono">VECTOR_{idx === 0 ? 'A' : 'B'}</div>
                 {idx === 1 && !isTieGain && (
                   <span className={cn(
                     "text-[9px] font-bold px-2 py-0.5 font-mono",
                     gainDiff > 0 ? "bg-[#C5FF4A] text-black" : "bg-red-500/20 text-red-400 border border-red-500/30"
                   )}>
                     DELTA: {gainDiff > 0 ? `+${gainDiff}` : gainDiff}%
                   </span>
                 )}
               </div>
               
               <h3 className="text-4xl font-serif italic text-[#C5FF4A]">{item.keyword}</h3>
               
               <div className="flex gap-8 p-6 border border-[#F5F5F0]/5 bg-zinc-950/30">
                 <div>
                    <div className="text-[9px] opacity-30 uppercase tracking-widest mb-1">Gain Potential</div>
                    <div className={cn(
                      "text-3xl font-mono flex items-center gap-2",
                      isWinnerGain ? "text-[#C5FF4A]" : "text-white opacity-60"
                    )}>
                      {item.informationGainPotential}%
                      {isWinnerGain && <Zap size={16} className="fill-[#C5FF4A]" />}
                    </div>
                 </div>
                 <div>
                    <div className="text-[9px] opacity-30 uppercase tracking-widest mb-1">Intent</div>
                    <div className="text-2xl font-serif italic">{item.primaryIntent}</div>
                 </div>
               </div>

               <div className="space-y-4">
                 <label className="text-[9px] uppercase tracking-[0.3em] opacity-30 block">Semantic Resonance Nodes</label>
                 {item.semanticGaps.slice(0, 5).map((g, i) => {
                   // Simple heuristic: check if other has this concept
                   const otherGap = other.semanticGaps.find(x => x.concept === g.concept);
                   const isBetterScore = otherGap ? g.opportunityScore > otherGap.opportunityScore : null;

                   return (
                     <div key={i} className="p-4 border border-[#F5F5F0]/10 bg-zinc-950/50 flex justify-between items-center group hover:border-[#C5FF4A]/30 transition-colors">
                        <div>
                          <span className="text-sm font-serif italic text-white group-hover:text-[#C5FF4A] transition-colors">{g.concept}</span>
                          <div className="text-[8px] opacity-30 uppercase tracking-tighter mt-1">{g.description.substring(0, 40)}...</div>
                        </div>
                        <div className="text-right">
                          <div className="flex items-center gap-2">
                             {isBetterScore === true && <ChevronRight size={12} className="text-[#C5FF4A] -rotate-90" />}
                             {isBetterScore === false && <ChevronRight size={12} className="text-red-500 rotate-90" />}
                             <span className={cn(
                               "text-sm font-mono",
                               isBetterScore ? "text-[#C5FF4A]" : "opacity-40"
                             )}>{g.opportunityScore}%</span>
                          </div>
                        </div>
                     </div>
                   );
                 })}
               </div>
            </div>
          );
        })}
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-[#0A0A0A] text-[#F5F5F0] font-sans selection:bg-[#C5FF4A]/30">
      <AnimatePresence mode="wait">
        {state === 'landing' && (
          <motion.div 
            key="landing"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="flex flex-col min-h-screen"
          >
            <header className="p-6 md:p-8 flex justify-between items-center border-b border-[#F5F5F0]/10">
              <div className="flex items-center gap-3">
                <div className="w-4 h-4 bg-[#C5FF4A] rounded-full" />
                <span className="text-xs tracking-[0.3em] font-bold uppercase">NexusSEO</span>
              </div>
              <div className="flex gap-4 md:gap-8 text-[10px] uppercase tracking-widest font-bold opacity-40">
                <button onClick={() => setState('history')} className="hover:opacity-100 transition-opacity uppercase tracking-[0.2em] text-[10px] font-bold">Archives ({savedAnalyses.length})</button>
                <a href="#" className="hidden sm:block hover:opacity-100 transition-opacity">Methodology</a>
              </div>
            </header>

            <main className="flex-1 flex flex-col items-center justify-center max-w-5xl mx-auto px-6 py-12 md:py-20 w-full">
              <div className="text-center mb-12 md:mb-16">
                <h1 className="text-5xl sm:text-7xl md:text-9xl font-serif italic leading-[0.85] tracking-tight mb-8">
                  Semantic<br/>Resonance
                </h1>
                <p className="max-w-xl mx-auto text-[10px] sm:text-sm opacity-50 leading-relaxed font-light uppercase tracking-[0.2em] sm:tracking-widest">
                  Identifying hidden bridges in the knowledge graph to amplify your domain authority.
                </p>
              </div>

              <div className="w-full max-w-2xl bg-transparent p-1 border-t border-[#F5F5F0]/20">
                <div className="grid grid-cols-1 md:grid-cols-12 gap-0">
                  <div className="md:col-span-8 group relative border-b md:border-b-0 md:border-r border-[#F5F5F0]/20">
                    <label className="absolute -top-3 left-0 bg-[#0A0A0A] px-2 text-[9px] uppercase tracking-widest opacity-40">Knowledge Base</label>
                    <input 
                      type="text" 
                      placeholder="ENTER TARGET RESONANCE..."
                      className="w-full bg-transparent p-8 text-xl font-serif italic focus:outline-none placeholder:opacity-20"
                      value={keyword}
                      onChange={(e) => setKeyword(e.target.value)}
                    />
                  </div>
                  <div className="md:col-span-4 self-center p-4">
                    <Button className="w-full" onClick={handleAnalyze} disabled={!keyword.trim()}>
                      SYNTHESIZE
                    </Button>
                  </div>
                </div>
                
                <div className="mt-8 relative border-t border-[#F5F5F0]/20 py-8">
                  <label className="absolute -top-3 left-0 bg-[#0A0A0A] px-2 text-[9px] uppercase tracking-widest opacity-40">Environmental Context</label>
                  <textarea 
                    placeholder="OPTIONAL: INPUT EXISTING NARRATIVE ARCHITECTURE..."
                    rows={2}
                    className="w-full bg-transparent px-2 text-xs opacity-50 focus:outline-none focus:opacity-100 transition-opacity uppercase tracking-widest font-light resize-none"
                    value={context}
                    onChange={(e) => setContext(e.target.value)}
                  />
                </div>

                {error && (
                  <div className="mt-4 text-[#C5FF4A] text-[10px] font-mono tracking-tighter uppercase p-2 border border-[#C5FF4A]/20">
                    {error}
                  </div>
                )}
              </div>
            </main>
          </motion.div>
        )}

        {state === 'analyzing' && (
          <motion.div 
            key="analyzing"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="flex flex-col items-center justify-center min-h-screen p-8"
          >
            <div className="relative w-64 h-64 flex items-center justify-center mb-12">
               {/* Orbital Rings */}
               <motion.div 
                 className="absolute inset-0 border border-[#F5F5F0]/5 rounded-full"
                 animate={{ rotate: 360 }}
                 transition={{ duration: 10, repeat: Infinity, ease: "linear" }}
               />
               <motion.div 
                 className="absolute inset-4 border border-[#C5FF4A]/10 rounded-full"
                 animate={{ rotate: -360 }}
                 transition={{ duration: 15, repeat: Infinity, ease: "linear" }}
               />
               
               <div className="relative text-center">
                  <div className="text-[#C5FF4A] mb-2">
                    <Loader2 className="animate-spin mx-auto" size={48} />
                  </div>
                  <div className="text-[10px] font-mono uppercase tracking-[0.5em] text-[#C5FF4A]">Resonating</div>
               </div>
            </div>

            <div className="w-full max-w-sm space-y-4">
               <div className="bg-zinc-900 h-px relative overflow-hidden">
                  <motion.div 
                    className="absolute inset-0 bg-[#C5FF4A]"
                    initial={{ x: "-100%" }}
                    animate={{ x: "0%" }}
                    transition={{ duration: 5, ease: "easeInOut" }}
                  />
               </div>
               
               <div className="grid grid-cols-1 gap-2 text-center">
                  {[
                    "Initializing semantic vector clusters...",
                    "Scanning top-10 landscape saturation...",
                    "Identifying latent information gain nodes...",
                    "Synthesizing narrative architecture..."
                  ].map((msg, i) => (
                    <motion.div 
                      key={i}
                      initial={{ opacity: 0, y: 5 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: i * 1.2 }}
                      className="text-[9px] uppercase tracking-widest opacity-40 font-mono"
                    >
                      {msg}
                    </motion.div>
                  ))}
               </div>
            </div>
          </motion.div>
        )}

        {state === 'history' && (
          <motion.div 
            key="history"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="flex flex-col min-h-screen"
          >
            <header className="p-8 flex justify-between items-center border-b border-[#F5F5F0]/10">
              <div className="flex items-center gap-3 cursor-pointer" onClick={() => setState('landing')}>
                <div className="w-4 h-4 bg-[#C5FF4A] rounded-full" />
                <span className="text-xs tracking-[0.3em] font-bold uppercase">NexusSEO Archives</span>
              </div>
              <div className="flex gap-4">
                {compareIds.length === 2 && (
                  <Button variant="primary" className="text-[10px]" onClick={() => setState('compare')}>
                    DIFF_COMPARE ({compareIds.length})
                  </Button>
                )}
                <Button variant="outline" className="text-[10px]" onClick={() => setState('landing')}>BACK</Button>
              </div>
            </header>
            <main className="flex-1 p-12 max-w-7xl mx-auto w-full">
               <h2 className="text-5xl font-serif italic mb-12">Saved Resonance Profiles</h2>
               {savedAnalyses.length === 0 ? (
                 <div className="text-center py-24 opacity-30 uppercase tracking-[0.3em]">No frequency logs found</div>
               ) : (
                 <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                   {savedAnalyses.map((a) => (
                     <div 
                        key={a.id} 
                        className={cn(
                          "p-8 border border-[#F5F5F0]/10 group hover:border-[#C5FF4A]/50 transition-all cursor-pointer relative",
                          compareIds.includes(a.id) && "border-[#C5FF4A] bg-[#C5FF4A]/5"
                        )}
                        onClick={() => {
                          setAnalysis(a);
                          setState('results');
                        }}
                     >
                       <div className="flex justify-between items-start mb-6">
                         <span className="text-[9px] font-mono opacity-40">{new Date(a.timestamp).toLocaleDateString()}</span>
                         <div className="flex gap-2">
                           <button 
                             onClick={(e) => toggleCompare(a.id, e)}
                             className={cn("text-[9px] uppercase tracking-tighter font-bold", compareIds.includes(a.id) ? "text-[#C5FF4A]" : "opacity-30 border-b border-transparent hover:border-white")}
                           >
                             {compareIds.includes(a.id) ? 'READY' : 'COMPARE'}
                           </button>
                           <button onClick={(e) => deleteAnalysis(a.id, e)} className="opacity-30 hover:opacity-100 hover:text-red-400">
                             <AlertCircle size={12} />
                           </button>
                         </div>
                       </div>
                       <h3 className="text-2xl font-serif italic mb-4">{a.keyword}</h3>
                       <div className="flex justify-between items-end">
                          <Badge>{a.primaryIntent}</Badge>
                          <div className="text-right">
                             <div className="text-[9px] opacity-30 uppercase">Gain</div>
                             <div className="text-lg font-mono text-[#C5FF4A]">{a.informationGainPotential}%</div>
                          </div>
                       </div>
                     </div>
                   ))}
                 </div>
               )}
            </main>
          </motion.div>
        )}

        {state === 'compare' && (
          <motion.div 
            key="compare"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="flex flex-col min-h-screen"
          >
             <header className="p-8 flex justify-between items-center border-b border-[#F5F5F0]/10">
              <div className="flex items-center gap-3">
                <div className="w-4 h-4 bg-[#C5FF4A] rounded-full" />
                <span className="text-xs tracking-[0.3em] font-bold uppercase">NexusSEO Diff_Tool</span>
              </div>
              <Button variant="outline" className="text-[10px]" onClick={() => setState('history')}>BACK_TO_ARCHIVES</Button>
            </header>
            <main className="flex-1 p-12 max-w-7xl mx-auto w-full">
               <div className="mb-12 flex justify-between items-end">
                 <h2 className="text-6xl font-serif italic">Resonance Duality</h2>
                 <div className="text-[10px] font-mono opacity-30 uppercase">Comparison ID: {compareIds.join(':').substring(0,20)}</div>
               </div>
               {renderComparison()}
            </main>
          </motion.div>
        )}

        {state === 'results' && analysis && (
          <motion.div 
            key="results"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="flex flex-col lg:flex-row h-screen overflow-hidden"
          >
            {/* Left Sidebar */}
            <aside className="w-full lg:w-80 border-b lg:border-b-0 lg:border-r border-[#F5F5F0]/10 p-6 lg:p-8 flex flex-col shrink-0 overflow-y-auto lg:h-full lg:justify-between">
              <div className="space-y-8">
                <div 
                  className="flex items-center gap-2 mb-8 lg:mb-12 cursor-pointer"
                  onClick={() => setState('landing')}
                >
                  <div className="w-4 h-4 bg-[#C5FF4A] rounded-full" />
                  <span className="text-xs tracking-[0.3em] font-bold uppercase">NexusSEO</span>
                </div>

                <h2 className="text-2xl lg:text-3xl font-serif italic mb-6 lg:mb-8 leading-tight">Resonance Profile</h2>

                <div className="space-y-6 lg:space-y-8">
                  <section>
                    <label className="text-[10px] uppercase tracking-widest opacity-50 block mb-3 md:mb-4">Intent Archetype</label>
                    <Badge className="bg-[#C5FF4A] text-black border-none px-4 py-2 text-xs">{analysis.primaryIntent}</Badge>
                  </section>

                  <section>
                    <label className="text-[10px] uppercase tracking-widest opacity-50 block mb-3 md:mb-4">Gain Density</label>
                    <div className="text-3xl lg:text-4xl font-mono text-[#C5FF4A]">{analysis.informationGainPotential}%</div>
                    <div className="w-full bg-zinc-900 h-px mt-2">
                       <div className="bg-[#C5FF4A] h-px" style={{ width: `${analysis.informationGainPotential}%` }} />
                    </div>
                  </section>

                  <section className="p-4 border border-[#F5F5F0]/10 bg-zinc-950/50">
                    <label className="text-[9px] uppercase tracking-widest opacity-30 block mb-2">Strategy</label>
                    <p className="text-[10px] lg:text-[11px] leading-relaxed opacity-70 italic">
                      {analysis.differentiatorStrategy}
                    </p>
                  </section>
                  
                  {/* Discovery Nodes (Related Keywords) */}
                  <section className="space-y-4">
                    <div className="flex justify-between items-end">
                      <label className="text-[10px] uppercase tracking-widest opacity-50 block">Discovery Nodes</label>
                      <Sparkles size={12} className="text-[#C5FF4A] opacity-50" />
                    </div>
                    <div className="flex flex-wrap gap-2">
                       {analysis.relatedKeywords?.map((kw, i) => (
                         <button 
                           key={i} 
                           onClick={() => handleAnalyze(kw)}
                           className="text-[9px] uppercase tracking-widest border border-[#F5F5F0]/10 px-3 py-1.5 hover:border-[#C5FF4A] hover:text-[#C5FF4A] transition-all bg-zinc-950/30"
                         >
                           {kw}
                         </button>
                       ))}
                    </div>
                  </section>

                  <section className="space-y-2 pb-6 lg:pb-0">
                     <label className="text-[10px] uppercase tracking-widest opacity-50 block mb-3 md:mb-4">Export Result</label>
                     <div className="grid grid-cols-2 gap-2">
                        <button onClick={() => exportReport('json')} className="py-2 border border-[#F5F5F0]/20 text-[10px] font-bold uppercase hover:bg-white hover:text-black transition-all">JSON</button>
                        <button onClick={() => exportReport('text')} className="py-2 border border-[#F5F5F0]/20 text-[10px] font-bold uppercase hover:bg-white hover:text-black transition-all">TEXT</button>
                     </div>
                  </section>
                </div>
              </div>

              <div className="space-y-3 lg:space-y-4 mt-8 lg:mt-0">
                <Button variant="secondary" className="w-full text-[10px] lg:text-xs" onClick={() => setState('history')}>
                  VIEW ARCHIVES
                </Button>
                <Button variant="outline" className="w-full text-[10px] lg:text-xs" onClick={() => setState('landing')}>
                  NEW AUDIT
                </Button>
              </div>
            </aside>

            {/* Main Content Area */}
            <main className="flex-1 flex flex-col overflow-y-auto">
              <header className="h-20 border-b border-[#F5F5F0]/10 flex items-center justify-between px-6 lg:px-10 shrink-0">
                <div className="flex gap-4 md:gap-8 h-full overflow-x-auto no-scrollbar">
                  {[
                    { id: 'map', label: 'Semantic Map' },
                    { id: 'landscape', label: 'Landscape' },
                    { id: 'blueprint', label: 'Narrative Blueprint' }
                  ].map(tab => (
                    <button 
                      key={tab.id}
                      onClick={() => setActiveTab(tab.id as any)}
                      className={cn(
                        "h-full px-2 lg:px-4 text-[9px] lg:text-[10px] uppercase tracking-widest font-bold transition-all border-b-2 whitespace-nowrap",
                        activeTab === tab.id ? "text-[#C5FF4A] border-[#C5FF4A]" : "opacity-40 border-transparent hover:opacity-100"
                      )}
                    >
                      {tab.label}
                    </button>
                  ))}
                </div>
                <div className="hidden md:block text-[9px] opacity-40 font-mono">VECTOR_ID: {analysis.id.substring(0,8).toUpperCase()}</div>
              </header>

              <div className="p-6 lg:p-12 space-y-12 lg:space-y-16">
                <div>
                   <ResonanceVisual score={analysis.informationGainPotential} />
                   <h1 className="text-4xl sm:text-6xl lg:text-8xl font-serif italic leading-[0.85] tracking-tight mb-6 break-words">
                    {analysis.keyword}
                  </h1>
                </div>

                {activeTab === 'map' && (
                  <div className="grid grid-cols-1 xl:grid-cols-2 gap-12">
                    {/* Elaborate Listicle Gaps */}
                    <div className="space-y-6">
                      <div className="flex justify-between items-end border-b border-[#F5F5F0]/10 pb-2">
                        <label className="text-[10px] uppercase tracking-widest opacity-50 block">Strategic Gaps</label>
                        <span className="text-[9px] font-mono opacity-30 italic">Click node to expand tactical metadata</span>
                      </div>
                      
                      <div className="space-y-4 max-h-[700px] overflow-y-auto pr-2 custom-scrollbar">
                        {analysis.semanticGaps.map((gap, i) => {
                          const isActive = selectedGapIndex === i;
                          return (
                            <motion.div 
                              key={i} 
                              onClick={() => setSelectedGapIndex(isActive ? null : i)}
                              className={cn(
                                "p-6 border transition-all cursor-pointer group relative overflow-hidden",
                                isActive ? "border-[#C5FF4A] bg-[#C5FF4A]/5 shadow-[0_0_20px_rgba(197,255,74,0.05)]" : "border-[#F5F5F0]/5 bg-zinc-950/20 hover:border-[#F5F5F0]/20"
                              )}
                            >
                              {isActive && (
                                <motion.div 
                                  layoutId="active-indicator"
                                  className="absolute left-0 top-0 bottom-0 w-1 bg-[#C5FF4A]"
                                />
                              )}
                              
                              <div className="flex justify-between items-start mb-4">
                                <div>
                                   <h3 className={cn(
                                     "text-xl font-serif italic transition-colors",
                                     isActive ? "text-[#C5FF4A]" : "text-white group-hover:text-[#C5FF4A]/80"
                                   )}>{gap.concept}</h3>
                                   <div className="flex items-center gap-4 mt-2">
                                      <div className="flex items-center gap-1">
                                        <span className="text-[7px] uppercase opacity-30 font-bold font-mono">RESONANCE:</span>
                                        <div className="w-12 h-1 bg-zinc-900 overflow-hidden rounded-full">
                                           <div className="h-full bg-[#C5FF4A]" style={{ width: `${gap.opportunityScore}%` }} />
                                        </div>
                                      </div>
                                   </div>
                                </div>
                                <div className="text-right">
                                  <div className="text-[8px] font-mono opacity-30 uppercase mb-1">Score</div>
                                  <div className="text-lg font-mono leading-none">{gap.opportunityScore}</div>
                                </div>
                              </div>

                              <p className={cn(
                                "text-xs leading-relaxed uppercase tracking-wider font-light transition-opacity mb-4",
                                isActive ? "opacity-90" : "opacity-40"
                              )}>
                                {gap.description}
                              </p>

                              {isActive && (
                                <motion.div 
                                  initial={{ opacity: 0, height: 0 }}
                                  animate={{ opacity: 1, height: 'auto' }}
                                  className="pt-4 border-t border-[#C5FF4A]/20 mt-4 space-y-4"
                                >
                                   <div>
                                      <div className="text-[9px] text-[#C5FF4A] uppercase tracking-widest font-bold mb-2 font-mono">Tactical_Directive</div>
                                      <div className="text-[11px] font-light leading-relaxed opacity-70 italic mb-4">
                                         {gap.suggestedContent}
                                      </div>
                                   </div>
                                   <div className="grid grid-cols-2 gap-4">
                                      <div className="p-3 bg-white/5 border border-white/5">
                                         <div className="text-[7px] opacity-40 uppercase mb-1">Saturation</div>
                                         <div className="text-xs font-mono">{gap.competitorCoverage}%</div>
                                      </div>
                                      <div className="p-3 bg-white/5 border border-white/5">
                                         <div className="text-[7px] opacity-40 uppercase mb-1">Relevance</div>
                                         <div className="text-xs font-mono">{gap.relevance}%</div>
                                      </div>
                                   </div>
                                </motion.div>
                              )}
                            </motion.div>
                          );
                        })}
                      </div>
                    </div>

                    {/* Interactive Radar Chart */}
                    <div className="space-y-6">
                      <div className="flex justify-between items-end border-b border-[#F5F5F0]/10 pb-2">
                        <label className="text-[10px] uppercase tracking-widest opacity-50 block">Resonance Field</label>
                        <span className="text-[9px] font-mono opacity-30 italic">Interactive Analysis Radar</span>
                      </div>
                      
                      <div className="h-[450px] md:h-[600px] border border-[#F5F5F0]/10 p-8 flex items-center justify-center bg-zinc-950/30 relative group">
                        <div className="absolute inset-0 opacity-10 pointer-events-none overflow-hidden">
                           <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,#C5FF4A_1px,transparent_1px)] bg-[size:40px_40px]" />
                        </div>
                        
                        <ResponsiveContainer width="100%" height="100%">
                          <RadarChart 
                            cx="50%" 
                            cy="50%" 
                            outerRadius="80%" 
                            data={analysis.semanticGaps}
                            onClick={(data: any) => {
                               if (data && data.activePayload && data.activePayload.length > 0) {
                                  const index = analysis.semanticGaps.findIndex(g => g.concept === data.activePayload[0].payload.concept);
                                  setSelectedGapIndex(index);
                               }
                            }}
                          >
                            <PolarGrid stroke="#2e2e2e" strokeWidth={0.5} />
                            <PolarAngleAxis 
                               dataKey="concept" 
                               tick={(props: any) => {
                                 const { x, y, payload } = props;
                                 const index = analysis.semanticGaps.findIndex(g => g.concept === payload.value);
                                 const isSelected = selectedGapIndex === index;
                                 return (
                                   <text 
                                     x={x} 
                                     y={y} 
                                     textAnchor="middle" 
                                     fill={isSelected ? '#C5FF4A' : '#F5F5F0'} 
                                     fontSize={isSelected ? 11 : 9} 
                                     className={cn(
                                       "font-serif italic transition-all duration-300 cursor-pointer",
                                       isSelected ? "opacity-100 font-bold" : "opacity-40 hover:opacity-100"
                                     )}
                                     onClick={() => setSelectedGapIndex(index)}
                                   >
                                     {payload.value}
                                   </text>
                                 );
                               }}
                            />
                            <Radar
                              name="Opportunity"
                              dataKey="opportunityScore"
                              stroke={selectedGapIndex !== null ? '#C5FF4A' : '#C5FF4A'}
                              strokeWidth={2}
                              fill="#C5FF4A"
                              fillOpacity={0.15}
                              activeDot={{ r: 6, fill: '#C5FF4A', stroke: '#000', strokeWidth: 2 }}
                            />
                            <Tooltip 
                              content={({ active, payload }) => {
                                if (active && payload && payload.length) {
                                  return (
                                    <div className="bg-[#0A0A0A] border border-[#C5FF4A] p-3 text-[10px] font-mono shadow-2xl">
                                      <div className="text-[#C5FF4A] uppercase mb-1">{payload[0].payload.concept}</div>
                                      <div className="opacity-50">SCORE: {payload[0].value}</div>
                                    </div>
                                  );
                                }
                                return null;
                              }}
                            />
                          </RadarChart>
                        </ResponsiveContainer>
                        
                        {/* Legend / Status Overlay */}
                        <div className="absolute bottom-6 right-6">
                           <div className="text-[8px] font-mono opacity-20 uppercase tracking-[0.4em] transform -rotate-90 origin-right whitespace-nowrap">Resonance_Signal_v2.0</div>
                        </div>
                      </div>
                    </div>
                  </div>
                )}

                {activeTab === 'landscape' && (
                  <div className="space-y-8">
                     <div className="flex justify-between items-center border-b border-[#F5F5F0]/10 pb-4">
                        <div>
                          <label className="text-[10px] uppercase tracking-widest opacity-50 block mb-1">Semantic Landscape</label>
                          <h3 className="text-2xl font-serif italic">Opportunity vs Coverage</h3>
                        </div>
                        <div className="text-[9px] opacity-30 font-mono flex gap-4">
                           <span className="flex items-center gap-1"><div className="w-1.5 h-1.5 bg-[#C5FF4A]" /> RESONANCE TARGETS</span>
                           <span className="flex items-center gap-1"><div className="w-1.5 h-1.5 bg-zinc-700" /> MARKET NOISE</span>
                        </div>
                     </div>
                     
                     <div className="flex flex-col lg:flex-row gap-8">
                       <div className="flex-1 h-[600px] border border-[#F5F5F0]/10 p-8 bg-zinc-950/20 relative">
                          <ResponsiveContainer width="100%" height="100%">
                            <ScatterChart margin={{ top: 20, right: 40, bottom: 40, left: 20 }}>
                              <XAxis 
                                type="number" 
                                dataKey="competitorCoverage" 
                                name="Coverage" 
                                unit="%" 
                                domain={[0, 100]}
                                stroke="#333" 
                                tick={{ fill: '#666', fontSize: 10 }}
                                label={{ value: 'SATURATION (COMPETITOR COVERAGE)', position: 'insideBottom', offset: -20, fill: '#444', fontSize: 10, tracking: '0.2em' }}
                              />
                              <YAxis 
                                type="number" 
                                dataKey="opportunityScore" 
                                name="Opportunity" 
                                unit="%" 
                                domain={[0, 100]}
                                stroke="#333" 
                                tick={{ fill: '#666', fontSize: 10 }}
                                label={{ value: 'RESONANCE POTENTIAL', angle: -90, position: 'insideLeft', fill: '#444', fontSize: 10, tracking: '0.2em' }}
                              />
                              <ZAxis type="number" dataKey="relevance" range={[100, 1000]} name="Relevance" unit="%" />
                              <Tooltip 
                                cursor={{ stroke: '#C5FF4A', strokeWidth: 0.5, strokeDasharray: '4 4' }}
                                content={({ active, payload }) => {
                                  if (active && payload && payload.length) {
                                    const data = payload[0].payload;
                                    return (
                                      <div className="bg-[#0A0A0A] border border-[#C5FF4A] p-4 shadow-2xl backdrop-blur-md">
                                        <div className="text-[9px] uppercase tracking-widest text-[#C5FF4A] mb-2 font-mono">NODE_ANALYSIS</div>
                                        <div className="text-lg font-serif italic text-white mb-2">{data.concept}</div>
                                        <div className="grid grid-cols-2 gap-4 border-t border-[#F5F5F0]/10 pt-3">
                                          <div>
                                            <div className="text-[8px] opacity-40 uppercase">Resonance</div>
                                            <div className="text-sm font-mono text-[#C5FF4A]">{data.opportunityScore}%</div>
                                          </div>
                                          <div>
                                            <div className="text-[8px] opacity-40 uppercase">Saturation</div>
                                            <div className="text-sm font-mono">{data.competitorCoverage}%</div>
                                          </div>
                                        </div>
                                      </div>
                                    );
                                  }
                                  return null;
                                }}
                              />
                              <Scatter name="Gaps" data={analysis.semanticGaps} fill="#C5FF4A">
                                 {analysis.semanticGaps.map((entry, index) => (
                                  <Cell 
                                    key={`cell-${index}`} 
                                    fill={entry.opportunityScore > 75 && entry.competitorCoverage < 40 ? '#C5FF4A' : '#222'} 
                                    stroke={entry.opportunityScore > 75 && entry.competitorCoverage < 40 ? '#C5FF4A' : '#444'}
                                    className="transition-all duration-500 cursor-crosshair opacity-80 hover:opacity-100"
                                  />
                                ))}
                              </Scatter>
                            </ScatterChart>
                          </ResponsiveContainer>
                          
                          {/* Overlay regions */}
                          <div className="absolute top-8 left-8 p-3 border-l border-t border-[#C5FF4A]/20 pointer-events-none">
                             <div className="text-[8px] text-[#C5FF4A] uppercase tracking-[0.4em] font-bold">Primary Opportunity Zone</div>
                          </div>
                       </div>

                       {/* Interactive Node List */}
                       <div className="w-full lg:w-80 space-y-4">
                          <label className="text-[10px] uppercase tracking-widest opacity-50 block border-b border-[#F5F5F0]/10 pb-2">Landscape Nodes</label>
                          <div className="space-y-2 max-h-[500px] overflow-y-auto pr-2 custom-scrollbar">
                             {[...analysis.semanticGaps].sort((a,b) => b.opportunityScore - a.opportunityScore).map((gap, i) => (
                               <div key={i} className="p-3 border border-[#F5F5F0]/5 bg-zinc-950/20 hover:border-[#C5FF4A]/40 transition-colors group">
                                  <div className="flex justify-between items-start mb-1">
                                     <span className="text-xs font-serif italic text-white group-hover:text-[#C5FF4A] transition-colors">{gap.concept}</span>
                                     <span className="text-[9px] font-mono text-[#C5FF4A]">{gap.opportunityScore}%</span>
                                  </div>
                                  <div className="text-[8px] opacity-30 uppercase tracking-tighter">Saturation: {gap.competitorCoverage}%</div>
                               </div>
                             ))}
                          </div>
                       </div>
                     </div>

                     <p className="text-[10px] opacity-30 italic font-mono uppercase tracking-[0.2em] text-center border-t border-[#F5F5F0]/5 pt-4">
                        The interactive landscape map allows for multidimensional discovery of latent semantic content nodes.
                     </p>
                  </div>
                )}

                {activeTab === 'blueprint' && (
                  <div className="space-y-6">
                    <label className="text-[10px] uppercase tracking-widest opacity-50 border-b border-[#F5F5F0]/10 pb-2 block">Narrative Architecture</label>
                    <Card className="p-12 bg-[#0A0A0A]/50 backdrop-blur-sm shadow-2xl">
                       <div className="mb-12 p-8 border-l border-[#C5FF4A]/40 bg-[#C5FF4A]/5">
                         <span className="text-[9px] uppercase tracking-widest opacity-40 block mb-2 font-mono">RES_HEADER_H1</span>
                         <h4 className="text-4xl font-serif italic">"{analysis.outline.title}"</h4>
                       </div>
                       
                       <div className="grid grid-cols-1 md:grid-cols-2 gap-16">
                         {analysis.outline.sections.map((section, idx) => (
                           <div key={idx} className="group">
                             <div className="flex items-center gap-4 mb-6">
                               <div className="w-1.5 h-1.5 rounded-full border border-[#C5FF4A] shadow-[0_0_10px_#C5FF4A]" />
                               <h5 className="text-sm font-bold uppercase tracking-[0.2em]">{section.heading}</h5>
                               <span className="text-[9px] opacity-30 italic font-mono">@{section.semanticFocus.toLowerCase()}</span>
                             </div>
                             <ul className="space-y-4 pl-6 border-l border-[#F5F5F0]/5">
                               {section.subPoints.map((point, k) => (
                                 <li key={k} className="text-[13px] opacity-50 hover:opacity-100 transition-opacity leading-relaxed font-light font-mono tracking-tighter">
                                   &gt; {point}
                                 </li>
                               ))}
                             </ul>
                           </div>
                         ))}
                       </div>
                    </Card>
                  </div>
                )}
              </div>
            </main>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

