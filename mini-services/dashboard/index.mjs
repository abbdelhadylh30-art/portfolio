import { createServer } from 'http';
import { readFileSync } from 'fs';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

const PORT = 3001;
const __dirname = dirname(fileURLToPath(import.meta.url));

// Simple redirect server - sends users to the dashboard page on the main app
const HTML = `<!DOCTYPE html>
<html>
<head>
  <meta charset="UTF-8">
  <title>Dashboard Redirect</title>
  <style>
    body { background: #0a0a0a; color: white; font-family: Inter, sans-serif; display: flex; align-items: center; justify-content: center; min-height: 100vh; margin: 0; }
    .card { background: #1a1a1a; border: 1px solid #2a2a2a; border-radius: 16px; padding: 40px; text-align: center; max-width: 400px; }
    h1 { font-size: 24px; margin-bottom: 8px; }
    h1 span { color: #10b981; }
    p { color: #a0a0a0; font-size: 14px; margin-bottom: 24px; }
    a { display: inline-block; padding: 12px 24px; background: #10b981; color: white; border-radius: 8px; text-decoration: none; font-weight: 500; }
    a:hover { background: #059669; }
  </style>
</head>
<body>
  <div class="card">
    <h1>Dashboard <span>Panel</span></h1>
    <p>Click below to access the admin dashboard</p>
    <a href="/dashboard?XTransformPort=3000">Open Dashboard</a>
  </div>
</body>
</html>`;

const server = createServer((req, res) => {
  const url = req.url || '/';

  if (url === '/favicon.ico') {
    res.writeHead(204);
    res.end();
    return;
  }

  res.writeHead(200, { 'Content-Type': 'text/html; charset=utf-8' });
  res.end(HTML);
});

server.listen(PORT, '0.0.0.0', () => {
  console.log(`🚀 Dashboard Portal running on http://localhost:${PORT}`);
});

process.on('uncaughtException', () => {});
