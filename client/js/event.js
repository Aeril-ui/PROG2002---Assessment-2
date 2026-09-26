const eventDetails = document.getElementById('event-details');
const eventMessage = document.getElementById('event-message');

function getEventIdFromUrl() {
  const params = new URLSearchParams(window.location.search);
  return params.get('id');
}

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

function formatMoney(amount) {
  return '$' + Number(amount).toFixed(2);
}

function showEventMessage(text) {
  eventMessage.textContent = text;
  eventMessage.hidden = false;
}

function renderEvent(event) {
  eventDetails.innerHTML = '';

  const title = document.createElement('h1');
  title.className = 'page-title';
  title.textContent = event.name;

  const image = document.createElement('img');
  image.className = 'event-detail-image';
  image.src = event.image_url;
  image.alt = event.name;

  const meta = document.createElement('p');
  meta.className = 'event-meta';
  meta.textContent = event.category + ' · ' + event.organisation;

  const when = document.createElement('p');
  when.textContent = formatDate(event.event_date) + ' at ' + formatTime(event.event_time);

  const where = document.createElement('p');
  where.textContent = event.location + ' · ' + event.venue;

  const purposeTitle = document.createElement('h2');
  purposeTitle.className = 'detail-heading';
  purposeTitle.textContent = 'Purpose';

  const purpose = document.createElement('p');
  purpose.textContent = event.purpose;

  const aboutTitle = document.createElement('h2');
  aboutTitle.className = 'detail-heading';
  aboutTitle.textContent = 'About this event';

  const description = document.createElement('p');
  description.textContent = event.full_description;

  const ticketTitle = document.createElement('h2');
  ticketTitle.className = 'detail-heading';
  ticketTitle.textContent = 'Ticket';

  const ticket = document.createElement('p');
  ticket.textContent = formatTicketPrice(event.ticket_price);

  const goalTitle = document.createElement('h2');
  goalTitle.className = 'detail-heading';
  goalTitle.textContent = 'Fundraising progress';

  const progress = document.createElement('p');
  progress.textContent =
    formatMoney(event.progress_amount) + ' raised of ' + formatMoney(event.goal_amount) + ' goal';

  const progressBar = document.createElement('div');
  progressBar.className = 'progress-bar';
  const progressFill = document.createElement('div');
  progressFill.className = 'progress-fill';
  let percent = 0;
  if (Number(event.goal_amount) > 0) {
    percent = Math.min(100, (Number(event.progress_amount) / Number(event.goal_amount)) * 100);
  }
  progressFill.style.width = percent + '%';
  progressBar.appendChild(progressFill);

  const registerButton = document.createElement('button');
  registerButton.type = 'button';
  registerButton.className = 'btn btn-primary register-btn';
  registerButton.textContent = 'Register';
  registerButton.addEventListener('click', function () {
    window.alert('This feature is currently under construction.');
  });

  eventDetails.appendChild(title);
  eventDetails.appendChild(image);
  eventDetails.appendChild(meta);
  eventDetails.appendChild(when);
  eventDetails.appendChild(where);
  eventDetails.appendChild(purposeTitle);
  eventDetails.appendChild(purpose);
  eventDetails.appendChild(aboutTitle);
  eventDetails.appendChild(description);
  eventDetails.appendChild(ticketTitle);
  eventDetails.appendChild(ticket);
  eventDetails.appendChild(goalTitle);
  eventDetails.appendChild(progress);
  eventDetails.appendChild(progressBar);
  eventDetails.appendChild(registerButton);
}

const eventId = getEventIdFromUrl();

if (!eventId) {
  showEventMessage('No event was selected. Please choose an event from the home or search page.');
} else {
  fetch('/api/events/' + eventId)
    .then(function (response) {
      if (response.status === 404) {
        throw new Error('not-found');
      }
      if (!response.ok) {
        throw new Error('Request failed');
      }
      return response.json();
    })
    .then(function (event) {
      renderEvent(event);
    })
    .catch(function (error) {
      eventDetails.innerHTML = '';
      if (error.message === 'not-found') {
        showEventMessage('That event could not be found.');
      } else {
        showEventMessage('Unable to load this event. Please try again later.');
      }
    });
}
