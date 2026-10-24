export function buildNeonSqlEndpoint(connectionString: string): string;
export function mapNeonLeadRows(result: { fields?: { name: string }[]; rows?: unknown[][] }): Record<string, unknown>[];
