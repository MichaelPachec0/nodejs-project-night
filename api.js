// here we are going to import node-fetch, it will give us an fetch api, similar to what you know in the browser
import fetch from 'node-fetch';
import { Headers } from 'node-fetch';


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
  // Every day I'm shuffling...
  let shuffling_index = json.data.map(_ => {
    let ret = []
    for (let i = 2; i--;) {
      // WARN: Feels Hacky, there is probably a better/more semantic way to do
      //  this
      let num = Math.floor(Math.random() * ((index.length === 0) ? 0 : index.length - 1))
      let rand = index[num]
      index.splice(num, 1)
      ret.push(rand)
    }
    return ret
  })
  const ret = {
    index: shuffling_index,
    data: json,
    // TODO: make score relevant or delete from the object being sent to the
    //  user.
    score: 0,
  }
  return ret
}

/**
 * 
 * @param  {Array} choices sends poke object
 * @returns {boolean} true if its a match, else false
 */

function compare(choices) {
  return choices[0] === choices[1]
}


/** 
 * Handles requests and sends them to the actual async functions
 * @param {url.URLSearchParams} params Parmeters that the client sent to the
 *  server.
 * @return {Object} JSON parsable object to send to the client, depending on the
 *  action the client asked for.
*/

async function async_api(params) {
  // startgame = returnPokes
  // choice = the 2 choices that were picked
  // score = always returned
  if (params.get("startgame")) {
    return await returnPokes()
  } else if (params.get("choice")) {
    const result = compare(JSON.parse(decodeURIComponent(params.get("choice"))))
    // assume we have to 2 choices formatted in an array
    return { score: result }
  } else {
    // Bad request
    return {}
  }
}

/** 
 * the bridge/glue from sync world to the async world and back.
 * @param {URLSearchParams} params
*/
export function apiHandler(params) {
  return  (async (params) => await async_api(params))(params);
}

