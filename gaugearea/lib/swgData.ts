export interface SwgEntry {
  swg: number;
  diameterMm: number;
  areaMm2: number;
  resistancePerMeterOhm: number; // Annealed copper at 20°C (approx 0.017241 / area)
  weightKgPerKm: number; // Copper density 8.89 g/cm³ = 8.89 * area kg/km
  ratedCurrentAmps: number; // at standard 5 A/mm² motor current density
  approxAwg: number; // approximate American Wire Gauge equivalent
}

// Internal static data mapping SWG to exact diameter (mm) and area (mm²) as specified in requirements
export const SWG_TABLE: SwgEntry[] = [
  { swg: 10, diameterMm: 3.251, areaMm2: 8.301, resistancePerMeterOhm: 0.002077, weightKgPerKm: 73.79, ratedCurrentAmps: 41.51, approxAwg: 8 },
  { swg: 11, diameterMm: 2.946, areaMm2: 6.817, resistancePerMeterOhm: 0.002529, weightKgPerKm: 60.60, ratedCurrentAmps: 34.09, approxAwg: 9 },
  { swg: 12, diameterMm: 2.642, areaMm2: 5.482, resistancePerMeterOhm: 0.003145, weightKgPerKm: 48.73, ratedCurrentAmps: 27.41, approxAwg: 10 },
  { swg: 13, diameterMm: 2.337, areaMm2: 4.290, resistancePerMeterOhm: 0.004019, weightKgPerKm: 38.14, ratedCurrentAmps: 21.45, approxAwg: 11 },
  { swg: 14, diameterMm: 2.032, areaMm2: 3.243, resistancePerMeterOhm: 0.005316, weightKgPerKm: 28.83, ratedCurrentAmps: 16.22, approxAwg: 12 },
  { swg: 15, diameterMm: 1.829, areaMm2: 2.627, resistancePerMeterOhm: 0.006563, weightKgPerKm: 23.35, ratedCurrentAmps: 13.14, approxAwg: 13 },
  { swg: 16, diameterMm: 1.626, areaMm2: 2.076, resistancePerMeterOhm: 0.008305, weightKgPerKm: 18.46, ratedCurrentAmps: 10.38, approxAwg: 14 },
  { swg: 17, diameterMm: 1.422, areaMm2: 1.589, resistancePerMeterOhm: 0.01085, weightKgPerKm: 14.13, ratedCurrentAmps: 7.95, approxAwg: 15 },
  { swg: 18, diameterMm: 1.219, areaMm2: 1.167, resistancePerMeterOhm: 0.01477, weightKgPerKm: 10.37, ratedCurrentAmps: 5.84, approxAwg: 16 },
  { swg: 19, diameterMm: 1.016, areaMm2: 0.811, resistancePerMeterOhm: 0.02126, weightKgPerKm: 7.21, ratedCurrentAmps: 4.06, approxAwg: 18 },
  { swg: 20, diameterMm: 0.914, areaMm2: 0.656, resistancePerMeterOhm: 0.02628, weightKgPerKm: 5.83, ratedCurrentAmps: 3.28, approxAwg: 19 },
  { swg: 21, diameterMm: 0.813, areaMm2: 0.519, resistancePerMeterOhm: 0.03322, weightKgPerKm: 4.61, ratedCurrentAmps: 2.60, approxAwg: 20 },
  { swg: 22, diameterMm: 0.711, areaMm2: 0.397, resistancePerMeterOhm: 0.04343, weightKgPerKm: 3.53, ratedCurrentAmps: 1.99, approxAwg: 21 },
  { swg: 23, diameterMm: 0.610, areaMm2: 0.292, resistancePerMeterOhm: 0.05904, weightKgPerKm: 2.60, ratedCurrentAmps: 1.46, approxAwg: 22 },
  { swg: 24, diameterMm: 0.559, areaMm2: 0.245, resistancePerMeterOhm: 0.07037, weightKgPerKm: 2.18, ratedCurrentAmps: 1.23, approxAwg: 23 },
  { swg: 25, diameterMm: 0.508, areaMm2: 0.203, resistancePerMeterOhm: 0.08493, weightKgPerKm: 1.80, ratedCurrentAmps: 1.02, approxAwg: 24 },
  { swg: 26, diameterMm: 0.457, areaMm2: 0.164, resistancePerMeterOhm: 0.1051, weightKgPerKm: 1.46, ratedCurrentAmps: 0.82, approxAwg: 25 },
  { swg: 27, diameterMm: 0.417, areaMm2: 0.136, resistancePerMeterOhm: 0.1268, weightKgPerKm: 1.21, ratedCurrentAmps: 0.68, approxAwg: 26 },
  { swg: 28, diameterMm: 0.376, areaMm2: 0.111, resistancePerMeterOhm: 0.1553, weightKgPerKm: 0.99, ratedCurrentAmps: 0.56, approxAwg: 27 },
  { swg: 29, diameterMm: 0.345, areaMm2: 0.0935, resistancePerMeterOhm: 0.1844, weightKgPerKm: 0.831, ratedCurrentAmps: 0.47, approxAwg: 28 },
  { swg: 30, diameterMm: 0.315, areaMm2: 0.0779, resistancePerMeterOhm: 0.2213, weightKgPerKm: 0.693, ratedCurrentAmps: 0.39, approxAwg: 29 },
  { swg: 31, diameterMm: 0.295, areaMm2: 0.0683, resistancePerMeterOhm: 0.2524, weightKgPerKm: 0.607, ratedCurrentAmps: 0.34, approxAwg: 30 },
  { swg: 32, diameterMm: 0.274, areaMm2: 0.0590, resistancePerMeterOhm: 0.2922, weightKgPerKm: 0.525, ratedCurrentAmps: 0.30, approxAwg: 31 },
  { swg: 33, diameterMm: 0.254, areaMm2: 0.0507, resistancePerMeterOhm: 0.3401, weightKgPerKm: 0.451, ratedCurrentAmps: 0.25, approxAwg: 32 },
  { swg: 34, diameterMm: 0.234, areaMm2: 0.0430, resistancePerMeterOhm: 0.4009, weightKgPerKm: 0.382, ratedCurrentAmps: 0.22, approxAwg: 33 },
  { swg: 35, diameterMm: 0.213, areaMm2: 0.0356, resistancePerMeterOhm: 0.4843, weightKgPerKm: 0.316, ratedCurrentAmps: 0.18, approxAwg: 34 },
  { swg: 36, diameterMm: 0.193, areaMm2: 0.0293, resistancePerMeterOhm: 0.5884, weightKgPerKm: 0.260, ratedCurrentAmps: 0.15, approxAwg: 35 }
];

