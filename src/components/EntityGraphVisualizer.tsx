import { useState } from 'react';
import { EntityKnowledgeNode } from '../types';
import { Network, Database, ShieldAlert, CheckCircle2, AlertCircle, Copy, Check } from 'lucide-react';
import { cn } from '../lib/utils';

interface EntityGraphVisualizerProps {
  entityGraph?: EntityKnowledgeNode[];
  keyword: string;
}

export function EntityGraphVisualizer({ entityGraph, keyword }: EntityGraphVisualizerProps) {
  const [filter, setFilter] = useState<'All' | 'Absent' | 'Superficial' | 'Covered'>('All');
  const [copiedEntity, setCopiedEntity] = useState<string | null>(null);

  // Fallback if older analysis doesn't have entityGraph yet
  const nodes: EntityKnowledgeNode[] = entityGraph && entityGraph.length > 0 
    ? entityGraph 
    : [
        {
          entity: `${keyword} Vector Embeddings`,
          category: 'Methodology',
          salience: 92,
          competitorStatus: 'Absent',
          suggestedPlacement: 'H2 Foundational Architecture & Mathematical Modeling'
        },
        {
          entity: 'Information Gain Patent (US 10,698,958 B2)',
          category: 'Patent / Standard',
          salience: 88,
          competitorStatus: 'Absent',
          suggestedPlacement: 'H2 Algorithmic Ranking Mechanisms'
        },
        {
          entity: 'Topical Authority Cluster Mapping',
          category: 'Industry Standard',
          salience: 85,
          competitorStatus: 'Superficial',
          suggestedPlacement: 'H3 Semantic Triangulation Case Study'
        },
        {
          entity: 'Entity-Attribute-Value (EAV) Modeling',
          category: 'Technology',
          salience: 79,
          competitorStatus: 'Absent',
          suggestedPlacement: 'Direct Answer Definition Box'
        },
        {
          entity: 'Latent Dirichlet Allocation (LDA)',
          category: 'Algorithm',
          salience: 74,
          competitorStatus: 'Covered',
          suggestedPlacement: 'Historical Context & Evolution section'
        }
      ];

  const filteredNodes = nodes.filter(n => filter === 'All' || n.competitorStatus === filter);

  const handleCopy = (text: string) => {
    navigator.clipboard.writeText(text);
    setCopiedEntity(text);
    setTimeout(() => setCopiedEntity(null), 2000);
  };

  const absentCount = nodes.filter(n => n.competitorStatus === 'Absent').length;
  const superficialCount = nodes.filter(n => n.competitorStatus === 'Superficial').length;

  return (
    <div className="space-y-6">
      {/* Header & Meta */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 border-b border-[#F5F5F0]/10 pb-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <Network size={14} className="text-[#C5FF4A]" />
            <label className="text-[10px] uppercase tracking-widest text-[#C5FF4A] font-bold">
              Entity Knowledge Graph & Salience
            </label>
          </div>
          <p className="text-xs text-white/50 max-w-2xl font-light">
            Wikidata & Google Knowledge Graph co-occurring entities required to establish absolute topical completeness. Competitors frequently omit these specific nodes.
          </p>
        </div>

        {/* Filter Pills */}
        <div className="flex flex-wrap items-center gap-1.5 bg-zinc-950 p-1 border border-white/10 rounded-sm">
          {(['All', 'Absent', 'Superficial', 'Covered'] as const).map(f => (
            <button
              key={f}
              onClick={() => setFilter(f)}
              className={cn(
                "px-2.5 py-1 text-[9px] uppercase tracking-wider font-mono transition-all cursor-pointer",
                filter === f 
                  ? "bg-[#C5FF4A] text-black font-bold" 
                  : "text-white/40 hover:text-white"
              )}
            >
              {f}
              {f === 'Absent' && absentCount > 0 && ` (${absentCount})`}
              {f === 'Superficial' && superficialCount > 0 && ` (${superficialCount})`}
            </button>
          ))}
        </div>
      </div>

      {/* Grid of Entity Nodes */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredNodes.map((node, i) => {
          const isCopied = copiedEntity === node.entity;
          return (
            <div
              key={i}
              className={cn(
                "p-4 border transition-all relative flex flex-col justify-between group",
                node.competitorStatus === 'Absent' 
                  ? "border-[#C5FF4A]/30 bg-[#C5FF4A]/5 hover:border-[#C5FF4A]" 
                  : node.competitorStatus === 'Superficial'
                  ? "border-amber-500/30 bg-amber-500/5 hover:border-amber-500"
                  : "border-white/5 bg-zinc-950/40 hover:border-white/20"
              )}
            >
              <div>
                <div className="flex justify-between items-start mb-2">
                  <span className="text-[8px] uppercase tracking-widest font-mono px-2 py-0.5 border border-white/10 bg-black/40 text-white/60">
                    {node.category}
                  </span>
                  
                  {/* Status Indicator */}
                  <span className={cn(
                    "text-[8px] font-mono uppercase tracking-wider flex items-center gap-1 font-bold",
                    node.competitorStatus === 'Absent' ? "text-[#C5FF4A]" :
                    node.competitorStatus === 'Superficial' ? "text-amber-400" :
                    "text-white/30"
                  )}>
                    {node.competitorStatus === 'Absent' && <ShieldAlert size={10} />}
                    {node.competitorStatus === 'Superficial' && <AlertCircle size={10} />}
                    {node.competitorStatus === 'Covered' && <CheckCircle2 size={10} />}
                    Rival: {node.competitorStatus}
                  </span>
                </div>

                <h4 className="text-sm md:text-base font-serif italic text-white group-hover:text-[#C5FF4A] transition-colors mb-2">
                  {node.entity}
                </h4>

                <div className="space-y-2 mb-4">
                  <div className="flex justify-between items-center text-[8px] font-mono">
                    <span className="opacity-40 uppercase">KG Salience</span>
                    <span className="text-white font-bold">{node.salience}%</span>
                  </div>
                  <div className="h-1 bg-zinc-900 overflow-hidden rounded-full">
                    <div 
                      className={cn(
                        "h-full transition-all",
                        node.salience > 85 ? "bg-[#C5FF4A]" : "bg-white/60"
                      )} 
                      style={{ width: `${node.salience}%` }} 
                    />
                  </div>
                </div>
              </div>

              <div className="pt-3 border-t border-white/5 flex items-end justify-between gap-2">
                <div className="flex-1">
                  <span className="text-[7px] uppercase tracking-widest font-mono opacity-40 block">Placement Strategy</span>
                  <span className="text-[9px] text-white/70 italic line-clamp-2">{node.suggestedPlacement}</span>
                </div>
                <button
                  onClick={() => handleCopy(node.entity)}
                  title="Copy Entity Name"
                  className="p-1.5 border border-white/10 hover:border-[#C5FF4A] hover:text-[#C5FF4A] text-white/40 transition-colors cursor-pointer shrink-0"
                >
                  {isCopied ? <Check size={11} className="text-[#C5FF4A]" /> : <Copy size={11} />}
                </button>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
