// here we are going to import node-fetch, it will give us an fetch api, similar to what you know in the browser
import fetch from 'node-fetch';
import { Headers } from 'node-fetch';

//only used for JSlint, need to investigate if there is a better way without requiring a variable init
import url from 'url'

//Randomize function to allow a different page of cards on each request
function randomize() {
  let pageNum = Math.ceil(Math.random() * 100);
  return pageNum;
}

// now we need to define a function to export, this way server.js can call the function here
async function returnPokes() {
  let index = [...Array(16).keys()]
  // here we are going to define our header
  const headers = new Headers({ 'x-api-key': process.env.API_KEY })
  const resp = await fetch(`https://api.pokemontcg.io/v2/cards?q=supertype:pokemon&pageSize=8&page=${randomize()}`, headers)
  const json = await resp.json()
  //Shuffling...
  let shuffling_index = json.data.map(_ => {
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

/**
 * 
 * @param  {...object} choices sends poke object
 * @returns {boolean} true if its a match, else false
 */

async function compare(...choices) {
  return choices[0].id === choices[1].id
}


/** 
 * handles requests and sends them to the actual async functions
 * @param {url.URLSearchParams} params 
*/
async function async_api(params) {
  // startgame = returnPokes
  // choice = 2 choices picked
  // score = always returned
  if (params.get("startgame")) {
    let ret = await returnPokes()
    ret.score = 0
    return ret
  } else if (params.get("choice")) {
    // assume we have to 2 choices formatted in a array
    return { score: (compare(JSON.parse(decodeURIComponent(params.get("choice"))))) ? "1" : "0" }
  } else {
    // Bad request
    return {}
  }
}


/** 
 * the bridge/glue from sync world to async world and back.
 * @param {url.URLSearchParams} params 
*/
export function apiHandler(params) {
  return  (async (params) => await async_api(params))(params);
}

