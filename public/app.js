// Insert Javascript here
let blocking = true;

//this functions load up a modal with game instructions and displays username
// to DOM
const modal = document.querySelector(".modal");
const input = document.querySelector('#input');
const userName = document.querySelector('#player-name');
const submit = document.querySelector('#submit');
const score = document.querySelector('#player-score');
const scoreCounter = document.querySelector('#score-counter');

//loads modal 2 seconds after a page load
window.addEventListener('load', () => {
    setTimeout(() => {
        modal.style.display = "block";
    }, 2000);
});


//displays username and initial score to the DOM after form submit
submit.onclick = function () {
    modal.style.display = "none";
    userName.innerHTML = `Name: ${input.value}`;
    score.innerHTML = `${gameScore()}`;
    scoreCounter.className = "";
    blocking = false;
};

//prevents users from playing without entering player name
window.onclick = function (e) {
    if (e.target === modal) {
        modal.style.display = "block";
    }
};

function gameScore() {
    //game score function can be put here
    return 0;

}


// this function will be called on a page load and on reset to get images from
// the api and insert them into the dom
async function getImages() {
    const res = await fetch('/api?startgame=1');
    const data = await res.json();
    //code to put api data into the dom goes here
    initPokemonCards(createPokeImgArr(data));
}

//call on page load


// Initialize pokemon cards facing down
function createPokeImgArr(responseData) {
    const pokemonData = responseData.data.data;
    let pokemonImages = [...Array(16).keys()];

    // Sort images in index order from their randomized position
    pokemonData.forEach((pokemon, idx) => {
        // From the spec: response.index returns an array of pokemon index each
        // image should be at.
        // Example: [ [4, 11], [8, 1] ]; Extract out each
        // unique array resulting: [4, 11]
        const randomizedIndexArray = responseData.index[idx];

        // Append pokemon image at their respected index/position
        randomizedIndexArray.forEach((index) => {
            // TODO: small is deprecated, research alternatives and decide if
            //  its needed ref:
            // https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/String/small
            pokemonImages[index] = pokemon.images.small;
        });
    });

    return pokemonImages;
}

// Initialize pokemon cards facing down
function initPokemonCards(pokemonArray) {
    const container = document.querySelector(".game-page");

    // The Pokemon array ideally will have 16 elements.
    // this will create 16 grid cells into the DOM
    pokemonArray.forEach((image, index) => {
        // Add ids to individual card so that we have a way to hook up event
        // listener if required
        let markup = `
        <div id="card-${index}" class="card">
            <div class="card-back card-face">
                <img class="poke-ball" src="poke/poke.png" alt="Card #${index} back">
            </div>
            <div class="card-front card-face">
                <img class="poke-card" src="${image}" style="width:100%;height:100%;" alt="Card #${index} front">
            </div>
        </div>
    `;

        // Append individual card to DOM.
        container.insertAdjacentHTML("beforeend", markup);
    });
}

let cards = {
    "id": [],
    "list": [],
};

async function grabCards() {
    for (const card of document.getElementsByClassName('card')) {
        card.addEventListener('click', await cardHandler);
    }
}

/**
 * Handles most of the logic in the game, including if the cards should be
 * manipulated, sending the cards picked to the api to be compared to and
 * scored on, handling the response, and finally winning logic.
 * @param {Event} E card event, in this case it would a click event
 */
async function cardHandler(E) {
    // currentTarget will return the element that we originally looked for,
    // on the other hand target will return the element
    // that initiated the event
    const e = E.currentTarget;
    if (e.classList.contains('matched') || blocking) {
        return;
    }
    if (!(e.classList.contains('visible'))) {
        e.className = 'card visible';
        if (!cards.id.find(e => e === e.id)) {
            cards.list.push(document.querySelector(`#${e.id} .poke-card`).src);
            cards.id.push(e.id);
        }
        if (cards.list.length === 2) {
            // we do a compare, since we do not have an id, send the image url.
            // in the future, we can always just send the position of the card
            // in the grid.
            const choices = encodeURIComponent(JSON.stringify(cards.list));
            const response = await fetch(`/api?choice=${choices}`);
            const responseScore = (await response.json()).score;
            blocking = true;
            if (responseScore) {
                // they are the same, make sure we mark them as such.
                cards.id.forEach(id => document.getElementById(id).className = 'card visible matched dance');
                score.innerText = `${+score.innerText + 1}`;
            } else {
                //they are not the same, reset
                await new Promise(resolve => setTimeout(_ => {
                    cards.id.forEach(id => document.getElementById(id).className = 'card');
                    resolve();
                }, 1000));
            }
            cards.id = [];
            cards.list = [];
            blocking = false;
        }
    }
    if (score.innerText === "8") {
        // Player has won, ask if they want to play again?
        // TODO: Decide if the winner handler should reside here or
        //  in another function
    }
}


getImages().then(async () => {
    await grabCards();
});
