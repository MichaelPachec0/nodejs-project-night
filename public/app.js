// Insert Javascript here
// this function toggles the pokemon card on click
let cards = document.querySelectorAll('.card');
let isVisible = true

cards.forEach(card => {
    card.addEventListener('click', ()=>{
        if(!(card.classList.contains('visible'))){
            card.className = 'card visible'
        }else{
            card.classList = 'card'
        }
    })
})

//this function will be called on page load and on reset to get images from the api and insert them into the dom
 async function getImages(){
    const res = await fetch('/api');
    const data = await res.json();
    //console.log can be removed, just used to see the return data initially
    console.log(data);

    //code to put api data into the dom goes here
    
}

//call on page load
getImages();