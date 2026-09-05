import React, { useState, ReactNode } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { cn } from '../lib/utils';

interface NavTooltipProps {
  key?: React.Key;
  content: string;
  tip?: string;
  children: ReactNode;
  side?: 'top' | 'bottom';
  className?: string;
}

export function NavTooltip({
  content,
  tip,
  children,
  side = 'bottom',
  className
}: NavTooltipProps) {
  const [isHovered, setIsHovered] = useState(false);

  return (
    <div
      className={cn("relative inline-flex items-center h-full", className)}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      onFocus={() => setIsHovered(true)}
      onBlur={() => setIsHovered(false)}
    >
      {children}

      <AnimatePresence>
        {isHovered && (
          <motion.div
            initial={{ opacity: 0, y: side === 'bottom' ? -4 : 4, scale: 0.96 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: side === 'bottom' ? -4 : 4, scale: 0.96 }}
            transition={{ duration: 0.12 }}
            className={cn(
              "absolute z-40 pointer-events-none whitespace-nowrap px-2.5 py-1.5 bg-[#0D0D0D] border border-white/20 shadow-xl",
              side === 'bottom' ? "top-full mt-1.5 left-1/2 -translate-x-1/2" : "bottom-full mb-1.5 left-1/2 -translate-x-1/2"
            )}
          >
            <div className="flex items-center gap-1.5 text-[9px] font-mono">
              <span className="text-white font-medium">{content}</span>
              {tip && (
                <>
                  <span className="text-white/30">•</span>
                  <span className="text-[#C5FF4A] italic">{tip}</span>
                </>
              )}
            </div>
            {/* Subtle pointer notch */}
            <div 
              className={cn(
                "absolute left-1/2 -translate-x-1/2 w-1.5 h-1.5 bg-[#0D0D0D] border-l border-t border-white/20 rotate-45",
                side === 'bottom' ? "-top-1" : "-bottom-1"
              )} 
            />
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
