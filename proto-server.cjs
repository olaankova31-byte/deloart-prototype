const http = require('http');
const fs = require('fs');
const path = require('path');

const ROOT = __dirname;
const PORT = parseInt(process.env.PORT, 10) || 4175;

const mime = {
  '.html': 'text/html; charset=utf-8',
  '.css': 'text/css; charset=utf-8',
  '.js': 'text/javascript; charset=utf-8',
  '.png': 'image/png',
  '.jpg': 'image/jpeg',
  '.jpeg': 'image/jpeg',
  '.svg': 'image/svg+xml',
  '.woff2': 'font/woff2',
  '.woff': 'font/woff',
  '.json': 'application/json; charset=utf-8',
};

http.createServer((req, res) => {
  let p;
  try {
    p = decodeURIComponent(new URL(req.url, 'http://x').pathname);
  } catch (e) {
    res.writeHead(400);
    return res.end('bad request');
  }
  if (p === '/') {
    res.writeHead(302, { Location: '/prototype/index.html' });
    return res.end();
  }
  const f = path.normalize(path.join(ROOT, p));
  if (!f.startsWith(ROOT)) {
    res.writeHead(403);
    return res.end('forbidden');
  }
  fs.readFile(f, (e, d) => {
    if (e) {
      res.writeHead(404, { 'Content-Type': 'text/plain; charset=utf-8' });
      return res.end('404 ' + p);
    }
    res.writeHead(200, {
      'Content-Type': mime[path.extname(f).toLowerCase()] || 'application/octet-stream',
      'Cache-Control': 'no-cache',
    });
    res.end(d);
  });
}).listen(PORT, () => console.log('deloart prototype on ' + PORT + ' root=' + ROOT));
