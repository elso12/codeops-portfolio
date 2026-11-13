# Campus Events API

A RESTful API built with NestJS and TypeScript for a college campus event discovery system. Students and staff can browse upcoming campus events, view event details, apply filters and pagination, and browse session schedules for each event.

---

## What Was Built

The API is structured around two main entities: **Event** and **Session**.

- **Event**: Contains `id`, `title`, `description`, `location`, `eventDate` (ISO string), `category`, and `isPublished`.
- **Session**: Belongs to an event with `id`, `eventId`, `title`, `startsAt`, `endsAt`, and `room`.

Data is stored in-memory in the service using TypeScript arrays, pre-seeded with 6 sample events and associated session schedules.

---

## Project Structure

```
module04/day6/
├── README.md
├── requests.http
└── campus-events-api/
    ├── package.json
    ├── tsconfig.json
    ├── nest-cli.json
    └── src/
        ├── main.ts
        ├── app.module.ts
        └── events/
            ├── events.module.ts
            ├── events.controller.ts
            ├── events.service.ts
            ├── dto/
            │   ├── create-event.dto.ts
            │   └── find-events-query.dto.ts
            └── interfaces/
                └── event.interface.ts
```

### Separation of Concerns
- **Controller (`events.controller.ts`)**: Handles the HTTP layer. Uses `@Param()`, `@Query()`, `@Body()`, and `@Res()` to read incoming request data and return responses with proper status codes.
- **Service (`events.service.ts`)**: Holds the business logic and in-memory data store. Handles filtering, sorting without mutating state, calculating pagination offsets, and validating event/session relationships.
- **DTOs (`dto/`)**: Handle type casting and validation using `class-validator` and `class-transformer` (converting query strings to numbers or booleans, and validating incoming POST payloads).
- **Module (`events.module.ts`)**: Wires the controller and service together into the NestJS dependency injection system.

---

## Getting Started

### 1. Installation
Navigate into the project directory and install the dependencies:
```bash
cd module04/day6/campus-events-api
npm install
```

### 2. Build
Compile the TypeScript code:
```bash
npm run build
```

### 3. Run the Server
```bash
# Development mode with hot-reload
npm run start:dev

# Production mode
npm run start:prod
```
The API will be available at: `http://localhost:3000/api`

### 4. Testing the API
You can test the endpoints using **Thunder Client**, **Postman**, or the VS Code **REST Client** extension with the provided [`requests.http`](requests.http) file.

---

## API Routes & Endpoints

All endpoints are registered under the `/api` prefix.

| Method | Endpoint | Description | Status Code |
| :--- | :--- | :--- | :--- |
| `GET` | `/api/events` | List events with filtering, sorting, and pagination | `200 OK` |
| `GET` | `/api/events/upcoming` | Events with `eventDate` today or later (sorted ascending) | `200 OK` |
| `GET` | `/api/events/published` | Published events only (Stretch) | `200 OK` |
| `GET` | `/api/events/:id` | Get single event by ID | `200 OK` / `404 Not Found` |
| `GET` | `/api/events/:id/sessions` | Get all sessions for an event | `200 OK` / `404 Not Found` |
| `GET` | `/api/events/:id/sessions/:sessionId` | Get a specific session under an event | `200 OK` / `404 Not Found` |
| `POST` | `/api/events` | Create a new event from validated JSON body | `201 Created` / `400 Bad Request` |

> **Note on Route Order**: Static routes (`/upcoming` and `/published`) are defined before dynamic routes (`/:id`) in the controller. Otherwise, NestJS router matches literal strings like `"upcoming"` as the `:id` parameter.

---

## Filtering, Sorting, and Pagination

The `GET /api/events` route accepts optional query parameters applied in this order:

1. **Filtering**: Matches events by `category` (case-insensitive), `location` (substring), `isPublished` (boolean), search keywords (`search`), and date ranges (`dateFrom` and `dateTo`).
2. **Sorting**: A shallow copy of the filtered array (`[...filtered]`) is created first so the original seed array is not modified. Events can be sorted by `eventDate` or `title` in either `asc` or `desc` order. Unsupported sort fields are rejected with `400 Bad Request`.
3. **Pagination**:
   - `offset = (page - 1) * limit`
   - `items = sorted.slice(offset, offset + limit)`
   - `totalPages = Math.ceil(total / limit)`

### Sample Response Format:
```json
{
  "items": [
    {
      "id": "evt-102",
      "title": "Campus Career & Internship Fair",
      "description": "Connect with over 40 tech and business companies hiring interns and graduates.",
      "location": "Student Union Center",
      "eventDate": "2026-11-25T10:00:00.000Z",
      "category": "career",
      "isPublished": true
    }
  ],
  "total": 6,
  "page": 2,
  "limit": 1,
  "totalPages": 6
}
```
The response also includes the `X-Total-Count` header with the total number of matching items before pagination.

