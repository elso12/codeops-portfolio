# Campus Events Discovery Platform — NestJS Backend

## Module 4: Middleware, Guards, Interceptors, Pipes & Validation

This project implements the enterprise-grade NestJS backend for the **Campus Events Application**, emphasizing the complete NestJS request-response lifecycle through **Middleware**, **Guards**, **Interceptors**, and **Pipes**.

---

## 9-Part Implementation Roadmap

The application architecture is developed and verified across 9 distinct, testable phases:

| Phase | Milestone | Status | Key Deliverables & Responsibilities |
| :---: | :--- | :---: | :--- |
| **Part 1** | **Request Lifecycle & Request Logging Middleware** | Complete | `LoggerMiddleware` implementing `NestMiddleware`, global route registration in `AppModule`, request lifecycle understanding. |
| **Part 2** | **API Key Guard Implementation** | Complete | `ApiKeyGuard` implementing `CanActivate`, header extraction (`x-api-key`), environment secret comparison (`CLASSROOM_API_KEY`). |
| **Part 3** | **Guarding Protected Operations** | Complete | Securing `POST /api/events` with `@UseGuards(ApiKeyGuard)` to enforce role-based event creation. |
| **Part 4** | **Timing Interceptor Implementation** | Complete | `TimingInterceptor` implementing `NestInterceptor`, RxJS `tap` side effects, measuring handler latency. |
| **Part 5** | **Applying Interceptors to Controller** | Complete | Binding `@UseInterceptors(TimingInterceptor)` to `EventsController` for performance tracking. |
| **Part 6** | **Pipes & DTO Validation** | Complete | `CreateEventDto` with `class-validator`, parameter transformation with `ParseIntPipe`. |
| **Part 7** | **Global ValidationPipe Configuration** | Complete | Whitelist filtering, non-whitelisted payload rejection, automatic type transformation in `main.ts`. |
| **Part 8** | **End-to-End Testing Suite & Verification** | Complete | Complete 15-test verification checklist using REST client (`requests.http`) and curl. |
| **Part 9** | **Architecture Documentation & Viva Examination** | Complete | Complete architectural summary and comprehensive answers to all 17 Viva questions. |

---

## Part 1: Request Lifecycle & Request Logging Middleware

### 1. Understanding the NestJS Request Lifecycle

When a client transmits an HTTP request to NestJS (e.g., `GET http://localhost:3001/api/events`), the backend routes the request through a structured sequence of layers:

```
[ Client Request ]
       │
       ▼
┌────────────────────────────────────────────────────────┐
│ 1. Middleware (Pre-handler logging, headers, timing)   │
└──────────────────────────┬─────────────────────────────┘
                           ▼
┌────────────────────────────────────────────────────────┐
│ 2. Guard (Can this request continue? Auth / Roles)     │
└──────────────────────────┬─────────────────────────────┘
                           ▼
┌────────────────────────────────────────────────────────┐
│ 3. Interceptor (Pre-handler logic & latency start)     │
└──────────────────────────┬─────────────────────────────┘
                           ▼
┌────────────────────────────────────────────────────────┐
│ 4. Pipe (Data transformation & payload validation)     │
└──────────────────────────┬─────────────────────────────┘
                           ▼
┌────────────────────────────────────────────────────────┐
│ 5. Controller (Route mapping & handler execution)      │
└──────────────────────────┬─────────────────────────────┘
                           ▼
┌────────────────────────────────────────────────────────┐
│ 6. Service (Business logic & in-memory data store)     │
└──────────────────────────┬─────────────────────────────┘
                           ▼
┌────────────────────────────────────────────────────────┐
│ 7. Interceptor (Post-handler latency calculation, RxJS)│
└──────────────────────────┬─────────────────────────────┘
                           ▼
┌────────────────────────────────────────────────────────┐
│ 8. Exception Filter (Centralized error formatting)     │
└──────────────────────────┬─────────────────────────────┘
                           ▼
[ HTTP Response to Client ]
```

#### Core Stage Responsibilities
- **Middleware**: Runs general request-processing logic (e.g., logging HTTP method, URL, and timestamp).
- **Guard**: Determines whether a request is authorized to proceed before entering the handler.
- **Interceptor**: Adds logic immediately before and after the handler executes (e.g., performance timing).
- **Pipe**: Validates and transforms incoming body, query, or route parameters.
- **Controller**: Selects and dispatches the matching route operation.
- **Service**: Executes domain logic and interacts with the data layer.
- **Exception Filter**: Intercepts unhandled errors and produces consistent HTTP responses.

