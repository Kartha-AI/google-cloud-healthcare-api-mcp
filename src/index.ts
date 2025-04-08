#!/usr/bin/env node
import dotenv from "dotenv";
import { AgentCareServer } from "./server/AgentCareServer.js";
import { Server } from "@modelcontextprotocol/sdk/server/index.js";
import { FirebaseAuthConfig } from "./server/utils/FirebaseAuthConfig.js";

dotenv.config();

const authConfig:FirebaseAuthConfig = {
  apiKey: process.env.FIREBASE_API_KEY!,
  authDomain: process.env.FIREBASE_AUTH_DOMAIN!,
  projectId: process.env.FIREBASE_PROJECT_ID!,
  storageBucket: process.env.FIREBASE_STORAGE_BUCKET!,
  messagingSenderId: process.env.FIREBASE_MESSAGING_SENDER_ID!,
  appId: process.env.FIREBASE_APP_ID!,
  measurementId: process.env.FIREBASE_MEASUREMENT_ID!,
  callbackPort: process.env.FIREBASE_AUTH_CALLBACK_PORT!
}

const FHIR_BASE_URL = process.env.FHIR_BASE_URL!
const PUBMED_API_KEY = process.env.PUBMED_API_KEY!
const TRIALS_API_KEY = process.env.CLINICAL_TRIALS_API_KEY!
const FDA_API_KEY = process.env.FDA_API_KEY!

if (!FHIR_BASE_URL) {
  throw new Error("FHIR_BASE_URL is missing");
}

if (!PUBMED_API_KEY) {
  throw new Error("PUBMED_API_KEY is missing");
}

if (!TRIALS_API_KEY) {
  throw new Error("TRIALS_API_KEY is missing");
}

if (!FDA_API_KEY) {
  throw new Error("FDA_API_KEY is missing");
}

let mcpServer: Server = new Server(
  { 
    name: "agent-care-mcp-server", 
    version: "0.1.0" 
  },
  { 
    capabilities: { 
        resources: {}, 
        tools: {}, 
        prompts: {} ,
        logging: {}
      } 
  }
);

const agentCareServer = new AgentCareServer(mcpServer,authConfig,FHIR_BASE_URL, PUBMED_API_KEY, TRIALS_API_KEY, FDA_API_KEY);
agentCareServer.run().catch(console.error); 
