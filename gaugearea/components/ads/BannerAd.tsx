'use client';

import React, { useState } from 'react';
import { ExternalLink, X, Info, Sparkles, ShieldCheck } from 'lucide-react';
import { useBannerAdsEnabled, useFloatingBannerEnabled } from '@/lib/workshopStore';

export interface BannerAdProps {
  position: 'top' | 'before_process' | 'bottom' | 'floating' | 'infeed';
  onCloseFloating?: () => void;
  className?: string;
}

interface MockAdCreative {
  tagline: string;
  headline: string;
  description: string;
  ctaText: string;
  sponsorName: string;
  badge: string;
}

const MOCK_BANNER_CREATIVES: Record<string, MockAdCreative> = {
  top: {
    tagline: 'INDUSTRIAL WIRE SUPPLY',
    headline: 'Grade-2 Dual-Coated Magnet Copper Wire (Class H 200°C)',
    description: 'Direct factory reels from 10 to 36 SWG. High dielectric strength, immediate dispatch.',
    ctaText: 'Shop Winding Wire',
    sponsorName: 'ElectroWire Industries',
    badge: 'Certified Copper',
  },
  before_process: {
    tagline: 'PREMIUM WORKSHOP TOOL',
    headline: 'High-Torque Automatic Motor Coil Winder with Digital Counter',
    description: 'Pre-set turn stops, dual-spool tensioner, and magnetic foot brake. 50% time saved.',
    ctaText: 'View Machine Specs',
    sponsorName: 'RotaryTech Tools',
    badge: 'Workshop Special',
  },
  infeed: {
    tagline: 'PREMIUM COIL INSULATION',
    headline: 'Nomex® & Mylar Slot Insulation Sheets & Phase Separators',
    description: 'High-temperature dielectric breakdown resistance up to 180°C (Class H).',
    ctaText: 'View Insulating Materials',
    sponsorName: 'ThermoShield Liners',
    badge: 'Fast Delivery',
  },
  bottom: {
    tagline: 'THERMAL PROTECTION',
    headline: 'Fast-Cure Motor Impregnating Varnish & Class F Slot Liners',
    description: 'High moisture resistance, deep coil penetration, and superior bonding strength.',
    ctaText: 'Order Varnish Kit',
    sponsorName: 'InsulShield Pro',
    badge: 'Pro Rewinder',
  },
  floating: {
    tagline: 'SPECIAL OFFER',
    headline: 'Digital 0.001mm Wire Micrometer with SWG/AWG Gauge Scale',
    description: 'Instant measurement of enamel and bare copper diameter.',
    ctaText: 'Check Price',
    sponsorName: 'PrecisionGauge',
    badge: '40% Off',
  },
};

