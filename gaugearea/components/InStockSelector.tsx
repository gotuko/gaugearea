'use client';

import React from 'react';
import { SWG_TABLE, ALL_SWG_NUMBERS, DEFAULT_COMMON_SWG_NUMBERS } from '@/lib/swgData';
import { Layers, Check, X, Plus, Minus, Power, CheckCircle2, ShieldAlert } from 'lucide-react';

interface InStockSelectorProps {
  inStockSwgs: number[];
  onChangeInStock: (swgs: number[]) => void;
  spoolCounts: Record<number, number>;
  onUpdateSpoolCount: (swg: number, delta: number) => void;
  useStockFilter: boolean;
  onToggleStockFilter: (val: boolean) => void;
  allowMultipleSameWire: boolean;
  onToggleAllowMultipleSameWire: (val: boolean) => void;
  onOpenModal: () => void;
}

export const InStockSelector: React.FC<InStockSelectorProps> = ({
  inStockSwgs,
  onChangeInStock,
  spoolCounts,
  onUpdateSpoolCount,
  useStockFilter,
  onToggleStockFilter,
  allowMultipleSameWire,
  onToggleAllowMultipleSameWire,
  onOpenModal,
}) => {
  const inStockSet = new Set(inStockSwgs);

  const toggleSwg = (swg: number) => {
    if (inStockSet.has(swg)) {
      if (inStockSwgs.length <= 1) return; // Keep at least 1 wire
      onChangeInStock(inStockSwgs.filter((s) => s !== swg));
      // also set spool count to 0
      onUpdateSpoolCount(swg, -(spoolCounts[swg] ?? 0));
    } else {
      onChangeInStock([...inStockSwgs, swg].sort((a, b) => a - b));
      // restore to at least 2 spools if 0
      if ((spoolCounts[swg] ?? 0) === 0) {
        onUpdateSpoolCount(swg, 3);
      }
    }
  };

  const handleMinus = (e: React.MouseEvent, swg: number) => {
    e.stopPropagation();
    const current = spoolCounts[swg] ?? (inStockSet.has(swg) ? 4 : 0);
    if (current <= 1) {
      // Deactivate
      onUpdateSpoolCount(swg, -current);
      if (inStockSwgs.length > 1) {
        onChangeInStock(inStockSwgs.filter((s) => s !== swg));
      }
    } else {
      onUpdateSpoolCount(swg, -1);
    }
  };

  const handlePlus = (e: React.MouseEvent, swg: number) => {
    e.stopPropagation();
    const current = spoolCounts[swg] ?? 0;
    onUpdateSpoolCount(swg, 1);
    if (!inStockSet.has(swg)) {
      onChangeInStock([...inStockSwgs, swg].sort((a, b) => a - b));
    }
  };

  const selectAll = () => {
    onChangeInStock(ALL_SWG_NUMBERS);
    ALL_SWG_NUMBERS.forEach((s) => {
      if ((spoolCounts[s] ?? 0) === 0) {
        onUpdateSpoolCount(s, 4);
      }
    });
  };

  const selectCommon = () => {
    onChangeInStock(DEFAULT_COMMON_SWG_NUMBERS);
    DEFAULT_COMMON_SWG_NUMBERS.forEach((s) => {
      if ((spoolCounts[s] ?? 0) === 0) {
        onUpdateSpoolCount(s, 4);
      }
    });
  };

  const selectHeavy = () => {
    const list = ALL_SWG_NUMBERS.filter((s) => s <= 18);
    onChangeInStock(list);
  };

  const selectFine = () => {
    const list = ALL_SWG_NUMBERS.filter((s) => s >= 24);
    onChangeInStock(list);
  };

  const clearToSingle = () => {
    onChangeInStock([20]);
    onUpdateSpoolCount(20, 3);
  };

  return (
    <div className="bg-slate-900 border border-slate-800 rounded-xl p-3.5 sm:p-4 text-slate-100 space-y-3 shadow-sm">
      {/* Header & Primary Controls: Compact and organized */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2.5 border-b border-slate-800 pb-3">
        <div className="flex items-center gap-2 flex-wrap">
          <div className="p-1.5 bg-amber-500/20 text-amber-400 rounded-lg border border-amber-500/30 shrink-0">
            <Layers className="w-4 h-4" />
          </div>
          <div className="flex items-center gap-2">
            <h3 className="text-xs sm:text-sm font-bold text-white">
              Available In-Stock Wires &amp; Spool Inventory
            </h3>
            <span className={`text-[11px] font-mono font-bold px-2 py-0.5 rounded-full border ${
              useStockFilter
                ? 'bg-amber-500/20 text-amber-300 border-amber-500/30'
                : 'bg-slate-800 text-slate-400 border-slate-700'
            }`}>
              {inStockSwgs.length} / {ALL_SWG_NUMBERS.length} SWG
            </span>
          </div>
        </div>

        {/* Master Toggles: Stock Filter and Multi-Strand */}
        <div className="flex items-center gap-2 flex-wrap self-start sm:self-auto">
          {/* Stock Filter Toggle */}
          <button
            type="button"
            onClick={() => onToggleStockFilter(!useStockFilter)}
            className={`inline-flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg text-xs font-bold transition shadow-xs cursor-pointer border ${
              useStockFilter
                ? 'bg-emerald-500/20 text-emerald-300 border-emerald-500/40 hover:bg-emerald-500/30'
                : 'bg-slate-800 text-slate-300 border-slate-700 hover:bg-slate-700'
            }`}
            title="Toggle between strictly enforcing in-stock wires or calculating with all standard wire sizes"
          >
            <Power className={`w-3.5 h-3.5 ${useStockFilter ? 'text-emerald-400' : 'text-slate-400'}`} />
            <span>{useStockFilter ? 'Stock Filter: ON' : 'Stock Filter: OFF'}</span>
          </button>

          {/* Multi-Strand Toggle */}
          <button
            type="button"
            onClick={() => onToggleAllowMultipleSameWire(!allowMultipleSameWire)}
            className={`inline-flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg text-xs font-bold transition shadow-xs cursor-pointer border ${
              allowMultipleSameWire
                ? 'bg-amber-500/20 text-amber-300 border-amber-500/40 hover:bg-amber-500/30'
                : 'bg-slate-800 text-slate-400 border-slate-700 hover:bg-slate-700'
            }`}
            title="Allow multiple strands of identical wire (e.g. 2× 25 SWG)"
          >
            <CheckCircle2 className={`w-3.5 h-3.5 ${allowMultipleSameWire ? 'text-amber-400' : 'text-slate-500'}`} />
            <span>{allowMultipleSameWire ? 'Multi-Strand: ON' : 'Multi-Strand: OFF'}</span>
          </button>
        </div>
      </div>

      {/* Notice Banner when Stock Filter is turned OFF */}
      {!useStockFilter && (
        <div className="bg-blue-950/40 border border-blue-500/30 rounded-lg px-3 py-2 text-xs text-blue-200 flex items-center justify-between gap-2">
          <div className="flex items-center gap-2">
            <ShieldAlert className="w-4 h-4 text-blue-400 shrink-0" />
            <span>
              <strong>Stock Filter is OFF:</strong> Calculations will search <strong>all standard SWG wire gauges (10 to 36)</strong> without checking workshop inventory.
            </span>
          </div>
          <button
            type="button"
            onClick={() => onToggleStockFilter(true)}
            className="px-2 py-0.5 bg-blue-500/20 hover:bg-blue-500/30 text-blue-300 rounded font-semibold text-[11px] border border-blue-500/40 shrink-0 transition cursor-pointer"
          >
            Re-enable
          </button>
        </div>
      )}

      {/* Quick Group Presets Toolbar: Compact, without unnecessary bulky elements */}
      <div className="flex items-center gap-1.5 flex-wrap text-xs">
        <span className="text-slate-400 text-xs mr-1 font-medium">Presets:</span>
        <button
          type="button"
          onClick={selectAll}
          className="px-2 py-1 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded font-medium transition cursor-pointer text-xs"
        >
          All (10–36)
        </button>
        <button
          type="button"
          onClick={selectCommon}
          className="px-2 py-1 bg-slate-800 hover:bg-slate-700 text-amber-300 rounded font-medium transition cursor-pointer text-xs"
        >
          Motors (16–30)
        </button>
        <button
          type="button"
          onClick={selectHeavy}
          className="px-2 py-1 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded font-medium transition cursor-pointer text-xs"
        >
          Heavy (10–18)
        </button>
        <button
          type="button"
          onClick={selectFine}
          className="px-2 py-1 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded font-medium transition cursor-pointer text-xs"
        >
          Fine (24–36)
        </button>
        <button
          type="button"
          onClick={clearToSingle}
          className="px-2 py-1 bg-slate-800/60 hover:bg-slate-800 text-rose-300 rounded font-medium transition cursor-pointer text-xs"
          title="Reset to 1 gauge"
        >
          Reset
        </button>
      </div>

      {/* SWG Grid with Reel/Spool Counters (+1 / -1): Compact, clean layout */}
      <div className="grid grid-cols-3 xs:grid-cols-4 sm:grid-cols-6 md:grid-cols-7 lg:grid-cols-9 gap-1.5 pt-0.5">
        {SWG_TABLE.map((item) => {
          const reels = spoolCounts[item.swg] ?? (inStockSet.has(item.swg) ? 4 : 0);
          const isActive = inStockSet.has(item.swg) && reels > 0;

          return (
            <div
              key={item.swg}
              className={`p-2 rounded-xl border transition-all flex flex-col justify-between select-none ${
                isActive
                  ? 'bg-slate-900/90 border-amber-500/50 shadow-sm shadow-amber-500/5'
                  : 'bg-slate-950/60 border-slate-800/80 opacity-55 hover:opacity-90'
              }`}
            >
              {/* Card Top: Gauge and Click to Toggle */}
              <button
                type="button"
                onClick={() => toggleSwg(item.swg)}
                className="w-full text-left cursor-pointer group"
                title={`Click to toggle SWG ${item.swg} (ø${item.diameterMm.toFixed(3)} mm)`}
              >
                <div className="flex items-center justify-between">
                  <span className={`font-mono font-black text-sm ${isActive ? 'text-amber-300' : 'text-slate-400'}`}>
                    {item.swg} <span className="text-[10px] font-normal text-slate-400 font-sans">SWG</span>
                  </span>
                  {isActive ? (
                    <Check className="w-3 h-3 text-amber-400" />
                  ) : (
                    <X className="w-3 h-3 text-slate-600" />
                  )}
                </div>
                <div className="text-[10px] font-mono text-slate-400">
                  ø{item.diameterMm.toFixed(2)}mm
                </div>
              </button>

              {/* Card Bottom: Spool Reels +1 / -1 controls */}
              <div className="mt-2 pt-1.5 border-t border-slate-800/80 flex items-center justify-between gap-1">
                <button
                  type="button"
                  onClick={(e) => handleMinus(e, item.swg)}
                  disabled={reels === 0}
                  className="w-5 h-5 rounded flex items-center justify-center bg-slate-800 hover:bg-slate-700 active:bg-slate-600 text-slate-300 disabled:opacity-30 disabled:cursor-not-allowed cursor-pointer transition"
                  title="Remove 1 spool (-1)"
                >
                  <Minus className="w-3 h-3" />
                </button>

                <div className="text-center font-mono">
                  <span className={`text-xs font-bold ${isActive ? 'text-white' : 'text-slate-500'}`}>
                    {reels}
                  </span>
                  <span className="text-[9px] text-slate-500 block -mt-0.5 leading-none">
                    reel{reels === 1 ? '' : 's'}
                  </span>
                </div>

                <button
                  type="button"
                  onClick={(e) => handlePlus(e, item.swg)}
                  className="w-5 h-5 rounded flex items-center justify-center bg-amber-500/20 hover:bg-amber-500/30 active:bg-amber-500/40 text-amber-300 border border-amber-500/40 cursor-pointer transition"
                  title="Add 1 spool (+1)"
                >
                  <Plus className="w-3 h-3" />
                </button>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
