function addHistory(event) {
  const searchHistory = JSON.parse(localStorage.getItem('search-history')) || [];
  const item = {
    'name': event.currentTarget.dataset.name,
    'time': Date.now()
  };
  searchHistory.push(item);
  localStorage.setItem('search-history', JSON.stringify(searchHistory));
  displayHistory();
}

function displayHistory() {
  const searchHistory = JSON.parse(localStorage.getItem('search-history')) || [];
  const historyList = document.querySelector('.list--history');
  const html = searchHistory.map(item => (
    `<li class="list-item">
      <span class="list-item--half">
        <span class="name">${item.name}</span>
      </span>
      <span class="list-item--half">
        <span class="time">
          ${Intl.DateTimeFormat('en', { year: 'numeric', month: '2-digit', day: '2-digit', hour: 'numeric', minute: 'numeric' }).format(item.time)}
        </span>
        <button class="remove">Delete</button>
      </span>
    </li>`)
  ).join('');
  historyList.innerHTML = html;

  const btnSelector = document.querySelectorAll('.remove');
  btnSelector.forEach(btn => btn.addEventListener('click', removeSearchItem));
}

function removeSearchItem(event) {
  event.preventDefault();
  const listItem = event.currentTarget.closest('.list-item');
  const name = listItem.childNodes[1].innerText;
  listItem.remove();
  const searchHistory = JSON.parse(localStorage.getItem('search-history')) || [];
  const updatedItems = searchHistory.filter(item => item.name !== name);
  localStorage.setItem('search-history', JSON.stringify(updatedItems));
}

function clearSearchHistory() {
  localStorage.clear('search-history');
  displayHistory();
}

function clearSearchResults(event) {
  event.target.style.visibility = 'hidden';
  suggestions.innerHTML = '<li>Search for a City</li>';
}

function findMatches(wordToMatch, items) {
  return items.filter(item => {
    const regex = new RegExp(wordToMatch, 'gi');
    return item['City'].match(regex);
  })
}

async function displayMatches() {
  clearSearch.style.visibility = this.value.length ? 'visible' : 'hidden';
  const response = await fetch('https://indian-cities-api-nocbegfhqg.now.sh/cities');
  const data = await response.json();
  const matchArray = findMatches(this.value, data);
  let html = '';

  if (!this.value.length) {
    html = '<li>Search for a City</li>';
  }
  else if (!matchArray.length) {
    html = '<li>No matches found</li>';
  }
  else {
    html = matchArray.map(place => {
      const regex = new RegExp(this.value, 'gi');
      const name = place['City'];
      const cityName = name.replace(regex, `<span class="hl">${this.value}</span>`);
      return `<li class="list-item" data-name="${place['City'].toLowerCase()}"><span class="city">${cityName.toLowerCase()}</span></li>`;
    }).join('');
  }

  results.classList.remove('hidden');
  suggestions.innerHTML = html;
  displayHistory();

  const cityList = document.querySelectorAll('.list--suggestions .list-item');
  cityList.forEach(city => city.addEventListener('click', addHistory));
  clearSearch.addEventListener('click', clearSearchResults);
}

const searchInput = document.querySelector('.search-input');
const clearSearch = document.querySelector('.remove-search');
const results = document.querySelector('.results');
const history = document.querySelector('.history-list');
const clear = document.querySelector('.clear-search');
const suggestions = document.querySelector('.list--suggestions');

clear.addEventListener('click', clearSearchHistory);
searchInput.addEventListener('keyup', displayMatches);
