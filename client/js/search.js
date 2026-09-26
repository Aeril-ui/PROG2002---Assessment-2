const searchForm = document.getElementById('search-form');
const dateInput = document.getElementById('date');
const locationInput = document.getElementById('location');
const categorySelect = document.getElementById('category');
const clearButton = document.getElementById('clear-filters');
const formMessage = document.getElementById('form-message');
const searchResults = document.getElementById('search-results');
const searchMessage = document.getElementById('search-message');

function formatDate(dateString) {
  const parts = String(dateString).slice(0, 10).split('-');
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

function showFormMessage(text) {
  formMessage.textContent = text;
  formMessage.hidden = false;
}

function clearFormMessage() {
  formMessage.textContent = '';
  formMessage.hidden = true;
}

function showSearchMessage(text) {
  searchMessage.textContent = text;
  searchMessage.hidden = false;
}

function clearSearchMessage() {
  searchMessage.textContent = '';
  searchMessage.hidden = true;
}

function resetFilters() {
  dateInput.value = '';
  locationInput.value = '';
  categorySelect.value = '';
  searchResults.innerHTML = '';
  clearFormMessage();
  clearSearchMessage();
}

function fillCategoryOptions(categories) {
  categorySelect.innerHTML = '';

  const defaultOption = document.createElement('option');
  defaultOption.value = '';
  defaultOption.textContent = 'All categories';
  categorySelect.appendChild(defaultOption);

  categories.forEach(function (category) {
    const option = document.createElement('option');
    option.value = category.id;
    option.textContent = category.name;
    categorySelect.appendChild(option);
  });
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

function renderSearchResults(events) {
  searchResults.innerHTML = '';

  if (events.length === 0) {
    showSearchMessage('No events match your search. Try different filters.');
    return;
  }

  clearSearchMessage();

  const grid = document.createElement('div');
  grid.className = 'event-grid';

  events.forEach(function (event) {
    grid.appendChild(buildEventCard(event));
  });

  searchResults.appendChild(grid);
}

function buildSearchUrl() {
  const params = new URLSearchParams();

  if (dateInput.value) {
    params.set('date', dateInput.value);
  }

  if (locationInput.value.trim()) {
    params.set('location', locationInput.value.trim());
  }

  if (categorySelect.value) {
    params.set('category', categorySelect.value);
  }

  const query = params.toString();
  if (query) {
    return '/api/events/search?' + query;
  }
  return '/api/events/search';
}

fetch('/api/categories')
  .then(function (response) {
    if (!response.ok) {
      throw new Error('Request failed');
    }
    return response.json();
  })
  .then(function (categories) {
    fillCategoryOptions(categories);
    clearFormMessage();
  })
  .catch(function () {
    showFormMessage('Unable to load categories. Please refresh the page.');
  });

clearButton.addEventListener('click', function () {
  resetFilters();
});

searchForm.addEventListener('submit', function (event) {
  event.preventDefault();
  clearSearchMessage();
  searchResults.innerHTML = '';

  fetch(buildSearchUrl())
    .then(function (response) {
      if (!response.ok) {
        throw new Error('Request failed');
      }
      return response.json();
    })
    .then(function (events) {
      renderSearchResults(events);
    })
    .catch(function () {
      showSearchMessage('Unable to search events. Please try again later.');
    });
});
