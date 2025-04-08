export const COMMON_CODES = {
    // Vital Signs
    SYSTOLIC_BP: '8480-6',
    DIASTOLIC_BP: '8462-4',
    HEART_RATE: '8867-4',
    BODY_TEMPERATURE: '8310-5',
    RESPIRATORY_RATE: '9279-1',
    BODY_WEIGHT: '29463-7',
    HEIGHT: '8302-2',
    BMI: '39156-5',
    OXYGEN_SATURATION: '59408-5',
    // Lab Tests
    GLUCOSE: '2339-0',
    HBA1C: '4548-4',
    // Categories
    VITAL_SIGNS: 'vital-signs',
    LABORATORY: 'laboratory'
};
export const TimeExpressions = {
    'last month': (now) => ({
        start: new Date(now.getFullYear(), now.getMonth() - 1, 1).toISOString().split('T')[0],
        end: new Date(now.getFullYear(), now.getMonth(), 0).toISOString().split('T')[0]
    }),
    'last week': (now) => ({
        start: new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
        end: now.toISOString().split('T')[0]
    }),
    'last year': (now) => ({
        start: new Date(now.getFullYear() - 1, now.getMonth(), now.getDate()).toISOString().split('T')[0],
        end: now.toISOString().split('T')[0]
    })
};
