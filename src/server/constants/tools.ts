export const TOOL_DEFINITIONS = [
  {
    name: "find_patient",
    description: "Search for a patient by demographics",
    inputSchema: {
      type: "object",
      properties: {
        lastName: { type: "string" },
        firstName: { type: "string" },
        birthDate: { type: "string", description: "YYYY-MM-DD format" },
        gender: { 
          type: "string",
          enum: ["male", "female", "other", "unknown"]
        }
      },
      required: ["lastName"]
    }
  },
  {
    name: "get_patient_observations",
    description: "Get observations (vitals, labs) for a patient",
    inputSchema: {
      type: "object",
      properties: {
        patientId: { type: "string" },
        code: { type: "string", description: "LOINC or SNOMED code" },
        dateFrom: { type: "string", description: "YYYY-MM-DD" },
        dateTo: { type: "string", description: "YYYY-MM-DD" },
        status: { 
          type: "string",
          enum: ["registered", "preliminary", "final", "amended", "corrected", "cancelled"]
        }
      },
      required: ["patientId"]
    }
  },
  {
    name: "get_patient_conditions",
    description: "Get medical conditions/diagnoses for a patient",
    inputSchema: {
      type: "object",
      properties: {
        patientId: { type: "string" },
        status: { 
          type: "string",
          enum: ["active", "inactive", "resolved"]
        },
        onsetDate: { type: "string", description: "YYYY-MM-DD" }
      },
      required: ["patientId"]
    }
  },
  {
    name: "get_patient_medications",
    description: "Get medication orders for a patient",
    inputSchema: {
      type: "object",
      properties: {
        patientId: { type: "string" },
        status: {
          type: "string",
          enum: ["active", "completed", "stopped", "on-hold"]
        }
      },
      required: ["patientId"]
    }
  },
  {
    name: "get_patient_encounters",
    description: "Get healthcare encounters/visits for a patient",
    inputSchema: {
      type: "object",
      properties: {
        patientId: { type: "string" },
        status: {
          type: "string",
          enum: ["planned", "arrived", "in-progress", "finished", "cancelled"]
        },
        dateFrom: { type: "string", description: "YYYY-MM-DD" },
        dateTo: { type: "string", description: "YYYY-MM-DD" }
      },
      required: ["patientId"]
    }
  },
  {
    name: "get_patient_allergies",
    description: "Get allergies and intolerances for a patient",
    inputSchema: {
      type: "object",
      properties: {
        patientId: { type: "string" },
        status: { 
          type: "string",
          enum: ["active", "inactive", "resolved"]
        },
        type: {
          type: "string",
          enum: ["allergy", "intolerance"]
        },
        category: {
          type: "string",
          enum: ["food", "medication", "environment", "biologic"]
        }
      },
      required: ["patientId"]
    }
  },
  {
    name: "get_patient_procedures",
    description: "Get procedures performed on a patient",
    inputSchema: {
      type: "object",
      properties: {
        patientId: { type: "string" },
        status: {
          type: "string",
          enum: ["preparation", "in-progress", "completed", "entered-in-error"]
        },
        dateFrom: { type: "string", description: "YYYY-MM-DD" },
        dateTo: { type: "string", description: "YYYY-MM-DD" }
      },
      required: ["patientId"]
    }
  },
  {
    name: "get_patient_careplans",
    description: "Get care plans for a patient",
    inputSchema: {
      type: "object",
      properties: {
        patientId: { type: "string" },
        status: {
          type: "string",
          enum: ["draft", "active", "suspended", "completed", "cancelled"]
        },
        category: { type: "string" },
        dateFrom: { type: "string", description: "YYYY-MM-DD" },
        dateTo: { type: "string", description: "YYYY-MM-DD" }
      },
      required: ["patientId"]
    }
  },
  {
    name: "get_vital_signs",
    description: "Get patient's vital signs history",
    inputSchema: {
      type: "object",
      properties: {
        patientId: { type: "string" },
        timeframe: { 
          type: "string",
          description: "e.g., 3m, 6m, 1y, all"
        }
      },
      required: ["patientId"]
    }
  },
  {
    name: "get_lab_results",
    description: "Get patient's lab results",
    inputSchema: {
      type: "object",
      properties: {
        patientId: { type: "string" },
        category: { 
          type: "string",
          description: "e.g., CBC, METABOLIC, LIPIDS, ALL"
        },
        timeframe: { type: "string" }
      },
      required: ["patientId"]
    }
  },
  {
    name: "get_medications_history",
    description: "Get patient's medication history including changes",
    inputSchema: {
      type: "object",
      properties: {
        patientId: { type: "string" },
        includeDiscontinued: { type: "boolean" }
      },
      required: ["patientId"]
    }
  },
  {
    name: "get_appointments",
    description: "Get patient's Appointments",
    inputSchema: {
      type: "object",
      properties: {
        patientId: { type: "string" },
        dateFrom: { type: "string", description: "YYYY-MM-DD" },
        dateTo: { type: "string", description: "YYYY-MM-DD" }
      },
      required: ["patientId"]
    }
  },
  {
    name: 'search-pubmed',
    description: 'Search PubMed for medical literature',
    inputSchema: {
      type: 'object',
      properties: {
        query: { type: 'string' },
        maxResults: { type: 'number' }
      },
      required: ['query']
    }
  },
  {
    name: 'search-trials',
    description: 'Search ClinicalTrials.gov for relevant studies',
    inputSchema: {
      type: 'object',
      properties: {
        condition: { type: 'string' },
        location: { type: 'string' }
      },
      required: ['condition']
    }
  },
  {
    name: 'get-drug-info',
    description: 'Get Drug details by a generic name',
    inputSchema: {
      type: 'object',
      properties: {
        genericName: { type: 'string' },
      },
      required: ['genericName']
    }
  },
  {
    name: "get_patient_documents",
    description: "Get document references for a patient",
    inputSchema: {
      type: "object",
      properties: {
        patientId: { type: "string" },
        type: { type: "string", description: "Document type code" },
        category: { type: "string", description: "Document category" },
        status: { 
          type: "string",
          enum: ["current", "superseded", "entered-in-error"]
        },
        dateFrom: { type: "string", description: "YYYY-MM-DD" },
        dateTo: { type: "string", description: "YYYY-MM-DD" }
      },
      required: ["patientId"]
    }
  },
  {
    name: "get_binary_resource",
    description: "Get binary resource by ID",
    inputSchema: {
      type: "object",
      properties: {
        binaryId: { type: "string" }
      },
      required: ["binaryId"]
    }
  }
]; 