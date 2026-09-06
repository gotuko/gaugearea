'use client';

import React from 'react';
import { Zap, ArrowRight, ShieldCheck, Layers } from 'lucide-react';

interface ProcessBarProps {
  onProcess: () => void;
  isProcessing: boolean;
  resultCount: number;
  targetArea: number;
  wireCountDescription: string;
  strategyDescription?: string;
  toleranceDescription: string;
  inStockCount: number;
  useStockFilter: boolean;
}

export const ProcessBar: React.FC<ProcessBarProps> = ({
  onProcess,
  isProcessing,
  resultCount,
  targetArea,
  wireCountDescription,
  strategyDescription,
  toleranceDescription,
  inStockCount,
  useStockFilter,
}) => {
  return (
    <div className="bg-gradient-to-r from-slate-900 via-slate-900 to-slate-950 border-2 border-amber-500/50 rounded-xl p-4 sm:p-5 text-slate-100 shadow-xl shadow-amber-500/10 space-y-3">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        {/* Left summary */}
        <div className="space-y-1.5">
          <div className="flex items-center gap-2 flex-wrap">
            <span className="inline-flex items-center gap-1 text-xs font-bold text-amber-400 bg-amber-500/15 px-2.5 py-0.5 rounded-md border border-amber-500/30">
              <Zap className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
              Ready to Compute
            </span>
            <span className="text-xs text-slate-400">
              Target Area: <strong className="font-mono text-white">{targetArea.toFixed(4)} mm²</strong>
            </span>
            {strategyDescription && (
              <>
                <span className="text-slate-600">•</span>
                <span className="text-xs font-semibold text-amber-300">
                  {strategyDescription}
                </span>
              </>
            )}
            <span className="text-slate-600">•</span>
            <span className="text-xs text-slate-400">
              {wireCountDescription}
            </span>
            <span className="text-slate-600">•</span>
            <span className="text-xs text-slate-400">
              {toleranceDescription}
            </span>
            <span className="text-slate-600">•</span>
            <span className="text-xs text-slate-400">
              {useStockFilter ? `${inStockCount} SWGs In Stock` : 'All SWG 10–36 (Filter OFF)'}
            </span>
          </div>
          <p className="text-xs text-slate-300">
            Click below to calculate and navigate to the replacement combinations sheet.
          </p>
        </div>

        {/* Action Button: Requested by user to explicitly process and show next page */}
        <button
          type="button"
          onClick={onProcess}
          disabled={isProcessing || targetArea <= 0}
          className={`w-full md:w-auto px-7 py-3.5 rounded-xl font-black text-sm transition-all shadow-lg flex items-center justify-center gap-2.5 cursor-pointer select-none shrink-0 ${
            isProcessing
              ? 'bg-amber-600 text-slate-950 opacity-90 cursor-wait'
              : 'bg-amber-500 hover:bg-amber-400 active:bg-amber-600 text-slate-950 shadow-amber-500/30 hover:shadow-amber-500/45 hover:scale-[1.02] active:scale-[0.98]'
          }`}
          title="Compute parallel replacement wire combinations and view on next page"
        >
          <Zap className={`w-4 h-4 fill-slate-950 ${isProcessing ? 'animate-bounce' : ''}`} />
          <span>
            {isProcessing ? 'Computing Combinations...' : 'Process Combinations →'}
          </span>
          <ArrowRight className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
};
