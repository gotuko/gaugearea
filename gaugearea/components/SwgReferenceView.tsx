'use client';

import React, { useState } from 'react';
import {
  SWG_TABLE,
  AWG_TABLE,
  calcAreaFromDiameter,
  findClosestSwg,
} from '@/lib/swgData';
import { Search, Ruler, Layers, BookOpen, Calculator, ArrowLeft } from 'lucide-react';
import { BannerAd } from './ads/BannerAd';
import { NativeAd } from './ads/NativeAd';

interface SwgReferenceViewProps {
  onNavigateToCalculator?: () => void;
}

export const SwgReferenceView: React.FC<SwgReferenceViewProps> = ({
  onNavigateToCalculator,
}) => {
  const [tableType, setTableType] = useState<'swg' | 'awg' | 'comparison'>('swg');
  const [searchQuery, setSearchQuery] = useState('');
  const [micrometerInputMm, setMicrometerInputMm] = useState<number>(1.22);

  // Micrometer lookup computation
  const micrometerArea = calcAreaFromDiameter(micrometerInputMm);
  const closestMatch = micrometerInputMm > 0 ? findClosestSwg(micrometerArea) : null;

  // Filtered SWG table
  const filteredSwgTable = SWG_TABLE.filter((item) => {
    if (!searchQuery.trim()) return true;
    const q = searchQuery.toLowerCase().trim();
    return (
      item.swg.toString().includes(q) ||
      item.diameterMm.toFixed(3).includes(q) ||
      item.areaMm2.toFixed(3).includes(q) ||
      item.approxAwg.toString().includes(q)
    );
  });

  // Filtered AWG table
  const filteredAwgTable = AWG_TABLE.filter((item) => {
    if (!searchQuery.trim()) return true;
    const q = searchQuery.toLowerCase().trim();
    return (
      item.awg.toString().includes(q) ||
      item.diameterMm.toFixed(3).includes(q) ||
      item.areaMm2.toFixed(3).includes(q)
    );
  });

  return (
    <div className="space-y-5 text-slate-100 pb-20">
      {/* 1. TOP BANNER AD */}
      <BannerAd position="top" />

      {/* Header & Table Mode Switcher */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-slate-900 border border-slate-800 rounded-xl p-4">
        <div>
          <h2 className="text-base font-bold text-white flex items-center gap-2">
            <BookOpen className="w-4 h-4 text-amber-400" />
            Standard Wire Gauge (SWG &amp; AWG) Reference
          </h2>
          <p className="text-xs text-slate-400">
            Standard electrical motor rewinding reference tables and conversion metrics.
          </p>
        </div>

        <div className="flex items-center gap-1 bg-slate-950 p-1 rounded-xl border border-slate-800 self-start sm:self-auto">
          <button
            type="button"
            onClick={() => setTableType('swg')}
            className={`px-3 py-1.5 rounded-lg text-xs font-bold transition cursor-pointer ${
              tableType === 'swg'
                ? 'bg-amber-500 text-slate-950'
                : 'text-slate-400 hover:text-white hover:bg-slate-900'
            }`}
          >
            SWG Table
          </button>
          <button
            type="button"
            onClick={() => setTableType('awg')}
            className={`px-3 py-1.5 rounded-lg text-xs font-bold transition cursor-pointer ${
              tableType === 'awg'
                ? 'bg-amber-500 text-slate-950'
                : 'text-slate-400 hover:text-white hover:bg-slate-900'
            }`}
          >
            AWG Table
          </button>
          <button
            type="button"
            onClick={() => setTableType('comparison')}
            className={`px-3 py-1.5 rounded-lg text-xs font-bold transition cursor-pointer ${
              tableType === 'comparison'
                ? 'bg-amber-500 text-slate-950'
                : 'text-slate-400 hover:text-white hover:bg-slate-900'
            }`}
          >
            Comparison
          </button>
        </div>
      </div>

      {/* 2. Micrometer Quick Converter */}
      <div className="bg-slate-900 border border-slate-800 rounded-xl p-4">
        <h3 className="text-sm font-bold text-white mb-1 flex items-center gap-2">
          <Ruler className="w-4 h-4 text-amber-400" />
          Micrometer Wire Diameter Converter
        </h3>
        <p className="text-xs text-slate-400 mb-3">
          Enter measured wire diameter in millimeters to find the closest standard gauge and copper area.
        </p>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 items-center">
          <div>
            <label className="text-xs text-slate-400 block mb-1 font-medium">Diameter (mm):</label>
            <div className="relative">
              <input
                type="number"
                step="0.005"
                min="0.05"
                max="5.0"
                value={micrometerInputMm}
                onChange={(e) => setMicrometerInputMm(parseFloat(e.target.value) || 0)}
                className="w-full bg-slate-950 border border-slate-700 text-amber-400 font-mono font-bold text-base rounded-lg px-3 py-1.5 focus:border-amber-400 focus:outline-hidden"
              />
              <span className="absolute right-3 top-2 text-xs text-slate-500 font-mono">mm</span>
            </div>
          </div>

          <div className="bg-slate-950 px-3 py-2 rounded-lg border border-slate-800">
            <span className="text-xs text-slate-400 block">Copper Cross-Section:</span>
            <span className="text-lg font-mono font-bold text-white">
              {micrometerArea.toFixed(4)} <span className="text-xs text-amber-400 font-normal">mm²</span>
            </span>
          </div>

          {closestMatch && (
            <div className="bg-slate-950 px-3 py-2 rounded-lg border border-slate-800">
              <span className="text-xs text-slate-400 block">Closest Standard Gauge:</span>
              <span className="text-lg font-mono font-bold text-emerald-400">
                {closestMatch.entry.swg} SWG{' '}
                <span className="text-xs font-normal text-slate-400 font-sans">
                  ({closestMatch.diffPct >= 0 ? '+' : ''}{closestMatch.diffPct.toFixed(1)}%)
                </span>
              </span>
            </div>
          )}
        </div>
      </div>

      {/* 3. NATIVE AD IN SWG/AWG PAGE (Placed between converter & table to not annoy user) */}
      <NativeAd variant="reference" />

      {/* 4. Table Section */}
      <div className="bg-slate-900 border border-slate-800 rounded-xl p-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-3">
          <div>
            <h3 className="text-sm font-bold text-white">
              {tableType === 'swg' && 'Standard Wire Gauge (SWG 10 to SWG 36)'}
              {tableType === 'awg' && 'American Wire Gauge (AWG 10 to AWG 40)'}
              {tableType === 'comparison' && 'SWG vs. AWG Side-by-Side Equivalence'}
            </h3>
            <p className="text-xs text-slate-400">
              Values computed for annealed standard copper conductors at 20°C.
            </p>
          </div>

          <div className="relative w-full sm:w-56">
            <Search className="w-3.5 h-3.5 text-slate-400 absolute left-2.5 top-2.5" />
            <input
              type="text"
              placeholder="Search gauge or mm..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-slate-950 border border-slate-700 text-xs text-slate-100 rounded-lg pl-8 pr-3 py-1.5 focus:border-amber-400 focus:outline-hidden"
            />
          </div>
        </div>

        {/* SWG Table */}
        {tableType === 'swg' && (
          <div className="overflow-x-auto border border-slate-800 rounded-lg">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-950 text-slate-400 border-b border-slate-800 font-semibold">
                <tr>
                  <th className="py-2.5 px-3">SWG</th>
                  <th className="py-2.5 px-3">Diameter (mm)</th>
                  <th className="py-2.5 px-3">Area (mm²)</th>
                  <th className="py-2.5 px-3">Approx AWG</th>
                  <th className="py-2.5 px-3">Resistance (Ω/m)</th>
                  <th className="py-2.5 px-3">Ampacity (~5A/mm²)</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/80 font-mono">
                {filteredSwgTable.map((row) => (
                  <tr key={row.swg} className="hover:bg-slate-800/50 transition">
                    <td className="py-2 px-3 font-bold text-amber-400">{row.swg}</td>
                    <td className="py-2 px-3 text-slate-200">{row.diameterMm.toFixed(3)}</td>
                    <td className="py-2 px-3 text-white font-semibold">{row.areaMm2.toFixed(4)}</td>
                    <td className="py-2 px-3 text-slate-400 font-sans">AWG {row.approxAwg}</td>
                    <td className="py-2 px-3 text-slate-300">{row.resistancePerMeterOhm.toFixed(4)}</td>
                    <td className="py-2 px-3 text-emerald-400">{row.ratedCurrentAmps.toFixed(2)} A</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {/* AWG Table */}
        {tableType === 'awg' && (
          <div className="overflow-x-auto border border-slate-800 rounded-lg">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-950 text-slate-400 border-b border-slate-800 font-semibold">
                <tr>
                  <th className="py-2.5 px-3">AWG</th>
                  <th className="py-2.5 px-3">Diameter (mm)</th>
                  <th className="py-2.5 px-3">Area (mm²)</th>
                  <th className="py-2.5 px-3">Approx SWG</th>
                  <th className="py-2.5 px-3">Resistance (~Ω/m)</th>
                  <th className="py-2.5 px-3">Ampacity (~5A/mm²)</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/80 font-mono">
                {filteredAwgTable.map((row) => {
                  const closestSwg = findClosestSwg(row.areaMm2);
                  const approxResistance = (0.017241 / row.areaMm2);
                  const ampacity = row.areaMm2 * 5;
                  return (
                    <tr key={row.awg} className="hover:bg-slate-800/50 transition">
                      <td className="py-2 px-3 font-bold text-amber-400">{row.awg}</td>
                      <td className="py-2 px-3 text-slate-200">{row.diameterMm.toFixed(3)}</td>
                      <td className="py-2 px-3 text-white font-semibold">{row.areaMm2.toFixed(4)}</td>
                      <td className="py-2 px-3 text-slate-400 font-sans">
                        SWG {closestSwg.entry.swg}
                      </td>
                      <td className="py-2 px-3 text-slate-300">{approxResistance.toFixed(4)}</td>
                      <td className="py-2 px-3 text-emerald-400">{ampacity.toFixed(2)} A</td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}

        {/* Comparison Table */}
        {tableType === 'comparison' && (
          <div className="overflow-x-auto border border-slate-800 rounded-lg">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-950 text-slate-400 border-b border-slate-800 font-semibold">
                <tr>
                  <th className="py-2.5 px-3">SWG Size</th>
                  <th className="py-2.5 px-3">SWG Area (mm²)</th>
                  <th className="py-2.5 px-3">Closest AWG</th>
                  <th className="py-2.5 px-3">AWG Area (mm²)</th>
                  <th className="py-2.5 px-3">Difference (%)</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/80 font-mono">
                {filteredSwgTable.map((swg) => {
                  const awgItem = AWG_TABLE.find((a) => a.awg === swg.approxAwg);
                  const awgArea = awgItem ? awgItem.areaMm2 : 0;
                  const diff = awgArea > 0 ? ((awgArea - swg.areaMm2) / swg.areaMm2) * 100 : 0;
                  return (
                    <tr key={swg.swg} className="hover:bg-slate-800/50 transition">
                      <td className="py-2 px-3 font-bold text-amber-400">{swg.swg} SWG</td>
                      <td className="py-2 px-3 text-white font-semibold">{swg.areaMm2.toFixed(4)}</td>
                      <td className="py-2 px-3 text-slate-200 font-sans font-bold">
                        AWG {swg.approxAwg}
                      </td>
                      <td className="py-2 px-3 text-slate-300">
                        {awgArea > 0 ? awgArea.toFixed(4) : '—'}
                      </td>
                      <td className={`py-2 px-3 font-bold ${Math.abs(diff) < 5 ? 'text-emerald-400' : 'text-amber-400'}`}>
                        {diff >= 0 ? '+' : ''}{diff.toFixed(1)}%
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* 5. BOTTOM BANNER AD */}
      <BannerAd position="bottom" />
    </div>
  );
};
