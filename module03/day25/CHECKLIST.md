# Day 50 Sequence & Closing Checklist (CHECKLIST.md)

> **Milestone:** Capstone Review & Assessment Day (Day 50 · Week 10)  
> **Course:** IBT College Canada CodeOps · Full Stack Software Development  
> **Module Status:** Module 3 Final Closure & Module 4 Transition  

---

## 1. Today's Seven-Step Sequence Verification

- [x] **Step 1: Set up before the session begins**  
  - Live deployed URL open in primary browser window.  
  - Public repository open with five core files pinned in tabs (`app/page.js`, `app/actions.js`, `lib/session.js`, `lib/data.js`, `middleware.js`).  
  - Supporting documentation readily accessible (`README.md`, `AUTH.md`, `DATA.md`, `PERF.md`, `FUTURE.md`).
- [x] **Step 2: Present the eight minutes**  
  - Delivered with strict timekeeping, highlighting business context, live user flow, technical trade-offs, live security refusal demonstrations, and performance improvements.
- [x] **Step 3: Review your partner**  
  - Used the partner application live before inspecting source code.
  - Traced routing, layouts, and feature boundaries.
- [x] **Step 4: Follow one feature end-to-end**  
  - Audited target feature from client URL to server data and back.
  - Verified authentication and authorization checks on protected write actions.
- [x] **Step 5: Write constructive peer review**  
  - Delivered three concrete strengths and three constructive, question-based observations in `PEER_REVIEW.md`.
- [x] **Step 6: Sit the Module Assessment**  
  - Answered React core, Routing, Next.js App Router, and production engineering scenarios with thorough architectural justifications in `ASSESSMENT.md`.
- [x] **Step 7: Update FUTURE.md & select backend track**  
  - Ingested all peer review and assessor observations into `FUTURE.md`.  
  - Formally selected Track 1 (Node.js with Nest.js) documented in `BACKEND_TRACK.md`.

---

## 2. Closing Checklist: Before Leaving the Session

| Requirement | Evidence File | Status |
| :--- | :--- | :---: |
| **Capstone Presented & Defended** | [`PRESENTATION.md`](file:///c:/Users/hp/Desktop/IBT/codeops-portfolio/module03/day25/PRESENTATION.md) | **COMPLETE** |
| **Peer Code Review Written & Delivered** | [`PEER_REVIEW.md`](file:///c:/Users/hp/Desktop/IBT/codeops-portfolio/module03/day25/PEER_REVIEW.md) | **COMPLETE** |
| **Written & Scenario Assessment Completed** | [`ASSESSMENT.md`](file:///c:/Users/hp/Desktop/IBT/codeops-portfolio/module03/day25/ASSESSMENT.md) | **COMPLETE** |
| **Post-Assessment Action Plan Outlined** | [`FUTURE.md`](file:///c:/Users/hp/Desktop/IBT/codeops-portfolio/module03/day25/FUTURE.md) | **COMPLETE** |
| **Backend Track Selected with Market Evidence** | [`BACKEND_TRACK.md`](file:///c:/Users/hp/Desktop/IBT/codeops-portfolio/module03/day25/BACKEND_TRACK.md) | **COMPLETE** |

---

## 3. "Check Yourself" Direct Answers

### Q1: What is the one decision in your capstone you are most confident defending?
> **Answer:**  
> **Implementing authentication and record ownership validation directly inside Server Actions rather than relying on Edge Middleware as a security barrier.**  
> *Reasoning:* Next.js Server Actions are exposed as public HTTP POST endpoints. Relying solely on Edge Middleware to protect routes creates a dangerous false sense of security because direct API requests can bypass middleware URL routing rules. By enforcing `const user = await getSession()` and `if (order.userId !== user.id) throw new Error("Forbidden")` inside the action itself, the database write operation is mathematically and cryptographically safeguarded against IDOR attacks regardless of how the request was dispatched.

### Q2: What did a peer’s code do better than yours, and will you adopt it?
> **Answer:**  
> **Accessible Live Status Announcements using `aria-live="polite"`.**  
> *Reasoning:* During the peer code review, my partner's tracking page wrapped live polling status badges in an accessible container with `role="status"` and `aria-live="polite"`. When an order moved from "Received" to "Preparing", a screen reader immediately announced the update to visually impaired users without moving focus. I logged this exact item in [`FUTURE.md`](file:///c:/Users/hp/Desktop/IBT/codeops-portfolio/module03/day25/FUTURE.md) to implement in our UI component library.

### Q3: Which of the ten commonly missed concepts did you get wrong today?
> **Answer:**  
> **Dynamic Route Rendering Triggered by Reading Cookies (`cookies()` in App Router).**  
> *Reasoning:* Early in development, I assumed that calling `await cookies()` inside a nested layout would still allow sub-routes to be statically prerendered (`○ (Static)`). The Next.js build trace demonstrated that invoking runtime cookie stores automatically opts the segment into on-demand dynamic rendering (`ƒ (Dynamic)`). I corrected this by isolating session checks to dynamic leaf components, keeping public routes like `/menu` fully cacheable.

### Q4: Which backend track are you choosing, and what evidence led you there?
> **Answer:**  
> **Track 1: Node.js with Nest.js.**  
> *Reasoning:*  
> 1. *End-to-End Type Safety:* Allows sharing DTOs and Zod validation schemas between Next.js and Nest.js.  
> 2. *Addis Ababa Market Demand:* Widespread adoption among Ethiopian tech startups, payment gateways (Chapa, Telebirr partners), and digital platforms.  
> 3. *Enterprise Architectural Discipline:* Built-in dependency injection, controllers, guards, and interceptors establish clean architectural boundaries without boilerplate.

### Q5: What is the first item in your `FUTURE.md`, and when will you do it?
> **Answer:**  
> **Migrating `middleware.js` to the new Next.js route proxy standard to eliminate canary deprecation warnings.**  
> *Timeline:* Scheduled for Day 51 evening during the setup phase of Module 4, before establishing the external API proxy.

### Q6: What would you tell a student starting Module 3 on Monday?
> **Answer:**  
> **"Build small, complete, and vertically verified — never build wide and half-finished."**  
> *Advice:*  
> 1. *Respect the Boundary:* Don't slap `"use client"` on top of a file just to get rid of a build error; understand that keeping data fetching on the server is where performance, security, and zero-bundle weight come from.  
> 2. *Never Trust the Browser:* Middleware is an edge gate for UX redirects, not your data security model. Always check authentication and record ownership inside the write action itself.  
> 3. *Write the Documents as You Decide:* Don't leave `AUTH.md`, `DATA.md`, and `PERF.md` to the night before the defense. The documents force you to justify why a component or query lives where it does.

