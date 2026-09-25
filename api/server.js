const express = require('express');
const db = require('./event_db');

const app = express();
const PORT = 3000;

app.get('/api/health', (req, res) => {
  res.json({
    status: 'ok',
    message: 'Charity events API is running'
  });
});

app.get('/api/categories', async (req, res) => {
  try {
    const [categories] = await db.query(
      'SELECT id, name FROM categories ORDER BY name ASC'
    );

    res.json(categories);
  } catch (error) {
    console.error('Could not load categories:', error.message);
    res.status(500).json({ message: 'Unable to load categories' });
  }
});

app.listen(PORT, () => {
  console.log('Server running at http://localhost:' + PORT);
});
