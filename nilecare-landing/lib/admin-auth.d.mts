export const ADMIN_SESSION_COOKIE: string;
export const ADMIN_SESSION_TTL_SECONDS: number;
export function adminConfigReady(env?: Record<string, string | undefined>): boolean;
export function parseAdminEmails(value: string | undefined): string[];
export function verifyAdminCredentials(email: unknown, password: unknown, env?: Record<string, string | undefined>): boolean;
export function createAdminSession(email: string, secret: string, now?: number): string;
export function verifyAdminSession(token: string | undefined, secret: string, allowedEmails: string[], now?: number): { email: string; expiresAt: number } | null;
