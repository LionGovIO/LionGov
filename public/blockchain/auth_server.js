const express = require('express');
const session = require('express-session');
const bodyParser = require('body-parser');
var Web3 = require('web3');
var web3 = new Web3('https://polygon-rpc.com/');
const app = express();
const http = require('http');
const server = http.createServer(app);
const { Server } = require("socket.io");
const io = new Server(server);
const redis = require('redis');
const c = require('./public/constants');
const blkchain = require('./blockchain');
const Moralis = require('moralis/node');
web3.eth.defaultChain = 'matic';

app.use(session({secret: process.env.EXPRESS_SESSION_SECRET,saveUninitialized: true,resave: true}));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: true}));
app.use(express.static('public'));




Moralis.initialize(process.env.MORALIS_APP_ID);

Moralis.serverURL = process.env.MORALIS_SERVER_URL;

(async () => {
  console.log(process.env.REDIS_HOST);
  const RedisClient = redis.createClient({url: 'redis://' + process.env.REDIS_HOST +':6379'});

  RedisClient.on('error', (err) => console.log('Redis Client Error', err));

  await RedisClient.connect();

  console.log('Reddis successfully connected');

  Blkchain = new blkchain(RedisClient, Moralis);

})();




app.get('/',(req,res) => {
    let sess = req.session;
    let sid = req.sessionID;
    res.header('SessionID', sid);
    console.log('Session ID: ', sid);
    if(sess.bcaddr) {
      res.header('bcaddr', sess.bcaddr);
        //return res.redirect('/loged.html');
    }
    res.sendFile(__dirname + '/public/login.html');
});

app.post('/loginreq',(req,res) => {
    let sess = req.session;
    let msg = c.SIGNATURE_MESSAGE.replace("SESSIONID", req.sessionID);
    //let msg = "Session id: " + req.sessionID + "\n\nSign your session id with your Polygon Account, this proves to us and to all players that you are the real owner of that address and NFTs. This does not cost any fees.";
    res.contentType('text/plain');

    console.log('Signed msg: ', req.body.signature);

    console.log('The requestor say they are: ', req.body.bcaddr);

    console.log('If the signature has not been tampered, address should match: ', web3.eth.accounts.recover(msg, req.body.signature));

    // Tests if the signature match for the informed address
    if (req.body.bcaddr == web3.eth.accounts.recover(msg, req.body.signature)){
      sess.bcaddr = req.body.bcaddr;
      res.end('done');
    } else {
      res.end('failed');
    }
});


app.post('/reqvotepoints',(req,res) => {
    let sess = req.session;
    if (!sess.bcaddr){
      return res.end('{"error": "not signed"}');
    }//redirect
    res.contentType('application/json');

    Blkchain.getVoteWeight(sess.bcaddr).then(voteWeight => {
      res.end(JSON.stringify (voteWeight));
    });

});



app.get('/logoutreq',(req,res) => {
    req.session.bcaddr = null;
    res.contentType('text/plain');
    req.session.destroy((err) => {
        if(err) {
            return console.log(err);
        }
        res.end('done');
    });
});


/*
var gameState = {
  players: {}
};
*/

// socket ID is the key
var infoMap = {};

io.on('connection', (socket) => {
  console.log('a user connected');

  socket.on('disconnect', () => {
      console.log('user disconnected');
  });

  socket.on('chat message', (msg) => {
    console.log('message: ' + msg);
  });

  socket.on('info', (msg) => {
    console.log('info message: ' + JSON.stringify(msg));

    infoMap[socket.id] = msg;

    var playerId = msg.playerId;

    console.log(playerId);

    socket.broadcast.emit('info', msg);

    // gameState.players[playerId] = msg;

    // socket.emit('gameState', gameState);

    // todo, remove disconnected players from game state
  });

  socket.on('disconnect', function(data) {
    console.log('disconnect');

    io.emit('playerDisconnect', infoMap[socket.id]);
  });
});

server.listen(3000, () => {
  console.log('listening on *:3000');
});
