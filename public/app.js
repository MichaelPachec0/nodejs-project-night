// Insert Javascript here

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