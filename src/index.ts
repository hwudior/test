import express, { Request, Response } from 'express';

const app = express();
const PORT = 3000;

app.use(express.json());

// In-memory cache for demonstration purposes
interface WecomToken {
  token: string;
  expiresAt: number;
}

let cachedToken: WecomToken | null = null;

// Helper function to generate a mock Wecom token
const generateWecomToken = () => {
  const token = `mock_wecom_token_${Date.now()}`;
  const expiresAt = Date.now() + 7200 * 1000; // Token valid for 2 hours (Wecom default)
  return { token, expiresAt };
};

// POST /wecom/getToken
app.post('/wecom/getToken', (req: Request, res: Response) => {
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith('Basic ')) {
    return res.status(401).json({ code: 1, message: 'Unauthorized: Basic Auth required' });
  }

  const credentials = Buffer.from(authHeader.split(' ')[1], 'base64').toString();
  const [clientId, clientSecret] = credentials.split(':');

  // For demonstration, let's assume valid credentials are '001' and '001'
  if (clientId !== '001' || clientSecret !== '001') {
    return res.status(401).json({ code: 1, message: 'Unauthorized: Invalid credentials' });
  }

  const { forceRefresh } = req.body as { forceRefresh?: boolean };

  if (forceRefresh || !cachedToken || cachedToken.expiresAt <= Date.now()) {
    cachedToken = generateWecomToken();
  }

  res.json({ code: 0, token: cachedToken?.token });
});

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

app.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}`);
});
