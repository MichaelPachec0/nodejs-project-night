
let cardFront = document.querySelectorAll('.card-front');

let cardBack = document.querySelectorAll('.card-back');
let cardArray = [...cardBack]
// REveal pokemon on click
for(let i=0; i<cardArray.length; i++){
    
        cardArray[i].addEventListener('click',()=>{
            for(let j = 0; j<cardFront.length; j++){
                if(i == j){
                    cardFront[j].style.transform = 'none';
                }
            }
        })
}