export const SWG_BY_NUMBER = new Map<number, SwgEntry>(
  SWG_TABLE.map((item) => [item.swg, item])
);

// All valid SWG numbers
export const ALL_SWG_NUMBERS = SWG_TABLE.map((item) => item.swg);

// Common workshop sizes (SWG 16 to 30)
export const DEFAULT_COMMON_SWG_NUMBERS = SWG_TABLE.filter(
  (item) => item.swg >= 16 && item.swg <= 30
).map((item) => item.swg);

/**
 * Calculates wire area in mm² from diameter in mm:
 * A = (π * d²) / 4
 */
export function calcAreaFromDiameter(diameterMm: number): number {
  if (diameterMm <= 0) return 0;
  return (Math.PI * diameterMm * diameterMm) / 4;
}

/**
 * Calculates diameter in mm from area in mm²:
 * d = sqrt((4 * A) / π)
 */
export function calcDiameterFromArea(areaMm2: number): number {
  if (areaMm2 <= 0) return 0;
  return Math.sqrt((4 * areaMm2) / Math.PI);
}

/**
 * Finds the closest standard SWG entry for a given copper area.
 */
export function findClosestSwg(areaMm2: number): { entry: SwgEntry; diffPct: number } {
  let closest = SWG_TABLE[0];
  let minDiff = Math.abs(closest.areaMm2 - areaMm2);

  for (const item of SWG_TABLE) {
    const diff = Math.abs(item.areaMm2 - areaMm2);
    if (diff < minDiff) {
      minDiff = diff;
      closest = item;
    }
  }

  const diffPct = ((closest.areaMm2 - areaMm2) / areaMm2) * 100;
  return { entry: closest, diffPct };
}

export interface AwgEntry {
  awg: number;
  diameterMm: number;
  areaMm2: number;
}

