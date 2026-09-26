const searchForm = document.getElementById('search-form');
const dateInput = document.getElementById('date');
const locationInput = document.getElementById('location');
const categorySelect = document.getElementById('category');
const clearButton = document.getElementById('clear-filters');
const formMessage = document.getElementById('form-message');

function showFormMessage(text) {
  formMessage.textContent = text;
  formMessage.hidden = false;
}

function clearFormMessage() {
  formMessage.textContent = '';
  formMessage.hidden = true;
}

function resetFilters() {
  dateInput.value = '';
  locationInput.value = '';
  categorySelect.value = '';
  clearFormMessage();
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
});