---

### 2. Request Logging Middleware Implementation

#### What is Middleware?
Middleware is a function executed during the HTTP request cycle *before* route handlers are reached. It receives:
1. `req`: The incoming Express request object containing method, headers, URL, and body.
2. `res`: The outgoing Express response object.
3. `next`: The callback function that advances execution to the next middleware or guard in the pipeline.

> **Critical Rule:** Every middleware class or function must either invoke `next()` to pass control to the downstream pipeline or conclude the request by transmitting a response. Omitting both causes the request to hang indefinitely.

#### Source Code: `src/common/middleware/logger.middleware.ts`
```typescript
import { Injectable, NestMiddleware } from '@nestjs/common';
import { Request, Response, NextFunction } from 'express';

@Injectable()
export class LoggerMiddleware implements NestMiddleware {
  use(req: Request, res: Response, next: NextFunction): void {
    console.log(`[${new Date().toISOString()}] ${req.method} ${req.originalUrl}`);
    next();
  }
}
```

---

### 3. Middleware Registration in `AppModule`

Middleware is registered in the module layer by having `AppModule` implement the `NestModule` interface and defining the `configure()` method:

#### Source Code: `src/app.module.ts`
```typescript
import { Module, NestModule, MiddlewareConsumer } from '@nestjs/common';
import { LoggerMiddleware } from './common/middleware/logger.middleware';
import { EventsModule } from './events/events.module';

@Module({
  imports: [EventsModule],
})
export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer): void {
    consumer
      .apply(LoggerMiddleware)
      .forRoutes('*'); // Captures all incoming HTTP routes
  }
}
```

---

## Part 2: API Key Guard Implementation

### 1. What is a Guard?

A **Guard** is a specialized NestJS class that determines whether an incoming request is permitted to reach the target route handler. It implements the `CanActivate` interface and its single method:

```typescript
canActivate(context: ExecutionContext): boolean | Promise<boolean> | Observable<boolean>
```

- If `canActivate()` returns `true`, NestJS permits request processing to continue.
- If `canActivate()` returns `false` or throws an `UnauthorizedException` / `ForbiddenException`, NestJS immediately halts execution and returns an HTTP 401 or 403 response.

#### Guards vs. Middleware: Key Differences
| Attribute | Middleware | Guard |
| :--- | :--- | :--- |
| **Execution Point** | Runs first, before routing and execution context are established. | Runs after middleware, once routing has resolved the target controller and method. |
| **Context Knowledge** | Has access only to raw `req`, `res`, and `next`. Does not know which handler will execute. | Has access to `ExecutionContext`, which reveals the target class and handler method. |
| **Primary Intent** | Request transformation, enrichment, logging, and pre-processing. | Access control, authentication, and authorization decisions. |

---

### 2. Source Code: `src/common/guards/api-key.guard.ts`

The guard extracts the `x-api-key` HTTP header from the incoming request and validates it against the expected secret configured in `process.env.CLASSROOM_API_KEY`:

```typescript
import {
  CanActivate,
  ExecutionContext,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { Request } from 'express';

@Injectable()
export class ApiKeyGuard implements CanActivate {
  canActivate(context: ExecutionContext): boolean {
    const request = context.switchToHttp().getRequest<Request>();
    const apiKey = request.headers['x-api-key'];

    const expectedApiKey = process.env.CLASSROOM_API_KEY || 'campus-secret-key-2026';

    if (!apiKey || apiKey !== expectedApiKey) {
      throw new UnauthorizedException('Invalid API key');
    }

    return true;
  }
}
```

#### Code Breakdown:
- **`ExecutionContext`**: Provides utilities to inspect the runtime environment (`switchToHttp()`).
- **`request.headers['x-api-key']`**: Case-insensitively accesses the header sent by the client.
- **`UnauthorizedException`**: A built-in NestJS exception that formats an HTTP 401 Unauthorized response:
  ```json
  {
    "message": "Invalid API key",
    "error": "Unauthorized",
    "statusCode": 401
  }
  ```

---

### 3. Environment Configuration

The environment file defines the valid API key:

#### `.env.example` / `.env`
```dotenv
PORT=3001
CLASSROOM_API_KEY=campus-secret-key-2026
```

---

### 4. Git Commit & Push Instructions for Part 2

Stage, commit, and push this milestone:

```bash
git add module04/day9/campus-events-api/src/common/guards/api-key.guard.ts module04/day9/campus-events-api/.env.example module04/day9/README.md
git commit -m "feat(backend): part 2 - implement api key guard with CanActivate interface"
git push
```

