// Enhanced Clinical Prompts
export const CLINICAL_PROMPTS = {
    "summarize_patient": {
        name: "summarize_patient",
        description: "Get a comprehensive summary of patient's health status",
        arguments: [
            {
                name: "patientId",
                description: "Patient's ID in the system",
                required: true
            }
        ]
    },
    "medication_review": {
        name: "medication_review",
        description: "Review patient's current medications and potential interactions",
        arguments: [
            {
                name: "patientId",
                description: "Patient's ID in the system",
                required: true
            }
        ]
    },
    "condition_timeline": {
        name: "condition_timeline",
        description: "Create a timeline of patient's conditions and diagnoses",
        arguments: [
            {
                name: "patientId",
                description: "Patient's ID in the system",
                required: true
            },
            {
                name: "timeframe",
                description: "Timeframe to analyze (e.g., '6m', '1y', 'all')",
                required: false
            }
        ]
    },
    "lab_trend_analysis": {
        name: "lab_trend_analysis",
        description: "Analyze trends in patient's lab results",
        arguments: [
            {
                name: "patientId",
                description: "Patient's ID in the system",
                required: true
            },
            {
                name: "labType",
                description: "Specific lab test to analyze (e.g., 'HbA1c', 'Lipid Panel')",
                required: false
            }
        ]
    },
    "care_gaps": {
        name: "care_gaps",
        description: "Identify potential gaps in patient's care",
        arguments: [
            {
                name: "patientId",
                description: "Patient's ID in the system",
                required: true
            }
        ]
    },
    "preventive_care_review": {
        name: "preventive_care_review",
        description: "Review preventive care status and recommendations",
        arguments: [
            {
                name: "patientId",
                description: "Patient's ID in the system",
                required: true
            }
        ]
    },
    "chronic_disease_management": {
        name: "chronic_disease_management",
        description: "Analyze management of chronic conditions",
        arguments: [
            {
                name: "patientId",
                description: "Patient's ID in the system",
                required: true
            },
            {
                name: "condition",
                description: "Specific condition to analyze (e.g., diabetes, hypertension)",
                required: false
            }
        ]
    },
    "risk_assessment": {
        name: "risk_assessment",
        description: "Assess patient's health risks based on history and demographics",
        arguments: [
            {
                name: "patientId",
                description: "Patient's ID in the system",
                required: true
            }
        ]
    },
    "care_coordination": {
        name: "care_coordination",
        description: "Review care coordination needs and specialist involvement",
        arguments: [
            {
                name: "patientId",
                description: "Patient's ID in the system",
                required: true
            }
        ]
    }
};
