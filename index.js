const express = require('express');
const app = express();
const http = require('http');
const server = http.createServer(app);

app.use(express.static('public'))

// body-parser is deprecated, use below instead: https://stackoverflow.com/questions/66525078/bodyparser-is-deprecated
app.use(express.urlencoded({extended: true}));
app.use(express.json()) // To parse the incoming requests with JSON payloads

app.get('/', (req, res) => {
  res.send('Hello World!')
});

// POST method route
app.post('/submitvote', function (req, res) {
  res.send('POST request to the homepage')

  var postData = req.body;
  //then work with your data

  console.log('postData!');
  console.log(postData);
})

// TODO: don't console.log vote data in long term to protect user privacy

server.listen(3000, () => {
  console.log('listening on *:3000');
});