# Production Readiness Boundary

## What is code-complete
The repository now has a deterministic lead domain, validation boundary, API contract, CRM schema, idempotent event model, deny-by-default database access, environment contract, CI verification and a deployable landing app.

## What cannot be completed honestly without external inputs
- Brand and approved content: source assets are missing.
- Clinic commercial offer: no verified price/terms were supplied.
- WhatsApp: provider credentials and verified number are missing.
- Paymob: merchant/payment configuration is missing.
- Meta: the correct NileCare Page/Instagram identity and credentials are missing.
- Supabase: a real production project and authenticated access policy are missing.

## Webhook-first event model
`lead_events.lead_id` is nullable because provider webhooks can arrive before a CRM lead is resolved. The event remains idempotent via `(event_type, external_id)` and can be associated to a lead later.

## Operational gates
1. Verify identity before any Meta action.
2. Verify provider credentials before any WhatsApp/payment action.
3. Verify provider response/event before marking an external action successful.
4. Keep duplicate events idempotent.
5. Never replace missing source material with generated/fabricated production data.

## Definition of closed
The implementation track is closed when the repository has no remaining safe internal engineering work that depends on unavailable external inputs. Production activation is a separate provisioning step and must wait for the blockers above.
