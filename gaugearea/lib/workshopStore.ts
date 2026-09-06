'use client';

import { useSyncExternalStore } from 'react';
import { ALL_SWG_NUMBERS, WindingStrategy } from './swgData';

const STORAGE_KEY_INVENTORY = 'rewind_workshop_inventory_v1';
const STORAGE_KEY_SPOOL_COUNTS = 'rewind_workshop_spools_v1';
const STORAGE_KEY_USE_FILTER = 'rewind_workshop_use_filter_v1';
const STORAGE_KEY_ALLOW_MULTIPLE = 'rewind_workshop_allow_multiple_v1';
const STORAGE_KEY_WINDING_STRATEGY = 'rewind_workshop_winding_strategy_v1';
const STORAGE_KEY_FULLSCREEN_ADS = 'rewind_workshop_fullscreen_ads_v1';
const STORAGE_KEY_FLOATING_BANNER = 'rewind_workshop_floating_banner_v1';
const STORAGE_KEY_BANNER_ADS = 'rewind_workshop_banner_ads_v1';
const STORAGE_KEY_NATIVE_ADS = 'rewind_workshop_native_ads_v1';
const STORAGE_KEY_AD_FREQUENCY = 'rewind_workshop_ad_frequency_v1';

const listeners = new Set<() => void>();

function notify() {
  listeners.forEach((listener) => listener());
}

function subscribe(callback: () => void) {
  listeners.add(callback);
  if (typeof window !== 'undefined') {
    window.addEventListener('storage', callback);
  }
  return () => {
    listeners.delete(callback);
    if (typeof window !== 'undefined') {
      window.removeEventListener('storage', callback);
    }
  };
}

// ---------------- INVENTORY SWGs STORE ----------------
let cachedInStockRaw: string | null = null;
let cachedInStockList: number[] = ALL_SWG_NUMBERS;

function getInStockSnapshot(): number[] {
  if (typeof window === 'undefined') return ALL_SWG_NUMBERS;
  try {
    const raw = localStorage.getItem(STORAGE_KEY_INVENTORY);
    if (raw === cachedInStockRaw) {
      return cachedInStockList;
    }
    cachedInStockRaw = raw;
    if (raw) {
      const parsed = JSON.parse(raw);
      if (Array.isArray(parsed) && parsed.length > 0) {
        cachedInStockList = parsed;
        return cachedInStockList;
      }
    }
  } catch {
    // fallback
  }
  cachedInStockList = ALL_SWG_NUMBERS;
  return cachedInStockList;
}

function getInStockServerSnapshot(): number[] {
  return ALL_SWG_NUMBERS;
}

export function useInStockSwgs(): [number[], (newSwgs: number[]) => void] {
  const inStock = useSyncExternalStore(subscribe, getInStockSnapshot, getInStockServerSnapshot);

  const setInStock = (newSwgs: number[]) => {
    cachedInStockList = newSwgs;
    cachedInStockRaw = JSON.stringify(newSwgs);
    try {
      if (typeof window !== 'undefined') {
        localStorage.setItem(STORAGE_KEY_INVENTORY, cachedInStockRaw);
      }
    } catch {
      // ignore
    }
    notify();
  };

  return [inStock, setInStock];
}

// ---------------- SPOOL REEL COUNTS STORE ----------------
const defaultSpools: Record<number, number> = {
  // Workshop defaults: 4 reels for all standard gauges, example 3 for 22 SWG, 5 for 25 SWG
  ...Object.fromEntries(ALL_SWG_NUMBERS.map((s) => [s, 4])),
  22: 3,
  25: 5
};

let cachedSpoolRaw: string | null = null;
let cachedSpoolMap: Record<number, number> = defaultSpools;

function getSpoolSnapshot(): Record<number, number> {
  if (typeof window === 'undefined') return defaultSpools;
  try {
    const raw = localStorage.getItem(STORAGE_KEY_SPOOL_COUNTS);
    if (raw === cachedSpoolRaw) {
      return cachedSpoolMap;
    }
    cachedSpoolRaw = raw;
    if (raw) {
      const parsed = JSON.parse(raw);
      if (typeof parsed === 'object' && parsed !== null) {
        cachedSpoolMap = { ...defaultSpools, ...parsed };
        return cachedSpoolMap;
      }
    }
  } catch {
    // fallback
  }
  cachedSpoolMap = defaultSpools;
  return cachedSpoolMap;
}

