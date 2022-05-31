// here we are going to import node-fetch, it will give us an fetch api, similar to what you know in the browser
import fetch from 'node-fetch';
import {Headers} from 'node-fetch';

//Randomize function to allow a different page of cards on each request
function randomize() {
    let pageNum = Math.ceil(Math.random() * 100);
    return pageNum;
  }

  // now we need to define a function to export, this way server.js can call the function here
  export async function returnData(){
      // here we are going to define our header
      const headers = new Headers({'x-api-key': process.env.API_KEY})
      const resp = await fetch(`https://api.pokemontcg.io/v2/cards?q=supertype:pokemon&pageSize=8&page=${randomize()}`, headers)
      const json = await resp.json()
      console.log(json)
      //data is already returned as JSON, now we need to slice it into a randomized array
  }
