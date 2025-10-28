# TrustGrid — README

Welcome to **TrustGrid**, a privacy-first Consent & Audit SDK and Console. This README provides developers and designers with a high-level overview of the system, its components, setup instructions, and key design principles.

---

## Overview

**TrustGrid** enables organizations to capture explicit user consent, record immutable audit events, and visualize compliance data in an elegant, developer-friendly way. The project includes two core deliverables:

1. **TrustGrid-Lib** — an embeddable JavaScript SDK for consent capture and audit logging.
2. **TrustGrid Console** — a web-based admin interface for compliance teams to view, verify, and export audit data.

This README summarizes the concepts, architecture, and integration steps extracted from the full PRD.

---

## Key Features

* **Consent Management:** Capture granular, purpose-based user consent with configurable retention periods.
* **Immutable Audit Logs:** Append-only audit trail with cryptographic signing and hash chaining.
* **Developer SDK:** Lightweight (under 20KB gzipped), TypeScript-typed, with offline queueing and retry.
* **Compliance Console:** Searchable, filterable dashboard to monitor, verify, and export events.
* **Transparency Portal:** User-facing access history (optional feature).

---

## Components

### 1. TrustGrid-Lib (SDK)

* **Purpose:** To record consent and audit events from client apps.
* **Size:** < 20KB gzipped
* **Languages:** TypeScript, ES Modules
* **Key Methods:**

  ```ts
  TrustGrid.init({ apiBaseUrl, tenantId, hashingKey });
  TrustGrid.recordConsent(userId, purpose, granted, metadata?);
  TrustGrid.revokeConsent(userId, purpose, metadata?);
  TrustGrid.recordAccess(userId, purpose, accessedBy, dataFields?);
  ```

### 2. TrustGrid Console (Admin UI)

* **Framework:** Next.js (React, TypeScript)
* **Primary Users:** Compliance Officers, Privacy Teams
* **Main Views:**

  * Dashboard (KPIs)
  * Audit Trail Explorer
  * User Detail & Timeline View
  * Settings

### 3. Backend API (for SDK and Console)

* `/v1/events` — receive and store consent/audit events.
* `/v1/audit/{user_id}` — fetch audit logs per user.
* `/v1/transparency/{user_id}` — fetch simplified access history.

---

## Architecture Summary

**Frontend SDK → API → Immutable Ledger → Console Visualization**

```text
User Action → TrustGrid SDK → API Gateway → Ledger DB (append-only) → TrustGrid Console
```

* SDK records events securely (with hashing + HMAC).
* Backend validates, stores, and signs entries.
* Console fetches data for analysis, verification, and export.

---

## UI Design System

### Colors

| Role         | Color          | Hex     |
| ------------ | -------------- | ------- |
| Primary      | TrustGrid Teal | #0C9F9A |
| Accent       | Deep Teal      | #006B66 |
| Success      | Soft Green     | #2ECC71 |
| Warning      | Amber          | #F59E0B |
| Danger       | Red            | #EF4444 |
| Text Primary | Slate Gray     | #1F2933 |
| Background   | Warm Gray      | #F7F8F9 |

### Typography

* **Font:** Inter, system-ui, Roboto
* **Scale:** H1 28px → Body 16px → Small 14px

### Components

* Buttons (`<TGButton>`)
* Toggles (`<TGToggleswitch>`)
* Cards (`<PurposeCard>`)
* Tables (`<AuditTable>`)
* Timeline Visualizer (`<TimelineVisualizer>`)

---

## Quick Start

### 1. Install SDK

```bash
npm install @trustgrid/lib
```

### 2. Initialize

```ts
import TrustGrid from '@trustgrid/lib';
TrustGrid.init({ apiBaseUrl: 'https://api.trustgrid.ng/v1', tenantId: 'demo_fintech_001' });
```

### 3. Record Consent

```ts
TrustGrid.recordConsent('user_123', 'analytics', true, { source: 'web' });
```

### 4. View Audit Trail

Open the **TrustGrid Console**, log in as a Compliance Officer, and search for the user hash or event ID.

---

## Security & Privacy

* Pseudonymized user identifiers (hashed client-side)
* TLS enforced end-to-end
* Events cryptographically signed with HMAC and chained hashes
* Strict no-PII logging policy

---

## 📊 Metrics & Observability

| Metric                 | Target   |
| ---------------------- | -------- |
| SDK integration time   | < 1 hour |
| Event delivery success | > 99.5%  |
| Console search latency | < 1s     |
| NPS (compliance users) | > 30     |

---

## 🗓️ Roadmap Summary

* **Sprint 1:** SDK + Event API
* **Sprint 2:** Console + Audit Explorer
* **Sprint 3:** Timeline + Exports + Signature Verification
* **Launch:** Demo App (FinTech/HealthTech example)

---

## Contributing

1. Fork the repo and create a new branch.
2. Follow ESLint + Prettier guidelines.
3. Run Storybook for UI component testing.
4. Submit PR with clear description and screenshots.

---

## License

© 2025 TrustGrid Technologies — All rights reserved. Use of this SDK and Console is subject to the TrustGrid Developer License Agreement.

---

**Contact:** [engineering@trustgrid.ng](mailto:engineering@trustgrid.ng)
