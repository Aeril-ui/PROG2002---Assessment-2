var express = require('express');
var path = require('path');
var db = require('./event_db');

var app = express();
var PORT = 3000;

app.get('/api/health', function (req, res) {
  res.json({
    status: 'ok',
    message: 'Charity events API is running'
  });
});

app.get('/api/categories', function (req, res) {
  db.query('SELECT id, name FROM categories ORDER BY name ASC')
    .then(function (result) {
      var categories = result[0];
      res.json(categories);
    })
    .catch(function (error) {
      console.error('Could not load categories:', error.message);
      res.status(500).json({ message: 'Unable to load categories' });
    });
});

app.get('/api/events/search', function (req, res) {
  var date = req.query.date;
  var location = req.query.location;
  var category = req.query.category;

  var sql =
    'SELECT e.id, e.name, c.name AS category, e.event_date, e.event_time, ' +
    'e.location, e.venue, e.ticket_price, e.image_url, e.short_description ' +
    'FROM events e ' +
    'INNER JOIN categories c ON e.category_id = c.id ' +
    'WHERE e.is_suspended = 0 AND e.event_date >= CURDATE()';
  var params = [];

  if (date) {
    sql = sql + ' AND e.event_date = ?';
    params.push(date);
  }

  if (location) {
    sql = sql + ' AND e.location LIKE ?';
    params.push('%' + location + '%');
  }

  if (category) {
    sql = sql + ' AND e.category_id = ?';
    params.push(category);
  }

  sql = sql + ' ORDER BY e.event_date ASC, e.event_time ASC';

  db.query(sql, params)
    .then(function (result) {
      var events = result[0];
      res.json(events);
    })
    .catch(function (error) {
      console.error('Could not search events:', error.message);
      res.status(500).json({ message: 'Unable to search events' });
    });
});

app.get('/api/events/:id', function (req, res) {
  var eventId = req.params.id;

  var sql =
    'SELECT e.id, e.name, c.name AS category, e.event_date, e.event_time, ' +
    'e.location, e.venue, e.ticket_price, e.image_url, e.short_description, ' +
    'e.purpose, e.full_description, e.goal_amount, e.progress_amount, ' +
    'e.is_suspended, o.name AS organisation ' +
    'FROM events e ' +
    'INNER JOIN categories c ON e.category_id = c.id ' +
    'INNER JOIN organisations o ON e.organisation_id = o.id ' +
    'WHERE e.id = ?';

  db.query(sql, [eventId])
    .then(function (result) {
      var rows = result[0];
      if (rows.length === 0) {
        res.status(404).json({ message: 'Event not found' });
        return;
      }
      res.json(rows[0]);
    })
    .catch(function (error) {
      console.error('Could not load event:', error.message);
      res.status(500).json({ message: 'Unable to load event' });
    });
});

app.get('/api/events', function (req, res) {
  var sql =
    'SELECT e.id, e.name, c.name AS category, e.event_date, e.event_time, ' +
    'e.location, e.venue, e.ticket_price, e.image_url, e.short_description ' +
    'FROM events e ' +
    'INNER JOIN categories c ON e.category_id = c.id ' +
    'WHERE e.is_suspended = 0 AND e.event_date >= CURDATE() ' +
    'ORDER BY e.event_date ASC, e.event_time ASC';

  db.query(sql)
    .then(function (result) {
      var events = result[0];
      res.json(events);
    })
    .catch(function (error) {
      console.error('Could not load events:', error.message);
      res.status(500).json({ message: 'Unable to load events' });
    });
});

app.use(express.static(path.join(__dirname, '../client')));

app.listen(PORT, function () {
  console.log('Server running at http://localhost:' + PORT);
});
