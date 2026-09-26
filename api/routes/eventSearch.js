const db = require('../event_db');

async function eventSearch(req, res) {
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
      params.push('%' + String(location).trim() + '%');
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
}

module.exports = eventSearch;
