// TODO: have a proposals database defining valid inputs; reject inputs that do not match what is defined in the proposal

let ControllerClass = require('../libs/ControllerClass');

const singleProposalQuery = new (require('./singleProposalQuery'))();

const ethers = require('ethers');

module.exports = class submitVote extends ControllerClass {

  post = (req, res) => {

    var data = req.body;
    let checksumAddress = null;
    //then work with your data

    this.debug('data!');
    this.debug(data);

    let optionId = data.voteValue;
    let optionText = data.optionText;

    try {
      checksumAddress = ethers.utils.getAddress(data.walletAddress); //EIP55
      if (!checksumAddress) {
        res.status(400);
        res.json({
          "error": {msg: "No address informed!"}
        });
        res.end();
        return;
      }
    } catch (e) {
      res.status(400);
      res.json({
        "error": {msg: "Invalid Address!"}
      });
      res.end();
      return;
    }

    let signature_valid_for = 5 * 60 * 1000; //5 min in milliseconds

    if (data.timestamp < (Date.now() - signature_valid_for)){
      res.status(400);
      res.json({
        "error": {msg: 'Signature expired! Try submitting again or checking your system clock.'}
      });
      res.end();
      return;
    }

    let message = 'Proposal id: ' + data.voteClass + '\n' +
                  'Proposal title: '+ data.proposalTitle + '\n' +
                  'Option: ' + data.optionText + '\n' +
                  'Timestamp: ' + data.timestamp;

    // verifyMessage (Message , signature) -> return in EIP55 address

    if (checksumAddress != ethers.utils.verifyMessage(message, data.signature)) {
      res.status(400);
      res.json({
        "error": {msg: "Invalid signature!"}
      });
      res.end();
      return;
    }

    // get the proposal data
    singleProposalQuery._singleProposalQuery(data.voteClass, function(Proposal){

      if(Proposal.error){
        res.status(400);
        res.json({
          "error": {msg: "Invalid proposal id!"}
        });
        res.end();
        return;
      }

      if (Proposal.ProposalType == 'yes_no'){
        if (optionId != optionText ||
            (optionId != 'yes' && optionId != 'no')){
              res.status(400);
              res.json({
                "error": {msg: "Invalid option!"}
              });
              res.end();
              return;
        }
      } else {
        if(Proposal.Options.length < optionId ||
           Proposal.Options[optionId] != optionText){
             res.status(400);
             res.json({
               "error": {msg: "Inconsistent option data!"}
             });
             res.end();
             return;
        }

      }

      if(Proposal.EndTimestamp &&
         parseInt(Proposal.EndTimestamp) < Date.now()){
           res.status(400);
           res.json({
             "error": {msg: "Proposal voting ended!"}
           });
           res.end();
           return;
      }


      // TODO: reject invalid post params
      // prevent bad data from being injected in database

      // TODO: make sure the signature on the voting data is deterministic
      // e.g. the wallet address lowercased/normalized with Web3.utils.toChecksumAddress

      let walletAddress = data.walletAddress.trim().toLowerCase();
      debug('walletAddress to submit vote of and get voting points of! ' + walletAddress);

      Blkchain.getVoteWeight(walletAddress, parseInt(Proposal.CreationTime)).then(voteWeightInfo => {
        debug('voteWeightInfo! ' + voteWeightInfo);
        if (!voteWeightInfo) {
          res.status(500);
          res.json({
            "error": {msg: "Blockchain object empty! contact devs!"}
          });
          res.end();
          return;
        }
        if (voteWeightInfo.error) {
          res.status(500);
          res.json(voteWeightInfo);
          res.end();
          return;
        }

        var voteWeight = voteWeightInfo.voteWeight;

        if(voteWeight < 7){
          let date_options = {year:'numeric', month:'short', day:'numeric', hour12:false, hour:'numeric', minute:'numeric', timeZone:'UTC', timeZoneName:'short'};
          res.status(403);
          res.json({
            "error": {msg: "You need to have a point weight of 7 or higher to vote.\n" +
                           "This proposal was created on " +
                           (new Date(parseInt(Proposal.CreationTime))).toLocaleString('en-US', date_options) +
                           "\nYour point weight for that time is: " + voteWeight }
          });
          res.end();
          return;
        }

        let creationTime = Date.now();
        let lastIpfsAddress = null;

        dynamoDB.query({
          TableName: "Votes",
          Limit: 1,
          KeyConditionExpression: "VoteClass = :VoteClass AND CreationTime < :CreationTime",
          ExpressionAttributeValues: {
            ':VoteClass': { S: data.voteClass },
            ':CreationTime': { S: creationTime.toString() }
          },
          IndexName: 'VoteClass-CreationTime-index'
        }, async (err, lastvote) => {
          if (err) {
            debug(err);
            err.msg = err.message;
            res.status(500);
            res.json({error: err});
            res.end();
            return;

          } else {
            debug('dynamo query result');
            debug(lastvote);
            if(lastvote.Count > 0 &&
               lastvote.Items[0].IpfsAddress &&
               lastvote.Items[0].IpfsAddress.S) {
              debug('The last one has an IpfsAddress')
              lastIpfsAddress = lastvote.Items[0].IpfsAddress.S;
            }

            let ipfsData = {
              Message: message,
              VoteWeight: voteWeight,
              TokenBalance: voteWeightInfo.token_balance,
              WalletAddress: checksumAddress,
              MessageSignature: data.signature,
              PreviusVoteIPFS: lastIpfsAddress
            };

            let ipfsObj = null;

            try {
              ipfsObj = await ipfs.add(JSON.stringify(ipfsData))
              debug('IPFS cid: ' + ipfsObj.cid)
            }
            catch (e) {
              console.error(e)
              res.status(500);
              res.json({
                "error": {msg: "IPFS error!"}
              });
              res.end();
              return;
            }

            // TODO: add vote version number, so if we adapt how votes are created, we can use if/else
            // on version for backward compatibility

            // DynamoDB reference on condition expressions: https://docs.aws.amazon.com/amazondynamodb/latest/developerguide/Expressions.OperatorsAndFunctions.html

            // TODO: need to verify wallet address is lowercase, otherwise reject it
            // TODO: trim inputs of whitespaces, or reject inputs with whitespace padding
            var conditionExpression = 'attribute_not_exists(VoteClass) AND attribute_not_exists(WalletAddress)';
            debug('conditionExpression: ' + conditionExpression);

            // TODO: consider generating / storing a vote ID anyway, could be part of signature calculation
            // or instead of called vote ID, it can be some hash salt generated by the server, to be determined

            // Note, for the Votes table:
            // Partition key is VoteClass
            // Sort key is WalletAddress
            var params = {
              TableName: "Votes",
              Item: {
                "VoteClass": {
                  S: data.voteClass
                },
                "VoteValue": {
                  S: optionId
                },
                "VoteWeight": {
                  N: voteWeight.toString()
                },
                "TokenAmount": {
                  N: voteWeightInfo.token_balance.toString()
                },
                "SignedVoteValue": {
                  S: data.signature
                },
                "CreationTime": {
                  S: creationTime.toString()
                },
                "SignatureTime": {
                  S: data.timestamp.toString()
                },
                "WalletAddress": {
                  S: walletAddress
                },
                "IpfsAddress": {
                  S: ipfsObj.cid.toString()
                },
              },
              ConditionExpression: conditionExpression
            };

            debug('params!!!');
            debug(params);

            dynamoDB.putItem(params, function(err, data) {
              if (err) {
                console.log(err);
                if (err.code == 'ConditionalCheckFailedException') {
                  err.msg = 'You have already voted!';
                  res.status(403);
                } else {
                  res.status(500);
                  err.msg = err.message;
                }

                res.json({error: err});
                res.end();
                return;

              } else {
                res.json({success: true});
                res.end();
                return;
              }
            });

          }
        });
      });


    });

  }
}
