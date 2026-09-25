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

app.get('/api/events', async (req, res) => {
  try {
    const [events] = await db.query(
      `SELECT e.id, e.name, c.name AS category, e.event_date, e.event_time,
              e.location, e.venue, e.ticket_price, e.image_url, e.short_description
       FROM events e
       INNER JOIN categories c ON e.category_id = c.id
       WHERE e.is_suspended = 0 AND e.event_date >= CURDATE()
       ORDER BY e.event_date ASC, e.event_time ASC`
    );

    res.json(events);
  } catch (error) {
    console.error('Could not load events:', error.message);
    res.status(500).json({ message: 'Unable to load events' });
  }
});

app.listen(PORT, () => {
  console.log('Server running at http://localhost:' + PORT);
});
