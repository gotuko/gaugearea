'use client';

import React from 'react';
import {
  X,
  ShieldAlert,
  Sliders,
  Sparkles,
  Zap,
  CheckCircle2,
  RefreshCw,
  Eye,
  Tv,
  LayoutGrid,
} from 'lucide-react';
import {
  useFullScreenAdsEnabled,
  useBannerAdsEnabled,
  useNativeAdsEnabled,
  useFloatingBannerEnabled,
  useAdFrequency,
} from '@/lib/workshopStore';

interface AdminModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const AdminModal: React.FC<AdminModalProps> = ({ isOpen, onClose }) => {
  const [fullScreenAds, setFullScreenAds] = useFullScreenAdsEnabled();
  const [bannerAds, setBannerAds] = useBannerAdsEnabled();
  const [nativeAds, setNativeAds] = useNativeAdsEnabled();
  const [floatingBanner, setFloatingBanner] = useFloatingBannerEnabled();
  const [adFrequency, setAdFrequency] = useAdFrequency();

  if (!isOpen) return null;

  const handleResetDefaults = () => {
    setFullScreenAds(true);
    setBannerAds(true);
    setNativeAds(true);
    setFloatingBanner(true);
    setAdFrequency(3);
  };

  return (
    <div
      role="dialog"
      aria-modal="true"
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm animate-in fade-in duration-150"
    >
      <div className="relative w-full max-w-lg bg-slate-900 border border-slate-700 rounded-2xl shadow-2xl overflow-hidden text-slate-100 flex flex-col max-h-[90vh]">
        {/* Header */}
        <div className="flex items-center justify-between px-5 py-4 bg-slate-950 border-b border-slate-800">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-amber-500/20 border border-amber-500/40 flex items-center justify-center text-amber-400">
              <Sliders className="w-4 h-4" />
            </div>
            <div>
              <h2 className="text-sm font-bold text-white flex items-center gap-2">
                In-App Admin Control Panel
                <span className="text-[10px] uppercase font-mono px-1.5 py-0.5 rounded-sm bg-amber-500/20 text-amber-300 border border-amber-500/30">
                  Admin Only
                </span>
              </h2>
              <p className="text-[11px] text-slate-400">
                Monetization settings &amp; ad display configuration
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition cursor-pointer"
            title="Close Admin Panel"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Content Body */}
        <div className="p-5 space-y-5 overflow-y-auto">
          {/* Notice info */}
          <div className="bg-slate-950/70 border border-slate-800 rounded-xl p-3 text-xs text-slate-300 flex items-start gap-2.5">
            <ShieldAlert className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
            <div>
              <p className="font-semibold text-slate-200">Admin-Managed Monetization</p>
              <p className="text-[11px] text-slate-400 mt-0.5">
                These controls are hidden from general app users. Changes are saved locally and immediately apply across all app screens.
              </p>
            </div>
          </div>

          {/* Ad Preload & Mobile Comfort Status Card */}
          <div className="bg-amber-950/20 border border-amber-500/30 rounded-xl p-3.5 space-y-2">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className="relative flex h-2 w-2">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
                </span>
                <span className="text-xs font-bold text-amber-200">Ad Preload Engine Active</span>
              </div>
              <span className="text-[10px] font-mono font-bold px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
                0ms Latency Ready
              </span>
            </div>
            <p className="text-[11px] text-slate-300">
              Interstitials and banners are pre-warmed in the background for zero loading lag and tuned with anti-misclick spacing and zero Cumulative Layout Shift (CLS) on mobile screens.
            </p>
          </div>

          {/* Toggle Controls List */}
          <div className="space-y-3">
            <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider">
              Ad Placements &amp; Formats
            </h3>

            {/* 1. Full-screen Interstitial Ads */}
            <div className="bg-slate-950 border border-slate-800/90 rounded-xl p-3.5 flex items-center justify-between gap-4">
              <div className="space-y-0.5">
                <div className="flex items-center gap-2">
                  <Tv className="w-4 h-4 text-amber-400" />
                  <span className="text-xs font-bold text-white">Full-Screen Interstitial Ad</span>
                  <span className={`text-[10px] font-mono font-bold px-1.5 py-0.2 rounded ${
                    fullScreenAds ? 'bg-amber-500/20 text-amber-300' : 'bg-slate-800 text-slate-400'
                  }`}>
                    {fullScreenAds ? 'ACTIVE' : 'OFF'}
                  </span>
                </div>
                <p className="text-[11px] text-slate-400">
                  Rate-limited to 1 full-screen sponsor ad every 2 to 3 minutes when clicking &quot;Process Combinations&quot;
                </p>
              </div>
              <button
                type="button"
                onClick={() => setFullScreenAds(!fullScreenAds)}
                className={`relative inline-flex h-6 w-11 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-hidden ${
                  fullScreenAds ? 'bg-amber-500' : 'bg-slate-800'
                }`}
              >
                <span
                  className={`pointer-events-none inline-block h-5 w-5 transform rounded-full bg-slate-950 shadow-sm ring-0 transition duration-200 ease-in-out ${
                    fullScreenAds ? 'translate-x-5' : 'translate-x-0'
                  }`}
                />
              </button>
            </div>

