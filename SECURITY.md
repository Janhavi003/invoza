# Security

Invoza MVP is designed for local/anonymous invoice creation. No secrets are required. User-entered invoice data stays in the browser except when the browser explicitly requests PDF generation through the local app.

For production deployment, add server-side validation, authenticated persistence, rate limiting, malware scanning and content-type/size validation for uploads, CSRF protection where applicable, secure headers, and a reviewed data-retention policy.
