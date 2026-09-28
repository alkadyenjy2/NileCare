# Production Readiness Boundary

## What is code-complete
The repository has a deterministic lead domain, validation boundary, API contract, CRM schema, idempotent event model, deny-by-default database access, environment contract, service model, offline-payment fallback, CI verification and a deployable landing app.

## What cannot be completed honestly without external inputs
- Participating clinic: a real clinic must approve its service scope, price, terms and payment details before a commercial offer is published.
- WhatsApp: provider credentials and a verified sending number are required only for automated WhatsApp.
- Meta: the correct NileCare Page/Instagram identity and credentials are required only for Meta automation/publishing.
- Brand: official logo/palette/type/assets are required before official branded publishing.
- Content: the existing 80-post bank is a real repository draft bank, but all 80 entries are `approved:false` and there are currently zero image files. They must not be promoted to approved content without source/approval evidence.
- Database: Neon is the selected production PostgreSQL provider. A real Neon project is reachable through the existing GitHub Actions credentials, and the NileCare schema was applied and verified there.

## Payment boundary
Paymob is optional for the MVP. Manual bank transfer/Vodafone Cash-style payment is supported conceptually when a participating clinic supplies real payment details and an authorized operator verifies payment evidence. The CRM must not mark `paid` without evidence.

## Webhook-first event model
`lead_events.lead_id` is nullable because provider webhooks can arrive before a CRM lead is resolved. The event remains idempotent via `(event_type, external_id)` and can be associated to a lead later.

## Operational gates
1. Verify identity before any Meta action.
2. Verify provider credentials before any automated WhatsApp action.
3. Verify provider response/event or authorized manual evidence before marking an external action successful.
4. Keep duplicate events idempotent.
5. Never replace missing source material with generated/fabricated production data.
6. Never turn drafts into approved content without real approval evidence.

## Definition of closed
The internal implementation track is closed when the repository has no remaining safe engineering work that depends on unavailable external inputs. Commercial activation remains dependent on the real clinic, channel identities/credentials where automation is desired, official brand assets, content approval, and applicable legal/commercial review.
