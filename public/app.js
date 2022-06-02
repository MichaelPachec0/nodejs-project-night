// Insert Javascript here

//this function will be called on page load and on reset to get images from the api and insert them into the dom
async function getImages() {
    const res = await fetch('/api');
    const data = await res.json();
    //console.log can be removed, just used to see the return data initially
    console.log(data);

    //code to put api data into the dom goes here
    
}

//call on page load
getImages();

// Initialize pokemon cards facing down
function initPokemonCards(pokemonArray) {
  const container = document.querySelector(".game-page");

  // pokemon array ideally will have 16 elements
  // this will create 16 grid cells into the DOM
  pokemonArray.forEach((obj, index) => {
    // Add ids to individual card so that we have a way to hook up event listener if required
    let markup = `
      <div id="card-${index}" class="card">
        <div class="card-back card-face">
          <img class="pokeball" src="poke/poke.png">
        </div>
        <div class="card-front card-face">
          <img class="squirtle dance" src="${obj.pokemonImage}">
        </div>
      </div>
    `;

    // Append individual card to DOM.
    container.insertAdjacentHTML("beforeend", markup);
  })
}