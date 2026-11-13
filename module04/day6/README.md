# CODEOPS | MODULE 4 - DAY 56 PRACTICAL EXERCISE
## Campus Events API (NestJS + TypeScript)

A production-ready RESTful Campus Events API built with **NestJS**, **TypeScript**, and **Express**. The API enables college students and faculty to discover campus events, filter by categories and dates, view event details, and browse session schedules for each event.

---

## 1. Project Scenario & Overview

This API provides endpoints to discover, search, filter, paginate, and manage campus events and their nested session schedules.

### Core Entities

- **Event**:
  - `id` (string): Unique event identifier (e.g., `evt-101`)
  - `title` (string): Title of the campus event
  - `description` (string): Detailed summary of the event
  - `location` (string): Campus venue or hall
  - `eventDate` (string): ISO 8601 timestamp (e.g., `2026-12-04T09:00:00.000Z`)
  - `category` (string): Category (e.g., `technology`, `career`, `sports`, `arts`)
  - `isPublished` (boolean): Publication status

- **Session**:
  - `id` (string): Unique session identifier (e.g., `ses-201`)
  - `eventId` (string): Identifier of the parent event
  - `title` (string): Session title
  - `startsAt` (string): Session start time (e.g., `09:30 AM`)
  - `endsAt` (string): Session end time (e.g., `10:30 AM`)
  - `room` (string): Assigned room or lab (e.g., `Auditorium Hall A`)

---

## 2. Architecture & Separation of Concerns

The project adheres to NestJS modular architecture:

```
module04/day6/
├── package.json                   # Root script proxy
├── requests.http                  # VS Code REST Client / Thunder Client request collection
├── README.md                      # Full documentation & reflection answers
└── campus-events-api/
    ├── package.json               # NestJS dependencies and scripts
    ├── tsconfig.json              # TypeScript configuration
    ├── nest-cli.json              # Nest CLI configuration
    ├── test-suite-inmem.js        # Automated API test suite (17 test cases)
    ├── test-results.json          # Recorded JSON output of test execution
    ├── requests.http              # Request collection
    └── src/
        ├── main.ts                # Bootstrap, global prefix (/api), ValidationPipe
        ├── app.module.ts          # Root module importing EventsModule
        └── events/
            ├── events.module.ts       # Wires controller and service
            ├── events.controller.ts   # Route definitions, @Param, @Query, @Body decorators
            ├── events.service.ts      # In-memory storage, filtering, sorting, pagination
            ├── dto/
            │   ├── create-event.dto.ts     # class-validator DTO for event creation
            │   └── find-events-query.dto.ts # Query parameter DTO with class-transformer
            └── interfaces/
                └── event.interface.ts      # TypeScript interfaces for Event, Session, PaginatedResponse
```

### Responsibility Separation
- **`EventsModule`**: Encapsulates the events feature, wires controller and provider dependencies, and exports `EventsService`.
- **`EventsController`**: Defines API routes, extracts request metadata using `@Param()`, `@Query()`, `@Body()`, and `@Res()`, and delegates business operations to the service.
- **`EventsService`**: Contains all business logic: filtering, safe sorting on array copies (preserving immutability), pagination slicing, ID lookups, and parent-child session validation.
- **DTOs & Interfaces**: Define data contracts, parse query strings into strongly typed variables (e.g. string to boolean/number), and enforce strict validation rules.

---

## 3. Installation & Running Instructions

### Prerequisites
- Node.js (v18+ or v20+)
- npm (v9+ or v10+)

### Setup
From either the `day6` root or `campus-events-api` directory:

```bash
# Navigate to the project directory
cd module04/day6/campus-events-api

# Install dependencies
npm install

# Build the TypeScript project
npm run build
```

### Running the Server
```bash
# Start development server with hot-reload:
npm run start:dev

# Start production server:
npm run start:prod
```
The server will start at: `http://localhost:3000/api`

