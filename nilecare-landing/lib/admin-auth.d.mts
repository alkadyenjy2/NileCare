export function isAllowedAdmin(email: unknown): boolean;
export function loginTokenMatches(candidate: unknown): boolean;
export function createSessionToken(email: unknown, now?: number): string | null;
export function verifySessionToken(token: unknown, now?: number): { email: string; issuedAt: number } | null;
