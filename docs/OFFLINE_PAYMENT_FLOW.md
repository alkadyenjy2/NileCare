# Offline Payment Flow

Status: ARCHITECTURE READY — ACCOUNT DETAILS NOT SUPPLIED

Paymob is optional for the current MVP. The primary payment architecture must not depend on Paymob being provisioned.

## Supported MVP concept
A clinic-approved offer may specify a manual payment method such as bank transfer or Vodafone Cash when the clinic has supplied the real receiving account/number and terms.

## Evidence gate
Manual payment is not automatically considered paid.

Required evidence before the CRM can move from payment_pending to paid:
- a real transfer/receipt reference or other permitted payment evidence;
- internal verification by the authorized operator/clinic;
- an evidence identifier recorded in the payment event.

The evidence identifier is the same conceptual gate already enforced by canTransition(..., paid, { provider_evidence_id }).

## Security rule
Do not commit bank-account numbers, wallet numbers, credentials, or payment screenshots into the repository. Real payment details belong in the approved clinic commercial configuration and authorized operational environment.

## Phase 2
Paymob can be enabled later without changing the CRM state machine. Its webhook remains a separate provider-evidence adapter.