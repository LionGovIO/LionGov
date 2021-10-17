
let ControllerClass = require('../libs/ControllerClass');

module.exports = class privacyVoteQuery extends ControllerClass {
  // this function is privacy-first, does not reveal the full address in the query result
  _privacyVoteQuery = (data, callback) => {

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

    ///

    // TODO: pagination

    dynamoDB.query(params, function(err, data) {
      if (err) {
        console.log(err);
        // TODO: propagate error to client UI via callback
      } else {
        // console.log('userInfoLock query!');
        console.log(data); // successful response
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
              creationTime: item.CreationTime.S,
              IpfsAddress: (item.IpfsAddress ? item.IpfsAddress.S : '') //backward compatibility
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

  get = (req, res) => {
    // Retrieve the tag from our URL path
    this.debug('privacyvotequery!');
    this.debug(req.params);
    this.debug(req.query);

    if (req.query) {
      var voteClass = req.query.voteClass;
      var queryInput = {
        voteClass: voteClass
      };

      if (voteClass) {
        this._privacyVoteQuery(queryInput, function(err, output) {
          console.log('output!');
          console.log(output);

          res.json(output);
        });
      }
    }


    // res.send('privacyvotequery!')
  }
}