            {/* 2. Banner Ads */}
            <div className="bg-slate-950 border border-slate-800/90 rounded-xl p-3.5 flex items-center justify-between gap-4">
              <div className="space-y-0.5">
                <div className="flex items-center gap-2">
                  <LayoutGrid className="w-4 h-4 text-amber-400" />
                  <span className="text-xs font-bold text-white">Top &amp; Bottom Banner Ads</span>
                  <span className={`text-[10px] font-mono font-bold px-1.5 py-0.2 rounded ${
                    bannerAds ? 'bg-amber-500/20 text-amber-300' : 'bg-slate-800 text-slate-400'
                  }`}>
                    {bannerAds ? 'ACTIVE' : 'OFF'}
                  </span>
                </div>
                <p className="text-[11px] text-slate-400">
                  Top page banner, before-process banner, and page bottom banner slots
                </p>
              </div>
              <button
                type="button"
                onClick={() => setBannerAds(!bannerAds)}
                className={`relative inline-flex h-6 w-11 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-hidden ${
                  bannerAds ? 'bg-amber-500' : 'bg-slate-800'
                }`}
              >
                <span
                  className={`pointer-events-none inline-block h-5 w-5 transform rounded-full bg-slate-950 shadow-sm ring-0 transition duration-200 ease-in-out ${
                    bannerAds ? 'translate-x-5' : 'translate-x-0'
                  }`}
                />
              </button>
            </div>

            {/* 3. In-Feed Native Ads */}
            <div className="bg-slate-950 border border-slate-800/90 rounded-xl p-3.5 flex items-center justify-between gap-4">
              <div className="space-y-0.5">
                <div className="flex items-center gap-2">
                  <Eye className="w-4 h-4 text-amber-400" />
                  <span className="text-xs font-bold text-white">In-Feed Native Ads</span>
                  <span className={`text-[10px] font-mono font-bold px-1.5 py-0.2 rounded ${
                    nativeAds ? 'bg-amber-500/20 text-amber-300' : 'bg-slate-800 text-slate-400'
                  }`}>
                    {nativeAds ? 'ACTIVE' : 'OFF'}
                  </span>
                </div>
                <p className="text-[11px] text-slate-400">
                  Sponsored cards inserted naturally into results and specification views
                </p>
              </div>
              <button
                type="button"
                onClick={() => setNativeAds(!nativeAds)}
                className={`relative inline-flex h-6 w-11 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-hidden ${
                  nativeAds ? 'bg-amber-500' : 'bg-slate-800'
                }`}
              >
                <span
                  className={`pointer-events-none inline-block h-5 w-5 transform rounded-full bg-slate-950 shadow-sm ring-0 transition duration-200 ease-in-out ${
                    nativeAds ? 'translate-x-5' : 'translate-x-0'
                  }`}
                />
              </button>
            </div>

            {/* 4. Floating Bottom Banner Ad */}
            <div className="bg-slate-950 border border-slate-800/90 rounded-xl p-3.5 flex items-center justify-between gap-4">
              <div className="space-y-0.5">
                <div className="flex items-center gap-2">
                  <Zap className="w-4 h-4 text-amber-400" />
                  <span className="text-xs font-bold text-white">Floating Docked Banner Ad</span>
                  <span className={`text-[10px] font-mono font-bold px-1.5 py-0.2 rounded ${
                    floatingBanner ? 'bg-amber-500/20 text-amber-300' : 'bg-slate-800 text-slate-400'
                  }`}>
                    {floatingBanner ? 'ACTIVE' : 'OFF'}
                  </span>
                </div>
                <p className="text-[11px] text-slate-400">
                  Persistent slim banner docked above bottom navigation on results screen
                </p>
              </div>
              <button
                type="button"
                onClick={() => setFloatingBanner(!floatingBanner)}
                className={`relative inline-flex h-6 w-11 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-hidden ${
                  floatingBanner ? 'bg-amber-500' : 'bg-slate-800'
                }`}
              >
                <span
                  className={`pointer-events-none inline-block h-5 w-5 transform rounded-full bg-slate-950 shadow-sm ring-0 transition duration-200 ease-in-out ${
                    floatingBanner ? 'translate-x-5' : 'translate-x-0'
                  }`}
                />
              </button>
            </div>
          </div>

          {/* Ad Frequency Selector */}
          <div className="bg-slate-950 border border-slate-800 rounded-xl p-4 space-y-2">
            <div className="flex items-center justify-between">
              <label className="text-xs font-bold text-white">
                Results Page Ad Frequency
              </label>
              <span className="text-xs font-mono font-bold text-amber-400">
                Every {adFrequency} options
              </span>
            </div>
            <p className="text-[11px] text-slate-400">
              Insert a banner or native ad card every X combination results:
            </p>
            <div className="grid grid-cols-4 gap-2 pt-1">
              {[2, 3, 4, 5].map((freq) => (
                <button
                  key={freq}
                  type="button"
                  onClick={() => setAdFrequency(freq)}
                  className={`py-1.5 rounded-lg text-xs font-bold font-mono transition cursor-pointer border ${
                    adFrequency === freq
                      ? 'bg-amber-500 border-amber-400 text-slate-950'
                      : 'bg-slate-900 border-slate-700 text-slate-300 hover:border-slate-500'
                  }`}
                >
                  Every {freq}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="flex items-center justify-between px-5 py-3.5 bg-slate-950 border-t border-slate-800">
          <button
            type="button"
            onClick={handleResetDefaults}
            className="inline-flex items-center gap-1.5 text-xs text-slate-400 hover:text-white transition cursor-pointer"
          >
            <RefreshCw className="w-3.5 h-3.5" />
            <span>Reset Defaults</span>
          </button>
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 text-xs font-bold transition cursor-pointer shadow-xs"
          >
            Done
          </button>
        </div>
      </div>
    </div>
  );
};