// Standard American Wire Gauge (AWG 10 to 40)
export const AWG_TABLE: AwgEntry[] = [
  { awg: 10, diameterMm: 2.588, areaMm2: 5.261 },
  { awg: 11, diameterMm: 2.305, areaMm2: 4.172 },
  { awg: 12, diameterMm: 2.053, areaMm2: 3.309 },
  { awg: 13, diameterMm: 1.828, areaMm2: 2.624 },
  { awg: 14, diameterMm: 1.628, areaMm2: 2.081 },
  { awg: 15, diameterMm: 1.450, areaMm2: 1.651 },
  { awg: 16, diameterMm: 1.291, areaMm2: 1.309 },
  { awg: 17, diameterMm: 1.150, areaMm2: 1.039 },
  { awg: 18, diameterMm: 1.024, areaMm2: 0.823 },
  { awg: 19, diameterMm: 0.912, areaMm2: 0.653 },
  { awg: 20, diameterMm: 0.812, areaMm2: 0.518 },
  { awg: 21, diameterMm: 0.723, areaMm2: 0.411 },
  { awg: 22, diameterMm: 0.644, areaMm2: 0.326 },
  { awg: 23, diameterMm: 0.573, areaMm2: 0.258 },
  { awg: 24, diameterMm: 0.511, areaMm2: 0.205 },
  { awg: 25, diameterMm: 0.455, areaMm2: 0.162 },
  { awg: 26, diameterMm: 0.405, areaMm2: 0.129 },
  { awg: 27, diameterMm: 0.361, areaMm2: 0.102 },
  { awg: 28, diameterMm: 0.321, areaMm2: 0.081 },
  { awg: 29, diameterMm: 0.286, areaMm2: 0.064 },
  { awg: 30, diameterMm: 0.255, areaMm2: 0.051 },
  { awg: 31, diameterMm: 0.227, areaMm2: 0.040 },
  { awg: 32, diameterMm: 0.202, areaMm2: 0.032 },
  { awg: 33, diameterMm: 0.180, areaMm2: 0.025 },
  { awg: 34, diameterMm: 0.160, areaMm2: 0.020 },
  { awg: 35, diameterMm: 0.143, areaMm2: 0.016 },
  { awg: 36, diameterMm: 0.127, areaMm2: 0.013 },
  { awg: 37, diameterMm: 0.113, areaMm2: 0.010 },
  { awg: 38, diameterMm: 0.101, areaMm2: 0.008 },
  { awg: 39, diameterMm: 0.090, areaMm2: 0.006 },
  { awg: 40, diameterMm: 0.080, areaMm2: 0.005 }
];

export const AWG_BY_NUMBER = new Map<number, AwgEntry>(
  AWG_TABLE.map((item) => [item.awg, item])
);

export interface OriginalWireItem {
  id: string;
  mode: 'swg' | 'awg' | 'custom';
  swg: number;
  awg?: number;
  customDiameterMm: number;
  count: number;
}

export interface WireGroupSummary {
  swg: number;
  count: number;
  diameterMm: number;
  singleAreaMm2: number;
  totalAreaMm2: number;
}

export type MatchCategory = 'ideal' | 'usable' | 'out_of_range';

export type WindingStrategy = 'smart' | 'same_gauge' | 'thicker' | 'thinner' | 'all';

export interface CombinationResult {
  id: string;
  wireCount: number;
  swgs: number[]; // e.g. [20, 20] or [25, 26]
  groups: WireGroupSummary[];
  comboAreaMm2: number;
  targetAreaMm2: number;
  areaDiffMm2: number; // comboArea - targetArea
  areaDiffPct: number; // ((comboArea - targetArea) / targetArea) * 100
  areaRatioPct: number; // (comboArea / targetArea) * 100, e.g. 100.2% or 101.5%
  accuracyPct: number; // (1 - |comboArea - targetArea| / targetArea) * 100
  category: MatchCategory;
  description: string; // e.g., "1× 25 SWG + 1× 26 SWG"
  insulationSpaceFactorPct: number; // estimated slot fill increase due to multi-enamel surfaces
  equivalentResistanceRatio: number; // R_target / R_combo = comboArea / targetArea (approx)
  // Practical Workshop Intelligence
  isIdenticalGauge: boolean; // e.g. true for "2× 25 SWG"
  distinctGaugeCount: number;
  practicalScore: number;
  recommendationBadge: string;
  recommendationReason: string;
}

