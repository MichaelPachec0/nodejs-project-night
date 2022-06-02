// Insert Javascript here

//this functions loads up a modal with game instructions and displays user name to DOM
const modal = document.querySelector(".modal")
const input = document.querySelector('#input')
const userName = document.querySelector('#player-name')
const submit = document.querySelector('#submit')
const score = document.querySelector('#player-score')

//loads modal 2 seconds after page load
window.addEventListener('load',() =>{
    setTimeout(()=>{
        modal.style.display = "block"
    },2000)
})

//displays username and initial score to the DOM after form submit
submit.onclick = function(){
  modal.style.display = "none"
  userName.innerHTML = `Name: ${input.value}` 
  score.innerHTML = `Score: ${gameScore()}`
}

//prevents users from playing without entering playername
window.onclick = function(e){
  if(e.target == modal){
    modal.style.display = "block"
  }
}

function gameScore(){
  //game score function can be put here
    return 0

}

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
