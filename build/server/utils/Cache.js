import NodeCache from 'node-cache';
const DEFAULT_CONFIG = {
    stdTTL: 3600,
    checkperiod: 120
};
export class CacheManager {
    cache;
    version = 'v1';
    constructor(config = {}) {
        this.cache = new NodeCache({
            ...DEFAULT_CONFIG,
            ...config
        });
    }
    createKey(toolName, params) {
        const sortedParams = Object.keys(params)
            .sort()
            .reduce((acc, key) => {
            acc[key] = params[key];
            return acc;
        }, {});
        return `${this.version}:${toolName}:${JSON.stringify(sortedParams)}`;
    }
    async cacheResponse(key, fetchFn) {
        // Implement caching logic here if needed
        return await fetchFn();
    }
    async getOrFetch(key, fetchFn, ttl) {
        try {
            const cached = this.cache.get(key);
            if (cached) {
                return cached;
            }
        }
        catch (error) {
            console.error('Cache error:', error);
        }
        try {
            const results = await fetchFn();
            this.cache.set(key, results, ttl ?? DEFAULT_CONFIG.stdTTL);
            return results;
        }
        catch (error) {
            const staleData = this.cache.get(key);
            if (staleData) {
                return {
                    ...staleData,
                    warning: "Data may be stale due to fetch error"
                };
            }
            throw error;
        }
    }
    invalidate(key) {
        this.cache.del(key);
    }
    clear() {
        this.cache.flushAll();
    }
}
