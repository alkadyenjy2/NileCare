# NileCare Service Model

Status: INTERNAL SERVICE DEFINITION — NOT A CLINIC OFFER

## Core service
NileCare is a clinic-coordination layer for medical-tourism and clinic-service inquiries. Its job is to organize intake, route a real inquiry to an approved clinic/service, coordinate communication, and maintain evidence-backed operational status.

This is consistent with the repository's existing scope templates: intake coordination, case routing, approved communication workflow, and payment-status handoff.

## What NileCare does
- Captures an inquiry and required contact details.
- Normalizes the inquiry into a CRM lead.
- Qualifies the request using information supplied by the patient/clinic; it does not diagnose.
- Routes the request to a verified participating clinic/service when one exists.
- Coordinates appointment/service information supplied by the clinic.
- Tracks communication and operational events with idempotency/evidence gates.
- Presents only clinic-approved commercial terms.
- Tracks payment evidence without treating a browser/link response as proof of payment.

## What NileCare does not do
- Diagnose, prescribe, or choose medical treatment.
- Guarantee clinical outcomes.
- Invent clinic names, prices, availability, testimonials, credentials, or medical claims.
- Publish a clinic offer before the clinic approves the exact scope and terms.
- Mark a lead paid without evidence.

## Commercial model to implement next
The product should support clinic-specific packages rather than a NileCare-wide medical price list.

Package structure:
1. Clinic/service identity.
2. Exact service description supplied by the clinic.
3. Price and currency supplied by the clinic.
4. Included items.
5. Excluded items.
6. Delivery/appointment timing.
7. Refund/cancellation terms.
8. Payment method(s): manual transfer/cash or an integrated processor when configured.
9. Clinic approval evidence.

No package becomes publishable until the clinic approves it.

## Launch sequence
Service definition -> participating clinic -> clinic-approved package -> communication channel -> content/brand approval -> lead acquisition -> operational tracking -> payment evidence -> case handoff.

## External context
Egypt's investment authority describes medical tourism as including organizing treatment services and bookings for patients. NileCare's implementation remains a coordination layer and should use counsel/clinic agreements for the exact legal scope before commercial launch.

## Public launch acceptance gate

The public coordination MVP must not be marked launch-ready until both of these independent evidence gates are satisfied:

- **Legal/privacy review:** a qualified reviewer has reviewed the actual service scope, privacy notice, consent language, data retention/deletion, controller/processor roles, sensitive health-data handling, cross-border processing, and any required registrations/licences. Record the approved review reference; never set the environment flag as a placeholder.
- **Participating clinic:** at least one real clinic has approved a written service scope and terms. Record the signed agreement reference; do not imply clinic coverage, availability, or prices before approval.

The readiness endpoint enforces these gates with `NILECARE_LEGAL_REVIEW_APPROVED=true` plus `NILECARE_LEGAL_REVIEW_REFERENCE`, and `NILECARE_CLINIC_PARTNER_APPROVED=true` plus `NILECARE_CLINIC_PARTNER_REFERENCE`. All four values must be backed by real evidence. Missing evidence means `mvp_launch_ready=false`.

These environment flags are evidence references, not substitutes for the actual approvals. Keep commercial offers disabled until a clinic-specific package is approved. This document is an operational checklist, not legal advice.
