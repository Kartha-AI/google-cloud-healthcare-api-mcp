import fetch from 'node-fetch';
export class FDA {
    baseUrl = 'https://api.fda.gov/drug/ndc.json';
    apiKey;
    constructor(apiKey) {
        this.apiKey = apiKey;
    }
    async getDrug(args, cache) {
        const { genericName } = args;
        const cacheKey = cache.createKey('interactions', { genericName: genericName });
        const drug = await cache.getOrFetch(cacheKey, () => this.searchGenericName(genericName));
        return {
            content: [{
                    type: 'text',
                    text: JSON.stringify(drug, null, 2)
                }]
        };
    }
    async searchGenericName(genericName) {
        const url = new URL(this.baseUrl);
        url.searchParams.append('search', `generic_name:"${genericName}"`);
        const response = await fetch(url);
        const data = await response.json();
        return data.results;
    }
}
