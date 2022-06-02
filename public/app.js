// Insert Javascript here
// this function toggles the pokemon card on click
let cards = document.querySelectorAll('.card');

cards.forEach(card => {
    card.addEventListener('click', () => {
        if (!(card.classList.contains('visible'))) {
            card.className = 'card visible'
        } else {
            card.classList = 'card'
        }
    })
})

//this function will be called on page load and on reset to get images from the api and insert them into the dom
async function getImages() {
    const res = await fetch('/api');
    const data = await res.json();
    //console.log can be removed, just used to see the return data initially
    console.log(data);

    //code to put api data into the dom goes here

    // Example of how to render pokemon cards to DOM: 
    // initPokemonCards( createPokeImgArr(data) )
}

//call on page load
getImages();

// Helper function to create pokemonImage array from response data
function createPokeImgArr(responseData) {
    const pokemonData = responseData.data.data;
    let pokemonImages = [...Array(16).keys()];
  
    // Sort images in index order from their randomized position
    pokemonData.forEach((pokemon, idx) => {
      // From the spec: response.index retuns an array of pokemon index each images should be at. Example: [ [4, 11], [8, 1] ];
      // Extract out each unique array resulting: [4, 11]
      const randomizedIndexArray = responseData.index[idx];
  
      // Append pokemon image at their respected index/position
      randomizedIndexArray.forEach((index) => {
        pokemonImages[index] = pokemon.images.small;
      });
    });
  
    return pokemonImages;
  }

// Initialize pokemon cards facing down
function initPokemonCards(pokemonArray) {
    const container = document.querySelector(".game-page");

    // pokemon array ideally will have 16 elements
    // this will create 16 grid cells into the DOM
    pokemonArray.forEach((image, index) => {
        // Add ids to individual card so that we have a way to hook up event listener if required
        let markup = `
      <div id="card-${index}" class="card">
        <div class="card-back card-face">
          <img class="pokeball" src="poke/poke.png">
        </div>
        <div class="card-front card-face">
          <img class="squirtle" src="${image}">
        </div>
      </div>
    `;

        // Append individual card to DOM.
        container.insertAdjacentHTML("beforeend", markup);
    })
}
