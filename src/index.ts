import express, { Request, Response, NextFunction } from 'express';

const app = express();
const PORT = 3000;

app.use(express.json());

// Basic Authentication Middleware
const basicAuth = (req: Request, res: Response, next: NextFunction) => {
  const authHeader = req.headers.authorization;

  if (!authHeader) {
    return res.status(401).json({ code: 401, message: 'Authorization header missing' });
  }

  const [authType, authValue] = authHeader.split(' ');

  if (authType !== 'Basic' || !authValue) {
    return res.status(401).json({ code: 401, message: 'Unsupported authorization type' });
  }

  try {
    const decodedAuth = Buffer.from(authValue, 'base64').toString();
    const [clientId, clientSecret] = decodedAuth.split(':');

    // For demonstration purposes, let's assume valid credentials are '001' and '001'
    if (clientId === '001' && clientSecret === '001') {
      next();
    } else {
      res.status(401).json({ code: 401, message: 'Invalid credentials' });
    }
  } catch (error) {
    res.status(401).json({ code: 401, message: 'Invalid authorization token' });
  }
};

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
app.post('/wecom/getToken', basicAuth, (req: Request, res: Response) => {
  const { forceRefresh } = req.body as { forceRefresh?: boolean };

  // In a real scenario, you would implement logic to fetch/generate/cache the WeCom token here.
  // For this task, we'll return a mock token.
  const mockToken = 'MOCK_WECOM_ACCESS_TOKEN_12345';

  if (forceRefresh) {
    console.log('Force refreshing WeCom token...');
    // Logic to force generate a new token
  } else {
    console.log('Preferring cached WeCom token...');
    // Logic to prefer cached token
  }

  res.json({ code: 0, accessToken: mockToken, expiresIn: 7200 });
});

app.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}`);
});
