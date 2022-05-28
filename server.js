import {createRequire} from "module";
const require = createRequire(import.meta.url);

const http = require('http');
const fs = require('fs');
const url = require('url');
const figlet = require('figlet');

import {fileTypes} from "./file.js";


const server = http.createServer((req, res) =>{
    // if protocol is undefined, default to http for now
    const base = ((req.protocol)? req.protocol : "http") + '://' + req.headers.host + '/'
    const page = new url.URL(req.url, base).pathname
    const params = new URLSearchParams(page.search)
    if (page === "/api"){
        // TODO: handle api here
    } else {
        returnFile(page, res)
    }
})

/**
 * @param {string} tmpFile
 * @param {module:http.ServerResponse} res
 */
function returnFile(tmpFile, res) {
    // account for index.html being the root page
    let file = (tmpFile === "/") ? "/index.html" : tmpFile
    // if file exists in the public folder, serve it
    if (fileExists(`public${file}`)){
        fs.readFile(`public${file}`, (err, data) => {
            // the content type to use. should never be undefined
            let cType = fileTypes[file.replace(/^\/?.*?\./g,"")]
            if (!cType){
                cType = ""
            }
            res.writeHead(200, {'Content-Type':  cType});
            res.write(data);
            res.end();
        })
    } else {
        figlet('404!!', function(err, data) {
            if (err) {
                console.log('Something went wrong...');
                console.dir(err);
                return;
            }
            // send a 404 to the client
            res.writeHead(404)
            res.write(data);
            res.end();
        });
    }
}
/**
 * @param {string} path
 */
function fileExists(path) {
    try {
        fs.accessSync(path, fs.constants.F_OK)
    } catch {
        return false
    }
    return true
}
server.listen(8000);