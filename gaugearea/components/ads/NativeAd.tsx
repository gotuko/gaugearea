'use client';

import React, { useState } from 'react';
import { ExternalLink, Sparkles, ShieldCheck, Zap, Layers, CheckCircle2 } from 'lucide-react';
import { useNativeAdsEnabled } from '@/lib/workshopStore';

interface NativeAdProps {
  variant?: 'calculator' | 'results' | 'reference';
  className?: string;
}

const NATIVE_AD_VARIANTS = {
  calculator: {
    badge: 'Sponsored Workshop Supply',
    title: 'Pure Oxygen-Free Copper Magnet Wire (10–36 SWG)',
    highlights: [
      'Class H (200°C) Dual-Coated Polyester-imide & Polyamide-imide',
      'Ultra-uniform enamel thickness guarantees zero short-circuits',
      'Available in 1kg, 3kg, 5kg, and 10kg workshop spools',
    ],
    cta: 'Browse Wire Catalog',
    sponsor: 'VoltMaster Wire & Cable Corp.',
  },
  results: {
    badge: 'Sponsored Rewind Equipment',
    title: 'Professional Multi-Strand Wire Tensioning & Pay-Off Stand',
    highlights: [
      'Feeds up to 4 parallel reels simultaneously with equal tension',
      'Prevents slack and uneven resistance across parallel strands',
      'Quick magnetic spool clamps fit standard 5kg & 10kg spools',
    ],
    cta: 'View Workshop Equipment',
    sponsor: 'TorquePro Winding Systems',
  },
  reference: {
    badge: 'Technical Sponsor',
    title: 'Digital Micro-Ohmmeter for Motor Stator Phase Resistance',
    highlights: [
      'Four-wire Kelvin test clips for sub-milliohm accuracy',
      'Instant verification of phase balance after parallel rewinding',
      'Built-in temperature compensation for 20°C standard reference',
    ],
    cta: 'Explore Test Meters',
    sponsor: 'CalibTest Industrial',
  },
};

export const NativeAd: React.FC<NativeAdProps> = ({
  variant = 'calculator',
  className = '',
}) => {
  const [clicked, setClicked] = useState(false);
  const [nativeAdsEnabled] = useNativeAdsEnabled();
  const data = NATIVE_AD_VARIANTS[variant];

  if (!nativeAdsEnabled) {
    return null;
  }

  const handleClick = (e: React.MouseEvent) => {
    e.preventDefault();
    setClicked(true);
    setTimeout(() => setClicked(false), 2000);
  };

  return (
    <div
      className={`bg-slate-900/90 border border-slate-800 hover:border-amber-500/40 rounded-xl p-3.5 sm:p-5 transition-all shadow-xs min-h-[100px] ${className}`}
    >
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1.5 border-b border-slate-800/80 pb-2.5 mb-2.5">
        <div className="flex items-center gap-2 flex-wrap">
          <span className="bg-amber-500/15 border border-amber-500/30 text-amber-300 text-[10px] font-bold px-2 py-0.5 rounded font-mono uppercase tracking-wide">
            Sponsored
          </span>
          <span className="text-xs text-slate-400 font-medium truncate max-w-[220px] sm:max-w-none">
            {data.badge} • <strong className="text-slate-300">{data.sponsor}</strong>
          </span>
        </div>
        <div className="flex items-center gap-1 text-[10px] sm:text-[11px] text-emerald-400 font-mono">
          <ShieldCheck className="w-3.5 h-3.5" />
          <span>Verified Industrial Supplier</span>
        </div>
      </div>

      <div className="space-y-2.5">
        <h4 className="text-xs sm:text-base font-bold text-white tracking-tight leading-snug">
          {data.title}
        </h4>

        {/* Highlights: 1 column compact on mobile, 3 columns on sm+ */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-1.5 sm:gap-2 pt-0.5">
          {data.highlights.map((h, i) => (
            <div
              key={i}
              className={`flex items-start gap-1.5 text-xs text-slate-300 bg-slate-950/60 p-2 rounded-lg border border-slate-800/60 ${
                i === 2 ? 'hidden sm:flex' : 'flex'
              }`}
            >
              <CheckCircle2 className="w-3.5 h-3.5 text-amber-400 shrink-0 mt-0.5" />
              <span className="text-[11px] sm:text-xs leading-tight">{h}</span>
            </div>
          ))}
        </div>

        <div className="pt-1.5 flex items-center justify-between gap-2.5 flex-wrap">
          <span className="text-[10px] sm:text-[11px] text-slate-500 hidden xs:inline">
            Free rewind tools supported by verified industry partners.
          </span>

          <button
            type="button"
            onClick={handleClick}
            className="inline-flex items-center justify-center gap-1.5 px-3.5 py-2 rounded-lg bg-slate-800 hover:bg-slate-700 text-amber-300 border border-amber-500/30 font-bold text-xs transition cursor-pointer active:scale-95 min-h-[38px] w-full xs:w-auto ml-auto"
          >
            <span>{clicked ? 'Opening Sponsor...' : data.cta}</span>
            <ExternalLink className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>
    </div>
  );
};
