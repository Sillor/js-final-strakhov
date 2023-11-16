const cardList = document.getElementById('game-list');
const spinner = document.querySelector('.spinner-border');
const colLink = document.getElementById('collection-link');
const catLink = document.getElementById('catalog-link');

// currently displayed games array
let currentData = [];

// const baseURL = `https://api.rawg.io/api/games?key=${environment.myKey}`
const baseURL = '../samplegames.json';

let currentPage = '';

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
    gameList.forEach(game => addGameCard(game, 'catalog'));
    toggleSpinner();
}

// creates a card from game data
function addGameCard(gameData, type) {
    let gameCard = document.createElement('div');
    gameCard.classList = 'card m-3 p-0 h-25 shadow-sm';
    gameCard.style.width = '24rem';

    let thumbnail = document.createElement('img');
    thumbnail.src = gameData['background_image'];
    thumbnail.classList = 'card-img-top';
    thumbnail.style.minHeight = '215px';
    thumbnail.style.maxHeight = '215px';
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

    if (type === 'catalog') {
        let addButton = document.createElement('a');
        addButton.classList = 'fs-6 fw-bolder w-auto btn btn-outline-success border-2 p-0 ps-2 pe-2 addBtn';
        addButton.textContent = 'Add ';
        buttonRow.appendChild(addButton);

        let icon = document.createElement('i');
        icon.classList = 'bi bi-plus-lg';
        addButton.appendChild(icon);
    }
    else if (type === 'collection') {
        let removeButton = document.createElement('a');
        removeButton.classList = 'fs-6 fw-bolder w-auto btn btn-outline-dark border-2 p-0 ps-2 pe-2 removeBtn';
        removeButton.textContent = 'Remove ';
        buttonRow.appendChild(removeButton);

        let icon = document.createElement('i');
        icon.classList = 'bi bi-x-lg';
        removeButton.appendChild(icon);
    }

    cardList.appendChild(gameCard);
}

// shows/hides gameList spinner on call
function toggleSpinner() {
    spinner.classList.toggle('d-none');
}

// sends request to the server based on the search value
function searchGames() {
    const searchBar = document.getElementById('search-bar');
    fetchGames(searchBar.value);
}

// adds game to the local storage with "Add +" button
function addGame(e) {
    if (e.target.classList.contains('addBtn')) {
        const gameName = e.target.parentElement.parentElement.querySelector('h3').textContent;
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

// removes the game from local storage and collection page
function removeGame(e) {
    if (e.target.classList.contains('removeBtn')) {
        const gameName = e.target.parentElement.parentElement.querySelector('h3').textContent;
        let myGames = JSON.parse(localStorage.getItem('myGames'));
        for (let i = 0; i < myGames.length; i++) {
            if (myGames[i]['name'] === gameName)
                myGames.splice(i, 1);
        }
        localStorage.setItem('myGames', JSON.stringify(myGames));
        e.target.parentElement.parentElement.parentElement.remove();
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

function addListItem(str) {
    const li = document.createElement('li');
    const a = document.createElement('a');

    a.classList = 'dropdown-item';
    a.href = '#';
    a.innerText = str;
    li.appendChild(a);

    return li;
}

function addSearch(type) {
    const searchContainer = document.createElement('div');
    searchContainer.classList = 'container-lg mt-2 search-container';

    const inputGroup = document.createElement('div');
    inputGroup.classList = 'input-group';
    searchContainer.appendChild(inputGroup);

    const searchBarNew = document.createElement('input');
    searchBarNew.type = 'search';
    searchBarNew.id = 'search-bar';
    searchBarNew.classList = 'form-control border-secondary';
    searchBarNew.placeholder = 'Search';
    inputGroup.appendChild(searchBarNew);

    if (type === 'collection') {
        const dropdown = document.createElement('div');
        dropdown.classList = 'dropdown';
        inputGroup.appendChild(dropdown);

        const dropdownBtn = document.createElement('button');
        dropdownBtn.classList = 'input-group-text btn btn-outline-dark dropdown-toggle border-1 rounded-0 ps-3 pe-3';
        dropdownBtn.type = 'button';
        dropdownBtn.setAttribute('data-bs-toggle', 'dropdown');
        dropdownBtn.setAttribute('aria-expanded', 'false');
        dropdown.appendChild(dropdownBtn);

        const dropdownIcon = document.createElement('i');
        dropdownIcon.classList = 'bi bi-filter';
        dropdownBtn.appendChild(dropdownIcon);
        dropdownBtn.appendChild(document.createTextNode(' Filter '));

        const dropdownMenu = document.createElement('ul');
        dropdownMenu.classList = 'dropdown-menu';
        dropdown.appendChild(dropdownMenu);
        dropdownMenu.appendChild(addListItem('All'));
        dropdownMenu.appendChild(addListItem('Completed'));
        dropdownMenu.appendChild(addListItem('In progress'));
        dropdownMenu.appendChild(addListItem('Wishlisted'));
    }

    const searchBtnNew = document.createElement('button');
    searchBtnNew.type = 'button';
    searchBtnNew.classList = 'btn btn-dark input-group-text border-1 ps-3 pe-3';
    searchBtnNew.id = 'search-button';
    inputGroup.appendChild(searchBtnNew);

    const searchIcon = document.createElement('i');
    searchIcon.classList = 'bi bi-search';
    searchBtnNew.appendChild(searchIcon);

    document.querySelector('main').insertBefore(searchContainer, document.getElementById('game-container'));
}

// transform the page to collection
function showCollection() {
    if (currentPage != 'collection') {
        let myData = JSON.parse(localStorage.getItem('myGames'));

        // updates the page with info from localStorage
        const searchContainer = document.querySelector('.search-container');
        if (searchContainer != null)
            searchContainer.remove();

        cardList.innerHTML = '';
        myData.forEach(game => {
            addGameCard(game, 'collection');
        });

        addSearch('collection');

        currentPage = 'collection';
    }
}

function showCatalog() {
    if (currentPage != 'catalog') {
        const searchContainer = document.querySelector('.search-container');
        if (searchContainer != null)
            searchContainer.remove();
        fetchGames();
        addSearch();
        currentPage = 'catalog';
    }
}

showCatalog();

// small bug fix
if (!JSON.parse(localStorage.getItem('myGames')))
    JSON.stringify(localStorage.setItem('myGames', '[]'));

const searchBtn = document.getElementById('search-button');

// Event-listeners
searchBtn.addEventListener('click', searchGames);
cardList.addEventListener('click', addGame);
cardList.addEventListener('click', removeGame);
colLink.addEventListener('click', showCollection);
catLink.addEventListener('click', showCatalog);