### Running the Automated Test Suite
An automated end-to-end test runner verifies all 17 test cases:
```bash
# From module04/day6:
npm test

# Or from campus-events-api:
npm run test:api
```

---

## 4. API Endpoints

All endpoints are registered under the global `/api` prefix.

| Method | Endpoint | Description | Status Code |
| :--- | :--- | :--- | :--- |
| `GET` | `/api/events` | List events with filtering, sorting & pagination | `200 OK` |
| `GET` | `/api/events/upcoming` | Events with `eventDate >= today` (sorted ascending) | `200 OK` |
| `GET` | `/api/events/published` | *(Stretch)* Returns only published events | `200 OK` |
| `GET` | `/api/events/:id` | Returns single event by ID | `200 OK` / `404 Not Found` |
| `GET` | `/api/events/:id/sessions` | Returns all sessions for the given event ID | `200 OK` / `404 Not Found` |
| `GET` | `/api/events/:id/sessions/:sessionId` | Returns specific session under event | `200 OK` / `404 Not Found` |
| `POST` | `/api/events` | Create new event from validated JSON body | `201 Created` / `400 Bad Request` |

> [!IMPORTANT]
> **Static Route Precedence**: The static routes `/upcoming` and `/published` are declared **before** the dynamic route `/:id` in `EventsController`. This ensures the NestJS router matches literal paths before evaluating dynamic parameter segments.

---

## 5. Filtering, Sorting, and Pagination Deep Dive

### Query Parameters Supported on `GET /api/events`
- `category` (string, optional): Case-insensitive category filter (e.g., `?category=technology`).
- `location` (string, optional): Substring location match (e.g., `?location=main`).
- `isPublished` (boolean, optional): Publication status (`?isPublished=true`).
- `sortBy` (string, optional): Sort field: only `eventDate` or `title` allowed. Unsupported values return `400 Bad Request`.
- `order` (string, optional): Sort direction: `asc` or `desc` (default: `asc`).
- `page` (number, optional): Page number (min: 1, default: 1).
- `limit` (number, optional): Items per page (min: 1, default: 5).
- `search` (string, optional): *(Stretch)* Multi-word matching against event titles.
- `dateFrom` & `dateTo` (ISO date strings, optional): *(Stretch)* Filter events within a date range.

### Order of Operations in `EventsService.findAll()`

1. **Filtering**:
   Evaluates all filter criteria against the in-memory array. Only matching events survive.
   ```typescript
   let filtered = this.events.filter((event) => {
     if (category && event.category.toLowerCase() !== category.trim().toLowerCase()) return false;
     if (location && !event.location.toLowerCase().includes(location.trim().toLowerCase())) return false;
     if (isPublished !== undefined && event.isPublished !== isPublished) return false;
     if (search && !searchWordsMatch(event.title, search)) return false;
     if (dateFrom && new Date(event.eventDate).getTime() < new Date(dateFrom).getTime()) return false;
     if (dateTo && new Date(event.eventDate).getTime() > new Date(dateTo).getTime()) return false;
     return true;
   });
   const total = filtered.length;
   ```
2. **Sorting (Preserving Immutability)**:
   A shallow copy is created with `[...filtered]` before calling `.sort()`. The original seed data is **never mutated**:
   ```typescript
   let sorted = [...filtered];
   if (sortBy) {
     sorted.sort((a, b) => {
       let comparison = 0;
       if (sortBy === 'eventDate') {
         comparison = new Date(a.eventDate).getTime() - new Date(b.eventDate).getTime();
       } else if (sortBy === 'title') {
         comparison = a.title.localeCompare(b.title);
       }
       return order === 'desc' ? -comparison : comparison;
     });
   }
   ```
3. **Pagination**:
   Calculates offset, start index, end index, and total pages:
   $$\text{offset} = (\text{page} - 1) \times \text{limit}$$
   $$\text{totalPages} = \lceil \text{total} / \text{limit} \rceil$$
   ```typescript
   const offset = (pageNum - 1) * limitNum;
   const items = sorted.slice(offset, offset + limitNum);
   ```

