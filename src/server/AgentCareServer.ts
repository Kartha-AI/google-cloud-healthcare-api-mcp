import { Server } from "@modelcontextprotocol/sdk/server/index.js";
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";
import { ToolHandler } from "./handlers/ToolHandler.js"
import { FhirClient } from "./connectors/fhir/FhirClient.js"
import { PubMed } from "./connectors/medical/PubMed.js"
import { ClinicalTrials } from "./connectors/medical/ClinicalTrials.js"
import { FDA } from "./connectors/medical/FDA.js"
import { CacheManager } from "./utils/Cache.js"
import { FirebaseAuthConfig } from "./utils/FirebaseAuthConfig.js"

export class AgentCareServer {
  private mcpServer: Server;
  private toolHandler: ToolHandler;
  private fhirClient: FhirClient;
  private cache: CacheManager;
  private pubmedApi: PubMed;
  private trialsApi: ClinicalTrials;
  private fdaApi: FDA;
  
  constructor(mcpServer: Server, authConfig:FirebaseAuthConfig,fhirURL: string, pubmedAPIKey: string, trialsAPIKey: string, fdaAPIKey: string) {
    this.mcpServer = mcpServer;
    this.fhirClient = new FhirClient(fhirURL);
    this.cache = new CacheManager();
    this.pubmedApi = new PubMed(pubmedAPIKey);
    this.trialsApi = new ClinicalTrials(trialsAPIKey);
    this.fdaApi = new FDA(fdaAPIKey);
  
  
    this.toolHandler = new ToolHandler(authConfig,this.fhirClient,this.cache,this.pubmedApi,this.trialsApi,this.fdaApi);
    
    this.setupHandlers();
    this.setupErrorHandling();
  }

  private setupHandlers() {
    this.toolHandler.register(this.mcpServer);
  }

  private setupErrorHandling() {
    this.mcpServer.onerror = (error) => {
      console.error("[MCP Error]", error);
    };

    process.on("SIGINT", async () => {
      await this.mcpServer.close();
      process.exit(0);
    });
  }

  async run() {
    const transport = new StdioServerTransport();
    
    await this.mcpServer.connect(transport);
    console.error("FHIR MCP server running on stdio");
  }
} 