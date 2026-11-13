const { spawn } = require('child_process');
const http = require('http');

const PORT = 3000;

console.log('Starting NestJS server for testing on port', PORT);
const server = spawn('node', ['dist/main.js'], {
  env: { ...process.env, PORT: String(PORT) },
  stdio: ['ignore', 'inherit', 'inherit'],
});

function waitForServer(retries = 40) {
  return new Promise((resolve, reject) => {
    const check = (remaining) => {
      const req = http.get(`http://127.0.0.1:${PORT}/api/events`, (res) => {
        resolve();
      });
      req.on('error', (err) => {
        if (remaining <= 0) {
          return reject(new Error('Server failed to start in time: ' + err.message));
        }
        setTimeout(() => check(remaining - 1), 300);
      });
    };
    check(retries);
  });
}

async function main() {
  try {
    await waitForServer();
    console.log('\n--- Server is ready! Running test suite ---');

    const testProc = spawn('node', ['test-suite.js'], {
      env: { ...process.env, PORT: String(PORT) },
      stdio: 'inherit',
    });
    testProc.on('exit', (code) => {
      console.log('Test suite completed with code:', code);
      server.kill();
      process.exit(code || 0);
    });
  } catch (err) {
    console.error('Error during test execution:', err);
    server.kill();
    process.exit(1);
  }
}

main();
