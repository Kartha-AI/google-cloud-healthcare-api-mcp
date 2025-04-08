import NodeCache from 'node-cache';

export interface CacheConfig {
  stdTTL: number;
  checkperiod: number;
}

const DEFAULT_CONFIG: CacheConfig = {
  stdTTL: 3600,
  checkperiod: 120
};

export class CacheManager {
  private cache: NodeCache;
  private readonly version: string = 'v1';

  constructor(config: Partial<CacheConfig> = {}) {
    this.cache = new NodeCache({
      ...DEFAULT_CONFIG,
      ...config
    });
  }

  createKey(toolName: string, params: Record<string, any>): string {
    const sortedParams = Object.keys(params)
      .sort()
      .reduce((acc, key) => {
        acc[key] = params[key];
        return acc;
      }, {} as Record<string, any>);

    return `${this.version}:${toolName}:${JSON.stringify(sortedParams)}`;
  }


  async cacheResponse(key: string, fetchFn: () => Promise<any>) {
    // Implement caching logic here if needed
    return await fetchFn();
  }     

  async getOrFetch<T>(
    key: string,
    fetchFn: () => Promise<T>,
    ttl?: number
  ): Promise<T> {
    try {
      const cached = this.cache.get<T>(key);
      if (cached) {
        return cached;
      }
    } catch (error) {
      console.error('Cache error:', error);
    }

    try {
      const results = await fetchFn();
      this.cache.set(key, results, ttl ?? DEFAULT_CONFIG.stdTTL);
      return results;
    } catch (error) {
      const staleData = this.cache.get<T>(key);
      if (staleData) {
        return {
          ...staleData,
          warning: "Data may be stale due to fetch error"
        } as T;
      }
      throw error;
    }
  }

  invalidate(key: string): void {
    this.cache.del(key);
  }

  clear(): void {
    this.cache.flushAll();
  }
}