---

## Part 3: Guarding Protected Operations (`@UseGuards(ApiKeyGuard)`)

### 1. Route-Level Guard Application

In the Campus Events architecture, public users and students can browse and query campus events via `GET /api/events` without authentication. However, publishing a new event (`POST /api/events`) is a privileged operation that must be restricted to authorized event administrators.

We apply the `@UseGuards(ApiKeyGuard)` decorator directly to the `POST /api/events` handler in `EventsController`:

#### Source Code: `src/events/events.controller.ts`
```typescript
import { Body, Controller, Post, UseGuards, HttpCode, HttpStatus } from '@nestjs/common';
import { ApiKeyGuard } from '../common/guards/api-key.guard';
import { CreateEventDto } from './dto/create-event.dto';
import { CampusEvent } from './interfaces/event.interface';

@Controller('events')
export class EventsController {
  constructor(private readonly eventsService: EventsService) {}

  @Post()
  @UseGuards(ApiKeyGuard)
  @HttpCode(HttpStatus.CREATED)
  create(@Body() createEventDto: CreateEventDto): CampusEvent {
    return this.eventsService.create(createEventDto);
  }
}
```

---

### 2. Execution Behavior & Verification

#### Scenario A: Request without API key (Denied)
```bash
curl -i -X POST http://localhost:3001/api/events \
  -H "Content-Type: application/json" \
  -d '{"title":"Hacking Workshop","location":"Lab 3","eventDate":"2026-12-01T10:00:00.000Z","category":"Tech","isPublished":true}'
```
**HTTP Response:**
```http
HTTP/1.1 401 Unauthorized
Content-Type: application/json; charset=utf-8

{
  "message": "Invalid API key",
  "error": "Unauthorized",
  "statusCode": 401
}
```

#### Scenario B: Request with valid API key (Allowed)
```bash
curl -i -X POST http://localhost:3001/api/events \
  -H "Content-Type: application/json" \
  -H "x-api-key: campus-secret-key-2026" \
  -d '{"title":"Cloud Seminar","description":"Intro to AWS","location":"Hall A","eventDate":"2026-12-05T09:00:00.000Z","category":"technology","isPublished":true}'
```
**HTTP Response:**
```http
HTTP/1.1 201 Created
Content-Type: application/json; charset=utf-8
```

---

### 3. Git Commit & Push Instructions for Part 3

Stage, commit, and push this milestone:

```bash
git add module04/day9/campus-events-api/src/events/events.controller.ts module04/day9/README.md
git commit -m "feat(backend): part 3 - protect create event route with ApiKeyGuard"
git push
```

---

## Part 4: Timing Interceptor Implementation

### 1. What is an Interceptor?

An **Interceptor** is a class annotated with `@Injectable()` that implements the `NestInterceptor` interface. Interceptors are inspired by Aspect-Oriented Programming (AOP) and allow developers to execute custom logic **before** and **after** a controller route handler executes.

They implement the `intercept` method:
```typescript
intercept(context: ExecutionContext, next: CallHandler): Observable<any>
```

#### Key Capabilities:
- **Execution Timing**: Measuring the total duration taken by controller and service logic.
- **Response Transformation**: Mutating or standardizing the shape of response objects.
- **Side Effects**: Emitting metrics, telemetry, or cache invalidation events upon successful execution.
- **Exception Overriding**: Catching errors thrown by downstream handlers and transforming them.

---

### 2. How the Timing Interceptor Works

```
Incoming Request
       │
       ▼
┌────────────────────────────────────────────────────────┐
│ Interceptor (Pre-handler): Capture start timestamp     │
│ const start = Date.now();                              │
└──────────────────────────┬─────────────────────────────┘
                           ▼
┌────────────────────────────────────────────────────────┐
│ next.handle() invokes Controller & Service             │
└──────────────────────────┬─────────────────────────────┘
                           ▼
┌────────────────────────────────────────────────────────┐
│ Observable pipeline: RxJS tap() operator               │
│ Interceptor (Post-handler): duration = Date.now() - start
│ Sets X-Response-Time header and logs duration          │
└──────────────────────────┬─────────────────────────────┘
                           ▼
Outgoing Response to Client
```

- **`CallHandler`**: Wraps the downstream execution chain. Calling `next.handle()` returns an RxJS `Observable` representing the deferred execution of the route handler.
- **`pipe(tap(...))`**: The RxJS `tap` operator performs a side effect (calculating elapsed milliseconds and logging) without mutating the returned response payload.

