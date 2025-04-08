//buuilds the Prompts for PromptHandler
import * as Helper from "./Helper.js";
export function buildPatientSummaryPrompt(data) {
    const patient = data.patient;
    const name = patient.name?.[0];
    return `Please provide a comprehensive health summary for:
            Patient: ${name?.family}, ${name?.given?.join(' ')}
            DOB: ${patient.birthDate}
            Gender: ${patient.gender}
            
            Current Conditions:
            ${Helper.formatConditions(data.conditions)}
            
            Active Medications:
            ${Helper.formatMedications(data.medications)}
            
            Allergies:
            ${Helper.formatAllergies(data.allergies)}
            
            Recent Lab Results:
            ${Helper.formatLabResults(data.recentLabs)}
            
            Immunizations:
            ${Helper.formatImmunizations(data.immunizations)}
            
            Procedures:
            ${Helper.formatProcedures(data.procedures)}
            
            Care Plans:
            ${Helper.formatCarePlans(data.carePlans)}
            
            Encounters:
            ${Helper.formatEncounters(data.encounters)}
            
            Appointments:
            ${Helper.formatAppointments(data.appointments)}
            
            Please analyze this information and provide:
            1. A summary of the patient's current health status
            2. Key health concerns that should be addressed
            3. Any patterns or trends that should be monitored
            4. Recommendations for follow-up care`;
}
export function buildMedicationReviewPrompt(data) {
    return `Please review the following medication regimen:
  
            Current Medications:
            ${Helper.formatMedications(data.medications)}
            
            Patient Allergies:
            ${Helper.formatAllergies(data.allergies)}
            
            Active Conditions:
            ${Helper.formatConditions(data.conditions)}
            
            Please analyze for:
            1. Potential drug interactions
            2. Contraindications with current conditions
            3. Possible adverse reactions based on allergies
            4. Opportunities for regimen optimization
            5. Any medications that may need monitoring or adjustment`;
}
export function buildConditionTimelinePrompt(data) {
    return `Please analyze this patient's condition timeline:

            Conditions History:
            ${Helper.formatConditions(data)}
            
            Please provide:
            1. A chronological analysis of how conditions have developed
            2. Any patterns or relationships between conditions
            3. Key milestones or significant changes in health status
            4. Recommendations for ongoing monitoring
            5. Potential preventive measures based on condition progression`;
}
export function buildLabTrendAnalysisPrompt(data) {
    return `Please analyze the following laboratory test trends:

            Patient Lab History:
            ${Helper.formatLabResults(data.labResults)}
            
            Related Conditions:
            ${Helper.formatConditions(data.conditions)}
            
            Current Medications:
            ${Helper.formatMedications(data.medications)}
            
            Please provide:
            1. Analysis of trends and patterns in lab values over time
            2. Identification of any values outside normal ranges
            3. Correlation with current conditions and medications
            4. Potential clinical implications of observed trends
            5. Recommendations for monitoring and follow-up testing`;
}
export function buildCareGapsPrompt(data) {
    return `Please analyze the following patient's care gaps:

            Patient Summary:
            ${Helper.formatPatientSummary(data)}
            
            Please provide:
            1. A list of care gaps identified in the patient's record
            2. Potential reasons for these gaps
            3. Recommendations for addressing these gaps
            4. Any additional information that would be helpful in understanding the patient's care history`;
}
export function buildPreventiveCareReviewPrompt(data) {
    return `Please analyze the following patient's preventive care:

            Patient Summary:
            ${Helper.formatPatientSummary(data)}
            
            Please provide:
            1. A list of preventive care measures identified in the patient's record
            2. Potential reasons for these gaps
            3. Recommendations for addressing these gaps
            4. Any additional information that would be helpful in understanding the patient's care history`;
}
export function buildChronicDiseaseManagementPrompt(data) {
    return `Please analyze the following patient's chronic disease management:

            Patient Summary:
            ${Helper.formatPatientSummary(data)}
            
            Please provide:
            1. A list of chronic disease management measures identified in the patient's record
            2. Potential reasons for these gaps
            3. Recommendations for addressing these gaps
            4. Any additional information that would be helpful in understanding the patient's care history`;
}
export function buildRiskAssessmentPrompt(data) {
    return `Please analyze the following patient's risk assessment:

            Patient Summary:
            ${Helper.formatPatientSummary(data)}
            
            Please provide:
            1. A list of risk factors identified in the patient's record
            2. Potential reasons for these risks
            3. Recommendations for addressing these risks
            4. Any additional information that would be helpful in understanding the patient's care history`;
}
export function buildCareCoordinationPrompt(data) {
    return `Please analyze the following patient's care coordination:

            Patient Summary:
            ${Helper.formatPatientSummary(data)}
            
            Please provide:
            1. A list of care coordination measures identified in the patient's record
            2. Potential reasons for these gaps
            3. Recommendations for addressing these gaps
            4. Any additional information that would be helpful in understanding the patient's care history`;
}