### Response Structure & Header
Returns a uniform response envelope:
```json
{
  "items": [ /* events on this page */ ],
  "total": 6,
  "page": 2,
  "limit": 2,
  "totalPages": 3
}
```
In addition, the `X-Total-Count` HTTP response header is attached with the matching count (e.g. `X-Total-Count: 6`).

---

## 6. Test Suite & Verification Results

The API was tested across 17 test cases covering standard paths, error states, edge cases, and stretch goals.

| No. | Test Description | Method & Endpoint | Expected Status | Actual Status | Result |
| :---: | :--- | :--- | :---: | :---: | :---: |
| **1** | Get all events (default pagination) | `GET /api/events` | `200 OK` | `200 OK` | **PASS** |
| **2** | Filter by category | `GET /api/events?category=technology` | `200 OK` | `200 OK` | **PASS** |
| **3** | Filter by publication status | `GET /api/events?isPublished=true` | `200 OK` | `200 OK` | **PASS** |
| **4** | Sort and paginate | `GET /api/events?sortBy=eventDate&order=asc&page=2&limit=2` | `200 OK` | `200 OK` | **PASS** |
| **5** | Get upcoming events | `GET /api/events/upcoming` | `200 OK` | `200 OK` | **PASS** |
| **6** | Get an existing event | `GET /api/events/evt-101` | `200 OK` | `200 OK` | **PASS** |
| **7** | Request a missing event | `GET /api/events/not-real` | `404 Not Found` | `404 Not Found` | **PASS** |
| **8** | Get sessions for an event | `GET /api/events/evt-101/sessions` | `200 OK` | `200 OK` | **PASS** |
| **9** | Get a session under its event | `GET /api/events/evt-101/sessions/ses-201` | `200 OK` | `200 OK` | **PASS** |
| **10** | Create a valid event | `POST /api/events` | `201 Created` | `201 Created` | **PASS** |
| **11** | Create an event with missing title | `POST /api/events` | `400 Bad Request` | `400 Bad Request` | **PASS** |
| **12** | Reject unsupported sort fields *(Stretch)* | `GET /api/events?sortBy=invalidField` | `400 Bad Request` | `400 Bad Request` | **PASS** |
| **13** | Search query matching words in title *(Stretch)* | `GET /api/events?search=bootcamp` | `200 OK` | `200 OK` | **PASS** |
| **14** | Filter by date range dateFrom & dateTo *(Stretch)* | `GET /api/events?dateFrom=2026-11-01&dateTo=2026-11-30` | `200 OK` | `200 OK` | **PASS** |
| **15** | Cross-event session mismatch *(Cross-check)* | `GET /api/events/evt-101/sessions/ses-203` | `404 Not Found` | `404 Not Found` | **PASS** |
| **16** | Sessions for missing event | `GET /api/events/not-real/sessions` | `404 Not Found` | `404 Not Found` | **PASS** |
| **17** | Get published events only *(Stretch)* | `GET /api/events/published` | `200 OK` | `200 OK` | **PASS** |

### Sample Response: `POST /api/events` (Valid Creation)
```json
{
  "id": "evt-7817",
  "title": "Intro to Cloud Computing",
  "description": "A beginner-friendly campus workshop.",
  "location": "Engineering Block, Room 2",
  "eventDate": "2026-12-04T09:00:00.000Z",
  "category": "technology",
  "isPublished": true
}
```

### Sample Response: `POST /api/events` (Validation Error)
```json
{
  "message": [
    "Title is required and cannot be empty",
    "title must be a string"
  ],
  "error": "Bad Request",
  "statusCode": 400
}
```

---

## 7. Answers to Reflection Questions

### Question 1: What is the difference between a path parameter and a query parameter? Give one example of each.
- **Path Parameter**: A path parameter is an integral segment of the URL path used to identify a specific, unique resource in a hierarchical structure. It is declared with a colon in routing patterns (e.g., `/:id`).
  - *Example*: In `GET /api/events/evt-101`, `evt-101` is a path parameter identifying the specific event resource.
