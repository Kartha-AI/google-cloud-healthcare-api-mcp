import fetch from 'node-fetch';
export class ClinicalTrials {
    baseUrl = 'https://clinicaltrials.gov/api/v2/studies';
    apiKey;
    constructor(apiKey) {
        this.apiKey = apiKey;
    }
    async getTrials(args, cache) {
        const { condition, location } = args;
        const cacheKey = cache.createKey('trials', { condition, location });
        const trials = await cache.getOrFetch(cacheKey, () => this.searchTrials(condition, location));
        return {
            content: [{
                    type: 'text',
                    text: JSON.stringify(trials, null, 2)
                }]
        };
    }
    async searchTrials(condition, location) {
        const url = new URL(this.baseUrl);
        url.searchParams.append('query.cond', condition);
        // url.searchParams.append('fields', 'NCTId,BriefTitle,OverallStatus,Phase,Condition,LocationFacility,LastUpdatePostDate');
        const response = await fetch(url);
        const data = await response.json();
        return data.studies;
    }
}
