export declare function isAllowedAdminEmail(email: unknown, allowlist: unknown): boolean;
export declare function createAdminSession(email: string, secret: string, now?: number): string;
export declare function verifyAdminSession(token: unknown, secret: unknown, allowlist: unknown, now?: number): { email: string; exp: number } | null;
export declare const ADMIN_SESSION_TTL_SECONDS: number;