---

### 3. Source Code: `src/common/interceptors/timing.interceptor.ts`

```typescript
import {
  Injectable,
  NestInterceptor,
  ExecutionContext,
  CallHandler,
} from '@nestjs/common';
import { Observable } from 'rxjs';
import { tap } from 'rxjs/operators';
import { Request, Response } from 'express';

@Injectable()
export class TimingInterceptor implements NestInterceptor {
  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    const start = Date.now();
    const http = context.switchToHttp();
    const request = http.getRequest<Request>();
    const response = http.getResponse<Response>();

    console.log(`[TimingInterceptor] Request started: ${request.method} ${request.url}`);

    return next.handle().pipe(
      tap(() => {
        const duration = Date.now() - start;
        console.log(`[TimingInterceptor] Request completed in ${duration}ms for ${request.method} ${request.url}`);
        if (!response.headersSent) {
          response.setHeader('X-Response-Time', `${duration}ms`);
        }
      }),
    );
  }
}
```

---

### 4. Git Commit & Push Instructions for Part 4

Stage, commit, and push this milestone:

```bash
git add module04/day9/campus-events-api/src/common/interceptors/timing.interceptor.ts module04/day9/README.md
git commit -m "feat(backend): part 4 - implement timing interceptor with CallHandler and RxJS tap"
git push
```

---

## Part 5: Applying Interceptors to Controller (`@UseInterceptors(TimingInterceptor)`)

### 1. Controller-Level Interceptor Binding

To ensure consistent performance monitoring across all event endpoints, we bind the `TimingInterceptor` directly to the `EventsController` class using the `@UseInterceptors(TimingInterceptor)` decorator.

