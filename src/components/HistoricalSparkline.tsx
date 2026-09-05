import React, { useState } from 'react';
import { SEOAnalysis } from '../types';
import { TrendingUp, TrendingDown, Minus, History, Sparkles } from 'lucide-react';
import { cn } from '../lib/utils';

interface HistoricalSparklineProps {
  currentKeyword: string;
  currentScore: number;
  currentAnalysisId?: string;
  savedAnalyses: SEOAnalysis[];
  onSelectHistorical?: (analysis: SEOAnalysis) => void;
  onReAudit?: () => void;
}

export const HistoricalSparkline: React.FC<HistoricalSparklineProps> = ({
  currentKeyword,
  currentScore,
  currentAnalysisId,
  savedAnalyses,
  onSelectHistorical,
  onReAudit
}) => {
  const [hoveredPoint, setHoveredPoint] = useState<{
    index: number;
    score: number;
    timestamp: number;
    id: string;
    isCurrent: boolean;
  } | null>(null);

  // Filter analyses matching the current keyword (case-insensitive)
  const matching = savedAnalyses
    .filter(a => a.keyword.toLowerCase().trim() === currentKeyword.toLowerCase().trim())
    .sort((a, b) => a.timestamp - b.timestamp);

  // If matching analyses exist, prepare points.
  // Ensure the current score is represented. If the current analysis isn't yet saved or is saved, make sure it's the latest point.
  const historyPoints = [...matching];
  if (currentAnalysisId && !historyPoints.some(p => p.id === currentAnalysisId)) {
    historyPoints.push({
      id: currentAnalysisId,
      timestamp: Date.now(),
      keyword: currentKeyword,
      primaryIntent: 'Informational',
      semanticGaps: [],
      informationGainPotential: currentScore,
      differentiatorStrategy: '',
      outline: { title: '', sections: [] },
      relatedKeywords: []
    });
  }

  const count = historyPoints.length;
  const previousPoint = count > 1 ? historyPoints[count - 2] : null;
  const latestPoint = count > 0 ? historyPoints[count - 1] : { informationGainPotential: currentScore, timestamp: Date.now() };

  const delta = previousPoint 
    ? latestPoint.informationGainPotential - previousPoint.informationGainPotential 
    : 0;

  // Chart dimensions
  const width = 220;
  const height = 48;
  const paddingX = 12;
  const paddingY = 8;

  // Determine scaling
  const scores = historyPoints.map(p => p.informationGainPotential);
  const minScore = Math.max(0, Math.min(...scores, currentScore) - 10);
  const maxScore = Math.min(100, Math.max(...scores, currentScore) + 10);
  const scoreRange = maxScore - minScore || 1;

  // Generate coordinates
  const coords = historyPoints.map((p, idx) => {
    const x = count === 1 
      ? width / 2 
      : paddingX + (idx / (count - 1)) * (width - paddingX * 2);
    const y = height - paddingY - ((p.informationGainPotential - minScore) / scoreRange) * (height - paddingY * 2);
    return { x, y, point: p, isCurrent: p.id === currentAnalysisId || idx === count - 1 };
  });

  // SVG path definition
  let pathD = '';
  let fillD = '';
  if (coords.length > 1) {
    pathD = coords.reduce((acc, curr, idx) => {
      if (idx === 0) return `M ${curr.x} ${curr.y}`;
      // Smooth cubic bezier curve
      const prev = coords[idx - 1];
      const cx1 = prev.x + (curr.x - prev.x) / 2;
      const cy1 = prev.y;
      const cx2 = prev.x + (curr.x - prev.x) / 2;
      const cy2 = curr.y;
      return `${acc} C ${cx1} ${cy1}, ${cx2} ${cy2}, ${curr.x} ${curr.y}`;
    }, '');

    fillD = `${pathD} L ${coords[coords.length - 1].x} ${height} L ${coords[0].x} ${height} Z`;
  }

  return (
    <div className="p-3.5 border border-[#F5F5F0]/10 bg-zinc-950/40 relative group overflow-hidden">
      <div className="flex justify-between items-center mb-2">
        <div className="flex items-center gap-1.5">
          <History size={11} className="text-[#C5FF4A] opacity-70" />
          <span className="text-[9px] uppercase tracking-widest opacity-60 font-mono font-bold">Gain Velocity</span>
        </div>
        <div className="text-[9px] font-mono">
          {count > 1 ? (
            <span className={cn(
              "flex items-center gap-1 font-bold",
              delta > 0 ? "text-[#C5FF4A]" : delta < 0 ? "text-rose-400" : "opacity-50"
            )}>
              {delta > 0 ? <TrendingUp size={10} /> : delta < 0 ? <TrendingDown size={10} /> : <Minus size={10} />}
              {delta > 0 ? `+${delta}%` : delta < 0 ? `${delta}%` : '0%'}
            </span>
          ) : (
            <span className="text-[8px] uppercase tracking-wider opacity-40 font-mono">Baseline</span>
          )}
        </div>
      </div>

      {/* Sparkline Canvas Area */}
      <div className="relative w-full h-[48px] my-1 flex items-center justify-center">
        {count === 1 ? (
          // Single audit node presentation
          <div className="w-full flex items-center justify-between px-2 text-center">
            <div className="text-left">
              <span className="text-[8px] uppercase tracking-wider opacity-40 font-mono block">Audit Run #1</span>
              <span className="text-xs font-mono text-[#C5FF4A] font-bold">{currentScore}% Initial</span>
            </div>
            <div className="relative flex items-center justify-center w-8 h-8">
              <div className="absolute w-6 h-6 rounded-full bg-[#C5FF4A]/10 animate-ping" />
              <div className="w-2.5 h-2.5 rounded-full bg-[#C5FF4A]" />
            </div>
            <div className="text-right">
              <button 
                onClick={onReAudit}
                className="text-[8px] uppercase tracking-wider text-[#C5FF4A] hover:underline font-mono"
              >
                + Re-audit
              </button>
            </div>
          </div>
        ) : (
          <svg 
            viewBox={`0 0 ${width} ${height}`} 
            className="w-full h-full overflow-visible"
            preserveAspectRatio="none"
          >
            <defs>
              <linearGradient id="gainSparklineGrad" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#C5FF4A" stopOpacity="0.25" />
                <stop offset="100%" stopColor="#C5FF4A" stopOpacity="0.0" />
              </linearGradient>
            </defs>

            {/* Area Fill */}
            <path d={fillD} fill="url(#gainSparklineGrad)" />

            {/* Sparkline Stroke */}
            <path 
              d={pathD} 
              fill="none" 
              stroke="#C5FF4A" 
              strokeWidth="1.5" 
              strokeLinecap="round"
            />

            {/* Coordinate Dots */}
            {coords.map((c, i) => (
              <g key={i}>
                <circle
                  cx={c.x}
                  cy={c.y}
                  r={c.isCurrent ? 3.5 : 2}
                  fill={c.isCurrent ? '#C5FF4A' : '#F5F5F0'}
                  stroke="#0A0A0A"
                  strokeWidth={1}
                  className="cursor-pointer transition-all hover:scale-150"
                  onMouseEnter={() => setHoveredPoint({
                    index: i + 1,
                    score: c.point.informationGainPotential,
                    timestamp: c.point.timestamp,
                    id: c.point.id,
                    isCurrent: c.isCurrent
                  })}
                  onMouseLeave={() => setHoveredPoint(null)}
                  onClick={() => onSelectHistorical && onSelectHistorical(c.point)}
                />
                {c.isCurrent && (
                  <circle
                    cx={c.x}
                    cy={c.y}
                    r={6}
                    fill="none"
                    stroke="#C5FF4A"
                    strokeWidth={0.75}
                    className="animate-pulse"
                  />
                )}
              </g>
            ))}
          </svg>
        )}
      </div>

      {/* Dynamic Hover Tooltip */}
      {hoveredPoint ? (
        <div className="text-[8px] font-mono opacity-80 flex justify-between items-center pt-1 border-t border-[#F5F5F0]/10 mt-1">
          <span className="text-[#C5FF4A]">RUN #{hoveredPoint.index}: {hoveredPoint.score}%</span>
          <span className="opacity-50">{new Date(hoveredPoint.timestamp).toLocaleDateString(undefined, { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' })}</span>
        </div>
      ) : (
        <div className="flex justify-between items-center text-[8px] font-mono opacity-40 pt-1 border-t border-[#F5F5F0]/10 mt-1">
          <span>{count} {count === 1 ? 'AUDIT LOGGED' : 'AUDITS LOGGED'}</span>
          {onReAudit && (
            <button 
              onClick={onReAudit}
              className="text-[#C5FF4A] hover:opacity-100 uppercase tracking-wider flex items-center gap-1 transition-opacity cursor-pointer"
            >
              <Sparkles size={8} />
              <span>Track Delta</span>
            </button>
          )}
        </div>
      )}
    </div>
  );
};
