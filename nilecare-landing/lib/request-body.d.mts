export declare const MAX_LEAD_BODY_BYTES: number;

export type JsonBodyResult =
  | { ok: true; value: unknown }
  | { ok: false; status: 400 | 413 };

export declare function hasJsonContentType(request: Request): boolean;

export declare function readJsonBody(
  request: Request,
  maxBytes?: number,
): Promise<JsonBodyResult>;
