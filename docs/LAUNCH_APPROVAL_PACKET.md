# NileCare — Legal Review & Clinic Participation Packet

**Status: DRAFT FOR QUALIFIED EGYPTIAN COUNSEL AND A REAL PARTICIPATING CLINIC. NOT APPROVED FOR SIGNATURE OR PUBLIC LAUNCH.**

Purpose: make the remaining launch gates concrete without inventing legal approval, clinic participation, prices, credentials, or service availability.

## A. Counsel review checklist

Counsel should review the actual deployed service, data flows, hosting regions, vendor terms, privacy notice, consent copy, and operational roles—not this document alone.

- [ ] Confirm the correct legal entity, business activity, registration/licensing requirements, and whether the intended clinic-coordination / medical-tourism scope needs approvals beyond ordinary company setup.
- [ ] Review Egypt Personal Data Protection Law No. 151/2020 and Minister of Communications and Information Technology Decision No. 816/2025 (Executive Regulations); confirm applicable licensing/permit, controller/processor, DPO, registration, breach-response, and compliance-transition obligations for NileCare's actual role.
- [ ] Decide whether NileCare collects health/sensitive data at all. Default to contact details and a high-level service category only; do not ask for diagnoses, records, IDs, passports, or clinical attachments in the initial form.
- [ ] Document controller/processor roles for NileCare, each clinic, hosting/database providers, email/communication providers, and any AI provider.
- [ ] Review cross-border storage/access/transfer, subprocessors, retention/deletion, data-subject requests, access controls, audit logs, incident response, and the breach escalation timeline.
- [ ] Approve the privacy notice and explicit consent wording, including purpose, recipients, contact point, withdrawal, retention, and any transfer/third-party disclosures that apply.
- [ ] Review consumer protection, online contracting, cancellation/refunds, marketing claims, disclaimers, accessibility, complaints, and the boundary between coordination and regulated medical services.
- [ ] Confirm that public copy does not claim medical advice, guaranteed outcomes, clinic affiliation, availability, credentials, or prices unless supported by current evidence.
- [ ] Provide a written review reference and date; do not mark the gate approved until the actual review is complete.

## B. Clinic participation agreement — discussion draft

**This is a term sheet/template for counsel to convert into an appropriate agreement. Do not present it as a signed or legally sufficient contract.**

### Parties
- Coordinator: NileCare legal entity/name: ____________________
- Participating clinic legal name: ____________________
- Registration/licence details verified by: ____________________
- Authorized signatories and authority evidence: ____________________

### Approved scope
- Clinic-approved services and exclusions (attach Schedule 1): ____________________
- Clinic locations and service coverage: ____________________
- Appointment/availability information owner and update cadence: ____________________
- Clinic contact/escalation owner and operating hours: ____________________
- NileCare's role is limited to inquiry intake, routing, and coordination. The clinic alone provides medical assessment, diagnosis, treatment, clinical advice, and clinical records.

### Commercial terms (must be completed by the clinic)
- Price, currency, taxes, and any coordination fee: ____________________
- Included and excluded items: ____________________
- Quote validity and conditions: ____________________
- Cancellation, refund, rescheduling, no-show, and dispute terms: ____________________
- Approved payment recipient/method and proof-of-payment procedure: ____________________
- Marketing claims, logos, photos, and use of clinic name authorized: ____________________

### Data and communications
- Specify the lawful purpose, categories of data, controller/processor roles, permitted recipients, security, retention/deletion, data-subject requests, incident escalation, and any cross-border processing in a counsel-approved data schedule.
- Clinic must not receive leads until the patient has been given the approved notice and the required consent has been captured.
- No clinical files, diagnoses, treatment recommendations, or sensitive health details should be exchanged through NileCare unless counsel and the clinic explicitly approve the workflow and controls.
- WhatsApp/Meta messaging and marketing remain disabled until the responsible entity, account identity, consent basis, approved message templates, and credentials are verified.

### Governance and risk allocation
- Each party's service responsibilities, professional/clinical responsibility, insurance, complaints handling, confidentiality, intellectual property, and liability allocation: ____________________
- Term, termination, post-termination handling of active inquiries/data, governing law, dispute resolution, and notices: ____________________
- Attach the approved privacy notice, consent text, commercial schedule, and security/data-processing schedule.

### Evidence required before the launch gate can be enabled
- [ ] Signed agreement or written approval from authorized clinic representative.
- [ ] Clinic identity/licence and signatory authority checked.
- [ ] Clinic-approved service scope and commercial schedule completed.
- [ ] Privacy/data-sharing schedule approved by counsel and clinic.
- [ ] Exact approved agreement reference recorded in the authorized secret/configuration system (not in public source control).

## C. Release controls

- Keep `NILECARE_LEGAL_REVIEW_APPROVED=false` until counsel has completed the review and a real review reference exists.
- Keep `NILECARE_CLINIC_PARTNER_APPROVED=false` until a real clinic has approved and signed the relevant scope/terms and a reference exists.
- The readiness gate must require both approvals and references; environment flags are evidence pointers, not substitutes for the underlying approvals.
- Keep clinic offers unpublished until a clinic-specific offer is approved. Keep Paymob optional and WhatsApp/Meta inactive until their separate identity, consent, and credential gates pass.
- Never store patient information, signatures, account credentials, secret values, bank/wallet details, or signed contracts containing personal data in public source control.

## D. Primary references for counsel

- Egypt Personal Data Protection Law No. 151/2020 — Ministry of Communications and Information Technology: https://mcit.gov.eg/Upcont/Documents/Reports%20and%20Documents_1232021000_Law_No_151_2020_Personal_Data_Protection.pdf
- Executive Regulations, Decision No. 816/2025 — Personal Data Protection Center: https://pdpc.gov.eg/assets/pdf-data/Executive%20Regulation.pdf
- GAFI/Invest in Egypt — medical-tourism activity reference (counsel to confirm applicability): https://www.investinegypt.gov.eg/Fact%20Sheets/Prime%20Minister%20Decree%20No.104%20of%202022.pdf
- Recent independent legal commentary on the Executive Regulations (secondary source; not a substitute for the official text): https://reglibegy.eipr.org/en/publications/executive-regulations-personal-data-protection-law-assessing-translation-general-rules

**No approval is implied by the existence of this packet.**