// TODO: have a proposals database defining valid inputs; reject inputs that do not match what is defined in the proposal

let ControllerClass = require('../libs/ControllerClass');

module.exports = class submitVote extends ControllerClass {

  _submitVote = (data, callback) => {
    var creationTime = Date.now().toString();

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
        if (!voteWeightInfo) {
          callback({
            error: {
              msg: "Blockchain object empty! contact devs!"
            }
          }, null);
          return;
        }
        if (voteWeightInfo.error) {
          callback(voteWeightInfo, null);
          return;
        }

        var voteWeight = voteWeightInfo.voteWeight;

        // TODO: add vote version number, so if we adapt how votes are created, we can use if/else
        // on version for backward compatibility

        // TODO: consider signing something besides just the vote to prevent injection attacks
        // for example, if attacker steals signed vote, they could use that signed vote in another election
        // should sign something like voteId + voteClass + voteValue

        // DynamoDB reference on condition expressions: https://docs.aws.amazon.com/amazondynamodb/latest/developerguide/Expressions.OperatorsAndFunctions.html

        // TODO: need to verify wallet address is lowercase, otherwise reject it
        // TODO: trim inputs of whitespaces, or reject inputs with whitespace padding
        var conditionExpression = 'attribute_not_exists(VoteClass) AND attribute_not_exists(WalletAddress)';
        console.log('conditionExpression: ' + conditionExpression);

        // TODO: consider generating / storing a vote ID anyway, could be part of signature calculation
        // or instead of called vote ID, it can be some hash salt generated by the server, to be determined


        // Note, for the Votes table:
        // Partition key is VoteClass
        // Sort key is WalletAddress
        var params = {
          TableName: "Votes",
          Item: {
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
          ConditionExpression: conditionExpression
        };

        console.log('params!!!');
        console.log(params);

        dynamoDB.putItem(params, function(err, data) {
          if (err) {
            console.log(err);
            if (err.code == 'ConditionalCheckFailedException') {
              err.msg = 'Primary key is already in use';
            } else {
              err.msg = err.message;
            }

            err.class = "DynamoDB";
            callback({
              error: err
            }, null);

          } else {
            callback(null, data);
          }
        });
      });
    }
  }

  post = (req, res) => {

    var postData = req.body;
    //then work with your data

    console.log('postData!');
    console.log(postData);

    try {
      checksumAddress = ethers.utils.getAddress(postData.walletAddress); //EIP55
      if (!checksumAddress) {
        res.json({
          "error": "No address informed!"
        });
        return;
      }
    } catch (e) {
      res.json({
        "error": "Invalid Address!"
      });
      return;
    }

    // verifyMessage (Message , signature) -> return in EIP55 address

    if (checksumAddress != ethers.utils.verifyMessage(postData.voteValue, postData.signedVoteValue)) {
      res.json({
        "error": "Invalid signature!"
      });
      return;
    }


    // TODO: reject invalid post params
    // prevent bad data from being injected in database

    // TODO: make sure the signature on the voting data is deterministic
    // e.g. the wallet address lowercased/normalized with Web3.utils.toChecksumAddress

    this._submitVote(postData, function(err, result) {
      console.log('submitVote callback!');
      console.log(err);
      console.log(result);

      if (err) {
        res.json(err);
        return;
      } else {
        res.json({
          success: true
        });
        return;
      }
      // TODO: error handling in client
    });

  }
}