function getSpoolServerSnapshot(): Record<number, number> {
  return defaultSpools;
}

export function useSpoolCounts(): [
  Record<number, number>,
  (newCounts: Record<number, number>) => void,
  (swg: number, delta: number) => void
] {
  const spoolCounts = useSyncExternalStore(subscribe, getSpoolSnapshot, getSpoolServerSnapshot);

  const setSpoolCounts = (newCounts: Record<number, number>) => {
    cachedSpoolMap = newCounts;
    cachedSpoolRaw = JSON.stringify(newCounts);
    try {
      if (typeof window !== 'undefined') {
        localStorage.setItem(STORAGE_KEY_SPOOL_COUNTS, cachedSpoolRaw);
      }
    } catch {
      // ignore
    }
    notify();
  };

  const updateSpoolCount = (swg: number, delta: number) => {
    const current = spoolCounts[swg] ?? 0;
    const updated = Math.max(0, current + delta);
    setSpoolCounts({
      ...spoolCounts,
      [swg]: updated
    });
  };

  return [spoolCounts, setSpoolCounts, updateSpoolCount];
}

// ---------------- USE STOCK FILTER TOGGLE STORE ----------------
let cachedUseFilterRaw: string | null = null;
let cachedUseFilterVal: boolean = true;

function getUseFilterSnapshot(): boolean {
  if (typeof window === 'undefined') return true;
  try {
    const raw = localStorage.getItem(STORAGE_KEY_USE_FILTER);
    if (raw === cachedUseFilterRaw) {
      return cachedUseFilterVal;
    }
    cachedUseFilterRaw = raw;
    if (raw !== null) {
      cachedUseFilterVal = raw === 'true';
      return cachedUseFilterVal;
    }
  } catch {
    // fallback
  }
  cachedUseFilterVal = true;
  return true;
}

function getUseFilterServerSnapshot(): boolean {
  return true;
}

export function useStockFilterToggle(): [boolean, (useFilter: boolean) => void] {
  const useStockFilter = useSyncExternalStore(
    subscribe,
    getUseFilterSnapshot,
    getUseFilterServerSnapshot
  );

  const setUseStockFilter = (val: boolean) => {
    cachedUseFilterVal = val;
    cachedUseFilterRaw = String(val);
    try {
      if (typeof window !== 'undefined') {
        localStorage.setItem(STORAGE_KEY_USE_FILTER, cachedUseFilterRaw);
      }
    } catch {
      // ignore
    }
    notify();
  };

  return [useStockFilter, setUseStockFilter];
}

// ---------------- ALLOW MULTIPLE STRANDS FROM SAME SPOOL STORE ----------------
let cachedAllowMultiRaw: string | null = null;
let cachedAllowMultiVal: boolean = true;

function getAllowMultiSnapshot(): boolean {
  if (typeof window === 'undefined') return true;
  try {
    const raw = localStorage.getItem(STORAGE_KEY_ALLOW_MULTIPLE);
    if (raw === cachedAllowMultiRaw) {
      return cachedAllowMultiVal;
    }
    cachedAllowMultiRaw = raw;
    if (raw !== null) {
      cachedAllowMultiVal = raw === 'true';
      return cachedAllowMultiVal;
    }
  } catch {
    // fallback
  }
  cachedAllowMultiVal = true;
  return true;
}

function getAllowMultiServerSnapshot(): boolean {
  return true;
}

export function useAllowMultipleSameWire(): [boolean, (val: boolean) => void] {
  const allowMultiple = useSyncExternalStore(
    subscribe,
    getAllowMultiSnapshot,
    getAllowMultiServerSnapshot
  );

  const setAllowMultiple = (val: boolean) => {
    cachedAllowMultiVal = val;
    cachedAllowMultiRaw = String(val);
    try {
      if (typeof window !== 'undefined') {
        localStorage.setItem(STORAGE_KEY_ALLOW_MULTIPLE, cachedAllowMultiRaw);
      }
    } catch {
      // ignore
    }
    notify();
  };

  return [allowMultiple, setAllowMultiple];
}

// ---------------- WINDING STRATEGY STORE ----------------
let cachedStrategyRaw: string | null = null;
let cachedStrategyVal: WindingStrategy = 'smart';

