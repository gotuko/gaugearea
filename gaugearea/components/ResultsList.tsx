'use client';

import React, { useState, useMemo } from 'react';
import { CombinationResult } from '@/lib/swgData';
import {
  CheckCircle2,
  AlertTriangle,
  XCircle,
  Copy,
  Check,
  ArrowLeft,
  SlidersHorizontal,
  Printer,
  Sparkles,
  Star,
  Zap,
  ArrowUpDown,
  ShieldCheck,
  Layers,
} from 'lucide-react';

interface ResultsListProps {
  results: CombinationResult[];
  targetArea: number;
  minTolerancePct?: number;
  maxTolerancePct?: number;
  onOpenInventory: () => void;
  onBackToEdit?: () => void;
  specificationSummary?: {
    wiresText: string;
    wireCountText: string;
    toleranceText: string;
    stockFilterText: string;
  };
}

type QuickViewFilter = 'all' | 'workshop_best' | 'same_gauge' | 'thicker' | 'flexible';
type SortOption = 'workshop' | 'closest' | 'fewest' | 'thickest';

export const ResultsList: React.FC<ResultsListProps> = ({
  results,
  targetArea,
  minTolerancePct = 95,
  maxTolerancePct = 105,
  onOpenInventory,
  onBackToEdit,
  specificationSummary,
}) => {
  const [filterCategory, setFilterCategory] = useState<'all' | 'ideal' | 'usable' | 'out_of_range'>('all');
  const [quickView, setQuickView] = useState<QuickViewFilter>('all');
  const [sortBy, setSortBy] = useState<SortOption>('workshop');
  const [copiedId, setCopiedId] = useState<string | null>(null);

  const idealCount = results.filter((r) => r.category === 'ideal').length;
  const usableCount = results.filter((r) => r.category === 'usable').length;
  const outOfRangeCount = results.filter((r) => r.category === 'out_of_range').length;

  const sameGaugeCount = results.filter((r) => r.isIdenticalGauge).length;
  const thickerCount = results.filter((r) => r.wireCount <= 3).length;
  const flexibleCount = results.filter((r) => r.wireCount >= 4).length;
  const workshopBestCount = results.filter((r) => (r.practicalScore ?? 0) >= 80).length;

  // Filter & Sort results
  const processedResults = useMemo(() => {
    let list = results.filter((res) => {
      // Category filter
      if (filterCategory === 'ideal' && res.category !== 'ideal') return false;
      if (filterCategory === 'usable' && res.category !== 'usable') return false;
      if (filterCategory === 'out_of_range' && res.category !== 'out_of_range') return false;

      // Quick view filter
      if (quickView === 'workshop_best' && (res.practicalScore ?? 0) < 70) return false;
      if (quickView === 'same_gauge' && !res.isIdenticalGauge) return false;
      if (quickView === 'thicker' && res.wireCount > 3) return false;
      if (quickView === 'flexible' && res.wireCount < 4) return false;

      return true;
    });

    // Sort
    list.sort((a, b) => {
      if (sortBy === 'workshop') {
        const scoreDiff = (b.practicalScore ?? 0) - (a.practicalScore ?? 0);
        if (Math.abs(scoreDiff) > 0.001) return scoreDiff;
        return Math.abs(a.areaRatioPct - 100) - Math.abs(b.areaRatioPct - 100);
      }
      if (sortBy === 'closest') {
        return Math.abs(a.areaRatioPct - 100) - Math.abs(b.areaRatioPct - 100);
      }
      if (sortBy === 'fewest') {
        if (a.wireCount !== b.wireCount) return a.wireCount - b.wireCount;
        return (b.practicalScore ?? 0) - (a.practicalScore ?? 0);
      }
      if (sortBy === 'thickest') {
        // Smallest SWG number = thickest wire
        const minSwgA = Math.min(...a.groups.map((g) => g.swg));
        const minSwgB = Math.min(...b.groups.map((g) => g.swg));
        if (minSwgA !== minSwgB) return minSwgA - minSwgB;
        return Math.abs(a.areaRatioPct - 100) - Math.abs(b.areaRatioPct - 100);
      }
      return 0;
    });

    return list;
  }, [results, filterCategory, quickView, sortBy]);

  const handleCopy = (res: CombinationResult) => {
    const wireStr = res.groups
      .map((g) => `${g.count}× ${g.swg} SWG`)
      .join(' + ');
    const diffSign = res.areaDiffMm2 >= 0 ? '+' : '';
    const text = `Replacement: ${wireStr} | Total Area: ${res.comboAreaMm2.toFixed(4)} mm² vs Target: ${targetArea.toFixed(4)} mm² | Area Ratio: ${res.areaRatioPct.toFixed(1)}% (${diffSign}${res.areaDiffPct.toFixed(1)}%) | ${res.wireCount} in parallel`;

    navigator.clipboard.writeText(text).then(() => {
      setCopiedId(res.id);
      setTimeout(() => setCopiedId(null), 2000);
    });
  };

  const handlePrint = () => {
    if (typeof window !== 'undefined') {
      window.print();
    }
  };

  return (
    <div id="replacement-results" className="space-y-4 pb-20">
      {/* Top Navigation & Specification Overview Banner */}
      {specificationSummary && (
        <div className="bg-slate-900 border border-slate-800 rounded-xl p-3 sm:p-3.5 text-slate-100 shadow-sm space-y-2.5">
          <div className="flex items-center justify-between gap-2 border-b border-slate-800 pb-2">
            <div className="flex items-center gap-2">
              {onBackToEdit && (
                <button
                  type="button"
                  onClick={onBackToEdit}
                  className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-bold border border-slate-700 transition cursor-pointer active:scale-95"
                >
                  <ArrowLeft className="w-3.5 h-3.5 text-amber-400" />
                  <span>← Back to Edit</span>
                </button>
              )}
            </div>

            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={handlePrint}
                className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white text-xs font-medium border border-slate-700 transition cursor-pointer"
                title="Print winding specification sheet"
              >
                <Printer className="w-3.5 h-3.5 text-slate-400" />
                <span>Print Sheet</span>
              </button>
            </div>
          </div>

          {/* Quick specs grid */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-xs">
            <div className="bg-slate-950 p-2 rounded-lg border border-slate-800">
              <span className="text-slate-400 block text-[10px]">Original:</span>
              <span className="font-bold text-white font-mono text-xs truncate block">{specificationSummary.wiresText}</span>
            </div>
            <div className="bg-slate-950 p-2 rounded-lg border border-slate-800">
              <span className="text-slate-400 block text-[10px]">Target Area:</span>
              <span className="font-bold text-amber-400 font-mono text-xs sm:text-sm">{targetArea.toFixed(4)} mm²</span>
            </div>
            <div className="bg-slate-950 p-2 rounded-lg border border-slate-800">
              <span className="text-slate-400 block text-[10px]">Tolerance:</span>
              <span className="font-bold text-slate-200 font-mono text-xs">{specificationSummary.toleranceText}</span>
            </div>
            <div className="bg-slate-950 p-2 rounded-lg border border-slate-800">
              <span className="text-slate-400 block text-[10px]">Inventory:</span>
              <span className="font-bold text-slate-200 text-xs truncate block">{specificationSummary.stockFilterText}</span>
            </div>
          </div>
        </div>
      )}

      {/* Compact Strategy & Filter Bar */}
      <div className="bg-slate-900/90 border border-slate-800 rounded-lg p-2 sm:p-2.5 space-y-2">
        <div className="flex items-center justify-between gap-2 flex-wrap">
          <div className="flex items-center gap-1.5 text-xs">
            <Sparkles className="w-3.5 h-3.5 text-amber-400 shrink-0" />
            <span className="font-bold text-slate-200 text-xs">Filter &amp; Sort:</span>
          </div>

          {/* Compact Sort selector */}
          <div className="flex items-center gap-1.5 text-xs">
            <ArrowUpDown className="w-3 h-3 text-slate-400 shrink-0" />
            <span className="text-slate-400 font-medium text-[11px]">Sort:</span>
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value as SortOption)}
              className="bg-slate-950 border border-slate-700 text-amber-300 font-medium text-[11px] sm:text-xs rounded-md px-2 py-1 focus:border-amber-400 focus:outline-hidden cursor-pointer"
            >
              <option value="workshop">🌟 Workshop Best</option>
              <option value="closest">🎯 Closest Area</option>
              <option value="fewest">⚡ Fewest Strands</option>
              <option value="thickest">💪 Thickest Wire</option>
            </select>
          </div>
        </div>

        {/* Compact Strategy & Tolerance Filter Pills */}
        <div className="flex items-center gap-1 sm:gap-1.5 flex-wrap text-[11px]">
          <button
            type="button"
            onClick={() => {
              setQuickView('all');
              setFilterCategory('all');
            }}
            className={`px-2 py-0.5 sm:px-2.5 sm:py-1 rounded-md font-semibold transition cursor-pointer border ${
              quickView === 'all' && filterCategory === 'all'
                ? 'bg-amber-500 border-amber-400 text-slate-950 shadow-xs'
                : 'bg-slate-950 border-slate-800 text-slate-400 hover:text-slate-200'
            }`}
          >
            All ({results.length})
          </button>

          <button
            type="button"
            onClick={() => setQuickView('workshop_best')}
            className={`px-2 py-0.5 sm:px-2.5 sm:py-1 rounded-md font-semibold transition cursor-pointer border ${
              quickView === 'workshop_best'
                ? 'bg-amber-500 border-amber-400 text-slate-950 shadow-xs'
                : 'bg-slate-950 border-slate-800 text-slate-300 hover:text-amber-400'
            }`}
            title="Highest workshop efficiency score"
          >
            Top Picks ({workshopBestCount})
          </button>

          {sameGaugeCount > 0 && (
            <button
              type="button"
              onClick={() => setQuickView('same_gauge')}
              className={`px-2 py-0.5 sm:px-2.5 sm:py-1 rounded-md font-semibold transition cursor-pointer border ${
                quickView === 'same_gauge'
                  ? 'bg-amber-500 border-amber-400 text-slate-950 shadow-xs'
                  : 'bg-slate-950 border-slate-800 text-emerald-300 hover:text-emerald-200'
              }`}
              title="Single wire gauge (1 reel)"
            >
              Single Size ({sameGaugeCount})
            </button>
          )}

          {thickerCount > 0 && (
            <button
              type="button"
              onClick={() => setQuickView('thicker')}
              className={`px-2 py-0.5 sm:px-2.5 sm:py-1 rounded-md font-semibold transition cursor-pointer border ${
                quickView === 'thicker'
                  ? 'bg-amber-500 border-amber-400 text-slate-950 shadow-xs'
                  : 'bg-slate-950 border-slate-800 text-slate-300 hover:text-slate-100'
              }`}
              title="1 to 3 strands"
            >
              1–3 Strands ({thickerCount})
            </button>
          )}

          {flexibleCount > 0 && (
            <button
              type="button"
              onClick={() => setQuickView('flexible')}
              className={`px-2 py-0.5 sm:px-2.5 sm:py-1 rounded-md font-semibold transition cursor-pointer border ${
                quickView === 'flexible'
                  ? 'bg-amber-500 border-amber-400 text-slate-950 shadow-xs'
                  : 'bg-slate-950 border-slate-800 text-slate-400 hover:text-slate-200'
              }`}
              title="4 or more strands"
            >
              4+ Strands ({flexibleCount})
            </button>
          )}

          <div className="h-3.5 w-px bg-slate-800 mx-0.5 hidden xs:block" />

          {/* Tolerance pills */}
          <button
            type="button"
            onClick={() => setFilterCategory('ideal')}
            className={`px-2 py-0.5 sm:px-2.5 sm:py-1 rounded-md font-semibold transition cursor-pointer border ${
              filterCategory === 'ideal'
                ? 'bg-emerald-600 border-emerald-500 text-white'
                : 'bg-slate-950 border-slate-800 text-emerald-400 hover:text-emerald-300'
            }`}
          >
            Ideal ({idealCount})
          </button>

          <button
            type="button"
            onClick={() => setFilterCategory('usable')}
            className={`px-2 py-0.5 sm:px-2.5 sm:py-1 rounded-md font-semibold transition cursor-pointer border ${
              filterCategory === 'usable'
                ? 'bg-amber-600 border-amber-500 text-white'
                : 'bg-slate-950 border-slate-800 text-amber-400 hover:text-amber-300'
            }`}
          >
            Usable ({usableCount})
          </button>

          {(quickView !== 'all' || filterCategory !== 'all') && (
            <button
              type="button"
              onClick={() => {
                setQuickView('all');
                setFilterCategory('all');
              }}
              className="text-[10px] sm:text-[11px] text-slate-400 hover:text-slate-200 underline px-1 cursor-pointer ml-auto xs:ml-0"
            >
              Reset
            </button>
          )}
        </div>
      </div>

      {/* Empty State */}
      {processedResults.length === 0 && (
        <div className="bg-slate-900 border border-slate-800 rounded-xl p-8 text-center text-slate-400 space-y-3">
          <AlertTriangle className="w-8 h-8 text-amber-400 mx-auto" />
          <p className="text-base font-bold text-slate-200">No wire combinations matched this filter criteria.</p>
          <p className="text-xs max-w-md mx-auto text-slate-400">
            Try switching to &quot;All Combinations&quot;, expanding your tolerance window, or toggling the Stock Filter OFF to compute with all standard wire sizes.
          </p>
          <div className="flex items-center justify-center gap-2 pt-2">
            <button
              type="button"
              onClick={() => {
                setQuickView('all');
                setFilterCategory('all');
              }}
              className="inline-flex items-center gap-1.5 px-4 py-2 rounded-lg bg-amber-500 text-slate-950 font-bold text-xs hover:bg-amber-400 transition cursor-pointer"
            >
              Reset View Filters
            </button>
            {onBackToEdit && (
              <button
                type="button"
                onClick={onBackToEdit}
                className="inline-flex items-center gap-1.5 px-4 py-2 rounded-lg bg-slate-800 text-slate-200 font-bold text-xs hover:bg-slate-700 transition cursor-pointer"
              >
                <ArrowLeft className="w-3.5 h-3.5" />
                Adjust Specifications
              </button>
            )}
            <button
              type="button"
              onClick={onOpenInventory}
              className="inline-flex items-center gap-1.5 px-4 py-2 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 font-semibold text-xs border border-slate-700 transition cursor-pointer"
            >
              <SlidersHorizontal className="w-3.5 h-3.5 text-amber-400" />
              Open Stock Inventory
            </button>
          </div>
        </div>
      )}

      {/* Results List Cards */}
      <div className="space-y-3">
        {processedResults.map((res, rank) => {
          const isCopied = copiedId === res.id;
          const isDiffPositive = res.areaDiffMm2 >= 0;
          const diffSign = isDiffPositive ? '+' : '';

          let badgeColorClass = 'text-rose-400 bg-rose-950/60 border-rose-800/80';
          let badgeIcon = <XCircle className="w-3 h-3" />;
          let badgeText = 'Area Deviation';
          let cardBorder = 'border-slate-800 hover:border-slate-700';

          if (res.category === 'ideal') {
            badgeColorClass = 'text-emerald-400 bg-emerald-950/50 border-emerald-800/80';
            badgeIcon = <CheckCircle2 className="w-3 h-3" />;
            badgeText = 'Ideal Match';
            cardBorder = res.isIdenticalGauge
              ? 'border-amber-500/60 bg-gradient-to-br from-slate-900 via-slate-900 to-amber-950/20 shadow-xs'
              : 'border-slate-800 hover:border-emerald-800/80';
          } else if (res.category === 'usable') {
            badgeColorClass = 'text-amber-400 bg-amber-950/50 border-amber-800/80';
            badgeIcon = <AlertTriangle className="w-3 h-3" />;
            badgeText = 'Usable';
            cardBorder = 'border-slate-800 hover:border-amber-800/80';
          }

          return (
            <React.Fragment key={res.id}>
              <div
                className={`bg-slate-900 border rounded-xl p-3 sm:p-3.5 transition text-slate-100 shadow-xs ${cardBorder}`}
              >
              {/* Recommendation Callout for Top / Single-Gauge Picks */}
              {res.recommendationBadge && (
                <div className="mb-2 px-2.5 py-1 rounded-md bg-amber-500/15 border border-amber-500/30 text-xs flex items-center justify-between gap-1 text-amber-200">
                  <div className="flex items-center gap-1.5 font-bold text-[11px]">
                    <Star className="w-3 h-3 fill-amber-400 text-amber-400 shrink-0" />
                    <span>{res.recommendationBadge}</span>
                  </div>
                  {res.recommendationReason && (
                    <span className="text-[10px] text-amber-300/80 font-normal">
                      {res.recommendationReason}
                    </span>
                  )}
                </div>
              )}

              {/* Card Top: Rank, Badge & Total Copper Area */}
              <div className="flex items-center justify-between gap-2 border-b border-slate-800/70 pb-2">
                <div className="flex items-center gap-1.5 flex-wrap">
                  <span className="text-[11px] font-mono font-bold text-slate-400 bg-slate-950 px-1.5 py-0.5 rounded border border-slate-800">
                    Option #{rank + 1}
                  </span>
                  <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded text-[11px] font-semibold border ${badgeColorClass}`}>
                    {badgeIcon}
                    <span>{badgeText}</span>
                  </span>
                  {res.isIdenticalGauge && (
                    <span className="inline-flex items-center gap-1 px-1.5 py-0.5 rounded bg-amber-500/20 border border-amber-500/30 text-amber-300 text-[10px] font-bold font-mono">
                      <Zap className="w-2.5 h-2.5 fill-amber-400" />
                      Single Gauge
                    </span>
                  )}
                </div>

                <div className="text-right whitespace-nowrap">
                  <span className="text-[11px] text-slate-400 mr-1 hidden xs:inline">Total Copper Area:</span>
                  <span
                    className={`font-mono text-sm sm:text-base font-black ${
                      res.category === 'ideal'
                        ? 'text-emerald-400'
                        : res.category === 'usable'
                        ? 'text-amber-400'
                        : 'text-rose-400'
                    }`}
                  >
                    {res.areaRatioPct.toFixed(1)}%
                  </span>
                  <span className="text-[11px] font-mono text-slate-400 ml-1">
                    ({diffSign}{res.areaDiffPct.toFixed(1)}%)
                  </span>
                </div>
              </div>

              {/* Card Middle: Required Parallel Wires & Compact Engineering Specs */}
              <div className="pt-2 flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                {/* Wires to Wind */}
                <div className="flex items-center gap-1.5 flex-wrap">
                  {res.groups.map((g, idx) => (
                    <React.Fragment key={idx}>
                      {idx > 0 && <span className="text-slate-600 font-bold text-xs">+</span>}
                      <span
                        className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-md border text-xs sm:text-sm font-mono font-bold ${
                          res.isIdenticalGauge
                            ? 'bg-amber-950/40 border-amber-500/50 text-white'
                            : 'bg-slate-950 border-slate-800 text-white'
                        }`}
                      >
                        <span className="text-amber-400 font-black">{g.count}×</span>
                        <span>{g.swg} SWG</span>
                      </span>
                    </React.Fragment>
                  ))}
                  <span className="text-[11px] font-medium text-slate-400 bg-slate-800/80 px-2 py-0.5 rounded ml-0.5">
                    {res.wireCount} in hand
                  </span>
                </div>

                {/* Compact Area Numbers */}
                <div className="flex items-center gap-2 text-xs font-mono text-slate-300 shrink-0">
                  <span className="text-slate-400">Area:</span>
                  <span className="font-bold text-white">{res.comboAreaMm2.toFixed(4)} mm²</span>
                  <span className={`text-[11px] font-semibold ${isDiffPositive ? 'text-emerald-400' : 'text-amber-400'}`}>
                    ({diffSign}{res.areaDiffMm2.toFixed(4)} mm²)
                  </span>
                </div>
              </div>

              {/* Compact Engineering Footer: Slot fill, resistance, score & copy */}
              <div className="mt-2 pt-2 border-t border-slate-800/60 flex items-center justify-between gap-2 text-[11px] text-slate-400 flex-wrap">
                <div className="flex items-center gap-2 sm:gap-2.5 flex-wrap">
                  <span>
                    Slot Fill: <strong className={res.insulationSpaceFactorPct > 20 ? 'text-amber-400' : 'text-slate-200'}>+{res.insulationSpaceFactorPct}%</strong>
                  </span>
                  <span className="text-slate-600">•</span>
                  <span>
                    Resistance: <strong className="text-slate-200 font-mono">{res.equivalentResistanceRatio.toFixed(3)}×</strong>
                  </span>
                  {res.practicalScore && (
                    <>
                      <span className="text-slate-600">•</span>
                      <span>
                        Score: <strong className="text-amber-300 font-mono">{res.practicalScore.toFixed(0)}/100</strong>
                      </span>
                    </>
                  )}
                </div>

                {/* Copy specs button */}
                <button
                  type="button"
                  onClick={() => handleCopy(res)}
                  className="inline-flex items-center gap-1 px-2.5 py-1 rounded bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white text-xs font-medium border border-slate-700 transition cursor-pointer ml-auto active:scale-95"
                >
                  {isCopied ? (
                    <>
                      <Check className="w-3 h-3 text-emerald-400" /> Copied
                    </>
                  ) : (
                    <>
                      <Copy className="w-3 h-3" /> Copy
                    </>
                  )}
                </button>
              </div>
            </div>
          </React.Fragment>
          );
        })}
      </div>

      {/* Bottom Navigation */}
      {onBackToEdit && (
        <div className="flex items-center justify-between pt-4 border-t border-slate-800">
          <button
            type="button"
            onClick={onBackToEdit}
            className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-bold border border-slate-700 transition cursor-pointer"
          >
            <ArrowLeft className="w-4 h-4 text-amber-400" />
            <span>← Back to Edit Specifications</span>
          </button>
          <span className="text-xs text-slate-500">
            {processedResults.length} of {results.length} combination{results.length === 1 ? '' : 's'} shown
          </span>
        </div>
      )}
    </div>
  );
};
