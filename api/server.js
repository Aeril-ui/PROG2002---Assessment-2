const express = require('express');
const path = require('path');
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

app.get('/api/events/search', async (req, res) => {
  try {
    const { date, location, category } = req.query;

    let sql = `SELECT e.id, e.name, c.name AS category, e.event_date, e.event_time,
                      e.location, e.venue, e.ticket_price, e.image_url, e.short_description
               FROM events e
               INNER JOIN categories c ON e.category_id = c.id
               WHERE e.is_suspended = 0 AND e.event_date >= CURDATE()`;
    const params = [];

    if (date) {
      sql += ' AND e.event_date = ?';
      params.push(date);
    }

    if (location) {
      sql += ' AND e.location LIKE ?';
      params.push('%' + location + '%');
    }

    if (category) {
      sql += ' AND e.category_id = ?';
      params.push(category);
    }

    sql += ' ORDER BY e.event_date ASC, e.event_time ASC';

    const [events] = await db.query(sql, params);

    res.json(events);
  } catch (error) {
    console.error('Could not search events:', error.message);
    res.status(500).json({ message: 'Unable to search events' });
  }
});

app.get('/api/events/:id', async (req, res) => {
  try {
    const eventId = req.params.id;

    const [rows] = await db.query(
      `SELECT e.id, e.name, c.name AS category, e.event_date, e.event_time,
              e.location, e.venue, e.ticket_price, e.image_url, e.short_description,
              e.purpose, e.full_description, e.goal_amount, e.progress_amount,
              e.is_suspended, o.name AS organisation
       FROM events e
       INNER JOIN categories c ON e.category_id = c.id
       INNER JOIN organisations o ON e.organisation_id = o.id
       WHERE e.id = ?`,
      [eventId]
    );

    if (rows.length === 0) {
      return res.status(404).json({ message: 'Event not found' });
    }

    res.json(rows[0]);
  } catch (error) {
    console.error('Could not load event:', error.message);
    res.status(500).json({ message: 'Unable to load event' });
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

app.use(express.static(path.join(__dirname, '../client')));

app.listen(PORT, () => {
  console.log('Server running at http://localhost:' + PORT);
});
