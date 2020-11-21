/*
    Primary file for API 

*/

// dependencies
const http = require("http");
const url = require("url");
const StringDecoder = require("string_decoder").StringDecoder;

const server = http.createServer((req, res) => {
  // get the url and parse it
  let parsedUrl = url.parse(req.url, true);

  // Get the path
  const path = parsedUrl.pathname;
  const trimedPath = path.replace(/^\/+|\/+$/g, "");

  // get the  query string as an object

  const queryStringObject = parsedUrl.query;

  // get http method

  const method = req.method.toLowerCase();

  console.log(
    `a request has been on path ${trimedPath} with method ${method} and with this query string pararameters: `
  );
  console.log(queryStringObject);

  //get the headers as an object
  const headers = req.headers;

  console.log({ headers });
  // get the payload if there is any
  let decoder = new StringDecoder("utf-8"); // utf-8 is for json which is used for most of the time
  let buffer = "";
  req.on("data", (data) => {
    buffer += decoder.write(data);
  });

  req.on("end", () => {
    buffer += decoder.end();

    // choose the handler this request should go to if not found choose notFound 
    const chosenHandler = typeof(router[trimedPath]) !== 'undefined'? router[trimedPath]: handlers.notFound

    // construct the data object to send to the handler 
    var data = { 
        trimedPath,
        queryStringObject,
        method, 
        headers, 
        'payload': buffer
    }

    // route the request to the handler specified in the router 
    chosenHandler(data, (statusCode, payload)=> { 
        // use the status code that comes with the handler of a default for 200 
        statusCode = typeof(statusCode) == 'number'? statusCode : 200 
        // use the payload from the callback or an empty object 
        payload = typeof(payload) == 'object'? payload : {}
        // convert the payload to a string 
        let payloadString = JSON.stringify(payload)

        // return the response 
        res.writeHead(statusCode)
        res.end(payloadString)
        console.log('returning the respond', statusCode, payloadString);
    })



  });
});

server.listen(3000, () => console.log("the srerver is listining on port 3000"));

// define the handlers 
var handlers = {}

// sample handler  
handlers.sample = (data, callback) => {
    // callback a http status code , and a payload object 
    callback(406, {'name': 'sample handlers'})
}

// Not found handler 

handlers.notFound = (data, callback) => {
    callback(404)
}


// define a reqiust router 
var router = {
    'sample': handlers.sample,
}