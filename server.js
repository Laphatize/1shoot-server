// server.js
// where your node app starts

// init project
const express = require("express");
const app = express();
const fs = require("fs");
const path = require('path');

// we've started you off with Express,
// but feel free to use whatever libs or frameworks you'd like through `package.json`.
function makeid(length) {
   var result           = '';
   var characters       = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
   var charactersLength = characters.length;
   for ( var i = 0; i < length; i++ ) {
      result += characters.charAt(Math.floor(Math.random() * charactersLength));
   }
   return result;
}

// http://expressjs.com/en/starter/static-files.html
app.use(express.static("public"));

// http://expressjs.com/en/starter/basic-routing.html
app.get("/", function(request, response) {
  response.sendFile(__dirname + "/views/index.html");
});

app.get("/purge", function(request, response) {
const directory = 'sessions';

fs.readdir(directory, (err, files) => {
  if (err) throw err;

  for (const file of files) {
    fs.unlink(path.join(directory, file), err => {
      if (err) throw err;
    });
  }
});
  
  
  response.send("all sessions purged");

});

var egg;
app.get("/createGame", function(request, response) {

  if (!request.query.gamename || !request.query.username)
      return response.send("invalid parameters")
  
  var gamecode = makeid(5);
  var currentPlayer = request.query.username;
  var data = {
     "gamename" : request.query.gamename,
     "owner" : request.query.username,
     "players" : {
    
     }
}
  
      data.players[currentPlayer] = {"x":0,"y":1};


          fs.writeFile(__dirname + `/sessions/${gamecode}.json`, JSON.stringify(data), (err) => {
          //throw err;
      }) 
  


    return response.send(gamecode);
});
app.get("/joinGame", function(request, response) {
  var egg;
  var gamecode = request.query.gamecode;
  
  if (!request.query.username || !request.query.gamecode)
      return response.send("invalid parameters")
  
  fs.readFile(__dirname + `/sessions/${gamecode}.json`,  function(err, contents) {
    
  egg = JSON.parse(contents);
  
  return response.send(egg); 
});
  
});

app.get("/coordinatesfor", function(request, response) {
  var egg;
  var gamecode = request.query.gamecode;
  
  if (!request.query.username || !request.query.gamecode)
      return response.send("invalid parameters")
  
  fs.readFile(__dirname + `/sessions/${gamecode}.json`,  function(err, contents) {
    
  egg = JSON.parse(contents);
  console.log(egg.players[request.query.username])
  return response.send(egg.players[request.query.username]); 
});
  
});



// listen for requests :)
const listener = app.listen(80, function() {
  console.log("Your app is listening on port " + listener.address().port);
});
