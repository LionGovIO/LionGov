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

// body-parser is deprecated, using below instead: https://stackoverflow.com/questions/66525078/bodyparser-is-deprecated
app.use(express.urlencoded({ extended: true }));
app.use(express.json()) // To parse the incoming requests with JSON payloads

app.get('/', (req, res) => {
    res.send('Hello World!')
});

// this function is privacy-first, does not reveal the full address in the query result
function privacyVoteQuery(data, callback) {
    var voteClass = data.voteClass;

    var params = {
        ExpressionAttributeValues: {
            ":v1": {
                S: voteClass
            }
        },
        KeyConditionExpression: "VoteClass = :v1",
        TableName: 'Votes',
        IndexName: 'VoteClass-CreationTime-index'
    };

    // TODO: pagination

    dynamoDB.query(params, function (err, data) {
        if (err) {
            console.log(err);
            // TODO: propagate error to client UI via callback
        } else {
            // console.log('userInfoLock query!');
            console.log(data);           // successful response
            console.log(JSON.stringify(data));

            // TODO: handle pagination
            // TODO: consider returning latest 50 votes, and return # of votes if possible
            // pagination in UI is a bonus feature, ok to show latest 50 votes for now

            var outputItems = [];
            var items = data['Items'];
            if (items && items.length >= 1) {
                for (var i = 0; i < items.length; i++) {
                    var item = items[0];
                    console.log(item);

                    // TODO: handle case where desired attributes in item are missing, probably throw an error via callback

                    var walletAddress = item.WalletAddress.S;

                    // based on how OpenSea obscures wallet in display in profile page
                    var obscuredWalletAddress = walletAddress.substring(0, 6) + '...' + walletAddress.substring(walletAddress.length - 4, walletAddress.length);

                    // do not return the VoteValue! ;)
                    var outputItem = {
                        voteClass: item.VoteClass.S,
                        obscuredWalletAddress: obscuredWalletAddress,
                        creationTime: item.CreationTime.S
                    }

                    console.log(outputItem);

                    outputItems.push(outputItem);
                }
            }

            callback(null, outputItems)

            /*
            var result = {};

            if (data['Items'] && data['Items'].length >= 1) {
                var item = data['Items'][0];
            }
            */

            // addResult(userResult);
        }
    });
}

// TODO: when you vote, refresh the table, your vote should show up as latest one

app.get('/privacyvotequery', function(req, res) {
    // Retrieve the tag from our URL path
    console.log('privacyvotequery!');
    console.log(req.params);
    console.log(req.query);

    if (req.query) {
        var voteClass = req.query.voteClass;
        var queryInput = {
            voteClass: voteClass
        };

        if (voteClass) {
            privacyVoteQuery(queryInput, function(err, outputItems) {
                var output = {
                    items: outputItems
                };

                console.log('output!');
                console.log(output);

                res.json(output);
            });
        }
    }


    // res.send('privacyvotequery!')
});

function submitVote(data, callback) {
    var creationTime = Date.now().toString();
    var voteId = uuidv4();
    var voteClass = data.voteClass;
    var voteValue = data.voteValue;
    var signedVoteValue = data.signedVoteValue;
    var walletAddress = data.walletAddress;

    // TODO: add vote version number, so if we adapt how votes are created, we can use if/else 
    // on version for backward compatibility

    // TODO: consider signing something besides just the vote to prevent injection attacks
    // for example, if attacker steals signed vote, they could use that signed vote in another election
    // should sign something like voteId + voteClass + voteValue

    // TODO: enforce vote only once right now. Reject votes from same wallet for the same vote class if vote
    // already exists in database.

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
            "SignedVoteValue": {
                S: signedVoteValue
            },
            "CreationTime": {
                S: creationTime
            },
            "WalletAddress": {
                S: walletAddress
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
    // prevent bad data from being injected in database

    // TODO: make sure the signature on the voting data is deterministic
    // e.g. the wallet address lowercased/normalized with Web3.utils.toChecksumAddress

    submitVote(postData, function (err, result) {
        console.log('submitVote callback!');
        console.log(err);
        console.log(result);

        // TODO: if error, alert client in UI
    });

})

// TODO: don't console.log vote data in long term to protect user privacy

server.listen(3000, () => {
    console.log('listening on *:3000');

    privacyVoteQuery({
        voteClass: 'matrix'
    }, () => {

    });
});