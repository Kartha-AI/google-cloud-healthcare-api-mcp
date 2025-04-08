import { COMMON_CODES, TimeExpressions } from './constants.js';
export async function parseClinicianQuery(query) {
    query = query.toLowerCase();
    const params = {
        resourceType: 'Observation' // default
    };
    // Extract patient identifier
    const patientMatch = query.match(/patient\s+(?:id\s+)?([a-z0-9-]+)/i) ||
        query.match(/([a-z0-9-]+)'s/i);
    if (patientMatch) {
        params.patientIdentifier = patientMatch[1];
    }
    // Determine resource type and codes
    if (query.includes('blood pressure') || query.includes('bp')) {
        params.codes = [COMMON_CODES.SYSTOLIC_BP, COMMON_CODES.DIASTOLIC_BP];
    }
    else if (query.includes('temperature')) {
        params.codes = [COMMON_CODES.BODY_TEMPERATURE];
    }
    else if (query.includes('heart rate') || query.includes('pulse')) {
        params.codes = [COMMON_CODES.HEART_RATE];
    }
    else if (query.includes('weight')) {
        params.codes = [COMMON_CODES.BODY_WEIGHT];
    }
    else if (query.includes('diagnosis') || query.includes('condition')) {
        params.resourceType = 'Condition';
    }
    // Parse time expressions
    params.dateRange = parseTimeExpression(query);
    return params;
}
function parseTimeExpression(query) {
    const now = new Date();
    for (const [pattern, handler] of Object.entries(TimeExpressions)) {
        if (query.includes(pattern)) {
            return handler(now);
        }
    }
    return undefined;
}