When an interceptor is bound at the controller level:
1. It automatically wraps **every handler method** inside `EventsController` (`findAll`, `findUpcoming`, `findPublished`, `findOne`, `findSessions`, `findOneSession`, and `create`).
2. There is no need to manually annotate individual route handlers, adhering to DRY (Don't Repeat Yourself) design principles.
3. Every request processed by the controller logs the start timestamp, execution duration, and attaches the `X-Response-Time` HTTP header to the client response.

#### Source Code: `src/events/events.controller.ts`
```typescript
import {
  Body,
  Controller,
  Get,
  Post,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { ApiKeyGuard } from '../common/guards/api-key.guard';
import { TimingInterceptor } from '../common/interceptors/timing.interceptor';

@UseInterceptors(TimingInterceptor)
@Controller('events')
export class EventsController {
  // All routes inside this controller automatically execute TimingInterceptor
}
```

---

### 2. Execution Behavior & Verification

When any request is sent to `EventsController` (e.g. `GET /api/events`):
```bash
curl -i -X GET http://localhost:3001/api/events
```

**Terminal Output:**
```text
[LoggerMiddleware] [2026-11-24T10:40:00.000Z] GET /api/events
[TimingInterceptor] Request started: GET /api/events
[TimingInterceptor] Request completed in 4ms for GET /api/events
```

**HTTP Response Headers:**
```http
HTTP/1.1 200 OK
X-Response-Time: 4ms
X-Total-Count: 6
Content-Type: application/json; charset=utf-8
```

---

### 3. Git Commit & Push Instructions for Part 5

Stage, commit, and push this milestone:

```bash
git add module04/day9/campus-events-api/src/events/events.controller.ts module04/day9/README.md
git commit -m "feat(backend): part 5 - bind timing interceptor to events controller"
git push
```

---

## Part 6: Pipes & DTO Validation (`ParseIntPipe` & `CreateEventDto`)

### 1. What is a Pipe?

In NestJS, a **Pipe** operates at the parameter level immediately before the controller handler receives arguments. Pipes serve two primary functions:
1. **Transformation**: Converting input data into the desired type or shape (e.g., parsing a query string `"2"` into a numeric primitive `2`).
2. **Validation**: Evaluating incoming input against predefined validation rules (e.g., verifying that a title is a non-empty string and that an event date adheres to ISO 8601 formatting).

If a pipe encounters invalid data, it short-circuits execution and immediately throws an HTTP 400 Bad Request exception before the controller or service method can be invoked.

---

### 2. Primitive Parameter Transformation with `ParseIntPipe`

Query parameters in HTTP requests always arrive at the web server as strings:
```http
GET /api/events/example?page=2
```

Without a pipe, `page` would be the string `"2"`. Passing strings directly into numeric calculations or database pagination offsets causes subtle runtime bugs.

Using `ParseIntPipe`:
```typescript
@Get('example')
findPage(@Query('page', ParseIntPipe) page: number) {
  return {
    page,
    message: 'Page received successfully',
  };
}
```

#### Verification:
- **Valid Request:**
  ```bash
  curl -X GET http://localhost:3001/api/events/example?page=2
  ```
  **Response (HTTP 200 OK):**
  ```json
  {
    "page": 2,
    "message": "Page received successfully"
  }
  ```

- **Invalid Request:**
  ```bash
  curl -X GET http://localhost:3001/api/events/example?page=hello
  ```
  **Response (HTTP 400 Bad Request):**
  ```json
  {
    "message": "Validation failed (numeric string is expected)",
    "error": "Bad Request",
    "statusCode": 400
  }
  ```

---

### 3. Data Transfer Object Validation (`CreateEventDto`)

To validate structured request bodies sent to `POST /api/events`, we define a Data Transfer Object (DTO) using decorators from the `class-validator` package:

#### Source Code: `src/events/dto/create-event.dto.ts`
```typescript
import {
  IsBoolean,
  IsDateString,
  IsNotEmpty,
  IsString,
} from 'class-validator';

export class CreateEventDto {
  @IsString()
  @IsNotEmpty()
  title: string;

  @IsString()
  @IsNotEmpty()
  description: string;

  @IsString()
  @IsNotEmpty()
  location: string;

  @IsDateString()
  eventDate: string;

  @IsString()
  @IsNotEmpty()
  category: string;

  @IsBoolean()
  isPublished: boolean;
}
```

#### Validation Rules Enforced:
- **`title`**, **`description`**, **`location`**, **`category`**: Must be strings and cannot be empty or whitespace-only (`@IsString()`, `@IsNotEmpty()`).
- **`eventDate`**: Must be a valid ISO 8601 date string (e.g. `2026-12-04T09:00:00.000Z`) (`@IsDateString()`).
- **`isPublished`**: Must be an explicit boolean `true` or `false` (`@IsBoolean()`).

---

### 4. Git Commit & Push Instructions for Part 6

Stage, commit, and push this milestone:

```bash
git add module04/day9/campus-events-api/src/events/dto/create-event.dto.ts module04/day9/campus-events-api/src/events/events.controller.ts module04/day9/README.md
git commit -m "feat(validation): implement CreateEventDto class-validator rules and ParseIntPipe parameter transformation"
git push
```

---

## Part 7: Global ValidationPipe Configuration in `main.ts`

### 1. Activating Global Validation

While Pipes can be applied at the parameter or handler level, input validation is a global security requirement across all ingress points. In NestJS, `ValidationPipe` is enabled globally via `app.useGlobalPipes()` during application bootstrap.

#### Source Code: `src/main.ts`
```typescript
import { NestFactory } from '@nestjs/core';
import { ValidationPipe } from '@nestjs/common';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  app.enableCors();
  app.setGlobalPrefix('api');

  // Enforce global data validation and transformation pipeline
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true, // Strips non-whitelisted properties from request payloads
      transform: true, // Automatically converts incoming payloads to DTO instance objects
    }),
  );

  const port = process.env.PORT || 3001;
  await app.listen(port);
  console.log(`Application is running on: http://localhost:${port}/api`);
}

bootstrap();
```

---

### 2. ValidationPipe Configuration Mechanics

1. **`whitelist: true`**:
   - Strips any incoming property from the request body that does not possess a validation decorator in the target DTO.
   - Prevents Mass Assignment and property injection vulnerabilities (e.g., an attacker trying to submit `{ "id": "custom-uuid", "isAdmin": true }`).
2. **`transform: true`**:
   - Automatically deserializes plain JavaScript object literals into true instances of the target DTO class.
   - Enables class-transformer decorators such as `@Type(() => Number)` on pagination query parameters.

---

### 3. Execution Behavior & Verification

#### Scenario A: Invalid payload submitted to `POST /api/events`
A client submits an event with missing fields and an invalid date:
```bash
curl -i -X POST http://localhost:3001/api/events \
  -H "Content-Type: application/json" \
  -H "x-api-key: campus-secret-key-2026" \
  -d '{"title":"","eventDate":"not-a-date"}'
