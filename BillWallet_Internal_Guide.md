# BillWallet® — Internal Knowledge Guide
### For Paymentus Employees: Understanding BillWallet® and Its Impact on One-Time Payments & AutoPay

**Audience:** All Paymentus internal teams (Sales, Engineering, Implementation, Support, Product, Marketing)
**Classification:** Internal Use Only

---

## 1. What Is BillWallet®?

BillWallet® is Paymentus' **patented, AI-native digital identity and payment wallet** designed specifically for bill and service payments. It is a product layer that sits on top of our Intelligent Payment Platform (IPP) and the Instant Payment Network (IPN) microservices stack.

### In Simple Terms

Think of BillWallet® as a **"fast pass" for bill payments**. Instead of consumers remembering a username, password, and account number for every biller they pay, they register once with an email, get a verified BillWallet® ID, and use that single ID to pay any bill on any channel — forever.

### What BillWallet® Is NOT

- It is **not a replacement** for the core IPP platform or biller portals
- It is **not a retail wallet** like Apple Pay or Google Pay (those are for one-off purchases)
- It is **not a mobile app** consumers need to download (it works within existing channels)
- It is **not optional security** — it's a fundamentally different (and better) authentication model

---

## 2. The Architecture (How It Fits Together)

```
┌─────────────────────────────────────────────────────────────────┐
│                    CONSUMER TOUCHPOINTS                          │
│  Web Portal │ Mobile │ IVR │ Voice │ Agent │ Email/SMS │ Kiosk  │
└──────────────────────────────┬──────────────────────────────────┘
                               │
                    ┌──────────▼──────────┐
                    │   BillWallet® Layer  │  ← Identity + Wallet
                    │   (IPN Microservices)│
                    └──────────┬──────────┘
                               │
          ┌────────────────────┼────────────────────┐
          │                    │                    │
   ┌──────▼──────┐    ┌───────▼──────┐    ┌───────▼───────┐
   │ identity-ms │    │  wallet-ms   │    │  payment-ms   │
   │ (User ID &  │    │ (Accounts &  │    │ (Process pay  │
   │  verification)   │  methods)    │    │  via XOTP)    │
   └─────────────┘    └──────────────┘    └───────────────┘
          │                    │                    │
   ┌──────▼────────────────────▼────────────────────▼──────┐
   │          Paymentus IPP / Core Platform                 │
   │   (Billing, Posting, Reconciliation, 450+ CIS)        │
   └───────────────────────────────────────────────────────┘
```

### Key Internal Components

| Service | What It Does |
|---------|-------------|
| `bill-wallet-ms` | Main BillWallet backend microservice |
| `identity-ms` | Manages consumer identity verification and BillWallet ID |
| `wallet-ms` | Stores linked accounts and payment methods |
| `payment-ms` | Processes payments via XOTP |
| `bill-wallet-config-ms` | Manages biller-specific BillWallet configuration |
| `bill-wallet-app-manager-ms` | Manages BillWallet app instances |
| `bill-wallet-invites-ms` | Handles invitation flows for new BillWallet users |
| `bill-wallet-sdk-renderer-ms` | Renders BillWallet widget for embedded deployments |
| `lib-blwt-internal` | Shared internal library (middleware, constants, utilities) |
| `lib-bill-wallet-config-client` | Client library for config service integration |
| `blwt-ui-core` | Shared UI components for all BillWallet front-end apps |

### Channels (Internal Codes)

| Channel Code | Meaning |
|-------------|---------|
| `BW_CP` | BillWallet Consumer Portal |
| `BW_EXT` | BillWallet External Widget |
| `BW_IVR` | BillWallet IVR Flow |
| `BW_PORTAL` | BillWallet Standalone Portal |
| `BW_ROTP` | BillWallet Real-time One-Time Payment |
| `BW_INVITE` | BillWallet Invitation Flow |
| `BW_AD` | BillWallet Agent Desktop |
| `BW_VOICEASSISTANT` | BillWallet Voice Assistant |

### App Codes

| App Code | Context |
|----------|---------|
| `consumer-widget` | Embedded widget for biller sites |
| `agent-widget` | Agent-facing widget |
| `portal` | Standalone BillWallet portal |
| `invite` | Invitation onboarding flow |
| `mobile-ios` | iOS native app |
| `mobile-android` | Android native app |

