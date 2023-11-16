const cardList = document.getElementById('game-list');
const searchBar = document.getElementById('search-bar');
const searchBtn = document.getElementById('search-button');
const spinner = document.querySelector('.spinner-border');

// currently displayed games array
let currentData = [];

// const baseURL = `https://api.rawg.io/api/games?key=${environment.myKey}`
const baseURL = '../samplegames.json';

// sends a request to the server with or without search value
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

// reloads all the games with the new data
function updateGames(gameList) {
    currentData = gameList;
    cardList.innerHTML = '';
    gameList.forEach(game => addGameCard(game));
    toggleSpinner();
}

// creates a card from game data
function addGameCard(gameData) {
    let gameCard = document.createElement('div');
    gameCard.classList = 'card m-3 p-0 h-25 shadow-sm dark-card';
    gameCard.style.width = '18rem';

    let thumbnail = document.createElement('img');
    thumbnail.src = gameData['background_image'];
    thumbnail.classList = 'card-img-top';
    thumbnail.style.minHeight = '161px';
    thumbnail.style.maxHeight = '161px';
    thumbnail.style.objectFit = 'cover';
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

    let addButton = document.createElement('a');
    addButton.classList = 'fs-6 fw-lighter w-auto btn btn-dark p-0 ps-2 pe-2 addBtn';
    addButton.textContent = 'Add ';
    buttonRow.appendChild(addButton);

    let icon = document.createElement('i');
    icon.classList = 'bi bi-plus-lg';
    addButton.appendChild(icon);

    cardList.appendChild(gameCard);
}

// shows/hides gameList spinner on call
function toggleSpinner() {
    spinner.classList.toggle('d-none');
}

// sends request to the server based on the search value
function searchGames() {
    fetchGames(searchBar.value);
}

// adds game to the local storage with "Add +" button
function addGame(e) {
    if (e.target.classList.contains('addBtn')) {
        let gameName = e.target.parentElement.parentElement.querySelector('h3').textContent;
        // finds the game in cached data
        for (let i = 0; i < currentData.length; i++) {
            if (currentData[i]['name'] === gameName) {
                // updates the localstorage with the new game
                if (localStorage.getItem('myGames')) {
                    let myGames = JSON.parse(localStorage.getItem('myGames'));
                    if (!checkAddDuplicate(myGames, currentData[i])) {
                        myGames.push(currentData[i]);
                        localStorage.setItem('myGames', JSON.stringify(myGames));
                    } else {
                        alert('The game is already in your collection!');
                    }
                } else {
                    let myGames = [];
                    myGames.push(currentData[i]);
                    localStorage.setItem('myGames', JSON.stringify(myGames));
                }
            }
        }
    }
}

// checks for duplicates when adding the game to local storage
function checkAddDuplicate(parsedGames, newGame) {
    let duplicate = false;
    for (let i = 0; i < parsedGames.length; i++)
        if (parsedGames[i]['id'] === newGame['id'])
            duplicate = true;
    return duplicate;
}

fetchGames();

// Event-listeners
searchBtn.addEventListener('click', searchGames);
cardList.addEventListener('click', addGame);