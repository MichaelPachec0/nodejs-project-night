// here we are going to import node-fetch, it will give us an fetch api, similar to what you know in the browser
import fetch from 'node-fetch';
import { Headers } from 'node-fetch';

//Randomize function to allow a different page of cards on each request
function randomize() {
  let pageNum = Math.ceil(Math.random() * 100);
  return pageNum;
}

// now we need to define a function to export, this way server.js can call the function here
export async function returnData() {
  let index = [...Array(16).keys()]
  // here we are going to define our header
  const headers = new Headers({ 'x-api-key': process.env.API_KEY })
  const resp = await fetch(`https://api.pokemontcg.io/v2/cards?q=supertype:pokemon&pageSize=8&page=${randomize()}`, headers)
  const json = await resp.json()
  //Shuffling...
  let shuffling_index = arr.map(_ => {
    let ret = []
    for (let i = 2; i--;) {
      let num = Math.floor(Math.random() * ((index.length === 0) ? 0 : index.length - 1))
      let rand = index[num]
      index.splice(num, 1)
      ret.push(rand)
    }
    return ret
  })
  const ret = {
    index: shuffling_index,
    data: json
  }
  return ret
}