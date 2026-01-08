#!/usr/bin/env node
const { spawn, execSync } = require('child_process');
const http = require('http');

function waitForServer(url, timeout = 30000) {
  const start = Date.now();
  return new Promise((resolve, reject) => {
    const check = () => {
      const req = http.get(url, (res) => {
        res.resume();
        resolve();
      });
      req.on('error', () => {
        if (Date.now() - start > timeout) {
          reject(new Error(`Server did not become available within ${timeout}ms`));
        } else {
          setTimeout(check, 500);
        }
      });
      req.setTimeout(2000, () => req.destroy());
    };
    check();
  });
}

async function main() {
  let previewProc;
  try {
    console.log('1) Generating images...');
    execSync('npm run gen:images', { stdio: 'inherit' });

    console.log('2) Building site...');
    execSync('npm run build', { stdio: 'inherit' });

    console.log('3) Starting preview server on :61900...');
    previewProc = spawn('npm', ['run', 'preview', '--', '-p', '61900'], { stdio: 'inherit' });

    process.on('SIGINT', () => {
      console.log('\nInterrupted — shutting down preview...');
      if (previewProc) previewProc.kill('SIGTERM');
      process.exit(1);
    });

    await waitForServer('http://localhost:61900');
    console.log('Preview is up.');

    console.log('4) Running coverage script...');
    execSync('node scripts/coverage.cjs', { stdio: 'inherit', env: Object.assign({}, process.env, { BASE_URL: 'http://localhost:61900' }) });

    console.log('5) Running Lighthouse...');
    execSync('npx lighthouse http://localhost:61900 --quiet --output json --output-path=lighthouse-report.json --chrome-flags="--headless" --only-categories=performance,accessibility,best-practices,seo', { stdio: 'inherit' });

    console.log('\nPerf run complete. Reports written: coverage-report.json, lighthouse-report.json');
  } catch (err) {
    console.error('\nPerf run failed:', err.message || err);
    process.exitCode = 1;
  } finally {
    if (previewProc) {
      console.log('Shutting down preview server...');
      previewProc.kill('SIGTERM');
    }
  }
}

main();
