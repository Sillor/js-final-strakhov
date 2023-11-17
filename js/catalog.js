const cardList = document.getElementById('game-list');
const spinner = document.querySelector('.spinner-border');
const colLink = document.getElementById('collection-link');
const catLink = document.getElementById('catalog-link');
const logo = document.querySelector('.navbar-brand');

let filterCategory = '';
let filterSearch = '';

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
function searchCatalog() {
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
                appendToLocal(currentData[i]);
            }
        }
    }
}

// appends the localstorage with the new game
function appendToLocal(gameData) {
    if (localStorage.getItem('myGames')) {
        let myGames = JSON.parse(localStorage.getItem('myGames'));
        if (!checkAddDuplicate(myGames, gameData)) {
            myGames.push(gameData);
            localStorage.setItem('myGames', JSON.stringify(myGames));
        } else {
            alert('The game is already in your collection!');
        }
    } else {
        let myGames = [];
        myGames.push(gameData[i]);
        localStorage.setItem('myGames', JSON.stringify(myGames));
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
    a.id = str.toLowerCase();
    a.innerText = str;
    li.appendChild(a);
    li.addEventListener('click', () => filterCollection(a.id, filterSearch));

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
        const dropdownBtn = document.createElement('button');
        dropdownBtn.classList = 'input-group-text btn btn-dark dropdown-toggle border-1 ps-3 pe-3';
        dropdownBtn.type = 'button';
        dropdownBtn.setAttribute('data-bs-toggle', 'dropdown');
        dropdownBtn.setAttribute('aria-expanded', 'false');
        inputGroup.appendChild(dropdownBtn);

        const dropdownIcon = document.createElement('i');
        dropdownIcon.classList = 'bi bi-filter';
        dropdownBtn.appendChild(dropdownIcon);
        dropdownBtn.appendChild(document.createTextNode(' Filter '));

        const dropdownMenu = document.createElement('ul');
        dropdownMenu.classList = 'dropdown-menu';
        dropdownBtn.appendChild(dropdownMenu);
        dropdownMenu.appendChild(addListItem('All'));
        dropdownMenu.appendChild(addListItem('Completed'));
        dropdownMenu.appendChild(addListItem('Playing'));
        dropdownMenu.appendChild(addListItem('Wishlisted'));

        document.querySelector('main').insertBefore(searchContainer, document.getElementById('game-container'));

        searchBarNew.addEventListener('input', searchCollection);
    } else {
        const searchBtnNew = document.createElement('button');
        searchBtnNew.type = 'button';
        searchBtnNew.classList = 'btn btn-dark input-group-text border-1 ps-3 pe-3';
        searchBtnNew.id = 'search-button';
        inputGroup.appendChild(searchBtnNew);

        const searchIcon = document.createElement('i');
        searchIcon.classList = 'bi bi-search';
        searchBtnNew.appendChild(searchIcon);

        document.querySelector('main').insertBefore(searchContainer, document.getElementById('game-container'));
        searchBtnNew.addEventListener('click', searchCatalog);
    }
}

function filterCollection(category, search) {
    const myData = JSON.parse(localStorage.getItem('myGames'));
    const dropdownBtn = document.querySelector('.dropdown-toggle');
    filterCategory = category;

    cardList.innerHTML = '';

    if ((category === 'all' || category === '') && search === '') {
        myData.forEach(game => {
            addGameCard(game, 'collection');
        });
    } else if ((category != 'all' && category != '') && search === '') {
        myData.forEach(game => {
            if (game['category'] === category) {
                addGameCard(game, 'collection');
            }
        });
    } else if ((category === 'all' || category === '') && search != '') {
        myData.forEach(game => {
            if (game['name'].toLowerCase().includes(search.toLowerCase()))
                addGameCard(game, 'collection');
        });
    } else if ((category != 'all' || category != '') && search != '') {
        myData.forEach(game => {
            if (game['name'].toLowerCase().includes(search.toLowerCase()) && game['category'] === category)
                addGameCard(game, 'collection');
        });
    }

    if (category != '')
        dropdownBtn.firstElementChild.nextSibling.textContent = ` ${category[0].toUpperCase() + category.slice(1)} `;
}