function getStrategySnapshot(): WindingStrategy {
  if (typeof window === 'undefined') return 'smart';
  try {
    const raw = localStorage.getItem(STORAGE_KEY_WINDING_STRATEGY);
    if (raw === cachedStrategyRaw) {
      return cachedStrategyVal;
    }
    cachedStrategyRaw = raw;
    if (raw && ['smart', 'same_gauge', 'thicker', 'thinner', 'all'].includes(raw)) {
      cachedStrategyVal = raw as WindingStrategy;
      return cachedStrategyVal;
    }
  } catch {
    // fallback
  }
  cachedStrategyVal = 'smart';
  return 'smart';
}

function getStrategyServerSnapshot(): WindingStrategy {
  return 'smart';
}

export function useWindingStrategy(): [WindingStrategy, (val: WindingStrategy) => void] {
  const strategy = useSyncExternalStore(
    subscribe,
    getStrategySnapshot,
    getStrategyServerSnapshot
  );

  const setStrategy = (val: WindingStrategy) => {
    cachedStrategyVal = val;
    cachedStrategyRaw = val;
    try {
      if (typeof window !== 'undefined') {
        localStorage.setItem(STORAGE_KEY_WINDING_STRATEGY, cachedStrategyRaw);
      }
    } catch {
      // ignore
    }
    notify();
  };

  return [strategy, setStrategy];
}

// ---------------- FULL-SCREEN INTERSTITIAL ADS STORE ----------------
let cachedFullScreenAdsRaw: string | null = null;
let cachedFullScreenAdsVal: boolean = true; // Enabled by default, user can turn off

function getFullScreenAdsSnapshot(): boolean {
  if (typeof window === 'undefined') return true;
  try {
    const raw = localStorage.getItem(STORAGE_KEY_FULLSCREEN_ADS);
    if (raw === cachedFullScreenAdsRaw) {
      return cachedFullScreenAdsVal;
    }
    cachedFullScreenAdsRaw = raw;
    if (raw !== null) {
      cachedFullScreenAdsVal = raw === 'true';
      return cachedFullScreenAdsVal;
    }
  } catch {
    // fallback
  }
  cachedFullScreenAdsVal = true;
  return true;
}

function getFullScreenAdsServerSnapshot(): boolean {
  return true;
}

export function useFullScreenAdsEnabled(): [boolean, (val: boolean) => void] {
  const enabled = useSyncExternalStore(
    subscribe,
    getFullScreenAdsSnapshot,
    getFullScreenAdsServerSnapshot
  );

  const setEnabled = (val: boolean) => {
    cachedFullScreenAdsVal = val;
    cachedFullScreenAdsRaw = String(val);
    try {
      if (typeof window !== 'undefined') {
        localStorage.setItem(STORAGE_KEY_FULLSCREEN_ADS, cachedFullScreenAdsRaw);
      }
    } catch {
      // ignore
    }
    notify();
  };

  return [enabled, setEnabled];
}

// ---------------- FLOATING BANNER AD STORE ----------------
let cachedFloatingBannerRaw: string | null = null;
let cachedFloatingBannerVal: boolean = true;

function getFloatingBannerSnapshot(): boolean {
  if (typeof window === 'undefined') return true;
  try {
    const raw = localStorage.getItem(STORAGE_KEY_FLOATING_BANNER);
    if (raw === cachedFloatingBannerRaw) {
      return cachedFloatingBannerVal;
    }
    cachedFloatingBannerRaw = raw;
    if (raw !== null) {
      cachedFloatingBannerVal = raw === 'true';
      return cachedFloatingBannerVal;
    }
  } catch {
    // fallback
  }
  cachedFloatingBannerVal = true;
  return true;
}

function getFloatingBannerServerSnapshot(): boolean {
  return true;
}

export function useFloatingBannerEnabled(): [boolean, (val: boolean) => void] {
  const enabled = useSyncExternalStore(
    subscribe,
    getFloatingBannerSnapshot,
    getFloatingBannerServerSnapshot
  );

  const setEnabled = (val: boolean) => {
    cachedFloatingBannerVal = val;
    cachedFloatingBannerRaw = String(val);
    try {
      if (typeof window !== 'undefined') {
        localStorage.setItem(STORAGE_KEY_FLOATING_BANNER, cachedFloatingBannerRaw);
      }
    } catch {
      // ignore
    }
    notify();
  };

  return [enabled, setEnabled];
}

