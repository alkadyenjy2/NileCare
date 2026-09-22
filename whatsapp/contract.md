# WhatsApp Integration Contract

Inbound: webhook -> signature verification -> normalize lead/message -> CRM idempotency -> response policy.

Outbound: approved message -> provider API -> provider message id -> delivery evidence -> CRM event.

Required production inputs:
- WhatsApp Business Account.
- Phone number ID.
- Access token stored outside source control.
- Webhook verification secret.

Current status: BLOCKED — no verified credentials were found.
