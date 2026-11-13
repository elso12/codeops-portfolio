const http = require('http');

const PORT = process.env.PORT || 3000;
const BASE_URL = `http://127.0.0.1:${PORT}/api`;

async function request(method, path, body = null) {
  return new Promise((resolve, reject) => {
    const url = new URL(BASE_URL + path);
    const options = {
      hostname: url.hostname,
      port: url.port,
      path: url.pathname + url.search,
      method: method,
      headers: {
        'Content-Type': 'application/json',
      },
    };

    const req = http.request(options, (res) => {
      let data = '';
      res.on('data', (chunk) => (data += chunk));
      res.on('end', () => {
        let json;
        try {
          json = JSON.parse(data);
        } catch {
          json = data;
        }
        resolve({
          statusCode: res.statusCode,
          headers: res.headers,
          body: json,
        });
      });
    });

    req.on('error', (err) => reject(err));

    if (body) {
      req.write(JSON.stringify(body));
    }
    req.end();
  });
}

const tests = [
  {
    no: 1,
    name: 'Get all events',
    method: 'GET',
    path: '/events',
    expectedStatus: 200,
  },
  {
    no: 2,
    name: 'Filter by category',
    method: 'GET',
    path: '/events?category=technology',
    expectedStatus: 200,
  },
  {
    no: 3,
    name: 'Filter by publication status',
    method: 'GET',
    path: '/events?isPublished=true',
    expectedStatus: 200,
  },
  {
    no: 4,
    name: 'Sort and paginate',
    method: 'GET',
    path: '/events?sortBy=eventDate&order=asc&page=2&limit=2',
    expectedStatus: 200,
  },
  {
    no: 5,
    name: 'Get upcoming events',
    method: 'GET',
    path: '/events/upcoming',
    expectedStatus: 200,
  },
  {
    no: 6,
    name: 'Get an existing event',
    method: 'GET',
    path: '/events/evt-101',
    expectedStatus: 200,
  },
  {
    no: 7,
    name: 'Request a missing event',
    method: 'GET',
    path: '/events/not-real',
    expectedStatus: 404,
  },
  {
    no: 8,
    name: 'Get sessions for an event',
    method: 'GET',
    path: '/events/evt-101/sessions',
    expectedStatus: 200,
  },
  {
    no: 9,
    name: 'Get a session under its event',
    method: 'GET',
    path: '/events/evt-101/sessions/ses-201',
    expectedStatus: 200,
  },
  {
    no: 10,
    name: 'Create a valid event',
    method: 'POST',
    path: '/events',
    body: {
      title: 'Intro to Cloud Computing',
      description: 'A beginner-friendly campus workshop.',
      location: 'Engineering Block, Room 2',
      eventDate: '2026-12-04T09:00:00.000Z',
      category: 'technology',
      isPublished: true,
    },
    expectedStatus: 201,
  },
  {
    no: 11,
    name: 'Create an event with missing title',
    method: 'POST',
    path: '/events',
    body: {
      description: 'A beginner-friendly campus workshop.',
      location: 'Engineering Block, Room 2',
      eventDate: '2026-12-04T09:00:00.000Z',
      category: 'technology',
      isPublished: true,
    },
    expectedStatus: 400,
  },
  {
    no: 12,
    name: 'Reject unsupported sort fields (Stretch)',
    method: 'GET',
    path: '/events?sortBy=invalidField',
    expectedStatus: 400,
  },
  {
    no: 13,
    name: 'Search query matching words in title (Stretch)',
    method: 'GET',
    path: '/events?search=bootcamp',
    expectedStatus: 200,
  },
  {
    no: 14,
    name: 'Filter by date range dateFrom and dateTo (Stretch)',
    method: 'GET',
    path: '/events?dateFrom=2026-11-01&dateTo=2026-11-30',
    expectedStatus: 200,
  },
  {
    no: 15,
    name: 'Request session that does not belong to event (Cross-event check)',
    method: 'GET',
    path: '/events/evt-101/sessions/ses-203',
    expectedStatus: 404,
  },
  {
    no: 16,
    name: 'Get published events only (Stretch)',
    method: 'GET',
    path: '/events/published',
    expectedStatus: 200,
  },
];

async function run() {
  console.log('Starting Test Suite for Campus Events API...');
  let passedCount = 0;
  const results = [];

  for (const test of tests) {
    try {
      const res = await request(test.method, test.path, test.body);
      const passed = res.statusCode === test.expectedStatus;
      if (passed) passedCount++;

      const record = {
        no: test.no,
        name: test.name,
        request: `${test.method} /api${test.path}`,
        expectedStatus: test.expectedStatus,
        actualStatus: res.statusCode,
        statusMatch: passed ? 'PASS' : 'FAIL',
        headerXTotalCount: res.headers['x-total-count'] || null,
        bodyPreview: JSON.stringify(res.body).slice(0, 150) + (JSON.stringify(res.body).length > 150 ? '...' : ''),
        fullBody: res.body,
      };
      results.push(record);
      console.log(`[${passed ? 'PASS' : 'FAIL'}] #${test.no} ${test.name} -> HTTP ${res.statusCode} (Expected: ${test.expectedStatus})`);
    } catch (err) {
      console.error(`[ERROR] #${test.no} ${test.name}:`, err.message);
      results.push({
        no: test.no,
        name: test.name,
        request: `${test.method} /api${test.path}`,
        expectedStatus: test.expectedStatus,
        actualStatus: 'ERR',
        statusMatch: 'FAIL',
        error: err.message,
      });
    }
  }

  console.log(`\nTest Summary: ${passedCount}/${tests.length} tests passed.`);
  const fs = require('fs');
  fs.writeFileSync('test-results.json', JSON.stringify(results, null, 2));
  console.log('Results saved to test-results.json');
}

run();
