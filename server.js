const { v4: uuidv4 } = require('uuid');

const express = require('express');
const app = express();
const http = require('http');
const server = http.createServer(app);
const compression = require('compression');

// Compress all HTTP responses
// This compression should be the first use of app.use to guarantee compression is actually working
app.use(compression()); // TODO: add this compression to lionrun as well

var Web3 = require('web3');
var web3 = new Web3('https://polygon-rpc.com/');
const c = require('./public/blockchain/constants');
const blkchain = require('./public/blockchain/blockchain');
const Moralis = require('moralis/node');
web3.eth.defaultChain = 'matic';

const AWS = require("aws-sdk");
AWS.config.update({
    region: 'us-east-1'
});

var dynamoDB = new AWS.DynamoDB();

Moralis.initialize(process.env.MORALIS_APP_ID);

Moralis.serverURL = process.env.MORALIS_SERVER_URL;

/*
(async () => {
    var redisClient = null;
    Blkchain = new blkchain(redisClient, Moralis);

})();
*/

Blkchain = new blkchain(null, Moralis);


app.use(express.static('public'))

// body-parser is deprecated, using below instead: https://stackoverflow.com/questions/66525078/bodyparser-is-deprecated
app.use(express.urlencoded({ extended: true }));
app.use(express.json()) // To parse the incoming requests with JSON payloads

// var redisClient = null;
// var Blkchain = new blkchain(redisClient, Moralis);

app.get('/', (req, res) => {
    res.send('Hello World!')
});

// TODO: add filtering/validation on all the APIS. In particular, want to prevent database injection attacks
// TOOD: add API throttling (e.g. by IP address), there are various libraries for that
// TODO: add DDOS protection (e.g. AWS provides some services for this). We can do this after we add a load balancer.

app.get('/getvoteweight', (req, res) => {
    console.log('getvoteweight!');
    console.log(req.params);
    console.log(req.query);

    if (req.query) {
        var walletAddress = req.query.walletAddress;

        if (walletAddress) {
            walletAddress = walletAddress.trim().toLowerCase();
            console.log('walletAddress to get voting points of! ' + walletAddress);
            Blkchain.getVoteWeight(walletAddress, Date.now()).then(voteWeight => {
                console.log('voteWeight! ' + voteWeight);

                res.end(JSON.stringify(voteWeight));
            });
        }
    }
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
        ScanIndexForward: false,
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
                    var item = items[i];
                    console.log(item);

                    // TODO: handle case where desired attributes in item are missing, probably throw an error via callback

                    var walletAddress = item.WalletAddress.S;

                    // based on how OpenSea obscures wallet in display in profile page
                    var obscuredWalletAddress = walletAddress.substring(0, 6) + '...' + walletAddress.substring(walletAddress.length - 4, walletAddress.length);

                    // do not return the VoteValue! ;)
                    var outputItem = {
                        voteClass: item.VoteClass.S,
                        voteValue: item.VoteValue.S,
                        obscuredWalletAddress: obscuredWalletAddress,
                        voteWeight: item.VoteWeight.N,
                        creationTime: item.CreationTime.S
                    }

                    console.log(outputItem);

                    outputItems.push(outputItem);
                }
            }

            var output = {
                items: outputItems,
                count: data['Count'],
                scannedCount: data['ScannedCount']
            };

            callback(null, output)

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

app.get('/privacyvotequery', function (req, res) {
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
            privacyVoteQuery(queryInput, function (err, output) {
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

    console.log('voteClass: ' + voteClass);
    console.log('walletAddress: ' + walletAddress);


    if (walletAddress) {
        walletAddress = walletAddress.trim().toLowerCase();
        console.log('walletAddress to submit vote of and get voting points of! ' + walletAddress);

        // TODO: using Date.now() for now, but should use start date of proposal, at least that's the plan right now
        Blkchain.getVoteWeight(walletAddress, Date.now()).then(voteWeightInfo => {
            console.log('voteWeightInfo! ' + voteWeightInfo);
            if (voteWeightInfo) {
                console.log(voteWeightInfo);

                console.log('voteWeight! ' + voteWeightInfo.voteWeight);
            } else {
                return; // TODO: propogate as error instead of failing silently
            }

            var voteWeight = voteWeightInfo.voteWeight;

            // TODO: add vote version number, so if we adapt how votes are created, we can use if/else 
            // on version for backward compatibility

            // TODO: consider signing something besides just the vote to prevent injection attacks
            // for example, if attacker steals signed vote, they could use that signed vote in another election
            // should sign something like voteId + voteClass + voteValue

            // TODO: enforce vote only once right now. Reject votes from same wallet for the same vote class if vote
            // already exists in database.

            // DynamoDB reference on condition expressions: https://docs.aws.amazon.com/amazondynamodb/latest/developerguide/Expressions.OperatorsAndFunctions.html

            // TODO: need to verify wallet address is lowercase, otherwise reject it
            // TODO: trim inputs of whitespaces, or reject inputs with whitespace padding
            var conditionExpression = 'attribute_not_exists(VoteId) AND (NOT (VoteClass = :voteClass AND WalletAddress = :walletAddress))';
            console.log('conditionExpression: ' + conditionExpression);

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
                    "VoteWeight": {
                        N: voteWeight.toString()
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
                ConditionExpression: conditionExpression,
                ExpressionAttributeValues: {
                    ":voteClass": { "S": voteClass },
                    ":walletAddress": { "S": walletAddress }
                }
                // prevent someone overriding the vote
                // prevent someone from submitting a vote if they already submitted a vote for a give voteClass
            };

            console.log('params!!!');
            console.log(params);

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
        });
    }
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