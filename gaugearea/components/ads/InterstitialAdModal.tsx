'use client';

import React, { useState, useEffect } from 'react';
import {
  X,
  ExternalLink,
  ShieldCheck,
  ArrowRight,
  Wrench,
  Sparkles,
} from 'lucide-react';

interface InterstitialAdModalProps {
  isOpen: boolean;
  onProceed: () => void;
}

export const InterstitialAdModal: React.FC<InterstitialAdModalProps> = ({
  isOpen,
  onProceed,
}) => {
  const [countdown, setCountdown] = useState(2);
  const [canSkip, setCanSkip] = useState(false);
  const [clicked, setClicked] = useState(false);

  // Start countdown timer whenever modal becomes open
  useEffect(() => {
    if (!isOpen) return;

    const timer = setInterval(() => {
      setCountdown((prev) => {
        if (prev <= 1) {
          setCanSkip(true);
          clearInterval(timer);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    const skipTimer = setTimeout(() => {
      setCanSkip(true);
    }, 1200);

    return () => {
      clearInterval(timer);
      clearTimeout(skipTimer);
    };
  }, [isOpen]);

  const handleSkipOrProceed = () => {
    setCountdown(2);
    setCanSkip(false);
    setClicked(false);
    onProceed();
  };

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-hidden={!isOpen}
      className={`fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-950/92 backdrop-blur-md transition-all duration-200 ${
        isOpen
          ? 'opacity-100 pointer-events-auto visible scale-100'
          : 'opacity-0 pointer-events-none invisible scale-98'
      }`}
    >
      <div className="relative w-full max-w-lg max-h-[92dvh] sm:max-h-[90vh] bg-slate-900 border border-slate-700/90 rounded-2xl shadow-2xl overflow-hidden text-slate-100 flex flex-col my-auto">
        {/* Top bar with ad badge, countdown and easy mobile skip button */}
        <div className="flex items-center justify-between px-3.5 sm:px-4 py-2.5 sm:py-3 bg-slate-950/95 border-b border-slate-800 gap-2 shrink-0">
          <div className="flex items-center gap-1.5 sm:gap-2 min-w-0">
            <span className="text-[10px] uppercase font-bold tracking-wider px-1.5 sm:px-2 py-0.5 rounded-sm bg-amber-500/20 text-amber-300 border border-amber-500/30 shrink-0 font-mono">
              Ad
            </span>
            <span className="text-xs text-slate-400 font-mono truncate hidden xs:inline">
              Rewind Partner Spotlight
            </span>
            <span className="text-[10px] text-emerald-400 font-mono flex items-center gap-0.5 shrink-0">
              <ShieldCheck className="w-3 h-3" />
              <span className="hidden sm:inline">Verified</span>
            </span>
          </div>

          <div className="flex items-center gap-2 shrink-0">
            {canSkip ? (
              <button
                type="button"
                onClick={handleSkipOrProceed}
                className="inline-flex items-center justify-center gap-1.5 px-3.5 sm:px-4 py-2 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 text-xs sm:text-sm font-black transition cursor-pointer shadow-md shadow-amber-500/20 active:scale-95 min-h-[40px]"
                title="Skip ad and view calculation results"
              >
                <span>Skip Ad</span>
                <X className="w-4 h-4 stroke-[2.5]" />
              </button>
            ) : (
              <span className="inline-flex items-center text-xs font-mono font-bold text-slate-300 bg-slate-800/90 border border-slate-700 px-3 py-1.5 rounded-lg min-h-[36px]">
                Skip in&nbsp;<strong className="text-amber-400">{countdown}s</strong>
              </span>
            )}
          </div>
        </div>

        {/* Ad Body Content - Mobile comfortable scroll container */}
        <div className="p-4 sm:p-6 space-y-3.5 sm:space-y-4 overflow-y-auto">
          {/* Creative Banner */}
          <div className="w-full rounded-xl bg-gradient-to-tr from-slate-950 via-slate-900 to-amber-950/40 border border-slate-800 p-4 sm:p-5 flex flex-col justify-between relative overflow-hidden min-h-[160px] sm:min-h-[190px]">
            <div className="absolute -right-8 -bottom-8 w-32 h-32 rounded-full bg-amber-500/10 blur-2xl pointer-events-none" />

            <div className="flex items-start justify-between gap-2">
              <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-xl bg-amber-500/20 border border-amber-500/40 flex items-center justify-center text-amber-400 shrink-0">
                <Wrench className="w-5 h-5 sm:w-6 sm:h-6" />
              </div>
              <span className="text-[10px] uppercase tracking-wider text-slate-400 bg-slate-950/80 px-2 py-0.5 rounded border border-slate-800 font-mono">
                Official Equipment Partner
              </span>
            </div>

            <div className="mt-2">
              <span className="text-[11px] sm:text-xs font-bold text-amber-400 uppercase tracking-wider">
                Industrial Electric Tooling
              </span>
              <h3 className="text-base sm:text-xl font-bold text-white mt-0.5 leading-snug">
                MagnaWinding Pro™ High-Speed Motor Coilers
              </h3>
              <p className="text-xs text-slate-300 mt-1 line-clamp-2">
                Precision tension control, digital turn counters, and dual-strand parallel feeder arms for motor repair shops.
              </p>
            </div>
          </div>

          {/* Action Buttons - Mobile friendly min 44px touch targets */}
          <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-2.5 pt-1">
            <a
              href="https://example.com/workshop-tools"
              target="_blank"
              rel="noopener noreferrer"
              onClick={() => setClicked(true)}
              className="inline-flex items-center justify-center gap-2 flex-1 px-4 py-3 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-black text-xs sm:text-sm transition cursor-pointer shadow-md shadow-amber-500/15 min-h-[44px] active:scale-98"
            >
              <span>{clicked ? 'Opening Sponsor Page...' : 'Explore Equipment Catalog'}</span>
              <ExternalLink className="w-3.5 h-3.5" />
            </a>

            <button
              type="button"
              onClick={handleSkipOrProceed}
              className="inline-flex items-center justify-center gap-1.5 px-4 py-3 rounded-xl bg-slate-800 hover:bg-slate-750 text-slate-200 hover:text-white font-bold text-xs sm:text-sm border border-slate-700 transition cursor-pointer min-h-[44px] active:scale-98"
            >
              <span>Continue to Results</span>
              <ArrowRight className="w-4 h-4 text-amber-400" />
            </button>
          </div>
        </div>

        {/* Bottom Bar: Clean sponsor disclaimer */}
        <div className="px-4 py-2 bg-slate-950 border-t border-slate-800/80 flex items-center justify-between text-[10px] sm:text-[11px] text-slate-500 font-mono shrink-0">
          <span>Official Rewind Partner</span>
          <span className="text-amber-500/70">Preloaded • Zero Latency</span>
        </div>
      </div>
    </div>
  );
};

