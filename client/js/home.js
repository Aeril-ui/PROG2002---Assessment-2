const eventsList = document.getElementById('events-list');
const eventsMessage = document.getElementById('events-message');

function formatDate(dateString) {
  const parts = dateString.split('-');
  const year = parts[0];
  const month = parts[1];
  const day = parts[2];
  const months = [
    'January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December'
  ];
  const monthName = months[Number(month) - 1];
  return day + ' ' + monthName + ' ' + year;
}

function formatTime(timeString) {
  return timeString.slice(0, 5);
}

function formatTicketPrice(price) {
  if (Number(price) === 0) {
    return 'Free';
  }
  return '$' + Number(price).toFixed(2);
}

function showEventsMessage(text) {
  eventsMessage.textContent = text;
  eventsMessage.hidden = false;
}

function clearEventsMessage() {
  eventsMessage.textContent = '';
  eventsMessage.hidden = true;
}

function buildEventCard(event) {
  const card = document.createElement('article');
  card.className = 'event-card';

  const image = document.createElement('img');
  image.className = 'event-card-image';
  image.src = event.image_url;
  image.alt = event.name;

  const body = document.createElement('div');
  body.className = 'event-card-body';

  const title = document.createElement('h3');
  const titleLink = document.createElement('a');
  titleLink.href = 'event.html?id=' + event.id;
  titleLink.textContent = event.name;
  title.appendChild(titleLink);

  const category = document.createElement('p');
  category.className = 'event-meta';
  category.textContent = event.category;

  const when = document.createElement('p');
  when.className = 'event-meta';
  when.textContent = formatDate(event.event_date) + ' at ' + formatTime(event.event_time);

  const where = document.createElement('p');
  where.className = 'event-meta';
  where.textContent = event.location + ' · ' + event.venue;

  const summary = document.createElement('p');
  summary.textContent = event.short_description;

  const price = document.createElement('p');
  price.className = 'event-price';
  price.textContent = 'Ticket: ' + formatTicketPrice(event.ticket_price);

  const detailsLink = document.createElement('a');
  detailsLink.className = 'event-link';
  detailsLink.href = 'event.html?id=' + event.id;
  detailsLink.textContent = 'View event details';

  body.appendChild(title);
  body.appendChild(category);
  body.appendChild(when);
  body.appendChild(where);
  body.appendChild(summary);
  body.appendChild(price);
  body.appendChild(detailsLink);

  card.appendChild(image);
  card.appendChild(body);

  return card;
}

function renderEvents(events) {
  eventsList.innerHTML = '';

  if (events.length === 0) {
    showEventsMessage('There are no upcoming events at the moment.');
    return;
  }

  clearEventsMessage();

  const grid = document.createElement('div');
  grid.className = 'event-grid';

  events.forEach(function (event) {
    grid.appendChild(buildEventCard(event));
  });

  eventsList.appendChild(grid);
}

fetch('/api/events')
  .then(function (response) {
    if (!response.ok) {
      throw new Error('Request failed');
    }
    return response.json();
  })
  .then(function (events) {
    renderEvents(events);
  })
  .catch(function () {
    eventsList.innerHTML = '';
    showEventsMessage('Unable to load events. Please try again later.');
  });