---

## Recorded Test Requests

All tests specified in the exercise were tested and recorded:

| No. | Test Case | Method & Endpoint | Expected Status | Result |
| :---: | :--- | :--- | :---: | :---: |
| 1 | Get all events | `GET /api/events` | `200 OK` | **PASS** |
| 2 | Filter by category | `GET /api/events?category=technology` | `200 OK` | **PASS** |
| 3 | Filter by publication status | `GET /api/events?isPublished=true` | `200 OK` | **PASS** |
| 4 | Sort and paginate | `GET /api/events?sortBy=eventDate&order=asc&page=2&limit=2` | `200 OK` | **PASS** |
| 5 | Get upcoming events | `GET /api/events/upcoming` | `200 OK` | **PASS** |
| 6 | Get an existing event | `GET /api/events/evt-101` | `200 OK` | **PASS** |
| 7 | Request a missing event | `GET /api/events/not-real` | `404 Not Found` | **PASS** |
| 8 | Get sessions for an event | `GET /api/events/evt-101/sessions` | `200 OK` | **PASS** |
| 9 | Get session under event | `GET /api/events/evt-101/sessions/ses-201` | `200 OK` | **PASS** |
| 10 | Create valid event | `POST /api/events` | `201 Created` | **PASS** |
| 11 | Create event missing title | `POST /api/events` | `400 Bad Request` | **PASS** |
| 12 | Reject invalid sort field | `GET /api/events?sortBy=invalidField` | `400 Bad Request` | **PASS** |
| 13 | Keyword search in title | `GET /api/events?search=bootcamp` | `200 OK` | **PASS** |
| 14 | Date range filter | `GET /api/events?dateFrom=2026-11-01&dateTo=2026-11-30` | `200 OK` | **PASS** |
| 15 | Cross-event session check | `GET /api/events/evt-101/sessions/ses-203` | `404 Not Found` | **PASS** |
| 16 | Missing event sessions | `GET /api/events/not-real/sessions` | `404 Not Found` | **PASS** |
| 17 | Published events route | `GET /api/events/published` | `200 OK` | **PASS** |

You can test these directly in VS Code using the included [`requests.http`](requests.http) file.

---

## Reflection Questions

### 1. What is the difference between a path parameter and a query parameter? Give one example of each.
- A **path parameter** identifies a specific resource directly in the URL path. It is required to locate the resource.
  - *Example*: In `/api/events/evt-101`, `evt-101` is a path parameter pointing to a single event.
- A **query parameter** is optional key-value data added after the `?` in the URL to modify how data is retrieved, such as filtering, sorting, or paginating.
  - *Example*: In `/api/events?category=technology&page=2`, `category` and `page` are query parameters.

### 2. Why should `/upcoming` be declared before `/:id`?
NestJS checks routes in the order they are registered in the controller. If `@Get(':id')` is placed first, any request to `/api/events/upcoming` gets caught by the dynamic `/:id` route, treating `"upcoming"` as the event ID and returning a `404 Not Found`. Declaring the static `@Get('upcoming')` first ensures the router matches the exact path before falling back to the parameter.

### 3. Why should filtering happen before pagination?
Pagination divides matching records into pages. If pagination were done first, you would take a slice of the raw, unfiltered data and then filter only that slice. That would result in incomplete or empty pages even when matching records exist elsewhere in the data, and the `total` and `totalPages` counts would be wrong. Filtering first ensures you know the real number of matches before taking the requested page slice.

### 4. If page = 3 and limit = 5, what is the offset and which array index starts the page?
- **Formula**: `offset = (page - 1) * limit`
- Calculation: `(3 - 1) * 5 = 2 * 5 = 10`
- **Offset**: `10`
- **Starting array index**: **Index 10** (which is the 11th item in a 0-indexed array, spanning indices 10 through 14).

### 5. Why should the controller call the service instead of containing all business logic?
Separating the controller and service follows the Single Responsibility Principle:
- The **controller** only manages HTTP concerns: taking in the request, reading params/body/query, running DTO validation, and returning the right HTTP status code.
- The **service** manages the domain logic: filtering data, sorting, checking entity relationships, and handling storage.
This makes the service reusable across different controllers or background jobs, makes the code easier to maintain, and allows you to unit test business logic without having to mock HTTP requests and responses.

### 6. What status code should be returned when an event does not exist, and why?
- **Status Code**: `404 Not Found`
- **Why**: According to HTTP standards (RFC 7231), `404` indicates that the requested resource URI could not be found on the server. Returning `200 OK` with null or an empty body is misleading because the client cannot tell whether the request actually succeeded with empty data or the resource does not exist. Returning `400 Bad Request` is also incorrect because the request syntax was valid—it is the entity that does not exist.
