'use client';

import React from 'react';
import { SWG_TABLE, ALL_SWG_NUMBERS, DEFAULT_COMMON_SWG_NUMBERS } from '@/lib/swgData';
import { Check, X, RotateCcw, Boxes, AlertTriangle } from 'lucide-react';

interface InventoryModalProps {
  isOpen: boolean;
  onClose: () => void;
  inStockSwgs: number[];
  onChangeInStock: (swgs: number[]) => void;
}

export const InventoryModal: React.FC<InventoryModalProps> = ({
  isOpen,
  onClose,
  inStockSwgs,
  onChangeInStock,
}) => {
  if (!isOpen) return null;

  const inStockSet = new Set(inStockSwgs);

  const toggleSwg = (swg: number) => {
    if (inStockSet.has(swg)) {
      onChangeInStock(inStockSwgs.filter((s) => s !== swg));
    } else {
      onChangeInStock([...inStockSwgs, swg].sort((a, b) => a - b));
    }
  };

  const selectAll = () => {
    onChangeInStock([...ALL_SWG_NUMBERS]);
  };

  const deselectAll = () => {
    onChangeInStock([]);
  };

  const selectCommon = () => {
    onChangeInStock([...DEFAULT_COMMON_SWG_NUMBERS]);
  };

  const selectRange = (min: number, max: number) => {
    const selected = ALL_SWG_NUMBERS.filter((s) => s >= min && s <= max);
    onChangeInStock(selected);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-xs">
      <div
        id="inventory-modal-container"
        className="bg-slate-900 border border-slate-700 w-full max-w-2xl rounded-2xl shadow-2xl flex flex-col max-h-[90vh] overflow-hidden text-slate-100 animate-in fade-in zoom-in-95 duration-200"
      >
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-800 bg-slate-950/60">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-amber-500/20 text-amber-400 flex items-center justify-center border border-amber-500/30">
              <Boxes className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-lg font-bold text-slate-100 flex items-center gap-2">
                Workshop Wire Stock
                <span className="text-xs px-2.5 py-0.5 rounded-full bg-slate-800 border border-slate-700 text-amber-400 font-mono">
                  {inStockSwgs.length} / {ALL_SWG_NUMBERS.length} In Stock
                </span>
              </h2>
              <p className="text-xs text-slate-400">
                Calculations will strictly use only checked wire gauges. Saved locally.
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition"
            aria-label="Close"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Warning if 0 selected */}
        {inStockSwgs.length === 0 && (
          <div className="bg-rose-950/70 border-b border-rose-800 px-6 py-2.5 flex items-center gap-2 text-xs text-rose-200">
            <AlertTriangle className="w-4 h-4 text-rose-400 shrink-0" />
            <span>
              Warning: No wires selected! The calculator cannot find any combinations until you check at least one gauge.
            </span>
          </div>
        )}

        {/* Quick action buttons */}
        <div className="px-6 py-3 bg-slate-950/40 border-b border-slate-800 flex flex-wrap gap-2 items-center justify-between text-xs">
          <div className="flex flex-wrap gap-1.5">
            <button
              onClick={selectAll}
              className="px-2.5 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 font-medium transition"
            >
              Select All (10-36)
            </button>
            <button
              onClick={deselectAll}
              className="px-2.5 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 border border-slate-700 font-medium transition"
            >
              Deselect All
            </button>
            <button
              onClick={selectCommon}
              className="px-2.5 py-1.5 rounded-lg bg-amber-500/20 hover:bg-amber-500/30 text-amber-300 border border-amber-500/40 font-medium transition flex items-center gap-1"
            >
              <RotateCcw className="w-3 h-3" /> Common Shop Sizes (16-30)
            </button>
          </div>
          <div className="hidden sm:flex gap-1.5">
            <button
              onClick={() => selectRange(10, 20)}
              className="px-2 py-1 rounded bg-slate-800/80 hover:bg-slate-700 text-slate-400 hover:text-slate-200 text-[11px]"
            >
              Heavy (10-20)
            </button>
            <button
              onClick={() => selectRange(21, 36)}
              className="px-2 py-1 rounded bg-slate-800/80 hover:bg-slate-700 text-slate-400 hover:text-slate-200 text-[11px]"
            >
              Fine (21-36)
            </button>
          </div>
        </div>

        {/* Grid of SWG sizes */}
        <div className="p-6 overflow-y-auto flex-1">
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-2.5">
            {SWG_TABLE.map((item) => {
              const isChecked = inStockSet.has(item.swg);
              return (
                <button
                  key={item.swg}
                  type="button"
                  onClick={() => toggleSwg(item.swg)}
                  className={`flex items-center justify-between p-3 rounded-xl border text-left transition relative cursor-pointer select-none ${
                    isChecked
                      ? 'bg-emerald-950/40 border-emerald-600/70 text-emerald-100 shadow-xs'
                      : 'bg-slate-800/40 border-slate-700/60 text-slate-400 hover:bg-slate-800/80 hover:border-slate-600'
                  }`}
                >
                  <div className="flex flex-col">
                    <div className="flex items-baseline gap-1.5">
                      <span className="font-bold text-sm text-slate-100">
                        {item.swg} SWG
                      </span>
                    </div>
                    <span className="text-[11px] font-mono text-slate-400">
                      ø {item.diameterMm.toFixed(3)} mm
                    </span>
                    <span className="text-[10px] font-mono text-slate-500">
                      {item.areaMm2.toFixed(3)} mm²
                    </span>
                  </div>

                  <div
                    className={`w-6 h-6 rounded-lg flex items-center justify-center border transition ${
                      isChecked
                        ? 'bg-emerald-500 border-emerald-400 text-slate-950 font-black'
                        : 'border-slate-600 bg-slate-900/60'
                    }`}
                  >
                    {isChecked && <Check className="w-3.5 h-3.5 stroke-[3]" />}
                  </div>
                </button>
              );
            })}
          </div>
        </div>

        {/* Footer */}
        <div className="px-6 py-4 border-t border-slate-800 bg-slate-950/80 flex items-center justify-between">
          <div className="text-xs text-slate-400">
            Changes auto-saved to browser storage
          </div>
          <button
            onClick={onClose}
            className="px-5 py-2 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-sm transition shadow-md cursor-pointer"
          >
            Done ({inStockSwgs.length} Selected)
          </button>
        </div>
      </div>
    </div>
  );
};