---

## 3. Why BillWallet® Is Better: The Core Argument

### The Fundamental Insight

The #1 reason consumers don't pay bills on time online is **not** that they don't want to — it's that they **can't get past authentication**. Traditional portals require:
- Remembering which email they used to register
- Remembering a password (or doing a reset flow)
- Knowing their account number
- Re-entering payment card details

**BillWallet® eliminates all of this.** After a one-time email-based registration, the consumer's BillWallet® ID is their permanent key to all linked billers.

---

## 4. BillWallet® vs. Core Platform for One-Time Payments

This is the most important section for understanding BillWallet's impact. **One-time (guest) payments represent ~60% of all biller payments today.** These are the least efficient, most expensive, and most abandonment-prone payments.

### The One-Time Payment Problem (Core Platform)

On the traditional Paymentus ROTP (Real-time One-Time Payment) flow:

1. Consumer arrives at biller payment page
2. Must enter account number (from paper bill or memory)
3. Must enter identifying info (name, address, last 4 SSN, etc.)
4. Must enter full payment method details (card number, expiry, CVV)
5. Review and submit
6. **None of this is remembered next month** — they do it all again

**Pain points:**
- **High friction** → High abandonment
- **No stored relationship** → Cannot upsell AutoPay
- **Error-prone** → Wrong account numbers cause mispostings
- **Expensive** → Every failed attempt may generate a support call
- **Security exposure** → Full card details typed every session

### The BillWallet® One-Time Payment (Revolutionary Difference)

**First-time BillWallet® user (initial setup):**
1. Consumer enters email
2. Gets verified → receives BillWallet® ID
3. Links account + payment method (one time)
4. Pays

**Every subsequent "one-time" payment:**
1. Consumer confirms BillWallet® ID (email verification)
2. Sees linked bills with amounts due
3. Confirms payment
4. **Done in under 30 seconds**

### Side-by-Side Comparison

| Dimension | Core ROTP | BillWallet® |
|-----------|-----------|-------------|
| Steps to pay (returning user) | 5–7 | 2–3 |
| Account number required | Every time | Never (after linking) |
| Card details required | Every time | Never (after linking) |
| Password required | N/A (guest) or Yes (registered) | Never |
| Time to complete | 2–5 minutes | Under 30 seconds |
| Data stored for next visit | Nothing | Everything (securely) |
| Path to AutoPay | None (no relationship) | Direct (already linked) |
| Security model | Data-in-transit only | Tokenized + verified identity |

### Why This Matters for Billers

> **Every ROTP payment that becomes a BillWallet® payment is a consumer you'll never lose to login friction again.**

The one-time payer goes from being your most expensive, least reliable revenue source to being a **digitally connected, recurring relationship** — without them even setting up AutoPay yet.

---

## 5. BillWallet® and AutoPay: The Conversion Engine

### The AutoPay Enrollment Problem Today

Even on the Paymentus platform, AutoPay enrollment requires:
1. Creating an account (username/password)
2. Logging in
3. Adding payment method
4. Navigating to AutoPay settings
5. Selecting payment method, date, amount rules
6. Confirming

**Barriers:**
- Consumers don't trust "yet another site" with stored payment info
- Too many steps from "I just want to pay" to "set up autopay"
- Once they leave without enrolling, they rarely come back to do it

### How BillWallet® Solves AutoPay Conversion

**The key insight:** BillWallet® users have *already stored their payment method and linked their biller account*. The hardest parts of AutoPay enrollment are already done.

**AutoPay enrollment with BillWallet®:**
1. After a successful BillWallet® payment: "Would you like to turn on AutoPay for this bill?"
2. Consumer toggles ON
3. Done

**That's it.** No additional registration. No additional payment method entry. No trust barrier (they already trust BillWallet® with their data).

### The BillWallet® → AutoPay Funnel

