const http = require('http');
const { Socket } = require('net');
const fs = require('fs');
const { NestFactory } = require('@nestjs/core');
const { ValidationPipe } = require('@nestjs/common');
const { AppModule } = require('./dist/app.module');

const testCases = [
  {
    no: 1,
    name: 'Get all events (default pagination)',
    method: 'GET',
    url: '/api/events',
    expectedStatus: 200,
  },
  {
    no: 2,
    name: 'Filter by category (technology)',
    method: 'GET',
    url: '/api/events?category=technology',
    expectedStatus: 200,
  },
  {
    no: 3,
    name: 'Filter by publication status (isPublished=true)',
    method: 'GET',
    url: '/api/events?isPublished=true',
    expectedStatus: 200,
  },
  {
    no: 4,
    name: 'Sort and paginate (sortBy=eventDate, order=asc, page=2, limit=2)',
    method: 'GET',
    url: '/api/events?sortBy=eventDate&order=asc&page=2&limit=2',
    expectedStatus: 200,
  },
  {
    no: 5,
    name: 'Get upcoming events (eventDate >= today)',
    method: 'GET',
    url: '/api/events/upcoming',
    expectedStatus: 200,
  },
  {
    no: 6,
    name: 'Get an existing event (evt-101)',
    method: 'GET',
    url: '/api/events/evt-101',
    expectedStatus: 200,
  },
  {
    no: 7,
    name: 'Request a missing event (not-real -> 404 Not Found)',
    method: 'GET',
    url: '/api/events/not-real',
    expectedStatus: 404,
  },
  {
    no: 8,
    name: 'Get sessions for an event (evt-101)',
    method: 'GET',
    url: '/api/events/evt-101/sessions',
    expectedStatus: 200,
  },
  {
    no: 9,
    name: 'Get a session under its event (evt-101 / ses-201)',
    method: 'GET',
    url: '/api/events/evt-101/sessions/ses-201',
    expectedStatus: 200,
  },
  {
    no: 10,
    name: 'Create a valid event (POST -> 201 Created)',
    method: 'POST',
    url: '/api/events',
    body: {
      title: 'Intro to Cloud Computing',
      description: 'A beginner-friendly campus workshop on AWS, Docker, and CI/CD.',
      location: 'Engineering Block, Room 2',
      eventDate: '2026-12-04T09:00:00.000Z',
      category: 'technology',
      isPublished: true,
    },
    expectedStatus: 201,
  },
  {
    no: 11,
    name: 'Create an event with missing title (POST -> 400 Bad Request)',
    method: 'POST',
    url: '/api/events',
    body: {
      description: 'A workshop missing title field.',
      location: 'Engineering Block, Room 2',
      eventDate: '2026-12-04T09:00:00.000Z',
      category: 'technology',
      isPublished: true,
    },
    expectedStatus: 400,
  },
  {
    no: 12,
    name: 'Reject unsupported sort fields (sortBy=invalidField -> 400 Bad Request)',
    method: 'GET',
    url: '/api/events?sortBy=invalidField',
    expectedStatus: 400,
  },
  {
    no: 13,
    name: 'Search query matching words in title (search=bootcamp)',
    method: 'GET',
    url: '/api/events?search=bootcamp',
    expectedStatus: 200,
  },
  {
    no: 14,
    name: 'Filter by date range (dateFrom=2026-11-01&dateTo=2026-11-30)',
    method: 'GET',
    url: '/api/events?dateFrom=2026-11-01&dateTo=2026-11-30',
    expectedStatus: 200,
  },
  {
    no: 15,
    name: 'Cross-event session mismatch (ses-203 under evt-101 -> 404 Not Found)',
    method: 'GET',
    url: '/api/events/evt-101/sessions/ses-203',
    expectedStatus: 404,
  },
  {
    no: 16,
    name: 'Sessions for missing event (not-real/sessions -> 404 Not Found)',
    method: 'GET',
    url: '/api/events/not-real/sessions',
    expectedStatus: 404,
  },
  {
    no: 17,
    name: 'Get published events only (Stretch static route)',
    method: 'GET',
    url: '/api/events/published',
    expectedStatus: 200,
  },
];

async function runTestSuite() {
  console.log('Bootstrapping NestJS Application...');
  const app = await NestFactory.create(AppModule, { logger: false });

  app.setGlobalPrefix('api');
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
      transform: true,
      transformOptions: {
        enableImplicitConversion: false,
      },
    }),
  );

  await app.init();
  const server = app.getHttpServer();

  function makeRequest(method, url, body = null) {
    return new Promise((resolve) => {
      const socket = new Socket();
      const req = new http.IncomingMessage(socket);
      req.method = method;
      req.url = url;
      req.headers = {
        host: '127.0.0.1',
        'content-type': 'application/json',
      };
      if (body) {
        req.headers['content-length'] = Buffer.byteLength(JSON.stringify(body));
      }

      const res = new http.ServerResponse(req);
      let resBody = '';
      const origWrite = res.write.bind(res);
      const origEnd = res.end.bind(res);

      res.write = function (chunk, ...args) {
        if (chunk) resBody += chunk.toString();
        return origWrite(chunk, ...args);
      };

      res.end = function (chunk, ...args) {
        if (chunk) resBody += chunk.toString();
        origEnd(chunk, ...args);
        let parsed;
        try {
          parsed = JSON.parse(resBody);
        } catch {
          parsed = resBody;
        }
        resolve({
          statusCode: res.statusCode,
          headers: res.getHeaders(),
          body: parsed,
        });
      };

      server.emit('request', req, res);

      if (body) {
        req.push(JSON.stringify(body));
      }
      req.push(null);
    });
  }

  console.log('Executing test cases...\n');
  const results = [];
  let passedCount = 0;

  for (const tc of testCases) {
    const res = await makeRequest(tc.method, tc.url, tc.body);
    const passed = res.statusCode === tc.expectedStatus;
    if (passed) passedCount++;

    const entry = {
      no: tc.no,
      name: tc.name,
      method: tc.method,
      endpoint: tc.url,
      expectedStatus: tc.expectedStatus,
      actualStatus: res.statusCode,
      passed,
      headerXTotalCount: res.headers['x-total-count'] || null,
      response: res.body,
    };
    results.push(entry);

    const statusBadge = passed ? '\x1b[32m[PASS]\x1b[0m' : '\x1b[31m[FAIL]\x1b[0m';
    console.log(`${statusBadge} Test #${tc.no.toString().padStart(2, '0')}: ${tc.method} ${tc.url} -> HTTP ${res.statusCode} (Expected: ${tc.expectedStatus})`);
  }

  console.log(`\n=========================================`);
  console.log(`TOTAL RESULT: ${passedCount} / ${testCases.length} Tests Passed!`);
  console.log(`=========================================\n`);

  fs.writeFileSync('test-results.json', JSON.stringify(results, null, 2));
  console.log('Saved detailed results to test-results.json');

  await app.close();
}

runTestSuite().catch((err) => {
  console.error('Test suite failed:', err);
  process.exit(1);
});

