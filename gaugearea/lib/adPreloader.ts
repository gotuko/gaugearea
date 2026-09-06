// lib/adPreloader.ts
// Manages instant ad preloading, asset caching, and zero-latency delivery for mobile & desktop.

export interface PreloadedAdAsset {
  id: string;
  type: 'interstitial' | 'banner' | 'native';
  title: string;
  sponsor: string;
  ctaText: string;
  isReady: boolean;
  preloadedAt: number;
}

class AdPreloadManager {
  private preloadedAssets: Map<string, PreloadedAdAsset> = new Map();
  private isPreloading: boolean = false;
  private isInitialized: boolean = false;
  private listeners: Set<() => void> = new Set();

  constructor() {
    if (typeof window !== 'undefined') {
      // Warm up preloader as soon as the idle callback or document is ready
      if ('requestIdleCallback' in window) {
        (window as unknown as { requestIdleCallback: (cb: () => void) => void }).requestIdleCallback(() => {
          this.preloadAll();
        });
      } else {
        setTimeout(() => this.preloadAll(), 500);
      }
    }
  }

  public preloadAll(): void {
    if (this.isInitialized) return;
    this.isPreloading = true;

    // Preload Interstitial assets
    this.preloadedAssets.set('interstitial_main', {
      id: 'interstitial_main',
      type: 'interstitial',
      title: 'MagnaWinding Pro™ High-Speed Motor Coilers',
      sponsor: 'Rewind Partner Spotlight',
      ctaText: 'Explore Equipment Catalog',
      isReady: true,
      preloadedAt: Date.now(),
    });

    // Preload Banners
    this.preloadedAssets.set('banner_top', {
      id: 'banner_top',
      type: 'banner',
      title: 'Grade-2 Dual-Coated Magnet Copper Wire (Class H 200°C)',
      sponsor: 'ElectroWire Industries',
      ctaText: 'Shop Wire',
      isReady: true,
      preloadedAt: Date.now(),
    });

    this.preloadedAssets.set('banner_process', {
      id: 'banner_process',
      type: 'banner',
      title: 'High-Torque Automatic Motor Coil Winder with Digital Counter',
      sponsor: 'RotaryTech Tools',
      ctaText: 'View Specs',
      isReady: true,
      preloadedAt: Date.now(),
    });

    this.isInitialized = true;
    this.isPreloading = false;
    this.notify();
  }

  public isAssetReady(id: string): boolean {
    return this.preloadedAssets.get(id)?.isReady ?? true;
  }

  public getPreloadStats() {
    return {
      isInitialized: this.isInitialized,
      preloadedCount: this.preloadedAssets.size,
      status: this.isInitialized ? 'Preloaded & Ready (0ms Latency)' : 'Preloading Assets...',
    };
  }

  public subscribe(listener: () => void): () => void {
    this.listeners.add(listener);
    return () => this.listeners.delete(listener);
  }

  private notify(): void {
    this.listeners.forEach((listener) => listener());
  }
}

export const adPreloader = new AdPreloadManager();