/**
 * Classify accuracy according to prompt rules:
 * - Green Badge (98%–102% Area Match): "Ideal Match - Safe for Rewinding"
 * - Yellow Badge (95%–97.99% / 102.01%–105% Area Match): "Usable - Minor Slot Fill / Resistance Shift"
 * - Red Badge (<95% / >105% Area Match): "Out of Safe Range"
 */
export function categorizeMatch(comboArea: number, targetArea: number): { category: MatchCategory; label: string; badgeColor: string } {
  const ratio = (comboArea / targetArea) * 100; // e.g. 100% means exact match

  if (ratio >= 98.0 && ratio <= 102.0) {
    return {
      category: 'ideal',
      label: 'Ideal Match - Safe for Rewinding',
      badgeColor: 'green'
    };
  } else if ((ratio >= 95.0 && ratio < 98.0) || (ratio > 102.0 && ratio <= 105.0)) {
    return {
      category: 'usable',
      label: 'Usable - Minor Slot Fill / Resistance Shift',
      badgeColor: 'yellow'
    };
  } else {
    return {
      category: 'out_of_range',
      label: 'Out of Safe Range',
      badgeColor: 'red'
    };
  }
}

/**
 * Generates parallel wire combinations matching targetArea within [minTolerancePct, maxTolerancePct].
 * Supports smart rewinding strategies:
 * - 'smart': Prioritizes identical gauge combinations (e.g. 2× 25 SWG) and fewer strands (lowest slot fill, equal current sharing)
 * - 'same_gauge': Specifically finds replacements using identical strands of a single gauge (e.g. 2×, 3× of same wire)
 * - 'thicker': Focuses on 1 to 3 strands for fast, easy winding with minimal slot enamel penalty
 * - 'thinner': Explores 4 to 8 strands for maximum bend flexibility in tight slots
 * - 'all': Computes every mathematically valid combination
 */
