# NileCare Pipeline

new -> qualified -> offer_sent -> payment_pending -> paid -> case_active -> closed_lost

## Gates
- Qualified: real clinic/contact data exists.
- Offer sent: real pricing offer exists.
- Payment pending: real Paymob link exists.
- Paid: payment provider evidence exists.
- Case active: clinic assignment and WhatsApp handoff are verified.

No stage transition may be inferred from UI state alone.
