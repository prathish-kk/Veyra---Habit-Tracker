/** AI Monthly Reflection Assistant Modal — analyzes monthly habit telemetry and generates synthesis. */
import React, { useState } from 'react';
import { GlassButton } from '@/components/glass/GlassButton';
import { useAiReflection } from '../hooks/useAi';
import {
  Sparkles,
  X,
  CheckCircle2,
  Target,
  ArrowRight,
  TrendingUp,
  Brain,
  Award,
} from 'lucide-react';
import { cn } from '@/lib/cn';

interface AiReflectionModalProps {
  isOpen: boolean;
  onClose: () => void;
  year: number;
  month: number;
  monthName: string;
  onApplyReflection?: (reflectionText: string) => void;
}

export const AiReflectionModal: React.FC<AiReflectionModalProps> = ({
  isOpen,
  onClose,
  year,
  month,
  monthName,
  onApplyReflection,
}) => {
  const [customPrompt, setCustomPrompt] = useState('');
  const { generateReflection, reflectionData, isLoading, reset } = useAiReflection();

  if (!isOpen) return null;

  const handleGenerate = async () => {
    await generateReflection({ year, month, customPrompt: customPrompt.trim() || undefined });
  };

  const handleApply = () => {
    if (reflectionData?.reflection && onApplyReflection) {
      onApplyReflection(reflectionData.reflection);
      onClose();
    }
  };

  const handleModalClose = () => {
    reset();
    onClose();
  };

  const getSentimentBadge = (sentiment: string) => {
    switch (sentiment) {
      case 'triumphant':
        return (
          <span className="px-3 py-1 rounded-full text-fluid-xs font-bold bg-amber-500/20 text-amber-300 border border-amber-400/30 flex items-center gap-1.5 shadow-sm">
            <Award size={14} /> Peak Performance
          </span>
        );
      case 'consistent':
        return (
          <span className="px-3 py-1 rounded-full text-fluid-xs font-bold bg-emerald-500/20 text-emerald-300 border border-emerald-400/30 flex items-center gap-1.5 shadow-sm">
            <CheckCircle2 size={14} /> Consistent Rhythm
          </span>
        );
      case 'improving':
        return (
          <span className="px-3 py-1 rounded-full text-fluid-xs font-bold bg-primary/15 text-primary border border-primary/30 flex items-center gap-1.5 shadow-sm">
            <TrendingUp size={14} /> Building Momentum
          </span>
        );
      default:
        return (
          <span className="px-3 py-1 rounded-full text-fluid-xs font-bold bg-zinc-500/10 text-zinc-600 dark:text-zinc-300 border border-zinc-500/20 flex items-center gap-1.5 shadow-sm">
            <Target size={14} /> Reset & Refocus
          </span>
        );
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Backdrop */}
      <div className="fixed inset-0 bg-black/75" onClick={handleModalClose} />

      {/* Modal Dialog */}
      <div
        className="glass-heavy relative z-10 w-full max-w-xl max-h-[90vh] flex flex-col p-6 rounded-3xl border border-[var(--glass-border)] shadow-2xl animate-in fade-in zoom-in-95 duration-200 overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Top Header */}
        <div className="flex items-center justify-between pb-4 border-b border-[var(--glass-border)] shrink-0">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-xl bg-primary/15 text-primary border border-primary/30">
              <Sparkles size={18} />
            </div>
            <div>
              <h2 className="text-fluid-base font-bold text-gray-900 dark:text-white flex items-center gap-2">
                <span>AI Monthly Reflection</span>
                <span className="text-[10px] uppercase font-extrabold px-2 py-0.5 rounded-full bg-primary/15 text-primary border border-primary/30">
                  Gemini
                </span>
              </h2>
              <p className="text-[11px] text-gray-600 dark:text-zinc-400">
                {monthName} {year} Productivity Synthesis
              </p>
            </div>
          </div>
          <button
            onClick={handleModalClose}
            className="p-1.5 rounded-xl text-gray-500 dark:text-zinc-400 hover:text-gray-900 dark:hover:text-white hover:bg-black/5 dark:hover:bg-white/10 transition-colors"
          >
            <X size={18} />
          </button>
        </div>

        {/* Scrollable Body */}
        <div className="flex-1 overflow-y-auto py-4 space-y-4 pr-1">
          {!reflectionData ? (
            <div className="space-y-4">
              <p className="text-fluid-xs text-gray-600 dark:text-zinc-300 leading-relaxed">
                Veyra's AI engine analyzes your completion rates, streak endurance, and daily check-ins to synthesize your personal growth story for {monthName}.
              </p>

              <div>
                <label className="block text-fluid-xs font-semibold text-gray-700 dark:text-zinc-300 mb-1.5">
                  Optional: Focus notes or highlights to include
                </label>
                <textarea
                  value={customPrompt}
                  onChange={(e) => setCustomPrompt(e.target.value)}
                  placeholder="e.g. Focus on morning workout consistency, or note that finals week was especially busy..."
                  rows={3}
                  className="w-full p-3 rounded-2xl glass border border-[var(--glass-border)] focus:border-primary text-fluid-xs text-gray-900 dark:text-white placeholder:text-gray-400 dark:placeholder-zinc-500 outline-none transition-all resize-none"
                />
              </div>

              <div className="p-4 rounded-2xl bg-primary/10 border border-primary/20 flex items-start gap-3">
                <Brain size={18} className="text-primary shrink-0 mt-0.5" />
                <div className="text-[11px] text-gray-700 dark:text-zinc-300 leading-relaxed">
                  The reflection synthesizes your authentic logged data. If Gemini API is configured, advanced narrative intelligence is applied; otherwise, high-fidelity analytical modeling generates your report.
                </div>
              </div>
            </div>
          ) : (
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                {getSentimentBadge(reflectionData.sentiment)}
                <span className="text-[10px] text-gray-500 dark:text-zinc-400 uppercase font-semibold">
                  Source: {reflectionData.source}
                </span>
              </div>

              <div className="p-4 rounded-2xl bg-black/[0.03] dark:bg-white/[0.03] border border-[var(--glass-border)]">
                <h4 className="text-[11px] uppercase tracking-wider font-bold text-primary mb-2">
                  Growth Synthesis
                </h4>
                <p className="text-fluid-xs text-gray-800 dark:text-zinc-200 leading-relaxed whitespace-pre-line italic">
                  "{reflectionData.reflection}"
                </p>
              </div>

              {reflectionData.keyHighlights.length > 0 && (
                <div>
                  <h4 className="text-fluid-xs font-bold text-gray-900 dark:text-white mb-2 flex items-center gap-1.5">
                    <CheckCircle2 size={14} className="text-emerald-500" /> Key Highlights
                  </h4>
                  <ul className="space-y-1.5">
                    {reflectionData.keyHighlights.map((hl, i) => (
                      <li
                        key={i}
                        className="text-[12px] text-gray-800 dark:text-zinc-300 bg-black/[0.02] dark:bg-white/5 p-2 rounded-xl border border-[var(--glass-border)] flex items-center gap-2"
                      >
                        <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 shrink-0" />
                        <span>{hl}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              {reflectionData.focusAreasNextMonth.length > 0 && (
                <div>
                  <h4 className="text-fluid-xs font-bold text-gray-900 dark:text-white mb-2 flex items-center gap-1.5">
                    <Target size={14} className="text-primary" /> Recommended Next Month Focus
                  </h4>
                  <ul className="space-y-1.5">
                    {reflectionData.focusAreasNextMonth.map((fa, i) => (
                      <li
                        key={i}
                        className="text-[12px] text-gray-800 dark:text-zinc-300 bg-primary/10 p-2 rounded-xl border border-primary/20 flex items-center gap-2"
                      >
                        <span className="w-1.5 h-1.5 rounded-full bg-primary shrink-0" />
                        <span>{fa}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          )}
        </div>

        {/* Footer Actions */}
        <div className="pt-4 border-t border-white/10 shrink-0 flex items-center justify-between gap-3">
          <GlassButton variant="ghost" onClick={handleModalClose} className="text-fluid-xs">
            {reflectionData ? 'Close' : 'Cancel'}
          </GlassButton>

          {!reflectionData ? (
            <GlassButton
              variant="primary"
              onClick={handleGenerate}
              disabled={isLoading}
              className="text-fluid-xs font-bold flex items-center gap-2"
            >
              <Sparkles size={14} />
              <span>{isLoading ? 'Analyzing Telemetry...' : 'Generate Reflection'}</span>
            </GlassButton>
          ) : (
            onApplyReflection && (
              <GlassButton
                variant="primary"
                onClick={handleApply}
                className="text-fluid-xs font-bold flex items-center gap-2"
              >
                <span>Save to Month Reflection</span>
                <ArrowRight size={14} />
              </GlassButton>
            )
          )}
        </div>
      </div>
    </div>
  );
};
