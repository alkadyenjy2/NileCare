import {createHmac, timingSafeEqual} from "node:crypto";

const HMAC_FIELDS = [
  "amount_cents", "created_at", "currency", "error_occured", "has_parent_transaction",
  "id", "integration_id", "is_3d_secure", "is_auth", "is_capture", "is_refunded",
  "is_standalone_payment", "is_voided", "order.id", "owner", "pending",
  "source_data.pan", "source_data.sub_type", "source_data.type", "success"
];

function valueAt(payload, path) {
  let value = payload;
  for (const part of path.split(".")) {
    value = value && typeof value === "object" ? value[part] : undefined;
  }
  return value == null ? "" : String(value);
}

export function verifyPaymobHmac(payload, providedHmac) {
  const secret = process.env.PAYMOB_HMAC_SECRET;
  if (!secret || typeof providedHmac !== "string" || !payload || typeof payload !== "object" || Array.isArray(payload)) {
    return false;
  }

  const normalizedHmac = providedHmac.trim().toLowerCase();
  if (!/^[a-f0-9]{128}$/.test(normalizedHmac)) return false;

  const source = HMAC_FIELDS.map(field => valueAt(payload, field)).join("");
  const expected = createHmac("sha512", secret).update(source).digest("hex");
  const expectedBytes = Buffer.from(expected, "hex");
  const providedBytes = Buffer.from(normalizedHmac, "hex");
  return expectedBytes.length === providedBytes.length && timingSafeEqual(expectedBytes, providedBytes);
}
