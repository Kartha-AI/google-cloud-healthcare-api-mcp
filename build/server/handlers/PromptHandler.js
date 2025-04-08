import { ListPromptsRequestSchema, McpError, ErrorCode, GetPromptRequestSchema } from "@modelcontextprotocol/sdk/types.js";
import { CLINICAL_PROMPTS } from "../constants/prompts.js";
import * as Prompter from "../connectors/fhir/Prompter.js";
import { Auth } from "../utils/Auth.js";
export class PromptHandler {
    server;
    fhirClient;
    cache;
    pubmedApi;
    trialsApi;
    fdaApi;
    auth;
    authInitialized = false;
    authConfig;
    constructor(authConfig, fhirClient, cache, pubmedApi, trialsApi, fdaApi) {
        this.authConfig = authConfig;
        this.cache = cache;
        this.fhirClient = fhirClient;
        this.pubmedApi = pubmedApi;
        this.trialsApi = trialsApi;
        this.fdaApi = fdaApi;
    }
    register(server) {
        this.server = server;
        server.setRequestHandler(ListPromptsRequestSchema, this.handleList);
        server.setRequestHandler(GetPromptRequestSchema, this.handleCall);
    }
    handleList = async () => ({
        prompts: Object.values(CLINICAL_PROMPTS)
    });
    handleCall = async (request) => {
        if (!request.params?.arguments?.patientId) {
            throw new McpError(ErrorCode.InvalidParams, "patientId is required");
        }
        //initalize auth if not already initialized. this will set up the callback server 
        if (!this.authInitialized) {
            this.auth = new Auth(this.authConfig);
            this.authInitialized = true;
        }
        let name = request.params.name;
        let args = request.params.arguments;
        return this.auth.executeWithAuth(async () => {
            const access_token = await this.auth.ensureValidToken();
            this.fhirClient.setAccessToken(access_token);
            switch (name) {
                case "summarize_patient":
                    const patientData = await this.fhirClient.getPatientSummaryData(args.patientId);
                    return {
                        messages: [{
                                role: "user",
                                content: {
                                    type: "text",
                                    text: Prompter.buildPatientSummaryPrompt(patientData)
                                }
                            }]
                    };
                case "condition_timeline": {
                    const conditionData = await this.fhirClient.getPatientConditionData(args.patientId, args.timeframe);
                    return {
                        messages: [{
                                role: "user",
                                content: {
                                    type: "text",
                                    text: Prompter.buildConditionTimelinePrompt(conditionData)
                                }
                            }]
                    };
                }
                case 'medication_review': {
                    const [medications, allergies, conditions] = await Promise.all([
                        this.fhirClient.search("MedicationRequest", { patient: args.patientId, status: "active" }),
                        this.fhirClient.search("AllergyIntolerance", { patient: args.patientId }),
                        this.fhirClient.search("Condition", { patient: args.patientId, status: "active" })
                    ]);
                    const data = {
                        medications,
                        allergies,
                        conditions
                    };
                    return {
                        messages: [{
                                role: "user",
                                content: {
                                    type: "text",
                                    text: Prompter.buildMedicationReviewPrompt(data)
                                }
                            }]
                    };
                }
                case "lab_trend_analysis": {
                    const [observations, conditions, medications] = await Promise.all([
                        this.fhirClient.search("Observation", {
                            patient: args.patientId,
                            category: "laboratory",
                            code: args.labType,
                            _sort: "-date"
                        }),
                        this.fhirClient.search("Condition", {
                            patient: args.patientId,
                            "status": "active"
                        }),
                        this.fhirClient.search("MedicationRequest", { patient: args.patientId, status: "active" })
                    ]);
                    const data = {
                        labResults: observations,
                        conditions: conditions,
                        medications: medications
                    };
                    return {
                        messages: [{
                                role: "user",
                                content: {
                                    type: "text",
                                    text: Prompter.buildLabTrendAnalysisPrompt(data)
                                }
                            }]
                    };
                }
                case "care_gaps": {
                    const patientData = await this.fhirClient.getPatientSummaryData(args.patientId);
                    return {
                        messages: [{
                                role: "user",
                                content: {
                                    type: "text",
                                    text: Prompter.buildCareGapsPrompt(patientData)
                                }
                            }]
                    };
                }
                case "preventive_care_review": {
                    const patientData = await this.fhirClient.getPatientSummaryData(args.patientId);
                    return {
                        messages: [{
                                role: "user",
                                content: {
                                    type: "text",
                                    text: Prompter.buildPreventiveCareReviewPrompt(patientData)
                                }
                            }]
                    };
                }
                case "chronic_disease_management": {
                    const patientData = await this.fhirClient.getPatientSummaryData(args.patientId);
                    return {
                        messages: [{
                                role: "user",
                                content: {
                                    type: "text",
                                    text: Prompter.buildChronicDiseaseManagementPrompt(patientData)
                                }
                            }]
                    };
                }
                case "risk_assessment": {
                    const patientData = await this.fhirClient.getPatientSummaryData(args.patientId);
                    return {
                        messages: [{
                                role: "user",
                                content: {
                                    type: "text",
                                    text: Prompter.buildRiskAssessmentPrompt(patientData)
                                }
                            }]
                    };
                }
                case "care_coordination": {
                    const patientData = await this.fhirClient.getPatientSummaryData(args.patientId);
                    return {
                        messages: [{
                                role: "user",
                                content: {
                                    type: "text",
                                    text: Prompter.buildCareCoordinationPrompt(patientData)
                                }
                            }]
                    };
                }
                default:
                    throw new Error(`Unknown prompt: ${name}`);
            }
        });
    };
}
