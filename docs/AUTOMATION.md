# Automation Boundary

## Lead intake
Landing/Meta/WhatsApp -> validate -> normalize -> idempotency -> leads -> lead_events.

## Offer
Qualified lead -> clinic offer exists -> send approved offer -> record event.

## Payment
Offer accepted -> real Paymob link exists -> send link -> wait for provider webhook -> payment_events -> mark paid.

## Handoff
Paid -> assign clinic/case -> WhatsApp operational thread -> case_active.

## Hard stops
- Missing verified Meta identity: STOP.
- Missing WhatsApp credentials: STOP outbound.
- Missing Paymob link: STOP payment flow.
- Missing clinic pricing: STOP offer flow.
- Duplicate external event: ignore safely.

No automation may manufacture success state from a UI callback.