export const BannerAd: React.FC<BannerAdProps> = ({
  position,
  onCloseFloating,
  className = '',
}) => {
  const [isDismissed, setIsDismissed] = useState(false);
  const [clicked, setClicked] = useState(false);
  const [bannerAdsEnabled] = useBannerAdsEnabled();
  const [floatingBannerEnabled] = useFloatingBannerEnabled();

  if (isDismissed) {
    return null;
  }

  // Admin global toggles
  if (position === 'floating' && !floatingBannerEnabled) {
    return null;
  }
  if (position !== 'floating' && !bannerAdsEnabled) {
    return null;
  }

  const creative = MOCK_BANNER_CREATIVES[position] || MOCK_BANNER_CREATIVES.top;

  const handleClick = (e: React.MouseEvent) => {
    e.preventDefault();
    setClicked(true);
    setTimeout(() => setClicked(false), 2000);
  };

  // FLOATING BANNER AD: Docked comfortably at bottom with safe-area spacing and anti-misclick controls
  if (position === 'floating') {
    return (
      <div className="fixed bottom-[max(0.75rem,env(safe-area-inset-bottom))] left-0 right-0 z-30 px-3 pointer-events-none transition-all">
        <div className="max-w-4xl mx-auto pointer-events-auto">
          <div className="bg-slate-900/98 backdrop-blur-md border border-amber-500/40 rounded-xl p-2 sm:p-2.5 shadow-2xl flex items-center justify-between gap-2.5 text-white min-h-[52px]">
            <div className="flex items-center gap-2 min-w-0 flex-1">
              <span className="bg-amber-500/20 text-amber-300 text-[10px] font-bold px-1.5 py-0.5 rounded border border-amber-500/30 uppercase shrink-0 font-mono">
                Ad
              </span>
              <div className="min-w-0">
                <div className="flex items-center gap-1.5 flex-wrap">
                  <span className="text-xs font-bold text-white truncate max-w-[200px] sm:max-w-md">
                    {creative.headline}
                  </span>
                  <span className="text-[10px] text-amber-400 font-mono hidden md:inline">
                    • {creative.badge}
                  </span>
                </div>
                <p className="text-[11px] text-slate-300 truncate hidden sm:block">
                  {creative.description}
                </p>
              </div>
            </div>

            <div className="flex items-center gap-1.5 shrink-0">
              <button
                type="button"
                onClick={handleClick}
                className="px-2.5 sm:px-3 py-1.5 rounded-lg bg-amber-500 hover:bg-amber-400 text-slate-950 text-xs font-bold transition flex items-center gap-1 cursor-pointer shadow-xs active:scale-95 min-h-[36px]"
              >
                <span>{clicked ? 'Opening...' : creative.ctaText}</span>
                <ExternalLink className="w-3 h-3" />
              </button>

              <button
                type="button"
                onClick={() => {
                  setIsDismissed(true);
                  if (onCloseFloating) onCloseFloating();
                }}
                className="w-8 h-8 rounded-lg flex items-center justify-center text-slate-400 hover:text-white hover:bg-slate-800 transition cursor-pointer shrink-0 active:scale-90"
                title="Hide ad"
                aria-label="Hide ad"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // STANDARD IN-PAGE BANNER ADS (Top, Before Process, Bottom)
  // Designed for zero-layout-shift and ergonomic mobile readability
  return (
    <div
      className={`relative overflow-hidden rounded-xl border border-slate-800/90 bg-gradient-to-r from-slate-950 via-slate-900 to-slate-950 p-2.5 sm:p-3.5 text-slate-100 shadow-xs transition-all min-h-[60px] sm:min-h-[72px] ${className}`}
    >
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2.5">
        {/* Ad Info Header & Body */}
        <div className="min-w-0 flex-1 space-y-1">
          <div className="flex items-center gap-2 flex-wrap">
            <span className="bg-amber-500/20 text-amber-300 text-[10px] font-bold px-1.5 py-0.2 rounded border border-amber-500/30 uppercase font-mono">
              Ad
            </span>
            <span className="text-[10px] text-slate-400 font-semibold uppercase tracking-wider">
              {creative.tagline}
            </span>
            <span className="text-slate-600 text-xs hidden xs:inline">•</span>
            <span className="text-[10px] text-slate-400 font-medium hidden xs:inline">
              by {creative.sponsorName}
            </span>
            <span className="text-[10px] text-emerald-400 font-mono flex items-center gap-0.5 ml-auto sm:ml-0">
              <ShieldCheck className="w-3 h-3" />
              <span className="hidden sm:inline">Verified</span>
            </span>
          </div>

          <h4 className="text-xs sm:text-sm font-bold text-white tracking-tight leading-snug line-clamp-1 sm:line-clamp-none">
            {creative.headline}
          </h4>

          <p className="text-[11px] sm:text-xs text-slate-300 leading-relaxed max-w-2xl hidden sm:block">
            {creative.description}
          </p>
        </div>

        {/* Action Button & Safe Close Button */}
        <div className="flex items-center justify-between sm:justify-end gap-2 shrink-0 pt-1 sm:pt-0 border-t sm:border-t-0 border-slate-800/80">
          <span className="text-[11px] text-slate-400 truncate max-w-[140px] sm:hidden font-mono text-[10px]">
            {creative.sponsorName}
          </span>

          <div className="flex items-center gap-1.5 ml-auto">
            <button
              type="button"
              onClick={handleClick}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-xs transition cursor-pointer shadow-xs active:scale-95 min-h-[36px]"
            >
              <span>{clicked ? 'Opening...' : creative.ctaText}</span>
              <ExternalLink className="w-3 h-3" />
            </button>

            <button
              type="button"
              onClick={() => setIsDismissed(true)}
              className="w-8 h-8 rounded-lg flex items-center justify-center text-slate-400 hover:text-white hover:bg-slate-800/70 transition cursor-pointer shrink-0 active:scale-90"
              title="Close Ad"
              aria-label="Close Ad"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
