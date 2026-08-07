const { spawn } = require('child_process');
const path = require('path');
const dotenv = require('dotenv');

dotenv.config();

const backendPort = process.env.PORT || 3000;
let frontendPort = 5173; // Default

// Start Express Backend
const backend = spawn('node', ['server.js'], {
  env: { ...process.env, PORT: backendPort.toString() },
  stdio: ['pipe', 'pipe', 'pipe']
});

// Start Frontend Dev Server via Vite programmatically
const viteBin = path.join(__dirname, 'node_modules', 'vite', 'bin', 'vite.js');
const frontend = spawn('node', [viteBin, '--port', '5173'], {
  env: process.env,
  stdio: ['pipe', 'pipe', 'pipe']
});

let backendReady = false;
let frontendReady = false;
let bannerPrinted = false;

function printBanner() {
  console.clear();
  console.log('──────────────────────────────────────────────');
  console.log('🌿 C.L.E.A.R. Development Server\n');
  console.log(`Frontend : http://localhost:${frontendPort}`);
  console.log(`Backend  : http://localhost:${backendPort}\n`);
  console.log('Press Ctrl+C to stop both services.');
  console.log('──────────────────────────────────────────────\n');
  bannerPrinted = true;
}

backend.stdout.on('data', (data) => {
  const str = data.toString();
  if (str.includes('running on port') || str.includes('Server running')) {
    backendReady = true;
    if (backendReady && frontendReady && !bannerPrinted) {
      printBanner();
    }
  }
  
  if (bannerPrinted) {
    process.stdout.write(`[Backend] ${str}`);
  }
});

backend.stderr.on('data', (data) => {
  process.stderr.write(`[Backend Error] ${data}`);
});

frontend.stdout.on('data', (data) => {
  const str = data.toString();
  const cleanStr = str.replace(/\u001b\[[0-9;]*m/g, ''); // Strip ANSI escape codes
  
  // Parse port from Vite stdout
  const match = cleanStr.match(/http:\/\/localhost:(\d+)/) || cleanStr.match(/http:\/\/127\.0\.0\.1:(\d+)/);
  if (match) {
    frontendPort = parseInt(match[1], 10);
    frontendReady = true;
    if (backendReady && frontendReady && !bannerPrinted) {
      printBanner();
    }
  }
  
  if (bannerPrinted) {
    // Suppress verbose startup messages after banner is printed
    if (!cleanStr.includes('Local:') && !cleanStr.includes('Network:') && !cleanStr.includes('ready in') && !cleanStr.includes('press h + enter')) {
      process.stdout.write(str);
    }
  }
});

frontend.stderr.on('data', (data) => {
  process.stderr.write(`[Frontend Error] ${data}`);
});

backend.on('close', (code) => {
  console.log(`\n[Backend] Process exited with code ${code}`);
  frontend.kill('SIGINT');
  process.exit(code || 0);
});

frontend.on('close', (code) => {
  console.log(`\n[Frontend] Process exited with code ${code}`);
  backend.kill('SIGINT');
  process.exit(code || 0);
});

// Handle termination signals
process.on('SIGINT', () => {
  console.log('\nStopping development servers...');
  backend.kill('SIGINT');
  frontend.kill('SIGINT');
  process.exit(0);
});

process.on('SIGTERM', () => {
  backend.kill('SIGTERM');
  frontend.kill('SIGTERM');
  process.exit(0);
});

// Fallback in case logs are formatted differently
setTimeout(() => {
  if (!bannerPrinted) {
    backendReady = true;
    frontendReady = true;
    printBanner();
  }
}, 4000);
