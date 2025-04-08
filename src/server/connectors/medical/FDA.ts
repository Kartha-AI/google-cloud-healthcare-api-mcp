import { CacheManager } from "../../utils/Cache.js"
import fetch from 'node-fetch';

export interface Generics {
  ndc: string;
  name: string;
  label: string;
  brand: string;
  SVGAnimatedInteger: string[];
}

interface FDAResponse {
  results: Generics[];
}

export class FDA {

   private readonly baseUrl = 'https://api.fda.gov/drug/ndc.json';
   private readonly apiKey: string;
  
   constructor(apiKey: string) {
      this.apiKey = apiKey;
    }

  async getDrug(args: any, cache: CacheManager) {
    const { genericName} = args
    const cacheKey = cache.createKey('interactions', { genericName: genericName});
    
    const drug = await cache.getOrFetch(
      cacheKey,
      () => this.searchGenericName(genericName)
    );

    return {
      content: [{
        type: 'text',
        text: JSON.stringify(drug, null, 2)
      }]
    };
  }

  async searchGenericName(genericName: string): Promise<Generics[]> {
    const url = new URL(this.baseUrl);
    url.searchParams.append('search', `generic_name:"${genericName}"`)
    
    const response = await fetch(url);
    const data = await response.json() as FDAResponse;

    return data.results;
  }
}