# MedAddis — Community Clinic & Pharmacy Dispensing Portal
> **Capstone Project Specification & Initial Scaffold**  
> **Module 3: Frontend Development (React & Next.js)**  
> **Course:** CodeOps Full Stack Software Development · IBT College Canada  
> **Student:** Full Stack Development Cohort  
> **Scaffold Date:** Week 7 · Day 35  

---

## 1. Domain & Real-World Problem

In high-volume public and community health clinics across Addis Ababa (such as Kazanchis and Bole Subcity health posts), patient triage registers and pharmaceutical prescription records are predominantly written in physical paper logbooks. When a doctor issues a prescription, patients frequently wait in separate physical queues at the dispensary only to discover that the prescribed antibiotic or insulin vial is out of stock, or that allergy records were omitted from the paper slip.

**MedAddis** solves this problem by providing a centralized, resilient clinic triage and pharmacy dispensing frontend that enables triage nurses to register patients, physicians to queue digital prescriptions, and pharmacists to safely verify, audit, and dispense medications with instant allergy alerts.

---

## 2. Target User Persona

- **Name:** Rahel Tadesse  
- **Role:** Senior Outpatient Registrar & Dispensary Pharmacist at Bole Community Health Center.  
- **Responsibilities:**
  - Checking in arriving patients and assigning triage priority (Emergency, Urgent, Standard).
  - Reviewing the digital dispensing queue sent from consultation rooms.
  - Verifying patient allergy warnings against prescribed pharmaceutical compounds.
  - Recording medication lot numbers and logging completed dispenses for Ministry of Health audits.
- **Key Pain Point:** Fragmented communication between triage desk and dispensary causing dangerous medication delays and unrecorded allergy interactions.

---

## 3. Five Core Screens & Data Specifications

### Screen 1: Clinic Overview & Triage Dashboard (`/`)
- **Purpose:** High-level operational command center for clinic staff at the start of a shift.
- **Data Displayed:**
  - Active triage waiting count (Emergency, Urgent, Routine).
  - Number of pending prescriptions awaiting pharmacy fulfillment.
  - Medication stock alert counters (low inventory warnings).
  - Quick-action triage launch buttons.

### Screen 2: Patient Master Registry (`/patients`)
- **Purpose:** Searchable and filterable roster of all registered clinic patients.
- **Data Displayed:**
  - Patient Medical Record Number (MRN, e.g., `ETH-MED-8492`).
  - Full Name, Age, Sex, Phone number (Telebirr/Ethio Telecom).
  - Filter by Triage Priority (`All`, `Emergency`, `Urgent`, `Standard`).
  - Search by Name or MRN.

### Screen 3: Patient Clinical Chart & History (`/patients/:id`)
- **Purpose:** Dynamic detailed view of an individual patient's medical profile.
- **Data Displayed:**
  - Demographic vitals (Blood Pressure, Heart Rate, SpO2, Temperature).
  - Documented Allergies (e.g., Penicillin, NSAIDs, Sulfa drugs) with high-contrast alert badges.
  - Active diagnoses and previous consultation timeline.
  - Current active medication regimens.

### Screen 4: Pharmacy Dispensing Queue (`/prescriptions`)
- **Purpose:** Live pharmacist workstation for queue management.
- **Data Displayed:**
  - Timestamped prescriptions ordered by clinical urgency.
  - Prescribing Physician, Patient Name, Medication Name, Dosage, and Duration.
  - Current inventory stock status indicator (In Stock, Low Stock, Restocking).
  - "Fulfill Dispense" action button leading to verification.

### Screen 5: Dispense Verification & Audit Log (`/dispense`)
- **Purpose:** Controlled, validated form logging medication release. Guarded by staff authorization.
- **Data Displayed & Inputs:**
  - Medication Batch / Lot Number (strictly validated format).
  - Dispensing Quantity and Dosage instructions confirmation.
  - Mandatory allergy clearance checkbox.
  - Pharmacist Digital Signature / PIN.
  - Audit trail of previous dispenses during current shift.

---

## 4. Route Map (Day 31 Specification)

| Path | Screen Component | URL Parameter | Guarded by Sign-in? | Data Dependency |
| :--- | :--- | :--- | :--- | :--- |
| `/` | `Dashboard` | None | No | Clinic triage metrics & live wait counts |
| `/patients` | `PatientList` | Query params: `?priority=` | No | Patient master roster, search index |
| `/patients/:id` | `PatientDetail` | `:id` (Patient MRN) | No | Clinical chart, allergies, vitals, history |
| `/prescriptions` | `PrescriptionQueue` | Query params: `?status=` | No | Pending doctor prescriptions & inventory |
| `/dispense` | `DispenseAudit` | Optional `?rxId=` | **Yes (Staff Guard)** | Dispensing form state, batch validation |
| `*` | `NotFound` | Any invalid URL | No | Safe fallback navigation |

---

## 5. Technical Evolution Plan (Road to Day 50)

- **Week 7 (Day 35 - Today):** Initial scaffold, layout, component tree, and 5 reachable routed screens with mock data.
- **Week 8 (Days 36–40):** Migration to Next.js App Router, file-based routing, server layouts, and rendering strategies (SSR/SSG).
- **Week 9 (Days 41–45):** PostgreSQL/Supabase database integration, NextAuth role-based authentication (Doctor vs Pharmacist), and SEO metadata.
- **Week 10 (Days 46–50):** Visual analytics (Recharts for daily clinic volume), PDF prescription generation, Vercel cloud deployment, and presentation.
