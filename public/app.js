// Insert Javascript here

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
        modal.style.display = "block"
    }, 2000)
})


//displays username and initial score to the DOM after form submit
submit.onclick = function () {
    modal.style.display = "none"
    userName.innerHTML = `Name: ${input.value}`
    score.innerHTML = `Score: ${gameScore()}`
}

//prevents users from playing without entering player name
window.onclick = function(e){
    if(e.target === modal){
        modal.style.display = "block"
    }
}

function gameScore() {
    //game score function can be put here
    return 0

}


//this function will be called on a page load and on reset to get images from the api and insert them into the dom
async function getImages() {
    const res = await fetch('/api?startgame=1');
    const data = await res.json();
    //console.log can be removed, just used to see the return data initially
    console.log(data);

    //code to put api data into the dom goes here
    initPokemonCards(createPokeImgArr(data))
}

//call on page load



// Initialize pokemon cards facing down
function createPokeImgArr(responseData) {
    const pokemonData = responseData.data.data;
    let pokemonImages = [...Array(16).keys()];

    // Sort images in index order from their randomized position
    pokemonData.forEach((pokemon, idx) => {
        // From the spec: response.index returns an array of pokemon index each images should be at.
        // Example: [ [4, 11], [8, 1] ];
        // Extract out each unique array resulting: [4, 11]
        const randomizedIndexArray = responseData.index[idx];

        // Append pokemon image at their respected index/position
        randomizedIndexArray.forEach((index) => {
            // TODO: small is deprecated, research alternatives and decide if its needed
            //  ref: https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/String/small
            pokemonImages[index] = pokemon.images.small;
        });
    });

    return pokemonImages;
}

// Initialize pokemon cards facing down
function initPokemonCards(pokemonArray) {
    const container = document.querySelector(".game-page");

    // pokemon array ideally will have 16 elements.
    // this will create 16 grid cells into the DOM
    pokemonArray.forEach((image, index) => {
        // Add ids to individual card so that we have a way to hook up event listener if required
        let markup = `
        <div id="card-${index}" class="card">
            <div class="card-back card-face">
                <img class="poke-ball" src="poke/poke.png">
            </div>
            <div class="card-front card-face">
                <img class="poke-card" src="${image}" style="width:100%;height:100%;">
            </div>
        </div>
    `;

        // Append individual card to DOM.
        container.insertAdjacentHTML("beforeend", markup);
    });
}

// let cards = document.querySelectorAll('.card');
// let cards = document.getElementsByClassName('main-card')
// console.log(cards)
function grabCards() {
    for (const card of document.getElementsByClassName('card')) {
        card.addEventListener('click', () => {
                console.log(card.classList)
                if (!(card.classList.contains('visible'))) {
                    card.className = 'card visible'
                } else {
                    card.className = 'card'
                }
            }
        )
    }
}

getImages().then(_ => {grabCards();console.log("done!")});

// cards.forEach(card => {
//     console.log(card)
//     card.addEventListener('click', () => {
//         if (!(card.classList.contains('visible'))) {
//             card.className = 'card visible'
//         } else {
//             card.classList = 'card'
//         }
//     })
// })