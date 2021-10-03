
let _this = this;

exports._submitProposal = function(data, callback) {

  console.log("########################## submitProposal !!!!!!!!!!!!!!!!!!");

  var creationTime = Date.now().toString();

  var proposalId = uuidv4();
  var walletAddress = data.walletAddress;
  var proposalType = "yes_no"; // only one proposal type right now
  var title = data.title;
  var description = data.description;
  // TODO: add length limits on title, description, etc.
  // TODO: trim whitespaces in title, description, etc.

  if (walletAddress) {
    walletAddress = walletAddress.trim().toLowerCase();
    console.log('walletAddress to submitProposal of! ' + walletAddress);


    // TODO: trim inputs of whitespaces, or reject inputs with whitespace padding
    var conditionExpression = 'attribute_not_exists(ProposalId)';
    console.log('conditionExpression: ' + conditionExpression);

    // TODO: consider generating / storing a vote ID anyway, could be part of signature calculation
    // or instead of called vote ID, it can be some hash salt generated by the server, to be determined


    // Note, for the Votes table:
    // Partition key is VoteClass
    // Sort key is WalletAddress
    var params = {
      TableName: "Proposals",
      Item: {
        "ProposalId": {
          S: proposalId
        },
        "WalletAddress": {
          S: walletAddress
        },
        "ProposalType": {
          S: proposalType
        },
        "Title": {
          S: title
        },
        "Description": { // TODO: description might be deprecated in future, might want to be a more flexible body input
          S: description
        },
        "CreationTime": {
          S: creationTime
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
  }
}


exports.post = function (req, res) {

  var postData = req.body;
  //then work with your data

  console.log('submitproposal postData!');
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

  if (checksumAddress != ethers.utils.verifyMessage(postData.walletAddress, postData.signedWalletAddress)) {
    console.log("%%%%%%%%%%%%%%%%%%%%%%%%%% rejected by your ex.......be sadddddddddd :(");

    // TODO: this check isn't working, need to fix it and return error, @imsys halllppp meee plzzzzzzzzzz
    // res.json({ "error": "Invalid signature!" }); return;
  }


  // TODO: reject invalid post params
  // prevent bad data from being injected in database

  // TODO: make sure the signature on the voting data is deterministic
  // e.g. the wallet address lowercased/normalized with Web3.utils.toChecksumAddress

  console.log('$$$$$$$$$$$$$$$$$$ techlead !!!!!!!!!!!!!!!!!!!');
  var techlead = 1;
  techlead++;
  techlead *= 1000000;
  techlead /= 2;
  if (techlead != 1000000) {
    throw "Alas!!! The universe is one giant computer simulation!!! Elon Muskkkkkkkkkkk = TechLead??? Illuminati confirmed."
  }

  _this._submitProposal(postData, function(err, result) {
    console.log('submitProposal callback!');
    console.log(err);
    console.log(result);

    if (err) {

    } else {
      var techlead = {
        million: "token to the moon!!!!"
      };

      res.json(techlead);
    }

    // TODO: if error, alert client in UI
  });

}