function searchCollection(e) {
    const searchBar = document.getElementById('search-bar');
    filterSearch = searchBar.value;

    filterCollection(filterCategory, filterSearch);
}

// transform the page to collection
function showCollection() {
    if (currentPage != 'collection') {
        let myData = JSON.parse(localStorage.getItem('myGames'));

        // updates the page with info from localStorage
        const searchContainer = document.querySelector('.search-container');
        const gamePageContainer = document.getElementById('game-page');

        if (searchContainer != null)
            searchContainer.remove();
        if (gamePageContainer != null)
            gamePageContainer.remove();

        cardList.innerHTML = '';
        myData.forEach(game => {
            addGameCard(game, 'collection');
        });

        addSearch('collection');

        currentPage = 'collection';
    }
}

// transform the page to catalog
function showCatalog() {
    if (currentPage != 'catalog') {
        const searchContainer = document.querySelector('.search-container');
        const gamePageContainer = document.getElementById('game-page');

        if (searchContainer != null)
            searchContainer.remove();
        if (gamePageContainer != null)
            gamePageContainer.remove();

        fetchGames();
        addSearch();
        currentPage = 'catalog';
    }
}

// returns formatted platforms for a given game data
function getPlatforms(gameData) {
    let str = gameData['platforms'][0]['platform']['name'];
    for (let i = 1; i < gameData['platforms'].length; i++)
        str += ', ' + gameData['platforms'][i]['platform']['name'];
    return str;
}

// transform the page to a game page
function showGamePage(e) {
    if (e.target.classList.contains('card-img-top')) {
        const searchContainer = document.querySelector('.search-container');

        const gameName = e.target.nextElementSibling.querySelector('h3').textContent;
        let gameID;

        // looks up for id depending on page
        if (currentPage === 'catalog') {
            for (let i = 0; i < currentData.length; i++)
                if (currentData[i]['name'] === gameName)
                    gameID = currentData[i]['id'];
        }
        if (currentPage === 'collection') {
            const myData = JSON.parse(localStorage.getItem('myGames'));
            for (let i = 0; i < myData.length; i++)
                if (myData[i]['name'] === gameName)
                    gameID = myData[i]['id'];
        }

        // clears page
        if (searchContainer != null)
            searchContainer.remove();
        cardList.innerHTML = '';

        // fetches API for specific game id
        // fetch(`https://api.rawg.io/api/games/${gameID}?key=${environment.myKey}`)
        //     .then(res => res.json())
        //     .then(data => loadGamePage(data));
        fetch('./samplepage.json')
            .then(res => res.json())
            .then(data => loadGamePage(data));

        currentPage = 'gamepage';
    }
}

function isInCollection(gameID, myGames) {
    let inCollection = false;
    for (let i = 0; i < myGames.length; i++)
        if (myGames[i]['id'] === gameID)
            inCollection = true;
    return inCollection;
}

function addCategory(e) {
    let myData = JSON.parse(localStorage.getItem('myGames'));
    let title = document.querySelector('.title').textContent;

    for (let i = 0; i < myData.length; i++)
        if (myData[i]['name'] === title) {
            myData[i]['category'] = e.target.textContent.toLowerCase();
            localStorage.setItem('myGames', JSON.stringify(myData));
        }
    updateGameRating();
}

function addRating(e) {
    let myData = JSON.parse(localStorage.getItem('myGames'));
    let title = document.querySelector('.title').textContent;

    for (let i = 0; i < myData.length; i++)
        if (myData[i]['name'] === title) {
            myData[i]['userRated'] = e.target.innerText.toLowerCase().trim();
            localStorage.setItem('myGames', JSON.stringify(myData));
        }
    updateGameRating();
}

