import { useState } from 'react';
import { SERPFeatureOpportunity } from '../types';
import { Target, Sparkles, Copy, Check, Table, ListOrdered, HelpCircle, Bot, Zap } from 'lucide-react';
import { cn } from '../lib/utils';

interface SERPOpportunityMatrixProps {
  serpOpportunities?: SERPFeatureOpportunity[];
  keyword: string;
}

export function SERPOpportunityMatrix({ serpOpportunities, keyword }: SERPOpportunityMatrixProps) {
  const [copiedIndex, setCopiedIndex] = useState<number | null>(null);

  // Fallback opportunities if older analysis doesn't have serpOpportunities
  const opportunities: SERPFeatureOpportunity[] = serpOpportunities && serpOpportunities.length > 0
    ? serpOpportunities
    : [
        {
          feature: 'AI Overview',
          queryAngle: `How does ${keyword} impact search ranking models?`,
          recommendedFormat: 'Direct 42-word empirical synthesis block immediately followed by 3 structured bullet points citing patent methodologies.',
          winningFactor: 'Google AI Overviews cite sources providing condensed semantic synthesis with high entity salience and zero fluff.'
        },
        {
          feature: 'Featured Snippet',
          queryAngle: `Key differences between conventional SEO and ${keyword}`,
          recommendedFormat: 'Comparison Markdown/HTML table containing 4 criteria columns: Metric, Legacy Approach, Novel Vector, Expected Gain.',
          winningFactor: 'Structured HTML tables capture 74% of comparative commercial query featured snippets over unordered bullet lists.'
        },
        {
          feature: 'People Also Ask',
          queryAngle: `What are the primary ranking risks when ignoring ${keyword}?`,
          recommendedFormat: 'H3 Question heading followed by an immediate declarative answer within first 15 words.',
          winningFactor: 'Concise question-answer pairing enables direct inclusion in iterative PAA accordion carousels.'
        },
        {
          feature: 'Comparative Table',
          queryAngle: `${keyword} implementation checklist and evaluation metrics`,
          recommendedFormat: 'Checklist table with operational verification criteria and numeric thresholds.',
          winningFactor: 'Fulfills multi-intent search tasks in a single viewport, minimizing post-click search refinement.'
        }
      ];

  const getFeatureIcon = (feature: string) => {
    switch (feature) {
      case 'AI Overview':
        return <Bot size={13} className="text-[#C5FF4A]" />;
      case 'Featured Snippet':
        return <Zap size={13} className="text-amber-400" />;
      case 'People Also Ask':
        return <HelpCircle size={13} className="text-cyan-400" />;
      case 'Comparative Table':
        return <Table size={13} className="text-emerald-400" />;
      default:
        return <Target size={13} className="text-[#C5FF4A]" />;
    }
  };

  const handleCopy = (opp: SERPFeatureOpportunity, index: number) => {
    const text = `Target SERP Feature: ${opp.feature}\nTarget Query Angle: ${opp.queryAngle}\nRecommended Format: ${opp.recommendedFormat}\nAlgorithmic Factor: ${opp.winningFactor}`;
    navigator.clipboard.writeText(text);
    setCopiedIndex(index);
    setTimeout(() => setCopiedIndex(null), 2000);
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 border-b border-[#F5F5F0]/10 pb-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <Target size={14} className="text-[#C5FF4A]" />
            <label className="text-[10px] uppercase tracking-widest text-[#C5FF4A] font-bold">
              SERP Feature & AI Overview Targets
            </label>
          </div>
          <p className="text-xs text-white/50 max-w-2xl font-light">
            Algorithmic structural directives engineered to capture Google AI Overview source cards, Position 0 Featured Snippets, and high-CTR search features.
          </p>
        </div>

        <div className="flex items-center gap-2 text-[9px] font-mono text-white/40">
          <Sparkles size={11} className="text-[#C5FF4A]" />
          <span>Information Gain Vectoring</span>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {opportunities.map((opp, idx) => {
          const isCopied = copiedIndex === idx;
          return (
            <div
              key={idx}
              className="p-5 border border-white/10 bg-zinc-950/40 hover:border-[#C5FF4A]/40 transition-all flex flex-col justify-between group relative"
            >
              <div>
                <div className="flex justify-between items-start mb-3">
                  <div className="flex items-center gap-1.5 px-2.5 py-1 bg-white/5 border border-white/10 rounded-sm">
                    {getFeatureIcon(opp.feature)}
                    <span className="text-[8px] uppercase tracking-widest font-mono font-bold text-white/90">
                      {opp.feature}
                    </span>
                  </div>

                  <button
                    onClick={() => handleCopy(opp, idx)}
                    className="p-1.5 border border-white/10 hover:border-[#C5FF4A] hover:text-[#C5FF4A] text-white/40 transition-colors cursor-pointer"
                    title="Copy Directive"
                  >
                    {isCopied ? <Check size={11} className="text-[#C5FF4A]" /> : <Copy size={11} />}
                  </button>
                </div>

                <h4 className="text-base font-serif italic text-white mb-3 group-hover:text-[#C5FF4A] transition-colors">
                  "{opp.queryAngle}"
                </h4>

                <div className="space-y-3 mb-4">
                  <div className="p-3 bg-black/40 border border-white/5 space-y-1">
                    <span className="text-[8px] font-mono uppercase tracking-wider text-white/40 block">
                      Recommended Format Structure
                    </span>
                    <p className="text-[11px] font-light leading-relaxed text-white/80">
                      {opp.recommendedFormat}
                    </p>
                  </div>

                  <div className="p-3 bg-[#C5FF4A]/5 border border-[#C5FF4A]/10 space-y-1">
                    <span className="text-[8px] font-mono uppercase tracking-wider text-[#C5FF4A] block font-bold">
                      Algorithmic Winning Factor
                    </span>
                    <p className="text-[10px] font-light leading-relaxed text-white/70 italic">
                      {opp.winningFactor}
                    </p>
                  </div>
                </div>
              </div>

              <div className="pt-2 flex justify-between items-center text-[8px] font-mono text-white/30 uppercase">
                <span>Direct Indexation Target</span>
                <span className="text-[#C5FF4A]/80 font-bold">Position 0 Candidate</span>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
