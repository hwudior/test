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

app.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}`);
});