export function calculateCombinations(
  targetArea: number,
  inStockSwgs: number[],
  wireCountChoice: number | 'auto' = 'auto',
  minTolerancePct = 92,
  maxTolerancePct = 108,
  spoolCounts?: Record<number, number>,
  useStockFilter: boolean = true,
  strategy: WindingStrategy = 'smart',
  allowMultipleSameWire: boolean = true,
  originalWireSwg?: number
): CombinationResult[] {
  if (targetArea <= 0) return [];

  // Determine which SWG gauges to consider
  const gaugesToUse = useStockFilter ? inStockSwgs : ALL_SWG_NUMBERS;
  if (gaugesToUse.length === 0) return [];

  // Filter and sort available SWGs (ascending by area for branch and bound pruning)
  const availableEntries = gaugesToUse
    .map((num) => SWG_BY_NUMBER.get(num))
    .filter((e): e is SwgEntry => e !== undefined)
    .sort((a, b) => a.areaMm2 - b.areaMm2);

  if (availableEntries.length === 0) return [];

  let effectiveMinPct = Math.min(minTolerancePct, maxTolerancePct);
  let effectiveMaxPct = Math.max(minTolerancePct, maxTolerancePct);

  // If user entered exact 0% tolerance (both 100%), add minimal epsilon for floating point equality
  if (Math.abs(effectiveMaxPct - effectiveMinPct) < 0.001) {
    effectiveMinPct -= 0.05;
    effectiveMaxPct += 0.05;
  }

  const minTargetArea = (targetArea * effectiveMinPct) / 100;
  const maxTargetArea = (targetArea * effectiveMaxPct) / 100;

  // Determine target wire counts to search based on choice and strategy
  let targetWireCounts: number[];
  if (wireCountChoice !== 'auto') {
    if (wireCountChoice === 0) {
      targetWireCounts = [];
    } else {
      const parsedCount = Math.max(1, Math.min(99, Math.round(wireCountChoice)));
      targetWireCounts = [parsedCount];
    }
  } else if (strategy === 'same_gauge') {
    targetWireCounts = [1, 2, 3, 4, 5, 6, 7, 8];
  } else if (strategy === 'thicker') {
    targetWireCounts = [1, 2, 3];
  } else if (strategy === 'thinner') {
    targetWireCounts = [4, 5, 6, 7, 8];
  } else {
    // 'smart' or 'all' auto searches 1 through 8 parallel strands
    targetWireCounts = [1, 2, 3, 4, 5, 6, 7, 8];
  }

  const results: CombinationResult[] = [];
  const seenCombinations = new Set<string>();

  for (const k of targetWireCounts) {
    // Specialized high-speed evaluation for same_gauge strategy
    if (strategy === 'same_gauge') {
      for (const entry of availableEntries) {
        if (useStockFilter && spoolCounts && !allowMultipleSameWire) {
          const maxSpools = spoolCounts[entry.swg] ?? 4;
          if (k > maxSpools) continue;
        }

        const totalArea = entry.areaMm2 * k;
        if (totalArea >= minTargetArea && totalArea <= maxTargetArea) {
          const key = Array(k).fill(entry.swg).join('-');
          if (!seenCombinations.has(key)) {
            seenCombinations.add(key);

            const areaDiffMm2 = totalArea - targetArea;
            const areaDiffPct = (areaDiffMm2 / targetArea) * 100;
            const areaRatioPct = (totalArea / targetArea) * 100;
            const accuracyPct = Math.max(0, (1 - Math.abs(areaDiffMm2) / targetArea) * 100);
            const { category } = categorizeMatch(totalArea, targetArea);
            const insulationSpaceFactorPct = k === 1 ? 0 : (Math.sqrt(k) - 1) * 28;

            const group: WireGroupSummary = {
              swg: entry.swg,
              count: k,
              diameterMm: entry.diameterMm,
              singleAreaMm2: entry.areaMm2,
              totalAreaMm2: totalArea
            };

            const isOrig = k === 1 && originalWireSwg === entry.swg;
            let badge = '🌟 Workshop Top Pick: Single Gauge';
            let reason = `Uses identical ${entry.swg} SWG (${k} parallel strands). Perfect 50/50 current sharing, zero eddy currents, and easily wound from 1 reel.`;
            if (isOrig) {
              badge = 'Exact Original Wire Gauge';
              reason = 'Direct 1:1 original single-wire specification.';
            }

            const areaError = Math.abs(areaRatioPct - 100);
            const practicalScore = Number((areaError - 20 - (k === 2 ? 4 : k === 3 ? 1 : 0)).toFixed(2));

            results.push({
              id: `${k}-${key}`,
              wireCount: k,
              swgs: Array(k).fill(entry.swg),
              groups: [group],
              comboAreaMm2: Number(totalArea.toFixed(4)),
              targetAreaMm2: Number(targetArea.toFixed(4)),
              areaDiffMm2: Number(areaDiffMm2.toFixed(4)),
              areaDiffPct: Number(areaDiffPct.toFixed(2)),
              areaRatioPct: Number(areaRatioPct.toFixed(2)),
              accuracyPct: Number(accuracyPct.toFixed(2)),
              category,
              description: `${k}× ${entry.swg} SWG`,
              insulationSpaceFactorPct: Number(insulationSpaceFactorPct.toFixed(1)),
              equivalentResistanceRatio: Number((targetArea / totalArea).toFixed(4)),
              isIdenticalGauge: true,
              distinctGaugeCount: 1,
              practicalScore,
              recommendationBadge: badge,
              recommendationReason: reason
            });
          }
        }
      }
      continue;
    }

    // Always check identical gauge first (e.g. k × SWG)
    for (const entry of availableEntries) {
      if (useStockFilter && spoolCounts && !allowMultipleSameWire) {
        const maxSpools = spoolCounts[entry.swg] ?? 4;
        if (k > maxSpools) continue;
      }

      const totalArea = entry.areaMm2 * k;
      if (totalArea >= minTargetArea && totalArea <= maxTargetArea) {
        const key = Array(k).fill(entry.swg).join('-');
        if (!seenCombinations.has(key)) {
          seenCombinations.add(key);

          const areaDiffMm2 = totalArea - targetArea;
          const areaDiffPct = (areaDiffMm2 / targetArea) * 100;
          const areaRatioPct = (totalArea / targetArea) * 100;
          const accuracyPct = Math.max(0, (1 - Math.abs(areaDiffMm2) / targetArea) * 100);
          const { category } = categorizeMatch(totalArea, targetArea);
          const insulationSpaceFactorPct = k === 1 ? 0 : (Math.sqrt(k) - 1) * 28;

          const group: WireGroupSummary = {
            swg: entry.swg,
            count: k,
            diameterMm: entry.diameterMm,
            singleAreaMm2: entry.areaMm2,
            totalAreaMm2: totalArea
          };

          const isOrig = k === 1 && originalWireSwg === entry.swg;
          let badge = '🌟 Workshop Top Pick: Single Gauge';
          let reason = `Uses identical ${entry.swg} SWG (${k} parallel strands). Perfect 50/50 current sharing, zero eddy currents, and easily wound from 1 reel.`;
          if (isOrig) {
            badge = 'Exact Original Wire Gauge';
            reason = 'Direct 1:1 original single-wire specification.';
          }

          const areaError = Math.abs(areaRatioPct - 100);
          const practicalScore = Number((areaError - 20 - (k === 2 ? 4 : k === 3 ? 1 : 0)).toFixed(2));

          results.push({
            id: `${k}-${key}`,
            wireCount: k,
            swgs: Array(k).fill(entry.swg),
            groups: [group],
            comboAreaMm2: Number(totalArea.toFixed(4)),
            targetAreaMm2: Number(targetArea.toFixed(4)),
            areaDiffMm2: Number(areaDiffMm2.toFixed(4)),
            areaDiffPct: Number(areaDiffPct.toFixed(2)),
            areaRatioPct: Number(areaRatioPct.toFixed(2)),
            accuracyPct: Number(accuracyPct.toFixed(2)),
            category,
            description: `${k}× ${entry.swg} SWG`,
            insulationSpaceFactorPct: Number(insulationSpaceFactorPct.toFixed(1)),
            equivalentResistanceRatio: Number((targetArea / totalArea).toFixed(4)),
            isIdenticalGauge: true,
            distinctGaugeCount: 1,
            practicalScore,
            recommendationBadge: badge,
            recommendationReason: reason
          });
        }
      }
    }

    // Pre-filter candidate gauges: single strand cannot exceed target max
    const candidateEntries = availableEntries.filter((e) => e.areaMm2 <= maxTargetArea);
    if (candidateEntries.length === 0) continue;

    // For very high strand counts (> 8 strands, up to 99), evaluate 2-gauge combinations efficiently
    if (k > 8) {
      for (let i = 0; i < candidateEntries.length; i++) {
        for (let j = i + 1; j < candidateEntries.length; j++) {
          const e1 = candidateEntries[i];
          const e2 = candidateEntries[j];
          for (let c1 = 1; c1 < k; c1++) {
            const c2 = k - c1;
            const totalArea = e1.areaMm2 * c1 + e2.areaMm2 * c2;
            if (totalArea >= minTargetArea && totalArea <= maxTargetArea) {
              const swgs = [...Array(c1).fill(e1.swg), ...Array(c2).fill(e2.swg)].sort((a, b) => a - b);
              const key = swgs.join('-');
              if (!seenCombinations.has(key)) {
                seenCombinations.add(key);

                const areaDiffMm2 = totalArea - targetArea;
                const areaDiffPct = (areaDiffMm2 / targetArea) * 100;
                const areaRatioPct = (totalArea / targetArea) * 100;
                const accuracyPct = Math.max(0, (1 - Math.abs(areaDiffMm2) / targetArea) * 100);
                const { category } = categorizeMatch(totalArea, targetArea);
                const insulationSpaceFactorPct = (Math.sqrt(k) - 1) * 28;

                results.push({
                  id: `${k}-${key}`,
                  wireCount: k,
                  swgs,
                  groups: [
                    { swg: e1.swg, count: c1, diameterMm: e1.diameterMm, singleAreaMm2: e1.areaMm2, totalAreaMm2: e1.areaMm2 * c1 },
                    { swg: e2.swg, count: c2, diameterMm: e2.diameterMm, singleAreaMm2: e2.areaMm2, totalAreaMm2: e2.areaMm2 * c2 }
                  ].sort((a, b) => a.swg - b.swg),
                  comboAreaMm2: Number(totalArea.toFixed(4)),
                  targetAreaMm2: Number(targetArea.toFixed(4)),
                  areaDiffMm2: Number(areaDiffMm2.toFixed(4)),
                  areaDiffPct: Number(areaDiffPct.toFixed(2)),
                  areaRatioPct: Number(areaRatioPct.toFixed(2)),
                  accuracyPct: Number(accuracyPct.toFixed(2)),
                  category,
                  description: `${c1}× ${e1.swg} SWG + ${c2}× ${e2.swg} SWG`,
                  insulationSpaceFactorPct: Number(insulationSpaceFactorPct.toFixed(1)),
                  equivalentResistanceRatio: Number((targetArea / totalArea).toFixed(4)),
                  isIdenticalGauge: false,
                  distinctGaugeCount: 2,
                  practicalScore: Number((Math.abs(areaRatioPct - 100) + 1).toFixed(2)),
                  recommendationBadge: 'Multi-Strand 2-Gauge Pair',
                  recommendationReason: `${k} strands composed of ${e1.swg} SWG and ${e2.swg} SWG.`
                });
              }
            }
          }
        }
      }
      continue;
    }

    const currentCombination: SwgEntry[] = [];
    let iterations = 0;
    const maxIterations = 250000;

    function search(startIndex: number, currentSum: number, remainingDepth: number) {
      if (++iterations > maxIterations) return;

      if (remainingDepth === 0) {
        if (currentSum >= minTargetArea && currentSum <= maxTargetArea) {
          const key = currentCombination.map((e) => e.swg).sort((a, b) => a - b).join('-');
          if (!seenCombinations.has(key)) {
            seenCombinations.add(key);

            // Group wires
            const groupMap = new Map<number, number>();
            for (const item of currentCombination) {
              groupMap.set(item.swg, (groupMap.get(item.swg) || 0) + 1);
            }

            const groups: WireGroupSummary[] = [];
            groupMap.forEach((count, swg) => {
              const entry = SWG_BY_NUMBER.get(swg)!;
              groups.push({
                swg,
                count,
                diameterMm: entry.diameterMm,
                singleAreaMm2: entry.areaMm2,
                totalAreaMm2: entry.areaMm2 * count
              });
            });

            // Sort groups so thicker wires (lower SWG number) appear first
            groups.sort((a, b) => a.swg - b.swg);

            const description = groups.map((g) => `${g.count}× ${g.swg} SWG`).join(' + ');
            const areaDiffMm2 = currentSum - targetArea;
            const areaDiffPct = (areaDiffMm2 / targetArea) * 100;
            const areaRatioPct = (currentSum / targetArea) * 100;
            const accuracyPct = Math.max(0, (1 - Math.abs(areaDiffMm2) / targetArea) * 100);
            const { category } = categorizeMatch(currentSum, targetArea);

            // Multi-wire insulation slot fill increase estimation:
            // k parallel thinner wires have sqrt(k) more circumference, thus ~10-25% more slot fill
            const insulationSpaceFactorPct = k === 1 ? 0 : (Math.sqrt(k) - 1) * 28;

            const distinctGaugeCount = groups.length;
            const isIdenticalGauge = distinctGaugeCount === 1;

            // Practical Workshop Scoring:
            // Rewinders strongly prefer:
            // 1. Identical wire sizes (e.g. 2× 25 SWG): perfect 50/50 current sharing, no circulating currents, 1 spool size
            // 2. Fewer strands (1-3 wires): easier winding, lower labor, minimal slot fill expansion
            // 3. Low slot fill penalty (avoids 5+ thin wires that jam slots and cost extra)
            const areaError = Math.abs(areaRatioPct - 100);
            let penalty = 0;

            if (k === 1) {
              penalty -= 22;
            } else if (isIdenticalGauge) {
              // 2× 25 SWG gets massive workshop preference!
              penalty -= 20;
            } else if (distinctGaugeCount === 2) {
              penalty += 1;
            } else {
              penalty += (distinctGaugeCount - 2) * 6;
            }

            if (k === 2) penalty -= 4;
            else if (k === 3) penalty -= 1;
            else if (k >= 4) penalty += (k - 3) * 4;

            const practicalScore = Number((areaError + penalty).toFixed(2));

            let recommendationBadge = 'Standard Rewind Combination';
            let recommendationReason = 'Balanced alternative matching target copper cross-section.';

            if (k === 1) {
              if (originalWireSwg && currentCombination[0].swg === originalWireSwg) {
                recommendationBadge = 'Exact Original Wire Gauge';
                recommendationReason = 'Direct 1:1 original single-wire specification.';
              } else {
                recommendationBadge = 'Single Wire Direct Equivalent';
                recommendationReason = 'Single solid strand with minimal slot insulation space factor.';
              }
            } else if (isIdenticalGauge) {
              recommendationBadge = '🌟 Workshop Top Pick: Single Gauge';
              recommendationReason = `Uses identical ${groups[0].swg} SWG (${k} strands in parallel). Exactly 50/50 current sharing, zero eddy currents, and easily wound from 1 reel.`;
            } else if (distinctGaugeCount === 2 && k <= 3) {
              recommendationBadge = 'Compact 2-Gauge Pair';
              recommendationReason = `Combines only 2 standard gauges with low slot fill expansion (+${insulationSpaceFactorPct.toFixed(1)}%).`;
            } else if (k >= 5) {
              recommendationBadge = 'Multi-Strand Fine Wire';
              recommendationReason = `High strand count (${k} wires). Warning: +${insulationSpaceFactorPct.toFixed(1)}% slot fill due to enamel buildup.`;
            }

            results.push({
              id: `${k}-${key}`,
              wireCount: k,
              swgs: currentCombination.map((e) => e.swg),
              groups,
              comboAreaMm2: Number(currentSum.toFixed(4)),
              targetAreaMm2: Number(targetArea.toFixed(4)),
              areaDiffMm2: Number(areaDiffMm2.toFixed(4)),
              areaDiffPct: Number(areaDiffPct.toFixed(2)),
              areaRatioPct: Number(areaRatioPct.toFixed(2)),
              accuracyPct: Number(accuracyPct.toFixed(2)),
              category,
              description,
              insulationSpaceFactorPct: Number(insulationSpaceFactorPct.toFixed(1)),
              equivalentResistanceRatio: Number((targetArea / currentSum).toFixed(4)),
              isIdenticalGauge,
              distinctGaugeCount,
              practicalScore,
              recommendationBadge,
              recommendationReason
            });
          }
        }
        return;
      }

      const minAvailable = candidateEntries[startIndex]?.areaMm2 ?? 0;
      const maxAvailable = candidateEntries[candidateEntries.length - 1]?.areaMm2 ?? 0;

      // Exact mathematical branch-and-bound pruning
      if (currentSum + remainingDepth * minAvailable > maxTargetArea) return;
      if (currentSum + remainingDepth * maxAvailable < minTargetArea) return;

      for (let i = startIndex; i < candidateEntries.length; i++) {
        const entry = candidateEntries[i];

        // If stock filter is ON and spoolCounts is provided, ensure we don't exceed available physical spools
        // unless allowMultipleSameWire is enabled (which permits pulling multiple strands from in-stock spools)
        if (useStockFilter && spoolCounts && !allowMultipleSameWire) {
          const maxSpools = spoolCounts[entry.swg] ?? 4;
          let currentStrandsOfThisGauge = 0;
          for (let cIdx = 0; cIdx < currentCombination.length; cIdx++) {
            if (currentCombination[cIdx].swg === entry.swg) currentStrandsOfThisGauge++;
          }
          if (currentStrandsOfThisGauge >= maxSpools) {
            continue;
          }
        }

        const nextSum = currentSum + entry.areaMm2;

        if (nextSum + (remainingDepth - 1) * entry.areaMm2 > maxTargetArea) {
          // Since array is sorted by area ascending, any subsequent elements will also exceed
          break;
        }

        currentCombination.push(entry);
        search(i, nextSum, remainingDepth - 1);
        currentCombination.pop();
      }
    }

    search(0, 0, k);
  }

  // Sort based on strategy:
  // 'smart', 'same_gauge', 'thicker', 'thinner' prioritize practicalScore (places 2x 25 SWG at top)
  // 'all' sorts purely by closest area accuracy to 100.0%
  if (strategy === 'all') {
    results.sort((a, b) => Math.abs(a.areaRatioPct - 100) - Math.abs(b.areaRatioPct - 100));
  } else {
    results.sort((a, b) => a.practicalScore - b.practicalScore);
  }

  return results;
}
