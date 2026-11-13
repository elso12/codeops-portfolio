# Addis Eats · Capstone Review & Assessment (Day 50 · Week 10)

> **CodeOps · Full Stack Software Development · IBT College Canada**  
> **Module 3 · Frontend: React & Next.js · Day 50 (Week 10 Final Capstone & Assessment)**  
> **Course Director:** Mehran Dasgar  
> **Policy:** *No changes today — The version verified yesterday is the version presented.*

---

## 1. Day 50 Capstone Overview

Today marks the culmination of **Module 3 (Frontend: React & Next.js)** and the completion of the 10-week frontend and core engineering curriculum. The verified production build from Day 49 is defended live, evaluated through structured peer review, and assessed in a comprehensive 1-hour examination covering React Core, Routing, App Router boundaries, Production Performance, and Security.

### Day 50 Deliverables & Documentation Index

| Deliverable | Purpose | Reference Link |
| :--- | :--- | :--- |
| **`PRESENTATION.md`** | 8-minute high-stakes capstone defense script, rubric alignment (Functionality, Architecture, Auth, Performance, Deployment, Presentation), and crisis contingency plans. | [`PRESENTATION.md`](file:///c:/Users/hp/Desktop/IBT/codeops-portfolio/module03/day25/PRESENTATION.md) |
| **`PEER_REVIEW.md`** | 45-minute structured peer code review following the standard 6-step evaluative protocol across the 6 core areas (Boundary, Security, Queries, States, Markup, Naming). | [`PEER_REVIEW.md`](file:///c:/Users/hp/Desktop/IBT/codeops-portfolio/module03/day25/PEER_REVIEW.md) |
| **`ASSESSMENT.md`** | Complete 1-hour Module Assessment guide, detailed explanations of the 10 concepts most often missed, and architectural scenario questions. | [`ASSESSMENT.md`](file:///c:/Users/hp/Desktop/IBT/codeops-portfolio/module03/day25/ASSESSMENT.md) |
| **`FUTURE.md`** | Post-assessment technical roadmap, peer review feedback ingestion log, technical debt, and Module 4/5 integration bridge. | [`FUTURE.md`](file:///c:/Users/hp/Desktop/IBT/codeops-portfolio/module03/day25/FUTURE.md) |
| **`BACKEND_TRACK.md`** | Evaluation of the 3 backend tracks (Nest.js vs Golang vs .NET), selection justification for Track 1, and Day 51 HTTP/API preparation. | [`BACKEND_TRACK.md`](file:///c:/Users/hp/Desktop/IBT/codeops-portfolio/module03/day25/BACKEND_TRACK.md) |
| **`CHECKLIST.md`** | Today's sequence verification checklist and definitive answers to all five "Check Yourself" prompts. | [`CHECKLIST.md`](file:///c:/Users/hp/Desktop/IBT/codeops-portfolio/module03/day25/CHECKLIST.md) |
| **`AUTH.md`** | 3-tier defense matrix, cryptographic cookie engineering, and live results for the 3 attack vectors. | [`AUTH.md`](file:///c:/Users/hp/Desktop/IBT/codeops-portfolio/module03/day25/AUTH.md) |
| **`DATA.md`** | Data fetching architecture, cache invalidation, debounced search, and 5s polling seeded with SSR data. | [`DATA.md`](file:///c:/Users/hp/Desktop/IBT/codeops-portfolio/module03/day25/DATA.md) |
| **`PERF.md`** | Core Web Vitals audit (LCP 1.22s, CLS 0.000, Lighthouse 98) with full before/after attribution. | [`PERF.md`](file:///c:/Users/hp/Desktop/IBT/codeops-portfolio/module03/day25/PERF.md) |

---

## 2. Test Accounts & Credentials

For assessing role-based access control and scoped data queries:

| Account Role | Email Address | Password | Permissions & Scoped Routes |
| :--- | :--- | :--- | :--- |
| **Customer 1** | `abebe@mesobhouse.et` | `customer123` | Can place orders, view own orders (`ORD-101`), cancel own pending orders. Forbidden from kitchen and Almaz's orders. |
| **Customer 2** | `almaz@mesobhouse.et` | `customer123` | Can place orders, view own orders (`ORD-102`). Refuses any modification by Abebe. |
| **Kitchen Staff** | `kitchen@mesobhouse.et` | `kitchen123` | Can access `/kitchen` dashboard and update status of all active restaurant orders. |

---

## 3. The 8-Minute Defense Outline

- **[0:00 - 1:00] Context & Audience:** Problem statement for Mesob House; diner vs kitchen personas (No code).
- **[1:00 - 3:00] Critical Flow (Live Deployed):** Browse menu -> debounced search -> cart -> login gate -> place order -> live 5s SWR polling tracking.
- **[3:00 - 5:00] Architecture Decision:** Server Component SSR initial data seeding + client SWR polling vs heavy stateful WebSockets.
- **[5:00 - 6:00] 3 Security Attacks Refused:**
  1. *Unauthenticated write:* Refused on [`app/actions.js:159-162`](file:///c:/Users/hp/Desktop/IBT/codeops-portfolio/module03/day25/app/actions.js#L159-L162).
  2. *IDOR horizontal escalation:* Refused on [`app/actions.js:171-175`](file:///c:/Users/hp/Desktop/IBT/codeops-portfolio/module03/day25/app/actions.js#L171-L175).
  3. *Open redirect phishing:* Refused on [`lib/session.js:83-89`](file:///c:/Users/hp/Desktop/IBT/codeops-portfolio/module03/day25/lib/session.js#L83-L89).
- **[6:00 - 7:00] Performance Audit:** LCP 4.68s -> 1.22s (-73.9%), CLS 0.248 -> 0.000, Lighthouse 58 -> 98.
- **[7:00 - 8:00] Pruning & Roadmap:** Intentional omissions documented; Module 4 transition to Nest.js + PostgreSQL.

---

## 4. Production Build & Verification

```bash
# 1. Build the production bundle (zero lint errors, all 22 routes compiled)
npm run build

# 2. Run the verified production server
npm run start

# 3. Access live routes:
# Menu: http://localhost:3000/menu
# Orders: http://localhost:3000/orders
# Kitchen: http://localhost:3000/kitchen
# Security Defense Lab: http://localhost:3000/security-lab
```
