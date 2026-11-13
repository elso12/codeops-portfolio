# Module 4: Backend Track Selection & Architecture Roadmap (BACKEND_TRACK.md)

> **Document Type:** Track Selection Rationale & Module 4 Preparation Document  
> **Course:** IBT College Canada CodeOps · Full Stack Software Development  
> **Transition:** Module 3 (Frontend React/Next.js) -> Module 4 (Backend Engineering)  
> **Cohort Milestone:** Day 50 Capstone Review -> Day 51 Universal Foundations  

---

## 1. Evaluation of the Three Backend Tracks

| Track | Core Technologies | Suits You If... | Industry Destination & Tech Profile |
| :--- | :--- | :--- | :--- |
| **Track 1: Node.js with Nest.js** | TypeScript, Nest.js, Express/Fastify, TypeORM/Prisma | You value full-stack language continuity (TypeScript from UI to DB), rapid API iteration, and modular enterprise architecture. | Modern tech startups, product companies, agile SaaS platforms, and international remote teams. |
| **Track 2: Golang** | Go, Gin/Fiber, GORM, Goroutines, gRPC | You enjoy low-level performance optimization, concurrency, compiled binaries, and minimal memory footprints. | Cloud infrastructure, DevOps tooling, distributed systems, microservices, and high-frequency data pipelines. |
| **Track 3: .NET with C#** | C#, ASP.NET Core, Entity Framework Core, LINQ | You thrive with strict structural contracts, compiled type safety, and large-scale architectural consistency. | Enterprise software, commercial banking, fintech, healthcare, and governmental legacy migrations. |

---

## 2. Selected Track & Evidence-Based Justification

### Chosen Track: **Track 1 — Node.js with Nest.js (Enterprise TypeScript)**

### Rationale & Local/Global Market Evidence:
1. **Full-Stack Type Continuity Across the Boundary:**
   - In Module 3, we built strong TypeScript/Zod validation schemas (`lib/schema.js`) in Next.js.
   - Nest.js utilizes Class Validators and Data Transfer Objects (DTOs) that share identical design principles with frontend Zod schemas. Having TypeScript across both frontend and backend eliminates context switching and enables shared schema libraries (`@mesob/types`).
2. **Addis Ababa Tech Ecosystem Demand:**
   - The rapid growth of fintech startups (Chapa, Telebirr integration partners, Arifpay) and logistics platforms in Ethiopia heavily leverages Node.js/Nest.js ecosystems due to speed to market and massive npm library availability.
3. **Architectural Discipline Without Bloat:**
   - Nest.js brings Angular-style architectural rigor (Controllers, Services, Modules, Dependency Injection, and Guards) to the backend. This directly mirrors the clean layer separation we established in `app/actions.js` and `lib/data.js`.
4. **Day 51 Readiness:**
   - By mastering HTTP request/response lifecycles, status codes (`200 OK`, `201 Created`, `400 Bad Request`, `401 Unauthorized`, `403 Forbidden`, `404 Not Found`), and middleware pipelines in Nest.js, we directly elevate the mock APIs in Addis Eats (`/api/dishes`, `/api/orders`) to real enterprise microservices.

---

## 3. Preparation for Day 51: Universal Backend Foundations

Regardless of specialization track, Day 51 unites the cohort on foundational backend mechanisms:

### Core Concepts to Review Before Day 51:
- **HTTP/1.1 vs HTTP/2:** Keep-alive connections, multiplexing, and headers.
- **Request Anatomy:** HTTP Methods (`GET`, `POST`, `PUT`, `PATCH`, `DELETE`, `OPTIONS`), URI pathing, query strings, and body serialization (`application/json`, `multipart/form-data`).
- **Response Anatomy:** Status code classifications:
  - `2xx`: Successful transactions (`200 OK`, `201 Created`, `204 No Content`).
  - `3xx`: Redirections (`301 Moved Permanently`, `302 Found`, `304 Not Modified`).
  - `4xx`: Client errors (`400 Bad Request`, `401 Unauthorized`, `403 Forbidden`, `404 Not Found`, `422 Unprocessable Entity`).
  - `5xx`: Server faults (`500 Internal Server Error`, `502 Bad Gateway`, `503 Service Unavailable`).
- **RESTful API Principles:** Statelessness, idempotent vs non-idempotent operations, resource-oriented endpoint naming (`/api/v1/orders/{id}`).
