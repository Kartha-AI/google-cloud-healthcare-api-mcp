import {Telecom } from "./Helper.js"

export function formatPatientSearchResults(bundle: any) {
    if (!bundle?.entry?.length) {
        return "No patients found matching search criteria";
    }

    return bundle.entry
        .map((entry: any) => {
            if (!entry?.resource) return null;
            
            const patient = entry.resource;
            const name = patient.name?.[0] ?? {};
            const address = patient.address?.[0];
            
            return `Patient ID: ${patient.id ?? 'Unknown'}
                Name: ${name.family ?? 'Unknown'}, ${name.given?.join(' ') ?? 'Unknown'}
                DOB: ${patient.birthDate ?? 'Unknown'}
                Gender: ${patient.gender ?? 'Unknown'}
                Address: ${formatAddress(address)}
                Phone: ${patient.telecom?.find((t: Telecom) => t.system === 'phone')?.value ?? 'Not provided'}
                -----------------`;
        })
        .filter(Boolean)
        .join('\n\n');
}

export function formatVitalSigns(bundle: any) {
    if (!bundle?.entry?.length) {
        return "No vital signs recorded";
    }

    const vitalsByDate = new Map();
    
    bundle.entry.forEach((entry: any) => {
        if (!entry?.resource) return;
        
        const vital = entry.resource;
        const date = vital.effectiveDateTime?.split('T')[0] ?? 'unknown date';
        
        if (!vitalsByDate.has(date)) {
            vitalsByDate.set(date, new Map());
        }
        
        const vitalType = vital.code?.coding?.[0]?.display ?? vital.code?.text ?? 'Unknown';
        const value = vital.valueQuantity?.value != null 
            ? `${vital.valueQuantity.value} ${vital.valueQuantity.unit ?? ''}`
            : 'No value';
            
        vitalsByDate.get(date).set(vitalType, value);
    });

    return formatDateGroupedData(vitalsByDate, "vital signs");
}

export function formatLabResults(bundle: any) {
    if (!bundle?.entry?.length) {
        return "No lab results found";
    }

    const labsByPanel = new Map();
    
    bundle.entry.forEach((entry: any) => {
        if (!entry?.resource) return;
        
        const lab = entry.resource;
        const panel = lab.code?.coding?.[0]?.display ?? 'Other';
        
        if (!labsByPanel.has(panel)) {
            labsByPanel.set(panel, []);
        }
        
        labsByPanel.get(panel).push({
            date: lab.effectiveDateTime?.split('T')[0] ?? 'unknown date',
            value: lab.valueQuantity?.value ?? 'No value',
            unit: lab.valueQuantity?.unit ?? '',
            reference: lab.referenceRange?.[0] ?? null,
            interpretation: lab.interpretation?.[0]?.coding?.[0]?.code ?? null
        });
    });

    return formatPanelGroupedData(labsByPanel, "lab results");
}

// Helper functions for common formatting patterns
function formatDateGroupedData(dataMap: Map<string, any>, dataType: string): string {
    if (dataMap.size === 0) {
        return `No ${dataType} to display`;
    }

    return Array.from(dataMap.entries())
        .sort(([a], [b]) => b.localeCompare(a))
        .map(([date, items]: [string, Map<string, any>]) => {
            const itemsStr = Array.from(items.entries())
                .map(([type, value]: [string, any]) => `  ${type}: ${value}`)
                .filter(Boolean)
                .join('\n');
            return itemsStr ? `Date: ${date}\n${itemsStr}` : null;
        })
        .filter(Boolean)
        .join('\n\n');
}

function formatPanelGroupedData(dataMap: Map<string, any[]>, dataType: string): string {
    if (dataMap.size === 0) {
        return `No ${dataType} to display`;
    }

    return Array.from(dataMap.entries())
        .map(([panel, items]) => {
            if (!items?.length) return null;
            
            const itemsStr = items
                .sort((a, b) => (b.date ?? '').localeCompare(a.date ?? ''))
                .map(item => {
                    if (!item) return null;
                    return `  ${item.date}: ${item.value} ${item.unit}`;
                })
                .filter(Boolean)
                .join('\n');
                
            return itemsStr ? `${panel}:\n${itemsStr}` : null;
        })
        .filter(Boolean)
        .join('\n\n');
}

// Utility functions with null checks
export function calculateTrend(current: any, history: any[]): string {
    if (!current?.value || !history?.[1]?.value) return '';
    
    const currentValue = Number(current.value);
    const previousValue = Number(history[1].value);
    
    if (isNaN(currentValue) || isNaN(previousValue)) return '';
    
    if (currentValue === previousValue) return '→';
    if (currentValue > previousValue) return '↑';
    return '↓';
}

export function formatInterpretation(result: any): string {
    if (!result?.value || !result?.reference) return '';
    
    const value = Number(result.value);
    const low = Number(result.reference.low?.value);
    const high = Number(result.reference.high?.value);
    
    if (isNaN(value)) return '';
    
    if (!isNaN(low) && value < low) return '⚠️ Below range';
    if (!isNaN(high) && value > high) return '⚠️ Above range';
    return '✓ Normal';
}

export function formatAddress(address: any): string {
    if (!address) return 'Not provided';
    
    const parts = [
        address.line?.join(' '),
        address.city,
        address.state,
        address.postalCode
    ].filter(Boolean);
    
    return parts.length ? parts.join(', ') : 'Not provided';
} 