// ---------------- BANNER ADS STORE (ADMIN) ----------------
let cachedBannerAdsRaw: string | null = null;
let cachedBannerAdsVal: boolean = true;

function getBannerAdsSnapshot(): boolean {
  if (typeof window === 'undefined') return true;
  try {
    const raw = localStorage.getItem(STORAGE_KEY_BANNER_ADS);
    if (raw === cachedBannerAdsRaw) return cachedBannerAdsVal;
    cachedBannerAdsRaw = raw;
    if (raw !== null) {
      cachedBannerAdsVal = raw === 'true';
      return cachedBannerAdsVal;
    }
  } catch {
    // fallback
  }
  cachedBannerAdsVal = true;
  return true;
}

export function useBannerAdsEnabled(): [boolean, (val: boolean) => void] {
  const enabled = useSyncExternalStore(subscribe, getBannerAdsSnapshot, () => true);
  const setEnabled = (val: boolean) => {
    cachedBannerAdsVal = val;
    cachedBannerAdsRaw = String(val);
    try {
      if (typeof window !== 'undefined') {
        localStorage.setItem(STORAGE_KEY_BANNER_ADS, cachedBannerAdsRaw);
      }
    } catch {
      // ignore
    }
    notify();
  };
  return [enabled, setEnabled];
}

// ---------------- NATIVE ADS STORE (ADMIN) ----------------
let cachedNativeAdsRaw: string | null = null;
let cachedNativeAdsVal: boolean = true;

function getNativeAdsSnapshot(): boolean {
  if (typeof window === 'undefined') return true;
  try {
    const raw = localStorage.getItem(STORAGE_KEY_NATIVE_ADS);
    if (raw === cachedNativeAdsRaw) return cachedNativeAdsVal;
    cachedNativeAdsRaw = raw;
    if (raw !== null) {
      cachedNativeAdsVal = raw === 'true';
      return cachedNativeAdsVal;
    }
  } catch {
    // fallback
  }
  cachedNativeAdsVal = true;
  return true;
}

export function useNativeAdsEnabled(): [boolean, (val: boolean) => void] {
  const enabled = useSyncExternalStore(subscribe, getNativeAdsSnapshot, () => true);
  const setEnabled = (val: boolean) => {
    cachedNativeAdsVal = val;
    cachedNativeAdsRaw = String(val);
    try {
      if (typeof window !== 'undefined') {
        localStorage.setItem(STORAGE_KEY_NATIVE_ADS, cachedNativeAdsRaw);
      }
    } catch {
      // ignore
    }
    notify();
  };
  return [enabled, setEnabled];
}

// ---------------- RESULTS AD FREQUENCY STORE (ADMIN) ----------------
let cachedAdFrequencyRaw: string | null = null;
let cachedAdFrequencyVal: number = 3; // default every 3 options as requested

function getAdFrequencySnapshot(): number {
  if (typeof window === 'undefined') return 3;
  try {
    const raw = localStorage.getItem(STORAGE_KEY_AD_FREQUENCY);
    if (raw === cachedAdFrequencyRaw) return cachedAdFrequencyVal;
    cachedAdFrequencyRaw = raw;
    if (raw !== null) {
      const num = parseInt(raw, 10);
      if (!isNaN(num) && num >= 1 && num <= 10) {
        cachedAdFrequencyVal = num;
        return cachedAdFrequencyVal;
      }
    }
  } catch {
    // fallback
  }
  cachedAdFrequencyVal = 3;
  return 3;
}

export function useAdFrequency(): [number, (val: number) => void] {
  const frequency = useSyncExternalStore(subscribe, getAdFrequencySnapshot, () => 3);
  const setFrequency = (val: number) => {
    cachedAdFrequencyVal = val;
    cachedAdFrequencyRaw = String(val);
    try {
      if (typeof window !== 'undefined') {
        localStorage.setItem(STORAGE_KEY_AD_FREQUENCY, cachedAdFrequencyRaw);
      }
    } catch {
      // ignore
    }
    notify();
  };
  return [frequency, setFrequency];
}


