const http = require('http');

const users = [
  { id: 1, name: 'Greeshma', age: 20 },
  { id: 2, name: 'Shruti', age: 19 },
  { id: 3, name: 'Sneha', age: 20 }
];

const server = http.createServer((req, res) => {
  if (req.url === '/users' && req.method === 'GET') {
    res.writeHead(200, { 'Content-Type': 'application/json' });
    res.end(JSON.stringify(users));
  }

  else if (req.url === '/app/info' && req.method === 'GET') {
    const info = {
      course: 'backend development',
      module: 'day 3 - structure & coding',
      status: 'active'
    };
    res.writeHead(200, { 'Content-Type': 'application/json' });
    res.end(JSON.stringify(info));
  }

  else {
    res.writeHead(404, { 'Content-Type': 'application/json' });
    res.end(JSON.stringify({ message: 'Endpoint not found' }));
  }
});

const PORT = 5000;
server.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}/app/info`);
});