import React, { useState } from 'react';
import { CompetitorAudit } from '../types';
import { analyzeCompetitorGap } from '../services/geminiService';
import { 
  ShieldAlert, 
  Swords, 
  Target, 
  Sparkles, 
  Loader2, 
  Compass, 
  ArrowRight,
  ExternalLink,
  ChevronRight,
  AlertTriangle
} from 'lucide-react';
import { cn } from '../lib/utils';

interface CompetitorGapCheckerProps {
  keyword: string;
  initialCompetitor?: string;
  competitorAudit?: CompetitorAudit;
  onAuditUpdated: (audit: CompetitorAudit) => void;
}

export const CompetitorGapChecker: React.FC<CompetitorGapCheckerProps> = ({
  keyword,
  initialCompetitor = '',
  competitorAudit,
  onAuditUpdated
}) => {
  const [competitorInput, setCompetitorInput] = useState(initialCompetitor || competitorAudit?.competitorDomain || '');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [selectedSpotIndex, setSelectedSpotIndex] = useState<number | null>(0);

  const handleRunAudit = async (domainToTest?: string) => {
    const targetDomain = (domainToTest || competitorInput).trim();
    if (!targetDomain) return;

    setIsLoading(true);
    setError(null);
    try {
      const result = await analyzeCompetitorGap(keyword, targetDomain);
      onAuditUpdated(result);
    } catch (err) {
      console.error(err);
      setError('Unable to evaluate rival domain. Please verify domain name.');
    } finally {
      setIsLoading(false);
    }
  };

  const sampleRivals = [
    'ahrefs.com',
    'backlinko.com',
    'hubspot.com',
    'searchengineland.com'
  ];

  return (
    <div className="space-y-8">
      {/* Competitor Benchmark Input Bar */}
      <div className="p-6 md:p-8 border border-[#F5F5F0]/10 bg-zinc-950/30">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-6">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <Swords size={16} className="text-[#C5FF4A]" />
              <span className="text-[10px] uppercase tracking-widest text-[#C5FF4A] font-bold font-mono">
                Rival_Semantic_Differential
              </span>
            </div>
            <h3 className="text-2xl font-serif italic">Competitor Gap Matrix</h3>
          </div>
          <div className="text-[9px] font-mono opacity-40 uppercase tracking-widest">
            TARGET: <span className="text-white">"{keyword}"</span>
          </div>
        </div>

        <div className="flex flex-col sm:flex-row gap-3">
          <div className="relative flex-1">
            <input
              type="text"
              placeholder="ENTER COMPETITOR DOMAIN (e.g. competitor.com or blog.rival.io)..."
              value={competitorInput}
              onChange={(e) => setCompetitorInput(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleRunAudit()}
              className="w-full bg-[#0A0A0A] border border-[#F5F5F0]/20 px-4 py-3 text-xs font-mono tracking-wider focus:outline-none focus:border-[#C5FF4A] transition-colors placeholder:opacity-30 uppercase"
            />
            {competitorAudit?.competitorDomain && (
              <span className="absolute right-3 top-3 text-[9px] font-mono text-[#C5FF4A] opacity-60">
                ACTIVE_BENCHMARK
              </span>
            )}
          </div>
          <button
            onClick={() => handleRunAudit()}
            disabled={isLoading || !competitorInput.trim()}
            className="px-6 py-3 bg-[#C5FF4A] text-black font-bold text-xs uppercase tracking-widest hover:brightness-110 disabled:opacity-30 disabled:cursor-not-allowed transition-all flex items-center justify-center gap-2 cursor-pointer shrink-0"
          >
            {isLoading ? (
              <>
                <Loader2 size={14} className="animate-spin" />
                <span>Auditing Rival...</span>
              </>
            ) : (
              <>
                <span>Check Semantic Gap</span>
                <ArrowRight size={14} />
              </>
            )}
          </button>
        </div>

        {/* Quick Sample Rivals */}
        <div className="flex flex-wrap items-center gap-2 mt-4 pt-3 border-t border-[#F5F5F0]/5">
          <span className="text-[8px] uppercase tracking-wider opacity-30 font-mono">Quick Benchmark:</span>
          {sampleRivals.map((rival) => (
            <button
              key={rival}
              onClick={() => {
                setCompetitorInput(rival);
                handleRunAudit(rival);
              }}
              className="text-[9px] font-mono px-2.5 py-1 border border-[#F5F5F0]/10 hover:border-[#C5FF4A]/50 hover:text-[#C5FF4A] opacity-60 hover:opacity-100 transition-all uppercase"
            >
              {rival}
            </button>
          ))}
        </div>

        {error && (
          <div className="mt-4 p-3 border border-rose-500/30 text-rose-400 text-[10px] font-mono flex items-center gap-2">
            <AlertTriangle size={12} />
            <span>{error}</span>
          </div>
        )}
      </div>

      {/* When no competitor audit has been run yet */}
      {!competitorAudit && !isLoading && (
        <div className="p-12 border border-[#F5F5F0]/10 border-dashed text-center space-y-4 bg-zinc-950/20">
          <Compass size={36} className="mx-auto text-[#C5FF4A] opacity-40" />
          <div className="max-w-md mx-auto space-y-2">
            <h4 className="text-lg font-serif italic">Uncover Rival Coverage Blind Spots</h4>
            <p className="text-xs opacity-50 leading-relaxed font-light">
              Enter any competing brand or URL above to benchmark which sub-entities they over-saturate and where their content leaves massive information gain vacuums you can easily exploit.
            </p>
          </div>
        </div>
      )}

      {/* Loading State */}
      {isLoading && (
        <div className="p-16 border border-[#C5FF4A]/20 bg-zinc-950/40 text-center space-y-4">
          <Loader2 size={32} className="animate-spin mx-auto text-[#C5FF4A]" />
          <div className="text-[10px] font-mono uppercase tracking-[0.3em] text-[#C5FF4A]">
            Scanning Rival Vector Saturation...
          </div>
          <p className="text-xs opacity-40 font-mono max-w-sm mx-auto">
            Extracting semantic footprint of {competitorInput} and matching against knowledge graph gaps.
          </p>
        </div>
      )}

      {/* Competitor Audit Results */}
      {competitorAudit && !isLoading && (
        <div className="space-y-8">
          {/* Top Overview Cards */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Competitor Strengths */}
            <div className="p-6 border border-[#F5F5F0]/10 bg-zinc-950/30 space-y-3">
              <div className="flex items-center gap-2">
                <ShieldAlert size={14} className="text-amber-400" />
                <label className="text-[9px] uppercase tracking-widest text-amber-400 font-bold font-mono">
                  Competitor Saturated Moat
                </label>
              </div>
              <p className="text-[11px] opacity-50 leading-relaxed font-light">
                Topics <span className="text-white font-mono">{competitorAudit.competitorDomain}</span> covers heavily. Avoid pure copycat repetition here:
              </p>
              <ul className="space-y-2 pt-2">
                {competitorAudit.competitorStrengths.map((item, i) => (
                  <li key={i} className="text-xs font-mono opacity-80 flex items-start gap-2">
                    <span className="text-amber-400 font-bold">&bull;</span>
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* Counter Strategy */}
            <div className="p-6 border border-[#C5FF4A]/30 bg-[#C5FF4A]/5 space-y-3 lg:col-span-2">
              <div className="flex items-center gap-2">
                <Sparkles size={14} className="text-[#C5FF4A]" />
                <label className="text-[9px] uppercase tracking-widest text-[#C5FF4A] font-bold font-mono">
                  Definitive Counter-Strategy Playbook
                </label>
              </div>
              <h4 className="text-lg font-serif italic text-white">
                How to Out-Reason {competitorAudit.competitorDomain}
              </h4>
              <p className="text-xs leading-relaxed opacity-80 font-light">
                {competitorAudit.counterStrategy}
              </p>
            </div>
          </div>

          {/* Blind Spots Interactive Comparison */}
          <div className="space-y-4">
            <div className="flex justify-between items-end border-b border-[#F5F5F0]/10 pb-2">
              <div>
                <label className="text-[10px] uppercase tracking-widest opacity-50 block">Rival Vulnerability Points</label>
                <h4 className="text-xl font-serif italic">Competitor Blind Spots (Zero or Shallow Coverage)</h4>
              </div>
              <span className="text-[9px] font-mono opacity-40 uppercase">
                {competitorAudit.blindSpots.length} Gaps Isolated
              </span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {competitorAudit.blindSpots.map((spot, idx) => {
                const isSelected = selectedSpotIndex === idx;
                return (
                  <div
                    key={idx}
                    onClick={() => setSelectedSpotIndex(isSelected ? null : idx)}
                    className={cn(
                      "p-6 border transition-all cursor-pointer group relative overflow-hidden",
                      isSelected
                        ? "border-[#C5FF4A] bg-[#C5FF4A]/5 shadow-[0_0_20px_rgba(197,255,74,0.05)]"
                        : "border-[#F5F5F0]/10 bg-zinc-950/20 hover:border-[#F5F5F0]/30"
                    )}
                  >
                    <div className="flex justify-between items-start mb-3">
                      <div>
                        <div className="text-[8px] font-mono uppercase text-[#C5FF4A] mb-1">
                          VULNERABILITY #{idx + 1}
                        </div>
                        <h5 className="text-lg font-serif italic group-hover:text-[#C5FF4A] transition-colors">
                          {spot.concept}
                        </h5>
                      </div>
                      <div className="text-right">
                        <div className="text-[8px] font-mono opacity-40 uppercase">Opportunity</div>
                        <div className="text-base font-mono text-[#C5FF4A] font-bold">
                          {spot.yourOpportunity}%
                        </div>
                      </div>
                    </div>

                    {/* Comparative Bars */}
                    <div className="space-y-2 my-4 pt-2 border-t border-[#F5F5F0]/10">
                      <div>
                        <div className="flex justify-between text-[8px] font-mono opacity-50 uppercase mb-1">
                          <span>Rival Coverage ({competitorAudit.competitorDomain})</span>
                          <span>{spot.competitorCoverage}%</span>
                        </div>
                        <div className="w-full bg-zinc-900 h-1.5 overflow-hidden">
                          <div
                            className="h-full bg-rose-400"
                            style={{ width: `${Math.max(5, spot.competitorCoverage)}%` }}
                          />
                        </div>
                      </div>

                      <div>
                        <div className="flex justify-between text-[8px] font-mono text-[#C5FF4A] uppercase mb-1">
                          <span>Your Information Gain Leverage</span>
                          <span>{spot.yourOpportunity}%</span>
                        </div>
                        <div className="w-full bg-zinc-900 h-1.5 overflow-hidden">
                          <div
                            className="h-full bg-[#C5FF4A]"
                            style={{ width: `${spot.yourOpportunity}%` }}
                          />
                        </div>
                      </div>
                    </div>

                    {/* Tactical Directive */}
                    <div className="mt-3 p-3 bg-white/5 border border-white/5 text-[11px] font-mono leading-relaxed opacity-80">
                      <span className="text-[#C5FF4A] uppercase text-[9px] block mb-1 font-bold">
                        TACTICAL STRIKE:
                      </span>
                      {spot.tactic}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Whitespace Opportunities */}
          <div className="p-8 border border-[#F5F5F0]/10 bg-zinc-950/40 space-y-4">
            <div className="flex items-center justify-between border-b border-[#F5F5F0]/10 pb-3">
              <div className="flex items-center gap-2">
                <Target size={16} className="text-[#C5FF4A]" />
                <h4 className="text-base font-serif italic">
                  Untouched Whitespace Topics
                </h4>
              </div>
              <span className="text-[9px] font-mono opacity-40 uppercase">
                Zero Rival Saturation
              </span>
            </div>
            <p className="text-xs opacity-60 font-light max-w-2xl">
              These queries and semantic entities are completely unaddressed by {competitorAudit.competitorDomain}. Incorporating these into your page guarantees 100% Information Gain against this rival.
            </p>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-3 pt-2">
              {competitorAudit.whitespaceOpportunities.map((topic, i) => (
                <div
                  key={i}
                  className="p-4 border border-[#F5F5F0]/10 bg-[#0A0A0A] flex flex-col justify-between hover:border-[#C5FF4A]/50 transition-colors"
                >
                  <span className="text-[8px] font-mono opacity-30 uppercase block mb-2">
                    WHITESPACE_{i + 1}
                  </span>
                  <span className="text-xs font-serif italic text-white">{topic}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