function updateGameRating() {
    const category = document.querySelectorAll('.category button');
    const rating = document.querySelectorAll('.rating button');
    const myData = JSON.parse(localStorage.getItem('myGames'));
    let title = document.querySelector('.title').textContent;
    let currGame = '';

    for (let i = 0; i < myData.length; i++)
        if (myData[i]['name'] === title)
            currGame = myData[i];

    category.forEach(btn => {
        if (btn.innerText.trim().toLowerCase() === currGame['category'])
            btn.classList = 'btn btn-secondary';
        else if (btn.innerText.trim() === 'Completed')
            btn.classList = 'btn btn-outline-success';
        else if (btn.innerText.trim() === 'Playing')
            btn.classList = 'btn btn-outline-warning';
        else if (btn.innerText.trim() === 'Wishlisted')
            btn.classList = 'btn btn-outline-primary';
    });

    rating.forEach(btn => {
        if (btn.innerText.trim().toLowerCase() === currGame['userRated'])
            btn.classList = 'btn btn-secondary';
        else if (btn.innerText.trim() === 'Like')
            btn.classList = 'btn btn-outline-success';
        else if (btn.innerText.trim() === 'Dislike')
            btn.classList = 'btn btn-outline-danger';
    });
}

function loadGamePage(gameData) {
    const gamePageContainer = document.createElement('div');
    gamePageContainer.classList = 'container-lg mt-4 p-3';
    gamePageContainer.id = 'game-page';
    let ratingPart;
    let inCollection = isInCollection(gameData['id'], JSON.parse(localStorage.getItem('myGames')));
    if (inCollection) {
        ratingPart =
            `<div class="btn-group category">
                <button type="button" class="btn btn-outline-success">Completed</button>
                <button type="button" class="btn btn-outline-warning">Playing</button>
                <button type="button" class="btn btn-outline-primary">Wishlisted</button>
            </div>
            <div class="btn-group rating mt-2">
                <button type="button" class="btn btn-outline-success">Like <i class="bi bi-hand-thumbs-up"></i>
                </button>
                <button type="button" class="btn btn-outline-danger">Dislike <i class="bi bi-hand-thumbs-down"></i>
                </button>
            </div>`;
        inCollection = true;
    } else {
        ratingPart =
            `<a class="fs-6 fw-bolder btn btn-outline-success border-2 p-0 ps-2 pe-2 addBtn">
                Add to Collection
                <i class="bi bi-plus-lg"></i>
            </a>`;
        inCollection = false;
    }

    gamePageContainer.innerHTML =
        `<div class="row">
        <div class="col-12 col-md-5">
            <img class="img-thumbnail"
                src="${gameData['background_image']}">
            <div class="ratings row justify-content-around mt-2">
                ${ratingPart}
                <p class="fs-5 mt-3 m-1"><span class="fw-bold">Developers:</span> ${gameData['developers'][0]['name']}</p>
                <p class="fs-5 m-1"><span class="fw-bold">Metacritic:</span> ${gameData['metacritic']}</p>
                <p class="fs-5 m-1"><span class="fw-bold">Platforms:</span> ${getPlatforms(gameData)}</p>

            </div>
        </div>
        <div class="col-7 d-none d-md-block">
            <h1 class="title">${gameData['name']}</h1>
            <h5>Released: ${gameData['released']}</h5>
            ${gameData['description']}
        </div>
    </div>
    <div class="row mt-4">
        <div class="col-12 wrap d-block d-md-none text-center">
            <h1 class="title">${gameData['name']}</h1>
            <h5>Released: ${gameData['released']}</h5>
            ${gameData['description']}
        </div>
    </div>`;

    document.querySelector('main').insertBefore(gamePageContainer, document.getElementById('game-container'));

    updateGameRating();

    if (inCollection) {
        const category = document.querySelector('.category');
        const rating = document.querySelector('.rating');

        category.addEventListener('click', addCategory);
        rating.addEventListener('click', addRating);
    } else {
        const addBtn = document.querySelector('.addBtn');
        addBtn.addEventListener('click', () => appendToLocal(gameData));
    }
}

showCatalog();

// small bug fix
if (!JSON.parse(localStorage.getItem('myGames')))
    JSON.stringify(localStorage.setItem('myGames', '[]'));

const searchBtn = document.getElementById('search-button');

// Event-listeners
cardList.addEventListener('click', addGame);
cardList.addEventListener('click', removeGame);
cardList.addEventListener('click', showGamePage);
colLink.addEventListener('click', showCollection);
catLink.addEventListener('click', showCatalog);
logo.addEventListener('click', showCatalog);