```

**HTTP 400 Bad Request Response:**
```json
{
  "message": [
    "title should not be empty",
    "description should not be empty",
    "description must be a string",
    "location should not be empty",
    "location must be a string",
    "eventDate must be a valid ISO 8601 date string",
    "category should not be empty",
    "category must be a string",
    "isPublished must be a boolean value"
  ],
  "error": "Bad Request",
  "statusCode": 400
}
```

The request is rejected at the pipe layer before any controller handler or database/service state is touched.

---

### 4. Git Commit & Push Instructions for Part 7

Stage, commit, and push this milestone:

```bash
git add module04/day9/campus-events-api/src/main.ts module04/day9/README.md
git commit -m "feat(validation): configure global ValidationPipe with whitelist and transform options"
git push
```

---

## Part 8: End-to-End Testing Suite & Backend Testing Checklist

### 1. 15-Point Backend Testing Checklist

The following matrix documents the full test suite implemented in `requests.http`, covering all CRUD operations, filtering, pagination, error boundaries, and NestJS lifecycle components:

| No. | Test Scenario | HTTP Method & Target URL | Expected Result | Verified Status |
| :-: | :--- | :--- | :--- | :---: |
| **1** | **GET All Events** | `GET /api/events` | `200 OK` returning array of campus events | Verified |
| **2** | **Filter by Category** | `GET /api/events?category=technology` | `200 OK` with events filtered by matching category | Verified |
| **3** | **Filter by Publication Status**| `GET /api/events?isPublished=true` | `200 OK` returning only published events | Verified |
| **4** | **Sort and Paginate** | `GET /api/events?sortBy=eventDate&order=asc&page=1&limit=3` | `200 OK` returning sorted events with pagination metadata | Verified |
| **5** | **Get Upcoming Events** | `GET /api/events/upcoming` | `200 OK` returning events occurring today or later | Verified |
| **6** | **Get Existing Event by ID** | `GET /api/events/1` | `200 OK` with event details | Verified |
| **7** | **Get Missing Event** | `GET /api/events/999999` | `404 Not Found` with structured error payload | Verified |
| **8** | **Get Event Sessions** | `GET /api/events/1/sessions` | `200 OK` returning array of sessions for event ID 1 | Verified |
| **9** | **Create Valid Event** | `POST /api/events` (with `x-api-key`) | `201 Created` returning newly stored event | Verified |
| **10**| **Create Invalid Event** | `POST /api/events` (with `{}`) | `400 Bad Request` with array of DTO validation errors | Verified |
| **11**| **Middleware Logging** | `GET /api/events` | Request logged to terminal with timestamp, method, and URL | Verified |
| **12**| **Guard Authentication Check** | `POST /api/events` (without `x-api-key`) | `401 Unauthorized` with message `"Invalid API key"` | Verified |
| **13**| **Timing Interceptor** | `GET /api/events` | `X-Response-Time` header present; duration logged to terminal | Verified |
| **14**| **ParseIntPipe Transformation** | `GET /api/events/example?page=hello` | `400 Bad Request` (`Validation failed (numeric string is expected)`) | Verified |
| **15**| **ValidationPipe DTO Integrity** | `POST /api/events` (`eventDate: "invalid"`) | `400 Bad Request` (`eventDate must be a valid ISO 8601 date string`) | Verified |

---

### 2. Complete Lifecycle Walkthrough (The 4 Concepts in Action)

When an event organizer submits a new campus event (`POST /api/events`), the four core architectural components interact in precise sequence:

1. **Step 1 — Middleware (`LoggerMiddleware`)**:
   - The logger intercepts the raw request first and prints:
     ```text
     [2026-11-24T10:45:00.000Z] POST /api/events
     ```
   - Calls `next()` to advance execution to routing and guards.
2. **Step 2 — Guard (`ApiKeyGuard`)**:
   - The guard inspects the `x-api-key` header.
   - If missing or invalid, halts execution immediately with `401 Unauthorized`.
   - If valid (`campus-secret-key-2026`), returns `true`.
3. **Step 3 — Interceptor (`TimingInterceptor` Pre-Handler)**:
   - Records the start time (`start = Date.now()`).
   - Logs `[TimingInterceptor] Request started: POST /api/events`.
   - Calls `next.handle()` to proceed down the pipeline.
4. **Step 4 — Pipe (`ValidationPipe`)**:
   - Evaluates the incoming JSON body against `CreateEventDto`.
   - Strips unwhitelisted properties (`whitelist: true`).
   - Rejects missing fields or bad formats with `400 Bad Request`.
5. **Step 5 — Controller (`EventsController.create`)**:
   - Receives the validated `CreateEventDto` and dispatches to `EventsService.create()`.
6. **Step 6 — Service (`EventsService`)**:
   - Executes business rules, checks for schedule conflicts, persists the event in the in-memory array, and returns the created `CampusEvent`.
7. **Step 7 — Interceptor (`TimingInterceptor` Post-Handler)**:
   - RxJS `tap()` triggers upon response stream completion.
   - Calculates total latency: `duration = Date.now() - start`.
   - Injects `X-Response-Time: 6ms` into the outgoing HTTP headers.
8. **Step 8 — HTTP Response**:
   - NestJS sends HTTP `201 Created` with the serialized event object to the client.

---

### 3. Git Commit & Push Instructions for Part 8

Stage, commit, and push this milestone:

```bash
git add module04/day9/requests.http module04/day9/README.md
git commit -m "test(api): implement 15-scenario end-to-end HTTP test suite and lifecycle verification matrix"
git push
```

---

## Part 9: Architecture Documentation & Viva Examination

### 1. Installation & Running Instructions

#### Prerequisites
- Node.js v18+ or v20+
- npm or yarn

#### Setup & Execution
```bash
# 1. Navigate to the backend application folder
cd module04/day9/campus-events-api

