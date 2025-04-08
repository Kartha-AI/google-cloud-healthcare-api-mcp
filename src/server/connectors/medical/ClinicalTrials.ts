import { CacheManager } from "../../utils/Cache.js"
import fetch from 'node-fetch';

export interface ClinicalTrial {
  nctId: string;
  title: string;
  status: string;
  phase: string;
  conditions: string[];
  locations: string[];
  lastUpdated: string;
}

interface ClinicalTrialsResponse {
  studies: ClinicalTrial[];
}

export class ClinicalTrials {
   private readonly baseUrl = 'https://clinicaltrials.gov/api/v2/studies';
   private readonly apiKey: string;
  
   constructor(apiKey: string) {
      this.apiKey = apiKey;
    }

    async getTrials(args: any, cache: CacheManager) {
        const { condition, location } = args;
        const cacheKey = cache.createKey('trials', { condition, location });
        
        const trials = await cache.getOrFetch(
          cacheKey,
          () => this.searchTrials(condition, location)
        );

        return {
          content: [{
            type: 'text',
            text: JSON.stringify(trials, null, 2)
          }]
        };
    }
  
    async searchTrials(condition: string, location?: string): Promise<ClinicalTrial[]> {
        const url = new URL(this.baseUrl);
        url.searchParams.append('query.cond', condition);
        // url.searchParams.append('fields', 'NCTId,BriefTitle,OverallStatus,Phase,Condition,LocationFacility,LastUpdatePostDate');

        const response = await fetch(url);
        const data = await response.json() as ClinicalTrialsResponse;

        return data.studies;
    }
}