const { v4: uuidv4 } = require('uuid');

const express = require('express');
const app = express();
const http = require('http');
const server = http.createServer(app);

const AWS = require("aws-sdk");
AWS.config.update({
  region: 'us-east-1'
});

var dynamoDB = new AWS.DynamoDB();


app.use(express.static('public'))

// body-parser is deprecated, use below instead: https://stackoverflow.com/questions/66525078/bodyparser-is-deprecated
app.use(express.urlencoded({ extended: true }));
app.use(express.json()) // To parse the incoming requests with JSON payloads

app.get('/', (req, res) => {
  res.send('Hello World!')
});

function submitVote(data, callback) {
  var creationTime = Date.now().toString();
  var voteId = uuidv4();
  var voteClass = data.voteClass;
  var voteValue = data.voteValue;

  var params = {
    TableName: "Votes",
    Item: {
      "VoteId": {
        S: voteId
      },
      "VoteClass": {
        S: voteClass
      },
      "VoteValue": {
        S: voteValue
      },
      "CreationTime": {
        S: creationTime
      }
    },
    ConditionExpression: 'attribute_not_exists(VoteId)' // prevent someone from overriding the vote
  };

  dynamoDB.putItem(params, function (err, data) {
    if (err) {
      console.log(err);
      if (err.code == 'ConditionalCheckFailedException') {
        callback('VoteId is already in use', null);
      } else {
        callback(err, null);
      }
    } else {
      callback(null, data);
    }
  });
}

// POST method route
app.post('/submitvote', function (req, res) {
  res.send('POST request to the homepage')

  var postData = req.body;
  //then work with your data

  console.log('postData!');
  console.log(postData);


  // TODO: reject invalid post params

  submitVote(postData, function(err, result) {
    console.log('submitVote callback!');
    console.log(err);
    console.log(result);

    // TODO: if error, alert client in UI
  });

})

// TODO: don't console.log vote data in long term to protect user privacy

server.listen(3000, () => {
  console.log('listening on *:3000');
});