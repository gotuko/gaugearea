'use client';

import React, { useState, useMemo, useCallback, useEffect } from 'react';
import {
  ALL_SWG_NUMBERS,
  SWG_BY_NUMBER,
  AWG_BY_NUMBER,
  OriginalWireItem,
  calculateCombinations,
  calcAreaFromDiameter,
  CombinationResult,
  WindingStrategy,
} from '@/lib/swgData';
import {
  useInStockSwgs,
  useSpoolCounts,
  useStockFilterToggle,
  useAllowMultipleSameWire,
  useWindingStrategy,
  useFullScreenAdsEnabled,
} from '@/lib/workshopStore';
import { adPreloader } from '@/lib/adPreloader';
import { Navbar } from '@/components/Navbar';
import { OriginalWireInput } from '@/components/OriginalWireInput';
import { InStockSelector } from '@/components/InStockSelector';
import { ProcessBar } from '@/components/ProcessBar';
import { ResultsList } from '@/components/ResultsList';
import { InventoryModal } from '@/components/InventoryModal';
import { SwgReferenceView } from '@/components/SwgReferenceView';
import { BannerAd } from '@/components/ads/BannerAd';
import { NativeAd } from '@/components/ads/NativeAd';
import { InterstitialAdModal } from '@/components/ads/InterstitialAdModal';
import { AdminModal } from '@/components/AdminModal';

// Interstitial ad rate limiting: at most 1 full-screen ad every 2 to 3 minutes (150 seconds)
const INTERSTITIAL_COOLDOWN_MS = 150 * 1000;