```
TRADITIONAL FUNNEL:                    BILLWALLET® FUNNEL:
                                      
Guest Pay ──────── (dead end)          Guest Pay
     │                                      │
     ▼                                      ▼
Register Account (high friction)       BillWallet® Registration (low friction)
     │  ← 80% drop off                     │  ← email only, 60 seconds
     ▼                                      ▼
Add Payment Method                     Pay (method already linked)
     │                                      │
     ▼                                      ▼
Navigate to AutoPay Settings           "Turn on AutoPay?" → Toggle ON
     │  ← another drop-off                 │  ← single click
     ▼                                      ▼
Configure AutoPay                      AutoPay Active ✓
     │
     ▼
AutoPay Active ✓
```

### Internal Metrics to Track

When positioning BillWallet® impact on AutoPay, these are the conversion points:

1. **BillWallet® Registration Rate** — What % of one-time payers register for BillWallet®?
2. **BillWallet® Return Rate** — What % of registered users use BillWallet® for their next payment?
3. **BillWallet® → AutoPay Conversion** — What % of active BillWallet® users enable AutoPay?
4. **AutoPay Retention** — Do BillWallet® AutoPay users retain longer than traditional AutoPay users?

---

## 6. Security: Why BillWallet® Is More Secure Than Traditional Methods

### Both BillWallet® and Core Platform share:
- PCI DSS Level 1 certification
- SOC 1 / SOC 2 compliance
- HIPAA compliance (where applicable)
- Encryption in transit and at rest
- Fraud detection systems

### BillWallet® adds these security layers:

| Security Feature | How It Works | Why It's Better |
|-----------------|--------------|-----------------|
| **Passwordless by design** | No passwords stored, no passwords transmitted | Eliminates credential stuffing, phishing, brute force attacks |
| **Verified identity** | Identity is proofed before BillWallet® ID issuance | Harder to create fraudulent accounts vs. self-registration |
| **Issuer isolation** | `validateBillWalletIssuer` middleware rejects any request not from verified BLWT issuer | Cross-tenant data leakage is architecturally impossible |
| **Dedicated PII masking** | `sanitizeBillWalletInvite()` masks names, emails, phones, account numbers, CVVs in logs | Even internal systems cannot accidentally expose customer data |
| **Session-scoped headers** | `x-session-id`, `x-user-identity`, `x-bw-app-code` propagated on every request | Full audit trail with cryptographic session binding |
| **XOTP protection** | Payment processing goes through XOTP (one-time payment token) | Payment credentials never travel in reusable form |
| **JWT scope enforcement** | UI and API enforce granular scopes (`hasScope`, `jwtHasScope`) | Least-privilege access at every layer |
| **SecureService™** | Patented end-to-end framework for all interactions | Even agent/IVR channels maintain full encryption |
| **Sentry PII allow-lists** | Only approved, non-sensitive fields are sent to error monitoring | No accidental PII in observability tools |

### The Elevator Pitch on Security

> "Traditional portals protect data with passwords. BillWallet® protects data by never needing passwords in the first place. You can't steal what doesn't exist."

---

## 7. Talking Points by Audience

### For Sales (talking to biller executives)

- "80% of bill payments are abandoned at login. BillWallet® eliminates login entirely."
- "Your one-time payers are your most expensive customers. BillWallet® converts them to digital relationships at near-zero friction."
- "BillWallet® users are 4x more likely to complete payment and significantly more likely to enroll in AutoPay."
- "It's passwordless AND PCI Level 1. More convenient AND more secure."
- "It's patented — your competitors cannot offer this."

### For Implementation (talking to biller technical teams)

- "BillWallet® deploys as a widget, hosted page, or API — no changes to your CIS."
- "If you're already on IPP, BillWallet® is an activation, not a migration."
- "The BillWallet® microservices (identity-ms, wallet-ms, payment-ms) run on the same IPN stack you already trust."
- "Configuration is per-biller via bill-wallet-config-ms — no code changes needed for customization."

### For Support (talking to consumers or biller agents)

- "BillWallet® is a free, fast way to pay bills using just your email."
- "You never need to remember a password or account number again."
- "Your payment information is encrypted and secured at the highest banking standard (PCI Level 1)."
- "If a customer calls about login issues, this is the ideal time to suggest BillWallet® registration."

### For Product/Engineering (understanding the architecture)

