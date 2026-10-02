# ONE-SHOT APP BUILDER — NILECARE

Canonical repo: alkadyenjy2/NileCare
Do not create a duplicate NileCare application or replacement CRM/database.

PRODUCT
Cross-border medical-travel coordination only:
Inquiry → Qualification → Clinic Routing → Clinic-approved Service/Appointment Coordination → Payment Evidence → Operational Handoff.

BOUNDARY
No diagnosis, prescriptions, medical guarantees, invented clinics, invented prices, availability, testimonials, credentials, or fake payment/provider evidence.

ARCHITECTURE
Preserve Next.js/TypeScript implementation and Neon as the default production persistence provider. Supabase is legacy-compatible only when explicitly selected. Paymob is optional for MVP. Preserve WhatsApp/Meta verification and idempotency boundaries.

AGENTS / ROLES
Intake; qualification; clinic routing; communication/operations; payment evidence; content/brand/legal gates.

CURRENT STATE
Repository-side engineering track is closed. The remaining production gate is a real participating clinic with approved commercial/legal scope and, only if needed, real provider credentials/assets.

BUILDER RULE
Inspect the existing repo first. Only fix concrete build/runtime defects supported by fresh evidence. Do not invent clinic data or provider receipts. Do not replace Neon or add a second orchestration system. Keep manual payment valid only when the clinic supplies real terms and an authorized operator verifies payment evidence. Run the existing typecheck/test/build/self-check workflow.

FINAL REPORT
Exact commit, tests/build/self-check, changed files, provider configuration state, business gate, and UNVERIFIED items.
