'use client';

import React from 'react';
import {
  SWG_TABLE,
  SWG_BY_NUMBER,
  AWG_TABLE,
  AWG_BY_NUMBER,
  calcAreaFromDiameter,
  calcDiameterFromArea,
  findClosestSwg,
  OriginalWireItem,
  WindingStrategy,
} from '@/lib/swgData';
import { Plus, Trash2, Zap, ShieldCheck } from 'lucide-react';

interface OriginalWireInputProps {
  wires: OriginalWireItem[];
  onChangeWires: (wires: OriginalWireItem[]) => void;
  wireCountChoice: number | 'auto';
  onChangeWireCountChoice: (choice: number | 'auto') => void;
  windingStrategy: WindingStrategy;
  onChangeWindingStrategy: (strategy: WindingStrategy) => void;
  toleranceMode: 'symmetric' | 'custom';
  onChangeToleranceMode: (mode: 'symmetric' | 'custom') => void;
  tolerancePct: number;
  onChangeTolerancePct: (pct: number) => void;
  minTolerancePct: number;
  maxTolerancePct: number;
  onChangeCustomRange: (min: number, max: number) => void;
  onOpenInventory: () => void;
  inStockCount: number;
}

export const OriginalWireInput: React.FC<OriginalWireInputProps> = ({
  wires,
  onChangeWires,
  wireCountChoice,
  onChangeWireCountChoice,
  windingStrategy,
  onChangeWindingStrategy,
  toleranceMode,
  onChangeToleranceMode,
  tolerancePct,
  onChangeTolerancePct,
  minTolerancePct,
  maxTolerancePct,
  onChangeCustomRange,
}) => {
  // Local string state for strand custom input so typing is smooth (supports 0 to 99)
  const [prevWireCountChoice, setPrevWireCountChoice] = React.useState(wireCountChoice);
  const [strandInput, setStrandInput] = React.useState<string>(
    typeof wireCountChoice === 'number' ? String(wireCountChoice) : ''
  );
  if (wireCountChoice !== prevWireCountChoice) {
    setPrevWireCountChoice(wireCountChoice);
    setStrandInput(typeof wireCountChoice === 'number' ? String(wireCountChoice) : '');
  }

  // Local string state for tolerance custom input so typing is smooth (supports 0.00 to 99.99)
  const [prevTolerancePct, setPrevTolerancePct] = React.useState(tolerancePct);
  const [tolInput, setTolInput] = React.useState<string>(String(tolerancePct));
  if (tolerancePct !== prevTolerancePct) {
    setPrevTolerancePct(tolerancePct);
    setTolInput(String(tolerancePct));
  }

  // Local string states for min and max tolerance in custom mode
  const [prevMinTol, setPrevMinTol] = React.useState(minTolerancePct);
  const [minInput, setMinInput] = React.useState<string>(String(minTolerancePct));
  if (minTolerancePct !== prevMinTol) {
    setPrevMinTol(minTolerancePct);
    setMinInput(String(minTolerancePct));
  }

  const [prevMaxTol, setPrevMaxTol] = React.useState(maxTolerancePct);
  const [maxInput, setMaxInput] = React.useState<string>(String(maxTolerancePct));
  if (maxTolerancePct !== prevMaxTol) {
    setPrevMaxTol(maxTolerancePct);
    setMaxInput(String(maxTolerancePct));
  }

  const handleStrandInputChange = (val: string) => {
    setStrandInput(val);
    if (val.trim() === '') {
      onChangeWireCountChoice('auto');
      return;
    }
    const num = parseInt(val, 10);
    if (!isNaN(num) && num >= 0 && num <= 99) {
      onChangeWireCountChoice(num);
    }
  };

  const handleStrandInputBlur = () => {
    if (strandInput.trim() === '') {
      setStrandInput('');
      onChangeWireCountChoice('auto');
    } else {
      const num = parseInt(strandInput, 10);
      if (isNaN(num) || num < 0) {
        setStrandInput('0');
        onChangeWireCountChoice(0);
      } else if (num > 99) {
        setStrandInput('99');
        onChangeWireCountChoice(99);
      } else {
        setStrandInput(String(num));
        onChangeWireCountChoice(num);
      }
    }
  };

  const handleTolInputChange = (val: string) => {
    setTolInput(val);
    if (val.trim() === '' || val === '.' || val.endsWith('.')) {
      return;
    }
    const num = parseFloat(val);
    if (!isNaN(num) && num >= 0 && num <= 99.99) {
      onChangeTolerancePct(num);
    }
  };

  const handleTolInputBlur = () => {
    const num = parseFloat(tolInput);
    if (isNaN(num) || num < 0) {
      setTolInput('0');
      onChangeTolerancePct(0);
    } else if (num > 99.99) {
      setTolInput('99.99');
      onChangeTolerancePct(99.99);
    } else {
      setTolInput(String(num));
      onChangeTolerancePct(num);
    }
  };

  const handleMinInputChange = (val: string) => {
    setMinInput(val);
    if (val.trim() === '' || val === '.' || val.endsWith('.')) return;
    const num = parseFloat(val);
    if (!isNaN(num) && num >= 0 && num <= 200) {
      onChangeCustomRange(num, maxTolerancePct);
    }
  };

  const handleMaxInputChange = (val: string) => {
    setMaxInput(val);
    if (val.trim() === '' || val === '.' || val.endsWith('.')) return;
    const num = parseFloat(val);
    if (!isNaN(num) && num >= 0 && num <= 200) {
      onChangeCustomRange(minTolerancePct, num);
    }
  };

  const addWire = () => {
    const newId = `w-${Date.now()}-${Math.random().toString(36).substring(2, 5)}`;
    onChangeWires([
      ...wires,
      {
        id: newId,
        mode: 'swg',
        swg: 20,
        awg: 18,
        customDiameterMm: 0.914,
        count: 1,
      },
    ]);
  };

  const removeWire = (id: string) => {
    if (wires.length <= 1) return;
    onChangeWires(wires.filter((w) => w.id !== id));
  };

  const updateWire = (id: string, updates: Partial<OriginalWireItem>) => {
    onChangeWires(
      wires.map((w) => {
        if (w.id !== id) return w;
        const updated = { ...w, ...updates };

        if (updates.swg !== undefined) {
          const entry = SWG_BY_NUMBER.get(updates.swg);
          if (entry) {
            updated.customDiameterMm = entry.diameterMm;
          }
        } else if (updates.awg !== undefined) {
          const entry = AWG_BY_NUMBER.get(updates.awg);
          if (entry) {
            updated.customDiameterMm = entry.diameterMm;
          }
        }
        return updated;
      })
    );
  };

  // Calculate total target area
  const totalTargetArea = wires.reduce((sum, w) => {
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

  const eqDiameter = calcDiameterFromArea(totalTargetArea);
  const closestSingle = totalTargetArea > 0 ? findClosestSwg(totalTargetArea) : null;

  return (
    <div className="bg-slate-900 border border-slate-800 rounded-xl p-3 sm:p-4 text-slate-100 space-y-2.5 shadow-sm">
      {/* Header */}
      <div className="border-b border-slate-800 pb-2 flex items-center justify-between">
        <h2 className="text-sm sm:text-base font-bold text-white">Original Wire Specifications</h2>
        <span className="text-[11px] text-slate-400 font-mono">
          <strong className="text-amber-400">SWG</strong> / <strong className="text-amber-400">AWG</strong> / <strong className="text-amber-400">mm</strong>
        </span>
      </div>

      {/* Dynamic Wire Rows */}
      <div className="space-y-2">
        {wires.map((wire, idx) => {
          let singleArea = 0;
          let singleDiameter = 0;

          if (wire.mode === 'swg') {
            const entry = SWG_BY_NUMBER.get(wire.swg);
            singleArea = entry?.areaMm2 || 0;
            singleDiameter = entry?.diameterMm || 0;
          } else if (wire.mode === 'awg') {
            const entry = AWG_BY_NUMBER.get(wire.awg ?? 18);
            singleArea = entry?.areaMm2 || 0;
            singleDiameter = entry?.diameterMm || 0;
          } else {
            singleArea = calcAreaFromDiameter(wire.customDiameterMm);
            singleDiameter = wire.customDiameterMm;
          }

          const lineTotalArea = singleArea * wire.count;

          return (
            <div
              key={wire.id}
              className="bg-slate-950 border border-slate-800/80 rounded-lg p-2 sm:p-2.5 flex flex-wrap items-center justify-between gap-2"
            >
              {/* Row Left: Index, Quantity, Mode Toggle (SWG, AWG, mm) */}
              <div className="flex items-center gap-1.5 flex-wrap">
                <span className="text-[11px] font-mono font-bold text-slate-500 w-4">
                  #{idx + 1}
                </span>

                {/* Quantity */}
                <div className="flex items-center gap-1 bg-slate-900 border border-slate-700/80 rounded-md px-1.5 py-0.5">
                  <span className="text-[11px] text-slate-400 font-medium">Qty:</span>
                  <select
                    value={wire.count}
                    onChange={(e) => updateWire(wire.id, { count: parseInt(e.target.value, 10) || 1 })}
                    className="bg-transparent text-amber-400 font-bold text-xs outline-hidden cursor-pointer"
                  >
                    {[1, 2, 3, 4, 5, 6, 8, 10].map((c) => (
                      <option key={c} value={c} className="bg-slate-900 text-slate-100">{c}×</option>
                    ))}
                  </select>
                </div>

                {/* Mode Toggle */}
                <div className="flex rounded-md bg-slate-900 p-0.5 border border-slate-700/80 text-xs">
                  <button
                    type="button"
                    onClick={() => updateWire(wire.id, { mode: 'swg' })}
                    className={`px-1.5 py-0.5 text-[11px] font-semibold rounded transition cursor-pointer ${
                      wire.mode === 'swg'
                        ? 'bg-amber-500 text-slate-950 font-bold'
                        : 'text-slate-400 hover:text-slate-200'
                    }`}
                  >
                    SWG
                  </button>
                  <button
                    type="button"
                    onClick={() => updateWire(wire.id, { mode: 'awg', awg: wire.awg ?? 18 })}
                    className={`px-1.5 py-0.5 text-[11px] font-semibold rounded transition cursor-pointer ${
                      wire.mode === 'awg'
                        ? 'bg-amber-500 text-slate-950 font-bold'
                        : 'text-slate-400 hover:text-slate-200'
                    }`}
                  >
                    AWG
                  </button>
                  <button
                    type="button"
                    onClick={() => updateWire(wire.id, { mode: 'custom' })}
                    className={`px-1.5 py-0.5 text-[11px] font-semibold rounded transition cursor-pointer ${
                      wire.mode === 'custom'
                        ? 'bg-amber-500 text-slate-950 font-bold'
                        : 'text-slate-400 hover:text-slate-200'
                    }`}
                  >
                    mm
                  </button>
                </div>
              </div>

              {/* Row Center: Selector / Input */}
              <div className="flex items-center gap-1.5">
                {wire.mode === 'swg' ? (
                  <select
                    value={wire.swg}
                    onChange={(e) => updateWire(wire.id, { swg: parseInt(e.target.value, 10) })}
                    className="bg-slate-900 border border-slate-700 text-slate-100 font-mono text-xs rounded-md px-2 py-1 focus:border-amber-400 focus:outline-hidden cursor-pointer"
                  >
                    {SWG_TABLE.map((item) => (
                      <option key={item.swg} value={item.swg} className="bg-slate-900 text-slate-100">
                        {item.swg} SWG (ø{item.diameterMm.toFixed(3)} mm — {item.areaMm2.toFixed(3)} mm²)
                      </option>
                    ))}
                  </select>
                ) : wire.mode === 'awg' ? (
                  <select
                    value={wire.awg ?? 18}
                    onChange={(e) => updateWire(wire.id, { awg: parseInt(e.target.value, 10) })}
                    className="bg-slate-900 border border-slate-700 text-slate-100 font-mono text-xs rounded-md px-2 py-1 focus:border-amber-400 focus:outline-hidden cursor-pointer"
                  >
                    {AWG_TABLE.map((item) => (
                      <option key={item.awg} value={item.awg} className="bg-slate-900 text-slate-100">
                        {item.awg} AWG (ø{item.diameterMm.toFixed(3)} mm — {item.areaMm2.toFixed(3)} mm²)
                      </option>
                    ))}
                  </select>
                ) : (
                  <div className="relative">
                    <input
                      type="number"
                      step="0.005"
                      min="0.05"
                      max="6.0"
                      value={wire.customDiameterMm}
                      onChange={(e) =>
                        updateWire(wire.id, {
                          customDiameterMm: parseFloat(e.target.value) || 0,
                        })
                      }
                      className="w-24 bg-slate-900 border border-slate-700 text-slate-100 font-mono text-xs rounded-md pl-2 pr-6 py-1 focus:border-amber-400 focus:outline-hidden"
                    />
                    <span className="absolute right-1.5 top-1 text-[11px] text-slate-500 font-mono">mm</span>
                  </div>
                )}
              </div>

              {/* Row Right: Area & Delete */}
              <div className="flex items-center gap-2">
                <div className="text-right">
                  <span className="text-xs font-mono font-bold text-amber-400">
                    {lineTotalArea.toFixed(4)} mm²
                  </span>
                  <span className="text-[10px] text-slate-500 block font-mono">
                    ø{singleDiameter.toFixed(3)}mm
                  </span>
                </div>

                {wires.length > 1 && (
                  <button
                    type="button"
                    onClick={() => removeWire(wire.id)}
                    className="p-1 rounded text-slate-500 hover:text-rose-400 transition cursor-pointer"
                    title="Remove wire"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                )}
              </div>
            </div>
          );
        })}
      </div>

      {/* Add Wire Button */}
      <button
        type="button"
        onClick={addWire}
        className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold border border-slate-700 transition cursor-pointer"
      >
        <Plus className="w-3.5 h-3.5 text-amber-400" />
        Add Parallel Wire
      </button>

      {/* Target Copper Area Summary Box */}
      <div className="bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 flex flex-wrap items-center justify-between gap-2">
        <div className="flex items-center gap-2">
          <span className="text-xs text-slate-400 font-medium">Target Area:</span>
          <span className="text-base sm:text-lg font-black font-mono text-white">
            {totalTargetArea.toFixed(4)} <span className="text-xs text-amber-400 font-bold">mm²</span>
          </span>
        </div>

        <div className="flex items-center gap-2.5 text-xs text-slate-400 font-mono">
          <span>Single: <strong className="text-slate-200">ø{eqDiameter.toFixed(3)}mm</strong></span>
          {closestSingle && (
            <>
              <span className="text-slate-700">|</span>
              <span>Closest: <strong className="text-amber-400">{closestSingle.entry.swg} SWG</strong> ({closestSingle.diffPct >= 0 ? '+' : ''}{closestSingle.diffPct.toFixed(1)}%)</span>
            </>
          )}
        </div>
      </div>

      {/* Controls: Strand Count Constraint & Tolerance in Compact 2-Col Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-2 pt-0.5">
        {/* Wire Count Constraint */}
        <div className="bg-slate-950 border border-slate-800/90 rounded-lg p-2 sm:p-2.5 space-y-1.5">
          <div className="flex items-center justify-between">
            <label className="text-xs font-bold text-slate-300">
              Strand Count Filter <span className="text-slate-500 text-[10px] font-normal">(Optional)</span>:
            </label>
            <span className="text-[11px] text-amber-400 font-mono font-semibold">
              {wireCountChoice === 'auto'
                ? 'Auto (Any)'
                : `${wireCountChoice} Strand${wireCountChoice > 1 ? 's' : ''}`}
            </span>
          </div>

          <div className="flex flex-wrap items-center gap-1">
            <button
              type="button"
              onClick={() => onChangeWireCountChoice('auto')}
              className={`py-1 px-2 text-[11px] font-bold rounded transition cursor-pointer ${
                wireCountChoice === 'auto'
                  ? 'bg-amber-500 text-slate-950'
                  : 'bg-slate-900 text-slate-400 hover:text-slate-200'
              }`}
              title="Auto test all strands"
            >
              Auto (Any)
            </button>

            {[2, 3, 4, 5, 6].map((num) => {
              const isSelected = wireCountChoice === num;
              return (
                <button
                  key={num}
                  type="button"
                  onClick={() => onChangeWireCountChoice(num)}
                  className={`py-1 px-1.5 text-[11px] font-mono font-bold rounded transition cursor-pointer min-w-[28px] text-center ${
                    isSelected
                      ? 'bg-amber-500 text-slate-950'
                      : 'bg-slate-900 text-slate-400 hover:text-slate-200'
                  }`}
                  title={`${num} strands in parallel`}
                >
                  {num}W
                </button>
              );
            })}

            {/* Dedicated Custom Wire Count: accepts ANY number 0 to 99 */}
            <div className="flex items-center gap-1 ml-auto pl-1.5 border-l border-slate-800 py-0.5">
              <span className="text-[11px] text-slate-400 font-medium">Custom:</span>
              <input
                type="text"
                inputMode="numeric"
                pattern="[0-9]*"
                value={strandInput}
                onChange={(e) => handleStrandInputChange(e.target.value)}
                onBlur={handleStrandInputBlur}
                placeholder="0–99"
                className="w-12 bg-slate-900 border border-slate-700 text-amber-300 font-mono text-xs rounded px-1 py-0.5 text-center focus:border-amber-400 focus:outline-hidden"
                title="Input any number of parallel strands (0 to 99)"
              />
            </div>
          </div>
        </div>

        {/* Tolerance Selector */}
        <div className="bg-slate-950 border border-slate-800/90 rounded-lg p-2 sm:p-2.5 space-y-1.5">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-1.5">
              <label className="text-xs font-bold text-slate-300">
                Tolerance:
              </label>
              {/* Mode Toggle */}
              <div className="flex rounded bg-slate-900 p-0.5 border border-slate-700/80 text-[10px]">
                <button
                  type="button"
                  onClick={() => onChangeToleranceMode('symmetric')}
                  className={`px-1.5 py-0.2 rounded font-semibold transition cursor-pointer ${
                    toleranceMode === 'symmetric'
                      ? 'bg-amber-500 text-slate-950 font-bold'
                      : 'text-slate-400 hover:text-slate-200'
                  }`}
                >
                  ±%
                </button>
                <button
                  type="button"
                  onClick={() => onChangeToleranceMode('custom')}
                  className={`px-1.5 py-0.2 rounded font-semibold transition cursor-pointer ${
                    toleranceMode === 'custom'
                      ? 'bg-amber-500 text-slate-950 font-bold'
                      : 'text-slate-400 hover:text-slate-200'
                  }`}
                >
                  Min–Max
                </button>
              </div>
            </div>

            <span className="text-[11px] text-amber-400 font-mono font-semibold">
              {toleranceMode === 'symmetric'
                ? `±${tolerancePct}% (${minTolerancePct.toFixed(1)}%–${maxTolerancePct.toFixed(1)}%)`
                : `${minTolerancePct.toFixed(1)}%–${maxTolerancePct.toFixed(1)}%`}
            </span>
          </div>

          {toleranceMode === 'symmetric' ? (
            /* Symmetric Mode with presets + custom 0.00 to 99.99 */
            <div className="flex flex-wrap items-center gap-1">
              {[
                { label: '0%', val: 0 },
                { label: '±0.2%', val: 0.2 },
                { label: '±0.5%', val: 0.5 },
                { label: '±1%', val: 1 },
                { label: '±2%', val: 2 },
                { label: '±3%', val: 3 },
                { label: '±5%', val: 5 },
                { label: '±8%', val: 8 },
              ].map((item) => (
                <button
                  key={item.label}
                  type="button"
                  onClick={() => onChangeTolerancePct(item.val)}
                  className={`py-0.5 px-1.5 text-[11px] font-mono font-bold rounded transition cursor-pointer ${
                    Math.abs(tolerancePct - item.val) < 0.001
                      ? 'bg-slate-800 text-amber-300 border border-slate-700'
                      : 'bg-slate-900 text-slate-400 hover:text-slate-200'
                  }`}
                  title={`${item.label} tolerance`}
                >
                  {item.label}
                </button>
              ))}

              {/* Custom Tolerance: accepts ANY number 0.00 to 99.99 */}
              <div className="flex items-center gap-0.5 ml-auto pl-1.5 border-l border-slate-800 py-0.5">
                <span className="text-[11px] text-slate-400 font-medium">Custom:</span>
                <span className="text-slate-400 text-xs font-mono">±</span>
                <input
                  type="text"
                  inputMode="decimal"
                  value={tolInput}
                  onChange={(e) => handleTolInputChange(e.target.value)}
                  onBlur={handleTolInputBlur}
                  placeholder="0.00–99.99"
                  className="w-14 bg-slate-900 border border-slate-700 text-amber-300 font-mono text-xs rounded px-1 py-0.5 text-center focus:border-amber-400 focus:outline-hidden"
                  title="Type any tolerance percentage from 0.00 to 99.99%"
                />
                <span className="text-xs text-slate-400 font-mono">%</span>
              </div>
            </div>
          ) : (
            /* Asymmetric Mode (Min % to Max %) */
            <div className="flex flex-wrap items-center gap-1">
              {[
                { label: '100% Exact', min: 100, max: 100 },
                { label: '99.8–100.2%', min: 99.8, max: 100.2 },
                { label: '98–102%', min: 98, max: 102 },
                { label: '95–105%', min: 95, max: 105 },
              ].map((preset) => {
                const isActive =
                  Math.abs(minTolerancePct - preset.min) < 0.05 &&
                  Math.abs(maxTolerancePct - preset.max) < 0.05;
                return (
                  <button
                    key={preset.label}
                    type="button"
                    onClick={() => onChangeCustomRange(preset.min, preset.max)}
                    className={`py-0.5 px-1.5 text-[11px] font-mono font-semibold rounded transition cursor-pointer ${
                      isActive
                        ? 'bg-slate-800 text-amber-300 border border-slate-700'
                        : 'bg-slate-900 text-slate-400 hover:text-slate-200'
                    }`}
                  >
                    {preset.label}
                  </button>
                );
              })}

              <div className="flex items-center gap-1 ml-auto pl-1.5 border-l border-slate-800 py-0.5">
                <span className="text-[10px] text-slate-400">Min:</span>
                <input
                  type="text"
                  inputMode="decimal"
                  value={minInput}
                  onChange={(e) => handleMinInputChange(e.target.value)}
                  className="w-11 bg-slate-900 border border-slate-700 text-amber-300 font-mono text-xs rounded px-1 py-0.5 text-center focus:border-amber-400 focus:outline-hidden"
                />
                <span className="text-[10px] text-slate-400">Max:</span>
                <input
                  type="text"
                  inputMode="decimal"
                  value={maxInput}
                  onChange={(e) => handleMaxInputChange(e.target.value)}
                  className="w-11 bg-slate-900 border border-slate-700 text-amber-300 font-mono text-xs rounded px-1 py-0.5 text-center focus:border-amber-400 focus:outline-hidden"
                />
              </div>
            </div>
          )}

          {/* Compact Target Window Preview */}
          <div className="flex items-center justify-between text-[10px] text-slate-400 px-0.5 font-mono">
            <span>
              Window: <span className="text-slate-200 font-bold">{((totalTargetArea * minTolerancePct) / 100).toFixed(4)}</span> – <span className="text-slate-200 font-bold">{((totalTargetArea * maxTolerancePct) / 100).toFixed(4)}</span> mm²
            </span>
            <span className="text-amber-400/80">
              Δ {((totalTargetArea * Math.abs(maxTolerancePct - minTolerancePct)) / 100).toFixed(4)} mm²
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};
