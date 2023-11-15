const cardList = document.getElementById('game-list');
const searchBar = document.getElementById('search-bar');
const searchBtn = document.getElementById('search-button');
const spinner = document.querySelector('.spinner-border');

const baseURL = `https://api.rawg.io/api/games?key=${environment.myKey}`
// const baseURL = '../samplegames.json';

function fetchGames(searchStr = '') {
    toggleSpinner();
    if (searchStr !== '')
        fetch(`${baseURL}&search=${encodeURIComponent(searchStr)}`)
            .then(res => res.json())
            .then(data => updateGames(data['results']));
    else
        fetch(baseURL)
            .then(res => res.json())
            .then(data => updateGames(data['results']));
}

function updateGames(gameList) {
    cardList.innerHTML = '';
    gameList.forEach(game => addGameCard(game));
    toggleSpinner();
}

function addGameCard(gameData) {
    let gameCard = document.createElement('div');
    gameCard.classList = 'card m-3 p-0 h-25';
    gameCard.style.width = '18rem';

    let thumbnail = document.createElement('img');
    thumbnail.src = gameData['background_image'];
    thumbnail.classList = 'card-img-top';
    gameCard.appendChild(thumbnail);

    let cardBody = document.createElement('div');
    cardBody.classList = 'card-body';
    gameCard.appendChild(cardBody);

    let cardTitle = document.createElement('h3');
    cardTitle.classList = 'card-title mb-3 fw-bolder';
    cardTitle.textContent = gameData['name'];
    cardBody.appendChild(cardTitle);

    let buttonRow = document.createElement('div');
    buttonRow.classList = 'row justify-content-end pe-3';
    cardBody.appendChild(buttonRow);

    let addBtn = document.createElement('a');
    addBtn.href = '#';
    addBtn.classList = 'fs-6 fw-lighter w-auto btn btn-dark p-0 ps-2 pe-2';
    addBtn.textContent = 'Add ';
    buttonRow.appendChild(addBtn);

    let icon = document.createElement('i');
    icon.classList = 'bi bi-plus-lg';
    addBtn.appendChild(icon);

    cardList.appendChild(gameCard);
}

function toggleSpinner() {
    spinner.classList.toggle('d-none');
}

function searchGames() {
    fetchGames(searchBar.value);
}

fetchGames();

// Event-listeners
searchBtn.addEventListener('click', searchGames);