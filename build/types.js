export function isValidFhirQueryArgs(args) {
    if (typeof args !== "object" || args === null)
        return false;
    if (typeof args.patientId !== "string" || typeof args.code !== "string") {
        return false;
    }
    if (args.dateFrom && !/^\d{4}-\d{2}-\d{2}$/.test(args.dateFrom)) {
        return false;
    }
    if (args.dateTo && !/^\d{4}-\d{2}-\d{2}$/.test(args.dateTo)) {
        return false;
    }
    return true;
}