- **Query Parameter**: A query parameter is an optional key-value pair appended to the end of the URL after a question mark (`?`) used to filter, sort, search, or paginate a collection of resources. Multiple parameters are delimited by ampersands (`&`).
  - *Example*: In `GET /api/events?category=technology&page=1`, `category=technology` and `page=1` are query parameters modifying how the collection is filtered and paginated.

### Question 2: Why should `/upcoming` be declared before `/:id`?
In NestJS (and Express routers), routes are evaluated in the order they are registered in the controller.
- If dynamic route `@Get(':id')` is declared before `@Get('upcoming')`, any incoming request to `/api/events/upcoming` will match the wildcard `:id` pattern first. The router will treat the literal word `"upcoming"` as the event ID (passing `id = "upcoming"` into `findOne()`), which fails with a `404 Not Found` instead of triggering the upcoming events handler.
- Declaring the static route `@Get('upcoming')` before `@Get(':id')` guarantees that the exact literal route takes precedence, and only paths that do not match static endpoints fall through to dynamic parameter matching.

### Question 3: Why should filtering happen before pagination?
Pagination is designed to return a slice of the *matching* dataset.
- If pagination were performed before filtering, the application would take items from the raw dataset (e.g., items 1 to 5) and then filter that tiny subset. If none of those 5 items match the filter criteria (e.g. `category=technology`), the API would return an empty page even if matching events exist on later pages of the raw dataset. Furthermore, the `total` and `totalPages` calculations would be completely broken.
- By filtering first, we obtain the true set of matching records, determine the correct `total`, calculate the real `totalPages`, and then slice out the requested page window.

### Question 4: If `page = 3` and `limit = 5`, what is the offset and which array index starts the page?
- Formula:
  $$\text{offset} = (\text{page} - 1) \times \text{limit}$$
  $$\text{offset} = (3 - 1) \times 5 = 2 \times 5 = 10$$
- **Offset**: `10`
- **Array index that starts the page**: **Index `10`** (the 11th element of the zero-indexed array, representing elements from index 10 to index 14 inclusive).

### Question 5: Why should the controller call the service instead of containing all business logic?
Adhering to the **Single Responsibility Principle (SRP)** and separation of concerns provides several crucial benefits:
1. **Separation of Concerns**: Controllers are responsible exclusively for the HTTP transport layer (parsing headers, extracting `@Param`, `@Query`, `@Body`, validating request formats, and selecting HTTP status codes). Services handle the domain and business logic (data manipulation, querying, business rules, calculations).
2. **Reusability**: Business logic inside a service can be reused across multiple controllers, background workers, CLI scripts, cron jobs, microservices, or WebSocket gateways without duplicating code.
3. **Testability**: Services can be unit tested in complete isolation with mock data without having to mock the HTTP request/response pipeline.
4. **Maintainability**: When database queries, caching strategies, or algorithms change, only the service needs modification; the HTTP interface remains intact.

### Question 6: What status code should be returned when an event does not exist, and why?
- **Status Code**: `404 Not Found`
- **Why**: According to the HTTP/1.1 specification (RFC 7231 / RFC 9110), `404 Not Found` indicates that the origin server did not find a current representation for the target resource identified by the Request-URI.
  - Returning `200 OK` with `null` or an empty object is misleading because the client cannot distinguish between a successful request that yielded empty data and a non-existent resource.
  - Returning `400 Bad Request` is incorrect because the request syntax and ID format itself may be entirely valid, but the entity simply does not exist in the database.
  - Therefore, `404 Not Found` accurately communicates to clients, frontend applications, and monitoring systems that the requested resource does not exist.

---

## 8. Repository Link
- **GitHub Repository**: [https://github.com/elso12/codeops-portfolio.git](https://github.com/elso12/codeops-portfolio.git)
- **Directory Path**: `module04/day6`

