import express, { Request, Response } from 'express';

const app = express();
const PORT = 3000;

app.use(express.json());

// GET /
app.get('/', (_req: Request, res: Response) => {
  res.json({ message: 'Hello, World!' });
});

// GET /items
const items = [
  { id: 1, name: 'Item 1' },
  { id: 2, name: 'Item 2' },
];

app.get('/items', (_req: Request, res: Response) => {
  res.json(items);
});

// POST /items
app.post('/items', (req: Request, res: Response) => {
  const { name } = req.body as { name: string };
  const newItem = { id: items.length + 1, name };
  items.push(newItem);
  res.status(201).json(newItem);
});

// POST /wecom/getToken
app.post('/wecom/getToken', (req: Request, res: Response) => {
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith('Basic ')) {
    return res.status(401).json({ code: 1, message: 'Unauthorized: Basic Auth required' });
  }

  const encoded = authHeader.split(' ')[1];
  const decoded = Buffer.from(encoded, 'base64').toString('utf8');
  const [clientId, clientSecret] = decoded.split(':');

  // For demonstration, we'll just check if clientId and clientSecret are present.
  // In a real application, you would validate these credentials.
  if (!clientId || !clientSecret) {
    return res.status(401).json({ code: 1, message: 'Unauthorized: Invalid Basic Auth credentials' });
  }

  const { forceRefresh } = req.body as { forceRefresh?: boolean };

  // Mock token generation and caching logic
  let wecomToken: string;
  if (forceRefresh) {
    wecomToken = 'new_wecom_token_' + Date.now();
  } else {
    // In a real scenario, you'd check a cache for a valid token
    wecomToken = 'cached_wecom_token';
  }

  res.json({ code: 0, token: wecomToken });
});

app.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}`);
});
