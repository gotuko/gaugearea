'use client';

import React from 'react';
import { Zap, Sliders, Calculator, BookOpen, ChevronRight } from 'lucide-react';

interface NavbarProps {
  activeTab: 'calculator' | 'reference';
  onChangeTab: (tab: 'calculator' | 'reference') => void;
  onOpenAdmin: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  activeTab,
  onChangeTab,
  onOpenAdmin,
}) => {
  return (
    <header className="border-b border-slate-800 bg-slate-950/95 sticky top-0 z-30 backdrop-blur-md">
      <div className="max-w-5xl mx-auto px-3 sm:px-6">
        <div className="flex items-center justify-between h-14 sm:h-16 gap-3">
          {/* Logo & Title */}
          <div
            onClick={() => onChangeTab('calculator')}
            className="flex items-center gap-2.5 cursor-pointer select-none shrink-0"
          >
            <div className="w-8 h-8 sm:w-9 sm:h-9 rounded-xl bg-amber-500 flex items-center justify-center text-slate-950 font-black shrink-0 shadow-sm">
              <Zap className="w-4 h-4 sm:w-5 sm:h-5 fill-slate-950" />
            </div>
            <div>
              <span className="text-base sm:text-lg font-black tracking-tight text-white">
                Gauge<span className="text-amber-400">Area</span>
              </span>
            </div>
          </div>

          {/* Action Controls */}
          <div className="flex items-center gap-2">
            {activeTab === 'calculator' ? (
              <button
                type="button"
                onClick={() => onChangeTab('reference')}
                className="flex items-center gap-1.5 sm:gap-2 px-3 sm:px-4 py-1.5 sm:py-2 rounded-xl text-xs sm:text-sm font-black bg-amber-500 hover:bg-amber-400 text-slate-950 shadow-md hover:shadow-amber-500/20 ring-2 ring-amber-400/40 transition-all cursor-pointer select-none active:scale-95"
                title="View SWG & AWG Reference Table"
              >
                <BookOpen className="w-4 h-4 sm:w-4.5 sm:h-4.5 text-slate-950 stroke-[2.5]" />
                <span className="hidden xs:inline sm:inline">SWG &amp; AWG</span>
                <span className="xs:hidden sm:hidden">Table</span>
                <ChevronRight className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-slate-950/70" />
              </button>
            ) : (
              <button
                type="button"
                onClick={() => onChangeTab('calculator')}
                className="flex items-center gap-1.5 sm:gap-2 px-3 sm:px-4 py-1.5 sm:py-2 rounded-xl text-xs sm:text-sm font-black bg-amber-500 hover:bg-amber-400 text-slate-950 shadow-md hover:shadow-amber-500/20 ring-2 ring-amber-400/40 transition-all cursor-pointer select-none active:scale-95"
                title="Return to Wire Calculator"
              >
                <Calculator className="w-4 h-4 sm:w-4.5 sm:h-4.5 text-slate-950 stroke-[2.5]" />
                <span className="tracking-tight sm:tracking-normal">Calculator</span>
                <ChevronRight className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-slate-950/70" />
              </button>
            )}

            {/* In-App Admin Panel trigger */}
            <button
              type="button"
              onClick={onOpenAdmin}
              className="p-2 rounded-xl text-slate-400 hover:text-white hover:bg-slate-900 border border-slate-800 transition cursor-pointer"
              title="In-App Admin Panel"
              aria-label="In-App Admin Panel"
            >
              <Sliders className="w-4 h-4 text-slate-400 hover:text-amber-400" />
            </button>
          </div>
        </div>
      </div>
    </header>
  );
};