- "BillWallet® is the identity + wallet layer on IPN. Core platform handles billing/posting/reconciliation below it."
- "The `BLWT` issuer enforcement ensures BillWallet® services can never accidentally access non-BillWallet data."
- "XOTP tokens mean we never store or transmit reusable payment credentials in the BillWallet® layer."
- "Every channel (BW_CP, BW_IVR, BW_PORTAL, etc.) uses the same identity-ms verification — no channel has weaker auth."

---

## 8. Common Internal Questions (FAQ)

**Q: Does BillWallet® replace the Customer Portal (CP)?**
A: No. CP is the full-featured registered portal with bill history, usage details, payment plans, etc. BillWallet® is the fast-pay identity layer. A consumer can use BillWallet® to authenticate INTO the CP, or use BillWallet® standalone for quick payments.

**Q: Does BillWallet® replace ROTP (guest pay)?**
A: It provides a better alternative. ROTP still exists for consumers who refuse to register anything. But BillWallet® registration is so low-friction (email only) that most consumers will prefer it.

**Q: Can a consumer have BillWallet® AND a traditional portal account?**
A: Yes. BillWallet® can coexist with or replace traditional login. The identity-ms manages the relationship.

**Q: How does BillWallet® work on IVR if there's no screen?**
A: The IVR prompts for the BillWallet® email or ID. The system verifies identity through the same identity-ms backend. Payment is processed without the consumer needing to recite account numbers or card details.

**Q: What if a consumer wants to pay a biller that isn't on Paymentus?**
A: BillWallet® currently works across billers on the Paymentus/IPN network. As the network grows, the value of each BillWallet® ID increases (network effect).

**Q: Is BillWallet® available to all billers or only certain tiers?**
A: Check with Product for current availability. The technology is production-ready and deploying across verticals.

**Q: What login providers does BillWallet® support?**
A: Email (primary), Google, Apple, and Fast Signup. See `LoginProviders` enum in lib-blwt-internal.

**Q: How is BillWallet® different from Apple Pay / Google Pay?**
A: Apple/Google Pay are retail wallets for one-off purchases. They don't store biller account relationships, don't work on IVR, and don't create persistent service relationships. BillWallet® is purpose-built for the biller economy.

---

## 9. Key Metrics & Proof Points

| Metric | Source |
|--------|--------|
| 4x faster payments | Production measurement |
| 80% login abandonment (industry) | Paymentus research |
| 60% one-time payment volume | Biller data across verticals |
| 12–15 bills per household/month | U.S. Bureau of Labor Statistics |
| 9B+ manual account entries/year | Paymentus market analysis |
| PCI Level 1 certified | Paymentus compliance program |
| Patented technology | USPTO (proprietary to Paymentus) |

---

## 10. Summary: The BillWallet® Value Chain

```
For Consumers:             For Billers:                 For Paymentus:
─────────────              ────────────                 ──────────────
• No passwords             • Reduced DSO                • Higher ARPU per biller
• One ID everywhere        • Lower call center costs    • Sticky platform (patent)
• 4x faster payments       • Higher digital adoption    • Network effect (IPN)
• More secure              • AutoPay conversion         • Competitive moat
• AI bill insights         • Better CSAT/NPS            • AI/ML data layer
                           • Reduced fraud risk         • Cross-sell opportunities
```

---

## 11. Resources

| Resource | Location |
|----------|----------|
| BillWallet® public page | [paymentus.com/billwallet](https://www.paymentus.com/billwallet/) |
| AI-Native Service Commerce release | [Business Wire, May 2026](https://www.paymentus.com/industry-insights/paymentus-launches-ai-native-service-commerce/) |
| BillWallet® abandonment article | [paymentus.com/industry-insights/billwallet-intelligent-path](https://www.paymentus.com/industry-insights/billwallet-intelligent-path/) |
| Internal: lib-blwt-internal | `pmf-master/src/modules/lib-blwt-internal` |
| Internal: blwt-ui-core | `pmfui-dev/modules/blwt-ui-core` |
| Internal: BillWallet MS config | `argo-release-uat/chart/ipn/ipn-ms-stack/values-bill-wallet-ms.yaml` |
| Demo Portal | `demo-portal/BILL_WALLET_ USER_JOURNEY.docx` |

---

*Document Owner: [Product/Strategy Team]*
*Last Updated: May 2026*
*Version: 1.0*
