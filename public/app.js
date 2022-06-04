// Create Class to check if cards match

class MatchCards {
    constructor(cards) {
        this.cardsArray = cards;
    }

    startGame() {
        this.active = true;
        this.cardToCheck = null;
        this.matchedCards = [];
        this.toggleCards();
        // this.shuffleCards(this.cardsArray);
    }

    youWin() {
        document.querySelector('add_a_class_to_display_win').classList.add('visible');
    }


    
    // might need to add a class 'matched' in the CSS file as such, (when card is facing front)
    // .card.matched .card-front .squirtle {
    //     animation: add some value here;
    //   }
    // to be able to compare while using the methods below

    

    // this method here can be commented out/deleted if it's being tackled 
    // toggleCards() {
    //     this.cardsArray.forEach(card => {
    //         card.classList.remove('visible');
    //         card.classList.remove('matched'); //this is the added class from my side
    //     });
    // }


    // this method here can also be commented out/deleted if it's being tackled
    // flipCard(card) {
    //     if(this.canFlipCard(card)) {
    //         card.classList.add('visible');

    //         if(this.cardToCheck) {
    //             this.checkForCardMatch(card);
    //         } else {
    //             this.cardToCheck = card;
    //         }
    //     }
    // }

    checkForCardMatch(card) {
        if(this.getCardType(card) === this.getCardType(this.cardToCheck))
            this.cardMatch(card, this.cardToCheck);
        else 
            this.cardMismatch(card, this.cardToCheck);

        this.cardToCheck = null;
    }
   

    cardMatch(card1, card2) {
        this.matchedCards.push(card1);
        this.matchedCards.push(card2);
        card1.classList.add('matched'); //this is the added class from my side
        card2.classList.add('matched');
        if(this.matchedCards.length === this.cardsArray.length)
            this.youWin();
    }

    cardMismatch(card1, card2) {
      this.active = true;
      card1.classList.remove('visible');
      card2.classList.remove('visible');
      this.active = false;
      }
   
    // backend part
    // shuffleCards(cardsArray) { 
    //     for (let i = cardsArray.length - 1; i > 0; i--) {
    //         let randomIndex = Math.floor(Math.random() * (i + 1));
    //         cardsArray[randomIndex].style.order = i;
    //         cardsArray[i].style.order = randomIndex;
    //     }
    // }

    getCardType(card) {
        return card.getElementsByClassName('dance')[0].src;
    }
    canFlipCard(card) {
        return !this.active && !this.matchedCards.includes(card) && card !== this.cardToCheck;
    }
}

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
