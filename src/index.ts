import express, { Request, Response } from 'express';

const app = express();
const PORT = 3000;

app.use(express.json());

// Mock cache for demonstration purposes
let cachedToken: string | null = null;
let tokenExpiration: Date | null = null;

// Helper function to generate a mock token
const generateToken = () => {
  // In a real scenario, this would call an external service or generate a real token
  return `mock_wecom_token_${Date.now()}`;
};

// POST /wecom/getToken
app.post('/wecom/getToken', (req: Request, res: Response) => {
  // 1. Basic Authentication
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith('Basic ')) {
    return res.status(401).json({ code: 1, message: 'Unauthorized: Basic authentication required' });
  }

  const credentials = Buffer.from(authHeader.split(' ')[1], 'base64').toString();
  const [clientId, clientSecret] = credentials.split(':');

  // For demonstration, let's use hardcoded credentials. In a real app, these would be validated against a database or config.
  if (clientId !== '001' || clientSecret !== '001') {
    return res.status(401).json({ code: 1, message: 'Unauthorized: Invalid client credentials' });
  }

  // 2. Handle forceRefresh parameter
  const { forceRefresh } = req.body as { forceRefresh?: boolean };

  let tokenToReturn: string;

  if (forceRefresh || !cachedToken || (tokenExpiration && new Date() > tokenExpiration)) {
    // Generate a new token
    tokenToReturn = generateToken();
    cachedToken = tokenToReturn;
    // Set expiration for 1 hour from now for mock purposes
    tokenExpiration = new Date(Date.now() + 60 * 60 * 1000);
    console.log('Generated new token');
  } else {
    // Use cached token
    tokenToReturn = cachedToken;
    console.log('Using cached token');
  }

  // 3. Return response
  res.json({ code: 0, token: tokenToReturn });
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