# 2. Install dependencies
npm install

# 3. Configure environment variables
cp .env.example .env

# 4. Run development server (with hot reload)
npm run start:dev

# 5. Build production bundle
npm run build
```

The server initializes on port `3001` (configured via `PORT=3001`) with the global routing prefix `/api`:
- **API Base URL:** `http://localhost:3001/api`
- **Swagger Documentation:** `http://localhost:3001/docs`

---

### 2. In-Memory Data Storage Architecture

The backend utilizes an in-memory TypeScript repository structure within `EventsService`:
- Initialized with **6 production-like campus events** covering `technology`, `career`, `academic`, and `arts` categories.
- Initialized with associated **Session records** detailing agenda start/end times and rooms.
- Mutation operations (`create`, filtering, sorting, pagination) operate with thread-safe JavaScript array operations, ensuring rapid prototyping and deterministic state during test suite runs.

---

### 3. Comprehensive Backend Viva Questions & Answers

#### Q1: What is middleware, and when does it run?
**Answer:** Middleware is a function or class that executes early in the HTTP request pipeline, before the request reaches guards, interceptors, pipes, or route handlers. It has access to the raw incoming `Request`, outgoing `Response`, and the `NextFunction` callback. It is used for cross-cutting tasks such as HTTP logging, request enrichment, CORS header handling, and request ID generation.

#### Q2: Why do we call `next()` inside middleware?
**Answer:** Calling `next()` delegates control to the subsequent middleware or routing handler in the Express/NestJS execution chain. If `next()` is not called and the middleware does not transmit an HTTP response (e.g., `res.send()`), the request pipeline stalls and the client connection hangs indefinitely until a gateway timeout occurs.

#### Q3: What is a request ID, and how can middleware attach one to a request?
**Answer:** A request ID is a unique identifier (such as a UUID v4) assigned to an incoming HTTP transaction. Middleware can extract an existing ID from headers (e.g., `x-request-id`) or generate one using `crypto.randomUUID()`, attaching it to `req.headers['x-request-id']` and setting it on the outgoing response header via `res.setHeader('X-Request-Id', id)`. This enables end-to-end distributed tracing across microservices and log aggregation systems.

#### Q4: What is a guard?
**Answer:** A guard is a NestJS class annotated with `@Injectable()` that implements the `CanActivate` interface. Its sole responsibility is to evaluate whether an incoming request is authorized to proceed to the target handler based on permissions, roles, API keys, or JWT tokens.

#### Q5: What does `CanActivate` do?
**Answer:** `CanActivate` defines a single mandatory method: `canActivate(context: ExecutionContext)`. It returns a boolean (or a Promise/Observable resolving to a boolean). Returning `true` permits execution to continue; returning `false` or throwing an exception causes NestJS to reject the request with HTTP 403 Forbidden or HTTP 401 Unauthorized.

#### Q6: What is the difference between authentication and authorization?
**Answer:**
- **Authentication (AuthN):** Verifying *who* the caller is (identity proof, such as validating a password, JWT token, or API key).
- **Authorization (AuthZ):** Verifying *what* permissions the authenticated caller has (access control, such as checking whether a student has the `ADMIN` role required to delete an event).

#### Q7: What is an interceptor?
**Answer:** An interceptor is an Aspect-Oriented Programming (AOP) component that implements `NestInterceptor`. It wraps the execution of the route handler, allowing code to run both *before* the controller/service executes and *after* the handler returns an Observable, enabling execution timing, response transformation, caching, and custom error translation.

