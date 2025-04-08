import fetch from 'node-fetch';
export class PubMed {
    baseUrl = 'https://eutils.ncbi.nlm.nih.gov/entrez/eutils';
    apiKey;
    constructor(apiKey) {
        this.apiKey = apiKey;
    }
    async getArticles(args, cache) {
        const { query, maxResults } = args;
        const cacheKey = cache.createKey('pubmed', { query, maxResults });
        const articles = await cache.getOrFetch(cacheKey, () => this.searchArticles(query, maxResults));
        return {
            content: [{
                    type: 'text',
                    text: JSON.stringify(articles, null, 2)
                }]
        };
    }
    async searchArticles(query, maxResults = 10) {
        // Search for article IDs
        const searchUrl = new URL(`${this.baseUrl}/esearch.fcgi`);
        searchUrl.searchParams.append('db', 'pubmed');
        searchUrl.searchParams.append('term', query);
        searchUrl.searchParams.append('retmax', maxResults.toString());
        searchUrl.searchParams.append('retmode', 'json');
        searchUrl.searchParams.append('api_key', this.apiKey);
        const searchResponse = await fetch(searchUrl);
        const searchData = await searchResponse.json();
        const pmids = searchData.esearchresult.idlist;
        if (!pmids.length) {
            return [];
        }
        // Get article details
        const summaryUrl = new URL(`${this.baseUrl}/esummary.fcgi`);
        summaryUrl.searchParams.append('db', 'pubmed');
        summaryUrl.searchParams.append('id', pmids.join(','));
        summaryUrl.searchParams.append('retmode', 'json');
        summaryUrl.searchParams.append('api_key', this.apiKey);
        const summaryResponse = await fetch(summaryUrl);
        const summaryData = await summaryResponse.json();
        return pmids.map((pmid) => {
            const article = summaryData.result[pmid];
            return {
                title: article.title,
                authors: article.authors.map((a) => a.name),
                journal: article.fulljournalname,
                pubDate: article.pubdate,
                doi: article.elocationid,
                abstract: article.abstract,
                pmid: pmid
            };
        });
    }
}