export default function Home() {
  // Page step for user flow requested: "user click prosace after that you procese the combination calculation and it is next page"
  const [calcPage, setCalcPage] = useState<'input' | 'results'>('input');

  // Original Wire Setup
  const [wires, setWires] = useState<OriginalWireItem[]>([
    {
      id: 'init-1',
      mode: 'swg',
      swg: 17,
      awg: 15,
      customDiameterMm: 1.422,
      count: 1,
    },
  ]);

  // Target wire count: 1..8, custom (1..16), or 'auto'
  const [wireCountChoice, setWireCountChoice] = useState<number | 'auto'>('auto');

  // Tolerance state: symmetric ±% (including 0%, 0.2%, etc.) or custom Min% - Max%
  const [toleranceMode, setToleranceMode] = useState<'symmetric' | 'custom'>('symmetric');
  const [tolerancePct, setTolerancePct] = useState<number>(5);
  const [minTolerancePct, setMinTolerancePct] = useState<number>(95);
  const [maxTolerancePct, setMaxTolerancePct] = useState<number>(105);

  // Workshop persistent inventory store
  const [inStockSwgs, handleInStockChange] = useInStockSwgs();
  const [spoolCounts, setSpoolCounts, updateSpoolCount] = useSpoolCounts();
  const [useStockFilter, setUseStockFilter] = useStockFilterToggle();
  const [allowMultipleSameWire, setAllowMultipleSameWire] = useAllowMultipleSameWire();
  const [windingStrategy, setWindingStrategy] = useWindingStrategy();

  // Active view tab: 'calculator' | 'reference'
  const [activeTab, setActiveTab] = useState<'calculator' | 'reference'>('calculator');

  // Inventory modal state
  const [isInventoryOpen, setIsInventoryOpen] = useState(false);

  // Processing state
  const [isProcessing, setIsProcessing] = useState(false);

  // Full-screen interstitial ads preference (configured via In-App Admin Panel)
  const [fullScreenAdsEnabled] = useFullScreenAdsEnabled();
  const [isInterstitialOpen, setIsInterstitialOpen] = useState(false);
  const [isAdminOpen, setIsAdminOpen] = useState(false);

  // Processed calculation results (stored upon clicking Process Combinations)
  const [processedResults, setProcessedResults] = useState<CombinationResult[]>([]);

  // Pre-load ad assets on application mount for instant 0ms delivery
  useEffect(() => {
    adPreloader.preloadAll();
  }, []);

  // Calculate target copper area
  const targetArea = useMemo(() => {
    return wires.reduce((sum, w) => {
      let singleArea = 0;
      if (w.mode === 'swg') {
        singleArea = SWG_BY_NUMBER.get(w.swg)?.areaMm2 || 0;
      } else if (w.mode === 'awg') {
        singleArea = AWG_BY_NUMBER.get(w.awg ?? 18)?.areaMm2 || 0;
      } else {
        singleArea = calcAreaFromDiameter(w.customDiameterMm);
      }
      return sum + singleArea * Math.max(1, w.count);
    }, 0);
  }, [wires]);

  // Effective min & max tolerance percentages
  const effectiveMin = toleranceMode === 'symmetric' ? 100 - tolerancePct : minTolerancePct;
  const effectiveMax = toleranceMode === 'symmetric' ? 100 + tolerancePct : maxTolerancePct;

  const handleSymmetricToleranceChange = (pct: number) => {
    setTolerancePct(pct);
    setMinTolerancePct(100 - pct);
    setMaxTolerancePct(100 + pct);
  };

  const handleCustomRangeChange = (min: number, max: number) => {
    setMinTolerancePct(min);
    setMaxTolerancePct(max);
  };

  // Real execution of calculation
  const executeCalculation = useCallback(() => {
    setIsInterstitialOpen(false);
    setIsProcessing(true);

    setTimeout(() => {
      const primaryOriginalSwg =
        wires.length === 1 && wires[0].mode === 'swg' ? wires[0].swg : undefined;

      const calculated = calculateCombinations(
        targetArea,
        inStockSwgs,
        wireCountChoice,
        effectiveMin,
        effectiveMax,
        spoolCounts,
        useStockFilter,
        windingStrategy,
        allowMultipleSameWire,
        primaryOriginalSwg
      );

      setProcessedResults(calculated);
      setIsProcessing(false);
      setCalcPage('results');

      if (typeof window !== 'undefined') {
        window.scrollTo({ top: 0, behavior: 'smooth' });
      }
    }, 200);
  }, [
    wires,
    targetArea,
    inStockSwgs,
    wireCountChoice,
    effectiveMin,
    effectiveMax,
    spoolCounts,
    useStockFilter,
    windingStrategy,
    allowMultipleSameWire,
  ]);

  // Triggered when user clicks Process Combinations
  const handleTriggerProcess = useCallback(() => {
    if (fullScreenAdsEnabled) {
      let lastShown = 0;
      try {
        const stored = typeof window !== 'undefined' ? localStorage.getItem('rewindgauge_last_interstitial_time') : null;
        if (stored) lastShown = parseInt(stored, 10);
      } catch {
        // Ignore localStorage error
      }

      const now = Date.now();
      if (now - lastShown >= INTERSTITIAL_COOLDOWN_MS) {
        // Update timestamp and show ad
        try {
          if (typeof window !== 'undefined') {
            localStorage.setItem('rewindgauge_last_interstitial_time', now.toString());
          }
        } catch {
          // Ignore
        }
        setIsInterstitialOpen(true);
        return;
      }
    }

    // Within cooldown or ads disabled: calculate immediately
    executeCalculation();
  }, [fullScreenAdsEnabled, executeCalculation]);

  const wireCountDesc =
    wireCountChoice === 'auto'
      ? 'Auto (1–8 Strands)'
      : `${wireCountChoice} Strand${wireCountChoice > 1 ? 's' : ''} in Parallel`;

  const strategyDesc =
    windingStrategy === 'smart'
      ? 'Smart Workshop Best'
      : windingStrategy === 'same_gauge'
      ? 'Same Wire Only (e.g. 2× 25 SWG)'
      : windingStrategy === 'thicker'
      ? 'Thicker (1–3 Strands)'
      : windingStrategy === 'thinner'
      ? 'Flexible (4–8 Strands)'
      : 'All Combinations';

  const toleranceDesc =
    toleranceMode === 'symmetric'
      ? `±${tolerancePct}% (${effectiveMin.toFixed(1)}%–${effectiveMax.toFixed(1)}%)`
      : `${effectiveMin.toFixed(1)}%–${effectiveMax.toFixed(1)}% Area`;

  const originalWiresText = wires
    .map((w) => {
      if (w.mode === 'swg') return `${w.count}× ${w.swg} SWG`;
      if (w.mode === 'awg') return `${w.count}× ${w.awg} AWG`;
      return `${w.count}× ø${w.customDiameterMm}mm`;
    })
    .join(' + ');

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 selection:bg-amber-500/30 selection:text-amber-200 pb-20 sm:pb-24">
      {/* Top Header */}
      <Navbar
        activeTab={activeTab}
        onChangeTab={setActiveTab}
        onOpenAdmin={() => setIsAdminOpen(true)}
      />

      {/* Main Container */}
      <main className="max-w-5xl mx-auto px-4 sm:px-6 py-5 sm:py-6 space-y-6">
        {activeTab === 'calculator' && (
          <>
            {/* PAGE 1: Input Specifications and Inventory */}
            {calcPage === 'input' && (
              <div className="space-y-6">
                {/* 1. TOP BANNER AD (Requested for first page) */}
                <BannerAd position="top" />

                {/* 2. Original Wire Input Specifications */}
                <OriginalWireInput
                  wires={wires}
                  onChangeWires={setWires}
                  wireCountChoice={wireCountChoice}
                  onChangeWireCountChoice={setWireCountChoice}
                  windingStrategy={windingStrategy}
                  onChangeWindingStrategy={setWindingStrategy}
                  toleranceMode={toleranceMode}
                  onChangeToleranceMode={setToleranceMode}
                  tolerancePct={tolerancePct}
                  onChangeTolerancePct={handleSymmetricToleranceChange}
                  minTolerancePct={minTolerancePct}
                  maxTolerancePct={maxTolerancePct}
                  onChangeCustomRange={handleCustomRangeChange}
                  onOpenInventory={() => setIsInventoryOpen(true)}
                  inStockCount={inStockSwgs.length}
                />

                {/* 3. NATIVE AD (Requested for first page) */}
                <NativeAd variant="calculator" />

                {/* 4. In-Stock Wire Selection & Spool Counts with master filter toggle */}
                <InStockSelector
                  inStockSwgs={inStockSwgs}
                  onChangeInStock={handleInStockChange}
                  spoolCounts={spoolCounts}
                  onUpdateSpoolCount={updateSpoolCount}
                  useStockFilter={useStockFilter}
                  onToggleStockFilter={setUseStockFilter}
                  allowMultipleSameWire={allowMultipleSameWire}
                  onToggleAllowMultipleSameWire={setAllowMultipleSameWire}
                  onOpenModal={() => setIsInventoryOpen(true)}
                />

                {/* 5. BANNER AD BEFORE PROCESS BUTTON (Requested by user) */}
                <BannerAd position="before_process" />

                {/* 6. Explicit Process Combinations Bar */}
                <ProcessBar
                  onProcess={handleTriggerProcess}
                  isProcessing={isProcessing}
                  resultCount={processedResults.length}
                  targetArea={targetArea}
                  wireCountDescription={wireCountDesc}
                  strategyDescription={strategyDesc}
                  toleranceDescription={toleranceDesc}
                  inStockCount={inStockSwgs.length}
                  useStockFilter={useStockFilter}
                />
              </div>
            )}

            {/* PAGE 2: Replacement Combinations Output Page */}
            {calcPage === 'results' && (
              <div className="space-y-6">
                <ResultsList
                  results={processedResults}
                  targetArea={targetArea}
                  minTolerancePct={effectiveMin}
                  maxTolerancePct={effectiveMax}
                  onOpenInventory={() => setIsInventoryOpen(true)}
                  onBackToEdit={() => setCalcPage('input')}
                  specificationSummary={{
                    wiresText: originalWiresText,
                    wireCountText: wireCountDesc,
                    toleranceText: toleranceDesc,
                    stockFilterText: useStockFilter
                      ? `${inStockSwgs.length} SWG (Reels Enforced)`
                      : 'Disabled (All Standard SWG 10–36)',
                  }}
                />
              </div>
            )}
          </>
        )}

        {/* SWG & AWG Reference Table View */}
        {activeTab === 'reference' && (
          <SwgReferenceView
            onNavigateToCalculator={() => {
              setActiveTab('calculator');
              setCalcPage('input');
            }}
          />
        )}
      </main>

      {/* Inventory Modal */}
      <InventoryModal
        isOpen={isInventoryOpen}
        onClose={() => setIsInventoryOpen(false)}
        inStockSwgs={inStockSwgs}
        onChangeInStock={handleInStockChange}
      />

      {/* Full-Screen Interstitial Ad Modal on Process */}
      <InterstitialAdModal
        isOpen={isInterstitialOpen}
        onProceed={executeCalculation}
      />

      {/* In-App Admin Control Panel */}
      <AdminModal
        isOpen={isAdminOpen}
        onClose={() => setIsAdminOpen(false)}
      />
    </div>
  );
}
