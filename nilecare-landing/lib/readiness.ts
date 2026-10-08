import { timingSafeEqual } from "node:crypto";

const required: Record<string, string[]> = {
  whatsapp: ["WABA_ID", "PHONE_NUMBER_ID", "WHATSAPP_ACCESS_TOKEN", "WHATSAPP_APP_SECRET"],
  meta: ["META_PAGE_ID", "META_PAGE_ACCESS_TOKEN", "META_GRAPH_VERSION"],
};

function present(name: string) {
  const value = process.env[name];
  return typeof value === "string" && value.trim().length > 0 && value !== "[SENSITIVE]";
}

function auth(request: Request) {
  const expected = process.env.NILECARE_WEBHOOK_SECRET;
  const provided = request.headers.get("x-nilecare-internal-secret");
  if (!expected || !provided) return false;
  const a = Buffer.from(expected), b = Buffer.from(provided);
  return a.length === b.length && timingSafeEqual(a, b);
}

export function productionReadiness(request: Request) {
  if (!auth(request)) return { status: 401, body: { ok: false, status: "UNAUTHORIZED" } };

  const providers = Object.fromEntries(Object.entries(required).map(([provider, keys]) => {
    const missing = keys.filter((key) => !present(key));
    return [provider, { ready: missing.length === 0, required: true, missing }];
  }));

  const persistenceReady = present("DATABASE_URL");
  const webhookReady = present("NILECARE_WEBHOOK_SECRET");
  const contentReady = false;
  const brandReady = false;
  const offerReady = false;
  const mvpLaunchReady = persistenceReady && webhookReady;

  return {
    status: 200,
    body: {
      ok: true,
      status: "READINESS_REPORT",
      mvp_launch_ready: mvpLaunchReady,
      launch_mode: "ZERO_COST_MVP",
      persistence: { ready: persistenceReady, missing: persistenceReady ? [] : ["DATABASE_URL"] },
      webhook: { ready: webhookReady, missing: webhookReady ? [] : ["NILECARE_WEBHOOK_SECRET"] },
      payment: {
        ready: false,
        mode: "MANUAL_PAYMENT_READY",
        paymob: { required: false, ready: false, status: "OPTIONAL_PHASE_2" },
        manual: { ready: true, evidence_required_before_paid: true },
      },
      providers,
      commercial_offer: { ready: offerReady, required_for_mvp_launch: false, status: "OPTIONAL_FOR_MVP", note: "Required only before representing a specific clinic offer or collecting clinic-linked commercial payment." },
      brand: { ready: brandReady, required_for_mvp_launch: false, status: "OPTIONAL_FOR_MVP", note: "Current neutral treatment may be used until official brand assets are approved." },
      content: { ready: contentReady, required_for_mvp_launch: false, status: "OPTIONAL_FOR_MVP", required_approved_posts: 80 },
    },
  };
}