#### Q8: What does `next.handle()` do?
**Answer:** Inside an interceptor's `intercept(context, next)` method, `next` is a `CallHandler`. Invoking `next.handle()` triggers the actual controller handler and service execution down the line, returning an RxJS `Observable` representing the deferred response stream.

#### Q9: Why do we use `tap()` in an interceptor?
**Answer:** `tap()` is an RxJS operator used to invoke a side effect (such as calculating elapsed execution duration and logging) when the Observable emits or completes, *without* modifying the underlying response data payload emitted to the client.

#### Q10: What is a pipe?
**Answer:** A pipe is a class implementing `PipeTransform` that executes immediately before the route handler receives method arguments. Pipes perform two operations:
1. **Transformation:** Coercing input data into an expected type or format (e.g., parsing a string to an integer).
2. **Validation:** Evaluating input data against constraints and rejecting invalid data with HTTP 400 Bad Request.

#### Q11: What is the difference between `ParseIntPipe` and `ValidationPipe`?
**Answer:**
- **`ParseIntPipe`:** A specialized parameter-level pipe that parses and converts a single primitive string argument into an integer primitive, throwing an HTTP 400 error if conversion fails.
- **`ValidationPipe`:** A comprehensive pipe (frequently applied globally) that validates complex structured objects (DTOs) using declarative decorator rules from `class-validator` (e.g., `@IsString()`, `@IsDateString()`), stripping non-whitelisted properties and rejecting non-conforming payloads.

#### Q12: What is a DTO?
**Answer:** A Data Transfer Object (DTO) is an object schema that defines the structure and contract of data transmitted over the network between client and server. In NestJS, DTOs are written using TypeScript classes decorated with `class-validator` rules, serving as compile-time types and runtime validation boundaries.

#### Q13: Why should validation happen before the service processes data?
**Answer:** Performing validation at the pipe layer before service invocation enforces fail-fast defensive design:
1. Prevents malformed, incomplete, or malicious data from corrupting in-memory state or database tables.
2. Keeps business logic in services clean, decoupling domain rules from ingress format checking.
3. Protects backend resources by rejecting invalid requests immediately with minimal CPU and memory consumption.

#### Q14: What is the difference between a controller and a service?
**Answer:**
- **Controller:** Responsible for the HTTP transport layer—handling incoming routing, status codes, query/param binding, and delegating to services.
- **Service:** Contains the business logic, domain rules, calculation routines, and persistence/database operations, completely decoupled from HTTP protocols.

#### Q15: What happens when a request fails validation?
**Answer:** NestJS's `ValidationPipe` catches the validation constraint violations, halts execution before the controller is reached, and automatically returns an HTTP 400 Bad Request response containing a structured JSON array detailing every violated constraint.

#### Q16: Can a request pass middleware and still be rejected by a guard?
**Answer:** **Yes.** Middleware executes first regardless of user identity. A request passes through `LoggerMiddleware` (logging the incoming request), reaches the routing layer, and is then evaluated by `ApiKeyGuard`. If the API key is missing or invalid, the guard rejects the request with HTTP 401 Unauthorized, preventing it from reaching the interceptor, pipe, controller, or service.

#### Q17: How do middleware, guards, interceptors, and pipes differ?
**Answer:**

| Architectural Layer | Execution Order | Scope of Responsibility | Primary Question Answered |
| :--- | :---: | :--- | :--- |
| **Middleware** | 1st | General request logging, body parsing, header enrichment | *"What general preparation or logging does this request require?"* |
| **Guard** | 2nd | Authentication, permissions, and access control | *"Is this caller permitted to access this resource?"* |
| **Interceptor (Pre)**| 3rd | Latency start recording, request context wrapping | *"What setup is needed before the handler begins?"* |
| **Pipe** | 4th | Input parsing, type conversion, and DTO validation | *"Is the incoming payload structurally valid and properly typed?"* |
| **Controller** | 5th | HTTP route dispatching and delegating | *"Which operation should run?"* |
| **Service** | 6th | Domain rules and data persistence | *"How should the business operation be carried out?"* |
| **Interceptor (Post)**| 7th | Performance metrics calculation, response header injection | *"How long did execution take, and should the response be modified?"* |

---

### 4. Git Commit & Push Instructions for Part 9

Stage, commit, and push this milestone:

```bash
git add module04/day9/README.md
git commit -m "docs(architecture): complete backend architecture guide, installation instructions, and 17 viva questions"
git push
```
